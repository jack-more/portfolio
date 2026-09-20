"""Halftone scissor cut-out. usage: cutout.py src mask|auto out [scale] [cell]"""
import sys, math, numpy as np
from PIL import Image, ImageFilter, ImageOps
src_p, mask_p, out_p = sys.argv[1:4]
S = float(sys.argv[4]) if len(sys.argv) > 4 else 2
cell = float(sys.argv[5]) if len(sys.argv) > 5 else 9
src = Image.open(src_p).convert('RGB')
src = src.resize((int(src.width*S), int(src.height*S)), Image.LANCZOS)
w, h = src.size
mask = Image.open(mask_p).convert('L').resize((w, h), Image.LANCZOS)
mask = mask.filter(ImageFilter.GaussianBlur(max(1, S))).point(lambda v: 255 if v > 128 else 0)
g = ImageOps.autocontrast(src.convert('L'), cutoff=1, mask=mask).filter(ImageFilter.GaussianBlur(1.2))
ga = np.asarray(g).astype(np.float32)/255
ga = np.clip((ga-0.04)/0.92, 0, 1) ** 0.85
ang = math.radians(45); ca, sa = math.cos(ang), math.sin(ang)
yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
u = (xx*ca+yy*sa)/cell; v = (-xx*sa+yy*ca)/cell
dist = np.sqrt((u-np.floor(u)-.5)**2 + (v-np.floor(v)-.5)**2)
edge = np.clip((np.sqrt(1-ga)*0.72-dist)*cell*0.9+0.5, 0, 1)
ht = np.minimum((255*(1-edge*0.93)+8).clip(0, 255), 244).astype(np.uint8)
htim = Image.fromarray(ht).convert('RGB')
r = int(15*S) | 1
big = mask.filter(ImageFilter.MaxFilter(r)).filter(ImageFilter.GaussianBlur(3*S)).point(lambda v: 255 if v > 110 else 0)
cut = Image.new('RGB', (w, h), (250, 248, 243)); cut.paste(htim, (0, 0), mask)
out = Image.new('RGBA', (w, h), (0, 0, 0, 0)); out.paste(cut, (0, 0), big)
out.crop(big.getbbox()).save(out_p); print(out_p, out.crop(big.getbbox()).size)

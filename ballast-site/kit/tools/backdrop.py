"""Composite a white-background portrait onto a plain studio backdrop. usage: backdrop.py portrait mask out centerhex edgehex"""
import sys, numpy as np
from PIL import Image, ImageFilter
src, maskp, outp, chex, ehex = sys.argv[1:6]
rgb = lambda h: np.array([int(h[i:i+2],16) for i in (0,2,4)], np.float32)
im = Image.open(src).convert('RGB'); w, h = im.size
side = min(w, h); x0 = (w-side)//2
im = im.crop((x0, 0, x0+side, side))
m = Image.open(maskp).convert('L').resize((w, h)).crop((x0, 0, x0+side, side))
A = np.asarray(im).astype(np.float32)
a = np.asarray(m.filter(ImageFilter.GaussianBlur(1.2))).astype(np.float32)/255
core = np.asarray(m.point(lambda v: 255 if v > 200 else 0).filter(ImageFilter.MinFilter(9)).filter(ImageFilter.GaussianBlur(2.5))).astype(np.float32)/255
yy, xx = np.mgrid[0:side, 0:side].astype(np.float32)
r = np.sqrt(((xx-side*0.5)/(side*0.75))**2 + ((yy-side*0.40)/(side*0.85))**2).clip(0, 1)
t = (r**1.6)[..., None]
bg = rgb(chex)*(1-t) + rgb(ehex)*t
bg += np.random.default_rng(3).normal(0, 1.2, bg.shape)          # kills banding
# hair/skin edge: multiply removes the white contamination. shirt edge: plain alpha.
mult = bg*(A/255.0)
plain = A*a[..., None] + bg*(1-a[..., None])
edge = mult*a[..., None]**0.5 + bg*(1-a[..., None]**0.5)
upper = np.clip((side*0.62 - yy)/(side*0.06), 0, 1)[..., None]       # 1 above the collar, 0 on the shirt
rim = edge*upper + plain*(1-upper)
out = A*core[..., None] + rim*(1-core[..., None])
Image.fromarray(out.clip(0, 255).astype(np.uint8)).save(outp, quality=95); print(outp, side)

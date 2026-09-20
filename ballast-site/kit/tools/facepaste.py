"""Paste the ORIGINAL face pixels over an edited image. usage: facepaste.py original edited out [x0 y0 x1 y1 of face box in original, fractions]"""
import sys, numpy as np
from PIL import Image, ImageFilter, ImageDraw
op, ep, outp = sys.argv[1:4]
box = [float(v) for v in sys.argv[4:8]] if len(sys.argv) >= 8 else [0.36, 0.10, 0.66, 0.60]
O = Image.open(op).convert('RGB'); E = Image.open(ep).convert('RGB')
ow, oh = O.size
fx0, fy0, fx1, fy1 = int(box[0]*ow), int(box[1]*oh), int(box[2]*ow), int(box[3]*oh)
face = O.crop((fx0, fy0, fx1, fy1))
# coarse-to-fine search for scale + offset of the face crop inside the edit
def gray(im, w): 
    r = w/im.width; return np.asarray(im.convert('L').resize((w, max(1,int(im.height*r))), Image.BILINEAR)).astype(np.float32), r
Eg, er = gray(E, 384)
best = (1e18, None)
def ell(tw, th):
    yy, xx = np.mgrid[0:th, 0:tw].astype(np.float32)
    return ((((xx-tw/2)/(tw*0.36))**2 + ((yy-th*0.56)/(th*0.40))**2) <= 1).astype(np.float32)
for s_ in np.arange(0.8, 1.35, 0.01):
    k = (E.height/oh)*s_
    tw = int(face.width*k*er); th = int(face.height*k*er)
    if tw < 20 or th < 20 or tw >= Eg.shape[1] or th >= Eg.shape[0]: continue
    T = np.asarray(face.convert('L').resize((tw, th), Image.BILINEAR)).astype(np.float32)
    Wm = ell(tw, th); n = Wm.sum(); T = (T - (T*Wm).sum()/n)*Wm
    H, W = Eg.shape
    for y in range(0, H-th, 2):
        for x in range(0, W-tw, 2):
            P = Eg[y:y+th, x:x+tw]; Pm = (P*Wm).sum()/n
            d = ((((P-Pm)*Wm) - T)**2).sum()/n
            if d < best[0]: best = (d, (k, x/er, y/er))
k, X, Y = best[1]
print('scale', round(k,4), 'offset', round(X), round(Y), 'err', round(best[0],2))
# work at the ORIGINAL's native resolution so the real face is never upscaled
E = E.resize((int(E.width/k), int(E.height/k)), Image.LANCZOS); X, Y, k = X/k, Y/k, 1.0
# place the whole original so that its face box lands at X,Y
Ow = O.resize((int(ow*k), int(oh*k)), Image.LANCZOS)
ox, oy = int(X - fx0*k), int(Y - fy0*k)
# feathered inner-face ellipse
m = Image.new('L', E.size, 0); d = ImageDraw.Draw(m)
cx0, cy0, cx1, cy1 = X, Y, X+(fx1-fx0)*k, Y+(fy1-fy0)*k
padx, pady = (cx1-cx0)*0.10, (cy1-cy0)*0.06
d.ellipse((cx0+padx, cy0+pady, cx1-padx, cy1-pady*0.2), fill=255)
m = m.filter(ImageFilter.GaussianBlur((cx1-cx0)*0.05))
# tone-match original to the edit inside the mask
layer = Image.new('RGB', E.size); layer.paste(Ow, (ox, oy))
A = np.asarray(layer).astype(np.float32); B = np.asarray(E).astype(np.float32); Mk = np.asarray(m).astype(np.float32)/255
core = Mk > 0.6
for c in range(3):
    a, b = A[...,c][core], B[...,c][core]
    A[...,c] = A[...,c] + (b.mean()-a.mean())*0.5
out = B*(1-Mk[...,None]) + np.clip(A,0,255)*Mk[...,None]
Image.fromarray(out.astype(np.uint8)).save(outp); print('saved', outp)

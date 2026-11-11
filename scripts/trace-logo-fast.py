"""Vectoriza el logo con contornos de OpenCV suavizados en curvas (rápido).
Uso: python3 scripts/trace-logo-fast.py  -> src/components/fox-paths.json"""
import json
import numpy as np
import cv2
from PIL import Image

SCALE = 4
im = Image.open("assets-src/logo-zorro.png").convert("RGBA")
im = im.resize((im.width * SCALE, im.height * SCALE), Image.LANCZOS)
a = np.asarray(im).astype(int)
r, g, b, al = a[..., 0], a[..., 1], a[..., 2], a[..., 3]
opaque = al > 128
def near(c, tol=70):
    return opaque & (np.abs(r - c[0]) + np.abs(g - c[1]) + np.abs(b - c[2]) < tol * 3)
navy = near((0x20, 0x50, 0x8E))
sky = near((0x5B, 0xC4, 0xE2))
def fill_holes(mask):
    m = (mask * 255).astype(np.uint8)
    h, w = m.shape
    flood = m.copy()
    ff = np.zeros((h + 2, w + 2), np.uint8)
    cv2.floodFill(flood, ff, (0, 0), 255)
    return mask | (flood == 0)
inside = fill_holes(opaque)
# El morro y el pecho blancos son "fondo" abierto en el original: se cierran con una
# operación morfológica y se conservan solo las zonas interiores grandes.
k = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (41 * SCALE, 41 * SCALE))
closed = cv2.morphologyEx((opaque * 255).astype(np.uint8), cv2.MORPH_CLOSE, k) > 0
cand = ((fill_holes(closed) | inside) & ~opaque).astype(np.uint8)
cand = cv2.morphologyEx(cand, cv2.MORPH_OPEN, np.ones((3 * SCALE, 3 * SCALE), np.uint8))
n, lab, stats, _ = cv2.connectedComponentsWithStats(cand)
white = np.zeros_like(opaque)
for i in range(1, n):
    if stats[i, cv2.CC_STAT_AREA] > 220 * SCALE * SCALE:
        white |= lab == i
inside = inside | white
# el blanco va debajo del azul: se ensancha un poco para tapar costuras
white = cv2.dilate(white.astype(np.uint8), np.ones((2 * SCALE + 1, 2 * SCALE + 1), np.uint8)) > 0
white &= inside | cv2.dilate(opaque.astype(np.uint8), np.ones((3, 3), np.uint8)) > 0

def smooth(pts, k=5):
    # media móvil circular para quitar el escalonado
    n = len(pts)
    if n < 2 * k + 1:
        return pts
    ext = np.concatenate([pts[-k:], pts, pts[:k]])
    ker = np.ones(2 * k + 1) / (2 * k + 1)
    return np.stack([np.convolve(ext[:, i], ker, mode="valid") for i in range(2)], axis=1)

def trace(mask):
    m = (mask * 255).astype(np.uint8)
    m = cv2.GaussianBlur(m, (5, 5), 0)
    _, m = cv2.threshold(m, 127, 255, cv2.THRESH_BINARY)
    contours, _ = cv2.findContours(m, cv2.RETR_CCOMP, cv2.CHAIN_APPROX_NONE)
    d = []
    for c in contours:
        if cv2.contourArea(c) < 60 * SCALE:
            continue
        pts = smooth(c[:, 0, :].astype(float))
        approx = cv2.approxPolyDP(pts.astype(np.float32).reshape(-1, 1, 2), 0.9, True)[:, 0, :] / SCALE
        d.append("M" + "L".join(f"{x:.1f} {y:.1f}" for x, y in approx) + "Z")
    return "".join(d)

ys, xs = np.where(inside)
pad = 6
box = [xs.min() / SCALE - pad, ys.min() / SCALE - pad, (xs.max() - xs.min()) / SCALE + 2 * pad, (ys.max() - ys.min()) / SCALE + 2 * pad]
out = {"viewBox": " ".join(f"{v:.0f}" for v in box), "navy": trace(navy), "sky": trace(sky), "white": trace(white)}
json.dump(out, open("src/components/fox-paths.json", "w"))
print(out["viewBox"], {k: len(v) for k, v in out.items()})

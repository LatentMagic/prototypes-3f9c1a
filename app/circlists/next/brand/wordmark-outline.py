#!/usr/bin/env python
"""Outline 'Circlists' from Inter (instanced to Bold 700) into a font-independent SVG.
The first 'i' is drawn dotless; a real green vector tittle is laid exactly over its stem,
matched in size + height to the native i-dot. All letters are true outlines (no font dep)."""
import os
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.recordingPen import DecomposingRecordingPen

SRC = "/Users/josephmanghan/Repos/LatentMagic/businessops-coordination/public-sites/apps/latentpulse-marketing/dist/_astro/inter-latin-wght-normal.Dx4kXJAl.woff2"
BP = "/Users/josephmanghan/Repos/LatentMagic/businessops-coordination/latentmagic-business-ops/work/ops/biz-7-company-product-naming/_outputs/brand-pack"
OUT = os.environ.get("WM_OUT", BP + "/circlists-wordmark.svg")
WORD = "Circlists"
INK = os.environ.get("WM_INK", "#0A0A0A")
GREEN = "#047857"
TRACK_EM, PAD_EM = -0.01, 0.06

f = TTFont(SRC)
instantiateVariableFont(f, {"wght": 700}, inplace=True)
upm = f["head"].unitsPerEm
cmap = f["cmap"].getcmap(3, 1).cmap
gset = f.getGlyphSet()
hmtx = f["hmtx"]
track = TRACK_EM * upm
DOTLESS = cmap[0x131]

def gbounds(gn, xoff=0.0):
    bp = BoundsPen(gset); gset[gn].draw(bp)
    if not bp.bounds: return None
    x0, y0, x1, y1 = bp.bounds
    return x0 + xoff, y0, x1 + xoff, y1

def contours(gn):
    rp = DecomposingRecordingPen(gset); gset[gn].draw(rp)
    cs, cur = [], []
    for cmd, pts in rp.value:
        if cmd == "moveTo":
            if cur: cs.append(cur)
            cur = [pts[0]]
        elif cmd in ("lineTo", "qCurveTo", "curveTo"):
            cur += [p for p in pts if p]
        elif cmd == "closePath":
            if cur: cs.append(cur); cur = []
    if cur: cs.append(cur)
    return cs

def cbbox(pts):
    xs = [p[0] for p in pts]; ys = [p[1] for p in pts]
    return min(xs), min(ys), max(xs), max(ys)

# tittle geometry MEASURED off the design reference (a raised dot, well above the stem):
#   centre = 1.18 x capHeight above baseline ; diameter = 0.25 x capHeight
CAP = f["OS/2"].sCapHeight
TITTLE_CY_OVER_CAP = 1.18
TITTLE_DIA_OVER_CAP = 0.25
dot_cy = TITTLE_CY_OVER_CAP * CAP
dot_r = TITTLE_DIA_OVER_CAP * CAP / 2

# dotless-i stem centre within its own advance
sx0, _, sx1, _ = gbounds(DOTLESS)
stem_cx = (sx0 + sx1) / 2

# lay out the word; the SECOND 'i' (in "lists") gets the green tittle over a dotless stem;
# the first 'i' keeps its native black dot. (Matches the design reference.)
GREEN_I = 2                       # 1-indexed occurrence of 'i' that gets the tittle
glyphs, x, icount = [], 0.0, 0
green = None
gx0 = gy0 = 1e9; gx1 = gy1 = -1e9
for ch in WORD:
    if ch == "i": icount += 1
    dot_here = (ch == "i" and icount == GREEN_I)
    gn = DOTLESS if dot_here else cmap[ord(ch)]
    pen = SVGPathPen(gset); gset[gn].draw(pen)
    glyphs.append((pen.getCommands(), x))
    b = gbounds(gn, x)
    if b:
        gx0, gy0 = min(gx0, b[0]), min(gy0, b[1])
        gx1, gy1 = max(gx1, b[2]), max(gy1, b[3])
    if dot_here:
        green = (x + stem_cx, dot_cy, dot_r)
    x += hmtx[gn][0] + track

tcx, tcy, tr = green
gx0, gx1 = min(gx0, tcx - tr), max(gx1, tcx + tr)
gy0, gy1 = min(gy0, tcy - tr), max(gy1, tcy + tr)

pad = PAD_EM * upm
gx0 -= pad; gy0 -= pad; gx1 += pad; gy1 += pad
W, H = gx1 - gx0, gy1 - gy0
mat = f"matrix(1 0 0 -1 {-gx0:.2f} {gy1:.2f})"   # font(y-up) -> svg(y-down)
paths = "\n".join(
    f'      <path transform="translate({xo:.2f} 0)" d="{cmds}"/>' for cmds, xo in glyphs)

svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W:.2f} {H:.2f}" role="img" aria-label="Circlists">
  <title>Circlists</title>
  <g transform="{mat}">
    <g fill="{INK}">
{paths}
    </g>
    <circle cx="{tcx:.2f}" cy="{tcy:.2f}" r="{tr:.2f}" fill="{GREEN}"/>
  </g>
</svg>
'''
os.makedirs(os.path.dirname(OUT), exist_ok=True)
open(OUT, "w").write(svg)
cap = f["OS/2"].sCapHeight
print("wrote", OUT)
print(f"viewBox 0 0 {W:.1f} {H:.1f}  aspect {W/H:.3f}")
print(f"tittle cx={tcx:.1f} cy={tcy:.1f} r={tr:.1f}  dot/cap={2*tr/cap:.3f}  dot_cy/cap={tcy/cap:.3f}")

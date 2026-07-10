#!/usr/bin/env python3
"""Compose the Circlists lockup (mark + wordmark) deterministically into a single SVG.

The mark is placed at 1.5x the wordmark cap-height, vertically centred on the cap-midpoint
(parsed from the wordmark's own baseline transform — no eyeballing), with a fixed gap.
Font-independent; regenerate any time the mark or wordmark changes.

Usage:  python build_lockup.py [unreversed|reversed|both]   (default: both)
  unreversed -> circlists-lockup.svg           (ink wordmark, for light grounds)
  reversed   -> circlists-lockup-reversed.svg  (cream wordmark, for dark grounds)

build_board.py imports compose() so the board and the shippable SVGs are ONE composition."""
import os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
ASSETS = os.path.join(HERE, os.pardir, "assets")   # reads the mark/wordmark SVGs from, and writes the lockups to, ../assets
CAP = 1490.0           # Inter cap-height, in the wordmark's font units
MARK_CAP_RATIO = 1.5   # mark halo diameter as a multiple of cap-height (matches in-app)
GAP_CAP_RATIO = 0.40   # gap (mark box edge -> wordmark) as a multiple of cap-height
HALO_FRAC = 45.0 / 48.0  # halo diameter / mark viewBox

def _load(fn):
    s = open(os.path.join(ASSETS, fn)).read()
    vb = re.search(r'viewBox="([^"]+)"', s).group(1)
    inner = re.sub(r'(?s)^.*?<svg[^>]*>', '', s, count=1)
    inner = re.sub(r'(?s)</svg>\s*$', '', inner)
    inner = re.sub(r'(?s)<title>.*?</title>', '', inner)
    return vb, inner.strip()

def compose(variant):
    """Return (viewBox, inner_svg) for the composed lockup. variant: 'reversed'|'unreversed'."""
    if variant not in ('reversed', 'unreversed'):
        raise ValueError("variant must be 'reversed' or 'unreversed'")
    mark_vb, mark_inner = _load('circlists-mark.svg')
    wm_file = 'circlists-wordmark-reversed.svg' if variant == 'reversed' else 'circlists-wordmark.svg'
    wm_vb, wm_inner = _load(wm_file)
    _, _, MW, _ = map(float, mark_vb.split())
    _, _, WW, WH = map(float, wm_vb.split())
    ty = float(re.search(r'matrix\(1 0 0 -1 [-\d.]+ ([-\d.]+)\)', wm_inner).group(1))  # baseline svg-y
    cap_mid = ty - CAP / 2.0
    s = (MARK_CAP_RATIO * CAP) / (HALO_FRAC * MW)   # scale so halo diameter = ratio x cap
    mark_box = MW * s
    x_wm = mark_box + GAP_CAP_RATIO * CAP
    mark_y = cap_mid - mark_box / 2.0
    dy = -min(0.0, mark_y)                          # shift so nothing is above y=0
    W = x_wm + WW
    H = max(WH, mark_y + mark_box) + dy
    inner = (f'<g transform="translate(0 {mark_y + dy:.2f}) scale({s:.4f})">{mark_inner}</g>'
             f'<g transform="translate({x_wm:.2f} {dy:.2f})">{wm_inner}</g>')
    return f"0 0 {W:.2f} {H:.2f}", inner

def svg(variant):
    vb, inner = compose(variant)
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" role="img" aria-label="Circlists">\n'
            f'  <title>Circlists lockup</title>\n  {inner}\n</svg>\n')

if __name__ == '__main__':
    arg = sys.argv[1] if len(sys.argv) > 1 else 'both'
    for v in (['unreversed', 'reversed'] if arg == 'both' else [arg]):
        out = 'circlists-lockup-reversed.svg' if v == 'reversed' else 'circlists-lockup.svg'
        open(os.path.join(ASSETS, out), 'w').write(svg(v))
        print("wrote", out)

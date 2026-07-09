#!/usr/bin/env python3
"""Bundle the Circlists brand SVGs into ONE self-contained board (circlists-brand.html).

The SVGs are the source of truth for the MARKS. This inlines them (as <symbol>s, referenced
by <use>) so the board is a generated artifact — never hand-edited, can't drift. Re-run after
any SVG change:  python3 build_board.py
Stdlib only; reads its sibling SVGs; writes circlists-brand.html next to itself.

SOURCE OF TRUTH FOR VALUES = circlists-brand.md. The palette hexes + type line in the HTML
template below are DUPLICATED from that spec (a deliberate call — four hexes aren't worth a
token-generator). If you change a colour or the type spec, update it in BOTH places:
here AND circlists-brand.md. The marks are not duplicated — they come from the SVGs.

One mark everywhere: the favicon is the mark itself (opaque sage halo → reads at 16px on
any tab), so there is no separate card / tile asset to maintain."""
import os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import build_lockup   # deterministic mark+wordmark composition (also emits circlists-lockup*.svg)

def load(fn):
    s = open(os.path.join(HERE, fn)).read()
    vb = re.search(r'viewBox="([^"]+)"', s).group(1)
    inner = re.sub(r'(?s)^.*?<svg[^>]*>', '', s, count=1)
    inner = re.sub(r'(?s)</svg>\s*$', '', inner)
    inner = re.sub(r'(?s)<title>.*?</title>', '', inner)   # drop tooltips
    return vb, inner.strip()

A = {k: load(f) for k, f in {
    'wm':    'circlists-wordmark.svg',
    'wmRev': 'circlists-wordmark-reversed.svg',
    'mark':  'circlists-mark.svg',
}.items()}

symbols = "\n".join(f'<symbol id="s-{k}">{v[1]}</symbol>' for k, v in A.items())

def use(k, h):
    _, _, w, hh = map(float, A[k][0].split())
    return f'<svg class="asset" viewBox="{A[k][0]}" width="{h*w/hh:.1f}" height="{h}"><use href="#s-{k}"/></svg>'

def tab(dark, size=16):
    bg = '#2b2b28' if dark else '#e9e9e4'
    fg = '#e6e6e2' if dark else '#3a3a37'
    return (f'<span class="tab" style="background:{bg};color:{fg}">'
            f'{use("mark", size)}<span>Circlists</span></span>')

def lockup(variant, h):
    vb, inner = build_lockup.compose(variant)
    _, _, w, hh = map(float, vb.split())
    return f'<svg class="asset" viewBox="{vb}" width="{h*w/hh:.1f}" height="{h}">{inner}</svg>'

html = f"""<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Circlists — Brand</title>
<style>
  :root {{ --ink:#0a0a0a; --green:#047857; --cream:#fafaf7; --sage:#8bbfad; }}
  * {{ box-sizing:border-box; }}
  body {{ margin:0; background:var(--cream); color:var(--ink);
         font-family:'Inter',-apple-system,system-ui,sans-serif; }}
  .mono {{ font-family:'JetBrains Mono',ui-monospace,Menlo,monospace; }}
  section {{ max-width:900px; margin:0 auto; padding:64px 48px; }}
  section + section {{ border-top:1px solid #e8e8e4; }}
  .label {{ font:600 11px/1 'JetBrains Mono',ui-monospace,monospace;
            letter-spacing:.16em; text-transform:uppercase; color:#a3a3a3; margin-bottom:28px; }}
  .asset {{ display:block; }}
  .rowb {{ display:flex; align-items:flex-end; gap:40px; flex-wrap:wrap; }}
  figure {{ margin:0; text-align:center; }}
  figcaption {{ margin-top:12px; font:11px/1 'JetBrains Mono',monospace; color:#a3a3a3; }}
  .lockup {{ display:flex; align-items:center; gap:22px; }}
  .panel {{ padding:40px 44px; border-radius:16px; }}
  .light {{ background:#ffffff; border:1px solid #ededed; }}
  .dark  {{ background:#161614; }}
  .dark .label {{ color:#6b6b68; }}
  .dark figcaption {{ color:#7a7a76; }}
  .two {{ display:grid; grid-template-columns:1fr 1fr; gap:24px; }}
  .tabbar {{ display:flex; gap:8px; padding:10px; border-radius:12px 12px 0 0; }}
  .tab {{ display:inline-flex; align-items:center; gap:8px; padding:7px 14px 9px;
          border-radius:9px 9px 0 0; font:600 12px/1 'Inter',sans-serif; }}
  .tab svg {{ flex:0 0 auto; }}
  .swatches {{ display:flex; gap:20px; flex-wrap:wrap; }}
  .sw {{ display:flex; flex-direction:column; gap:8px; }}
  .chip {{ width:120px; height:64px; border-radius:10px; border:1px solid #0000000f; }}
  .sw .mono {{ font-size:11px; color:#525252; }}
  .sw b {{ color:var(--ink); font-weight:600; }}
  p.note {{ font:13px/1.6 'Inter',sans-serif; color:#525252; max-width:60ch; }}
</style></head>
<body>
<svg width="0" height="0" style="position:absolute" aria-hidden="true">{symbols}</svg>

<section>
  <div class="label">Lockup — one composition (build_lockup.py → circlists-lockup.svg)</div>
  <div class="two">
    <div class="panel light">{lockup('unreversed',64)}</div>
    <div class="panel dark">{lockup('reversed',64)}</div>
  </div>
  <p class="note">Mark + wordmark composed deterministically — mark at 1.5&times;cap, centred on the
  wordmark's cap-midpoint. Shipped as <b>circlists-lockup.svg</b> (ink) and
  <b>circlists-lockup-reversed.svg</b> (cream) for apps + sites to drop in.</p>
</section>

<section>
  <div class="label">Wordmark — on light</div>
  <div class="rowb">{use('wm',96)}{use('wm',40)}{use('wm',22)}</div>
  <p class="note">Outlined vector — font-independent. Green tittle on the second&nbsp;i,
  ⌀&nbsp;0.25&times;cap, raised to 1.18&times;cap above the baseline.</p>
</section>

<section class="dark" style="max-width:none;margin:0;padding:0;">
 <div style="max-width:900px;margin:0 auto;padding:64px 48px;">
  <div class="label">Wordmark — reversed, on dark</div>
  <div class="rowb">{use('wmRev',96)}{use('wmRev',40)}{use('wmRev',22)}</div>
 </div>
</section>

<section>
  <div class="label">The mark — at sizes (one asset, every context)</div>
  <div class="two">
    <div class="panel light"><div class="rowb">{use('mark',96)}{use('mark',48)}{use('mark',32)}{use('mark',16)}</div></div>
    <div class="panel dark"><div class="rowb">{use('mark',96)}{use('mark',48)}{use('mark',32)}{use('mark',16)}</div></div>
  </div>
  <p class="note">Opaque sage halo &middot; green disc &middot; thin white ring. The opaque halo
  reads at every size on any background — so the same mark serves app, lockup, and favicon.</p>
</section>

<section>
  <div class="label">Favicon — the mark, in tabs</div>
  <div class="two">
    <div class="tabbar" style="background:#f3f3ef">{tab(False)}{tab(False)}</div>
    <div class="tabbar" style="background:#1f1f1d">{tab(True)}{tab(True)}</div>
  </div>
  <p class="note">No card, no tile — the favicon <b>is</b> the mark. One asset everywhere: nothing
  to keep in sync, nothing to drift.</p>
</section>

<section>
  <div class="label">Palette</div>
  <div class="swatches">
    <div class="sw"><div class="chip" style="background:#047857"></div><span class="mono">Pulse Green<br><b>#047857</b> · disc / brand</span></div>
    <div class="sw"><div class="chip" style="background:#8bbfad"></div><span class="mono">Sage<br><b>#8BBFAD</b> · the halo (opaque)</span></div>
    <div class="sw"><div class="chip" style="background:#0a0a0a"></div><span class="mono">Ink<br><b>#0A0A0A</b> · wordmark / text</span></div>
    <div class="sw"><div class="chip" style="background:#fafaf7"></div><span class="mono">Cream<br><b>#fafaf7</b> · page ground</span></div>
  </div>
  <p class="note" style="margin-top:24px"><b>Type:</b> Inter Bold (700), letter-spacing &minus;0.01em,
  sentence case, always one word.</p>
</section>

</body></html>
"""
open(os.path.join(HERE, 'circlists-brand.html'), 'w').write(html)
print("wrote circlists-brand.html  (", len(html), "bytes )")

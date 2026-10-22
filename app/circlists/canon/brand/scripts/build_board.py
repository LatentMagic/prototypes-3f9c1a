#!/usr/bin/env python3
"""Render the Circlists brand board, circlists-brand.html: one page, six tabs (Logo, Icons, App icons,
Motion, Colour, Type), most with sub-tabs, and a small tab-switching script. Same shell as the After
Pixels board. Every image is inlined, so the file stands alone.

Values come from brand_tokens.py, the marks and icons from ../assets, and the motion from the animated
SVGs in ../assets/motion (via build_motion.py). Stdlib only. Run after build_mark.py, wordmark-outline.py,
build_lockup.py and build_rasters.py (it inlines their outputs)."""
import base64, html, os, re
from brand_tokens import *
import build_motion as bm

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, os.pardir)
ASSETS = os.path.join(OUT, "assets")


def rd(path, mode="r"):
    with open(path, mode) as f:
        return f.read()

def b64(path, mime):
    return "data:%s;base64,%s" % (mime, base64.b64encode(rd(path, "rb")).decode())

def icon(name, mime="image/png"):
    return b64(os.path.join(ASSETS, "icons", name), mime)

def native(name, mime="image/png"):
    return b64(os.path.join(ASSETS, "native", name), mime)

def asvg(sub, name):
    return rd(os.path.join(ASSETS, sub, name))

def esc(s):
    return html.escape(s, quote=True)

def fill(tpl, **kw):
    for k, v in kw.items():
        tpl = tpl.replace("@@%s@@" % k, v)
    assert "@@" not in tpl, re.search(r"@@\w+@@", tpl).group(0)
    return tpl

def vb(svg):
    return re.search(r'viewBox="([^"]+)"', svg).group(1)

def svg_inner_text(s):
    s = re.sub(r"(?s)^.*?<svg[^>]*>", "", s, count=1)
    s = re.sub(r"(?s)</svg>\s*$", "", s)
    return re.sub(r"(?s)<title>.*?</title>", "", s).strip()

def inline_svg(svg, height=None, width=None, cls="", label=""):
    """The SVG file inlined as an <svg> element sized by one edge; the other follows the viewBox."""
    _, _, w, h = map(float, vb(svg).split())
    if height: width = height * w / h
    else: height = width * h / w
    return ('<svg viewBox="%s" width="%.1f" height="%.1f" class="%s" role="img" aria-label="%s">%s</svg>'
            % (vb(svg), width, height, cls, esc(label), svg_inner_text(svg)))

NS = "http://www.w3.org/2000/svg"

def copy_btn(text, label):
    # The artifact contract allows no other http URL on the page, so the SVG namespace is put back by the click handler.
    text = text.replace(NS, "{{NS}}").replace("http://schemas.android.com/apk/res/android", "{{AND}}")
    return '<button type="button" class="copy" data-copy="%s">%s</button>' % (esc(text), esc(label))

MARK_SVG = asvg("mark", "circlists-mark.svg")
FAV_SVG = asvg("icons", "favicon.svg")
NOTIF_SVG = asvg("icons", "favicon-notification.svg")
LOCKUP_REV = asvg("lockup", "circlists-lockup-reversed.svg")
LOCKUP_INK = asvg("lockup", "circlists-lockup.svg")
WM_REV = asvg("wordmark", "circlists-wordmark-reversed.svg")
WM_INK = asvg("wordmark", "circlists-wordmark.svg")

# Tab grounds (Chrome light/dark tab surfaces and strips). Browser chrome, not brand colours.
GROUNDS = [("#FFFFFF", "#202124", "light tab"), ("#DEE1E6", "#202124", "light strip"),
           ("#202124", "#E8EAED", "dark strip"), ("#35363A", "#E8EAED", "dark tab")]

ICONS = [  # (key, label, png16, png32, svg, svg file)
    ("rest", "Plain favicon", "favicon-16.png", "favicon-32.png", FAV_SVG, "favicon.svg"),
    ("notif", "Notification icon", "favicon-notification-16.png", "favicon-notification-32.png", NOTIF_SVG, "favicon-notification.svg"),
]
NOTIF_LINE = ("The notification icon is for a tab that has something waiting: the mark plus an emerald arrival badge low right, "
              "built from the mark's own white keyline. The badge deliberately breaks the halo silhouette, which is what makes it "
              "detectable at 16 px. Swap it in while something waits and swap back when nothing does. It is a state, not a redrawing.")


def tab_mimics():
    rows = []
    for bg, fg, name in GROUNDS:
        tabs = ""
        for key, label, p16, _, _, _ in ICONS:
            tabs += ('<span class="mwrap"><span class="mtab" style="color:%s"><img src="%s" width="16" height="16" alt="" class="px">'
                     '<span>Circlists</span></span><span class="mcap">%s</span></span>'
                     % (fg, icon(p16), "Plain" if key == "rest" else "Notification"))
        rows.append('<div class="mimic" style="background:%s"><span class="gname">%s %s</span>%s</div>' % (bg, bg, name, tabs))
    return "\n".join(rows)


def zoom_cards():
    cards = []
    for k, label, p16, p32, svg, fn in ICONS:
        u16, u32 = icon(p16), icon(p32)
        chips = "".join('<span class="chip" style="background:%s"><img src="%s" width="16" height="16" alt="" class="px"></span>' % (g[0], u16) for g in GROUNDS)
        chips32 = "".join('<span class="chip" style="background:%s"><img src="%s" width="32" height="32" alt="" class="px"></span>' % (g[0], u32) for g in GROUNDS)
        cards.append(
            '<figure class="card zoom"><div class="zrow">'
            '<div class="z" style="background:#FFFFFF"><img src="%s" width="96" height="96" alt="%s at 6 times, on white" class="px"></div>'
            '<div class="z" style="background:#202124"><img src="%s" width="96" height="96" alt="%s at 6 times, on dark" class="px"></div></div>'
            '<figcaption><b>%s</b><span class="muted">16 px</span><span class="chips">%s</span>'
            '<span class="muted">32 px</span><span class="chips">%s</span>%s</figcaption></figure>'
            % (u16, esc(label), u16, esc(label), esc(label), chips, chips32, copy_btn(svg, "Copy SVG")))
    return "\n".join(cards)


SAFE = ('<svg viewBox="0 0 100 100" class="safe" aria-hidden="true"><circle cx="50" cy="50" r="@@R@@" fill="none" '
        'stroke="@@COL@@" stroke-width="0.8" stroke-dasharray="2 1.6"/></svg>')
SAFE_COL = INK            # board guide line only
SAFE_SVG = fill(SAFE, R=str(SAFE_CIRCLE), COL=SAFE_COL)

LINK_SNIPPET = '''<link rel="icon" href="/favicon.ico" sizes="48x48">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">'''

TAB_ICONS = '''
<section class="panel" role="tabpanel" id="panel-icons" aria-labelledby="tab-icons" tabindex="0" hidden>
  <h2>Icons</h2>
  <p class="note">The bare mark is the favicon: transparent, full size, no tile. The halo is opaque, so it reads at 16 px on a light or a dark tab. Installed icons sit on cream <code>@@CREAM@@</code> with the halo at @@PCT@@% of the tile.</p>

  <div class="tabbar sub" role="tablist" aria-label="Icon groups">
    <button type="button" role="tab" id="tab-icons-browser" aria-selected="true" aria-controls="sub-icons-browser" data-tab="icons-browser" data-parent="icons">Browser tab</button>
    <button type="button" role="tab" id="tab-icons-installed" aria-selected="false" aria-controls="sub-icons-installed" data-tab="icons-installed" data-parent="icons">Installed</button>
  </div>

  <div class="subpanel" role="tabpanel" id="sub-icons-browser" aria-labelledby="tab-icons-browser" tabindex="0">
  <h3>In a browser tab</h3>
  <p class="note">The plain favicon and the notification icon on the four tab grounds. The small label under each tab is not part of the tab.</p>
  <div class="mimics">@@MIMICS@@</div>

  <h3>16 px, zoomed</h3>
  <p class="note">@@NOTIFLINE@@ Each at 6&times; (nearest neighbour) on light and dark, with the real 16 and 32 px sizes on the four tab grounds beneath.</p>
  <div class="grid gz">@@ZOOM@@</div>
  </div>

  <div class="subpanel" role="tabpanel" id="sub-icons-installed" aria-labelledby="tab-icons-installed" tabindex="0" hidden>
  <h3>Installed icons</h3>
  <p class="note">Ground cream <code>@@CREAM@@</code>, the halo at @@PCT@@% of the tile, a hard square (the phone rounds it). The dashed circle is the maskable safe zone (@@SAFE@@% of the edge): the halo reaches @@HALOPCT@@% of it, inside. Apple touch is 180 px; maskable is 512 px shown smaller. Each sits on a grey backing with an outline only so the cream tile's square edge can be seen; the backing is not part of the icon.</p>
  <div class="grid g3">
    <figure class="card"><div class="crow"><span class="bk">@@APPLE@@</span></div><figcaption><b>apple-touch-icon.png</b> 180&times;180, RGB</figcaption></figure>
    <figure class="card"><div class="crow"><span class="bk">@@MASK@@</span></div><figcaption><b>maskable-icon-512.png</b> 512&times;512, RGB, safe circle drawn</figcaption></figure>
    <figure class="card"><b>Link tags</b><pre class="code" id="link-snippet">@@LINK@@</pre><div class="crow">@@LINKBTN@@ @@FAVBTN@@</div></figure>
  </div>
  </div>
</section>
'''

TAB_APP = '''
<section class="panel" role="tabpanel" id="panel-app-icons" aria-labelledby="tab-app-icons" tabindex="0" hidden>
  <h2>App icons</h2>
  <p class="note">Installed, store and native icons, all generated from the mark: ground cream <code>@@CREAM@@</code>, the halo at @@PCT@@% of the tile. Each sits on a grey backing only so the cream tile's edge can be seen; the backing is not part of the icon.</p>
  <div class="tabbar sub" role="tablist" aria-label="App icon groups">
    <button type="button" role="tab" id="tab-app-web" aria-selected="true" aria-controls="sub-app-web" data-tab="app-web" data-parent="app-icons">Web app</button>
    <button type="button" role="tab" id="tab-app-android" aria-selected="false" aria-controls="sub-app-android" data-tab="app-android" data-parent="app-icons">Android</button>
    <button type="button" role="tab" id="tab-app-ios" aria-selected="false" aria-controls="sub-app-ios" data-tab="app-ios" data-parent="app-icons">iOS</button>
  </div>

  <div class="subpanel" role="tabpanel" id="sub-app-web" aria-labelledby="tab-app-web" tabindex="0">
    <p class="note"><code>icon-*</code> is the PWA <code>any</code> icon with its corners baked round (transparent outside), for desktop, which shows it unmasked. <code>maskable-*</code> is a hard square that the phone cuts to its own shape: shown under a circle, a squircle and a rounded square, each with the @@SAFE@@% safe circle dashed. The notification badge is the mark as a single-colour silhouette with the ring cut out as a gap; Android tints it.</p>
    <div class="grid gf">
      <figure class="card"><div class="crow"><span class="bk">@@I192@@</span></div><figcaption><b>icon-192.png</b> 192&times;192, RGBA, rounded</figcaption></figure>
      <figure class="card"><div class="crow"><span class="bk">@@I512@@</span></div><figcaption><b>icon-512.png</b> 512&times;512, RGBA, rounded</figcaption></figure>
      <figure class="card"><div class="crow"><span class="bk">@@A180@@</span></div><figcaption><b>apple-touch-icon.png</b> 180&times;180, RGB</figcaption></figure>
      <figure class="card"><div class="crow"><span class="bk">@@MK_CIRCLE@@</span></div><figcaption><b>maskable-icon-192.png</b> circle</figcaption></figure>
      <figure class="card"><div class="crow"><span class="bk">@@MK_SQUIRCLE@@</span></div><figcaption><b>maskable-icon-192.png</b> squircle</figcaption></figure>
      <figure class="card"><div class="crow"><span class="bk">@@MK_ROUND@@</span></div><figcaption><b>maskable-icon-192.png</b> rounded square</figcaption></figure>
      <figure class="card"><div class="crow"><span class="bk" style="padding:10px;background:#FFFFFF">@@BADGE96@@</span><span class="bk" style="padding:6px;background:#FFFFFF">@@BADGE24@@</span></div><figcaption><b>notification-badge-96.png</b> @@B_BADGE@@ <span class="muted">Web Notifications badge, black on transparency. Shown at 96 px and 24 dp.</span></figcaption></figure>
    </div>
  </div>

  <div class="subpanel" role="tabpanel" id="sub-app-android" aria-labelledby="tab-app-android" tabindex="0" hidden>
    <p class="note">The @@ADP@@ dp adaptive layer: <code>icon-background.png</code> and <code>icon-foreground.png</code>, each inset 16.7% a side by <code>@capacitor/assets</code>, so the 1024 px source lands on the @@VDP@@ dp visible tile (solid outline). The dashed circle is the @@SDP@@ dp zone no launcher mask cuts; the halo is about @@HALODP@@ dp across, inside it and inside Android's 48&ndash;66 dp logo guide. Themed (Android 13+) tints <code>ic_launcher_monochrome.xml</code>, the mark as a silhouette, drawn here from the preview PNG.</p>
    <div class="grid gf">
      <figure class="card"><div class="crow"><span class="bk">@@ADAPTIVE@@</span></div><figcaption><b>Adaptive</b> background + foreground</figcaption></figure>
      <figure class="card"><div class="crow"><span class="bk">@@ADAPTIVE_MASK@@</span></div><figcaption><b>Adaptive, circle launcher</b></figcaption></figure>
      <figure class="card"><div class="crow"><span class="bk">@@THEMED@@</span></div><figcaption><b>Themed</b> @@B_XML@@</figcaption></figure>
      <figure class="card"><div class="crow"><span class="bk">@@PLAY@@</span></div><figcaption><b>play-store-icon-512.png</b> 512&times;512, all opaque</figcaption></figure>
    </div>
  </div>

  <div class="subpanel" role="tabpanel" id="sub-app-ios" aria-labelledby="tab-app-ios" tabindex="0" hidden>
    <p class="note">The three Xcode appearance slots: <code>icon-only.png</code> (opaque), <code>ios-icon-dark.png</code> (the mark on transparency, so the system's dark ground shows through) and <code>ios-icon-tinted.png</code> (the silhouette in white on black; iOS tints by brightness, so the shape is the light part). The App Store icon is <code>icon-only.png</code> at the same size.</p>
    <div class="grid gf">
      <figure class="card"><div class="crow"><span class="bk">@@IOS_ANY@@</span></div><figcaption><b>Any</b> icon-only.png</figcaption></figure>
      <figure class="card"><div class="crow"><span class="bk" style="background:#2C2C2E">@@IOS_DARK@@</span></div><figcaption><b>Dark</b> ios-icon-dark.png</figcaption></figure>
      <figure class="card"><div class="crow"><span class="bk" style="background:#2C2C2E">@@IOS_TINT@@</span></div><figcaption><b>Tinted</b> ios-icon-tinted.png</figcaption></figure>
      <figure class="card"><div class="crow"><span class="bk">@@APPSTORE@@</span></div><figcaption><b>app-store-icon-1024.png</b> 1024&times;1024, RGB, no alpha</figcaption></figure>
    </div>
  </div>
</section>
'''

TAB_LOGO = '''
<section class="panel" role="tabpanel" id="panel-logo" aria-labelledby="tab-logo" tabindex="0">
  <h2>Logo</h2>
  <p class="note">One mark, one wordmark, one lockup. The mark is three concentric circles: sage halo, white ring, emerald disc. The wordmark is "Circlists" outlined from Inter Bold (700) at &minus;0.01 em, so it needs no font; the second <i>i</i> carries the emerald tittle. In the lockup the mark's halo is @@MARKCAP@@&times; the wordmark's cap height, centred on the cap midpoint, with a gap of @@GAPCAP@@&times; cap.</p>

  <h3>Lockup</h3>
  <p class="note">Ink for light grounds, and reversed (cream) for dark grounds.</p>
  <div class="grid g2">
    <figure class="card"><div class="stage light">@@LOCK_INK@@</div><figcaption><b>circlists-lockup.svg</b> @@B_LOCK_INK@@</figcaption></figure>
    <figure class="card"><div class="stage dark">@@LOCK_REV@@</div><figcaption><b>circlists-lockup-reversed.svg</b> @@B_LOCK_REV@@</figcaption></figure>
  </div>

  <h3>Wordmark</h3>
  <p class="note">The tittle is &#8960; @@TITDIA@@ &times; cap height, its centre raised to @@TITCY@@ &times; cap height above the baseline. It floats above the caps and reads a touch larger than the native <i>i</i> dot.</p>
  <div class="grid g2">
    <figure class="card"><div class="stage light">@@WM_INK@@</div><figcaption><b>circlists-wordmark.svg</b> @@B_WM_INK@@</figcaption></figure>
    <figure class="card"><div class="stage dark">@@WM_REV@@</div><figcaption><b>circlists-wordmark-reversed.svg</b> @@B_WM_REV@@</figcaption></figure>
  </div>

  <h3>Mark</h3>
  <p class="note">At 120 and 64 px the SVG; at 32 and 16 px the favicon PNGs, which is what ships at those sizes. The halo is opaque, so the mark holds on a light or a dark ground with no help. The halo reaches @@HALOEDGE@@ of the @@BOX@@ box (r @@HALOR@@ about the centre), so the mark carries no built-in padding.</p>
  <div class="card"><div class="sizes">
    <figure><div class="stage light sz">@@M120@@</div><figcaption>120</figcaption></figure>
    <figure><div class="stage light sz">@@M64@@</div><figcaption>64</figcaption></figure>
    <figure><div class="stage light sz"><img src="@@P32@@" width="32" height="32" alt="mark at 32 px" class="px"></div><figcaption>32</figcaption></figure>
    <figure><div class="stage light sz"><img src="@@P16@@" width="16" height="16" alt="mark at 16 px" class="px"></div><figcaption>16</figcaption></figure>
    <figure><div class="stage dark sz">@@M64@@</div><figcaption>64 on dark</figcaption></figure>
  </div><div class="crow">@@B_MARK@@</div></div>
</section>
'''

TEMPLATE_BODY = '''
<div class="wrap">
<div class="top" role="banner">
  <div class="brandrow">
    @@HLOCK@@
    <span class="tag">Brand pack. Every file is generated by the scripts in the company wiki, <a href="https://github.com/LatentMagic/wiki/tree/main/wiki/products/circlists/brand/scripts"><code>wiki/products/circlists/brand/scripts/</code></a>.</span>
  </div>
  <div class="tabbar" role="tablist" aria-label="Brand sections">
    <button type="button" role="tab" id="tab-logo" aria-selected="true" aria-controls="panel-logo" data-tab="logo">Logo</button>
    <button type="button" role="tab" id="tab-icons" aria-selected="false" aria-controls="panel-icons" data-tab="icons">Icons</button>
    <button type="button" role="tab" id="tab-app-icons" aria-selected="false" aria-controls="panel-app-icons" data-tab="app-icons">App icons</button>
    <button type="button" role="tab" id="tab-motion" aria-selected="false" aria-controls="panel-motion" data-tab="motion">Motion</button>
    <button type="button" role="tab" id="tab-colour" aria-selected="false" aria-controls="panel-colour" data-tab="colour">Colour</button>
    <button type="button" role="tab" id="tab-type" aria-selected="false" aria-controls="panel-type" data-tab="type">Type</button>
  </div>
</div>
<main>@@LOGO@@@@ICONS@@@@APP@@@@MOTION@@@@COLOUR@@@@TYPE@@</main>
</div>
'''

STYLE = '''
@import url("@@FONTS@@");
:root{
  --page:@@PAGE@@;--card:@@CARD@@;--line:@@LINE@@;--hair:@@HAIR@@;--text:@@TEXT@@;--muted:@@MUTED@@;--accent:@@ACCENT@@;
  --control-edge:@@EDGE@@;--sunken:@@SUNKEN@@;
  --display:@@FS@@,-apple-system,BlinkMacSystemFont,"Segoe UI",system-ui,sans-serif;
  --body:@@FS@@,-apple-system,BlinkMacSystemFont,"Segoe UI",system-ui,sans-serif;
  --mono:@@FM@@,ui-monospace,Menlo,Consolas,monospace;
  color-scheme:light;
}
*{box-sizing:border-box}
body{margin:0;background:var(--page);color:var(--text);font:400 16px/1.5 var(--body)}
.wrap{max-width:960px;margin:0 auto;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px));padding-block:0 48px}
.top{position:sticky;top:env(safe-area-inset-top,0px);background:var(--page);z-index:5;padding-top:16px;border-bottom:1px solid var(--line)}
.brandrow{display:flex;flex-wrap:wrap;align-items:center;gap:8px 20px}
.hlock{display:block;height:32px;width:auto;flex:none}
.stage{display:flex;align-items:center;justify-content:center;padding:24px 16px;overflow:hidden}
.stage.dark{background:@@INK@@;border:1px solid @@INK@@}
.stage.light{background:@@CREAM@@;border:1px solid var(--hair)}
.stage svg{max-width:100%;height:auto}
.stage.sz{padding:16px;min-width:88px;min-height:88px}
.grid.g2{grid-template-columns:repeat(auto-fill,minmax(min(100%,420px),1fr))}
.sizes{display:flex;flex-wrap:wrap;gap:12px;align-items:flex-end}
.sizes figure{margin:0;display:grid;gap:6px;justify-items:center}
.sizes figcaption{margin:0;font-size:13px;color:var(--muted);justify-content:center}
.tag{color:var(--muted);font-size:14px;min-width:0}.tag a{color:inherit}.tag code{overflow-wrap:anywhere}
code,pre{font-family:var(--mono);font-size:13px}
code{background:var(--sunken);border:1px solid var(--line);padding:0 4px}
.tabbar{display:flex;flex-wrap:wrap;gap:0 4px;margin-top:12px}
[role=tab]{background:none;border:0;border-bottom:2px solid transparent;color:var(--muted);font:600 14px/1 var(--body);padding:12px 14px;cursor:pointer;white-space:nowrap}
[role=tab][aria-selected=true]{color:var(--text);border-bottom-color:var(--accent)}
:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
h2{font:700 30px/1.1 var(--display);letter-spacing:-.01em;margin:20px 0 6px}
h3{font:700 18px/1.2 var(--display);letter-spacing:-.01em;margin:24px 0 4px}
.note{color:var(--muted);font-size:14px;max-width:80ch;margin:0 0 10px}
.panel[hidden],.subpanel[hidden]{display:none}
.tabbar.sub{margin:14px 0 4px;border-bottom:1px solid var(--line)}
.tabbar.sub [role=tab]{padding:10px 14px}
.grid.gf{grid-template-columns:repeat(auto-fit,minmax(min(100%,170px),1fr));margin-top:12px}
.grid.gz{grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr))}
.gf .crow{justify-content:center}
.subpanel:focus-visible{outline-offset:-2px}
.mimics{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,420px),1fr));gap:8px}
.mimic{display:flex;flex-wrap:wrap;align-items:center;gap:6px;padding:8px 10px;border:1px solid var(--line)}
.gname{font:12px/1 var(--mono);color:#888;width:100%;flex:none}
.mtab{display:inline-flex;align-items:center;gap:8px;font:13px/1 system-ui,sans-serif;padding:6px 8px}
.mwrap{display:inline-flex;flex-direction:column;align-items:flex-start;gap:3px}
.mcap{font:11px/1 var(--mono);color:#888}
.px{image-rendering:pixelated;display:block}
img{max-width:100%}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,210px),1fr));gap:12px}
.grid.g3{grid-template-columns:repeat(auto-fill,minmax(min(100%,280px),1fr))}
.card{margin:0;background:var(--card);border:1px solid var(--line);padding:12px}
figcaption{margin-top:12px;font-size:14px;display:flex;flex-wrap:wrap;gap:6px 10px;align-items:center}
.muted{color:var(--muted);font-size:13px;flex-basis:100%}
.zrow{display:flex;justify-content:center;gap:6px}
.z{width:96px;line-height:0;border:1px solid var(--line)}
.z img{width:100%;height:auto}
.chips{display:inline-flex;gap:4px}
.chip{display:inline-flex;padding:4px;border:1px solid var(--line)}
.crow{display:flex;flex-wrap:wrap;gap:10px;align-items:center}
.bk{display:inline-flex;background:#D4D4D0;padding:10px;line-height:0;max-width:100%}
.tile{outline:1px solid var(--control-edge);outline-offset:0}
.mk{position:relative;display:inline-block;line-height:0;width:104px;max-width:100%}
.mk img{width:100%;height:auto;display:block}
.mk .safe{position:absolute;inset:0;width:100%;height:100%}
.mk.c img{border-radius:50%}.mk.s img{border-radius:30%}.mk.r img{border-radius:22.37%}
.mk.ad{width:120px;background:@@CREAM@@;outline:1px solid var(--control-edge)}
.mk.ad.circ{border-radius:50%;overflow:hidden}
.mk.ad .fg{position:absolute;inset:16.7%;width:66.6%;height:66.6%}
.mk.th{background:#DBE8E2;aspect-ratio:1}.mk.th .fg{position:absolute;inset:16.7%;width:66.6%;height:66.6%}
.mk.i{width:104px}.mk.i img{border-radius:22.37%}
.ov{position:relative;display:inline-block;line-height:0;width:140px;max-width:100%}
.ov img{width:100%;height:auto}
.ov .safe{position:absolute;inset:0;width:100%;height:100%}
.code{background:var(--sunken);border:1px solid var(--line);padding:12px;overflow-x:auto;margin:0 0 10px;color:var(--text)}
.copy{background:none;color:var(--accent);border:1px solid var(--control-edge);font:600 13px/1 var(--body);padding:8px 12px;cursor:pointer}
.copy:hover{background:var(--sunken)}
@media (max-width:640px){h2{font-size:28px}}
@media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important;scroll-behavior:auto!important}}
'''

SCRIPT = '''
(function(){
  var all=[].slice.call(document.querySelectorAll('[role=tab]'));
  var mains=all.filter(function(t){return !t.hasAttribute('data-parent');});
  var lastSub={};
  function byId(id){for(var i=0;i<all.length;i++){if(all[i].getAttribute('data-tab')===id)return all[i];}return null;}
  function subsOf(m){return all.filter(function(t){return t.getAttribute('data-parent')===m;});}
  function setGroup(list,activeId){
    list.forEach(function(t){
      var on=t.getAttribute('data-tab')===activeId;
      t.setAttribute('aria-selected',on?'true':'false');
      t.tabIndex=on?0:-1;
      var p=document.getElementById(t.getAttribute('aria-controls')); if(p)p.hidden=!on;
    });
  }
  function show(id){
    var t=byId(id), main, sub=null;
    if(!t){main=mains[0].getAttribute('data-tab');}
    else if(t.hasAttribute('data-parent')){main=t.getAttribute('data-parent');sub=id;}
    else{main=id;}
    var subs=subsOf(main);
    if(subs.length){
      if(!sub)sub=lastSub[main]||subs[0].getAttribute('data-tab');
      lastSub[main]=sub;
    }
    setGroup(mains,main);
    mains.forEach(function(m){var s=subsOf(m.getAttribute('data-tab')); if(s.length)setGroup(s,m.getAttribute('data-tab')===main?sub:null);});
  }
  function fromHash(){show((location.hash||'').replace(/^#/,''));}
  all.forEach(function(t){
    t.addEventListener('click',function(){location.hash=t.getAttribute('data-tab');show(t.getAttribute('data-tab'));});
    t.addEventListener('keydown',function(e){
      var g=[].slice.call(t.parentNode.querySelectorAll('[role=tab]')), i=g.indexOf(t), n=null;
      if(e.key==='ArrowRight')n=g[(i+1)%g.length];
      else if(e.key==='ArrowLeft')n=g[(i-1+g.length)%g.length];
      else if(e.key==='Home')n=g[0];
      else if(e.key==='End')n=g[g.length-1];
      if(!n)return; n.focus(); n.click(); e.preventDefault();
    });
  });
  var rmb=document.getElementById('rm-toggle');
  if(rmb)rmb.addEventListener('click',function(){
    var on=rmb.getAttribute('aria-pressed')!=='true';
    rmb.setAttribute('aria-pressed',on?'true':'false');
    rmb.textContent=on?'Reduced motion: on':'Reduced motion: off';
    document.getElementById('panel-motion').classList.toggle('rm',on);
  });
  window.addEventListener('hashchange',fromHash); fromHash();
  [].forEach.call(document.querySelectorAll('.copy'),function(b){
    var label=b.textContent;
    b.addEventListener('click',function(){
      var text=b.hasAttribute('data-copy-from')?document.getElementById(b.getAttribute('data-copy-from')).textContent:b.getAttribute('data-copy').split('{{NS}}').join('http'+'://www.w3.org/2000/svg').split('{{AND}}').join('http'+'://schemas.android.com/apk/res/android');
      function done(m){b.textContent=m;setTimeout(function(){b.textContent=label;},1600);}
      try{navigator.clipboard.writeText(text).then(function(){done('Copied');},function(){done('Copy blocked');});}
      catch(e){done('Copy blocked');}
    });
  });
})();
'''


def app_tab():
    def pic(src, w=104, alt="", cls="tile"):
        return '<img src="%s" width="%d" height="%d" alt="%s" class="%s" style="max-width:100%%;height:auto">' % (src, w, w, esc(alt), cls)
    m192 = icon("maskable-icon-192.png")
    def masked(cls, alt):
        return '<span class="mk %s"><img src="%s" width="192" height="192" alt="%s">%s</span>' % (cls, m192, esc(alt), SAFE_SVG)
    half = ANDROID_SAFE_DP / 2
    ad_guides = ('<svg viewBox="0 0 %d %d" class="safe" aria-hidden="true"><rect x="%g" y="%g" width="%d" height="%d" fill="none" stroke="%s" stroke-width="0.5"/>'
                 '<circle cx="%g" cy="%g" r="%g" fill="none" stroke="%s" stroke-width="0.6" stroke-dasharray="2 1.6"/></svg>'
                 % (ADAPTIVE_DP, ADAPTIVE_DP, (ADAPTIVE_DP - ADAPTIVE_VISIBLE_DP) / 2, (ADAPTIVE_DP - ADAPTIVE_VISIBLE_DP) / 2,
                    ADAPTIVE_VISIBLE_DP, ADAPTIVE_VISIBLE_DP, EDGE, ADAPTIVE_DP / 2, ADAPTIVE_DP / 2, half, SAFE_COL))
    fg = native("icon-foreground.png"); bgp = native("icon-background.png")
    adaptive = ('<span class="mk ad"><img src="%s" width="120" height="120" alt="Android adaptive background"><img src="%s" class="fg" alt="Android adaptive foreground">%s</span>'
                % (bgp, fg, ad_guides))
    adaptive_mask = ('<span class="mk ad circ"><img src="%s" width="120" height="120" alt="Android adaptive background"><img src="%s" class="fg" alt="Android adaptive foreground"></span>'
                     % (bgp, fg))
    themed = '<span class="mk ad th circ"><img src="%s" class="fg" alt="Android themed icon, black silhouette"></span>' % native("icon-monochrome.png")
    badge_png = icon("notification-badge-96.png")
    return fill(TAB_APP,
        CREAM=CREAM, PCT=str(ICON_PCT), SAFE=str(SAFE_CIRCLE), ADP=str(ADAPTIVE_DP), VDP=str(ADAPTIVE_VISIBLE_DP), SDP=str(ANDROID_SAFE_DP),
        HALODP="%.1f" % (ADAPTIVE_VISIBLE_DP * ICON_PCT / 100.0),
        I192=pic(icon("icon-192.png"), alt="icon-192"), I512=pic(icon("icon-512.png"), alt="icon-512"),
        A180=pic(icon("apple-touch-icon.png"), alt="apple touch icon"),
        MK_CIRCLE=masked("c", "maskable under a circle mask"), MK_SQUIRCLE=masked("s", "maskable under a squircle mask"),
        MK_ROUND=masked("r", "maskable under a rounded-square mask"),
        APPSTORE=pic(icon("app-store-icon-1024.png"), alt="App Store icon"), PLAY=pic(icon("play-store-icon-512.png"), alt="Play Store icon"),
        ADAPTIVE=adaptive, ADAPTIVE_MASK=adaptive_mask, THEMED=themed,
        B_XML=copy_btn(rd(os.path.join(ASSETS, "native", "ic_launcher_monochrome.xml")), "Copy XML"),
        IOS_ANY='<span class="mk i"><img src="%s" width="104" height="104" alt="iOS Any icon"></span>' % native("icon-only.png"),
        IOS_DARK='<span class="mk i"><img src="%s" width="104" height="104" alt="iOS Dark icon"></span>' % native("ios-icon-dark.png"),
        IOS_TINT='<span class="mk i"><img src="%s" width="104" height="104" alt="iOS Tinted icon"></span>' % native("ios-icon-tinted.png"),
        BADGE96=pic(badge_png, 96, "notification badge at 96 px", "px"), BADGE24=pic(badge_png, 24, "notification badge at 24 px", "px"),
        B_BADGE=copy_btn(rd(os.path.join(ASSETS, "icons", "notification-badge.svg")), "Copy SVG"))


# ---- Motion tab -------------------------------------------------------------------------------
MOTION_CSS = (
    "\n.cl-m{display:block;overflow:visible}\n" + bm.RM_CSS +
    "\n.rmbar{display:flex;flex-wrap:wrap;gap:8px 14px;align-items:center;margin:0 0 4px}"
    ".rmbar .note{margin:0}"
    ".tog{background:none;color:var(--accent);border:1px solid var(--control-edge);font:600 13px/1 var(--body);padding:8px 12px;cursor:pointer}"
    ".tog[aria-pressed=true]{background:var(--sunken);border-color:var(--accent)}"
    ".mstage{padding:20px 16px;min-height:150px;gap:24px;flex-wrap:wrap}"
    ".btn{display:inline-flex;align-items:center;gap:8px;padding:9px 16px;border-radius:8px;background:@@EMERALD@@;color:@@WHITE@@;font:600 14px/1 var(--body);border:0}\n")

TAB_MOTION = """
<section class="panel" role="tabpanel" id="panel-motion" aria-labelledby="tab-motion" tabindex="0" hidden>
  <h2>Motion</h2>
  <div class="rmbar"><p class="note">Three animated treatments of the same mark: pulse, spinner and micro. Each is a self-contained SVG with its motion and its reduced-motion fallback inside, and each freezes to the static mark under reduced motion. Never redraw the mark.</p>
  <button type="button" class="tog" id="rm-toggle" aria-pressed="false">Reduced motion: off</button></div>

  <div class="tabbar sub" role="tablist" aria-label="Motion groups">
    <button type="button" role="tab" id="tab-motion-pulse" aria-selected="true" aria-controls="sub-motion-pulse" data-tab="motion-pulse" data-parent="motion">Pulse</button>
    <button type="button" role="tab" id="tab-motion-spinner" aria-selected="false" aria-controls="sub-motion-spinner" data-tab="motion-spinner" data-parent="motion">Spinner</button>
    <button type="button" role="tab" id="tab-motion-micro" aria-selected="false" aria-controls="sub-motion-micro" data-tab="motion-micro" data-parent="motion">Micro</button>
  </div>

  <div class="subpanel" role="tabpanel" id="sub-motion-pulse" aria-labelledby="tab-motion-pulse" tabindex="0">
    <p class="note">The idle breathing mark. The sage halo breathes and brightens in lockstep while the disc and white ring hold still: a @@PCYCLE@@ s cycle, peak scale @@PAMP@@, brightness peaking at @@PTONE@@ at the 34% apex. It runs on <code>linear</code> timing because the hand-sampled curve is the motion: a brisk inhale, a brief apex, a relaxed exhale. In this asset the disc is drawn one step larger (r @@PDISC@@, ring r @@PRING@@) so the resting sage band is thinner; the static mark is unchanged.</p>
    <div class="grid g3">
      <figure class="card"><div class="stage light mstage">@@P96@@</div><figcaption><b>96 px</b> <span class="muted">circlists-pulse.svg</span>@@PBTN@@</figcaption></figure>
      <figure class="card"><div class="stage light mstage">@@P40@@</div><figcaption><b>40 px</b> <span class="muted">the same file, smaller</span></figcaption></figure>
      <figure class="card"><div class="stage dark mstage">@@P96@@</div><figcaption><b>96 px on dark</b> <span class="muted">the colours do not change</span></figcaption></figure>
    </div>
  </div>

  <div class="subpanel" role="tabpanel" id="sub-motion-spinner" aria-labelledby="tab-motion-spinner" tabindex="0" hidden>
    <p class="note">The loading state. The disc and white ring hold at centre; a sage arc on r @@SARC@@ (band @@SBAND@@) rotates while its length grows and shrinks. The file ships at @@SPACE@@&times; the reference pace: rotation @@SROT@@ s, arc-breathe @@SGROW@@ s. No accompanying text by default: the ARIA label carries the loading state.</p>
    <div class="grid g3">
      <figure class="card"><div class="stage light mstage">@@S100@@</div><figcaption><b>100 px</b> <span class="muted">circlists-spinner.svg</span>@@SBTN@@</figcaption></figure>
      <figure class="card"><div class="stage light mstage">@@S50@@</div><figcaption><b>50 px</b> <span class="muted">the same file, smaller</span></figcaption></figure>
      <figure class="card"><div class="stage light mstage"><span class="btn">@@S16@@ Loading&hellip;</span></div><figcaption><b>16 px</b></figcaption></figure>
    </div>
  </div>

  <div class="subpanel" role="tabpanel" id="sub-motion-micro" aria-labelledby="tab-motion-micro" tabindex="0" hidden>
    <p class="note">The ~10 px live signal dot. The green core holds dead still and a soft band of sage light sweeps across the halo, painting it into view as a ring around the core, then rests off-frame: a @@MCYCLE@@ s cycle on <code>@@MEASE@@</code>, the band travelling @@MSWEEP@@ viewBox units over the first 64%. Nothing scales, so nothing reads as a pulse. It is built for this size; pulse and spinner scale to context.</p>
    <div class="grid g3">
      <figure class="card"><div class="stage light mstage">@@M10@@</div><figcaption><b>10 px</b> <span class="muted">circlists-micro.svg, the size it is for</span>@@MBTN@@</figcaption></figure>
      <figure class="card"><div class="stage light mstage">@@M52@@</div><figcaption><b>52 px</b> <span class="muted">the same file, enlarged to read the sweep</span></figcaption></figure>
      <figure class="card"><div class="stage dark mstage">@@M52@@</div><figcaption><b>52 px on dark</b></figcaption></figure>
    </div>
  </div>
</section>
"""


def motion_tab():
    def mi(key, px, label):
        return bm.inline(key, px, label).replace("<svg ", '<svg class="cl-m" ', 1)
    return fill(TAB_MOTION,
        PCYCLE="%g" % PULSE_CYCLE, PAMP="%g" % PULSE_AMP, PTONE="%g" % PULSE_TONE, PDISC="%g" % PULSE_DISC_R, PRING="%g" % PULSE_RING_R,
        SARC="%g" % SPINNER_ARC_R, SBAND="%g" % SPINNER_BAND, SPACE="%g" % SPINNER_PACE, SROT="%g" % SPINNER_ROTATE, SGROW="%g" % SPINNER_GROW,
        MCYCLE="%g" % MICRO_CYCLE, MEASE=MICRO_EASE, MSWEEP="%d" % MICRO_SWEEP,
        P96=mi("pulse", 96, "Circlists pulse"), P40=mi("pulse", 40, "Circlists pulse, small"),
        S100=mi("spinner", 100, "Circlists loading"), S50=mi("spinner", 50, "Circlists loading, small"), S16=mi("spinner", 16, "Circlists loading, in a button"),
        M10=mi("micro", 10, "Circlists live signal"), M52=mi("micro", 52, "Circlists live signal, enlarged"),
        PBTN=copy_btn(bm.read("pulse"), "Copy SVG"), SBTN=copy_btn(bm.read("spinner"), "Copy SVG"), MBTN=copy_btn(bm.read("micro"), "Copy SVG"))


# ---- Colour and Type tabs ---------------------------------------------------------------------
COLOUR_TYPE_CSS = """
.sw{display:flex;flex-direction:column;gap:10px}
.sw .chipc{display:flex;align-items:center;justify-content:center;height:44px;border:1px solid var(--control-edge);font:700 20px/1 var(--body)}
.sw figcaption{margin:0;display:grid;gap:4px;justify-items:start}
.sw .tok{font:12px/1.2 var(--mono);color:var(--muted)}
.sw .use{color:var(--muted);font-size:13px;line-height:1.3}
.sw .copies{display:flex;flex-wrap:wrap;gap:6px}
.grid.gsw{grid-template-columns:repeat(auto-fill,minmax(min(100%,200px),1fr))}
.grid.gsw3{grid-template-columns:repeat(auto-fill,minmax(min(100%,260px),1fr))}
.specimen{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:4px 16px;align-items:center;padding:10px 0;border-top:1px solid var(--line)}
.specimen:first-child{border-top:0}
.specimen .smp{overflow-wrap:anywhere}
.specimen .meta{font:12px/1.3 var(--mono);color:var(--muted);grid-column:1}
.specimen .copy{grid-row:1 / span 2;grid-column:2}
.fam{display:flex;flex-wrap:wrap;gap:4px 20px;align-items:baseline;margin:0 0 6px}
.fam b.aa{font-size:30px;line-height:1.1}
.fam span{color:var(--muted);font-size:14px}
.linkrow{display:flex;flex-wrap:wrap;gap:8px 28px;align-items:baseline;margin:8px 0}
.lk-standalone{font:500 14px/1.4 var(--mono);color:@@INK@@;text-decoration:underline;text-underline-offset:@@OFFSET@@;text-decoration-thickness:@@THICK@@;text-decoration-color:@@LINE@@}
.lk-standalone:hover,.lk-standalone.on{text-decoration-color:@@INK@@}
.lk-inline{color:@@EMERALD@@;text-decoration:underline;text-underline-offset:@@OFFSET@@;text-decoration-thickness:@@THICK@@;text-decoration-color:color-mix(in oklab,@@EMERALD@@ @@PCT@@%,transparent);transition:text-decoration-color 150ms cubic-bezier(0.16,1,0.3,1)}
.lk-inline:hover,.lk-inline:focus-visible,.lk-inline.on{text-decoration-color:@@EMERALD@@}
@media (prefers-reduced-motion:reduce){.lk-inline{transition:none}}
.vgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,200px),1fr));gap:12px}
.leadp{margin:0;max-width:34ch}
.wmlive{font:700 40px/1 var(--display);letter-spacing:-.01em;color:@@INK@@;white-space:nowrap}
.stage.wmlive-wrap{min-height:90px}
"""


def _sw(name, token, hexv, use, ratio=None):
    on = INK if hexv in (SAGE, CREAM, WHITE) else WHITE
    chip = '<span class="chipc" style="background:%s;color:%s">Aa</span>' % (hexv, on)
    extra = ""
    if ratio:
        extra = '<span class="use">%s</span>' % esc(ratio)
    return ('<figure class="card sw">%s<figcaption><b>%s</b><span class="tok">%s</span><span class="use">%s</span>%s'
            '<span class="copies">%s</span></figcaption></figure>'
            % (chip, esc(name), esc(token), esc(use), extra, copy_btn(hexv, hexv)))


def _text_sw(name, token, hexv, use):
    """A text colour shown as text on cream and on white, with the measured contrast."""
    chip = ('<span class="chipc" style="background:%s;color:%s;border-bottom:0">Aa</span>'
            '<span class="chipc" style="background:%s;color:%s;border-top:0">Aa</span>' % (CREAM, hexv, WHITE, hexv))
    ratio = "%.1f:1 on cream, %.1f:1 on white" % (contrast(hexv, CREAM), contrast(hexv, WHITE))
    return ('<figure class="card sw"><div>%s</div><figcaption><b>%s</b><span class="tok">%s</span><span class="use">%s</span>'
            '<span class="use">%s</span><span class="copies">%s</span></figcaption></figure>'
            % (chip, esc(name), esc(token), esc(use), esc(ratio), copy_btn(hexv, hexv)))


def _grid(cards, cls="gsw3"):
    return '<div class="grid %s">%s</div>' % (cls, "".join(cards))


def _state_sw(name, token, val, use):
    """A prototype colour that may be translucent: shown over the white surface, with a dark or light label."""
    if val.startswith("#"):
        on = INK if contrast(val, INK) >= contrast(val, WHITE) else WHITE
    else:
        on = INK
    chip = '<span class="chipc" style="background:%s;color:%s">Aa</span>' % (val, on)
    return ('<figure class="card sw"><div style="background:%s">%s</div><figcaption><b>%s</b><span class="tok">%s</span><span class="use">%s</span>'
            '<span class="copies">%s</span></figcaption></figure>'
            % (WHITE, chip, esc(name), esc(token), esc(use), copy_btn(val, val)))


def colour_tab():
    st = {n: (n, v, x, r) for n, v, x, r in DS_STATES}
    def grp(*names):
        return _grid([_state_sw(st[n][0], st[n][1], st[n][2], st[n][3]) for n in names])
    states_accent = grp("Accent hover", "Accent press", "Accent ring", "Accent soft")
    states_edge = grp("Border strong", "Scrim", "New words")
    states_destr = grp("Destructive", "Destructive hover", "Destructive press", "Destructive ring")
    mark = _grid([
        _sw("Emerald", "--color-accent", EMERALD, "The disc, the wordmark tittle, primary brand colour."),
        _sw("Sage", "--color-sage", SAGE, "The halo, opaque, so it reads at every size on any ground."),
        _sw("White", "--color-surface", WHITE, "The white ring in the mark."),
    ])
    grounds = _grid([
        _sw("Cream", "--color-page", CREAM, "The page and app ground, and the opaque ground baked behind the installed app icon."),
    ])
    text = _grid([
        _text_sw("Primary (Ink)", "--color-fg-1", INK, "Body and titles; the wordmark on light grounds."),
        _text_sw("Secondary", "--color-fg-2", SECONDARY, "Supporting text."),
        _text_sw("Tertiary", "--color-fg-3", TERTIARY, "Captions and meta."),
    ])
    return fill("""
<section class="panel" role="tabpanel" id="panel-colour" aria-labelledby="tab-colour" tabindex="0" hidden>
  <h2>Colour</h2>
  <p class="note">Every value is the brand spec's, and each is checked against the prototype's <code>tokens.css</code>. The text neutrals are warm-leaning and AA on cream and white. A hex button copies it.</p>
  <div class="tabbar sub" role="tablist" aria-label="Colour groups">
    <button type="button" role="tab" id="tab-colour-brand" aria-selected="true" aria-controls="sub-colour-brand" data-tab="colour-brand" data-parent="colour">Mark and grounds</button>
    <button type="button" role="tab" id="tab-colour-text" aria-selected="false" aria-controls="sub-colour-text" data-tab="colour-text" data-parent="colour">Text</button>
    <button type="button" role="tab" id="tab-colour-states" aria-selected="false" aria-controls="sub-colour-states" data-tab="colour-states" data-parent="colour">States and overlays</button>
  </div>
  <div class="subpanel" role="tabpanel" id="sub-colour-brand" aria-labelledby="tab-colour-brand" tabindex="0">
    <h3>The mark</h3>@@MARK@@
    <h3>Ground</h3>@@GROUNDS@@
  </div>
  <div class="subpanel" role="tabpanel" id="sub-colour-text" aria-labelledby="tab-colour-text" tabindex="0" hidden>
    <h3>Text neutrals</h3>
    <p class="note">Three steps. The contrast ratios are computed from the hex values.</p>@@TEXT@@
  </div>
  <div class="subpanel" role="tabpanel" id="sub-colour-states" aria-labelledby="tab-colour-states" tabindex="0" hidden>
    <p class="note">The prototype's other colour tokens, restated from <code>tokens.css</code> with the role its comments give. Translucent values are shown over the white surface. Two tokens there are not restated: the warm and cool accents are marked not approved, and surface-raised is reserved.</p>
    <h3>Emerald states</h3>@@ACCENT@@
    <h3>Edge, overlay and unseen comments</h3>@@EDGE@@
    <h3>Destructive</h3>@@DESTR@@
  </div>
</section>
""", MARK=mark, GROUNDS=grounds, TEXT=text, ACCENT=states_accent, EDGE=states_edge, DESTR=states_destr)


def type_tab():
    rows = [
        ("Circlists", FONT_SANS, "700", "-0.01em", "Wordmark: Inter Bold, sentence case, one word", "var(--display)"),
        ("Champion", FONT_MONO, "", "", "Small label", "var(--mono)"),
        ("Coming soon", FONT_MONO, "", "", "Status label", "var(--mono)"),
        ("support@circlists.com", FONT_MONO, "", "", "Standalone link text", "var(--mono)"),
    ]
    out = ""
    for text, fam, w, track, role, var in rows:
        style = "font-family:%s%s%s" % (var, ";font-weight:%s" % w if w else "", ";letter-spacing:%s" % track if track else "")
        size = ";font-size:32px;line-height:1.1" if w else ";font-size:16px"
        css = "font-family:%s%s%s" % (fam, ";font-weight:%s" % w if w else "", ";letter-spacing:%s" % track if track else "")
        out += ('<div class="specimen"><div class="smp" style="%s%s">%s</div><div class="meta">%s &middot; %s%s</div>%s</div>'
                % (style, size, esc(text), esc(role), esc(fam.strip("'")), (" " + w + ", " + track) if w else "", copy_btn(css, "Copy CSS")))
    _, _, _, wm_h = map(float, vb(WM_INK).split())
    wordmark = inline_svg(WM_INK, height=wm_h * 40 / FONT_UPM, label="Circlists wordmark at 40 px")
    def spec_row(label, tok, val, role, style, text="Circlists shares links", css=None):
        meta = "%s &middot; %s %s%s" % (esc(label), esc(tok), esc(val), (" &middot; " + esc(role)) if role else "")
        return ('<div class="specimen"><div class="smp" style="%s">%s</div><div class="meta">%s</div>%s</div>'
                % (style, esc(text), meta, copy_btn(css or style, "Copy CSS")))
    weights = "".join('<div><div style="font-family:var(--display);font-weight:%s;font-size:28px;line-height:1.1">Aa Gg</div>'
                      '<div class="muted" style="font:12px/1.3 var(--mono)">%s &middot; %s %s</div></div>' % (v, n, esc(t), v) for n, t, v in WEIGHTS)
    sizes = "".join(spec_row(n, t, v, r, "font-family:var(--display);font-size:%s;line-height:1.2" % v, css="font-size:%s" % v) for n, t, v, r in SIZES)
    leads = "".join('<div><p class="leadp" style="font-family:var(--display);font-size:16px;line-height:%s">A link shared with a circle, and the words that sit beside it, over two lines.</p>'
                    '<div class="muted" style="font:12px/1.3 var(--mono);margin-top:6px">%s &middot; %s %s</div></div>' % (v, n, esc(t), v) for n, t, v in LEADINGS)
    tracks = "".join(spec_row(n, t, v, r, "font-family:var(--display);font-size:24px;font-weight:600;line-height:1.2;letter-spacing:%s" % v,
                              css="letter-spacing:%s" % v) for n, t, v, r in TRACKINGS)   # 40 px em, so the outlines match the live text
    return fill("""
<section class="panel" role="tabpanel" id="panel-type" aria-labelledby="tab-type" tabindex="0" hidden>
  <h2>Type</h2>
  <p class="note">Two families from Google Fonts, as in the prototype's <code>tokens.css</code>. Buttons are owed: there is no ladder yet, so tiers, fills and sizes are undefined.</p>
  <div class="tabbar sub" role="tablist" aria-label="Type groups">
    <button type="button" role="tab" id="tab-type-families" aria-selected="true" aria-controls="sub-type-families" data-tab="type-families" data-parent="type">Scale</button>
    <button type="button" role="tab" id="tab-type-links" aria-selected="false" aria-controls="sub-type-links" data-tab="type-links" data-parent="type">Links and wordmark</button>
  </div>
  <div class="subpanel" role="tabpanel" id="sub-type-families" aria-labelledby="tab-type-families" tabindex="0">
    <div class="fam"><b class="aa" style="font-family:var(--display);font-weight:700;letter-spacing:-.01em">Aa Gg</b><span><b>Inter</b>: the main text. Inter Bold (700) at &minus;0.01 em for the wordmark.</span></div>
    <div class="fam"><b class="aa" style="font-family:var(--mono)">Aa Gg</b><span><b>JetBrains Mono</b>: the accent, carrying small labels and standalone link text.</span></div>
    <div class="card">@@ROWS@@</div>
    <h3>Weights</h3>
    <p class="note">Four named steps, 400 to 700.</p>
    <div class="card"><div class="vgrid">@@WEIGHTS@@</div></div>
    <h3>Sizes</h3>
    <p class="note">Listed as <code>tokens.css</code> lists them, each with its role. A size is not tied to a line height here: tokens.css lists them separately.</p>
    <div class="card">@@SIZES@@</div>
    <h3>Line heights</h3>
    <div class="card"><div class="vgrid">@@LEADS@@</div></div>
    <h3>Tracking</h3>
    <div class="card">@@TRACKS@@</div>
  </div>
  <div class="subpanel" role="tabpanel" id="sub-type-links" aria-labelledby="tab-type-links" tabindex="0" hidden>
    <h3>Link text</h3>
    <p class="note">Two forms, split by whether the link sits in a sentence. The underline is always present, never hover-only: touch surfaces have no hover, so a hover-revealed underline would leave the link carried by colour alone. The underline values are the prototype's.</p>
    <div class="card">
      <div class="linkrow"><a class="lk-standalone" href="#type-links">support@circlists.com</a><span class="muted">Standalone: JetBrains Mono, Ink <code>@@INK@@</code>, underlined. Live link: hover it.</span></div>
      <div class="linkrow"><a class="lk-standalone" href="#type-links">At rest</a><span class="muted">bare <code>a</code> (tokens.css): @@THICK@@ thick, @@OFFSET@@ below the text, border-1 <code>@@LINE@@</code></span></div>
      <div class="linkrow"><a class="lk-standalone on" href="#type-links">Hover</a><span class="muted">underline goes to Ink <code>@@INK@@</code></span></div>
      <div class="linkrow"><span>&hellip;you can <a class="lk-inline" href="#type-links">champion your own</a>.</span><span class="muted">Inline: Inter, Emerald <code>@@EMERALD@@</code>, underlined. Live link: hover it.</span></div>
      <div class="linkrow"><a class="lk-inline" href="#type-links">At rest</a><span class="muted">circ-doorlink (circlists.html): @@THICK@@ thick, @@OFFSET@@ below the text, Emerald at @@PCT@@%</span></div>
      <div class="linkrow"><a class="lk-inline on" href="#type-links">Hover and focus</a><span class="muted">underline goes to full Emerald; 150 ms on the one curve, none under reduced motion</span></div>
    </div>
    <h3>The wordmark beside live text</h3>
    <p class="note">Both at 40 px. The file is outlined from the font, so it needs no font and carries the emerald tittle; the live text matches its letters once Inter has loaded, but keeps the font's own <i>i</i> dots.</p>
    <div class="grid g2">
      <figure class="card"><div class="stage light wmlive-wrap">@@WM@@</div><figcaption><b>circlists-wordmark.svg</b> <span class="muted">outlined paths</span></figcaption></figure>
      <figure class="card"><div class="stage light wmlive-wrap"><span class="wmlive">Circlists</span></div><figcaption><b>Live text</b> <span class="muted">Inter 700, &minus;0.01 em</span></figcaption></figure>
    </div>
  </div>
</section>
""", ROWS=out, WM=wordmark, INK=INK, EMERALD=EMERALD, WEIGHTS=weights, SIZES=sizes, LEADS=leads, TRACKS=tracks,
        THICK=LINK_THICK, OFFSET=LINK_OFFSET, PCT=str(DOORLINK_REST_PCT), LINE=LINE)


def build():
    mask_html = ('<span class="ov"><img src="%s" width="512" height="512" alt="maskable icon with safe circle" class="tile">%s</span>'
                 % (icon("maskable-icon-512.png"), SAFE_SVG))
    apple = '<img src="%s" width="140" height="140" alt="apple touch icon" class="tile" style="max-width:100%%;height:auto">' % icon("apple-touch-icon.png")
    icons = fill(TAB_ICONS, CREAM=CREAM, PCT=str(ICON_PCT), SAFE=str(SAFE_CIRCLE), HALOPCT="%.0f" % (ICON_PCT / 2.0 / SAFE_CIRCLE * 100),
        MIMICS=tab_mimics(), ZOOM=zoom_cards(), NOTIFLINE=esc(NOTIF_LINE), APPLE=apple, MASK=mask_html,
        LINK=esc(LINK_SNIPPET),
        LINKBTN='<button type="button" class="copy" data-copy-from="link-snippet">Copy link tags</button>',
        FAVBTN=copy_btn(FAV_SVG, "Copy favicon.svg"))
    logo = fill(TAB_LOGO, MARKCAP="%g" % MARK_CAP_RATIO, GAPCAP="%g" % GAP_CAP_RATIO, TITDIA="%g" % TITTLE_DIA_OVER_CAP, TITCY="%g" % TITTLE_CY_OVER_CAP,
        LOCK_INK=inline_svg(LOCKUP_INK, width=360, label="Circlists lockup"),
        LOCK_REV=inline_svg(LOCKUP_REV, width=360, label="Circlists lockup, reversed"),
        WM_INK=inline_svg(WM_INK, width=300, label="Circlists wordmark"),
        WM_REV=inline_svg(WM_REV, width=300, label="Circlists wordmark, reversed"),
        B_LOCK_INK=copy_btn(LOCKUP_INK, "Copy SVG"), B_LOCK_REV=copy_btn(LOCKUP_REV, "Copy SVG"),
        B_WM_INK=copy_btn(WM_INK, "Copy SVG"), B_WM_REV=copy_btn(WM_REV, "Copy SVG"),
        B_MARK=copy_btn(MARK_SVG, "Copy mark SVG"),
        M120=inline_svg(MARK_SVG, width=120, label="Circlists mark 120 px"),
        M64=inline_svg(MARK_SVG, width=64, label="Circlists mark 64 px"),
        HALOEDGE="%g" % (CENTRE + HALO_R), BOX="%d" % BOX, HALOR="%g" % HALO_R,
        P32=icon("favicon-32.png"), P16=icon("favicon-16.png"))
    body = fill(TEMPLATE_BODY, HLOCK=inline_svg(LOCKUP_INK, height=32, cls="hlock", label="Circlists"),
                LOGO=logo, ICONS=icons, APP=app_tab(), MOTION=motion_tab(), COLOUR=colour_tab(), TYPE=type_tab())
    style = fill(STYLE, FONTS=FONTS_URL, PAGE=CREAM, CARD=WHITE, LINE=LINE, HAIR=HAIRLINE, TEXT=INK, MUTED=SECONDARY, ACCENT=EMERALD,
                 EDGE=EDGE, SUNKEN=SUNKEN, FS=FONT_SANS, FM=FONT_MONO, INK=INK, CREAM=CREAM)
    style += fill(MOTION_CSS, EMERALD=EMERALD, WHITE=WHITE) + fill(COLOUR_TYPE_CSS, INK=INK, EMERALD=EMERALD, LINE=LINE,
                                                                OFFSET=LINK_OFFSET, THICK=LINK_THICK, PCT=str(DOORLINK_REST_PCT))
    full = ('<!doctype html>\n<html lang="en-GB"><head><meta charset="utf-8">\n'
            '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
            '<title>Circlists Brand</title>\n<style>%s</style></head>\n<body>\n%s\n<script>%s</script>\n</body></html>\n'
            % (style, body, SCRIPT))
    open(os.path.join(OUT, "circlists-brand.html"), "w").write(full)
    print("wrote circlists-brand.html (%d bytes)" % len(full))


if __name__ == "__main__":
    build()

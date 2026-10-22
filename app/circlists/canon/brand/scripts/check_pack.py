#!/usr/bin/env python3
"""Checks that hold the pack together. Prints every failure and exits non-zero if there is one.

  1. Tokens: every colour and type value in brand_tokens.py (which holds the SPEC's values) equals its token in the
     prototype's tokens.css. A disagreement is reported, never resolved: neither side is changed or preferred.
  2. Files: every file the spec names exists, and every file in assets/ is named by the spec (a share PNG,
     <stem>-<size>.png, counts when the spec names the stem's SVG and the size is one build_rasters.py makes).
  3. Numbers: the spec's numbers (box, radii, stroke, badge, 72%, corner, safe zone, lockup ratios, tittle,
     tracking) match brand_tokens.py, and the generated files carry them.
  4. Contrast: the text neutrals are AA on cream and white, as the spec says.

Usage: python check_pack.py [path-to-tokens.css]   (default: prototypes/app/circlists/canon/tokens.css beside the
wiki or business-ops repo). Needs the wiki venv, because it imports the build scripts' constants. Writes nothing."""
import math, os, re, struct, sys

HERE = os.path.dirname(os.path.abspath(__file__))
PACK = os.path.abspath(os.path.join(HERE, os.pardir))
sys.path.insert(0, HERE)
from brand_tokens import *
import build_lockup, build_motion, build_rasters


def default_tokens():
    p = HERE
    while p != os.path.dirname(p):
        if os.path.basename(p) in ("latentmagic-business-ops", "harness-intent-wiki"):
            return os.path.join(os.path.dirname(p), "prototypes", "app", "circlists", "canon", "tokens.css")
        p = os.path.dirname(p)
    return ""


TOKENS = sys.argv[1] if len(sys.argv) > 1 else default_tokens()
SPEC = open(os.path.join(PACK, "circlists-brand.md")).read()
failures, notes = [], []


def fail(group, msg):
    failures.append("[%s] %s" % (group, msg))


def css_vars(path):
    s = open(path).read()
    s = re.sub(r"(?s)/\*.*?\*/", "", s)
    return {m.group(1): m.group(2).strip() for m in re.finditer(r"(--[\w-]+)\s*:\s*([^;]+);", s)}


def norm(v):
    return re.sub(r"\s+", "", v).upper()


def has(text):
    if text not in SPEC:
        fail("numbers", "the spec does not say %r" % text)


# 1. tokens -------------------------------------------------------------------------------------
tok = css_vars(TOKENS)
for var, val in TOKEN_COLOURS + CHROME_COLOURS + TOKEN_TYPE:
    if var not in tok: fail("tokens", "%s is not in tokens.css" % var)
    elif norm(tok[var]) != norm(val): fail("tokens", "DISAGREE %s: spec/brand_tokens %s, tokens.css %s" % (var, val, tok[var]))
css = open(TOKENS).read()
for part in ("family=Inter:wght@400;500;600;700", "family=JetBrains+Mono:wght@400;500;600;700"):
    if part not in css or part not in FONTS_URL: fail("tokens", "font URL part %s differs from tokens.css" % part)
for fam, var in (("Inter", "--font-sans"), ("JetBrains Mono", "--font-mono")):
    if fam not in tok.get(var, ""): fail("tokens", "%s: family %s not in tokens.css (%s)" % (var, fam, tok.get(var)))
# tokens.css colours the spec has no value for: information, not a failure
covered = {v for v, _ in TOKEN_COLOURS + CHROME_COLOURS}
unspec = sorted(v for v, x in tok.items() if v.startswith("--color-") and v not in covered and not x.startswith("var("))
if unspec:
    notes.append("tokens.css colour tokens the spec does not give: " + ", ".join("%s %s" % (v, tok[v]) for v in unspec))

# 2. files --------------------------------------------------------------------------------------
EXT = r"(?:svg|png|ico|xml|md|py|sh|woff2|html|txt)"
ticked = set(re.findall(r"`([^`\s]+)`", SPEC))
named = {n for n in ticked | set(re.findall(r"\[([^\]\s/]+)\]", SPEC)) if re.fullmatch(r"[A-Za-z0-9_][\w.-]*\.%s" % EXT, n)}
on_disk = {}
for root, dirs, files in os.walk(PACK):
    dirs[:] = [d for d in dirs if d != "__pycache__"]
    for f in files:
        on_disk.setdefault(f, []).append(os.path.relpath(os.path.join(root, f), PACK))
for n in sorted(named):
    if n not in on_disk and not os.path.exists(os.path.join(PACK, os.pardir, n)):
        fail("files", "the spec names %s, which does not exist" % n)
sizes = {s for _, (_, ss) in build_rasters.SHARE.items() for s in ss}
for f, paths in sorted(on_disk.items()):
    for p in paths:
        if not p.startswith("assets" + os.sep) or f.endswith(".md") or f == ".DS_Store":
            continue
        stem, ext = os.path.splitext(f)
        m = re.fullmatch(r"(.+)-(\d+)", stem)
        if f in named or stem in ticked: continue
        if ext == ".png" and m and m.group(1) + ".svg" in named and int(m.group(2)) in sizes: continue
        fail("files", "%s is in assets/ but the spec does not name it" % p)
for f in ("brand_tokens.py", "check_pack.py", "build_all.sh", "build_mark.py", "build_motion.py", "inter-latin-wght-normal.woff2", "OFL.txt"):
    if f not in named: fail("files", "the spec does not name scripts/%s" % f)

# 3. numbers ------------------------------------------------------------------------------------
has("`0 0 %d %d`" % (BOX, BOX))
has("`circle r=%g`, fill `%s`" % (HALO_R, SAGE))
has("`circle r=%g`, fill `%s`" % (DISC_R, EMERALD))
has("`circle r=%g`, no fill, stroke `%s` width `%g`" % (RING_R, WHITE, RING_W))
if abs(RING_R - RING_W / 2 - DISC_R) > 1e-9: fail("numbers", "the ring's inner edge is not on the disc edge")
has("~%d%% of the box" % round(HALO_R / BOX * 100))
has("~%d%% of the box" % round(DISC_R / BOX * 100))
has("**`circle r=%g`** at `cx=%d cy=%d`" % (BADGE_R, BADGE_AT[0], BADGE_AT[1]))
if abs(BADGE_KEYLINE_R - BADGE_R - RING_W / 2) > 1e-9: fail("numbers", "the badge keyline is not the ring weight outside the badge")
brk = math.hypot(BADGE_AT[0] - CENTRE, BADGE_AT[1] - CENTRE) + BADGE_R - HALO_R
has("~%.1f units" % brk)
edge = BADGE_AT[0] + BADGE_KEYLINE_R + RING_W / 2
has("%g of the %d box" % (edge, BOX))
has("%g margin" % (CENTRE + HALO_R))
if edge > CENTRE + HALO_R + 0.5: fail("numbers", "the badge's outer edge %g is outside the mark's margin" % edge)
has("(**~%d%%**)" % ICON_PCT)
has("**%d%% of the visible tile**" % ICON_PCT)
has("inner %d dp of Android's %d dp adaptive layer" % (ADAPTIVE_VISIBLE_DP, ADAPTIVE_DP))
has("radius ~%d%% of the tile" % round(CORNER_FRAC * 100))
has("widened to **%g** (from the ring's %g)" % (BADGE_GAP, RING_W))
has("The %dpx PNG" % BADGE_SIZE)
has("rendered at %d×" % SS)
has("`-0.01em`")
if TRACK_EM != -0.01 or TRACKING != "-0.01em": fail("numbers", "tracking is not -0.01 em")
has("**⌀ %g × cap-height**" % TITTLE_DIA_OVER_CAP)
has("raised to %g × cap-height above the baseline**" % TITTLE_CY_OVER_CAP)
has("Mark height = **%g×**" % MARK_CAP_RATIO)
has("gap = **%g×**" % GAP_CAP_RATIO)
has("Inter Bold (%d)" % WORDMARK_WEIGHT)
has("**second** `i`")
for n in (EMERALD, SAGE, INK, CREAM, WHITE, SECONDARY, TERTIARY):
    has("`%s`" % n)
has("**Inter**"); has("**JetBrains Mono**")
halo_dp = ADAPTIVE_VISIBLE_DP * ICON_PCT / 100.0
if not 48 <= halo_dp <= 66: fail("numbers", "the halo, %.1f dp, is outside Android's 48-66 dp logo guide" % halo_dp)
if halo_dp / 2 > ANDROID_SAFE_DP / 2: fail("numbers", "the halo is outside the %d dp safe zone" % ANDROID_SAFE_DP)
if ICON_PCT / 2.0 > SAFE_CIRCLE: fail("numbers", "the halo is outside the maskable safe circle (%d%% of the edge)" % SAFE_CIRCLE)
if build_rasters.ICON_PCT != ICON_PCT or build_rasters.BADGE_SIZE != BADGE_SIZE or build_rasters.SS != SS:
    fail("numbers", "build_rasters.py constants differ from brand_tokens.py")
if build_lockup.MARK_CAP_RATIO != MARK_CAP_RATIO or build_lockup.GAP_CAP_RATIO != GAP_CAP_RATIO:
    fail("numbers", "build_lockup.py ratios differ from brand_tokens.py")
try:
    from fontTools.ttLib import TTFont
    f = TTFont(os.path.join(HERE, "inter-latin-wght-normal.woff2"))
    if f["head"].unitsPerEm != FONT_UPM: fail("numbers", "FONT_UPM %d, font %d" % (FONT_UPM, f["head"].unitsPerEm))
    if f["OS/2"].sCapHeight != CAP: fail("numbers", "CAP %g, font %d" % (CAP, f["OS/2"].sCapHeight))
except ImportError:
    fail("numbers", "fontTools missing: run with the wiki venv")
try:
    build_motion.check()
except AssertionError as e:
    fail("numbers", "motion file differs from brand_tokens.py: %s" % e)

# the generated files carry the numbers
mark = open(os.path.join(PACK, "assets", "mark", "circlists-mark.svg")).read()
for r in (HALO_R, DISC_R, RING_R):
    if 'r="%g"' % r not in mark: fail("numbers", "circlists-mark.svg has no circle r=%g" % r)
for hexv in (SAGE, EMERALD, WHITE):
    if hexv.lower() not in mark: fail("numbers", "circlists-mark.svg lacks %s" % hexv)
notif = open(os.path.join(PACK, "assets", "icons", "favicon-notification.svg")).read()
for r in (BADGE_R, BADGE_KEYLINE_R):
    if 'cx="%d" cy="%d" r="%g"' % (BADGE_AT + (r,)) not in notif: fail("numbers", "favicon-notification.svg has no badge circle r=%g" % r)


def png_size(path):
    with open(path, "rb") as fh:
        head = fh.read(24)
    return struct.unpack(">II", head[16:24])


for rel, edge_px in [("icons/favicon-16.png", 16), ("icons/favicon-32.png", 32), ("icons/apple-touch-icon.png", 180),
                     ("icons/icon-192.png", 192), ("icons/icon-512.png", 512), ("icons/maskable-icon-192.png", 192),
                     ("icons/maskable-icon-512.png", 512), ("icons/app-store-icon-1024.png", 1024), ("icons/play-store-icon-512.png", 512),
                     ("icons/notification-badge-%d.png" % BADGE_SIZE, BADGE_SIZE)] + \
                    [("native/" + n, 1024) for n in ("icon-only.png", "icon-foreground.png", "icon-background.png", "icon-monochrome.png",
                                                     "ios-icon-dark.png", "ios-icon-tinted.png")]:
    p = os.path.join(PACK, "assets", rel)
    if not os.path.exists(p): fail("files", "assets/%s was not built" % rel)
    elif png_size(p) != (edge_px, edge_px): fail("numbers", "assets/%s is %dx%d, not %d square" % ((rel,) + png_size(p) + (edge_px,)))

# the type scale, the design-system colours and the link rules the spec restates
for name, _, val, _ in DS_STATES: has("**%s** `%s`" % (name, val))
for name, _, val in WEIGHTS: has("**%s** `%s`" % (name, val))
for name, _, val, _ in SIZES: has("**%s** `%s`" % (name, val))
for name, _, val in LEADINGS: has("**%s** `%s`" % (name, val))
for name, _, val, _ in TRACKINGS: has("**%s** `%s`" % (name, val))
canon = os.path.dirname(os.path.abspath(TOKENS))
door = [l for l in open(os.path.join(canon, "circlists.html")) if l.strip().startswith(".circ-doorlink {")]
bare = re.search(r"(?m)^a \{([^}]*)\}", re.sub(r"(?s)/\*.*?\*/", "", css))
bare_hover = re.search(r"(?m)^a:hover \{([^}]*)\}", css)
if len(door) != 1: fail("tokens", "circlists.html has no single .circ-doorlink rule")
else:
    d = door[0]
    for want in ("text-decoration-thickness: %s" % LINK_THICK, "text-underline-offset: %s" % LINK_OFFSET,
                 "var(--color-accent) %d%%" % DOORLINK_REST_PCT, "color: var(--color-accent)"):
        if want not in d: fail("tokens", ".circ-doorlink in circlists.html lacks %r" % want)
if not bare or not bare_hover: fail("tokens", "tokens.css has no bare `a` rule")
else:
    for want in ("text-decoration-thickness: %s" % LINK_THICK, "text-underline-offset: %s" % LINK_OFFSET, "var(%s)" % BARE_LINK_REST):
        if want not in bare.group(1): fail("tokens", "tokens.css `a` lacks %r" % want)
    if "var(--color-fg-1)" not in bare_hover.group(1): fail("tokens", "tokens.css `a:hover` is not Ink")
for phrase in ("`.circ-doorlink`", "35%", "prototype value"): has(phrase)

# 4. contrast -----------------------------------------------------------------------------------
for name, hexv in (("Primary", INK), ("Secondary", SECONDARY), ("Tertiary", TERTIARY)):
    for gname, g in (("cream", CREAM), ("white", WHITE)):
        c = contrast(hexv, g)
        if c < 4.5: fail("contrast", "%s %s on %s is %.2f:1, under AA 4.5:1" % (name, hexv, gname, c))

# 5. generated text: the board and READMEs point nowhere outside the pack
for path in [os.path.join(PACK, "README.md"), os.path.join(PACK, "circlists-brand.html")]:
    body = open(path).read()
    for bad in ("plan.md", "_resources", "subtask"):
        if bad in body: fail("files", "%s refers outside the pack (%s)" % (os.path.relpath(path, PACK), bad))

for n in notes:
    print("note: " + n)
if failures:
    print("\n".join(failures))
    print("%d check(s) failed" % len(failures))
    sys.exit(1)
print("check_pack: tokens match tokens.css (%d colours, %d type values); %d files named in the spec, all present, every asset named; spec numbers match the scripts and the generated files; text neutrals pass AA"
      % (len(TOKEN_COLOURS + CHROME_COLOURS), len(TOKEN_TYPE), len(named)))

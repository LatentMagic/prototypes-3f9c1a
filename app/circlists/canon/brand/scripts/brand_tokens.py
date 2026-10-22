"""Circlists brand values, one place. The values are circlists-brand.md's (the spec). check_pack.py
compares the colour and type values with the prototype's tokens/CSS (prototypes/app/circlists/canon/tokens.css)
and the numbers with the spec's text; where they disagree it reports and does not choose."""

# ---- palette (spec section 1) -----------------------------------------------------------------
EMERALD = "#047857"      # the disc, the wordmark tittle, primary brand colour; tokens --color-accent
SAGE = "#8BBFAD"         # the halo (opaque); tokens --color-sage
INK = "#0A0A0A"          # the wordmark and body text; tokens --color-fg-1
CREAM = "#FAFAF7"        # page / app ground, and the installed-icon ground; tokens --color-page
WHITE = "#FFFFFF"        # the white ring in the mark; tokens --color-surface
SECONDARY = "#525252"    # supporting text; tokens --color-fg-2
TERTIARY = "#6E6E6B"     # captions and meta; tokens --color-fg-3

# The rest of the prototype's colour tokens that the spec restates (spec section 1), each with the role
# tokens.css's own comments give it: (name, css variable, value, role). check_pack.py compares each with the file.
# Left out on purpose: --color-accent-warm and --color-accent-cool (tokens.css marks them not approved) and
# --color-surface-raised (reserved).
DS_STATES = [
    ("Accent hover", "--color-accent-hover", "#036549", "4% darker than Emerald."),
    ("Accent press", "--color-accent-press", "#024F3A", "8% darker than Emerald."),
    ("Accent ring", "--color-accent-ring", "rgba(4, 120, 87, 0.30)", "Emerald at 30%, the focus ring's colour token (--ring-color)."),
    ("Accent soft", "--color-accent-soft", "#ECFDF5", "Soft emerald tint. Reserved."),
    ("New words", "--color-new-words", "#5E9C86", "Marks unseen content. Its own colour, not the sage: #8BBFAD fails WCAG 1.4.11 on the white surface and #5E9C86 clears 3:1. Dark value, for when a dark theme exists: #8BBFAD."),
    ("Border strong", "--color-border-strong", "#0A0A0A", "Deliberate emphasis only."),
    ("Scrim", "--color-scrim", "rgba(10, 10, 10, 0.40)", "Overlay behind modal layers. Flat, no blur."),
    ("Destructive", "--color-destructive", "#991B1B", "Destructive actions and errors."),
    ("Destructive hover", "--color-destructive-hover", "#7F1818", "Destructive, hovered."),
    ("Destructive press", "--color-destructive-press", "#641212", "Destructive, pressed."),
    ("Destructive ring", "--color-destructive-ring", "rgba(153, 27, 27, 0.30)", "Destructive at 30%."),
]

# (css variable in tokens.css, value). check_pack.py compares each with the file.
TOKEN_COLOURS = [("--color-accent", EMERALD), ("--color-sage", SAGE), ("--color-fg-1", INK), ("--color-page", CREAM),
                 ("--color-surface", WHITE), ("--color-fg-inverse", WHITE), ("--color-fg-2", SECONDARY),
                 ("--color-fg-3", TERTIARY)] + [(v, x) for _, v, x, _ in DS_STATES]

# Board chrome only: neutrals the board page draws itself with. Not in the spec, not brand colours;
# read from tokens.css so the board looks like the product. check_pack.py compares them too.
LINE = "#DCDCD8"         # tokens --color-border-1: card borders
HAIRLINE = "#E8E8E5"     # tokens --color-border-2: separators
EDGE = "#949490"         # tokens --color-border-3: resting control edges
SUNKEN = "#F5F5F2"       # tokens --color-surface-sunken
CHROME_COLOURS = [("--color-border-1", LINE), ("--color-border-2", HAIRLINE), ("--color-border-3", EDGE),
                  ("--color-surface-sunken", SUNKEN)]

# ---- type (spec sections 3 and 5) -------------------------------------------------------------
FONT_SANS = "'Inter'"
FONT_MONO = "'JetBrains Mono'"
WORDMARK_WEIGHT = 700    # Inter Bold; tokens --weight-bold
TRACKING = "-0.01em"     # tokens --tracking-tight
# Type scale, tokens.css (spec section 5): sizes, leadings and tracking are listed separately there and are
# restated as listed, with the role in tokens.css's comments. No size is paired with a leading here.
WEIGHTS = [("Regular", "--weight-regular", "400"), ("Medium", "--weight-medium", "500"),
           ("Semibold", "--weight-semibold", "600"), ("Bold", "--weight-bold", "700")]
SIZES = [("xs", "--text-xs", "12px", "Mono caption, badges."), ("sm", "--text-sm", "13px", "Secondary body, meta."),
         ("base", "--text-base", "15px", "Body."), ("md", "--text-md", "16px", ""),
         ("lg", "--text-lg", "18px", ""), ("xl", "--text-xl", "20px", ""),
         ("2xl", "--text-2xl", "24px", ""),
         ("3xl", "--text-3xl", "32px", ""),
         ("4xl", "--text-4xl", "40px", "Hero, brand moments only.")]
LEADINGS = [("tight", "--leading-tight", "1.25"), ("snug", "--leading-snug", "1.35"),
            ("normal", "--leading-normal", "1.5"), ("relaxed", "--leading-relaxed", "1.6")]
TRACKINGS = [("tight", "--tracking-tight", "-0.01em", "Large titles."), ("normal", "--tracking-normal", "0", "Body."),
             ("wide", "--tracking-wide", "0.02em", "Mono labels and all-caps text.")]
TOKEN_TYPE = ([(v, x) for _, v, x in WEIGHTS] + [(v, x) for _, v, x, _ in SIZES] + [(v, x) for _, v, x in LEADINGS]
              + [(v, x) for _, v, x, _ in TRACKINGS])

# Link underlines, from the prototype (spec section 5). check_pack.py compares them with the two rules.
#   inline `.circ-doorlink`, canon/circlists.html:330
#   bare `a`, tokens.css ~254
LINK_THICK = "1px"
LINK_OFFSET = "2px"
DOORLINK_REST_PCT = 35   # accent at 35% at rest (color-mix in oklab), full accent on hover and focus
BARE_LINK_REST = "--color-border-1"     # bare `a`: border-1 underline at rest, Ink on hover
# The Google Fonts URL tokens.css imports; check_pack.py compares the family parts.
FONTS_URL = ("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700"
             "&family=JetBrains+Mono:wght@400;500;600;700&display=swap")

# ---- mark geometry, 48 box (spec section 2) ---------------------------------------------------
BOX = 48
CENTRE = 24
HALO_R = 22.5
DISC_R = 14.25
RING_R = 14.925
RING_W = 1.35
HALO_FRAC = 2 * HALO_R / BOX * 100     # halo diameter as % of the box (93.75)

# arrival badge on the notification icon
BADGE_AT = (36, 36)
BADGE_R = 9.4
BADGE_KEYLINE_R = 10.075
# notification badge (single-colour silhouette)
BADGE_GAP = 1.8
BADGE_SIZE = 96

# ---- installed icon (spec section 2) ----------------------------------------------------------
ICON_PCT = 72            # halo as % of the tile
SS = 4                   # supersample factor
CORNER_FRAC = 0.2237     # `any` icon corner radius as a fraction of the tile (spec: ~22%)
SAFE_CIRCLE = 40         # maskable safe circle radius, % of the tile edge
ADAPTIVE_DP = 108        # Android adaptive layer
ADAPTIVE_VISIBLE_DP = 72
ANDROID_SAFE_DP = 66     # zone no launcher mask cuts

# ---- wordmark and lockup (spec sections 3 and 4) ----------------------------------------------
WORD = "Circlists"
TRACK_EM = -0.01
PAD_EM = 0.06
TITTLE_DIA_OVER_CAP = 0.25
TITTLE_CY_OVER_CAP = 1.18
TITTLE_ON_I = 2          # the second `i` carries the green tittle
FONT_UPM = 2048         # Inter units per em; check_pack.py compares it with the vendored font
CAP = 1490.0             # Inter cap-height, font units
MARK_CAP_RATIO = 1.5     # mark halo diameter / cap height
GAP_CAP_RATIO = 0.40     # gap / cap height

# ---- motion (circlists-motion.md; the animated SVGs in ../assets/motion are the sources) --------------
PULSE_CYCLE = 3.0
PULSE_AMP = 1.075
PULSE_TONE = 1.09
PULSE_DISC_R = 15.2
PULSE_RING_R = 15.875
SPINNER_PACE = 1.4
SPINNER_ROTATE = 1.369
SPINNER_GROW = 1.786
SPINNER_ARC_R = 19.05
SPINNER_BAND = 5.3
MICRO_CYCLE = 3.8
MICRO_EASE = "cubic-bezier(0.45, 0, 0.15, 1)"
MICRO_SWEEP = 86
MICRO_VIEWBOX = "-2 -2 52 52"


def contrast(a, b):
    """WCAG contrast ratio between two #RRGGBB colours."""
    def lum(h):
        c = [int(h[i:i + 2], 16) / 255 for i in (1, 3, 5)]
        c = [v / 12.92 if v <= 0.03928 else ((v + 0.055) / 1.055) ** 2.4 for v in c]
        return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]
    la, lb = sorted((lum(a), lum(b)), reverse=True)
    return (la + 0.05) / (lb + 0.05)

#!/usr/bin/env python3
"""Circlists motion, as the board needs it. The three animated SVGs in ../assets/motion (pulse, spinner,
micro) are hand-authored against circlists-motion.md and are the sources: this script does not
write them. It checks each one against brand_tokens.py (colours, geometry, tempo) so a changed
file or a changed token fails loudly, and it gives build_board.py the markup to inline, so the
Motion tab shows the real files and cannot drift from them.
Stdlib only."""
import os, re
from brand_tokens import *

HERE = os.path.dirname(os.path.abspath(__file__))
MOTION = os.path.join(HERE, os.pardir, "assets", "motion")
FILES = {"pulse": "circlists-pulse.svg", "spinner": "circlists-spinner.svg", "micro": "circlists-micro.svg"}


def read(key):
    return open(os.path.join(MOTION, FILES[key])).read()


def check():
    """Assert each file carries the tokens it should. Returns nothing; raises AssertionError."""
    p, s, m = read("pulse"), read("spinner"), read("micro")
    for name, svg in (("pulse", p), ("spinner", s), ("micro", m)):
        assert SAGE.lower() in svg.lower() and EMERALD.lower() in svg.lower(), name + ": sage/emerald missing"
        assert "prefers-reduced-motion: reduce" in svg, name + ": no reduced-motion rule"
    assert 'r="%g"' % HALO_R in p and 'r="%g"' % PULSE_DISC_R in p and 'r="%g"' % PULSE_RING_R in p, "pulse geometry"
    assert "%gs linear infinite" % PULSE_CYCLE in p, "pulse cycle"
    assert "scale(%.4f)" % PULSE_AMP in p and "brightness(%.3f)" % PULSE_TONE in p, "pulse amp or tone"
    assert 'r="%g"' % DISC_R in s and 'r="%g"' % SPINNER_ARC_R in s and 'stroke-width="%g"' % SPINNER_BAND in s, "spinner geometry"
    assert "%gs linear infinite" % SPINNER_ROTATE in s and "%gs ease-in-out infinite" % SPINNER_GROW in s, "spinner tempo"
    assert 'viewBox="%s"' % MICRO_VIEWBOX in m and 'r="%g"' % DISC_R in m, "micro geometry"
    assert "%gs %s infinite" % (MICRO_CYCLE, MICRO_EASE) in m and "translateX(%dpx)" % MICRO_SWEEP in m, "micro tempo"


def inline(key, px, label):
    """The file's own <svg> (style block included) with width and height set to px and a new label.
    Safe to inline more than once: every class and keyframe is prefixed cl-, ids are file-specific, and
    repeats are identical."""
    s = re.sub(r"^<\?xml[^>]*\?>\s*", "", read(key))
    root = re.search(r"<svg\b[^>]*>", s).group(0)
    new = re.sub(r'width="[^"]*"', 'width="%d"' % px, root, count=1)
    new = re.sub(r'height="[^"]*"', 'height="%d"' % px, new, count=1)
    new = re.sub(r'aria-label="[^"]*"', 'aria-label="%s"' % label, new, count=1)
    return s.replace(root, new, 1)


# The in-file reduced-motion rules, repeated behind a class so the board's toggle can show them without
# changing the OS setting. Mirrors the rule inside each file.
RM_CSS = (".panel.rm .cl-halo{animation:none}.panel.rm .cl-rotor{display:none}.panel.rm .cl-halo-static{display:inline}"
          ".panel.rm .cl-reveal{display:none}")

if __name__ == "__main__":
    check()
    print("motion: pulse, spinner and micro match brand_tokens.py")

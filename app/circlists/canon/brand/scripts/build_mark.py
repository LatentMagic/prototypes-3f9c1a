#!/usr/bin/env python3
"""brand_tokens.py -> assets/mark/circlists-mark.svg: three concentric circles, sage halo, emerald disc,
white ring (spec section 2). The mark is drawn from the tokens, so there is no separate source file to
drift. build_rasters.py reads the file back for every icon, the notification icon and the badge."""
import os
from brand_tokens import *

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, os.pardir, "assets", "mark", "circlists-mark.svg")


def mark_svg(title="Circlists"):
    c = CENTRE
    return ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 %d %d" role="img" aria-label="%s">\n'
            '  <title>%s</title>\n'
            '  <circle cx="%g" cy="%g" r="%g" fill="%s"/>\n'
            '  <circle cx="%g" cy="%g" r="%g" fill="%s"/>\n'
            '  <circle cx="%g" cy="%g" r="%g" fill="none" stroke="%s" stroke-width="%g"/>\n'
            '</svg>\n'
            % (BOX, BOX, title, title,
               c, c, HALO_R, SAGE.lower(), c, c, DISC_R, EMERALD.lower(), c, c, RING_R, WHITE.lower(), RING_W))


def main():
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    open(OUT, "w").write(mark_svg())
    print("wrote assets/mark/circlists-mark.svg")


if __name__ == "__main__":
    main()

# Card preview stand-ins — BIZ-80

Real Open Graph / thumbnail images, pulled from live sources, for use as mock card previews in the metadata-extraction prototype. Each is the actual preview image that source serves.

| File | Dimensions | Source URL |
| ---- | ---------- | ---------- |
| [github-react.png](github-react.png) | 1200×600 | https://github.com/facebook/react |
| [youtube-hqdefault.jpg](youtube-hqdefault.jpg) | 480×360 | https://www.youtube.com/watch?v=LKtk3HCgTa8 |
| [youtube-maxres.jpg](youtube-maxres.jpg) | 1280×720 | https://www.youtube.com/watch?v=LKtk3HCgTa8 (extra — crisper 16:9 stand-in) |
| [pragmatic-engineer.jpg](pragmatic-engineer.jpg) | 920×480 | https://newsletter.pragmaticengineer.com/p/the-software-engineering-industry-in-2024 |
| [blog-overreacted.png](blog-overreacted.png) | 1200×630 | https://overreacted.io/a-complete-guide-to-useeffect/ |

Notes:

- **github-react.png** — GitHub's auto-generated repo OG card (branded, repo stats). Represents the reliable-image case.
- **youtube-\*** — YouTube thumbnails. `hqdefault` is the one requested (480×360, always present); `maxres` added as a higher-res 16:9 alternative.
- **pragmatic-engineer.jpg** — the newsletter's branded OG subscribe card (what Substack actually serves as `og:image` for this post). Represents a source where the preview is a brand card, not article art.
- **blog-overreacted.png** — a personal-blog OG image at the canonical 1200×630. Represents the general blog-post case.

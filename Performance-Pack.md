# PERFORMANCE PACK — Queue #14 · Wedding & Event Booking Demo
**Measured on disk, 2026-11-21. No estimates. Served Core Web Vitals: PENDING** — to be measured by the main agent on the served GitHub Pages preview; no CWV numbers are claimed or invented here.

## Code weight (HTML+CSS+JS, all pages)
| File | Bytes |
|---|---|
| index.html | 4,727 |
| venues.html | 3,976 |
| venue.html | 2,771 |
| packages.html | 3,059 |
| enquire.html | 4,963 |
| enquiries.html | 2,755 |
| css/style.css | 11,018 |
| js/logic.js | 14,407 |
| js/app.js | 19,485 |
| **Total code** | **67,161 B** (budget < 400 KB — 17% of budget) |

(The battery re-measures the total on every run and fails above 400 KB.)

## Media weight (per-image, hard ceiling ≤120 KB enforced before referencing — lesson 39)
| Image | Bytes | Role |
|---|---|---|
| assets/hero.jpg | 116,413 | Home hero (marquee reception) |
| assets/venue-roshanara.jpg | 111,670 | Roshanara Marquee, Lahore |
| assets/venue-ivory.jpg | 111,202 | The Ivory Court, Lahore |
| assets/venue-palm.jpg | 117,306 | Palm Grove Lawns, Gujranwala |
| assets/venue-noor.jpg | 114,776 | Noor Mahal Gardens, Gujranwala |
| assets/venue-clifton.jpg | 114,011 | Clifton Pearl Hall, Karachi |
| assets/venue-seabreeze.jpg | 107,036 | Seabreeze Terrace, Karachi |
| assets/stage-detail.jpg | 114,137 | Packages page — stage detail |
| **Total media** | **906,551 B** (budget ≤ 1.6 MB — 55%) |

## Discipline choices
- Zero frameworks, zero CDN libraries; the only external request besides same-origin files is Google Fonts CSS (Marcellus + Karla) with preconnect + display=swap.
- One CSS file, two JS files; the logic module is shared with the test battery (no duplicate data payload).
- One photo per venue (lesson 32 applied per-item here because the venue IS the product); card images eager by design (no lazy/reveal blank-panel family — content is visible by default, no JS-gated reveal anywhere).
- No sticky/fixed chrome except the transient cancel toast (auto-dismisses) — full-page captures carry no stitch artefacts (lesson 35).
- Motion: one Ken Burns hero animation, disabled under `prefers-reduced-motion` (reduced-motion capture set filed).
- Video: none — photo + CSS motion (generation region-blocked 403, not attempted).

## Served CWV
PENDING — external measurement on the main agent's GitHub Pages preview (LCP / INP / CLS). Area 7 of the scorecard is held at partial points for exactly this reason.

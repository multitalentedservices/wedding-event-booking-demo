# SIGNOFF PACK (§0) — Queue #14 · Wedding & Event Booking Demo
**For:** AICOS-112 §0 design sign-off recording (external act — pending; this pack is the build-side evidence).
**Build:** Dilnaaz Weddings & Events (fictional) · client-facing owner BalanceBit Solutions · production MTS · Date: 2026-11-21.

## Design direction note
"Editorial Luxury — wedding register." A season-led venue book, not a brochure: the home page opens on the Oct–Feb season and a promise about Saturdays, every venue card prints fee + capacity + live free-Saturday count, and every venue page carries its whole season as a strip of date buttons whose booked days are visibly disabled. Luxury is carried by restraint — one burgundy, one serif, gold confined to small-caps labels and hairlines on the dark ground — and by honesty: prices and booked dates are printed before any enquiry is asked for. The §0 screenshot test: a burgundy-on-ivory page whose centrepiece is a strip of Saturdays marked Available / Already booked / Booked by you could not belong to a shop, clinic, directory, salon, tour operator or any other predecessor industry.

## References actually used
| Reference | Opened | What was taken (pattern only) |
|---|---|---|
| Venuquest — Pakistan's wedding marketplace (venuquest.pk) | 2026-11-21 (search + fetch) | Upfront venue pricing, season-led framing, date+guests+city as the first filter questions |
| Fat Cow Web Design — "How to Design a Website for a Wedding Venue" | 2026-11-21 (search + fetch) | The three-objection page order: date availability → affordability → capacity, answered in that order |
| Design Inspiration Library C1 Stripe / C2 Linear | library, researched 2026-11-21 | Restraint discipline only (hierarchy before decoration); no wedding section existed |

No branding, copy, venue data or feature claims were copied from any reference. All venues, packages, dates and reviews are fictional demo data.

## Palette / type token table (complete — the only colours in the build)
| Token | Hex | Role |
|---|---|---|
| --ivory | #FAF6EF | Page ground |
| --ivory-2 | #F3EBDD | Alt surface, tags, focus ring on fields |
| --paper | #FFFFFF | Cards and panels |
| --burgundy | #5C1A24 | Primary: buttons, links, labels, focus outline |
| --burgundy-dark | #3E1119 | Demo banner, dark band, button hover |
| --ink | #2A2320 | Body text, headings, toast |
| --muted | #655349 | Secondary text |
| --line | #D8CBB8 | Borders/dividers |
| --gold | #E3B959 | ONLY small-caps labels + hairlines ON the dark burgundy ground |
| --gold-hairline | #8A6D1F | Review stars on white cards (text-role, AA-proven) |
| --error | #B3261E | SEMANTIC ONLY: form error text |
| --disabled-bg / --disabled-text | #E7DFD2 / #6E5F55 | Disabled buttons + disabled date buttons (solid state, 4.63:1) |

Type: Marcellus (display serif) + Karla 400/600/700/800 (Google Fonts), system fallbacks; base 17px; inputs 16px (no iOS zoom). Radius 14px cards / 10px controls. All 13 text pairings proven ≥4.5:1 (focus 11.97:1 ≥3:1) from hex in the battery.

## Component system (one of each)
Buttons: `.btn` + primary (filled burgundy) / ghost / wa roles — identical geometry on all 6 pages, plus a solid **disabled state** of the same system (grey ground, readable muted text, not-allowed cursor, hover cannot revive it). Dates: one `.date-btn` component in three states — available (burgundy outline), selected (filled burgundy), disabled-booked (grey, strikethrough, "Already booked" / "Booked by you"). Fields: one 52px-min-height, 2px-line-border system for text/tel/email/number/select + one native checkbox row. Cards: one venue card (media 3:2, tags, name, area/capacity, fee, free-Saturday count, two actions) and one package card used on home, venue and packages pages.

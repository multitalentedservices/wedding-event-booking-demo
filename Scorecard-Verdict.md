# VISUAL QUALITY SCORECARD — VERDICT
Build: Dilnaaz Weddings & Events — Wedding & Event Booking Demo (Queue #14, FINAL) (client-facing owner: BalanceBit Solutions · production: MTS)
Build type / builder: Business Website Build (AICOS-105 pattern) · Preview URL: local file build (served preview pending — main agent)
Date of pass: 2026-11-21 · Scored by: AICOS-115 pattern · Pass #: 1

 1. Visual identity & originality   13 / 15   Evidence: Signoff-Pack.md filed (design direction, references actually used, full token table); desktop + phone captures read against it. Held 2 pts: AICOS-112 §0 sign-off RECORDING is an external act, not yet done.
 2. UI/UX & usability               14 / 15   Evidence: full flow run 21/21 (screenshots/flows/flow-log.txt) incl. error + empty states; the one conversion path (venue → date → enquiry → confirmation) completed unaided in the rendered run. 1 pt margin held on judgement.
 3. Typography & composition        10 / 10   Evidence: Marcellus + Karla pairing as specified in Signoff-Pack; hierarchy/spacing read in all 18 standard captures at 390/768/1440.
 4. Animation & interactions         9 / 10   Evidence: interaction inventory observed in captures + flows (filters, date strips, live totals, toasts, confirmation focus); Ken Burns hero disabled in the reduced-motion set (18 captures). 1 pt margin: a single restrained motion pattern by design.
 5. Responsive design                10 / 10   Evidence: 18 standard combos + 320px probe + nojs/reduced sets — 0 overflow / 0 leaf text-overflow / 0 broken images in every audit (screenshots/*/audit.json).
 6. Functionality                    15 / 15   Evidence: battery 132/132 (tests-output.log); rendered flow 21/21 with WhatsApp FIRING recorded in the local log (lesson 21), enquiry WD-DEMO-8048 at PKR 1,470,000 exact and itemised, booked-date rejection naming venue + date + nearest alternatives, capacity boundary pair in rendered content, cancel-frees-date before/after captures.
 7. Performance                       6 / 10   Evidence: Performance-Pack.md — measured code 67,161 B, media 906,551 B / 8 photos (max 117,306 B). Held 4 pts: served-preview CWV (LCP/INP/CLS) is PENDING the main agent's GitHub Pages measurement; no numbers invented.
 8. Accessibility                     5 /  5   Evidence: 14 contrast assertions computed from hex in the battery (all ≥4.5:1, focus 11.97:1 ≥3:1); keyboard walk filed (screenshots/keyboard/keyboard-walk.md) — visible focus at every stop on catalogue filters, enquiry form and both date strips; booked dates are disabled buttons and correctly leave the Tab order; primary targets ≥44px.
 9. SEO                               5 /  5   Evidence: unique title/meta per page (battery-asserted), semantic heading order, sitemap.xml + robots.txt, internal linking per IA, alt text on every image.
10. Security                          4 /  5   Evidence: no secrets/credentials in source (battery-asserted), zero live endpoints, no external embeds, demo data only in localStorage; no packages installed (nothing to vet). 1 pt held: a localStorage demo has no server-side spam/abuse surface to audit — the control is absence, recorded honestly.

TOTAL: 91 / 100   (target ≥ 90)

BLOCKING FAILURES (security / data integrity / functionality):
- None.

UNTESTED AREAS (score invalid without evidence):
- None build-side. Two EXTERNAL acts remain and are named, not scored around: (1) served-preview CWV measurement (Area 7, 4 pts held); (2) AICOS-112 §0 sign-off recording (Area 1, 2 pts held).

VERDICT:  [ ] APPROVE   [X] REJECT   [ ] REJECT — BLOCKED   [ ] REJECT — INCOMPLETE
Reasons: total 91 ≥ 90 with no blocking failure and no untested build-side area; the verdict stays REJECT under the owner's 100-bar standard until the two external acts above are recorded — the same position as Queues #11, #12 and #13. No build defects outstanding.
Next step: [X] To AICOS-025 release gate (with external acts named)   [ ] Back to Gate 5   [ ] Back to Gate 2

## COMPONENT-CONSISTENCY PASS (done-gate — one line per page, read from rendered captures AFTER fixes + re-capture)
- **index (home)** — PASS. One button system (filled-burgundy primary + ghost secondary in the hero; the same two roles on all 3 featured venue cards and package teasers), fact cards one anatomy, dark band uses gold only as its eyebrow + hairline, package cards identical to the packages page component. Read from index-phone.png + index-desktop.png.
- **venues (catalogue)** — PASS. The same venue card as home (verified side-by-side across all 6 cards: tags, name, area/capacity, fee, free-Saturday count, filled + outline actions); filter panel uses the one field system (4 native selects, labels above, 52px); empty state is the shared dashed-panel anatomy with the one primary button as reset. Read from venues-phone.png + venues-desktop.png + flows/flow-empty-state.png.
- **venue (detail, id=2)** — PASS, including the disabled state. Date strip is one button component in three visible states: available (burgundy outline), booked (solid grey ground, strikethrough, "Already booked" sub-label — disabled at a glance, lesson 50), and after the flow enquiry "Booked by you"; package cards below are the same component as the packages page with venue-preselected links. Read from venue-phone.png + flows/flow-venue-before.png + flow-venue-after.png.
- **packages** — PASS. Three package cards one anatomy (the featured card differs only by its 2px burgundy border + filled button role, the same emphasis pattern as home), add-on table uses the shared total-table treatment, worked example's arithmetic matches the flow total exactly (PKR 1,470,000). Read from packages-phone.png + packages-desktop.png.
- **enquire** — PASS after fix. Fields one system (labels above, errors below in --error, live clearing proven in flow); date strip identical to the venue page's, including disabled booked dates; add-on rows initially broke the row layout (a global `.field label` rule beat the component's flex — fixed by scoping, re-captured: checkbox / name+note / right-aligned price on one row); total panel uses the shared total-table; post-submit state machine leaves ONLY the confirmation (form + total panel hidden — lesson 49). Read from enquire-phone.png (post-fix) + flows/flow-confirmation.png.
- **enquiries (My Enquiries)** — PASS. Enquiry cards reuse the tag/status pill system (Enquiry sent / Cancelled in the disabled palette), totals in the same price treatment, cancel is the ghost button role used elsewhere; empty state matches the catalogue empty-state anatomy. Read from enquiries-phone.png + flows/flow-my-enquiries.png.

## Key evidence numbers
- Tests: 132 PASS / 0 FAIL (tests-output.log), no assertions amended — incl. 14 contrast assertions from hex, availability counts per venue, booked-date rejection + alternatives correctness, capacity boundary pair, exact totals incl. add-ons, ref determinism, date free/restore round-trip, DEMO labelling, link integrity, weight budgets.
- Flow run: 21/21 PASS (screenshots/flows/flow-log.txt) — empty state naming "city = Karachi, capacity = More than 800 guests" + reset; availability 11 of 14 before; booked-date rejection rendered with venue + date + alternatives; WhatsApp firing logged; capacity 401 rejected naming 400, 400 clears live; bad-phone error content + live clear; confirmation **WD-DEMO-8048, PKR 1,470,000 exact**; date booked-by-you after (11 → 10), freed on cancel (10 → 11) with before/after captures.
- Captures: 18 standard + 1 probe320 + 18 nojs + 18 reduced + 9 flow + 3 keyboard = 67 PNGs; every audit 0 overflow / 0 leaf text-overflow / 0 broken images / 0 hidden sections.
- Index captures (owner rule): screenshots/index-desktop.png = 1440×3452 · screenshots/index-phone.png = 390×8000 (full-page, measured).
- Video: none — photo + CSS motion (generation region-blocked 403, not attempted).

## Addendum — Round-2 Re-verification FIX RUN (2026-11-22)

Independent round-2 re-verification (`Reverification-2026-11-21/round2/REPORT.md`) filed 1 minor
defect on this site (WE-1). Addressed, re-shot and read; battery **132 PASS / 0 FAIL** unamended
after fixes:

- **WE-1 (minor) — Header at ≤768px: filed as flush-left with a two-row nav wrap.** As with
  CB-1, the flush-left half does **not** reproduce on direct measurement: the round-2
  script's `firstChildLeft` reads the `.wrap` box (full-width on phone by construction),
  while the brand wordmark itself sat at left=20px at 768/390/320 before any change —
  `.head-in` already uses `padding-block`, so the wrap's inline padding survives. No inset
  fix was needed or made. The real nit is the accidental arrangement, and it is fixed: at
  ≤900px the demo-date chip now stays on row 1 with the brand (`margin-left:auto`) and the
  nav takes its own deliberate full-width row inside the inset (`order:3;flex-basis:100%`)
  instead of wrapping mid-row and pushing the chip below it — **tablet header 184px →
  137px**, nav on one aligned row. On phone the chip is hidden by the site's own ≤560px
  rule (unchanged) and the nav's two rows are now a structured block under the brand
  (177px, unchanged height, aligned throughout). Proof: DOM geometry before/after +
  re-shoot combos + probe320, 0 problems (`round2/fix2-wedding-event-booking/`);
  index-tablet.png and index-phone.png read by eye.

Score unchanged: **91/100 — REJECT (evidence bar only)** — served-preview CWV + AICOS-112 §0
sign-off still outstanding; defect repairs do not manufacture them.
Push of the changed text files (css/style.css, Scorecard-Verdict.md, tests-output.log) is
pending the GitHub connector's approval card — see FIX-REPORT-ROUND2.md.

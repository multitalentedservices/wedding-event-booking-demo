# Keyboard walk — Dilnaaz Weddings & Events (Demo)

Method: Playwright Tab at 1280px on venues.html, enquire.html?venue=2&package=baraat and venue.html?id=2; focused element + computed outline recorded per stop. Filters and form fields are native selects/inputs (lesson 34); season dates are real <button> elements — booked dates are disabled and therefore correctly skipped by Tab, while every available date button is a Tab stop with the same visible focus. No visually-hidden inputs exist, so the lesson-20 focus-host case does not arise (checked, not applicable). Focus style: links and buttons take a 3px solid #5C1A24 outline (:focus-visible), 11.97:1 against ivory; native selects/inputs take the field system focus (burgundy border + ivory ring) — their computed outline reads 0px none in the headless record because the indicator is the border/shadow, which is the visible state in the keyboard screenshots.

| Surface | Stop | Focused element | Class/id | Outline |
|---|---|---|---|---|
| venues filters | 1 | a — Skip to content | vh | 3px solid rgb(92, 26, 36) |
| venues filters | 2 | a — DilnaazWeddings & Events · Demo | brand | 3px solid rgb(92, 26, 36) |
| venues filters | 3 | a — Home |  | 3px solid rgb(92, 26, 36) |
| venues filters | 4 | a — Venues |  | 3px solid rgb(92, 26, 36) |
| venues filters | 5 | a — Packages |  | 3px solid rgb(92, 26, 36) |
| venues filters | 6 | a — Enquire |  | 3px solid rgb(92, 26, 36) |
| venues filters | 7 | a — My Enquiries |  | 3px solid rgb(92, 26, 36) |
| venues filters | 8 | select — All citiesLahoreGujranwalaKarachi | f-city | 0px none rgb(42, 35, 32) |
| venues filters | 9 | select — Any capacityUp to 400 guests401 – 800 guests | f-band | 0px none rgb(42, 35, 32) |
| venues filters | 10 | select — Indoor or outdoorIndoorOutdoor | f-setting | 0px none rgb(42, 35, 32) |
| enquire form | 1 | a — Skip to content | vh | 3px solid rgb(92, 26, 36) |
| enquire form | 2 | a — DilnaazWeddings & Events · Demo | brand | 3px solid rgb(92, 26, 36) |
| enquire form | 3 | a — Home |  | 3px solid rgb(92, 26, 36) |
| enquire form | 4 | a — Venues |  | 3px solid rgb(92, 26, 36) |
| enquire form | 5 | a — Packages |  | 3px solid rgb(92, 26, 36) |
| enquire form | 6 | a — Enquire |  | 3px solid rgb(92, 26, 36) |
| enquire form | 7 | a — My Enquiries |  | 3px solid rgb(92, 26, 36) |
| enquire form | 8 | select — Roshanara Marquee — Lahore (max 800)The Ivor | enq-venue | 0px none rgb(42, 35, 32) |
| enquire form | 9 | select — Mehndi Classic — PKR 1,850 per guestBaraat S | enq-package | 0px none rgb(42, 35, 32) |
| enquire form | 10 | button — Saturday 28 Nov 2026Available | date-btn | 3px solid rgb(92, 26, 36) |
| enquire form | 11 | button — Saturday 5 Dec 2026Available | date-btn | 3px solid rgb(92, 26, 36) |
| enquire form | 12 | button — Saturday 26 Dec 2026Available | date-btn | 3px solid rgb(92, 26, 36) |
| enquire form | 13 | button — Saturday 2 Jan 2027Available | date-btn | 3px solid rgb(92, 26, 36) |
| enquire form | 14 | button — Saturday 16 Jan 2027Available | date-btn | 3px solid rgb(92, 26, 36) |
| enquire form | 15 | button — Saturday 23 Jan 2027Available | date-btn | 3px solid rgb(92, 26, 36) |
| enquire form | 16 | button — Saturday 30 Jan 2027Available | date-btn | 3px solid rgb(92, 26, 36) |
| venue date strip | 1 | a — Skip to content | vh | 3px solid rgb(92, 26, 36) |
| venue date strip | 2 | a — DilnaazWeddings & Events · Demo | brand | 3px solid rgb(92, 26, 36) |
| venue date strip | 3 | a — Home |  | 3px solid rgb(92, 26, 36) |
| venue date strip | 4 | a — Venues |  | 3px solid rgb(92, 26, 36) |
| venue date strip | 5 | a — Packages |  | 3px solid rgb(92, 26, 36) |
| venue date strip | 6 | a — Enquire |  | 3px solid rgb(92, 26, 36) |
| venue date strip | 7 | a — My Enquiries |  | 3px solid rgb(92, 26, 36) |
| venue date strip | 8 | a — Enquire for a date | btn | 3px solid rgb(92, 26, 36) |
| venue date strip | 9 | a — WhatsApp this venue | btn wa | 3px solid rgb(92, 26, 36) |
| venue date strip | 10 | button — Saturday 28 Nov 2026Available | date-btn | 3px solid rgb(92, 26, 36) |
| venue date strip | 11 | button — Saturday 5 Dec 2026Available | date-btn | 3px solid rgb(92, 26, 36) |
| venue date strip | 12 | button — Saturday 26 Dec 2026Available | date-btn | 3px solid rgb(92, 26, 36) |
| venue date strip | 13 | button — Saturday 2 Jan 2027Available | date-btn | 3px solid rgb(92, 26, 36) |
| venue date strip | 14 | button — Saturday 16 Jan 2027Available | date-btn | 3px solid rgb(92, 26, 36) |
| venue date strip | 15 | button — Saturday 23 Jan 2027Available | date-btn | 3px solid rgb(92, 26, 36) |
| venue date strip | 16 | button — Saturday 30 Jan 2027Available | date-btn | 3px solid rgb(92, 26, 36) |
| venue date strip | 17 | button — Saturday 6 Feb 2027Available | date-btn | 3px solid rgb(92, 26, 36) |
| venue date strip | 18 | button — Saturday 13 Feb 2027Available | date-btn | 3px solid rgb(92, 26, 36) |
| venue date strip | 19 | button — Saturday 20 Feb 2027Available | date-btn | 3px solid rgb(92, 26, 36) |
| venue date strip | 20 | button — Saturday 27 Feb 2027Available | date-btn | 3px solid rgb(92, 26, 36) |
| venue date strip | 21 | a — Enquire with this package | btn ghost | 3px solid rgb(92, 26, 36) |
| venue date strip | 22 | a — Enquire with this package | btn | 3px solid rgb(92, 26, 36) |

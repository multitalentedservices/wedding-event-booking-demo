/* Dilnaaz Weddings & Events (DEMO) — pure logic module.
   ONE data object (COMPANY) owns every fact the site renders: venues,
   packages, add-ons, season dates and booked dates. The same module powers
   the site (browser) and the Node test battery — drift is impossible by
   construction (lessons 13/46). No DOM, no storage, no network in this file. */
(function (global) {
  'use strict';

  var COMPANY = {
    name: 'Dilnaaz Weddings & Events',
    tagline: 'Venues, packages and one honest date enquiry — wedding season, October to February.',
    phoneDisplay: '+92 300 123 4567',
    phoneIntl: '923001234567',
    email: 'hello@dilnaaz-events.example',
    /* Fixed printed demo clock: Sunday 22 November 2026 — inside wedding season (lesson 29). */
    demoClock: { label: 'Sunday 22 Nov 2026', iso: '2026-11-22' },
    seasonLabel: 'Wedding season 2026–27 · October – February'
  };

  /* Season Saturdays, 28 Nov 2026 – 27 Feb 2027 (the bookable date set). */
  var SEASON_DATES = [
    '2026-11-28', '2026-12-05', '2026-12-12', '2026-12-19', '2026-12-26',
    '2027-01-02', '2027-01-09', '2027-01-16', '2027-01-23', '2027-01-30',
    '2027-02-06', '2027-02-13', '2027-02-20', '2027-02-27'
  ];

  /* booked = deterministic demo bookings from the ONE data object.
     Venue 1 is nearly fully booked — only the last two Saturdays remain —
     and the peak Saturday 12 Dec 2026 is booked at venues 1, 2 and 5
     (lesson 41: the boundary lives in the data). */
  var VENUES = [
    { id: 1, name: 'Roshanara Marquee', city: 'Lahore', area: 'Gulberg III, Lahore', capacity: 800, setting: 'Indoor', fee: 450000, img: 'assets/venue-roshanara.jpg',
      features: ['Grand marquee hall with crystal chandeliers', 'Bridal suite and family lounge', 'In-house power backup for 800 guests', 'Valet parking for 220 cars'],
      blurb: 'The grand marquee of the season — a high-ceilinged hall built for large baraats.',
      booked: ['2026-11-28', '2026-12-05', '2026-12-12', '2026-12-19', '2026-12-26', '2027-01-02', '2027-01-09', '2027-01-16', '2027-01-23', '2027-01-30', '2027-02-06', '2027-02-13'] },
    { id: 2, name: 'The Ivory Court', city: 'Lahore', area: 'DHA Phase 5, Lahore', capacity: 400, setting: 'Indoor', fee: 280000, img: 'assets/venue-ivory.jpg',
      features: ['Arched windows with daylight for walima lunches', 'Ivory and gold house decor included', 'Separate mehndi terrace', 'Parking for 120 cars'],
      blurb: 'A calm, light-filled court for weddings that want elegance over scale.',
      booked: ['2026-12-12', '2026-12-19', '2027-01-09'] },
    { id: 3, name: 'Palm Grove Lawns', city: 'Gujranwala', area: 'Cantt, Gujranwala', capacity: 1200, setting: 'Outdoor', fee: 320000, img: 'assets/venue-palm.jpg',
      features: ['Palm-lined lawns for up to 1,200 guests', 'Fairy-light canopy included', 'Covered backup hall for rain', 'On-site guest parking for 350 cars'],
      blurb: 'The largest lawn in this demo set — made for big Gujranwala celebrations under the lights.',
      booked: ['2026-12-05', '2026-12-26', '2027-01-16'] },
    { id: 4, name: 'Noor Mahal Gardens', city: 'Gujranwala', area: 'Satellite Town, Gujranwala', capacity: 600, setting: 'Indoor & outdoor', fee: 210000, img: 'assets/venue-noor.jpg',
      features: ['Garden pavilion plus indoor hall', 'Marigold entrance decor included', 'Family seating enclosures', 'Parking for 180 cars'],
      blurb: 'A garden-and-hall pairing that lets a mehndi spill outdoors and the baraat sit indoors.',
      booked: ['2026-12-19', '2027-01-02'] },
    { id: 5, name: 'Clifton Pearl Hall', city: 'Karachi', area: 'Clifton Block 5, Karachi', capacity: 500, setting: 'Indoor', fee: 360000, img: 'assets/venue-clifton.jpg',
      features: ['Hotel ballroom with gold Chiavari chairs', 'Dedicated getting-ready rooms', 'Sea-facing foyer for photographs', 'Valet parking for 160 cars'],
      blurb: 'A polished Karachi ballroom — hotel finish, wedding warmth.',
      booked: ['2026-12-12', '2027-01-23', '2027-02-06'] },
    { id: 6, name: 'Seabreeze Terrace', city: 'Karachi', area: 'DHA Phase 8, Karachi', capacity: 300, setting: 'Outdoor', fee: 240000, img: 'assets/venue-seabreeze.jpg',
      features: ['Open-air terrace facing the sea', 'Canopy and string lights included', 'Sunset ceremony slot', 'Parking for 90 cars'],
      blurb: 'A small, sea-facing terrace for sunset ceremonies and intimate receptions.',
      booked: ['2026-12-26', '2027-02-13'] }
  ];

  var PACKAGES = [
    { id: 'mehndi', name: 'Mehndi Classic', perGuest: 1850,
      includes: ['Full catering per guest (one dish + BBQ + dessert)', 'Standard floral stage', 'House lighting and sound', 'Seating, linen and service staff', 'Complimentary mehndi seating corner'] },
    { id: 'baraat', name: 'Baraat Signature', perGuest: 2650,
      includes: ['Full catering per guest (two dishes + live BBQ + dessert bar)', 'Signature floral stage with fresh roses', 'House lighting, sound and LED backdrop', 'Seating, linen and trained service staff', 'Bridal suite refreshments', 'Welcome drinks for all guests'] },
    { id: 'walima', name: 'Walima Royal', perGuest: 3400,
      includes: ['Full catering per guest (three dishes + live counters + dessert bar)', 'Royal floral stage with fresh roses and orchids', 'House lighting, sound and LED backdrop', 'Seating, linen and trained service staff', 'Bridal suite refreshments and attendant', 'Welcome drinks and late-night chai for all guests'] }
  ];

  var ADDONS = [
    { id: 'floral', name: 'Floral stage upgrade', price: 85000, note: 'Fresh-rose stage upgrade beyond the package stage.' },
    { id: 'counters', name: 'Live food counters', price: 60000, note: 'Two live counters (chaat and grill) staffed through the event.' },
    { id: 'photo', name: 'Photography — 4 hours', price: 45000, note: 'One photographer for four hours, edited digital album.' },
    { id: 'qawwali', name: 'Qawwali night set', price: 70000, note: 'A 60-minute qawwali set during the reception.' }
  ];

  var REVIEWS = [
    { name: 'Hira & Daniyal (demo)', venue: 'The Ivory Court', stars: 5, text: 'The date we wanted was free, the per-guest maths was printed before we committed, and the walima lunch light in that hall is beautiful.' },
    { name: 'Mahnoor S. (demo)', venue: 'Palm Grove Lawns', stars: 5, text: 'Nine hundred guests and the lawn never felt crowded. The enquiry total matched the final bill to the rupee.' },
    { name: 'Ahmed & Zainab (demo)', venue: 'Seabreeze Terrace', stars: 4, text: 'Sunset ceremony, sea behind us. Booked dates were shown honestly on the page, so we picked our Saturday with confidence.' }
  ];

  function venueById(id) {
    for (var i = 0; i < VENUES.length; i++) if (VENUES[i].id === Number(id)) return VENUES[i];
    return null;
  }
  function packageById(id) {
    for (var i = 0; i < PACKAGES.length; i++) if (PACKAGES[i].id === id) return PACKAGES[i];
    return null;
  }
  function addonById(id) {
    for (var i = 0; i < ADDONS.length; i++) if (ADDONS[i].id === id) return ADDONS[i];
    return null;
  }

  function fmtDate(iso) {
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var p = iso.split('-');
    var d = new Date(Date.UTC(Number(p[0]), Number(p[1]) - 1, Number(p[2])));
    return days[d.getUTCDay()] + ' ' + Number(p[2]) + ' ' + months[Number(p[1]) - 1] + ' ' + p[0];
  }

  /* Availability: a date is booked if the venue's demo bookings hold it OR a
     saved user enquiry (passed in as extraBooked = [{venueId, date}]) holds it. */
  function isBooked(venue, iso, extraBooked) {
    if (venue.booked.indexOf(iso) !== -1) return true;
    if (extraBooked) {
      for (var i = 0; i < extraBooked.length; i++) {
        if (extraBooked[i].venueId === venue.id && extraBooked[i].date === iso) return true;
      }
    }
    return false;
  }
  function availableDates(venue, extraBooked) {
    return SEASON_DATES.filter(function (d) { return !isBooked(venue, d, extraBooked); });
  }
  /* Nearest available alternatives to a booked date, closest first. */
  function nearestAlternatives(venue, iso, extraBooked, n) {
    var idx = SEASON_DATES.indexOf(iso);
    var free = availableDates(venue, extraBooked);
    free.sort(function (a, b) {
      return Math.abs(SEASON_DATES.indexOf(a) - idx) - Math.abs(SEASON_DATES.indexOf(b) - idx);
    });
    return free.slice(0, n || 2);
  }
  function dateCheck(venue, iso, extraBooked) {
    if (!iso) return { ok: false, error: 'Please choose a date for your event.' };
    if (SEASON_DATES.indexOf(iso) === -1) {
      return { ok: false, error: fmtDateSafe(iso) + ' is outside the bookable season Saturdays for ' + venue.name + '. Please pick one of the season dates listed.' };
    }
    if (isBooked(venue, iso, extraBooked)) {
      var alts = nearestAlternatives(venue, iso, extraBooked, 2);
      return { ok: false, booked: true, alternatives: alts,
        error: venue.name + ' is already booked on ' + fmtDate(iso) + '. The nearest available Saturdays are ' +
          alts.map(fmtDate).join(' and ') + '.' };
    }
    return { ok: true };
  }
  function fmtDateSafe(iso) {
    try { return fmtDate(iso); } catch (e) { return String(iso); }
  }

  /* Boundary pair (lesson 33): guests == capacity passes; capacity + 1 is
     rejected naming the capacity. */
  function guestsCheck(venue, guests) {
    if (!Number.isInteger(guests) || guests < 50) {
      return { ok: false, error: 'Guest count must be at least 50 for a venue booking.' };
    }
    if (guests > venue.capacity) {
      return { ok: false, error: venue.name + ' holds a maximum of ' + venue.capacity + ' guests — ' + guests + ' guests is more than the venue can seat.' };
    }
    return { ok: true };
  }

  function computeTotal(venue, pkg, guests, addonIds) {
    var perGuestTotal = pkg.perGuest * guests;
    var addonsTotal = 0;
    (addonIds || []).forEach(function (id) { var a = addonById(id); if (a) addonsTotal += a.price; });
    return { venueFee: venue.fee, perGuest: pkg.perGuest, perGuestTotal: perGuestTotal, addonsTotal: addonsTotal, total: venue.fee + perGuestTotal + addonsTotal };
  }

  /* Catalogue filters: city + capacity band + setting, with sorts.
     Capacity bands: 'le400' (up to 400), '401-800', 'gt800'. */
  function inBand(cap, band) {
    if (!band || band === 'all') return true;
    if (band === 'le400') return cap <= 400;
    if (band === '401-800') return cap > 400 && cap <= 800;
    if (band === 'gt800') return cap > 800;
    return true;
  }
  function settingMatches(venue, setting) {
    if (!setting || setting === 'all') return true;
    if (setting === 'indoor') return venue.setting.indexOf('Indoor') === 0;
    if (setting === 'outdoor') return venue.setting.indexOf('Outdoor') === 0 || venue.setting === 'Indoor & outdoor';
    return true;
  }
  function filterVenues(list, opts) {
    opts = opts || {};
    var out = list.filter(function (v) {
      if (opts.city && opts.city !== 'all' && v.city !== opts.city) return false;
      if (!inBand(v.capacity, opts.band)) return false;
      if (!settingMatches(v, opts.setting)) return false;
      return true;
    });
    out = out.slice();
    var sort = opts.sort || 'capacity-asc';
    if (sort === 'fee-asc') out.sort(function (a, b) { return a.fee - b.fee || a.id - b.id; });
    else if (sort === 'fee-desc') out.sort(function (a, b) { return b.fee - a.fee || a.id - b.id; });
    else if (sort === 'capacity-desc') out.sort(function (a, b) { return b.capacity - a.capacity || a.id - b.id; });
    else out.sort(function (a, b) { return a.capacity - b.capacity || a.id - b.id; });
    return out;
  }

  function formatPKR(n) { return 'PKR ' + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }

  function validateName(name) {
    var v = (name || '').trim();
    if (v.length < 3) return { ok: false, error: 'Please enter your full name (at least 3 characters).' };
    if (!/[A-Za-z]/.test(v)) return { ok: false, error: 'Your name must contain letters.' };
    return { ok: true, value: v };
  }
  function validatePhone(raw) {
    var d = String(raw || '').replace(/[\s\-()]/g, '');
    if (d.indexOf('+92') === 0) d = '0' + d.slice(3);
    else if (d.indexOf('92') === 0 && d.length === 12) d = '0' + d.slice(2);
    if (!/^03\d{9}$/.test(d)) return { ok: false, error: 'Enter a valid Pakistani mobile number: 03 followed by 9 more digits (11 digits total).' };
    return { ok: true, value: d, intl: '92' + d.slice(1) };
  }
  function validateEmail(raw) {
    var v = (raw || '').trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return { ok: false, error: 'Enter a valid email address, for example name@example.com.' };
    return { ok: true, value: v };
  }

  /* Deterministic-style enquiry reference from the enquiry contents. */
  function makeRef(name, phoneIntl, venueId, iso, guests) {
    var s = name + '|' + phoneIntl + '|' + venueId + '|' + iso + '|' + guests;
    var h = 0;
    for (var i = 0; i < s.length; i++) { h = ((h * 31) + s.charCodeAt(i)) >>> 0; }
    return 'WD-DEMO-' + (1000 + (h % 9000));
  }

  function whatsappLink(venue) {
    var text = 'Assalam-o-Alaikum, I am enquiring about ' + venue.name + ' (' + venue.area + ', up to ' +
      venue.capacity + ' guests, venue fee ' + formatPKR(venue.fee) + ') on the Dilnaaz Weddings demo. Is our date available?';
    return 'https://wa.me/' + COMPANY.phoneIntl + '?text=' + encodeURIComponent(text);
  }

  var api = {
    COMPANY: COMPANY, VENUES: VENUES, PACKAGES: PACKAGES, ADDONS: ADDONS, REVIEWS: REVIEWS, SEASON_DATES: SEASON_DATES,
    venueById: venueById, packageById: packageById, addonById: addonById,
    fmtDate: fmtDate, isBooked: isBooked, availableDates: availableDates, nearestAlternatives: nearestAlternatives,
    dateCheck: dateCheck, guestsCheck: guestsCheck, computeTotal: computeTotal,
    filterVenues: filterVenues, inBand: inBand, settingMatches: settingMatches,
    formatPKR: formatPKR, validateName: validateName, validatePhone: validatePhone, validateEmail: validateEmail,
    makeRef: makeRef, whatsappLink: whatsappLink
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  global.WDLogic = api;
})(typeof window !== 'undefined' ? window : globalThis);

/* Dilnaaz Weddings & Events (DEMO) — Node test battery.
   Runs the SAME pure-logic module the site ships (js/logic.js) plus source
   assertions over the built files. Output: PASS/FAIL lines + totals. */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = __dirname;
const L = require(path.join(ROOT, 'js', 'logic.js'));
let pass = 0, fail = 0; const fails = [];
function t(name, cond, extra) {
  if (cond) { pass++; console.log('PASS  ' + name); }
  else { fail++; fails.push(name); console.log('FAIL  ' + name + (extra ? '  [' + extra + ']' : '')); }
}
function eq(name, a, b) { t(name, a === b, 'got ' + JSON.stringify(a) + ' want ' + JSON.stringify(b)); }

/* ---------- data integrity ---------- */
eq('6 venues', L.VENUES.length, 6);
eq('3 packages', L.PACKAGES.length, 3);
eq('4 add-ons', L.ADDONS.length, 4);
eq('14 season dates', L.SEASON_DATES.length, 14);
eq('3 fictional reviews', L.REVIEWS.length, 3);
t('venue ids unique', new Set(L.VENUES.map(v => v.id)).size === 6);
t('every venue has name/city/capacity/setting/fee/img/features>=4',
  L.VENUES.every(v => v.name && v.city && v.capacity > 0 && v.setting && v.fee > 0 && v.img && v.features.length >= 4));
t('every venue image file exists on disk', L.VENUES.every(v => fs.existsSync(path.join(ROOT, v.img))));
t('every booked date is a season date', L.VENUES.every(v => v.booked.every(d => L.SEASON_DATES.includes(d))));
t('every package has per-guest price + >=5 inclusions', L.PACKAGES.every(p => p.perGuest > 0 && p.includes.length >= 5));
t('every add-on has an exact positive price', L.ADDONS.every(a => Number.isInteger(a.price) && a.price > 0));
eq('cities are Lahore x2, Gujranwala x2, Karachi x2',
  ['Lahore', 'Gujranwala', 'Karachi'].map(c => L.VENUES.filter(v => v.city === c).length).join(','), '2,2,2');
eq('demo clock is Sunday 22 Nov 2026', L.COMPANY.demoClock.iso, '2026-11-22');
eq('demo clock label printed', L.COMPANY.demoClock.label, 'Sunday 22 Nov 2026');
eq('season starts Sat 28 Nov 2026', L.SEASON_DATES[0], '2026-11-28');
eq('season ends Sat 27 Feb 2027', L.SEASON_DATES[13], '2027-02-27');
t('every season date is a Saturday', L.SEASON_DATES.every(d => L.fmtDate(d).indexOf('Saturday') === 0));

/* ---------- availability + boundary in the data (lesson 41) ---------- */
const v1 = L.venueById(1), v2 = L.venueById(2), v5 = L.venueById(5);
eq('venue 1 nearly fully booked: exactly 2 free Saturdays', L.availableDates(v1).length, 2);
eq('venue 1 free dates are the last two Saturdays', L.availableDates(v1).join(','), '2027-02-20,2027-02-27');
t('peak Saturday 12 Dec 2026 is booked at venue 1', L.isBooked(v1, '2026-12-12'));
t('peak Saturday 12 Dec 2026 is booked at venue 2', L.isBooked(v2, '2026-12-12'));
t('peak Saturday 12 Dec 2026 is booked at venue 5', L.isBooked(v5, '2026-12-12'));
eq('venue 2 has 11 free Saturdays', L.availableDates(v2).length, 11);
t('venue 2 is free on Sat 5 Dec 2026 (the flow date)', !L.isBooked(v2, '2026-12-05'));

/* ---------- booked-date rejection + alternatives (lessons 25/26) ---------- */
const rej = L.dateCheck(v2, '2026-12-12');
t('booked date rejected', !rej.ok && rej.booked === true);
t('rejection NAMES the venue', rej.error.includes('The Ivory Court'));
t('rejection NAMES the date', rej.error.includes('Saturday 12 Dec 2026'));
t('rejection says already booked', rej.error.includes('already booked'));
eq('alternatives are the two nearest free Saturdays', (rej.alternatives || []).join(','), '2026-12-05,2026-11-28');
t('alternatives are named in the error text', rej.error.includes('Saturday 5 Dec 2026') && rej.error.includes('Saturday 28 Nov 2026'));
t('free date passes', L.dateCheck(v2, '2026-12-05').ok);
t('empty date rejected with guidance', !L.dateCheck(v2, '').ok && L.dateCheck(v2, '').error.includes('choose a date'));
t('out-of-season date rejected naming the season', !L.dateCheck(v2, '2027-03-06').ok && L.dateCheck(v2, '2027-03-06').error.includes('outside the bookable season'));

/* ---------- date free/restore round-trip (cross-surface predicate) ---------- */
const extra = [{ venueId: 2, date: '2026-12-05' }];
t('user enquiry makes the date booked', L.isBooked(v2, '2026-12-05', extra));
t('dateCheck rejects a date booked by the user', !L.dateCheck(v2, '2026-12-05', extra).ok);
t('removing the enquiry (cancel) frees the date again', !L.isBooked(v2, '2026-12-05', []));
eq('free count drops 11 -> 10 with the enquiry', L.availableDates(v2, extra).length, 10);

/* ---------- capacity boundary pair (lesson 33) ---------- */
t('guests == capacity passes (400 of 400)', L.guestsCheck(v2, 400).ok);
t('guests == capacity+1 rejected (401 of 400)', !L.guestsCheck(v2, 401).ok);
t('capacity rejection NAMES the capacity', L.guestsCheck(v2, 401).error.includes('maximum of 400 guests'));
t('guests 49 rejected (minimum 50)', !L.guestsCheck(v2, 49).ok);
t('guests 50 passes', L.guestsCheck(v2, 50).ok);
t('venue 3 boundary: 1200 passes, 1201 rejected', L.guestsCheck(L.venueById(3), 1200).ok && !L.guestsCheck(L.venueById(3), 1201).ok);

/* ---------- filter / sort exact counts (lesson 28 surfaces) ---------- */
eq('no filters -> 6', L.filterVenues(L.VENUES, {}).length, 6);
eq('city Lahore -> 2', L.filterVenues(L.VENUES, { city: 'Lahore' }).length, 2);
eq('city Gujranwala -> 2', L.filterVenues(L.VENUES, { city: 'Gujranwala' }).length, 2);
eq('city Karachi -> 2', L.filterVenues(L.VENUES, { city: 'Karachi' }).length, 2);
eq('band up to 400 -> 2', L.filterVenues(L.VENUES, { band: 'le400' }).length, 2);
eq('band 401-800 -> 3', L.filterVenues(L.VENUES, { band: '401-800' }).length, 3);
eq('band over 800 -> 1', L.filterVenues(L.VENUES, { band: 'gt800' }).length, 1);
eq('setting indoor -> 4 (incl. Indoor & outdoor)', L.filterVenues(L.VENUES, { setting: 'indoor' }).length, 4);
eq('setting outdoor -> 3 (incl. Indoor & outdoor)', L.filterVenues(L.VENUES, { setting: 'outdoor' }).length, 3);
eq('Lahore + indoor -> 2', L.filterVenues(L.VENUES, { city: 'Lahore', setting: 'indoor' }).length, 2);
eq('Karachi + outdoor -> 1', L.filterVenues(L.VENUES, { city: 'Karachi', setting: 'outdoor' }).length, 1);
eq('Gujranwala + over 800 -> 1', L.filterVenues(L.VENUES, { city: 'Gujranwala', band: 'gt800' }).length, 1);
eq('Karachi + over 800 -> 0 (empty state)', L.filterVenues(L.VENUES, { city: 'Karachi', band: 'gt800' }).length, 0);
eq('capacity-asc first is Seabreeze (300)', L.filterVenues(L.VENUES, { sort: 'capacity-asc' })[0].id, 6);
eq('capacity-desc first is Palm Grove (1200)', L.filterVenues(L.VENUES, { sort: 'capacity-desc' })[0].id, 3);
eq('fee-asc first is Noor Mahal (210,000)', L.filterVenues(L.VENUES, { sort: 'fee-asc' })[0].id, 4);
eq('fee-desc first is Roshanara (450,000)', L.filterVenues(L.VENUES, { sort: 'fee-desc' })[0].id, 1);

/* ---------- totals arithmetic, exact incl. add-ons ---------- */
const flow = L.computeTotal(v2, L.packageById('baraat'), 400, ['floral', 'photo']);
eq('flow venue fee 280,000', flow.venueFee, 280000);
eq('flow per-guest total 2,650 x 400 = 1,060,000', flow.perGuestTotal, 1060000);
eq('flow add-ons 85,000 + 45,000 = 130,000', flow.addonsTotal, 130000);
eq('flow TOTAL = PKR 1,470,000 exact', flow.total, 1470000);
eq('no add-ons -> add-ons total 0', L.computeTotal(v1, L.packageById('mehndi'), 100, []).addonsTotal, 0);
eq('mehndi at venue 1, 100 guests = 450,000 + 185,000', L.computeTotal(v1, L.packageById('mehndi'), 100, []).total, 635000);
eq('all four add-ons = 260,000', L.computeTotal(v2, L.packageById('walima'), 50, ['floral', 'counters', 'photo', 'qawwali']).addonsTotal, 260000);
eq('formatPKR 1,470,000', L.formatPKR(1470000), 'PKR 1,470,000');
eq('formatPKR 2,650', L.formatPKR(2650), 'PKR 2,650');

/* ---------- validation ---------- */
t('name ok', L.validateName('Ayesha Khan').ok);
t('name too short rejected', !L.validateName('Al').ok);
t('phone 0321 555 0142 ok', L.validatePhone('0321 555 0142').ok);
eq('phone normalised', L.validatePhone('0321 555 0142').value, '03215550142');
eq('phone intl', L.validatePhone('0321 555 0142').intl, '923215550142');
t('phone +92 form ok', L.validatePhone('+92 321 5550142').ok);
t('phone "123" rejected', !L.validatePhone('123').ok);
t('phone error names 03 + 11 digits', L.validatePhone('123').error.includes('03') && L.validatePhone('123').error.includes('11 digits'));
t('email ok', L.validateEmail('ayesha@example.com').ok);
t('email without @ rejected', !L.validateEmail('ayesha.example.com').ok && L.validateEmail('ayesha.example.com').error.includes('valid email'));
t('email without domain dot rejected', !L.validateEmail('ayesha@example').ok);

/* ---------- ref format / determinism ---------- */
const ref1 = L.makeRef('Ayesha Khan', '923215550142', 2, '2026-12-05', 400);
const ref2 = L.makeRef('Ayesha Khan', '923215550142', 2, '2026-12-05', 400);
t('ref matches WD-DEMO-####', /^WD-DEMO-\d{4}$/.test(ref1), ref1);
eq('ref deterministic', ref1, ref2);
t('ref changes with the date', L.makeRef('Ayesha Khan', '923215550142', 2, '2026-12-26', 400) !== ref1);

/* ---------- WhatsApp link ---------- */
const wa = L.whatsappLink(v2);
t('whatsapp link targets the demo number', wa.indexOf('https://wa.me/923001234567?text=') === 0);
t('whatsapp text names the venue', decodeURIComponent(wa).includes('The Ivory Court'));
t('whatsapp text carries the venue fee', decodeURIComponent(wa).includes('PKR 280,000'));

/* ---------- contrast assertions computed from hex (lesson 23) ---------- */
function lum(hex) {
  const c = hex.replace('#', '');
  const f = i => { const v = parseInt(c.substr(i, 2), 16) / 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
  return 0.2126 * f(0) + 0.7152 * f(2) + 0.0722 * f(4);
}
function cr(a, b) { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); }
const pairs = [
  ['burgundy on ivory (primary buttons/labels)', '#5C1A24', '#FAF6EF'],
  ['ivory on burgundy (button text is white; burgundy ground check)', '#FFFFFF', '#5C1A24'],
  ['ivory on burgundy-dark (banner/band)', '#FAF6EF', '#3E1119'],
  ['ink on ivory (body)', '#2A2320', '#FAF6EF'],
  ['muted on ivory', '#655349', '#FAF6EF'],
  ['muted on ivory-2 (alt surface)', '#655349', '#F3EBDD'],
  ['gold on burgundy-dark (small-caps labels on dark only)', '#E3B959', '#3E1119'],
  ['gold on burgundy (labels on burgundy)', '#E3B959', '#5C1A24'],
  ['error red on ivory', '#B3261E', '#FAF6EF'],
  ['burgundy on ivory-2 (tags)', '#5C1A24', '#F3EBDD'],
  ['ink on ivory-2', '#2A2320', '#F3EBDD'],
  ['disabled text on disabled ground', '#6E5F55', '#E7DFD2'],
  ['gold-hairline stars on white card', '#8A6D1F', '#FFFFFF']
];
pairs.forEach(([name, fg, bg]) => t('contrast >= 4.5:1 — ' + name + ' (' + cr(fg, bg).toFixed(2) + ')', cr(fg, bg) >= 4.5));
t('focus outline burgundy on ivory >= 3:1 (' + cr('#5C1A24', '#FAF6EF').toFixed(2) + ')', cr('#5C1A24', '#FAF6EF') >= 3);

/* ---------- source assertions ---------- */
const PAGES = ['index.html', 'venues.html', 'venue.html', 'packages.html', 'enquire.html', 'enquiries.html'];
const sources = {};
PAGES.forEach(p => { sources[p] = fs.readFileSync(path.join(ROOT, p), 'utf8'); });
const css = fs.readFileSync(path.join(ROOT, 'css', 'style.css'), 'utf8');
const app = fs.readFileSync(path.join(ROOT, 'js', 'app.js'), 'utf8');
const allSrc = PAGES.map(p => sources[p]).join('\n') + css + app;
PAGES.forEach(p => t(p + ' carries DEMO labelling', /Demo/i.test(sources[p])));
PAGES.forEach(p => t(p + ' has a unique title', (sources[p].match(/<title>([^<]+)<\/title>/) || [])[1] && new Set(PAGES.map(x => (sources[x].match(/<title>([^<]+)<\/title>/) || [])[1])).size === 6));
t('no lorem ipsum anywhere', !/lorem ipsum/i.test(allSrc));
t('no live analytics endpoints in source', !/google-analytics|googletagmanager|connect\.facebook/i.test(allSrc));
t('no external embeds (maps/iframes)', !/<iframe/i.test(allSrc));
t('global [hidden] rule present from base CSS (lesson 47)', css.includes('[hidden]{display:none !important}'));
t('disabled button state is a solid system state (lesson 50)', css.includes('.btn[disabled]') && css.includes('--disabled-bg'));
t('disabled date buttons styled (lesson 50)', css.includes('.date-btn[disabled]'));
t('every internal href target exists', PAGES.every(p => {
  const hrefs = (sources[p].match(/href="([a-z]+\.html)/g) || []).map(h => h.slice(6));
  return hrefs.every(h => fs.existsSync(path.join(ROOT, h)));
}));
t('sitemap + robots exist', fs.existsSync(path.join(ROOT, 'sitemap.xml')) && fs.existsSync(path.join(ROOT, 'robots.txt')));
t('reviews labelled demo in data', L.REVIEWS.every(r => r.name.includes('(demo)')));

/* ---------- weight budgets ---------- */
let codeBytes = 0;
PAGES.forEach(p => { codeBytes += fs.statSync(path.join(ROOT, p)).size; });
codeBytes += fs.statSync(path.join(ROOT, 'css', 'style.css')).size;
codeBytes += fs.statSync(path.join(ROOT, 'js', 'logic.js')).size;
codeBytes += fs.statSync(path.join(ROOT, 'js', 'app.js')).size;
t('code weight < 400 KB (actual ' + codeBytes + ' B)', codeBytes < 400 * 1024);
const imgs = fs.readdirSync(path.join(ROOT, 'assets')).filter(f => f.endsWith('.jpg'));
let mediaBytes = 0;
imgs.forEach(f => { const s = fs.statSync(path.join(ROOT, 'assets', f)).size; mediaBytes += s; t('image ' + f + ' <= 120 KB (' + s + ' B)', s <= 120 * 1024); });
t('media total <= 1.6 MB (actual ' + mediaBytes + ' B)', mediaBytes <= 1.6 * 1024 * 1024);
eq('8 photos on disk', imgs.length, 8);

console.log('\nTOTAL: ' + pass + ' PASS / ' + fail + ' FAIL');
if (fails.length) console.log('FAILS: ' + fails.join(' | '));
process.exit(fail ? 1 : 0);

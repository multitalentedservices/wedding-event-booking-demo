/* Dilnaaz Weddings & Events (DEMO) — DOM layer. All facts come from
   js/logic.js (the ONE data object); this file only renders and wires. */
(function () {
  'use strict';
  var L = window.WDLogic;
  var ENQ_KEY = 'wd_enquiries', WA_KEY = 'wd_wa_log';
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function getEnquiries() { try { return JSON.parse(localStorage.getItem(ENQ_KEY) || '[]'); } catch (e) { return []; } }
  function saveEnquiries(list) { localStorage.setItem(ENQ_KEY, JSON.stringify(list)); }
  function userBooked() {
    return getEnquiries().filter(function (e) { return e.status !== 'Cancelled'; })
      .map(function (e) { return { venueId: e.venueId, date: e.date }; });
  }
  function toast(msg) {
    var t = document.createElement('div'); t.className = 'toast'; t.textContent = msg;
    document.body.appendChild(t); setTimeout(function () { t.remove(); }, 3200);
  }
  function recordWA(venue) {
    var log = []; try { log = JSON.parse(localStorage.getItem(WA_KEY) || '[]'); } catch (e) {}
    log.push({ venue: venue.name, at: L.COMPANY.demoClock.label, channel: 'WhatsApp (demo log)' });
    localStorage.setItem(WA_KEY, JSON.stringify(log));
  }
  function waButton(venue, label) {
    var a = document.createElement('a');
    a.className = 'btn wa'; a.href = L.whatsappLink(venue); a.target = '_blank'; a.rel = 'noopener';
    a.setAttribute('data-wa', ''); a.textContent = label || 'WhatsApp this venue';
    a.addEventListener('click', function () { recordWA(venue); });
    return a;
  }
  function venueCard(v) {
    var free = L.availableDates(v, userBooked()).length;
    var el = document.createElement('article'); el.className = 'vcard';
    el.innerHTML =
      '<img src="' + v.img + '" alt="' + esc(v.name) + ' — wedding venue photograph (demo)">' +
      '<div class="body"><div class="tag-row"><span class="tag">' + esc(v.setting) + '</span><span class="tag">' + esc(v.city) + '</span></div>' +
      '<h3>' + esc(v.name) + '</h3><p class="meta">' + esc(v.area) + ' · Up to ' + v.capacity + ' guests</p>' +
      '<p>' + esc(v.blurb) + '</p>' +
      '<p class="price">' + L.formatPKR(v.fee) + ' <span>venue fee</span></p>' +
      '<p class="meta">' + free + ' of ' + L.SEASON_DATES.length + ' season Saturdays still available</p>' +
      '<div class="actions"><a class="btn" href="venue.html?id=' + v.id + '">View venue &amp; dates</a></div></div>';
    el.querySelector('.actions').appendChild(waButton(v));
    return el;
  }
  function packageCard(p, featured) {
    var el = document.createElement('article'); el.className = 'pcard' + (featured ? ' featured' : '');
    el.innerHTML = '<p class="eyebrow">' + (featured ? 'Most chosen' : 'Package') + '</p><h3>' + esc(p.name) + '</h3>' +
      '<p class="per">' + L.formatPKR(p.perGuest) + ' <span>per guest</span></p>' +
      '<ul>' + p.includes.map(function (i) { return '<li>' + esc(i) + '</li>'; }).join('') + '</ul>' +
      '<div class="actions"><a class="btn' + (featured ? '' : ' ghost') + '" href="enquire.html?package=' + p.id + '">Enquire with this package</a></div>';
    return el;
  }
  function dateStrip(venue, opts) {
    opts = opts || {};
    var extra = userBooked();
    var wrap = document.createElement('div'); wrap.className = 'date-strip'; wrap.setAttribute('role', 'group');
    wrap.setAttribute('aria-label', 'Season dates for ' + venue.name);
    L.SEASON_DATES.forEach(function (iso) {
      var mine = extra.some(function (e) { return e.venueId === venue.id && e.date === iso; });
      var booked = L.isBooked(venue, iso, extra);
      var b = document.createElement('button'); b.type = 'button'; b.className = 'date-btn';
      b.setAttribute('data-date', iso);
      b.innerHTML = esc(L.fmtDate(iso)) + '<small>' + (mine ? 'Booked by you' : booked ? 'Already booked' : 'Available') + '</small>';
      if (booked) { b.disabled = true; b.setAttribute('aria-disabled', 'true'); }
      else {
        b.setAttribute('aria-pressed', opts.selected === iso ? 'true' : 'false');
        b.addEventListener('click', function () { if (opts.onPick) opts.onPick(iso); });
      }
      wrap.appendChild(b);
    });
    return wrap;
  }

  var page = document.body.getAttribute('data-page');

  /* ---------------- HOME ---------------- */
  if (page === 'home') {
    var fg = $('[data-featured]'); [1, 2, 6].forEach(function (id) { fg.appendChild(venueCard(L.venueById(id))); });
    var pg = $('[data-packages]'); L.PACKAGES.forEach(function (p, i) { pg.appendChild(packageCard(p, i === 1)); });
    var rg = $('[data-reviews]'); L.REVIEWS.forEach(function (r) {
      var d = document.createElement('article'); d.className = 'review';
      d.innerHTML = '<p class="stars" aria-label="' + r.stars + ' of 5 stars">' + '★★★★★'.slice(0, r.stars) + '</p><p>' + esc(r.text) + '</p><p class="muted"><strong>' + esc(r.name) + '</strong> · ' + esc(r.venue) + '</p>';
      rg.appendChild(d);
    });
  }

  /* ---------------- VENUES CATALOGUE ---------------- */
  if (page === 'venues') {
    var grid = $('[data-v-grid]'), count = $('[data-v-count]'), empty = $('[data-v-empty]'), emptyMsg = $('[data-v-empty-msg]');
    var fCity = $('[data-f-city]'), fBand = $('[data-f-band]'), fSetting = $('[data-f-setting]'), fSort = $('[data-f-sort]');
    function current() { return { city: fCity.value, band: fBand.value, setting: fSetting.value, sort: fSort.value }; }
    function describe(o) {
      var parts = [];
      if (o.city !== 'all') parts.push('city = ' + o.city);
      if (o.band !== 'all') parts.push('capacity = ' + fBand.options[fBand.selectedIndex].text);
      if (o.setting !== 'all') parts.push('setting = ' + fSetting.options[fSetting.selectedIndex].text);
      return parts.length ? parts.join(', ') : 'no filters';
    }
    function render(pushUrl) {
      var o = current();
      var list = L.filterVenues(L.VENUES, o);
      grid.innerHTML = ''; list.forEach(function (v) { grid.appendChild(venueCard(v)); });
      count.textContent = 'Showing ' + list.length + ' of ' + L.VENUES.length + ' venues';
      empty.hidden = list.length !== 0; grid.hidden = list.length === 0;
      if (!list.length) emptyMsg.textContent = 'No venue matches ' + describe(o) + '. Try widening the capacity band or choosing another city.';
      if (pushUrl) {
        var q = new URLSearchParams();
        if (o.city !== 'all') q.set('city', o.city); if (o.band !== 'all') q.set('band', o.band);
        if (o.setting !== 'all') q.set('setting', o.setting); if (o.sort !== 'capacity-asc') q.set('sort', o.sort);
        history.replaceState(null, '', location.pathname + (q.toString() ? '?' + q : ''));
      }
    }
    var init = new URLSearchParams(location.search);
    if (init.get('city')) fCity.value = init.get('city');
    if (init.get('band')) fBand.value = init.get('band');
    if (init.get('setting')) fSetting.value = init.get('setting');
    if (init.get('sort')) fSort.value = init.get('sort');
    [fCity, fBand, fSetting, fSort].forEach(function (el) { el.addEventListener('change', function () { render(true); }); });
    $('[data-v-reset]').addEventListener('click', function () {
      fCity.value = 'all'; fBand.value = 'all'; fSetting.value = 'all'; fSort.value = 'capacity-asc'; render(true);
    });
    render(false);
  }

  /* ---------------- VENUE DETAIL ---------------- */
  if (page === 'venue') {
    var id = Number(new URLSearchParams(location.search).get('id') || 1);
    var v = L.venueById(id) || L.VENUES[0];
    document.title = v.name + ' — Dilnaaz Weddings (Demo)';
    $('[data-vd]').innerHTML =
      '<p class="eyebrow">' + esc(v.city) + ' · ' + esc(v.setting) + '</p><h1 style="font-size:2.4rem">' + esc(v.name) + '</h1>' +
      '<p class="lede muted" style="font-size:1.1rem;max-width:38rem">' + esc(v.blurb) + '</p>' +
      '<div class="hero" style="padding:1rem 0 0"><div class="hero-photo"><img src="' + v.img + '" alt="' + esc(v.name) + ' — wedding venue photograph (demo)"></div>' +
      '<div><p class="price" style="font-size:1.3rem;font-weight:800">' + L.formatPKR(v.fee) + ' <span class="muted" style="font-weight:600">venue fee</span></p>' +
      '<p>Up to <strong>' + v.capacity + ' guests</strong> · ' + esc(v.area) + '</p>' +
      '<ul>' + v.features.map(function (f) { return '<li>' + esc(f) + '</li>'; }).join('') + '</ul>' +
      '<div class="hero-actions"><a class="btn" href="enquire.html?venue=' + v.id + '">Enquire for a date</a></div><div class="hero-actions" data-vd-wa></div></div></div>';
    $('[data-vd-wa]').appendChild(waButton(v));
    var stripHost = $('[data-vd-strip]');
    function renderStrip() {
      stripHost.innerHTML = '';
      stripHost.appendChild(dateStrip(v, { onPick: function (iso) { location.href = 'enquire.html?venue=' + v.id + '&date=' + iso; } }));
      var free = L.availableDates(v, userBooked());
      $('[data-vd-avail]').innerHTML = '<span data-avail-count>' + free.length + ' of ' + L.SEASON_DATES.length + ' season Saturdays are still available at ' + esc(v.name) + '.</span>' +
        (userBooked().some(function (e) { return e.venueId === v.id; }) ? ' Dates marked <span class="yours">“Booked by you”</span> come from your own enquiry below in My Enquiries.' : '');
    }
    renderStrip();
    var pg2 = $('[data-vd-packages]'); L.PACKAGES.forEach(function (p, i) {
      var c = packageCard(p, i === 1);
      c.querySelector('a.btn').href = 'enquire.html?venue=' + v.id + '&package=' + p.id;
      pg2.appendChild(c);
    });
  }

  /* ---------------- PACKAGES ---------------- */
  if (page === 'packages') {
    var pg3 = $('[data-packages]'); L.PACKAGES.forEach(function (p, i) { pg3.appendChild(packageCard(p, i === 1)); });
    var at = $('[data-addons]');
    L.ADDONS.forEach(function (a) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td><strong>' + esc(a.name) + '</strong><br><span class="muted">' + esc(a.note) + '</span></td><td>' + L.formatPKR(a.price) + '</td>';
      at.appendChild(tr);
    });
    var exV = L.venueById(2), exP = L.packageById('baraat');
    var ex = L.computeTotal(exV, exP, 400, ['floral', 'photo']);
    $('[data-example]').innerHTML = 'Worked example — ' + exV.name + ' with ' + exP.name + ' for 400 guests plus the floral stage upgrade and photography: venue fee ' +
      L.formatPKR(ex.venueFee) + ' + ' + L.formatPKR(ex.perGuest) + ' × 400 guests = ' + L.formatPKR(ex.perGuestTotal) + ' + add-ons ' + L.formatPKR(ex.addonsTotal) +
      ' = <strong>' + L.formatPKR(ex.total) + ' total</strong>. The enquiry page computes your own combination live, the same way.';
  }

  /* ---------------- ENQUIRE ---------------- */
  if (page === 'enquire') {
    var q = new URLSearchParams(location.search);
    var form = $('[data-enq-form]'), confirm = $('[data-confirm]');
    var fVenue = $('#enq-venue'), fPkg = $('#enq-package'), fGuests = $('#enq-guests'),
      fName = $('#enq-name'), fPhone = $('#enq-phone'), fEmail = $('#enq-email');
    L.VENUES.forEach(function (v) { var o = document.createElement('option'); o.value = v.id; o.textContent = v.name + ' — ' + v.city + ' (max ' + v.capacity + ')'; fVenue.appendChild(o); });
    L.PACKAGES.forEach(function (p) { var o = document.createElement('option'); o.value = p.id; o.textContent = p.name + ' — ' + L.formatPKR(p.perGuest) + ' per guest'; fPkg.appendChild(o); });
    var addonHost = $('[data-addon-list]');
    L.ADDONS.forEach(function (a) {
      var lab = document.createElement('label'); lab.className = 'check-line';
      lab.innerHTML = '<input type="checkbox" data-addon="' + a.id + '"><span><strong>' + esc(a.name) + '</strong><br><span class="muted">' + esc(a.note) + '</span></span><span class="ck-price">' + L.formatPKR(a.price) + '</span>';
      addonHost.appendChild(lab);
    });
    if (q.get('venue') && L.venueById(q.get('venue'))) fVenue.value = q.get('venue');
    if (q.get('package') && L.packageById(q.get('package'))) fPkg.value = q.get('package');
    var chosenDate = q.get('date') && L.SEASON_DATES.indexOf(q.get('date')) !== -1 ? q.get('date') : '';
    var stripHost = $('[data-date-strip]'), dateErr = $('[data-err-for="enq-date"]');
    function selectedAddons() { return $$('[data-addon]', addonHost).filter(function (c) { return c.checked; }).map(function (c) { return c.getAttribute('data-addon'); }); }
    function venue() { return L.venueById(fVenue.value); }
    function renderStrip() {
      stripHost.innerHTML = '';
      stripHost.appendChild(dateStrip(venue(), { selected: chosenDate, onPick: function (iso) {
        chosenDate = iso; renderStrip(); validateDate(true); updateTotal();
      } }));
    }
    function updateTotal() {
      var t = L.computeTotal(venue(), L.packageById(fPkg.value), Number(fGuests.value) || 0, selectedAddons());
      $('[data-t-venue]').textContent = L.formatPKR(t.venueFee);
      $('[data-t-per]').textContent = L.formatPKR(t.perGuest) + ' × ' + (Number(fGuests.value) || 0);
      $('[data-t-per-total]').textContent = L.formatPKR(t.perGuestTotal);
      $('[data-t-addons]').textContent = L.formatPKR(t.addonsTotal);
      $('[data-t-grand]').textContent = L.formatPKR(t.total);
    }
    function showErr(input, msg) {
      var e = $('[data-err-for="' + input.id + '"]'); if (!e) return;
      e.textContent = msg || ''; e.hidden = !msg;
      if (msg) input.setAttribute('aria-invalid', 'true'); else input.removeAttribute('aria-invalid');
    }
    function validateDate(live) {
      var r = L.dateCheck(venue(), chosenDate, userBooked());
      dateErr.textContent = r.ok ? '' : r.error; dateErr.hidden = r.ok;
      if (live && r.ok) dateErr.hidden = true;
      return r;
    }
    function bindLive(input, fn) {
      input.addEventListener('input', function () { var r = fn(); if (r.ok) showErr(input, ''); updateTotal(); });
      input.addEventListener('change', function () { updateTotal(); });
    }
    bindLive(fName, function () { return L.validateName(fName.value); });
    bindLive(fPhone, function () { return L.validatePhone(fPhone.value); });
    bindLive(fEmail, function () { return L.validateEmail(fEmail.value); });
    fGuests.addEventListener('input', function () { var r = L.guestsCheck(venue(), Number(fGuests.value)); if (r.ok) showErr(fGuests, ''); updateTotal(); });
    fVenue.addEventListener('change', function () { chosenDate = ''; renderStrip(); dateErr.hidden = true; updateTotal(); });
    fPkg.addEventListener('change', updateTotal);
    addonHost.addEventListener('change', updateTotal);
    renderStrip(); updateTotal();
    if (chosenDate) validateDate(false);

    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var v = venue();
      var rName = L.validateName(fName.value), rPhone = L.validatePhone(fPhone.value), rEmail = L.validateEmail(fEmail.value);
      var rGuests = L.guestsCheck(v, Number(fGuests.value)), rDate = L.dateCheck(v, chosenDate, userBooked());
      showErr(fName, rName.ok ? '' : rName.error);
      showErr(fPhone, rPhone.ok ? '' : rPhone.error);
      showErr(fEmail, rEmail.ok ? '' : rEmail.error);
      showErr(fGuests, rGuests.ok ? '' : rGuests.error);
      dateErr.textContent = rDate.ok ? '' : rDate.error; dateErr.hidden = rDate.ok;
      if (!(rName.ok && rPhone.ok && rEmail.ok && rGuests.ok && rDate.ok)) {
        var firstBad = !rDate.ok ? stripHost : !rGuests.ok ? fGuests : !rName.ok ? fName : !rPhone.ok ? fPhone : fEmail;
        firstBad.scrollIntoView({ block: 'center' }); return;
      }
      var addons = selectedAddons();
      var pkg = L.packageById(fPkg.value);
      var t = L.computeTotal(v, pkg, Number(fGuests.value), addons);
      var ref = L.makeRef(rName.value, rPhone.intl, v.id, chosenDate, Number(fGuests.value));
      var enq = { ref: ref, name: rName.value, phoneIntl: rPhone.intl, email: rEmail.value, venueId: v.id,
        packageId: pkg.id, date: chosenDate, guests: Number(fGuests.value), addons: addons, total: t.total, status: 'Enquiry sent' };
      var list = getEnquiries(); list.push(enq); saveEnquiries(list);
      /* post-submit state machine (lesson 49): form + total panel out, confirmation in */
      form.hidden = true; $('[data-total-panel]').hidden = true;
      confirm.hidden = false;
      confirm.innerHTML = '<p class="eyebrow">Enquiry sent — demo</p><p class="ref" data-conf-ref>' + ref + '</p>' +
        '<p><strong>' + esc(v.name) + '</strong> · ' + esc(L.fmtDate(chosenDate)) + ' · ' + esc(pkg.name) + ' · ' + enq.guests + ' guests</p>' +
        '<table class="total-table" style="max-width:30rem;margin:1rem auto;text-align:left"><tbody>' +
        '<tr><td>Venue fee</td><td>' + L.formatPKR(t.venueFee) + '</td></tr>' +
        '<tr><td>' + esc(pkg.name) + ' — ' + L.formatPKR(t.perGuest) + ' × ' + enq.guests + ' guests</td><td>' + L.formatPKR(t.perGuestTotal) + '</td></tr>' +
        '<tr><td>Add-ons</td><td>' + L.formatPKR(t.addonsTotal) + '</td></tr>' +
        '<tr class="grand"><td>Total</td><td>' + L.formatPKR(t.total) + '</td></tr></tbody></table>' +
        '<p class="muted">This demo takes no payment and confirms no booking — your date now shows as “Booked by you” on the venue page, and this enquiry is listed under My Enquiries.</p>' +
        '<p><a class="btn" href="enquiries.html">View My Enquiries</a> <a class="btn ghost" href="venue.html?id=' + v.id + '">See the date on the venue page</a></p>';
      confirm.setAttribute('tabindex', '-1'); confirm.focus();
      window.scrollTo(0, 0);
    });
  }

  /* ---------------- MY ENQUIRIES ---------------- */
  if (page === 'enquiries') {
    var host = $('[data-my-enq]'), emptyE = $('[data-enq-empty]');
    function render() {
      var list = getEnquiries();
      host.innerHTML = '';
      emptyE.hidden = list.length !== 0;
      list.slice().reverse().forEach(function (e) {
        var v = L.venueById(e.venueId), p = L.packageById(e.packageId);
        var card = document.createElement('article'); card.className = 'ecard';
        card.innerHTML = '<div class="tag-row"><span class="status' + (e.status === 'Cancelled' ? ' cancelled' : '') + '">' + esc(e.status) + '</span><span class="tag">' + esc(e.ref) + '</span></div>' +
          '<h3>' + esc(v.name) + ' — ' + esc(L.fmtDate(e.date)) + '</h3>' +
          '<p class="muted">' + esc(p.name) + ' · ' + e.guests + ' guests · ' + (e.addons.length ? e.addons.map(function (a) { return esc(L.addonById(a).name); }).join(', ') : 'No add-ons') + '</p>' +
          '<p><strong>' + L.formatPKR(e.total) + '</strong> total (itemised at enquiry time)</p>';
        if (e.status !== 'Cancelled') {
          var btn = document.createElement('button'); btn.type = 'button'; btn.className = 'btn ghost small';
          btn.setAttribute('data-cancel', e.ref); btn.textContent = 'Cancel this enquiry';
          btn.addEventListener('click', function () {
            var all = getEnquiries();
            all.forEach(function (x) { if (x.ref === e.ref) x.status = 'Cancelled'; });
            saveEnquiries(all); render(); toast('Enquiry ' + e.ref + ' cancelled — the date is free again.');
          });
          card.appendChild(btn);
        }
        host.appendChild(card);
      });
    }
    render();
  }
})();

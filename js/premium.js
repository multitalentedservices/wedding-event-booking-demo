/* Dilnaaz Weddings & Events (DEMO) — premium layer (2026-11-22), THE FINALE.
   Index: Lenis smooth scroll + GSAP/ScrollTrigger pinned venue chapters +
   SplitText hero lines — the full discipline, choreographed, inside P8.
   Venue/Enquire: the date strip re-presented as a cinematic availability
   component (same buttons, same states, same handlers — presentation only).
   Enquiries: Wedding-OS demo surfaces (RSVP + guest list + registry) that
   share the enquiry's own dataset. All facts come from WDLogic.
   Reduced motion or any missing library = the complete static site:
   chapters read as a plain vertical sequence, strips keep their base
   presentation, totals and availability stay exactly as app.js computes. */
(function () {
  'use strict';
  var L = window.WDLogic;
  if (!L) return;
  var page = document.body.getAttribute('data-page');
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  /* Static capture mode (?static=1 or a pre-set data-static attribute):
     the finale choreography stands down and the page renders its complete
     in-flow final state — the same form reduced-motion visitors get.
     Live visitors (no flag) get the choreography byte-for-byte as shipped. */
  var STATIC = /[?&]static=1(?:&|$)/.test(window.location.search) || document.documentElement.hasAttribute('data-static');
  if (STATIC) document.documentElement.setAttribute('data-static', '');
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function load(key, fallback) { try { var v = JSON.parse(localStorage.getItem(key)); return v == null ? fallback : v; } catch (e) { return fallback; } }
  function save(key, v) { try { localStorage.setItem(key, JSON.stringify(v)); } catch (e) {} }
  function getEnquiries() { return load('wd_enquiries', []); }
  function userBooked() {
    return getEnquiries().filter(function (e) { return e.status !== 'Cancelled'; })
      .map(function (e) { return { venueId: e.venueId, date: e.date }; });
  }

  /* ================= INDEX — the full stack, choreographed =============== */
  function initFinale() {
    if (reduced || STATIC) return; /* static chapters + native scroll: complete */
    if (!window.gsap || !window.ScrollTrigger || !window.Lenis) return;
    var gsap = window.gsap;
    gsap.registerPlugin(window.ScrollTrigger);
    if (window.SplitText) gsap.registerPlugin(window.SplitText);

    /* Lenis ↔ ScrollTrigger on one rAF loop (documented ticker pattern) */
    var lenis = new window.Lenis({ duration: 1.15, smoothWheel: true });
    lenis.on('scroll', window.ScrollTrigger.update);
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var target = document.querySelector(a.getAttribute('href'));
        if (target) { e.preventDefault(); lenis.scrollTo(target); target.setAttribute('tabindex', '-1'); target.focus({ preventScroll: true }); }
      });
    });

    /* SplitText hero: masked line-rise at award medians */
    var h1 = document.querySelector('.hero h1');
    if (h1 && window.SplitText) {
      var split = new window.SplitText(h1, { type: 'lines', mask: 'lines' });
      gsap.from(split.lines, { yPercent: 115, duration: 0.9, ease: 'power4.out', stagger: 0.09, delay: 0.1 });
    }

    /* Pinned venue chapters: one venue per chapter, built from WDLogic */
    var stage = document.querySelector('[data-chapters-stage]');
    var staticSeq = document.querySelector('[data-chapters-static]');
    if (!stage || !staticSeq) return;
    var ids = [1, 2, 6];
    var romans = ['I', 'II', 'III'];
    var extra = userBooked();
    stage.innerHTML = ids.map(function (id, i) {
      var v = L.venueById(id);
      var free = L.availableDates(v, extra).length;
      return '<article class="chapter-panel" data-chapter="' + i + '">' +
        '<div class="chapter-photo"><img src="' + v.img + '" alt="' + esc(v.name) + ' — wedding venue photograph (demo)"></div>' +
        '<div class="chapter-body"><p class="eyebrow">Chapter ' + romans[i] + ' · ' + esc(v.city) + ' · ' + esc(v.setting) + '</p>' +
        '<h3 class="chapter-name-xl">' + esc(v.name) + '</h3>' +
        '<p class="chapter-blurb">' + esc(v.blurb) + '</p>' +
        '<p class="chapter-facts">Up to ' + v.capacity + ' guests · ' + L.formatPKR(v.fee) + ' venue fee · ' + free + ' of ' + L.SEASON_DATES.length + ' season Saturdays still available</p>' +
        '<p><a class="btn" href="venue.html?id=' + v.id + '">View venue &amp; dates</a></p></div></article>';
    }).join('') + '<p class="chapter-count" data-chapter-count>Chapter I / III</p>';
    staticSeq.hidden = true;
    stage.hidden = false;

    var panels = gsap.utils.toArray('.chapter-panel', stage);
    var count = stage.querySelector('[data-chapter-count]');
    panels.forEach(function (p, i) { gsap.set(p, { autoAlpha: i === 0 ? 1 : 0 }); });
    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: stage, start: 'top top', end: '+=220%', scrub: 1, pin: true, anticipatePin: 1,
        onUpdate: function (self) {
          var idx = Math.min(2, Math.floor(self.progress * 3));
          if (count) count.textContent = 'Chapter ' + romans[idx] + ' / III';
        }
      }
    });
    /* chapter I holds, breathes (photo slow scale), then turns */
    tl.to(panels[0].querySelector('img'), { scale: 1.08, duration: 1, ease: 'none' }, 0);
    tl.to(panels[0], { autoAlpha: 0, duration: 0.45, ease: 'power1.inOut' }, 0.85);
    tl.fromTo(panels[1], { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.45, ease: 'power1.inOut' }, 0.95);
    tl.fromTo(panels[1].querySelector('.chapter-name-xl'), { y: 60 }, { y: 0, duration: 0.7, ease: 'power3.out' }, 1.0);
    tl.fromTo(panels[1].querySelector('img'), { scale: 1.12 }, { scale: 1.02, duration: 1, ease: 'none' }, 1.0);
    tl.to(panels[1], { autoAlpha: 0, duration: 0.45, ease: 'power1.inOut' }, 1.85);
    tl.fromTo(panels[2], { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.45, ease: 'power1.inOut' }, 1.95);
    tl.fromTo(panels[2].querySelector('.chapter-name-xl'), { y: 60 }, { y: 0, duration: 0.7, ease: 'power3.out' }, 2.0);
    tl.fromTo(panels[2].querySelector('img'), { scale: 1.12 }, { scale: 1.03, duration: 0.9, ease: 'none' }, 2.0);
    tl.to({}, { duration: 0.25 }); /* settle hold on the final chapter */
  }

  /* ============ VENUE + ENQUIRE — cinematic availability strip ========== */
  function enhanceStripButton(b) {
    if (b.classList.contains('cine-btn')) return;
    var iso = b.getAttribute('data-date');
    if (!iso) return;
    var p = iso.split('-');
    var d = new Date(Date.UTC(Number(p[0]), Number(p[1]) - 1, Number(p[2])));
    var dows = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var small = b.querySelector('small');
    var status = small ? small.textContent : '';
    b.innerHTML = '<span class="dow">' + dows[d.getUTCDay()] + '</span>' +
      '<span class="dnum">' + Number(p[2]) + '</span>' +
      '<span class="dmy">' + months[Number(p[1]) - 1] + ' ' + p[0] + '</span>' +
      '<small>' + esc(status) + '</small>';
    b.classList.add('cine-btn');
    var strip = b.closest('.date-strip');
    if (strip) strip.classList.add('cine');
  }
  function initCineStrips() {
    var hosts = document.querySelectorAll('[data-vd-strip], [data-date-strip]');
    if (!hosts.length) return;
    hosts.forEach(function (host) {
      host.querySelectorAll('.date-btn').forEach(enhanceStripButton);
      /* the enquire page rebuilds its strip on venue change — re-enhance */
      new MutationObserver(function () {
        host.querySelectorAll('.date-btn').forEach(enhanceStripButton);
      }).observe(host, { childList: true, subtree: true });
    });
  }

  /* ============ ENQUIRIES — Wedding OS demo surfaces ===================== */
  function osState() { return load('wd_os', {}); }
  function renderOsPanel(card, enq) {
    var all = osState();
    var st = all[enq.ref] || { responses: 0, attending: 0, gifted: {} };
    if (!all[enq.ref]) { all[enq.ref] = st; }
    var panel = document.createElement('div');
    panel.className = 'os-panel';
    var regRows = enq.addons.length ? enq.addons.map(function (id) {
      var a = L.addonById(id);
      var gifted = !!st.gifted[id];
      return '<li><span class="rg-name"><strong>' + esc(a.name) + '</strong> · ' + L.formatPKR(a.price) + '</span>' +
        '<span class="rg-state">' + (gifted ? 'Gifted (demo)' : 'Awaiting a gift') + '</span>' +
        '<button type="button" class="btn ghost small" data-gift="' + id + '">' + (gifted ? 'Undo' : 'Mark as gifted') + '</button></li>';
    }).join('') : '<li><span class="rg-name muted">No add-ons were chosen with this enquiry, so this registry strip is empty — add-ons chosen on an enquiry appear here automatically.</span></li>';
    panel.innerHTML =
      '<p class="eyebrow">Wedding OS — demo surfaces</p>' +
      '<p class="muted" style="margin-top:0">RSVP, guest list and registry for this enquiry, sharing its own data. Demo only: kept in this browser, nothing is sent anywhere.</p>' +
      '<div class="os-grid">' +
      '<div class="os-box"><h4>RSVP &amp; guest list (demo)</h4>' +
      '<p class="os-row"><span>Invited (from this enquiry):</span><span class="os-num">' + enq.guests + '</span><span>guests</span></p>' +
      '<p class="os-row"><span>Responses received:</span>' +
      '<button type="button" class="os-step" data-os-step="responses,-1" aria-label="One fewer response">−</button>' +
      '<span class="os-num" data-os-responses>' + st.responses + '</span>' +
      '<button type="button" class="os-step" data-os-step="responses,1" aria-label="One more response">+</button></p>' +
      '<p class="os-row"><span>Attending:</span>' +
      '<button type="button" class="os-step" data-os-step="attending,-1" aria-label="One fewer attending">−</button>' +
      '<span class="os-num" data-os-attending>' + st.attending + '</span>' +
      '<button type="button" class="os-step" data-os-step="attending,1" aria-label="One more attending">+</button></p>' +
      '<p class="muted" data-os-note style="margin:0"></p></div>' +
      '<div class="os-box"><h4>Registry strip (demo)</h4><ul class="os-reg">' + regRows + '</ul></div>' +
      '</div>';
    function paint() {
      panel.querySelector('[data-os-responses]').textContent = String(st.responses);
      panel.querySelector('[data-os-attending]').textContent = String(st.attending);
      panel.querySelector('[data-os-note]').textContent =
        st.responses + ' of ' + enq.guests + ' invited guests have responded · ' + st.attending + ' attending.';
      panel.querySelectorAll('[data-os-step]').forEach(function (b) {
        var parts = b.getAttribute('data-os-step').split(',');
        var field = parts[0], delta = Number(parts[1]);
        var next = st[field] + delta;
        var max = field === 'responses' ? enq.guests : st.responses;
        b.disabled = next < 0 || next > max;
      });
    }
    panel.addEventListener('click', function (e) {
      var step = e.target.closest ? e.target.closest('[data-os-step]') : null;
      var gift = e.target.closest ? e.target.closest('[data-gift]') : null;
      if (step && !step.disabled) {
        var parts = step.getAttribute('data-os-step').split(',');
        var field = parts[0], delta = Number(parts[1]);
        st[field] += delta;
        if (st.attending > st.responses) st.attending = st.responses;
        save('wd_os', all); paint();
      }
      if (gift) {
        var id = gift.getAttribute('data-gift');
        st.gifted[id] = !st.gifted[id];
        save('wd_os', all);
        var fresh = renderOsPanel(card, enq);
        panel.replaceWith(fresh);
      }
    });
    paint();
    return panel;
  }
  function enhanceEnquiryCards() {
    var host = document.querySelector('[data-my-enq]');
    if (!host) return;
    host.querySelectorAll('.ecard').forEach(function (card) {
      if (card.hasAttribute('data-os-done')) return;
      var tag = card.querySelector('.tag');
      var ref = tag ? tag.textContent.trim() : '';
      var enq = null;
      getEnquiries().forEach(function (e) { if (e.ref === ref) enq = e; });
      if (!enq || enq.status === 'Cancelled') { card.setAttribute('data-os-done', 'skip'); return; }
      card.setAttribute('data-os-done', '1');
      card.appendChild(renderOsPanel(card, enq));
    });
  }
  function initOs() {
    var host = document.querySelector('[data-my-enq]');
    if (!host) return;
    enhanceEnquiryCards();
    new MutationObserver(enhanceEnquiryCards).observe(host, { childList: true });
  }

  if (page === 'home') initFinale();
  if (page === 'venue' || page === 'enquire') initCineStrips();
  if (page === 'enquiries') initOs();
})();

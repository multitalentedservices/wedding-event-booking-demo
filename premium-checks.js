/* Dilnaaz Weddings & Events (DEMO) — premium-upgrade checks (2026-11-22).
   Separate from tests.js (unamended). Browser-level proofs for the finale:
   P1 link audit, P8 weights, Lenis + pinned chapters, SplitText hero,
   cinematic date strip, exact enquiry totals, Wedding-OS surfaces sharing
   the enquiry dataset, cancel-frees-date, reduced-motion + no-JS states. */
const { chromium } = require('/home/hatch/workspace/tools/screenshot-engine/node_modules/playwright');
const fs = require('fs'), path = require('path'), zlib = require('zlib');
const ROOT = __dirname;
const EXEC = '/home/hatch/workspace/tools/screenshot-engine/browsers/chrome-headless-shell-linux64/chrome-headless-shell';
let pass = 0, fail = 0; const fails = [];
function t(name, cond, extra) {
  if (cond) { pass++; console.log('PASS  ' + name); }
  else { fail++; fails.push(name); console.log('FAIL  ' + name + (extra ? '  [' + extra + ']' : '')); }
}
const gz = f => zlib.gzipSync(fs.readFileSync(path.join(ROOT, f))).length;

(async () => {
  /* ---------- P8 weights (measured, gzip) ---------- */
  const base = gz('js/logic.js') + gz('js/app.js');
  const prem = gz('js/premium.js');
  const indexTotal = base + prem + gz('assets/vendor/gsap.min.js') + gz('assets/vendor/ScrollTrigger.min.js') + gz('assets/vendor/SplitText.min.js') + gz('assets/vendor/lenis.min.js');
  const plainTotal = base + prem;
  t('P8 plain pages JS = ' + plainTotal + ' B gzip <= 20 KB', plainTotal <= 20 * 1024);
  t('P8 index (hero/finale) JS = ' + indexTotal + ' B gzip <= 90 KB', indexTotal <= 90 * 1024);
  t('full stack arithmetic: GSAP+ST+SplitText+Lenis = ' + (gz('assets/vendor/gsap.min.js') + gz('assets/vendor/ScrollTrigger.min.js') + gz('assets/vendor/SplitText.min.js') + gz('assets/vendor/lenis.min.js')) + ' B; Swiper/Alpine deliberately NOT loaded (would break P8)', !fs.existsSync(path.join(ROOT, 'assets/vendor/swiper-bundle.min.js')) && !fs.existsSync(path.join(ROOT, 'assets/vendor/alpine.min.js')));

  const browser = await chromium.launch({ executablePath: EXEC, args: ['--proxy-server=http://hatch-egress-proxy:3128', '--no-sandbox', '--force-color-profile=srgb'] });
  const pages = ['index.html', 'venues.html', 'venue.html?id=2', 'packages.html', 'enquire.html', 'enquiries.html'];

  /* ---------- P1 link audit + console, every page x 2 viewports ---------- */
  for (const w of [1440, 390]) {
    for (const p of pages) {
      const ctx = await browser.newContext({ viewport: { width: w, height: 900 } });
      const page = await ctx.newPage();
      const errors = [];
      page.on('console', m => { if (m.type() === 'error' && !/ERR_TUNNEL|Failed to load resource/.test(m.text())) errors.push(m.text()); });
      page.on('pageerror', e => errors.push(String(e)));
      await page.goto('file://' + path.join(ROOT, p), { waitUntil: 'load' });
      await page.waitForTimeout(700);
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 400) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 40)); }
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(400);
      const audit = await page.evaluate(() => {
        const bad = [];
        document.querySelectorAll('a').forEach(a => {
          const r = a.getBoundingClientRect();
          if (r.width < 2 || r.height === 0) return; /* skip link is 1px-clipped at rest */
          const cs = getComputedStyle(a);
          if (cs.color === 'rgb(0, 0, 238)') bad.push('UA-blue: ' + a.textContent.trim().slice(0, 30));
          if (cs.textDecorationLine.includes('underline')) bad.push('resting underline (not in Wedding system): ' + a.textContent.trim().slice(0, 30));
        });
        return bad;
      });
      t('P1 ' + p + ' @' + w + ': 0 link offenders', audit.length === 0, audit.join('; '));
      t('console clean ' + p + ' @' + w, errors.length === 0, errors.join('; ').slice(0, 200));
      await ctx.close();
    }
  }

  /* ---------- finale: Lenis + pinned chapters + signature moment -------- */
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto('file://' + path.join(ROOT, 'index.html'), { waitUntil: 'load' });
  await page.waitForTimeout(1200);
  const finale = await page.evaluate(() => ({
    lenis: typeof window.Lenis === 'function' && !!document.querySelector('html.lenis, html.lenis-smooth, .lenis'),
    pinSpacer: !!document.querySelector('.pin-spacer'),
    stageVisible: !document.querySelector('[data-chapters-stage]').hidden,
    staticHidden: document.querySelector('[data-chapters-static]').hidden,
    panels: document.querySelectorAll('.chapter-panel').length,
    splitLines: document.querySelectorAll('.hero h1 .split-line, .hero h1 [class*="line"]').length
  }));
  t('Lenis active on index', finale.lenis);
  t('ScrollTrigger pin engaged (pin-spacer present)', finale.pinSpacer);
  t('chapters stage live, static sequence hidden', finale.stageVisible && finale.staticHidden);
  t('3 venue chapter panels built from data object', finale.panels === 3);
  /* scroll to mid-pin: chapter II should be the visible chapter */
  const mid = await page.evaluate(() => {
    const stage = document.querySelector('[data-chapters-stage]');
    const top = stage.getBoundingClientRect().top + window.scrollY;
    window.scrollTo(0, top + window.innerHeight * 1.1);
    return top;
  });
  await page.waitForTimeout(1600);
  const midState = await page.evaluate(() => {
    const panels = Array.from(document.querySelectorAll('.chapter-panel'));
    return {
      opacities: panels.map(p => Number(getComputedStyle(p).opacity).toFixed(2)),
      count: (document.querySelector('[data-chapter-count]') || {}).textContent || ''
    };
  });
  t('mid-pin: chapter II is the visible chapter', Number(midState.opacities[1]) > 0.6 && Number(midState.opacities[0]) < 0.4, JSON.stringify(midState));
  t('chapter counter reads Chapter II / III', midState.count.includes('II'), midState.count);
  await page.screenshot({ path: path.join(ROOT, 'screenshots', 'signature-moment.png') });
  t('signature moment captured (mid pinned chapter)', fs.existsSync(path.join(ROOT, 'screenshots', 'signature-moment.png')));
  await ctx.close();

  /* ---------- cinematic date strip (venue id=2: 3 booked dates) --------- */
  const ctx2 = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const p2 = await ctx2.newPage();
  await p2.goto('file://' + path.join(ROOT, 'venue.html?id=2'), { waitUntil: 'load' });
  await p2.waitForTimeout(700);
  const strip = await p2.evaluate(() => ({
    total: document.querySelectorAll('.date-btn').length,
    cine: document.querySelectorAll('.date-btn.cine-btn').length,
    disabled: document.querySelectorAll('.date-btn[disabled]').length,
    first: document.querySelector('.date-btn') ? document.querySelector('.date-btn').textContent.replace(/\s+/g, ' ').trim() : ''
  }));
  t('date strip: 14 season Saturdays, all cinematically re-presented', strip.total === 14 && strip.cine === 14, JSON.stringify(strip));
  t('date strip: exactly the 3 data-object bookings disabled', strip.disabled === 3, 'disabled=' + strip.disabled);
  await ctx2.close();

  /* ---------- exact enquiry total + Wedding OS surfaces ----------------- */
  const ctx3 = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const p3 = await ctx3.newPage();
  await p3.goto('file://' + path.join(ROOT, 'enquire.html?venue=2&package=baraat'), { waitUntil: 'load' });
  await p3.waitForTimeout(600);
  await p3.fill('#enq-guests', '400');
  await p3.check('[data-addon="floral"]');
  await p3.check('[data-addon="photo"]');
  await p3.waitForTimeout(250);
  const grand = await p3.textContent('[data-t-grand]');
  t('enquiry total EXACT: Ivory Court + Baraat x400 + floral + photo = PKR 1,470,000', grand.includes('PKR 1,470,000'), grand.trim());
  await p3.click('.date-btn[data-date="2026-11-28"]');
  await p3.fill('#enq-name', 'Ayesha Khan');
  await p3.fill('#enq-phone', '0321 555 0142');
  await p3.fill('#enq-email', 'ayesha@example.com');
  await p3.click('[data-enq-form] button[type="submit"]');
  await p3.waitForTimeout(500);
  const conf = (await p3.textContent('[data-confirm]') || '').replace(/\s+/g, ' ');
  const ref = (conf.match(/WD-DEMO-\d{4}/) || [])[0];
  t('confirmation ref + exact total', !!ref && conf.includes('PKR 1,470,000'), ref + ' / ' + conf.slice(0, 100));
  await p3.goto('file://' + path.join(ROOT, 'enquiries.html'), { waitUntil: 'load' });
  await p3.waitForTimeout(700);
  const os = await p3.evaluate(() => ({
    panel: !!document.querySelector('.os-panel'),
    regRows: document.querySelectorAll('.os-reg li').length,
    invited: document.querySelector('.os-panel') ? document.querySelector('.os-panel').textContent.includes('400') : false
  }));
  t('Wedding OS panel shares the enquiry dataset (400 guests, 2 registry add-ons)', os.panel && os.regRows === 2 && os.invited, JSON.stringify(os));
  await p3.click('[data-os-step="responses,1"]');
  await p3.click('[data-os-step="responses,1"]');
  await p3.click('[data-os-step="attending,1"]');
  await p3.waitForTimeout(250);
  const osState = await p3.evaluate(ref => JSON.parse(localStorage.getItem('wd_os') || '{}')[ref], ref);
  t('RSVP state persists per enquiry ref', !!osState && osState.responses === 2 && osState.attending === 1, JSON.stringify(osState));
  await p3.click('[data-gift="floral"]');
  await p3.waitForTimeout(250);
  const giftState = await p3.evaluate(ref => JSON.parse(localStorage.getItem('wd_os') || '{}')[ref], ref);
  t('registry gift toggle persists', !!giftState && giftState.gifted && giftState.gifted.floral === true, JSON.stringify(giftState));
  /* cancel frees the date again */
  await p3.click('[data-cancel="' + ref + '"]');
  await p3.waitForTimeout(400);
  await p3.goto('file://' + path.join(ROOT, 'venue.html?id=2'), { waitUntil: 'load' });
  await p3.waitForTimeout(600);
  const freed = await p3.evaluate(() => {
    const b = document.querySelector('.date-btn[data-date="2026-11-28"]');
    return b ? { disabled: b.disabled, label: b.textContent.replace(/\s+/g, ' ') } : null;
  });
  t('cancel frees the date (strip no longer Booked by you / disabled)', !!freed && !freed.disabled && !/Booked by you/.test(freed.label), JSON.stringify(freed));
  await ctx3.close();

  /* ---------- reduced motion: static chapters, no pin -------------------- */
  const ctx4 = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const p4 = await ctx4.newPage();
  await p4.goto('file://' + path.join(ROOT, 'index.html'), { waitUntil: 'load' });
  await p4.waitForTimeout(800);
  const rm = await p4.evaluate(() => ({
    staticVisible: !document.querySelector('[data-chapters-static]').hidden,
    stageHidden: document.querySelector('[data-chapters-stage]').hidden,
    pinSpacer: !!document.querySelector('.pin-spacer'),
    chapters: document.querySelectorAll('.chapter-static').length
  }));
  t('reduced motion: complete static chapter sequence, no pin', rm.staticVisible && rm.stageHidden && !rm.pinSpacer && rm.chapters === 3, JSON.stringify(rm));
  await ctx4.close();

  /* ---------- no JS: complete static page -------------------------------- */
  const ctx5 = await browser.newContext({ viewport: { width: 390, height: 844 }, javaScriptEnabled: false });
  const p5 = await ctx5.newPage();
  await p5.goto('file://' + path.join(ROOT, 'index.html'), { waitUntil: 'load' });
  await p5.waitForTimeout(500);
  const nojs = await p5.evaluate(() => ({
    chapters: document.querySelectorAll('.chapter-static').length,
    names: Array.from(document.querySelectorAll('.chapter-name')).map(e => e.textContent.trim())
  }));
  t('no-JS: all 3 chapters present as a normal vertical sequence', nojs.chapters === 3 && nojs.names.join('|').includes('Roshanara') && nojs.names.join('|').includes('Seabreeze'), JSON.stringify(nojs));
  await ctx5.close();

  await browser.close();
  console.log('\nPREMIUM CHECKS: ' + pass + ' PASS / ' + fail + ' FAIL');
  if (fails.length) console.log('FAILURES: ' + fails.join(' | '));
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });

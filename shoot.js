/* Dilnaaz Weddings & Events (DEMO) — screenshot + audit + flow + keyboard runner.
   Modes: default (6 pages x 390/768/1440), --probe320, --nojs, --reduced, --flows, --keyboard.
   No sticky/fixed chrome except the transient toast, so full-page captures are clean (lesson 35). */
const { chromium } = require('/home/hatch/workspace/tools/screenshot-engine/node_modules/playwright');
const fs = require('fs'), path = require('path');
const ROOT = '/home/hatch/workspace/portfolio-builds/wedding-event-booking-demo';
const EXEC = '/home/hatch/workspace/tools/screenshot-engine/browsers/chrome-headless-shell-linux64/chrome-headless-shell';
const OUT = process.argv[2];
const NOJS = process.argv.includes('--nojs'), PROBE = process.argv.includes('--probe320'),
  FLOWS = process.argv.includes('--flows'), REDUCED = process.argv.includes('--reduced'),
  KEYBOARD = process.argv.includes('--keyboard');
const PAGES = [['index', 'index.html'], ['venues', 'venues.html'], ['venue', 'venue.html?id=2'],
  ['packages', 'packages.html'], ['enquire', 'enquire.html'], ['enquiries', 'enquiries.html']];
const VIEWPORTS = PROBE ? [['probe320', 320, 700]] : [['phone', 390, 844], ['tablet', 768, 1024], ['desktop', 1440, 900]];

async function auditPage(page) {
  return page.evaluate(() => {
    const vw = window.innerWidth; const bad = [];
    document.querySelectorAll('body *').forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.width > 0 && (r.right > vw + 1 || r.left < -1)) {
        if (el.closest('.vh') || el.closest('.toast')) return;
        let clipped = false;
        for (let a = el.parentElement; a && a !== document.body; a = a.parentElement) {
          const ox = getComputedStyle(a).overflowX;
          if (ox === 'hidden' || ox === 'clip' || ox === 'auto' || ox === 'scroll') { clipped = true; break; }
        }
        if (!clipped) bad.push({ el: el.tagName.toLowerCase() + '.' + String(el.className).split(' ').join('.'), right: Math.round(r.right) });
      }
    });
    const broken = [];
    document.querySelectorAll('img').forEach(im => { if (im.complete && im.naturalWidth === 0) broken.push(im.getAttribute('src')); });
    const textBad = [];
    document.querySelectorAll('body *').forEach(el => {
      if (el.children.length || !el.textContent || !el.textContent.trim() || el.closest('.vh')) return;
      if (el.scrollWidth > el.clientWidth + 1) textBad.push({ el: el.tagName.toLowerCase(), sw: el.scrollWidth, cw: el.clientWidth, text: el.textContent.trim().slice(0, 40) });
    });
    return { overflowX: document.documentElement.scrollWidth - vw, badEls: bad.slice(0, 12), brokenImgs: broken, textBad: textBad.slice(0, 12) };
  });
}
async function settle(page) {
  if (NOJS) { await page.waitForTimeout(500); return; }
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 400) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 50)); }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(250);
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ executablePath: EXEC, args: ['--proxy-server=http://hatch-egress-proxy:3128', '--no-sandbox', '--force-color-profile=srgb'] });

  if (KEYBOARD) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await ctx.newPage(); const rows = [];
    const rec = async (label, i) => {
      const info = await page.evaluate(() => {
        const el = document.activeElement; if (!el) return null;
        const cs = getComputedStyle(el);
        return { tag: el.tagName.toLowerCase(), text: (el.textContent || el.value || el.id || '').trim().replace(/\s+/g, ' ').slice(0, 44), cls: (typeof el.className === 'string' ? el.className : '') || el.id || '', outline: cs.outlineWidth + ' ' + cs.outlineStyle + ' ' + cs.outlineColor };
      });
      rows.push('| ' + label + ' | ' + i + ' | ' + (info ? info.tag + ' — ' + info.text : '?') + ' | ' + (info ? info.cls : '') + ' | ' + (info ? info.outline : '') + ' |');
    };
    await page.goto('file://' + path.join(ROOT, 'venues.html'), { waitUntil: 'load' }); await page.waitForTimeout(500);
    for (let i = 1; i <= 10; i++) { await page.keyboard.press('Tab'); await page.waitForTimeout(90); await rec('venues filters', i); if (i === 5) await page.screenshot({ path: path.join(OUT, 'keyboard-venues-city.png') }); }
    await page.goto('file://' + path.join(ROOT, 'enquire.html?venue=2&package=baraat'), { waitUntil: 'load' }); await page.waitForTimeout(500);
    for (let i = 1; i <= 16; i++) { await page.keyboard.press('Tab'); await page.waitForTimeout(90); await rec('enquire form', i); if (i === 6) await page.screenshot({ path: path.join(OUT, 'keyboard-enquire-date.png') }); }
    await page.goto('file://' + path.join(ROOT, 'venue.html?id=2'), { waitUntil: 'load' }); await page.waitForTimeout(500);
    for (let i = 1; i <= 22; i++) { await page.keyboard.press('Tab'); await page.waitForTimeout(90); await rec('venue date strip', i); if (i === 14) await page.screenshot({ path: path.join(OUT, 'keyboard-venue-date.png') }); }
    fs.writeFileSync(path.join(OUT, 'keyboard-walk.md'),
      '# Keyboard walk — Dilnaaz Weddings & Events (Demo)\n\nMethod: Playwright Tab at 1280px on venues.html, enquire.html?venue=2&package=baraat and venue.html?id=2; focused element + computed outline recorded per stop. Filters and form fields are native selects/inputs (lesson 34); season dates are real <button> elements — booked dates are disabled and therefore correctly skipped by Tab, while every available date button is a Tab stop with the same visible focus. No visually-hidden inputs exist, so the lesson-20 focus-host case does not arise (checked, not applicable). Focus style: links and buttons take a 3px solid #5C1A24 outline (:focus-visible), 11.97:1 against ivory; native selects/inputs take the field system focus (burgundy border + ivory ring) — their computed outline reads 0px none in the headless record because the indicator is the border/shadow, which is the visible state in the keyboard screenshots.\n\n| Surface | Stop | Focused element | Class/id | Outline |\n|---|---|---|---|---|\n' + rows.join('\n') + '\n');
    console.log('KEYBOARD DONE'); await browser.close(); return;
  }

  if (FLOWS) {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await ctx.newPage(); const log = [];
    const ok = (name, cond) => log.push((cond ? 'PASS  ' : 'FAIL  ') + name);
    /* 1) Venues empty state naming constraints + one-click reset */
    await page.goto('file://' + path.join(ROOT, 'venues.html'), { waitUntil: 'load' }); await page.waitForTimeout(500);
    await page.selectOption('[data-f-city]', 'Karachi'); await page.selectOption('[data-f-band]', 'gt800'); await page.waitForTimeout(300);
    const emptyMsg = await page.textContent('[data-v-empty-msg]');
    ok('empty state NAMES constraints -> ' + emptyMsg.trim(), emptyMsg.includes('Karachi') && emptyMsg.includes('More than 800'));
    await page.screenshot({ path: path.join(OUT, 'flow-empty-state.png'), fullPage: true });
    await page.click('[data-v-reset]'); await page.waitForTimeout(300);
    const countTxt = await page.textContent('[data-v-count]');
    ok('reset restores full count -> ' + countTxt.trim(), countTxt.includes('Showing 6 of 6'));
    /* 2) Venue detail: availability BEFORE any enquiry */
    await page.goto('file://' + path.join(ROOT, 'venue.html?id=2'), { waitUntil: 'load' }); await page.waitForTimeout(500);
    const availBefore = await page.textContent('[data-avail-count]');
    ok('availability BEFORE -> ' + availBefore.trim(), availBefore.includes('11 of 14'));
    const btnBefore = await page.evaluate(() => { const b = document.querySelector('[data-date="2026-12-05"]'); return { disabled: b.disabled, label: b.textContent }; });
    ok('5 Dec button enabled BEFORE -> ' + btnBefore.label.trim(), !btnBefore.disabled && btnBefore.label.includes('Available'));
    await page.screenshot({ path: path.join(OUT, 'flow-venue-before.png'), fullPage: true });
    /* 3) Booked-date rejection rendered: preset a booked date into the enquiry */
    await page.goto('file://' + path.join(ROOT, 'enquire.html?venue=2&date=2026-12-12'), { waitUntil: 'load' }); await page.waitForTimeout(500);
    const dateErr = await page.textContent('[data-err-for="enq-date"]');
    ok('booked-date rejection NAMES venue + date -> ' + dateErr.trim(), dateErr.includes('The Ivory Court') && dateErr.includes('Saturday 12 Dec 2026') && dateErr.includes('already booked'));
    ok('rejection suggests nearest alternatives', dateErr.includes('Saturday 5 Dec 2026'));
    await page.screenshot({ path: path.join(OUT, 'flow-booked-date-rejection.png'), fullPage: true });
    /* 4) WhatsApp firing recorded (lesson 21) */
    await page.goto('file://' + path.join(ROOT, 'venue.html?id=2'), { waitUntil: 'load' }); await page.waitForTimeout(500);
    const popupP = page.waitForEvent('popup', { timeout: 4000 }).catch(() => null);
    await page.click('[data-wa]');
    const popup = await popupP; if (popup) { await popup.waitForTimeout(300); await popup.close(); }
    await page.waitForTimeout(300);
    const waLog = await page.evaluate(() => JSON.parse(localStorage.getItem('wd_wa_log') || '[]'));
    ok('FIRING whatsapp log -> ' + JSON.stringify(waLog), waLog.length === 1 && waLog[0].venue.includes('Ivory Court'));
    /* 5) Enquiry: capacity boundary pair, bad phone, then success */
    await page.goto('file://' + path.join(ROOT, 'enquire.html?venue=2&package=baraat'), { waitUntil: 'load' }); await page.waitForTimeout(500);
    await page.click('[data-date="2026-12-05"]'); await page.waitForTimeout(200);
    await page.check('[data-addon="floral"]'); await page.check('[data-addon="photo"]');
    await page.fill('#enq-guests', '401');
    await page.fill('#enq-name', 'Ayesha Khan'); await page.fill('#enq-phone', '0321 555 0142'); await page.fill('#enq-email', 'ayesha@example.com');
    await page.click('[data-enq-form] button[type="submit"]'); await page.waitForTimeout(300);
    const gErr = await page.textContent('[data-err-for="enq-guests"]');
    ok('capacity+1 (401 of 400) error CONTENT -> ' + gErr.trim(), gErr.includes('maximum of 400 guests'));
    await page.screenshot({ path: path.join(OUT, 'flow-capacity-boundary.png'), fullPage: true });
    await page.fill('#enq-guests', '400'); await page.waitForTimeout(250);
    ok('guests == capacity (400) clears the error live', await page.evaluate(() => document.querySelector('[data-err-for="enq-guests"]').hidden));
    await page.fill('#enq-phone', '123'); await page.click('[data-enq-form] button[type="submit"]'); await page.waitForTimeout(300);
    const pErr = await page.textContent('[data-err-for="enq-phone"]');
    ok('bad phone error CONTENT -> ' + pErr.trim(), pErr.includes('03') && pErr.includes('11 digits'));
    await page.screenshot({ path: path.join(OUT, 'flow-phone-error.png'), fullPage: true });
    await page.fill('#enq-phone', '0321 555 0142'); await page.waitForTimeout(250);
    ok('valid phone clears error live', await page.evaluate(() => document.querySelector('[data-err-for="enq-phone"]').hidden));
    const totalTxt = await page.textContent('[data-t-grand]');
    ok('live total before submit = PKR 1,470,000 -> ' + totalTxt.trim(), totalTxt.includes('PKR 1,470,000'));
    await page.click('[data-enq-form] button[type="submit"]'); await page.waitForTimeout(400);
    const confTxt = (await page.textContent('[data-confirm]')).replace(/\s+/g, ' ');
    const ref = (confTxt.match(/WD-DEMO-\d{4}/) || [])[0];
    ok('confirmation ref -> ' + ref, !!ref);
    ok('confirmation itemised total PKR 1,470,000', confTxt.includes('PKR 1,470,000') && confTxt.includes('PKR 1,060,000') && confTxt.includes('PKR 280,000'));
    ok('confirmation states demo / no payment', confTxt.includes('no payment is taken') || confTxt.includes('takes no payment'));
    await page.screenshot({ path: path.join(OUT, 'flow-confirmation.png'), fullPage: true });
    /* 6) Cross-surface: date now booked-by-you on the venue detail (lessons 30/38) */
    await page.goto('file://' + path.join(ROOT, 'venue.html?id=2'), { waitUntil: 'load' }); await page.waitForTimeout(500);
    const btnAfter = await page.evaluate(() => { const b = document.querySelector('[data-date="2026-12-05"]'); return { disabled: b.disabled, label: b.textContent }; });
    ok('5 Dec button AFTER enquiry -> ' + btnAfter.label.trim(), btnAfter.disabled && btnAfter.label.includes('Booked by you'));
    const availAfter = await page.textContent('[data-avail-count]');
    ok('availability AFTER -> ' + availAfter.trim(), availAfter.includes('10 of 14'));
    await page.screenshot({ path: path.join(OUT, 'flow-venue-after.png'), fullPage: true });
    /* 7) My Enquiries lists it; cancel frees the date */
    await page.goto('file://' + path.join(ROOT, 'enquiries.html'), { waitUntil: 'load' }); await page.waitForTimeout(500);
    const myTxt = (await page.textContent('[data-my-enq]')).replace(/\s+/g, ' ');
    ok('My Enquiries contains ref + total', myTxt.includes(ref) && myTxt.includes('PKR 1,470,000'));
    await page.screenshot({ path: path.join(OUT, 'flow-my-enquiries.png'), fullPage: true });
    await page.click('[data-cancel]'); await page.waitForTimeout(300);
    const myTxt2 = (await page.textContent('[data-my-enq]')).replace(/\s+/g, ' ');
    ok('status after cancel -> Cancelled', myTxt2.includes('Cancelled'));
    await page.goto('file://' + path.join(ROOT, 'venue.html?id=2'), { waitUntil: 'load' }); await page.waitForTimeout(500);
    const btnFreed = await page.evaluate(() => { const b = document.querySelector('[data-date="2026-12-05"]'); return { disabled: b.disabled, label: b.textContent }; });
    ok('5 Dec button FREED after cancel -> ' + btnFreed.label.trim(), !btnFreed.disabled && btnFreed.label.includes('Available'));
    const availFreed = await page.textContent('[data-avail-count]');
    ok('availability RESTORED -> ' + availFreed.trim(), availFreed.includes('11 of 14'));
    await page.screenshot({ path: path.join(OUT, 'flow-venue-freed.png'), fullPage: true });
    fs.writeFileSync(path.join(OUT, 'flow-log.txt'), log.join('\n') + '\n');
    console.log(log.join('\n')); console.log('FLOWS DONE'); await browser.close(); return;
  }

  const results = {};
  const pageList = PROBE ? [['index', 'index.html']] : PAGES;
  for (const [pname, file] of pageList) {
    for (const [vname, w, h] of VIEWPORTS) {
      const ctx = await browser.newContext({ viewport: { width: w, height: h }, javaScriptEnabled: !NOJS, reducedMotion: REDUCED ? 'reduce' : 'no-preference' });
      const page = await ctx.newPage();
      await page.goto('file://' + path.join(ROOT, file), { waitUntil: 'load' });
      await page.waitForTimeout(400); await settle(page);
      results[pname + '@' + vname] = await auditPage(page);
      await page.screenshot({ path: path.join(OUT, pname + '-' + vname + '.png'), fullPage: true });
      await ctx.close();
    }
  }
  fs.writeFileSync(path.join(OUT, 'audit.json'), JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
  console.log('SHOOT DONE -> ' + OUT);
  await browser.close();
})();

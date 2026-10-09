/* ITM Customs: the install booking page (book/). Loaded after app.js and shares its helpers ($, byH, INST, ITMbookFor). */
/* ---------- booking ---------- */
const form = $('#booker');
$$('.opts', form).forEach(g => g.addEventListener('click', e => {
  const o = e.target.closest('.opt'); if (!o) return;
  if (g.hasAttribute('data-single')) $$('.opt', g).forEach(x => x !== o && x.classList.remove('on'));
  o.classList.toggle('on');
  $$('.opt', g).forEach(x => x.setAttribute('aria-pressed', x.classList.contains('on')));
}));
function pick(name, label) {
  const o = $$(`.opts[data-name="${name}"] .opt`, form).find(x => x.textContent.trim().toLowerCase() === String(label).toLowerCase());
  if (o && !o.classList.contains('on')) o.click();
}
const picked = n => $$(`.opts[data-name="${n}"] .opt.on`, form).map(x => x.textContent.trim());
/* drop-off picker: a month calendar (tomorrow to 60 days out) + a window + an exact time.
   HOURS is the shop's drop-off schedule, confirmed by Isaac on call 1 (Mon–Sat 9–4:30). When ITM connects a scheduler
   (Square / Shopify booking), its open slots replace SLOT_OPEN below. */
const HOURS = {
  days: [1, 2, 3, 4, 5, 6],                      // Mon to Sat; Sunday closed
  Morning:   ['9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM'],
  Midday:    ['12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM'],
  Afternoon: ['2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM'],
  ahead: 60,
};
const SLOT_OPEN = d => HOURS.days.includes(d.getDay());
/* live availability from the shop's Google Calendar (booking/Code.gs, set in <meta name="itm-booking-api">).
   Without an endpoint the demo runs on sample availability so the behaviour is visible. */
const BOOK_API = (document.querySelector('meta[name="itm-booking-api"]')?.content || '').trim();
const isoOf = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const ALL_SLOTS = [...HOURS.Morning, ...HOURS.Midday, ...HOURS.Afternoon];
const AV = {}, AV_DONE = new Set();
let AV_FAIL = false;
function sampleDay(d) {               // demo data only: a day off now and then, a few times already booked
  if (!SLOT_OPEN(d)) return { open: false, reason: 'closed', times: [] };
  const n = d.getDate() + d.getMonth() * 31;
  if (n % 11 === 3) return { open: false, reason: 'off', times: [] };
  let mine = []; try { mine = JSON.parse(sessionStorage.getItem('itm_demo_booked') || '[]'); } catch (e) {}
  const times = ALL_SLOTS.filter((t, i) => (n * 7 + i * 3) % 5 !== 0 && !mine.includes(isoOf(d) + ' ' + t));
  return { open: times.length > 0, reason: times.length ? '' : 'full', times };
}
const calStatus = t => { const el = $('#calStatus'); if (el) el.textContent = t; };
async function loadMonth(y, m, done) {
  const key = `${y}-${m}`; if (AV_DONE.has(key)) return; AV_DONE.add(key);
  const from = new Date(y, m, 1, 12), to = new Date(y, m + 1, 0, 12);
  if (!BOOK_API) { for (let d = new Date(from); d <= to; d.setDate(d.getDate() + 1)) AV[isoOf(d)] = sampleDay(d); return done(); }
  calStatus('Checking open times…');
  try {
    const r = await fetch(`${BOOK_API}?action=availability&from=${isoOf(from)}&to=${isoOf(to)}`);
    const j = await r.json(); if (!j.ok) throw new Error('availability');
    Object.assign(AV, j.days); calStatus('');
  } catch (e) { AV_DONE.delete(key); AV_FAIL = true; calStatus('Live times didn’t load. Pick a day and time and we’ll confirm it.'); }
  done();
}
const dayInfo = d => AV[isoOf(d)] || (AV_FAIL ? { open: SLOT_OPEN(d), times: ALL_SLOTS } : null);
const dayIn = $('[name=day]', form), timeIn = $('[name=time]', form), dateIn = $('[name=date]', form);
const fmtDay = d => d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
const dkey = d => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
const cal = (() => {
  const t0 = new Date(); t0.setHours(12, 0, 0, 0);
  const min = new Date(t0); min.setDate(t0.getDate() + 1);
  const max = new Date(t0); max.setDate(t0.getDate() + HOURS.ahead);
  let view = new Date(min.getFullYear(), min.getMonth(), 1), picked = null;
  const grid = $('#slotDays');
  function render() {
    $('#calMonth').textContent = view.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    const y = view.getFullYear(), m = view.getMonth(), days = new Date(y, m + 1, 0).getDate();
    let h = '<span class="cal-pad"></span>'.repeat(new Date(y, m, 1).getDay());
    for (let i = 1; i <= days; i++) {
      const d = new Date(y, m, i, 12), inRange = d >= min && d <= max, info = inRange ? dayInfo(d) : null;
      const ok = !!(info && info.open), on = picked && dkey(picked) === dkey(d);
      const why = !inRange ? '' : !info ? ', loading' : ok ? '' : info.reason === 'full' ? ', fully booked' : info.reason === 'off' ? ', shop closed' : ', closed';
      const cls = inRange && info && !ok ? (info.reason === 'full' ? ' full' : info.reason === 'off' ? ' off' : '') : '';
      h += `<button type="button" class="sday${on ? ' on' : ''}${cls}" role="radio" aria-checked="${!!on}" data-k="${dkey(d)}"${ok ? '' : ' disabled'} aria-label="${d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}${why}">${i}</button>`;
    }
    grid.innerHTML = h;
    $('.cal-nav[data-m="-1"]').disabled = y === min.getFullYear() && m <= min.getMonth();
    $('.cal-nav[data-m="1"]').disabled = y === max.getFullYear() && m >= max.getMonth();
    loadMonth(y, m, render);
  }
  $$('.cal-nav').forEach(b => b.onclick = () => { view = new Date(view.getFullYear(), view.getMonth() + +b.dataset.m, 1); render(); });
  grid.addEventListener('click', e => {
    const b = e.target.closest('.sday'); if (!b || b.disabled) return;
    const [y, m, d] = b.dataset.k.split('-').map(Number); picked = new Date(y, m, d, 12);
    dayIn.value = fmtDay(picked); dateIn.value = isoOf(picked); render(); refreshTimes(); slotLabel();
  });
  render();
  return { render, reload: () => { const k = picked ? `${picked.getFullYear()}-${picked.getMonth()}` : ''; AV_DONE.delete(k); render(); } };
})();
function choose(group, btn) {
  $$('[role=radio]', group).forEach(x => { const on = x === btn; x.classList.toggle('on', on); x.setAttribute('aria-checked', on); });
}
$('#slotTimes').addEventListener('click', e => { const b = e.target.closest('.slot'); if (!b) return;
  choose($('#slotTimes'), b);
  refreshTimes(); slotLabel(); });
/* the exact times for the chosen window; times already booked on the calendar show as taken */
function refreshTimes() {
  const win = $('#slotTimes .slot.on'), hrs = $('#slotHours'); if (!win) return;
  const free = (dateIn.value && AV[dateIn.value] && AV[dateIn.value].times) || (dateIn.value ? null : ALL_SLOTS) || ALL_SLOTS;
  hrs.innerHTML = HOURS[win.dataset.t].map(t => { const ok = free.includes(t);
    return `<button type="button" class="stime${timeIn.value === t ? ' on' : ''}${ok ? '' : ' taken'}" role="radio" aria-checked="${timeIn.value === t}" data-t="${t}"${ok ? '' : ' disabled aria-label="' + t + ', booked"'}>${t}</button>`; }).join('');
  hrs.hidden = false;
  if (!HOURS[win.dataset.t].includes(timeIn.value) || !free.includes(timeIn.value)) { if (timeIn.value) $$('.stime.on', hrs).forEach(x => x.classList.remove('on')); timeIn.value = ''; }
}
$('#slotHours').addEventListener('click', e => { const b = e.target.closest('.stime'); if (!b || b.disabled) return;
  choose($('#slotHours'), b); timeIn.value = b.dataset.t; slotLabel(); });
function slotLabel() {
  const d = dayIn.value, t = timeIn.value;
  $('#bookBtnT').textContent = d && t ? `Book ${d}, ${t}` : d ? `Book ${d}` : 'Book My Install';
  $$('#slotDays, #slotTimes, #slotHours').forEach(g => $('.on', g) && g.classList.remove('bad'));
}
/* live parts estimate from the catalog prices above; labor is quoted by ITM */
/* the follow-up questions for each job, and the lines they produce for the calendar + emails */
const D = n => picked(n)[0] || '';
function details() {
  const w = picked('work'), out = [], f = Object.fromEntries(new FormData(form));
  const line = (job, bits) => out.push(job + (bits.filter(Boolean).length ? ': ' + bits.filter(Boolean).join(' · ') : ''));
  w.forEach(job => {
    if (job === 'Rock Lights') line(job, [D('d-rock'), D('d-rock-n') && D('d-rock-n') !== 'Not Sure' ? D('d-rock-n') + ' lights' : D('d-rock-n') ? 'count not sure' : '']);
    else if (job === 'Wheel Lights') line(job, [D('d-wheel'), D('d-wheel-size') ? D('d-wheel-size') + ' wheels' : '']);
    else if (job === 'Switchback / Amber') line(job, [D('d-sb') ? D('d-sb') + ' kit' : '']);
    else if (job === 'Pillar Lights') line(job, [D('d-pillar')]);
    else if (job === 'Push-Button Switch') line(job, [D('d-sw') ? D('d-sw') + (D('d-sw') === '1' ? ' switch' : ' switches') : '']);
    else if (job === 'Wiring Fix / Troubleshoot') line(job, [(f['d-wire'] || '').trim()]);
    else if (job === 'Something Else') line(job, [(f['d-other'] || '').trim()]);
    else line(job, []);
  });
  return out;
}
/* live parts estimate from the store's prices; labor is quoted by ITM */
function partsEstimate() {
  const w = picked('work'), items = [];
  if (w.includes('Rock Lights')) {
    const per = /^72/.test(D('d-rock')) ? 45 : 55, name = /^72/.test(D('d-rock')) ? '72-chip' : '84-chip', n = parseInt(D('d-rock-n'), 10);
    items.push(n ? [`${name} ×${n}`, per * (n / 4)] : [`${name} rock lights, set of 4`, per, 'from']);
  }
  if (w.includes('Wheel Lights')) items.push(/^5/.test(D('d-wheel')) ? ['5-row wheel lights', 380] : /^10/.test(D('d-wheel')) ? ['10-row wheel lights', 499] : ['wheel lights', 380, 'from']);
  if (w.includes('Switchback / Amber')) { const k = { '4 Lights': 200, '10 Lights': 350, '16 Lights': 500 }[D('d-sb')]; items.push(k ? [`switchback ${D('d-sb').toLowerCase()}`, k] : ['switchback kit', 200, 'from']); }
  if (w.includes('RGBW Color Kit')) items.push(['RGBW kit', 200]);
  if (w.includes('Push-Button Switch')) { const n = parseInt(D('d-sw'), 10) || 1; items.push([`switch ×${n}`, 10 * n]); }
  return items;
}
function estimate() {
  const w = picked('work'), supply = picked('parts')[0] === 'ITM Supplies Them', el = $('#est');
  $$('.wd', form).forEach(x => { x.hidden = !w.includes(x.dataset.for); });
  if (!w.length) { el.innerHTML = ''; return; }
  const items = supply ? partsEstimate() : [];
  const total = items.reduce((a, i) => a + i[1], 0), from = items.some(i => i[2]);
  const bits = items.length ? 'Parts: ' + items.map(i => `${i[0]} <b>${i[2] ? 'from ' : ''}${money(i[1])}</b>`).join(' · ') +
    (items.length > 1 ? ` = <b>${from ? 'from ' : ''}${money(total)}</b>` : '') + '. ' : '';
  el.innerHTML = `${bits}Install labor is <b>quoted before we start</b>.`;
}
form.addEventListener('click', e => { if (e.target.closest('.opts')) setTimeout(estimate); });
form.addEventListener('input', e => { if (/^d-/.test(e.target.name || '')) setTimeout(estimate); });
form.addEventListener('submit', e => {
  e.preventDefault();
  const f = Object.fromEntries(new FormData(form)); const msg = $('#bookMsg');
  $$('.bad', form).forEach(x => x.classList.remove('bad'));
  const miss = ['name', 'contact'].filter(k => !f[k].trim());
  const noSlot = !f.day || !f.time;
  if (!picked('work').length || noSlot || miss.length) {
    if (noSlot) $$('#slotDays, #slotTimes, #slotHours').forEach(g => !$('.on', g) && g.classList.add('bad'));
    miss.forEach(k => $(`[name=${k}]`, form).classList.add('bad'));
    msg.className = 'fine err';
    msg.textContent = !picked('work').length ? 'Pick at least one job so we know what to quote.' : noSlot ? (!f.day ? 'Pick a drop-off day on the calendar.' : 'Pick a drop-off time.') : 'Add your name and a way to reach you.';
    return;
  }
  (BOOK_API ? bookLive : bookDemo)(f, msg);
});
/* demo: the same flow without a calendar connected (the slot is held for this browser session) */
function bookDemo(f, msg) {
  const btn = $('button[type=submit]', form), label = $('#bookBtnT');
  btn.disabled = true; label.textContent = 'Booking…'; msg.className = 'fine pending'; msg.textContent = 'Saving your drop-off to the shop calendar…';
  setTimeout(() => {
    try { const k = 'itm_demo_booked', v = JSON.parse(sessionStorage.getItem(k) || '[]'); v.push(f.date + ' ' + f.time); sessionStorage.setItem(k, JSON.stringify(v)); } catch (e) {}
    AV_DONE.clear(); Object.keys(AV).forEach(k => delete AV[k]);
    window.ITMtrack && ITMtrack('booking_submit', { day: f.date, time: f.time, live: false });
    btn.disabled = false; msg.className = 'fine'; msg.textContent = '';
    showBooked(f, `${f.day} at ${f.time}`);
  }, 900);
}
/* the confirmation card that replaces the form */
function showBooked(f, when) {
  const d = new Date(f.date + 'T12:00:00'), [h, mi, ap] = f.time.match(/(\d+):(\d+) (AM|PM)/).slice(1);
  const H = (+h % 12) + (ap === 'PM' ? 12 : 0), pad = n => String(n).padStart(2, '0');
  const st = `${f.date.replace(/-/g, '')}T${pad(H)}${mi}00`;
  const end = +mi + 30 >= 60 ? `${f.date.replace(/-/g, '')}T${pad(H + 1)}0000` : `${f.date.replace(/-/g, '')}T${pad(H)}${pad(+mi + 30)}00`;
  const gcal = 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' + encodeURIComponent('ITM Customs install drop-off') +
    `&dates=${st}/${end}&ctz=America/Phoenix&location=` + encodeURIComponent('ITM Customs, Mesa, AZ') + '&details=' + encodeURIComponent('Work: ' + picked('work').join(', '));
  const veh = [picked('vehicle')[0], f.ymm].filter(Boolean).join(' · ');
  const box = document.createElement('div'); box.className = 'bk-done'; box.setAttribute('role', 'status');
  box.innerHTML = `<div class="bk-done-top"><span class="bk-done-light" aria-hidden="true"></span><div><small>You’re Booked</small>
      <b>${d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</b><span>Drop-off at ${f.time} · ITM Customs, Mesa</span></div></div>
    <dl class="bk-done-rows"><div class="wide"><dt>Work</dt><dd>${details().map(l => l.replace(/</g, '&lt;')).join('<br>')}</dd></div>${veh ? `<div><dt>Vehicle</dt><dd>${veh.replace(/</g, '&lt;')}</dd></div>` : ''}
      <div><dt>Lights</dt><dd>${picked('parts')[0] || 'Not Sure Yet'}</dd></div><div><dt>Contact</dt><dd>${String(f.contact).replace(/</g, '&lt;')}</dd></div>${(f.notes || '').trim() ? `<div class="wide"><dt>Notes</dt><dd>${f.notes.trim().replace(/</g, '&lt;')}</dd></div>` : ''}</dl>
    <ol class="bk-done-next"><li><b>We Confirm</b>Your quote comes by ${/@/.test(f.contact) ? 'email' : 'text'} before any work starts.</li>
      <li><b>Roll In</b>Bring it to the shop at your time.</li><li><b>Roll Out Lit</b>Every light tested with you at pickup.</li></ol>
    <div class="bk-done-act"><a class="btn btn-primary" href="${gcal}" target="_blank" rel="noopener"><span>Add To My Calendar</span></a>
      <button type="button" class="btn btn-chrome bk-again"><span>Book Another Install</span></button></div>`;
  form.classList.add('done'); $('.bk-head', form).after(box);
  const navH = (document.getElementById('nav') || {}).offsetHeight || 64;
  scrollTo({ top: box.getBoundingClientRect().top + scrollY - navH - 12, behavior: matchMedia('(prefers-reduced-motion:reduce)').matches ? 'auto' : 'smooth' });
  $('.bk-again', box).onclick = () => { box.remove(); form.classList.remove('done'); form.reset(); $$('.on', form).forEach(x => { x.classList.remove('on'); x.setAttribute('aria-checked', 'false'); x.setAttribute('aria-pressed', 'false'); });
    dayIn.value = dateIn.value = timeIn.value = ''; $('#slotHours').hidden = true; $('#bookBtnT').textContent = 'Book My Install'; $('#est').innerHTML = ''; cal.render(); };
}


/* book straight onto the shop's Google Calendar */
async function bookLive(f, msg) {
  const btn = $('button[type=submit]', form), label = $('#bookBtnT');
  btn.disabled = true; const was = label.textContent; label.textContent = 'Booking…';
  msg.className = 'fine pending'; msg.textContent = 'Saving your drop-off to the shop calendar…';
  try {
    const r = await fetch(BOOK_API, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ name: f.name, contact: f.contact, vehicle: picked('vehicle')[0] || '', ymm: f.ymm || '', work: picked('work'), details: details(),
        parts: picked('parts')[0] || '', date: f.date, time: f.time, notes: f.notes || '', website: f.website || '' }) });
    const j = await r.json();
    if (j.ok) {
      msg.className = 'fine'; msg.textContent = ''; label.textContent = 'Book My Install';
      showBooked(f, j.when || f.day + ' at ' + f.time);
      window.ITMtrack && ITMtrack('booking_submit', { day: f.date, time: f.time, live: true });
      AV_DONE.clear(); Object.keys(AV).forEach(k => delete AV[k]); cal.render();
      return;
    }
    msg.className = 'fine err'; msg.textContent = j.error || 'That didn’t go through. Please try again.';
    if (j.taken) { timeIn.value = ''; cal.reload(); setTimeout(refreshTimes, 900); }
    window.ITMtrack && ITMtrack('booking_error', { reason: j.error || 'unknown' });
  } catch (e) {
    msg.className = 'fine err'; msg.textContent = 'Couldn’t reach the shop calendar. Please try again, or tap Message Us.';
    window.ITMtrack && ITMtrack('booking_error', { reason: 'network' });
  }
  btn.disabled = false; if (label.textContent === 'Booking…') label.textContent = was;
}

/* ---------- deep links: book/?book=1&work=…&kit=…&veh=…&count=… ---------- */
(function () {
  const q = new URLSearchParams(location.search);
  if (q.has('book')) {
    if (q.get('veh')) pick('vehicle', q.get('veh'));
    q.getAll('work').forEach(w => pick('work', w));
    const kits = q.getAll('kit').filter(h => byH[h]);
    if (kits.length && window.ITMbookFor) window.ITMbookFor(kits, 'subpage');
    window.ITMtrack && ITMtrack('book_deeplink', { work: q.getAll('work').join(','), kit: kits.join(',') });
  }
  const n = parseInt(q.get('count'), 10);
  if (n) { pick('vehicle', 'Truck'); pick('work', 'Rock Lights'); pick('d-rock', '84-Chip Pure White'); pick('d-rock-n', String(n)); pick('parts', 'ITM Supplies Them'); estimate(); }
})();

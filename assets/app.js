/* ITM Customs concept homepage. All products, prices, variant ids and reviews
   come from itmcustoms.com (products.json + Judge.me), pulled 2026-10-05. */
document.documentElement.classList.add('js');
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const IMG = n => `assets/img/${n}.webp`;
const STORE = 'https://itmcustoms.com';
const money = n => '$' + (Number.isInteger(n) ? n : n.toFixed(2));

/* ---------- catalog ---------- */
const P = [
  { h:'84-chip-pure-white-rocklights', cat:'rock', catL:'Rock lights', name:'84-Chip Pure White Rock Lights',
    sub:'Set of 4. Our brightest pure white rock light.', specs:['84 chip','20 W','Set of 4','DIY wiring'],
    imgs:['p-84-chip-pure-white-rocklights-0','p-84-chip-pure-white-rocklights-3'], rating:[5.0,1],
    v:[{t:'Set of 4',id:47278903623933,p:55,ok:true}] },
  { h:'72-chip-pure-white-rock-light', cat:'rock', catL:'Rock lights', name:'72-Chip Pure White Rock Lights',
    sub:'Set of 4, with rubber pads and mounting hardware.', specs:['72 chip','14 W','1.2 A @ 12 V','Set of 4'],
    imgs:['p-72-chip-pure-white-rock-light-0'], rating:[4.62,16],
    v:[{t:'Set of 4',id:46018763391229,p:45,was:50,ok:false}] },
  { h:'16-count', cat:'switch', catL:'Switchbacks', name:'Switchback Rock Light Kit',
    sub:'White and amber, plug and play, with Bluetooth app control.', specs:['White + amber','Wigwag / strobe','15 ft leads','Bluetooth'],
    imgs:['switchback-rock-light-kit-amber-truck','switchback-rock-light-kit-white-truck'],
    v:[{t:'4 lights',id:46543966044413,p:200,ok:false,h:'4-count'},{t:'10 lights',id:46544330555645,p:350,ok:false,h:'8-count'},{t:'16 lights',id:46544008806653,p:500,ok:true,h:'16-count'}], def:2 },
  { h:'4pc-rgbw-rock-light-kit', cat:'rock', catL:'Rock lights', name:'RGBW Rock Light Kit',
    sub:'Four 44-chip RGBW lights, Bluetooth harness and remote.', specs:['44 chip','RGBW','4 pc','Plug and play'],
    imgs:['p-4pc-rgbw-rock-light-kit-1','p-4pc-rgbw-rock-light-kit-2'],
    v:[{t:'4 pc',id:46981680857341,p:200,ok:false}] },
  { h:'10-row-pure-white-wheel-lights', cat:'wheel', catL:'Wheel lights', name:'10-Row Pure White Wheel Lights',
    sub:'17″ rings with 5 rows inside and 5 outside. Module and wireless remote included.', specs:['17″','10 row','Plug and play','Wireless remote'],
    imgs:['p-10-row-pure-white-wheel-lights-1'], rating:[5.0,1],
    v:[{t:'17″ kit',id:47012636819709,p:499,was:650,ok:true}] },
  { h:'5-row-pure-white-wheel-lights', cat:'wheel', catL:'Wheel lights', name:'5-Row Pure White Wheel Lights',
    sub:'17″ rings, plug and play with module and wireless remote.', specs:['17″','5 row','Plug and play'],
    imgs:['p-5-row-pure-white-wheel-lights-3','p-5-row-pure-white-wheel-lights-0'],
    v:[{t:'17″ kit',id:46052165517565,p:380,was:449,ok:false}] },
  { h:'magnetic-mount-for-rocklights', cat:'parts', catL:'Mounts & wiring', name:'Magnetic Rock Light Mount',
    sub:'Skip the drilling. Fits our 72- and 84-chip lights.', specs:['1/8″ aluminum','CNC cut','Made in USA'],
    imgs:['p-magnetic-mount-for-rocklights-3','p-magnetic-mount-for-rocklights-0'],
    v:[{t:'1 mount',id:47351597695229,p:10,ok:false}] },
  { h:'magnetic-t-bracket-mount', cat:'parts', catL:'Mounts & wiring', name:'Magnetic T-Bracket Mount',
    sub:'Mounts lights on vertical surfaces like frame rails and rockers.', specs:['110 lb magnet','Per bracket'],
    imgs:['p-magnetic-t-bracket-mount-2','p-magnetic-t-bracket-mount-0'],
    v:[{t:'1 bracket',id:46055093731581,p:4.99,ok:false}] },
  { h:'3-pin-wire-extension', cat:'parts', catL:'Mounts & wiring', name:'3-Pin Wire Extension',
    sub:'Plug-and-play reach for lights far from the module.', specs:['3 pin','Plug and play'],
    imgs:['p-3-pin-wire-extension-0'],
    v:[{t:'5 ft',id:46544323510525,p:6,ok:true},{t:'10 ft',id:46544315646205,p:7.5,ok:true}] },
  { h:'untitled-jun19_07-48', cat:'parts', catL:'Mounts & wiring', name:'Latching Push-Button Switch',
    sub:'19 mm black stainless switch with a white LED ring.', specs:['19 mm','Latching','LED ring'],
    imgs:['latching-push-button-switch-wiring','latching-push-button-switch-dash'],
    v:[{t:'1 switch',id:46373584568573,p:10,ok:false}] },
  { h:'itm-truck-t-shirt', cat:'merch', catL:'Merch', name:'ITM Truck Tee',
    sub:'Screen-printed 100% cotton. Logo on the pocket, truck on the back.', specs:['100% cotton','Screen print'],
    imgs:['p-itm-truck-t-shirt-0','p-itm-truck-t-shirt-1'],
    v:['S','M','L','XL','2XL'].map((t,i)=>({t,id:[47169431437565,47169431470333,47169431503101,47169431535869,47169431568637][i],p:25,ok:true})), def:2 },
  { h:'6-decal', cat:'merch', catL:'Merch', name:'6″ Chrome Decal',
    sub:'Weatherproof vinyl for the back glass.', specs:['6″','Chrome','Vinyl'],
    imgs:['p-6-decal-0'],
    v:[{t:'Chrome',id:46223875047677,p:5,ok:false}] },
];
const byH = Object.fromEntries(P.map(p => [p.h, p]));

/* ---------- grid ---------- */
const grid = $('#grid');
function card(p) {
  const sel = p.def ?? 0, v = p.v[sel];
  const anyOk = p.v.some(x => x.ok);
  const el = document.createElement('article');
  el.className = 'card rv-in'; el.dataset.cat = p.cat; el.dataset.h = p.h;
  el.innerHTML = `<div class="card-frame"><div class="card-chrome"><div class="card-in">
    <figure class="c-fig">
      <div class="badges"></div>
      ${p.imgs.map((n,i)=>`<img src="${IMG(n)}" alt="${i ? p.name + (p.cat === 'merch' ? ' – second view' : ' installed on a vehicle') : 'ITM Customs ' + p.name + ' – ' + p.catL.toLowerCase()}" loading="lazy">`).join('')}
    </figure>
    <div class="c-body">
      <span class="c-cat">${p.catL}</span>
      <h3 class="c-name">${p.name}</h3>
      <p class="c-sub">${p.sub}</p>
      <ul class="specs">${p.specs.map(s=>`<li>${s}</li>`).join('')}</ul>
      ${p.rating ? `<div class="rating">★ ${p.rating[0].toFixed(p.rating[0]%1?2:1)} <span>(${p.rating[1]} review${p.rating[1]>1?'s':''})</span></div>` : ''}
      ${p.v.length>1 ? `<div class="vars" role="radiogroup" aria-label="Option">${p.v.map((x,i)=>`<button class="var${i===sel?' on':''}${x.ok?'':' so'}" data-i="${i}" role="radio" aria-checked="${i===sel}">${x.t}</button>`).join('')}</div>` : ''}
      <div class="c-foot"><div class="price"></div><span class="act"></span></div>
    </div></div></div></div>`;
  el._sel = sel;
  paint(el, p);
  $$('.var', el).forEach(b => b.onclick = () => { el._sel = +b.dataset.i;
    $$('.var', el).forEach(x => { x.classList.toggle('on', x===b); x.setAttribute('aria-checked', x===b); });
    paint(el, p); });
  return el;
}
function paint(el, p) {
  const v = p.v[el._sel];
  $('.price', el).innerHTML = `<span class="now">${money(v.p)}</span>${v.was?`<span class="was">${money(v.was)}</span>`:''}`;
  const b = [];
  if (v.was && v.ok) b.push('<span class="badge sale">Sale</span>');
  if (!v.ok) b.push('<span class="badge out">Out of stock</span>');
  $('.badges', el).innerHTML = b.join('');
  $('.act', el).innerHTML = v.ok
    ? `<button class="add" data-h="${p.h}" data-i="${el._sel}"><span>Add to cart</span></button>`
    : `<span class="add soldout" aria-disabled="true"><span>Out of stock</span></span>`;
}
P.forEach(p => grid.appendChild(card(p)));

/* filters (chips, lanes, footer + FAQ jump links) */
function filter(cat) {
  $$('.chip').forEach(c => { const on = c.dataset.filter === cat; c.classList.toggle('on', on); c.setAttribute('aria-selected', on); });
  $$('.card', grid).forEach(c => c.classList.toggle('hide', cat !== 'all' && c.dataset.cat !== cat));
  $$('.card:not(.hide)', grid).forEach(c => c.classList.add('in'));
}
$$('.chip').forEach(c => c.onclick = () => filter(c.dataset.filter));
$$('.lane, [data-jump]').forEach(l => l.addEventListener('click', e => {
  e.preventDefault(); filter(l.dataset.filter || l.dataset.jump);
  $('#shop').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion:reduce)').matches ? 'auto' : 'smooth' });
}));

/* ---------- cart (localStorage → Shopify cart permalink) ---------- */
const KEY = 'itm_cart_v1';
let cart = [];
try { cart = JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) {}
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch (e) {} };
function add(h, i, qty = 1) {
  const p = byH[h], v = p.v[i];
  const line = cart.find(l => l.id === v.id);
  line ? line.q += qty : cart.push({ id: v.id, h, i, q: qty });
  save(); renderCart(); bump();
  toast(`${qty > 1 ? qty + ' × ' : ''}${p.name}${p.v.length > 1 ? ' · ' + v.t : ''} added`);
}
function renderCart() {
  const n = cart.reduce((a, l) => a + l.q, 0);
  const cn = $('#cartN'); cn.textContent = n; cn.classList.toggle('has', n > 0);
  const body = $('#drBody');
  if (!cart.length) { body.innerHTML = '<p class="dr-empty">Nothing here yet. Start with a set of rock lights.</p>'; }
  else body.innerHTML = cart.map((l, k) => { const p = byH[l.h], v = p.v[l.i];
    return `<div class="li"><img src="${IMG(p.imgs[0])}" alt="">
      <div><div class="li-n">${p.name}</div><div class="li-v">${v.t}</div>
        <div class="qty"><button data-k="${k}" data-d="-1" aria-label="Less">−</button><span>${l.q}</span><button data-k="${k}" data-d="1" aria-label="More">+</button></div></div>
      <div><div class="li-p">${money(+(v.p * l.q).toFixed(2))}</div><button class="li-rm" data-k="${k}">Remove</button></div></div>`; }).join('');
  const tot = cart.reduce((a, l) => a + byH[l.h].v[l.i].p * l.q, 0);
  $('#drTotal').textContent = '$' + tot.toFixed(2);
  const co = $('#checkout');
  co.href = '#';
  co.toggleAttribute('aria-disabled', !cart.length); co.style.pointerEvents = cart.length ? '' : 'none'; co.style.opacity = cart.length ? '' : '.45';
}
$('#drBody').addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return; const k = +b.dataset.k;
  if (b.dataset.d) { cart[k].q += +b.dataset.d; if (cart[k].q < 1) cart.splice(k, 1); }
  else if (b.classList.contains('li-rm')) cart.splice(k, 1);
  save(); renderCart();
});
document.addEventListener('click', e => {
  const a = e.target.closest('.add[data-h], [data-add]'); if (!a || a.tagName === 'A') return;
  a.dataset.add ? add(a.dataset.add, 0) : add(a.dataset.h, +a.dataset.i);
});
const drawer = $('#drawer'), scrim = $('#scrim');
function openCart(on) {
  drawer.classList.toggle('on', on); drawer.setAttribute('aria-hidden', !on);
  if (on) { scrim.hidden = false; void scrim.offsetWidth; scrim.classList.add('on'); $('#cartClose').focus(); }
  else { scrim.classList.remove('on'); setTimeout(() => scrim.hidden = true, 300); }
}
$('#cartOpen').onclick = () => openCart(true);
$('#cartClose').onclick = scrim.onclick = () => openCart(false);
document.addEventListener('keydown', e => { if (e.key === 'Escape') openCart(false); });
function bump() { const c = $('#cartN'); c.classList.remove('bump'); void c.offsetWidth; c.classList.add('bump'); }
let tt;
function toast(msg) {
  const t = $('#toast'); t.innerHTML = `<span>${msg}</span><button type="button">View cart</button>`;
  $('button', t).onclick = () => { t.classList.remove('on'); openCart(true); };
  t.classList.add('on'); clearTimeout(tt); tt = setTimeout(() => t.classList.remove('on'), 3200);
}
renderCart();

/* ---------- count picker ---------- */
const COUNT = { 8:2, 16:3, 20:4, 24:5, 28:6 };
let curN = 16;
function setCount(n) {
  curN = n; const sets = n / 4;
  $$('#seg button').forEach(b => { const on = +b.dataset.n === n; b.classList.toggle('on', on); b.setAttribute('aria-checked', on); });
  $('#mLights').textContent = n; $('#mSets').textContent = sets; $('#mPrice').textContent = money(sets * 55);
  const vf = $('#vfN'); if (vf) vf.textContent = n;
  $('#countAdd span').textContent = `Add ${sets} sets to cart`;
  const img = $('#countImg'), src = IMG(`p-72-chip-pure-white-rock-light-${COUNT[n]}-crop`);
  if (img.getAttribute('src') !== src) {
    img.classList.add('swap');
    const pre = new Image(); pre.src = src;
    pre.onload = () => { $('.count-frame').style.aspectRatio = pre.naturalWidth + ' / ' + pre.naturalHeight; img.src = src; img.alt = `Pickup lit by ${n} ITM rock lights`; requestAnimationFrame(() => img.classList.remove('swap')); };
  }
}
$$('#seg button').forEach(b => b.onclick = () => setCount(+b.dataset.n));
$('#seg').addEventListener('keydown', e => {
  const ks = Object.keys(COUNT).map(Number), i = ks.indexOf(curN);
  const d = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
  if (d) { e.preventDefault(); const n = ks[(i + d + ks.length) % ks.length]; setCount(n); $(`#seg [data-n="${n}"]`).focus(); }
});
$('#countAdd').onclick = () => add('84-chip-pure-white-rocklights', 0, curN / 4);
$('#countBook').addEventListener('click', () => {
  pick('vehicle', 'Truck'); pick('work', 'Rock lights');
  const n = $('#booker [name=notes]'); if (!n.value) n.value = `${curN} rock lights`;
});

/* ---------- RGBW switcher ---------- */
$$('.swatches button').forEach(b => b.onclick = () => {
  $$('.swatches button').forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-checked', x === b); });
  const img = $('#rgbwImg'); img.style.opacity = 0;
  setTimeout(() => { img.src = IMG(`p-4pc-rgbw-rock-light-kit-${b.dataset.i}`); img.alt = `Side-by-side lit ${b.getAttribute('aria-label').toLowerCase()} by the RGBW rock light kit`; img.onload = () => img.style.opacity = 1; }, 180);
});

/* ---------- booking ---------- */
const form = $('#booker');
$$('.opts', form).forEach(g => g.addEventListener('click', e => {
  const o = e.target.closest('.opt'); if (!o) return;
  if (g.hasAttribute('data-single')) $$('.opt', g).forEach(x => x !== o && x.classList.remove('on'));
  o.classList.toggle('on');
  $$('.opt', g).forEach(x => x.setAttribute('aria-pressed', x.classList.contains('on')));
}));
function pick(name, label) {
  const o = $$(`.opts[data-name="${name}"] .opt`, form).find(x => x.textContent.trim() === label);
  if (o && !o.classList.contains('on')) o.click();
}
const picked = n => $$(`.opts[data-name="${n}"] .opt.on`, form).map(x => x.textContent.trim());
/* drop-off picker: a month calendar (tomorrow to 60 days out) + a window + an exact time.
   HOURS is the shop's drop-off schedule; confirm with ITM. When ITM connects a scheduler
   (Square / Shopify booking), its open slots replace SLOT_OPEN below. */
const HOURS = {
  days: [1, 2, 3, 4, 5, 6],                      // Mon to Sat; Sunday closed
  Morning:   ['9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM'],
  Midday:    ['12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM'],
  Afternoon: ['2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM'],
  ahead: 60,
};
const SLOT_OPEN = d => HOURS.days.includes(d.getDay());
const dayIn = $('[name=day]', form), timeIn = $('[name=time]', form);
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
      const d = new Date(y, m, i, 12), ok = d >= min && d <= max && SLOT_OPEN(d), on = picked && dkey(picked) === dkey(d);
      const why = d < min || d > max ? '' : ok ? '' : ', closed';
      h += `<button type="button" class="sday${on ? ' on' : ''}" role="radio" aria-checked="${!!on}" data-k="${dkey(d)}"${ok ? '' : ' disabled'} aria-label="${d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}${why}">${i}</button>`;
    }
    grid.innerHTML = h;
    $('.cal-nav[data-m="-1"]').disabled = y === min.getFullYear() && m <= min.getMonth();
    $('.cal-nav[data-m="1"]').disabled = y === max.getFullYear() && m >= max.getMonth();
  }
  $$('.cal-nav').forEach(b => b.onclick = () => { view = new Date(view.getFullYear(), view.getMonth() + +b.dataset.m, 1); render(); });
  grid.addEventListener('click', e => {
    const b = e.target.closest('.sday'); if (!b || b.disabled) return;
    const [y, m, d] = b.dataset.k.split('-').map(Number); picked = new Date(y, m, d, 12);
    dayIn.value = fmtDay(picked); render(); slotLabel();
  });
  render();
  return { render };
})();
function choose(group, btn) {
  $$('[role=radio]', group).forEach(x => { const on = x === btn; x.classList.toggle('on', on); x.setAttribute('aria-checked', on); });
}
$('#slotTimes').addEventListener('click', e => { const b = e.target.closest('.slot'); if (!b) return;
  choose($('#slotTimes'), b);
  const hrs = $('#slotHours');
  hrs.innerHTML = HOURS[b.dataset.t].map(t => `<button type="button" class="stime${timeIn.value === t ? ' on' : ''}" role="radio" aria-checked="${timeIn.value === t}" data-t="${t}">${t}</button>`).join('');
  hrs.hidden = false;
  if (!HOURS[b.dataset.t].includes(timeIn.value)) timeIn.value = '';
  slotLabel(); });
$('#slotHours').addEventListener('click', e => { const b = e.target.closest('.stime'); if (!b) return;
  choose($('#slotHours'), b); timeIn.value = b.dataset.t; slotLabel(); });
function slotLabel() {
  const d = dayIn.value, t = timeIn.value;
  $('#bookBtnT').textContent = d && t ? `Book ${d}, ${t}` : d ? `Book ${d}` : 'Book my install';
  $$('#slotDays, #slotTimes, #slotHours').forEach(g => $('.on', g) && g.classList.remove('bad'));
}
/* live parts estimate from the catalog prices above; labor is quoted by ITM */
const FROM = { 'Rock lights': ['rock lights', 55], 'Wheel lights': ['wheel lights', 380], 'Switchback / amber': ['switchback kit', 200], 'RGBW color kit': ['RGBW kit', 200], 'Push-button switch': ['switch', 10] };
function estimate() {
  const w = picked('work'), supply = picked('parts')[0] === 'Supply them for me';
  const parts = w.filter(x => FROM[x]);
  const el = $('#est');
  if (!w.length) { el.innerHTML = ''; return; }
  const bits = supply && parts.length ? 'Parts: ' + parts.map(x => `${FROM[x][0]} from <b>${money(FROM[x][1])}</b>`).join(' · ') + '. ' : '';
  el.innerHTML = `${bits}Install labor is <b>quoted before we start</b>.`;
}
form.addEventListener('click', e => { if (e.target.closest('.opts')) setTimeout(estimate); });
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
  const body = [
    `Vehicle: ${picked('vehicle')[0] || '-'}${f.ymm ? ' / ' + f.ymm : ''}`,
    `Work: ${picked('work').join(', ')}`,
    `Lights: ${picked('parts')[0] || '-'}`,
    `Drop-off: ${f.day || 'Any day'} · ${f.time || 'Any time'}`,
    `Name: ${f.name}`, `Contact: ${f.contact}`, f.notes ? `Notes: ${f.notes}` : ''
  ].filter(Boolean).join('\n');
  void body;
  msg.className = 'fine ok'; msg.textContent = 'Preview only. On the live site this request lands on ITM\'s schedule.';
});

/* ---------- reviews belt (verbatim from Judge.me, light typo fixes only) ---------- */
const R = [
  ['Bray','72-Chip Rock Lights','p-72-chip-pure-white-rock-light-6-crop','Probably the brightest rock lights I’ve seen. I’ve been using them on my projects since August 2025. They’ve always worked and never quit. Recommend this brand!'],
  ['cds performance','Installer · 72-Chip','p-72-chip-pure-white-rock-light-1','Man, I’m blown away by how bright they are. 16 pieces was perfect for the truck. I do lighting and sound systems for a living. Best rock light I’ve had someone bring me to install!'],
  ['Erick Mendoza','10-Row Wheel Lights','p-10-row-pure-white-wheel-lights-0','I own the truck in the picture. These 10-row rim lights have been nothing but sick. No problems, bright, turning heads everywhere I go.'],
  ['Ricky Frazier','ITM customer','itm-customs-chrome-decals','I’ve had 3 other sets of lights and these are hands down BRIGHT and the best. Build quality is great, customer service is awesome and pricing is amazing.'],
  ['Chino','Install · 5-Row Wheel Lights','p-5-row-pure-white-wheel-lights-1','I needed some lights installed. I came to ITM and they got it done fast and right. Great customer service and great work. 10/10.'],
  ['Troy Gross','72-Chip Rock Lights','p-72-chip-pure-white-rock-light-5-crop','Insanely bright for the price. I would highly recommend these lights.'],
  ['j.','Magnetic T-Bracket','p-magnetic-t-bracket-mount-3','It gives the rock lights a cleaner, more proper look. Get these!'],
  ['Connor','72-Chip Rock Lights','p-72-chip-pure-white-rock-light-2-crop','It’s super bright and surprised me so much. Worth the wait. You’ve got to be patient for it to come in!'],
  ['Jaime','Magnetic T-Bracket','p-magnetic-t-bracket-mount-4','The magnet is very strong. Highly recommend!'],
];
const run = $('#beltRun');
const rv = r => `<article class="rv"><div class="rv-img"><img src="${IMG(r[2])}" alt="${r[1]} reviewed by ${r[0]}" loading="lazy"></div><div class="rv-b">
  <span class="rv-stars" aria-label="5 stars">★★★★★</span><p>${r[3]}</p>
  <div class="rv-who"><b>${r[0]}</b><span>${r[1]}</span></div></div></article>`;
run.innerHTML = R.map(rv).join('') + R.map(rv).join('').replace(/<article class="rv"/g, '<article class="rv" aria-hidden="true"');

/* ---------- nav + reveals ---------- */
const nav = $('#nav');
const onScroll = () => nav.classList.toggle('scrolled', scrollY > 30);
addEventListener('scroll', onScroll, { passive: true }); onScroll();
$$('.sec-head, .rev-head, .count-copy, .count-art, .feat, .booker, .book-side, .mosaic figure, .faq-grid > div, .lane').forEach(el => el.classList.add('rv-in'));
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
  $$('.rv-in').forEach(el => io.observe(el));
} else $$('.rv-in').forEach(el => el.classList.add('in'));
window.ITMreveal = () => $$('.rv-in').forEach(el => el.classList.add('in'));


/* ---------- the F-250's lights, in the order they switch on (photo coords, 1672x941) ---------- */
(function () {
  const stage = document.getElementById('hbStage'); if (!stage) return;
  const W = 1672, H = 941, A = '#FFB23F', Wt = '#F4F7FF', R = '#FF3B30';
  // [x, y, rx, ry, color, delay ms]
  const L = [
    [1100,456,10,9,A,0],[1126,451,10,9,A,110],[1146,448,10,9,A,220],[1166,446,10,9,A,330],[1223,445,12,10,A,440],   // cab roof markers
    [1276,525,22,10,A,640],                                                                                        // mirror marker
    [834,572,10,8,A,820],[852,572,10,8,A,900],[866,572,10,8,A,980],[886,572,10,8,A,1060],                           // grille amber
    [811,575,14,14,Wt,1250],[970,570,42,14,Wt,1250],[982,607,26,12,A,1320],[978,628,30,16,Wt,1320],[811,630,12,14,Wt,1250], // headlights + turn
    [967,667,28,12,Wt,1480],                                                                                        // fog
    [1112,615,95,85,Wt,1660],                                                                                       // front wheel well rock light
    [1237,684,22,12,Wt,1860],[1262,681,22,12,Wt,1930],[1287,678,22,12,Wt,2000],[1312,676,22,12,Wt,2070],[1337,673,22,12,Wt,2140],[1362,670,22,12,Wt,2210], // rocker rock lights
    [1500,600,70,75,Wt,2300],                                                                                       // rear wheel well
    [1555,570,10,14,R,2380],[1554,605,10,16,R,2380]                                                                 // tail lights
  ];
  const pct = (v, t) => (v / t * 100).toFixed(2) + '%';
  stage.insertAdjacentHTML('beforeend', L.map(([x,y,rx,ry,c,d]) =>
    `<i class="lt${rx > 40 ? ' big' : ''}" style="--x:${pct(x,W)};--y:${pct(y,H)};--w:${pct(rx*(rx > 40 ? 3.6 : 3.1),W)};--h:${pct(ry*(rx > 40 ? 3.6 : 3.1),H)};--c:${c};--d:${d}ms"></i>`).join(''));
})();

/* ---------- intro + hero light-up ---------- */
(function () {
  const hero = $('.hero'), intro = $('#intro');
  const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
  const lightUp = d => setTimeout(() => hero.classList.add('lit'), d);
  const seen = document.documentElement.classList.contains('intro-seen');
  if (!intro || seen || reduce) { intro && intro.remove(); lightUp(350); return; }
  let done = false;
  const end = () => {
    if (done) return; done = true;
    
    intro.classList.add('out'); lightUp(420);
    setTimeout(() => intro.remove(), 900);
  };
  setTimeout(end, 2500);
  intro.addEventListener('click', end);
  addEventListener('keydown', end, { once: true });
})();

/* count photo: frame takes the photo's true shape on first load too */
(function () { const i = document.getElementById('countImg'), f = document.querySelector('.count-frame'); if (!i || !f) return;
  const fit = () => i.naturalWidth && (f.style.aspectRatio = i.naturalWidth + ' / ' + i.naturalHeight);
  i.complete ? fit() : i.addEventListener('load', fit, { once: true }); })();

/* white buttons flip to switchback amber when pressed, then fade back */
document.addEventListener('click', e => {
  const b = e.target.closest('.btn-primary, .add:not(.soldout)'); if (!b) return;
  b.classList.remove('flash'); void b.offsetWidth; b.classList.add('flash');
  clearTimeout(b._ft); b._ft = setTimeout(() => b.classList.remove('flash'), 900);
});

/* ---------- Shop dropdown: every category, with a photo and a live count ---------- */
(function () {
  const btn = $('#shopToggle'), menu = $('#shopMenu'), grid = $('#smGrid'); if (!btn) return;
  const CATS = [
    ['all', 'All lights', 'p-84-chip-pure-white-rocklights-0', 'Every product'],
    ['rock', 'Rock lights', 'p-72-chip-pure-white-rock-light-0', 'White + RGBW sets'],
    ['switch', 'Switchbacks', 'switchback-rock-light-kit-amber-truck', 'White / amber kits'],
    ['wheel', 'Wheel lights', 'p-5-row-pure-white-wheel-lights-1', '17″ 5 and 10 row'],
    ['parts', 'Mounts & wiring', 'p-magnetic-mount-for-rocklights-0', 'Mounts, switches, leads'],
    ['merch', 'Merch', 'p-itm-truck-t-shirt-0', 'Tees + decals'],
  ];
  const count = c => c === 'all' ? P.length : P.filter(p => p.cat === c).length;
  grid.innerHTML = CATS.map(([c, n, img, d]) =>
    `<button class="sm-item" data-cat="${c}"><span class="sm-fig"><img src="${IMG(img)}" alt="${n} from ITM Customs" loading="lazy"></span>
      <span class="sm-txt"><b>${n}</b><i>${d}</i></span></button>`).join('');
  const set = on => { menu.hidden = !on; btn.setAttribute('aria-expanded', on); btn.classList.toggle('on', on); };
  btn.addEventListener('click', e => { e.stopPropagation(); set(menu.hidden); });
  grid.addEventListener('click', e => {
    const it = e.target.closest('.sm-item'); if (!it) return;
    set(false); filter(it.dataset.cat);
    $('#shop').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion:reduce)').matches ? 'auto' : 'smooth' });
  });
  document.addEventListener('click', e => { if (!menu.hidden && !e.target.closest('#shopMenu, #shopToggle')) set(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') set(false); });
  $$('.sm-links a').forEach(l => l.addEventListener('click', () => set(false)));
})();

/* nav Book install waits until the hero has scrolled away */
(function () {
  const nav = $('#nav'), hero = $('.hero'); if (!nav || !hero) return;
  const tick = () => nav.classList.toggle('past-hero', hero.getBoundingClientRect().bottom <= nav.offsetHeight + 4);
  addEventListener('scroll', tick, { passive: true }); addEventListener('resize', tick); tick();
})();

/* add-to-cart buttons stay switchback amber while that item is in the cart */
function syncAdded() {
  const ids = new Set(cart.map(l => l.id));
  $$('.add[data-h]').forEach(b => {
    const v = byH[b.dataset.h].v[+b.dataset.i], on = ids.has(v.id);
    b.classList.toggle('in-cart', on); b.querySelector('span').textContent = on ? 'Added ✓' : 'Add to cart';
  });
  $$('[data-add]').forEach(b => {
    const on = ids.has(byH[b.dataset.add].v[0].id);
    b.classList.toggle('in-cart', on); b.querySelector('span').textContent = on ? 'Added ✓' : 'Add to cart';
  });
  const ca = $('#countAdd'); if (ca) ca.classList.toggle('in-cart', ids.has(byH['84-chip-pure-white-rocklights'].v[0].id));
}
(function () {
  const _render = renderCart;
  renderCart = function () { _render(); syncAdded(); };
  const _paint = paint;
  paint = function (el, p) { _paint(el, p); syncAdded(); };
  syncAdded();
})();

/* ---------- measurement: GA4-ready events (window.dataLayer) for bookings, cart, navigation, engagement ---------- */
(function () {
  window.dataLayer = window.dataLayer || [];
  const track = (event, params = {}) => window.dataLayer.push({ event, ...params });
  window.ITMtrack = track;
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href="#book"], .btn-chrome'); if (a) track('book_cta_click', { location: a.closest('.mbar') ? 'mobile_bar' : a.closest('header') ? 'nav' : a.closest('footer') ? 'footer' : (a.closest('section')?.id || 'page'), label: a.textContent.trim() });
    const add = e.target.closest('.add[data-h], [data-add], #countAdd'); if (add) track('add_to_cart', { item: add.dataset.h || add.dataset.add || '84-chip-pure-white-rocklights' });
    if (e.target.closest('#checkout')) track('begin_checkout');
    if (e.target.closest('#shopToggle')) track('menu_open');
    const cat = e.target.closest('.sm-item, .lane, .chip'); if (cat) track('category_select', { category: cat.dataset.cat || cat.dataset.filter });
    if (e.target.closest('#seg button')) track('light_count_select', { count: e.target.closest('#seg button').dataset.n });
    if (e.target.closest('.acc summary')) track('faq_open', { q: e.target.closest('summary').textContent.trim() });
  });
  document.getElementById('booker')?.addEventListener('submit', () => setTimeout(() => {
    const m = document.getElementById('bookMsg');
    m && m.classList.contains('ok') ? track('booking_submit', { day: document.querySelector('#booker [name=day]').value, time: document.querySelector('#booker [name=time]').value }) : track('booking_error', { reason: m ? m.textContent : '' });
  }));
  // scroll depth + time on page
  const marks = new Set();
  addEventListener('scroll', () => {
    const d = Math.round((scrollY + innerHeight) / document.documentElement.scrollHeight * 100);
    [25, 50, 75, 100].forEach(m => { if (d >= m && !marks.has(m)) { marks.add(m); track('scroll_depth', { percent: m }); } });
  }, { passive: true });
  [30, 60, 120, 300].forEach(sec => setTimeout(() => !document.hidden && track('engaged_time', { seconds: sec }), sec * 1000));
})();

/* ---------- mobile action bar: after the hero, hidden while the booking form or footer is on screen ---------- */
(function () {
  const bar = document.getElementById('mbar'), hero = document.querySelector('.hero'); if (!bar || !hero) return;
  const hideAt = [document.getElementById('book'), document.querySelector('.foot')].filter(Boolean);
  const vis = new Set();
  const io = new IntersectionObserver(es => { es.forEach(e => e.isIntersecting ? vis.add(e.target) : vis.delete(e.target)); tick(); }, { threshold: 0.12 });
  hideAt.forEach(x => io.observe(x));
  function tick() {
    const past = hero.getBoundingClientRect().bottom < innerHeight * 0.35;
    const open = $('#drawer')?.classList.contains('on') || $('#shopToggle')?.getAttribute('aria-expanded') === 'true';
    bar.classList.toggle('show', past && !vis.size && !open);
  }
  addEventListener('scroll', tick, { passive: true }); addEventListener('resize', tick); tick();
  document.addEventListener('click', e => {
    if (e.target.closest('.mbar-msg')) window.ITMtrack && ITMtrack('message_click', { location: 'mobile_bar' });
    if (e.target.closest('.sday, .stime')) window.ITMtrack && ITMtrack('slot_select', { day: dayIn.value, time: timeIn.value });
    setTimeout(tick, 50);
  });
})();

/* preview build: every outbound action is switched off */
document.addEventListener('click', e => {
  const a = e.target.closest('a[data-preview-off], #checkout'); if (!a) return;
  e.preventDefault(); toast('Preview only. Links and checkout are off in this concept.');
}, true);

/* ITM Customs concept homepage. All products, prices, variant ids and reviews
   come from itmcustoms.com (products.json + Judge.me), pulled 2026-10-05. */
document.documentElement.classList.add('js');
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const IMG = n => `assets/img/${n}.webp`;
const STORE = 'https://itmcustoms.com';
const money = n => '$' + n.toLocaleString('en-US', { minimumFractionDigits: Number.isInteger(n) ? 0 : 2, maximumFractionDigits: 2 });
/* the install booking lives on its own page (book/); homepage buttons carry their picks there as URL params */
const ON_BOOK = !!document.getElementById('booker');
const goBook = (p = {}) => { const u = new URL('book/', document.baseURI);
  Object.entries(p).forEach(([k, v]) => [].concat(v).forEach(x => u.searchParams.append(k, x)));
  if (Object.keys(p).length) u.searchParams.set('book', '1'); location.href = u.href; };

/* ---------- catalog ---------- */
const P = [
  { h:'84-chip-pure-white-rocklights', cat:'rock', catL:'Rock Lights', name:'84-Chip Pure White Rock Lights',
    sub:'Set of 4. Our brightest pure white rock light.', specs:['84 Chip','20 W','Set Of 4','DIY Wiring'],
    imgs:['p-84-chip-pure-white-rocklights-0','p-84-chip-pure-white-rocklights-3'], rating:[5.0,1],
    v:[{t:'Set Of 4',id:47278903623933,p:55,ok:true}] },
  { h:'72-chip-pure-white-rock-light', cat:'rock', catL:'Rock Lights', name:'72-Chip Pure White Rock Lights',
    sub:'Set of 4, with rubber pads and mounting hardware.', specs:['72 Chip','14 W','1.2 A @ 12 V','Set Of 4'],
    imgs:['p-72-chip-pure-white-rock-light-0'], rating:[4.62,16],
    v:[{t:'Set Of 4',id:46018763391229,p:45,was:50,ok:false}] },
  { h:'16-count', cat:'switch', catL:'Switchbacks', name:'Switchback Rock Light Kit',
    sub:'White and amber, plug and play, with Bluetooth app control.', specs:['White + Amber','Wigwag / Strobe','15 ft Leads','Bluetooth'],
    imgs:['switchback-rock-light-kit-amber-truck','switchback-rock-light-kit-white-truck'],
    v:[{t:'4 Lights',id:46543966044413,p:200,ok:false,h:'4-count'},{t:'10 lights',id:46544330555645,p:350,ok:false,h:'8-count'},{t:'16 lights',id:46544008806653,p:500,ok:true,h:'16-count'}], def:2 },
  { h:'4pc-rgbw-rock-light-kit', cat:'rock', catL:'Rock Lights', name:'RGBW Rock Light Kit',
    sub:'Four 44-chip RGBW lights, Bluetooth harness and remote.', specs:['44 Chip','RGBW','4 pc','Plug And Play'],
    imgs:['p-4pc-rgbw-rock-light-kit-1','p-4pc-rgbw-rock-light-kit-2'],
    v:[{t:'4 pc',id:46981680857341,p:200,ok:false}] },
  { h:'10-row-pure-white-wheel-lights', cat:'wheel', catL:'Wheel Lights', name:'10-Row Pure White Wheel Lights',
    sub:'17″ rings with 5 rows inside and 5 outside. Module and wireless remote included.', specs:['17″','10 Row','Plug And Play','Wireless Remote'],
    imgs:['p-10-row-pure-white-wheel-lights-0','p-10-row-pure-white-wheel-lights-2'], rating:[5.0,1],
    v:[{t:'17″ kit',id:47012636819709,p:499,was:650,ok:true}] },
  { h:'5-row-pure-white-wheel-lights', cat:'wheel', catL:'Wheel Lights', name:'5-Row Pure White Wheel Lights',
    sub:'17″ rings, plug and play with module and wireless remote.', specs:['17″','5 Row','Plug And Play'],
    imgs:['p-5-row-pure-white-wheel-lights-3','p-5-row-pure-white-wheel-lights-0'],
    v:[{t:'17″ kit',id:46052165517565,p:380,was:449,ok:false}] },
  { h:'magnetic-mount-for-rocklights', cat:'parts', catL:'Mounts & Wiring', name:'Magnetic Rock Light Mount',
    sub:'Skip the drilling. Fits our 72- and 84-chip lights.', specs:['1/8″ Aluminum','CNC Cut','Made In USA'],
    imgs:['p-magnetic-mount-for-rocklights-3','p-magnetic-mount-for-rocklights-0'],
    v:[{t:'1 mount',id:47351597695229,p:10,ok:false}] },
  { h:'magnetic-t-bracket-mount', cat:'parts', catL:'Mounts & Wiring', name:'Magnetic T-Bracket Mount',
    sub:'Mounts lights on vertical surfaces like frame rails and rockers.', specs:['110 lb Magnet','Per Bracket'],
    imgs:['p-magnetic-t-bracket-mount-2','p-magnetic-t-bracket-mount-0'],
    v:[{t:'1 bracket',id:46055093731581,p:4.99,ok:false}] },
  { h:'3-pin-wire-extension', cat:'parts', catL:'Mounts & Wiring', name:'3-Pin Wire Extension',
    sub:'Plug-and-play reach for lights far from the module.', specs:['3 Pin','Plug And Play'],
    imgs:['p-3-pin-wire-extension-0'],
    v:[{t:'5 ft',id:46544323510525,p:6,ok:true},{t:'10 ft',id:46544315646205,p:7.5,ok:true}] },
  { h:'untitled-jun19_07-48', cat:'parts', catL:'Mounts & Wiring', name:'Latching Push-Button Switch',
    sub:'19 mm black stainless switch with a white LED ring.', specs:['19 mm','Latching','LED Ring'],
    imgs:['latching-push-button-switch-wiring','latching-push-button-switch-dash'],
    v:[{t:'1 switch',id:46373584568573,p:10,ok:false}] },
  { h:'itm-truck-t-shirt', cat:'merch', catL:'Merch', name:'ITM Truck Tee',
    sub:'Screen-printed 100% cotton. Logo on the pocket, truck on the back.', specs:['100% Cotton','Screen Print'],
    imgs:['p-itm-truck-t-shirt-0','p-itm-truck-t-shirt-1'],
    v:['S','M','L','XL','2XL'].map((t,i)=>({t,id:[47169431437565,47169431470333,47169431503101,47169431535869,47169431568637][i],p:25,ok:true})), def:2 },
  { h:'6-decal', cat:'merch', catL:'Merch', name:'6″ Chrome Decal',
    sub:'Weatherproof vinyl for the back glass.', specs:['6″','Chrome','Vinyl'],
    imgs:['p-6-decal-0'],
    v:[{t:'Chrome',id:46223875047677,p:5,ok:false}] },
];
const byH = Object.fromEntries(P.map(p => [p.h, p]));
/* option labels in title case everywhere they show (cards, cart, toasts): "16 Lights", "17″ Kit"; units and small words stay lowercase */
const TC = t => t.replace(/[A-Za-z]+/g, (w, i) => (i && /^(ft|w|mm|pc)$/i.test(w)) ? w.toLowerCase() : /^[a-z]/.test(w) ? w[0].toUpperCase() + w.slice(1) : w);
P.forEach(p => p.v.forEach(v => { v.t = TC(v.t); }));
/* install-first: how each kit goes on (from the product specs and FAQ) and which booking job it maps to */
const INST = {
  '84-chip-pure-white-rocklights': ['DIY Wiring', 'Rock Lights'],
  '72-chip-pure-white-rock-light': ['DIY Wiring', 'Rock Lights'],
  '16-count': ['Plug And Play', 'Switchback / Amber'],
  '4pc-rgbw-rock-light-kit': ['Plug And Play', 'RGBW Color Kit'],
  '10-row-pure-white-wheel-lights': ['Plug And Play', 'Wheel Lights'],
  '5-row-pure-white-wheel-lights': ['Plug And Play', 'Wheel Lights'],
  'magnetic-mount-for-rocklights': ['No Drilling', 'Rock Lights'],
  'magnetic-t-bracket-mount': ['No Drilling', 'Rock Lights'],
  'untitled-jun19_07-48': ['Switch Wiring', 'Push-Button Switch'],
};

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
      ${INST[p.h] ? `<div class="c-inst"><span class="inst-tag">${INST[p.h][0]}</span><a href="book/" class="inst-book" data-inst="${p.h}">We Install It <i aria-hidden="true">&rarr;</i></a></div>` : ''}
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
  if (!v.ok) b.push('<span class="badge out">Out Of Stock</span>');
  $('.badges', el).innerHTML = b.join('');
  $('.act', el).innerHTML = v.ok
    ? `<button class="add" data-h="${p.h}" data-i="${el._sel}"><span>Add To Cart</span></button>`
    : `<span class="add soldout" aria-disabled="true"><span>Out Of Stock</span></span>`;
}
if (grid) P.forEach(p => grid.appendChild(card(p)));
/* phones: the shop shows three short cards and a See More button, so nobody scrolls through the whole lineup to reach the rest of the page */
const SHOP_PHONE = matchMedia('(max-width:560px)');
let shopOpen = false;
function clipShop() {
  if (!grid) return;
  const vis = $$('.card:not(.hide)', grid), more = $('#seeMore'), n = vis.length - 3;
  vis.forEach((c, i) => c.classList.toggle('clip', SHOP_PHONE.matches && !shopOpen && i >= 3));
  $$('.card.hide', grid).forEach(c => c.classList.remove('clip'));
  if (!more) return;
  more.hidden = !SHOP_PHONE.matches || n <= 0;
  $('b', more).textContent = shopOpen ? 'Show Less' : 'See More';
  $('span', more).textContent = shopOpen ? '' : `${n} more`;
  more.setAttribute('aria-expanded', shopOpen);
}
$('#seeMore')?.addEventListener('click', () => {
  shopOpen = !shopOpen; clipShop();
  if (!shopOpen) $('#shop').scrollIntoView({ block: 'start' });
  window.ITMtrack && ITMtrack('shop_see_more', { open: shopOpen });
});
SHOP_PHONE.addEventListener('change', clipShop);
clipShop();

/* filters (chips, lanes, footer + FAQ jump links) */
function filter(cat) {
  $$('.chip').forEach(c => { const on = c.dataset.filter === cat; c.classList.toggle('on', on); c.setAttribute('aria-selected', on); });
  $$('.card', grid).forEach(c => c.classList.toggle('hide', cat !== 'all' && c.dataset.cat !== cat));
  $$('.card:not(.hide)', grid).forEach(c => c.classList.add('in'));
  shopOpen = false; clipShop();
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
  toast(`${qty > 1 ? qty + ' × ' : ''}${p.name}${p.v.length > 1 ? ' · ' + v.t : ''} Added`);
}
function renderCart() {
  const n = cart.reduce((a, l) => a + l.q, 0);
  const cn = $('#cartN'); cn.textContent = n; cn.classList.toggle('has', n > 0);
  const body = $('#drBody');
  if (!cart.length) { body.innerHTML = '<p class="dr-empty">Nothing here yet. Start with a set of Rock Lights.</p>'; }
  else body.innerHTML = cart.map((l, k) => { const p = byH[l.h], v = p.v[l.i];
    return `<div class="li"><img src="${IMG(p.imgs[0])}" alt="">
      <div><div class="li-n">${p.name}</div><div class="li-v">${v.t}</div>
        <div class="qty"><button data-k="${k}" data-d="-1" aria-label="Less">−</button><span>${l.q}</span><button data-k="${k}" data-d="1" aria-label="More">+</button></div></div>
      <div><div class="li-p">${money(+(v.p * l.q).toFixed(2))}</div><button class="li-rm" data-k="${k}">Remove</button></div></div>`; }).join('');
  const tot = cart.reduce((a, l) => a + byH[l.h].v[l.i].p * l.q, 0);
  $('#drTotal').textContent = '$' + tot.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
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
  if (on) { $('#toast').classList.remove('on'); scrim.hidden = false; void scrim.offsetWidth; scrim.classList.add('on'); $('#cartClose').focus(); }
  else { scrim.classList.remove('on'); setTimeout(() => scrim.hidden = true, 300); }
}
$('#cartOpen').onclick = () => openCart(true);
$('#cartClose').onclick = scrim.onclick = () => openCart(false);
document.addEventListener('keydown', e => { if (e.key === 'Escape') openCart(false); });
function bump() { const c = $('#cartN'); c.classList.remove('bump'); void c.offsetWidth; c.classList.add('bump'); }
let tt;
function toast(msg) {
  if ($('#drawer')?.classList.contains('on')) return;
  const t = $('#toast'); t.innerHTML = `<span>${msg}</span><button type="button">View Cart</button>`;
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
$('#seg')?.addEventListener('keydown', e => {
  const ks = Object.keys(COUNT).map(Number), i = ks.indexOf(curN);
  const d = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
  if (d) { e.preventDefault(); const n = ks[(i + d + ks.length) % ks.length]; setCount(n); $(`#seg [data-n="${n}"]`).focus(); }
});
if ($('#countAdd')) $('#countAdd').onclick = () => add('84-chip-pure-white-rocklights', 0, curN / 4);
$('#countBook')?.addEventListener('click', e => { e.preventDefault(); goBook({ count: curN }); });

/* ---------- RGBW switcher ---------- */
$$('.swatches button').forEach(b => b.onclick = () => {
  $$('.swatches button').forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-checked', x === b); });
  const img = $('#rgbwImg'); img.style.opacity = 0;
  setTimeout(() => { img.src = IMG(`p-4pc-rgbw-rock-light-kit-${b.dataset.i}`); img.alt = `Side-by-side lit ${b.getAttribute('aria-label').toLowerCase()} by the RGBW rock light kit`; img.onload = () => img.style.opacity = 1; }, 180);
});

/* ---------- reviews belt (verbatim from Judge.me, light typo fixes only) ---------- */
const R = [
  ['Bray','72-Chip Rock Lights','build-bray-mower-rock-lights','Probably the brightest rock lights I’ve seen. I’ve been using them on my projects since August 2025. They’ve always worked and never quit. Recommend this brand!','bray-sierra-1500-and-mower'],
  ['Paul Pena','Install · Rock + Pillar Lights','build-paul-pena-rock-pillar-lights','I’ve had rock lights and pillar lights installed on two separate occasions, and both times have been quality, clean and fast work. They definitely take pride in their work.','paul-pena-rock-and-pillar-lights'],
  ['cds performance','Installer · 72-Chip','build-cds-silverado-rock-lights','Man, I’m blown away by how bright they are. 16 pieces was perfect for the truck. I do lighting and sound systems for a living. Best rock light I’ve had someone bring me to install!','cds-performance-16-rock-lights'],
  ['Erick Mendoza','10-Row Wheel Lights','build-erick-ram-10-row-wheel-lights','I own the truck in the picture. These 10-row rim lights have been nothing but sick. No problems, bright, turning heads everywhere I go.','erick-10-row-wheel-lights'],
  ['Chino','Install · 5-Row Wheel Lights','build-chino-wheel-lights-install','I needed some lights installed. I came to ITM and they got it done fast and right. Great customer service and great work. 10/10.','chino-5-row-wheel-lights'],
  ['Ricky Frazier','ITM Customer','build-ricky-wheel-well-rock-lights','I’ve had 3 other sets of lights and these are hands down BRIGHT and the best. Build quality is great, customer service is awesome and pricing is amazing.','ricky-rock-lights'],
  ['Ethan Robbins','72-Chip Rock Lights','build-ethan-rock-lights-two-trucks','Quality of the light is very good and super bright.','ethan-rock-lights'],
  ['Troy Gross','72-Chip Rock Lights','p-72-chip-pure-white-rock-light-5-crop','Insanely bright for the price. I would highly recommend these lights.'],
  ['j.','Magnetic T-Bracket','p-magnetic-t-bracket-mount-3','It gives the rock lights a cleaner, more proper look. Get these!'],
  ['Connor','72-Chip Rock Lights','p-72-chip-pure-white-rock-light-2-crop','It’s super bright and surprised me so much. Worth the wait. You’ve got to be patient for it to come in!'],
];
const run = $('#beltRun') || document.createElement('div');
const rv = r => `<article class="rv"><div class="rv-img"><img src="${IMG(r[2])}" alt="${r[4] ? 'Photo from ' + r[0] + '’s review: ' + r[1] : r[1] + ' product photo'}" loading="lazy">${r[4] ? '' : '<span class="rv-tag">Product Photo</span>'}</div><div class="rv-b">
  <span class="rv-stars" aria-label="5 stars">★★★★★</span><p>${r[3]}</p>
  <div class="rv-who"><b>${r[0]}</b><span>${r[1]}</span></div>${r[4] ? `<a class="rv-build" href="builds/${r[4]}/">See The Build <i aria-hidden="true">&rarr;</i></a>` : ''}</div></article>`;
run.innerHTML = R.map(rv).join('') + R.map(rv).join('').replace(/<article class="rv"/g, '<article class="rv" aria-hidden="true"');
/* phones: three reviews, then See More (the belt becomes a stacked list there) */
(function () {
  const btn = document.getElementById('revMore'); if (!btn) return;
  let open = false;
  const live = () => $$('.rv:not([aria-hidden="true"])', run);
  function clip() {
    const all = live(), n = all.length - 3;
    all.forEach((r, i) => r.classList.toggle('clip', SHOP_PHONE.matches && !open && i >= 3));
    btn.hidden = !SHOP_PHONE.matches || n <= 0;
    $('b', btn).textContent = open ? 'Show Less' : 'See More Reviews';
    $('span', btn).textContent = open ? '' : `${n} more`;
    btn.setAttribute('aria-expanded', open);
  }
  btn.addEventListener('click', () => { open = !open; clip(); if (!open) $('#reviews').scrollIntoView({ block: 'start' }); });
  SHOP_PHONE.addEventListener('change', clip); clip();
})();

/* ---------- nav + reveals ---------- */
const nav = $('#nav');
const onScroll = () => nav.classList.toggle('scrolled', scrollY > 30 || !document.querySelector('.hero'));  // pages without the hero keep the solid nav
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
  const pct = (v, t) => (v / t * 100).toFixed(3) + '%';
  /* each light is a small feathered window onto the lit photo itself, so the real lamp detail switches on
     (crisp LED pods, sharp markers), plus a short bloom that fades once the whole frame is lit */
  const lit = stage.querySelector('.hb-on');
  const src = () => `url("${lit.currentSrc || lit.src}")`;
  stage.insertAdjacentHTML('beforeend', L.map(([x,y,rx,ry,c,d]) => {
    const big = rx > 40, k = big ? 2.3 : 2.6, ew = rx * k, eh = ry * k;
    return `<i class="lt${big ? ' big' : ''}" style="--x:${pct(x,W)};--y:${pct(y,H)};--w:${pct(ew,W)};--h:${pct(eh,H)};--c:${c};--d:${d}ms;` +
      `--bs:${(W / ew * 100).toFixed(2)}% ${(H / eh * 100).toFixed(2)}%;--bp:${((x - ew / 2) / (W - ew) * 100).toFixed(3)}% ${((y - eh / 2) / (H - eh) * 100).toFixed(3)}%"></i>`;
  }).join(''));
  stage.insertAdjacentHTML('beforeend', '<div class="hb-bloom" aria-hidden="true">' + L.filter(l => l[2] <= 40).map(([x,y,rx,ry,c,d]) =>
    `<i style="--x:${pct(x,W)};--y:${pct(y,H)};--w:${pct(rx*2.2,W)};--h:${pct(ry*2.2,H)};--c:${c};--d:${d}ms"></i>`).join('') + '</div>');
  const setSrc = () => stage.style.setProperty('--lit', src());
  lit.complete ? setSrc() : lit.addEventListener('load', setSrc, { once: true });
})();

/* ---------- intro + hero light-up ---------- */
(function () {
  const hero = $('.hero'), intro = $('#intro');
  const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
  const lightUp = d => hero && setTimeout(() => hero.classList.add('lit'), d);
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
    ['all', 'All Lights', 'p-84-chip-pure-white-rocklights-0', 'Every Product'],
    ['rock', 'Rock Lights', 'p-72-chip-pure-white-rock-light-0', 'White + RGBW Sets'],
    ['switch', 'Switchbacks', 'switchback-rock-light-kit-amber-truck', 'White / Amber Kits'],
    ['wheel', 'Wheel Lights', 'ram-1500-white-wheel-lights-night', '17″ 5 And 10 Row'],
    ['parts', 'Mounts & Wiring', 'p-magnetic-mount-for-rocklights-0', 'Mounts, Switches, Leads'],
    ['merch', 'Merch', 'p-itm-truck-t-shirt-0', 'Tees + Decals'],
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
    b.classList.toggle('in-cart', on); b.querySelector('span').textContent = on ? 'Added ✓' : 'Add To Cart';
  });
  $$('[data-add]').forEach(b => {
    const on = ids.has(byH[b.dataset.add].v[0].id);
    b.classList.toggle('in-cart', on); b.querySelector('span').textContent = on ? 'Added ✓' : 'Add To Cart';
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
    const a = e.target.closest('a[href="book/"], a[href="#booker"], .btn-chrome'); if (a) track('book_cta_click', { location: a.closest('.mbar') ? 'mobile_bar' : a.closest('header') ? 'nav' : a.closest('footer') ? 'footer' : (a.closest('section')?.id || 'page'), label: a.textContent.trim() });
    const add = e.target.closest('.add[data-h], [data-add], #countAdd'); if (add) track('add_to_cart', { item: add.dataset.h || add.dataset.add || '84-chip-pure-white-rocklights' });
    if (e.target.closest('#checkout')) track('begin_checkout');
    if (e.target.closest('#shopToggle')) track('menu_open');
    const cat = e.target.closest('.sm-item, .lane, .chip'); if (cat) track('category_select', { category: cat.dataset.cat || cat.dataset.filter });
    if (e.target.closest('#seg button')) track('light_count_select', { count: e.target.closest('#seg button').dataset.n });
    if (e.target.closest('.acc summary')) track('faq_open', { q: e.target.closest('summary').textContent.trim() });
  });
  document.getElementById('booker')?.addEventListener('submit', () => setTimeout(() => {
    const m = document.getElementById('bookMsg');
    if (m && m.classList.contains('pending')) return;
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

/* ---------- install-first layer: book from any kit, vehicle picker, get-the-look builds, cart add-ons ---------- */
(function () {
  const T = (ev, p) => window.ITMtrack && ITMtrack(ev, p);
  const VEH = '';

  /* pre-fill the booking form for one or more kits (on the homepage: open book/ with the kits in the URL) */
  function bookFor(hs, from) {
    hs = [...new Set(hs)].filter(h => INST[h]);
    if (!ON_BOOK) { T('install_click', { from, items: hs.join(',') }); goBook(hs.length ? { kit: hs } : {}); return; }
    if (VEH) pick('vehicle', VEH);
    const KD = { '84-chip-pure-white-rocklights': ['d-rock', '84-Chip Pure White'], '72-chip-pure-white-rock-light': ['d-rock', '72-Chip Pure White'],
      '10-row-pure-white-wheel-lights': ['d-wheel', '10-Row Pure White'], '5-row-pure-white-wheel-lights': ['d-wheel', '5-Row Pure White'],
      '16-count': ['d-sb', '16 Lights'], 'untitled-jun19_07-48': ['d-sw', '1'] };
    hs.forEach(h => { pick('work', INST[h][1]); if (KD[h]) pick(KD[h][0], KD[h][1]); });
    pick('parts', 'ITM Supplies Them');
    typeof estimate === 'function' && estimate();
    T('install_click', { from, items: hs.join(',') });
    if (from !== 'subpage') $('#booker').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion:reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  }
  window.ITMbookFor = bookFor;
  document.addEventListener('click', e => {
    const a = e.target.closest('.inst-book'); if (a) { e.preventDefault(); bookFor([a.dataset.inst], 'card'); }
  });

  /* get the look: each build lists the closest ITM kits */
  const LOOK = {
    'm-a': ['16-count'],
    'm-b': ['84-chip-pure-white-rocklights'],
    'm-c': ['4pc-rgbw-rock-light-kit'],
    'm-d': ['10-row-pure-white-wheel-lights', '84-chip-pure-white-rocklights'],
    'm-e': ['84-chip-pure-white-rocklights'],
  };
  /* phones: the open panel shows as a bottom sheet at page level (animated photo frames can't pin a fixed panel) */
  document.body.insertAdjacentHTML('beforeend', '<div class="look-sheet" id="lookSheet" hidden></div>');
  const phone = matchMedia('(max-width:560px)');
  function sheet(pn) { const sh = $('#lookSheet'); if (pn && phone.matches) { sh.innerHTML = '<button type="button" class="look-x" aria-label="Close">&times;</button>' + pn.innerHTML; sh.hidden = false; } else { sh.hidden = true; sh.innerHTML = ''; } }
  document.addEventListener('click', e => { if (e.target.closest('.look-x')) { $$('[data-look].look-on .look-btn').forEach(b => b.click()); } });
  $$('[data-look]').forEach(f => {
    const hs = LOOK[f.dataset.look]; if (!hs) return;
    f.insertAdjacentHTML('beforeend', `<button type="button" class="look-btn" aria-expanded="false">Get The Look <i aria-hidden="true">+</i></button>
      <div class="look" hidden><p class="look-h">In This Build</p>${hs.map(h => `<button type="button" class="look-item" data-h="${h}">${byH[h].name}<i>View &rarr;</i></button>`).join('')}</div>`);
  });
  document.addEventListener('click', e => {
    const lb = e.target.closest('.look-btn');
    if (lb) { const f = lb.closest('figure'), pn = $('.look', f), open = pn.hidden;
      $$('.look').forEach(x => { x.hidden = true; x.closest('figure').classList.remove('look-on'); x.previousElementSibling.setAttribute('aria-expanded', 'false'); });
      pn.hidden = !open; f.classList.toggle('look-on', open); lb.setAttribute('aria-expanded', open);
      sheet(open ? pn : null); open && T('look_open', { build: f.dataset.look }); return; }
    if (!e.target.closest('.look, #lookSheet')) { $$('[data-look] .look').forEach(x => { if (!x.hidden) { x.hidden = true; x.closest('figure').classList.remove('look-on'); x.previousElementSibling.setAttribute('aria-expanded', 'false'); } }); sheet(null); }
    const li = e.target.closest('.look-item'); if (li) { $$('[data-look].look-on .look-btn').forEach(b => b.click()); sheet(null); window.ITMview && ITMview(li.dataset.h); T('look_view', { item: li.dataset.h }); return; }
  });

  /* cart: finish the build (only what's in stock), plus have-us-install-it */
  const foot = $('.dr-foot'); foot.insertAdjacentHTML('afterbegin', '<div class="dr-up" id="drUp"></div>');
  function upsell() {
    const up = $('#drUp'), hs = cart.map(l => l.h), lights = hs.filter(h => INST[h] && !/mount|untitled/.test(h));
    if (!lights.length) { up.innerHTML = ''; return; }
    const ext = byH['3-pin-wire-extension'], hasExt = hs.includes('3-pin-wire-extension');
    up.innerHTML = (!hasExt && lights.some(h => /16-count|rgbw|wheel/.test(h)) ? `<div class="up-row"><div><b>Add a 5 ft Wire Extension</b><span>For lights far from the module, like a long bed or rear bumper.</span></div><button type="button" class="up-add" data-h="3-pin-wire-extension" data-i="0">+ ${money(ext.v[0].p)}</button></div>` : '') +
      `<a href="book/" class="up-book">We Install It In Mesa <i aria-hidden="true">&rarr;</i></a>`;
  }
  new MutationObserver(upsell).observe($('#drBody'), { childList: true, subtree: true }); upsell();
  foot.addEventListener('click', e => {
    const a = e.target.closest('.up-add'); if (a) { add(a.dataset.h, +a.dataset.i); T('add_to_cart', { item: a.dataset.h, from: 'cart_upsell' }); }
    if (e.target.closest('.up-book')) { e.preventDefault(); openCart(false); bookFor(cart.map(l => l.h), 'cart'); }
  });
})();

/* ---------- deep links from build and area pages: ?book=1&work=…&kit=…&veh=…  /  ?add=<handle> ---------- */
(function () {
  const q = new URLSearchParams(location.search);
  if (q.has('add') && byH[q.get('add')]) {
    const p = byH[q.get('add')], i = p.def ?? 0;
    if (p.v[i].ok) setTimeout(() => { add(p.h, i); openCart(true); }, 400);
  }
})();

/* ---------- product detail view: every store photo + ITM's own description (from itmcustoms.com) ---------- */
const PX = {"84-chip-pure-white-rocklights": {"imgs": ["p-84-chip-pure-white-rocklights-0", "p-84-chip-pure-white-rocklights-1", "p-84-chip-pure-white-rocklights-2", "p-84-chip-pure-white-rocklights-3", "p-84-chip-pure-white-rocklights-4", "p-84-chip-pure-white-rocklights-5"], "note": "PLEASE ALLOW 2-3 weeks for processing", "lines": ["SET OF 4 lights (8 lights shown on truck)", "1 quantity=4 lights example: 20 lights would be 5 quantity (5 quantity x 4 lights each set =20 lights)", "Comes with 4 rubber mounting pads and the necessary bolts, washers and nuts.", "These rocklights are DIY, each light has about 11” of wire attached. You will need to wire them together yourself.", "20watt light please wire accordingly", "Extremely bright!"]}, "72-chip-pure-white-rock-light": {"imgs": ["p-72-chip-pure-white-rock-light-0", "p-72-chip-pure-white-rock-light-1", "p-72-chip-pure-white-rock-light-2", "p-72-chip-pure-white-rock-light-3", "p-72-chip-pure-white-rock-light-4", "p-72-chip-pure-white-rock-light-5", "p-72-chip-pure-white-rock-light-6"], "note": "PLEASE ALLOW 2-3 weeks for processing", "lines": ["SET OF 4 lights", "1 quantity=4 lights example: 20 lights would be 5 quantity (5 quantity x 4 lights each set =20 lights)", "Comes with 4 rubber mounting pads and the necessary bolts, washers and nuts.", "These rocklights are DIY, each light has about 11” of wire attached. You will need to wire them together yourself.", "14w, 1.2amp @12v", "Extremely bright!"]}, "16-count": {"imgs": ["p-16-count-0", "p-16-count-1", "p-16-count-2", "p-8-count-0", "p-4-count-0", "p-4-count-1"], "note": "PLEASE ALLOW 2-3 weeks for processing and shipping.", "lines": ["Included:", "Each light has 15ft of wire", "Complete plug and play connectors with Bluetooth module that has an inline fuse to connect to battery", "Mounting hardware (nuts and bolts)", "Remote control", "App Features:", "Solid white/Solid amber", "Wigwag/Strobe modes", "Speed and brightness control", "**Note** Wire extensions may be needed for your setup(Ex: Crewcab long bed, Rear bumper, etc)"]}, "4pc-rgbw-rock-light-kit": {"imgs": ["p-4pc-rgbw-rock-light-kit-0", "p-4pc-rgbw-rock-light-kit-1", "p-4pc-rgbw-rock-light-kit-2", "p-4pc-rgbw-rock-light-kit-3", "p-4pc-rgbw-rock-light-kit-4"], "note": "PLEASE ALLOW 2-3 weeks for processing and shipping.", "lines": ["Included:", "4pc 44chip RGBW rock light with connectors", "Bluetooth module harness plug and play (with necessary splitters)", "Remote"]}, "10-row-pure-white-wheel-lights": {"imgs": ["p-10-row-pure-white-wheel-lights-0", "p-10-row-pure-white-wheel-lights-1", "p-10-row-pure-white-wheel-lights-2"], "note": "PLEASE ALLOW 2-3 weeks for production and shipping", "lines": ["17” 10 row (5 inside, 5 outside) pure white wheel lights", "Comes as a plug and play kit with module and wireless controller."]}, "5-row-pure-white-wheel-lights": {"imgs": ["p-5-row-pure-white-wheel-lights-0", "p-5-row-pure-white-wheel-lights-1", "p-5-row-pure-white-wheel-lights-2", "p-5-row-pure-white-wheel-lights-3"], "note": "PLEASE ALLOW 2-3 weeks for production and shipping", "lines": ["17” 5 row pure white wheel lights", "Comes as a plug and play kit with module and wireless controller."]}, "magnetic-mount-for-rocklights": {"imgs": ["p-magnetic-mount-for-rocklights-0", "p-magnetic-mount-for-rocklights-1", "p-magnetic-mount-for-rocklights-2", "p-magnetic-mount-for-rocklights-3"], "note": "", "lines": ["Introducing our custom magnetic mounts built specifically to work with our 72 and 84 chip rock lights.", "Details:", "Material: 1/8” thick aluminum CNC cut and made in USA.", "Powerful Magnet: Allows you to skip the drilling into your frame and ensure they stay on over any terrain.", "Universal fit: Designed to be installed on any vehicle, from bumpers, frame rails, rocker panels these mounts will stick to anything metal!", "What’s included: ONE mount with magnet. NO LIGHT included."]}, "magnetic-t-bracket-mount": {"imgs": ["p-magnetic-t-bracket-mount-0", "p-magnetic-t-bracket-mount-1", "p-magnetic-t-bracket-mount-2", "p-magnetic-t-bracket-mount-3", "p-magnetic-t-bracket-mount-4"], "note": "", "lines": ["A great solution to mounting rock lights on vertical surfaces whether that be on the frame or rocker panels or anywhere else!", "110lb rated magnet, stays on even over bumpy terrain", "*price is for one bracket, no light", "* Wire can be inserted on either side, and the other side will be zip tied ensuring the light is secured. We recommend wrapping the rock light wire after passing through the bracket so it will not slip out."]}, "3-pin-wire-extension": {"imgs": ["p-3-pin-wire-extension-0"], "note": "", "lines": ["Plug and play solution for your rock lights that are located far away from your module and won’t reach", "available in 5ft and 10ft options"]}, "untitled-jun19_07-48": {"imgs": ["latching-push-button-switch-wiring", "latching-push-button-switch-dash", "p-untitled-jun19_07-48-2", "p-untitled-jun19_07-48-3"], "note": "", "lines": ["19mm latching push button", "Black stainless steel, White led ring.", "level up your install with this high quality switch button. This goes spliced into place of your regular button.", "WIRING:", "Black wire=Positive from battery", "Yellow=Ground", "Green+blue=Positive trigger for device and led ring"]}, "itm-truck-t-shirt": {"imgs": ["p-itm-truck-t-shirt-0", "p-itm-truck-t-shirt-1"], "note": "", "lines": ["Available in S-XXL", "High quality screen printed design on 100% cotton shirt.", "Front pocket: ITM CUSTOMS", "Back: Truck design"]}, "6-decal": {"imgs": ["p-6-decal-0"], "note": "", "lines": ["6” decals", "High quality weatherproof vinyl"]}};
(function () {
  document.body.insertAdjacentHTML('beforeend', `<dialog class="pv" id="pv" aria-labelledby="pvName"><div class="pv-in">
    <button type="button" class="pv-x" aria-label="Close">&times;</button>
    <div class="pv-gal"><figure class="pv-main"><img id="pvImg" alt=""></figure><div class="pv-thumbs" id="pvThumbs"></div></div>
    <div class="pv-info" id="pvInfo"></div></div></dialog>`);
  const dlg = $('#pv');
  let cur = null, sel = 0;
  const esc = t => t.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  function show(n, k) {
    const im = $('#pvImg'); im.src = IMG(n); im.alt = `${cur.name}, photo ${k + 1} of ${PX[cur.h].imgs.length}`;
    $$('.pv-thumbs button').forEach((b, i) => b.classList.toggle('on', i === k));
  }
  function info() {
    const p = cur, v = p.v[sel], x = PX[p.h], ins = INST[p.h];
    const desc = x.lines.map(l => l.replace(/\*\*Note\*\*\s*/i, 'Note: ')).map(l => /:$/.test(l) ? `<h4>${esc(l.replace(/:$/, ''))}</h4>` : `<li>${esc(l)}</li>`).join('')
      .replace(/(<li>.*?<\/li>)+/g, m => `<ul>${m}</ul>`);
    $('#pvInfo').innerHTML = `<span class="c-cat">${p.catL}</span><h3 class="pv-name" id="pvName">${p.name}</h3>
      ${p.rating ? `<div class="rating">★ ${p.rating[0].toFixed(p.rating[0] % 1 ? 2 : 1)} <span>(${p.rating[1]} review${p.rating[1] > 1 ? 's' : ''})</span></div>` : ''}
      <div class="pv-price"><span class="now">${money(v.p)}</span>${v.was ? `<span class="was">${money(v.was)}</span>` : ''}${v.ok ? '' : '<span class="pv-out">Out Of Stock</span>'}</div>
      ${p.v.length > 1 ? `<div class="vars" role="radiogroup" aria-label="Option">${p.v.map((y, i) => `<button type="button" class="var${i === sel ? ' on' : ''}${y.ok ? '' : ' so'}" data-pi="${i}" role="radio" aria-checked="${i === sel}">${y.t}</button>`).join('')}</div>` : ''}
      <div class="pv-act">${v.ok ? `<button type="button" class="btn btn-primary pv-add"><span>Add To Cart</span></button>` : ''}
        ${ins ? `<a href="book/" class="btn btn-chrome pv-inst"><span>We Install It <i aria-hidden="true">&rarr;</i></span></a>` : ''}</div>
      ${ins ? `<p class="pv-how"><b>${ins[0]}</b> · or book the install at our Mesa shop.</p>` : ''}
      <div class="pv-desc">${desc}</div>
      ${x.note ? `<p class="pv-note">${esc(x.note.charAt(0) + x.note.slice(1).toLowerCase()).replace(/\.*$/, '')}.</p>` : ''}`;
  }
  function open(h) {
    cur = byH[h]; if (!cur || !PX[h]) return;
    const card = $(`.card[data-h="${h}"]`); sel = card && card._sel != null ? card._sel : (cur.def ?? 0);
    $('#pvThumbs').innerHTML = PX[h].imgs.map((n, k) => `<button type="button" data-k="${k}" aria-label="Photo ${k + 1}"><img src="${IMG(n)}" alt="" loading="lazy"></button>`).join('');
    $('#pvThumbs').hidden = PX[h].imgs.length < 2;
    show(PX[h].imgs[0], 0); info();
    dlg.showModal(); document.documentElement.classList.add('pv-open'); dlg.scrollTop = 0; $('.pv-in', dlg).scrollTop = 0;
    window.ITMtrack && ITMtrack('view_item', { item: h });
  }
  function close() { dlg.close(); }
  dlg.addEventListener('close', () => document.documentElement.classList.remove('pv-open'));
  dlg.addEventListener('click', e => {
    if (e.target === dlg || e.target.closest('.pv-x')) return close();
    const t = e.target.closest('.pv-thumbs button'); if (t) return show(PX[cur.h].imgs[+t.dataset.k], +t.dataset.k);
    const vb = e.target.closest('[data-pi]'); if (vb) { sel = +vb.dataset.pi; return info(); }
    if (e.target.closest('.pv-add')) { add(cur.h, sel); close(); return; }
    if (e.target.closest('.pv-inst')) { e.preventDefault(); close(); window.ITMbookFor && ITMbookFor([cur.h], 'product_view'); }
  });
  if (grid) grid.addEventListener('click', e => {
    if (e.target.closest('.c-fig, .c-name, .c-view')) { const c = e.target.closest('.card'); c && open(c.dataset.h); }
  });
  if (grid) grid.addEventListener('keydown', e => {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('.c-name')) { e.preventDefault(); open(e.target.closest('.card').dataset.h); }
  });
  if (grid) $$('.card', grid).forEach(c => { const n = $('.c-name', c); if (n) { n.tabIndex = 0; n.setAttribute('role', 'button'); n.setAttribute('aria-label', `${n.textContent}: photos and details`); }
    const f = $('.c-fig', c); if (f && PX[c.dataset.h] && PX[c.dataset.h].imgs.length > 1) f.insertAdjacentHTML('beforeend', `<span class="c-view">${PX[c.dataset.h].imgs.length} Photos</span>`); });
  window.ITMview = open;
})();

/* booking steps light their LED strip when they're complete */
(function () {
  const f = document.getElementById('booker'); if (!f) return;
  const fs = [...f.querySelectorAll('fieldset')];
  const check = () => {
    const v = n => (f.querySelector(`[name=${n}]`) || {}).value || '';
    const on = n => !!f.querySelector(`.opts[data-name="${n}"] .opt.on`);
    const st = [on('vehicle') || v('ymm').trim().length > 2, on('work'), !!(v('date') && v('time')), !!(v('name').trim() && v('contact').trim())];
    fs.forEach((x, i) => x.classList.toggle('done', !!st[i]));
  };
  ['click', 'input', 'change'].forEach(ev => f.addEventListener(ev, () => setTimeout(check, 30)));
  check();
})();

/* preview build: every outbound action is switched off */
document.addEventListener('click', e => {
  const a = e.target.closest('a[data-preview-off], #checkout'); if (!a) return;
  e.preventDefault(); toast('Preview only. Links and checkout are off in this concept.');
}, true);

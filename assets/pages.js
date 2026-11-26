/* ITM subpages: preview-safe links + GA4-ready clicks */
(function () {
  window.dataLayer = window.dataLayer || [];
  document.addEventListener('click', function (e) {
    var off = e.target.closest('a[data-preview-off]');
    if (off) { e.preventDefault(); return; }
    var gx = e.target.closest('a[data-govx]');   /* replaced by the GovX ID app button on the live theme */
    if (gx) { e.preventDefault(); var n = gx.closest('.scta').nextElementSibling; if (n && n.classList.contains('govx-note')) n.hidden = false; return; }
    var a = e.target.closest('a[href*="book=1"]');
    if (a) window.dataLayer.push({ event: 'book_cta_click', location: location.pathname.split('/').slice(-3, -1).join('/'), label: a.textContent.trim() });
  });
})();

/* v1085: hide the page nav while scrolling down on phones and tablets, show it on scroll up */
(function () {
  var nav = document.querySelector('.pnav'); if (!nav) return;
  var mq = matchMedia('(max-width:940px)'), last = scrollY, tick = false;
  addEventListener('scroll', function () {
    if (tick) return; tick = true;
    requestAnimationFrame(function () {
      var y = scrollY, d = y - last;
      if (!mq.matches || y < 140) nav.classList.remove('away');
      else if (d > 6) nav.classList.add('away');
      else if (d < -6) nav.classList.remove('away');
      if (Math.abs(d) > 6) last = y; tick = false;
    });
  }, { passive: true });
})();

/* v1086: service-area maps (East / West Valley). Leaflet + Esri dark gray tiles load only when a map scrolls near.
   Every line runs to the Mesa shop: ITM doesn't do mobile installs. The city list under the map works without it. */
(function () {
  var maps = document.querySelectorAll('.vmap-map[data-map]');
  if (!maps.length || !('IntersectionObserver' in window)) return;
  var ready = null;
  function load() {
    if (ready) return ready;
    ready = new Promise(function (res, rej) {
      var l = document.createElement('link'); l.rel = 'stylesheet'; l.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'; document.head.appendChild(l);
      var s = document.createElement('script'); s.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'; s.onload = res; s.onerror = rej; document.head.appendChild(s);
    });
    return ready;
  }
  function draw(el) {
    var d = JSON.parse(el.getAttribute('data-map')), home = [d.home.lat, d.home.lng], wide = el.clientWidth >= 560;
    var m = L.map(el, { scrollWheelZoom: false, dragging: !L.Browser.mobile, tap: false, zoomSnap: 0.25 });
    var esri = 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_';
    L.tileLayer(esri + 'Base/MapServer/tile/{z}/{y}/{x}', { maxZoom: 15, attribution: 'Tiles &copy; Esri, HERE, Garmin, &copy; OpenStreetMap contributors' }).addTo(m);
    m.attributionControl.setPrefix('Leaflet');
    if (d.hull && d.hull.length > 2) L.polygon(d.hull, { color: '#FFB23F', weight: 1, opacity: .45, fillColor: '#FFB23F', fillOpacity: .06, interactive: false }).addTo(m);
    var pts = [home];
    d.cities.forEach(function (c) {
      var p = [c.lat, c.lng]; pts.push(p);
      L.polyline([p, home], { color: '#FFB23F', weight: 1.5, opacity: .5, dashArray: '4 6', interactive: false }).addTo(m);
      var off = { right: [8, 0], left: [-8, 0], top: [0, -8], bottom: [0, 8] }[c.dir] || [8, 0];
      L.circleMarker(p, { radius: 6, color: '#0b0e13', weight: 2, fillColor: '#FFB23F', fillOpacity: 1 }).addTo(m)
        .bindTooltip(c.name + ' · ' + c.mi + ' mi', { permanent: wide, direction: c.dir || 'right', offset: off, className: 'vmap-tip' });
    });
    L.marker(home, { keyboard: false, icon: L.divIcon({ className: 'vmap-home', html: '<span>ITM Customs<small>Our Mesa shop</small></span>', iconSize: [0, 0] }) }).addTo(m);
    m.fitBounds(pts, { padding: wide ? [60, 60] : [28, 28] });
  }
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      load().then(function () { draw(e.target); }).catch(function () { e.target.classList.add('vmap-off'); });
    });
  }, { rootMargin: '400px' });
  maps.forEach(function (el) { io.observe(el); });
})();

/* v1089: service pages reveal sections, cards, photos and timeline steps as they scroll in */
(function () {
  var els = document.querySelectorAll('.sp .rv-in, .sp .rv-sec');
  if (!els.length) return;
  if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) { els.forEach(function (e) { e.classList.add('in'); }); return; }
  document.documentElement.classList.add('js');
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -4% 0px' });
  els.forEach(function (e) { io.observe(e); });
})();

/* v1090: cart count in the subpage top bar, read from the same cart the shop uses */
(function () {
  var n = 0, el = document.getElementById('pcartN'); if (!el) return;
  try { (JSON.parse(localStorage.getItem('itm_cart_v1')) || []).forEach(function (l) { n += +l.q || 0; }); } catch (e) {}
  el.textContent = n; el.classList.toggle('has', n > 0);
})();

/* v1091: switch panels: one switch on at a time, the screen shows its line */
(function () {
  document.documentElement.classList.add('js');
  document.querySelectorAll('[data-swp]').forEach(function (p) {
    var keys = p.querySelectorAll('.swk'), panes = p.querySelectorAll('.swp-p');
    function on(i) {
      keys.forEach(function (k, j) { k.classList.toggle('on', j === i); k.setAttribute('aria-selected', j === i); k.tabIndex = j === i ? 0 : -1; });
      panes.forEach(function (x, j) { x.classList.toggle('on', j === i); });
    }
    /* autoplay: step to the next switch every 3.5 s while on screen; a tap takes over for 12 s */
    var cur = 0, held = 0, seen = false, ms = 3500, scr = p.querySelector('.swp-screen');
    scr.insertAdjacentHTML('beforeend', '<span class="swp-t" aria-hidden="true"><i></i></span>');
    var bar = scr.querySelector('.swp-t i'); p.style.setProperty('--ms', ms + 'ms');
    function run() { bar.classList.remove('go'); void bar.offsetWidth; bar.classList.add('go'); }
    var base = on; on = function (n) { cur = n; base(n); p.toggleAttribute('data-amber', n % 2 === 1); run(); };
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setInterval(function () { if (seen && !document.hidden && Date.now() > held && !p.matches(':hover')) on((cur + 1) % keys.length); }, ms);
      if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { seen = es[0].isIntersecting; }, { threshold: .4 }).observe(p); else seen = true;
    }
    keys.forEach(function (k, i) {
      k.addEventListener('click', function () { held = Date.now() + 12000; on(i); });
      k.addEventListener('keydown', function (e) {
        var d = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key]; if (!d) return;
        e.preventDefault(); var n = (i + d + keys.length) % keys.length; on(n); keys[n].focus();
      });
    });
    on(0);
  });
})();

/* v1098: hero reel steps through every photo (about 2 s each), pauses when off screen or the tab is hidden */
(function () {
  var r = document.querySelector('[data-reel]'); if (!r) return;
  var imgs = r.querySelectorAll('.reel-in img'), tag = r.querySelector('.reel-tag'), num = r.querySelector('.reel-n b'), bar = r.querySelector('.reel-bar i');
  var ms = +r.dataset.ms || 2000, i = 0, t = null, vis = true;
  r.style.setProperty('--ms', ms + 'ms');
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || imgs.length < 2) return;
  function show(n) {
    imgs[i].classList.remove('on'); i = n; imgs[i].classList.add('on');
    tag.textContent = imgs[i].dataset.l; num.textContent = i + 1;
    if (imgs[(i + 1) % imgs.length].loading === 'lazy') imgs[(i + 1) % imgs.length].loading = 'eager';
    bar.classList.remove('go'); void bar.offsetWidth; bar.classList.add('go');
  }
  function tick() { if (vis && !document.hidden) show((i + 1) % imgs.length); }
  bar.classList.add('go');
  t = setInterval(tick, ms);
  if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { vis = es[0].isIntersecting; }).observe(r);
})();

/* v1108: services menu on inner pages (same menu as the homepage) */
(function () {
  var btn = document.getElementById('pMenuBtn'), menu = document.getElementById('pMenu'); if (!btn || !menu) return;
  function set(on) { menu.hidden = !on; btn.setAttribute('aria-expanded', on); btn.classList.toggle('on', on); }
  btn.addEventListener('click', function (e) { e.stopPropagation(); set(menu.hidden); });
  document.addEventListener('click', function (e) { if (!menu.hidden && !e.target.closest('#pMenu, #pMenuBtn')) set(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !menu.hidden) { set(false); btn.focus(); } });
  menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { set(false); });  /* v1129 */
    if (a.pathname === location.pathname && !a.hash) { a.setAttribute('aria-current', 'page'); a.classList.add('here'); }
    a.addEventListener('click', function () { set(false); });
  });
})();
/* v1118: gallery filter chips + lightbox */
(function(){var g=document.getElementById('gwGrid');if(!g)return;var items=[].slice.call(g.querySelectorAll('.gw-i')),chips=[].slice.call(document.querySelectorAll('.gw-chips .chip')),box=document.getElementById('gwBox'),bi=box.querySelector('img'),bc=box.querySelector('figcaption'),cur=0;
chips.forEach(function(c){c.addEventListener('click',function(){var v=c.dataset.g;chips.forEach(function(x){var on=x===c;x.classList.toggle('on',on);x.setAttribute('aria-pressed',on)});items.forEach(function(it){it.hidden=!(v==='all'||it.dataset.cat===v)})})});
function vis(){return items.filter(function(it){return !it.hidden})}
function show(it){var im=it.querySelector('img');bi.src=im.dataset.full||im.currentSrc||im.src;bi.alt=im.alt;bc.textContent=im.alt;cur=vis().indexOf(it)}
items.forEach(function(it){it.querySelector('.gw-open').addEventListener('click',function(){show(it);if(box.showModal)box.showModal();else box.setAttribute('open','')})});
function step(d){var v=vis();if(!v.length)return;show(v[(cur+d+v.length)%v.length])}
box.querySelector('.gw-prev').addEventListener('click',function(){step(-1)});box.querySelector('.gw-next').addEventListener('click',function(){step(1)});
box.querySelector('.gw-x').addEventListener('click',function(){box.close()});
box.addEventListener('click',function(e){if(e.target===box)box.close()});
box.addEventListener('keydown',function(e){if(e.key==='ArrowRight')step(1);if(e.key==='ArrowLeft')step(-1)});})();

/* v1129 launch QA: light-count pickers on kit cards and product pages update the price and the Add To Cart link */
(function () {
  document.addEventListener('click', function (e) {
    var b = e.target.closest('.kit-n .kn'); if (!b) return;
    var box = b.closest('.kit, .pp-buy'); if (!box) return;
    box.querySelectorAll('.kit-n .kn').forEach(function (x) { var on = x === b; x.classList.toggle('on', on); x.setAttribute('aria-checked', on ? 'true' : 'false'); });
    var p = box.querySelector('.kit-p'), u = box.querySelector('.kit-u'), a = box.querySelector('.kit-add');
    if (p) p.textContent = b.dataset.p;
    if (u) u.textContent = b.dataset.u || b.dataset.n + ' lights';
    if (a) a.href = a.dataset.root + '?add=' + a.dataset.h + '&v=' + b.dataset.i + '#shop';
    /* v1146: an option with its own photo moves the gallery to it */
    if (b.dataset.img) { var g = box.closest('.pp, .pp-grid, section'), tr = g && g.querySelector('.pp-gal .m-track');
      if (tr) { var ims = [].slice.call(tr.querySelectorAll('img')), k = ims.findIndex(function (im) { return im.getAttribute('src').indexOf(b.dataset.img + '.webp') > -1; });
        if (k > -1) { ims.forEach(function (im) { im.loading = 'eager'; }); var go = function () { tr.scrollLeft += ims[k].getBoundingClientRect().left - tr.getBoundingClientRect().left; }; go();  /* v1147: jump to the photo itself; slide widths settle as photos load, so re-aim twice */
          [400, 1200].forEach(function (t) { setTimeout(go, t); }); } } }
  });
})();

/* v1140: kit stepper on product pages: picks the matching light count behind the scenes (1 kit = 4 lights) */
(function () {
  document.addEventListener('click', function (e) {
    var q = e.target.closest('.kq [data-kq]'); if (!q) return;
    var box = q.closest('.kit, .pp-buy'), ks = box.querySelectorAll('.kit-n .kn'), n = box.querySelector('.kq .cq-n');
    var k = Math.max(1, Math.min(ks.length, +n.textContent + +q.dataset.kq)); n.textContent = k; ks[k - 1].click();
    box.querySelectorAll('.kq button').forEach(function (b) { var off = +b.dataset.kq < 0 ? k <= 1 : k >= ks.length; b.toggleAttribute('aria-disabled', off); b.classList.toggle('is-end', off); });
  });
})();

/* v1129: product page gallery: arrows, swipe, thumbs, count */
(function () {
  document.querySelectorAll('.pp-gal').forEach(function (g) {
    var tr = g.querySelector('.m-track'), n = tr.children.length, cnt = g.querySelector('.m-count'), ths = g.parentNode.querySelectorAll('.pp-th');
    var at = function () { return Math.round(tr.scrollLeft / tr.clientWidth); };
    var go = function (i) { i = (i + n) % n; tr.scrollTo({ left: i * tr.clientWidth, behavior: 'smooth' }); };
    var pv = g.querySelector('.m-prev'), nx = g.querySelector('.m-next');
    if (pv) pv.onclick = function () { go(at() - 1); };
    if (nx) nx.onclick = function () { go(at() + 1); };
    ths.forEach(function (t) { t.onclick = function () { go(+t.dataset.i); }; });
    tr.addEventListener('scroll', function () { requestAnimationFrame(function () { var i = at(); if (cnt) cnt.textContent = (i + 1) + ' / ' + n; ths.forEach(function (t, k) { t.classList.toggle('on', k === i); }); }); }, { passive: true });
  });
})();

/* v1130: product posts on service pages: option, quantity, swatches and the 5 vs 10-row chooser */
(function () {
  function href(post) {
    var i = (post.querySelector('.pp-opt.on') || {}).dataset; i = i ? i.i : post.dataset.d;
    var q = post.classList.contains('is-kit') ? 1 : +(post.querySelector('.cq-n') || { textContent: 1 }).textContent;  // v1140: on kits the box counts kits, and the option carries the count
    var on = post.querySelector('.pp-opt.on'), vt = on && on.dataset.vt;
    var a = post.querySelector('.pp-add'); if (a && a.tagName === 'A') a.href = post.dataset.root + '?add=' + post.dataset.h + (vt ? '&vt=' + encodeURIComponent(vt) : '&v=' + i) + '&q=' + q + '#shop';
  }
  /* v1136: − greys out at 1 and + at 20, so neither looks clickable when it can't change anything */
  function cqEnds(post) { var n = post.querySelector('.cq-n'); if (!n) return; var v = +n.textContent, max = post.classList.contains('is-kit') ? post.querySelectorAll('.pp-opt').length : 20;
    post.querySelectorAll('.cq button').forEach(function (b) { var off = +b.dataset.q < 0 ? v <= 1 : v >= max; b.toggleAttribute('aria-disabled', off); b.classList.toggle('is-end', off); }); }
  document.querySelectorAll('.ppost').forEach(cqEnds);
  document.addEventListener('click', function (e) {
    var post = e.target.closest('.ppost');
    if (post) {
      var o = e.target.closest('.pp-opt');
      if (o) { post.querySelectorAll('.pp-opt').forEach(function (x) { var on = x === o; x.classList.toggle('on', on); x.setAttribute('aria-checked', on ? 'true' : 'false'); });
        post.querySelector('.pp-p').textContent = o.dataset.p; post.querySelector('.pp-unit').textContent = o.dataset.unit; href(post); }
      var q = e.target.closest('.cq button');
      if (q && post.classList.contains('is-kit')) { var ops = post.querySelectorAll('.pp-opt'), kn = post.querySelector('.cq-n'), k = Math.max(1, Math.min(ops.length, +kn.textContent + +q.dataset.q)); kn.textContent = k;
        ops.forEach(function (x, j) { x.classList.toggle('on', j === k - 1); x.setAttribute('aria-checked', j === k - 1 ? 'true' : 'false'); });
        post.querySelector('.pp-p').textContent = ops[k - 1].dataset.p; post.querySelector('.pp-unit').textContent = ops[k - 1].dataset.unit; href(post); cqEnds(post); }
      else if (q) { var n = post.querySelector('.cq-n'); n.textContent = Math.max(1, Math.min(20, +n.textContent + +q.dataset.q)); href(post); cqEnds(post); }
      var sw = e.target.closest('.pp-sw button');
      if (sw) { var tr = post.querySelector('.m-track'), ims = [].slice.call(tr.querySelectorAll('img')), k = ims.findIndex(function (im) { return im.dataset.m.indexOf(sw.dataset.sw) > -1; });
        post.querySelectorAll('.pp-sw button').forEach(function (b) { b.classList.toggle('on', b === sw); });
        if (k > -1) { ims.forEach(function (im) { im.loading = 'eager'; }); var go = function () { tr.scrollLeft += ims[k].getBoundingClientRect().left - tr.getBoundingClientRect().left; }; go();  /* v1147: the color photos now sit behind the studio shots; aim at the photo, re-aim as photos load */
          [400, 1200].forEach(function (t) { setTimeout(go, t); }); } }
    }
    var t = e.target.closest('.pch');
    if (t) { var box = t.closest('.pchoose');
      box.querySelectorAll('.pch').forEach(function (b) { var on = b === t; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on ? 'true' : 'false'); });
      box.querySelectorAll('.pch-p').forEach(function (p) { p.hidden = p.dataset.k !== t.dataset.k; }); }
  });
  /* photos load once the post is near the screen, so a swipe never lands on a blank frame */
  document.querySelectorAll('.ppost .m-track').forEach(function (tr) { var all = function () { tr.querySelectorAll('img').forEach(function (im) { im.loading = 'eager'; }); };
    tr.addEventListener('pointerdown', all, { once: true }); tr.addEventListener('scroll', all, { once: true, passive: true });
    tr.parentNode.querySelectorAll('.m-arr').forEach(function (b) { b.addEventListener('click', all, { once: true }); }); });
  if ('IntersectionObserver' in window) { var io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { var im = en.target.querySelectorAll('.m-track img')[1]; if (im) im.loading = 'eager'; io.unobserve(en.target); } }); }, { rootMargin: '300px' });
    document.querySelectorAll('.ppost').forEach(function (p) { io.observe(p); }); }
})();

/* v1160: service-page count picker = the homepage's Build Your Count section (same markup and ids; app.js runs it on the homepage) */
(function () {
  var box = document.querySelector('.count-svc'); if (!box) return;
  var seg = document.getElementById('seg'), frame = box.querySelector('.count-frame'), img = document.getElementById('countImg'), cur = 8;
  var add = document.getElementById('countAdd'), bk = document.getElementById('countBook');
  function packs(n) { return Math.ceil(n / 4); }
  function set(n) {
    cur = n; var p = packs(n);
    seg.querySelectorAll('button').forEach(function (b) { var on = +b.dataset.n === n; b.classList.toggle('on', on); b.setAttribute('aria-checked', on ? 'true' : 'false'); });
    document.getElementById('mLights').textContent = n; document.getElementById('mSets').textContent = p;
    document.getElementById('mPrice').textContent = '$' + (p * 55).toLocaleString('en-US');
    document.getElementById('vfN').textContent = n;
    add.querySelector('span').textContent = 'Add ' + p + ' Packs To Cart';
    add.href = add.href.replace(/([?&]q=)\d+/, '$1' + p);
    if (bk) bk.href = bk.href.replace(/([?&]count=)\d+/, '$1' + n);
    var src = box.dataset.root + 'assets/img/count-' + n + '-lights.webp', pre = new Image();
    pre.onload = function () { if (cur !== n) return; img.src = src; img.alt = 'Truck lit by ' + n + ' ITM rock lights, with where each light goes'; };
    pre.src = src;
  }
  seg.addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) set(+b.dataset.n); });
  seg.addEventListener('keydown', function (e) {
    var ks = [].map.call(seg.querySelectorAll('button'), function (b) { return +b.dataset.n; }), i = ks.indexOf(cur);
    var d = (e.key === 'ArrowRight' || e.key === 'ArrowDown') ? 1 : (e.key === 'ArrowLeft' || e.key === 'ArrowUp') ? -1 : 0;
    if (d) { e.preventDefault(); var n = ks[(i + d + ks.length) % ks.length]; set(n); seg.querySelector('[data-n="' + n + '"]').focus(); }
  });
  /* frame takes the photo's true shape, like the homepage */
  function fit() { if (img.naturalWidth) frame.style.aspectRatio = img.naturalWidth + ' / ' + img.naturalHeight; }
  img.complete ? fit() : img.addEventListener('load', fit, { once: true });
  /* phones: the count buttons ride on the photo, like the homepage (m.js) */
  var PH = matchMedia('(max-width:560px)'), home = [seg.parentNode, seg.nextSibling];
  function place() { if (PH.matches) { frame.appendChild(seg); seg.classList.add('seg-on-photo'); } else { seg.classList.remove('seg-on-photo'); home[0].insertBefore(seg, home[1]); } }
  PH.addEventListener ? PH.addEventListener('change', place) : PH.addListener(place); place();
})();

/* v1130 batch 2: scroll sections (pinned photo follows the copy) and the builds rail arrows */
(function () {
  document.querySelectorAll('.scrolly').forEach(function (sc) {
    var imgs = sc.querySelectorAll('.sy-i'), steps = sc.querySelectorAll('.sy-step'), n = sc.querySelector('.sy-n b');
    imgs.forEach(function (im, i) { if (i < 2) im.loading = 'eager'; });
    if (!('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (!e.isIntersecting) return; var k = e.target.dataset.k;
      steps.forEach(function (s) { s.classList.toggle('on', s === e.target); });
      imgs.forEach(function (im) { var on = im.dataset.k === k; if (on || +im.dataset.k === +k + 1) im.loading = 'eager'; im.classList.toggle('on', on); });
      if (n) n.textContent = +k + 1; }); }, { rootMargin: '-45% 0px -45% 0px' });
    steps.forEach(function (s) { io.observe(s); });
  });
  document.querySelectorAll('.brail').forEach(function (r) {
    var t = r.querySelector('.brail-t'), step = function () { return Math.max(260, t.clientWidth * 0.8); };
    r.querySelector('.m-prev').onclick = function () { t.scrollBy({ left: -step(), behavior: 'smooth' }); };
    r.querySelector('.m-next').onclick = function () { t.scrollBy({ left: step(), behavior: 'smooth' }); };
    /* v1136: the arrow at the end of the rail greys out instead of doing nothing */
    var ends = function () { var p = r.querySelector('.m-prev'), x = r.querySelector('.m-next'), max = t.scrollWidth - t.clientWidth - 2;
      p.toggleAttribute('aria-disabled', t.scrollLeft <= 2); p.classList.toggle('is-end', t.scrollLeft <= 2);
      x.toggleAttribute('aria-disabled', t.scrollLeft >= max); x.classList.toggle('is-end', t.scrollLeft >= max); };
    t.addEventListener('scroll', ends, { passive: true }); addEventListener('resize', ends); ends();
  });
})();

/* v1132: slideshows change on their own (pause on hover or after a tap), arrows and dots too */
(function () {
  document.querySelectorAll('.slides').forEach(function (sl) {
    var it = sl.querySelectorAll('.sl-i'), ds = sl.querySelectorAll('.sl-d'), k = 0, n = it.length, hold = 0, ms = +sl.dataset.ms || 3800;
    function go(i) { k = (i + n) % n; it.forEach(function (x, j) { x.classList.toggle('on', j === k); var im = x.querySelector('img'); if (j === (k + 1) % n && im) im.loading = 'eager'; }); ds.forEach(function (d, j) { d.classList.toggle('on', j === k); }); }
    sl.querySelector('.m-prev').onclick = function () { hold = Date.now(); go(k - 1); };
    sl.querySelector('.m-next').onclick = function () { hold = Date.now(); go(k + 1); };
    ds.forEach(function (d) { d.onclick = function () { hold = Date.now(); go(+d.dataset.k); }; });
    sl.addEventListener('mouseenter', function () { hold = Date.now() + 864e5; }); sl.addEventListener('mouseleave', function () { hold = Date.now(); });
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setInterval(function () { if (Date.now() - hold > 9000 && document.visibilityState === 'visible') go(k + 1); }, ms);
  });
})();

/* v1161 (Chris, 2026-11-26): Black Friday "15% Off" ribbon across the lower-right corner of every product card photo.
   Shows until 8:00 AM Arizona time on 2026-11-27 (15:00 UTC), then never draws again. Isaac's automatic BFITM discount does the math at checkout. */
(function () {
  var END = Date.parse('2026-11-27T15:00:00Z'); if (Date.now() >= END) return;
  var SEL = '.card .c-fig, .card.m-pcard .m-gal, .ppost .pp-gal, .kit';
  function paint() {
    if (Date.now() >= END) { document.querySelectorAll('.bf-rib').forEach(function (r) { r.remove(); }); return; }
    document.querySelectorAll(SEL).forEach(function (el) {
      var host = el;
      if (el.classList.contains('kit')) {   /* kit cards: wrap the photo so the ribbon sits on it, not on the whole card */
        host = el.querySelector(':scope > .bf-kfig'); var im = el.querySelector(':scope > img');
        if (!host && im) { host = document.createElement('span'); host.className = 'bf-kfig'; im.parentNode.insertBefore(host, im); host.appendChild(im); }
        if (!host) return;
      }
      if (host.querySelector(':scope > .bf-rib')) return;
      if (host.parentElement && host.parentElement.closest(SEL) && !host.parentElement.closest('.kit')) return;   /* one ribbon per card: skip a frame nested in another */
      host.querySelectorAll('.bf-rib').forEach(function (x) { x.remove(); });   /* and drop any from a frame nested inside this one */
      host.classList.add('bf-has');
      var r = document.createElement('span'); r.className = 'bf-rib'; r.setAttribute('aria-label', '15% off for Black Friday'); r.textContent = '15% Off';
      host.appendChild(r);
    });
  }
  paint();
  var t = 0; new MutationObserver(function () { clearTimeout(t); t = setTimeout(paint, 60); }).observe(document.body, { childList: true, subtree: true });
  setTimeout(paint, END - Date.now() + 1000);
})();

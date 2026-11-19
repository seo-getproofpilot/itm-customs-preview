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
  var els = document.querySelectorAll('.sp .rv-in');
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

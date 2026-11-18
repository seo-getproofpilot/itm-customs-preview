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

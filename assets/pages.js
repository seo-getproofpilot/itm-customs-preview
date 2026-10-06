/* ITM subpages: preview-safe links + GA4-ready clicks */
(function () {
  window.dataLayer = window.dataLayer || [];
  document.addEventListener('click', function (e) {
    var off = e.target.closest('a[data-preview-off]');
    if (off) { e.preventDefault(); return; }
    var a = e.target.closest('a[href*="book=1"]');
    if (a) window.dataLayer.push({ event: 'book_cta_click', location: location.pathname.split('/').slice(-3, -1).join('/'), label: a.textContent.trim() });
  });
})();

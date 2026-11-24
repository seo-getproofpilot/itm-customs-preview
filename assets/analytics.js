/* v1129 launch QA: GA4 for ITM Customs. Off until GA_ID is set, and never on the GitHub preview.
   The site already pushes its events to window.dataLayer ({event:'add_to_cart', ...}); this forwards them to GA4,
   and adds generate_lead when the booking, contact or quote form is sent. Mark generate_lead, begin_checkout and
   booking_submit as key events in GA4. */
(function () {
  var GA_ID = '';  // e.g. 'G-XXXXXXX', from the ITM GA4 property
  /* Purchases happen on Shopify's checkout, which this script can't see; Shopify's Google & YouTube app reports them
     (and page views) to the same GA4 property. With that app installed, set APP_PAGEVIEWS = true so page views aren't
     counted twice; this script then only sends the site's own events (add_to_cart, begin_checkout, booking, leads). */
  var APP_PAGEVIEWS = false;
  window.dataLayer = window.dataLayer || [];
  document.addEventListener('submit', function (e) {
    var f = e.target; if (!f || !f.id || !/^(booker|contactForm|quoteForm)$/.test(f.id)) return;
    if (f.checkValidity && !f.checkValidity()) return;
    window.dataLayer.push({ event: 'generate_lead', form: f.id });
  }, true);
  if (!GA_ID || /github\.io$|localhost|127\.0\.0\.1/.test(location.hostname)) return;
  var s = document.createElement('script'); s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID; document.head.appendChild(s);
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag; gtag('js', new Date()); gtag('config', GA_ID, APP_PAGEVIEWS ? { send_page_view: false } : {});
  var push = window.dataLayer.push.bind(window.dataLayer), seen = window.dataLayer.slice();
  function fwd(o) { if (o && typeof o === 'object' && !('length' in o) && o.event && !/^gtm\./.test(o.event)) { var p = {}; for (var k in o) if (k !== 'event') p[k] = o[k]; gtag('event', o.event, p); } }
  seen.forEach(fwd);
  window.dataLayer.push = function () { for (var i = 0; i < arguments.length; i++) fwd(arguments[i]); return push.apply(null, arguments); };
})();

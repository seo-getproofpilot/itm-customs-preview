/* v1121 (Chris, 2026-11-23): phone-only homepage behaviour.
   - Services: four tiles, then See All Services. Show Less keeps the button in place.
   - Build Your Count: the count buttons sit on the bottom of the photo, so the photo and the buttons fit one screen.
   - Reviews: one review at a time, advancing on its own every 5 seconds; a swipe or tap pauses it. */
(function () {
  const PHONE = matchMedia('(max-width:560px)');
  const $ = (s, r = document) => r.querySelector(s);

  /* ---------- services: See All Services ---------- */
  const lanes = $('.lanes'), lm = $('#lanesMore');
  if (lanes && lm) {
    let open = false;
    const paint = () => {
      lanes.classList.toggle('lanes-clip', PHONE.matches && !open);
      $('b', lm).textContent = open ? 'Show Less' : 'See All Services';
      $('span', lm).textContent = open ? '' : '4 more';
      lm.setAttribute('aria-expanded', open);
    };
    lm.addEventListener('click', () => {
      const y0 = lm.getBoundingClientRect().top;
      open = !open; paint();
      if (!open) scrollBy({ top: lm.getBoundingClientRect().top - y0, behavior: 'instant' });
    });
    PHONE.addEventListener('change', paint); paint();
  }

  /* ---------- Build Your Count: the count buttons ride with the photo ---------- */
  const seg = $('#seg'), frame = $('.count-frame');
  if (seg && frame) {
    const segHome = [seg.parentNode, seg.nextSibling];
    const place = () => {
      if (PHONE.matches) { frame.appendChild(seg); seg.classList.add('seg-on-photo'); }
      else { seg.classList.remove('seg-on-photo'); segHome[0].insertBefore(seg, segHome[1]); }
    };
    PHONE.addEventListener('change', place); place();
  }

  /* ---------- reviews: one at a time, auto-advancing ---------- */
  const belt = $('#belt'), run = $('#beltRun');
  if (belt && run) {
    let timer = 0, hold = 0, dots = null;
    const cards = () => [...run.querySelectorAll('.rv:not([aria-hidden="true"])')];
    const idx = () => { const c = cards(), x = belt.scrollLeft; let best = 0, d = 1e9;
      c.forEach((el, i) => { const dd = Math.abs(el.offsetLeft - run.offsetLeft - x); if (dd < d) { d = dd; best = i; } }); return best; };
    const go = i => { const c = cards(); if (!c.length) return; const el = c[(i + c.length) % c.length];
      belt.scrollTo({ left: el.offsetLeft - run.offsetLeft, behavior: 'smooth' }); };
    const mark = () => { if (!dots) return; const i = idx(); [...dots.children].forEach((d, k) => d.setAttribute('aria-current', k === i ? 'true' : 'false')); };
    const tick = () => { if (Date.now() < hold || document.hidden) return; const r = belt.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return; go(idx() + 1); };
    const pause = () => { hold = Date.now() + 9000; };
    const start = () => {
      stop();
      if (!PHONE.matches || matchMedia('(prefers-reduced-motion:reduce)').matches) return;
      if (!dots) {
        dots = document.createElement('div'); dots.className = 'rv-dots'; dots.setAttribute('aria-hidden', 'true');
        dots.innerHTML = cards().map(() => '<i></i>').join('');
        belt.after(dots);
      }
      timer = setInterval(tick, 5000);
    };
    const stop = () => { clearInterval(timer); timer = 0; };
    ['touchstart', 'pointerdown', 'wheel', 'focusin'].forEach(ev => belt.addEventListener(ev, pause, { passive: true }));
    belt.addEventListener('scroll', () => requestAnimationFrame(mark), { passive: true });
    PHONE.addEventListener('change', () => { if (!PHONE.matches && dots) { dots.remove(); dots = null; } start(); });
    start(); mark();
  }
  /* ---------- v1124 (Chris): shop cards, one product per screen ----------
     Phones: every store photo swipes inside the card (arrows + count), with the
     product's own description, options, price and Add To Cart in view. */
  const grid = $('#grid');
  const esc = t => String(t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  if (grid && typeof PX !== 'undefined' && typeof byH !== 'undefined') {
    const build = c => {
      if (c._m) return; const h = c.dataset.h, x = PX[h], p = byH[h], fig = $('.c-fig', c); if (!p || !fig) return;
      c._m = 1; c.classList.add('m-pcard');
      const imgs = (x && x.imgs.length) ? x.imgs : p.imgs, n = imgs.length;  /* v1125: product shots first, then the product on a vehicle */
      const g = document.createElement('div'); g.className = 'm-gal';
      g.innerHTML = `<div class="m-track">${imgs.map((m, i) => `<img src="${IMG(m)}" alt="${esc(p.name)}, photo ${i + 1} of ${n}" loading="lazy" draggable="false">`).join('')}</div>`
        + (n > 1 ? `<button type="button" class="m-arr m-prev" aria-label="Previous photo"><i aria-hidden="true"></i></button><button type="button" class="m-arr m-next" aria-label="Next photo"><i aria-hidden="true"></i></button><span class="m-count" aria-hidden="true">1 / ${n}</span>` : '');
      fig.before(g);
      const tr = $('.m-track', g), cnt = $('.m-count', g);
      const at = () => Math.round(tr.scrollLeft / tr.clientWidth);
      const go = i => tr.scrollTo({ left: Math.max(0, Math.min(n - 1, i)) * tr.clientWidth, behavior: 'smooth' });
      if (n > 1) {
        $('.m-prev', g).onclick = () => go(at() - 1 < 0 ? n - 1 : at() - 1);
        $('.m-next', g).onclick = () => go(at() + 1 >= n ? 0 : at() + 1);
        tr.addEventListener('scroll', () => requestAnimationFrame(() => { cnt.textContent = `${at() + 1} / ${n}`; }), { passive: true });
      }
      /* v1130 (Chris + Baymard research): the card says what it is and what comes with it (one line + spec chips);
         the full description stays one tap away in Full Details. */
      const d = document.createElement('div'); d.className = 'm-desc m-desc-min';
      d.innerHTML = x ? `<button type="button" class="m-more">Full Details</button>` : '';
      const sp = $('.specs', c); (sp || $('.c-sub', c) || $('.c-name', c)).after(d);
      const more = $('.m-more', d); if (more) more.onclick = () => $('.c-name', c).click();
      /* load every photo in the strip once the card is near the screen, so a swipe never shows a blank frame */
      /* v1133: the second photo loads as the card nears the screen; the rest load the moment someone swipes or taps an arrow */
      const all = () => tr.querySelectorAll('img').forEach(im => im.loading = 'eager');
      if ('IntersectionObserver' in window) { const io = new IntersectionObserver(es => { if (es[0].isIntersecting) { const im = tr.querySelectorAll('img')[1]; if (im) im.loading = 'eager'; io.disconnect(); } }, { rootMargin: '300px' }); io.observe(c); }
      tr.addEventListener('pointerdown', all, { once: true }); tr.addEventListener('scroll', all, { once: true, passive: true }); g.querySelectorAll('.m-arr').forEach(b => b.addEventListener('click', all, { once: true }));
    };
    const all = () => [...grid.querySelectorAll('.card')].forEach(build);  /* v1128: every width, not just phones */
    PHONE.addEventListener('change', all); all();
    new MutationObserver(all).observe(grid, { childList: true });
  }

  /* ---------- v1134 (Chris): the site reads the screen it's on and sizes itself to it ----------
     <html data-screen> is phone, tablet, laptop or wide (from width, height and touch), and updates on resize,
     rotation and window moves. Product cards: each whole card (photos, name, options, price, Add To Cart) fits
     between the bottom of the ITM Customs header and the bottom of the screen. The words keep their size; the photo
     box takes the height that's left, never taller than square. */
  const root = document.documentElement, hdr = document.getElementById('nav');
  const screenKind = () => {
    const W = innerWidth, H = innerHeight, touch = matchMedia('(pointer:coarse)').matches;
    return W < 600 ? 'phone' : (W < 1100 || (touch && W < 1400)) ? 'tablet' : (W >= 1800 ? 'wide' : 'laptop');
  };
  let fitRaf = 0;
  const fitCards = () => {
    fitRaf = 0;
    const kind = screenKind(); if (root.dataset.screen !== kind) root.dataset.screen = kind;
    if (!grid) return;
    const cards = [...grid.querySelectorAll('.card.m-pcard')].filter(c => c.offsetParent);
    if (!cards.length) return;
    const H = innerHeight, hb = hdr ? hdr.getBoundingClientRect().height : 0;  /* the header's own height: once you scroll to the shop it sits at the top */
    const room = H - hb - (kind === 'phone' ? 12 : 20);              /* visual px between the header and the screen bottom */
    let need = 0, scale = 1, w = 0;
    cards.forEach(c => {
      const g = c.querySelector('.m-gal'), r = c.getBoundingClientRect(), gr = g.getBoundingClientRect();
      need = Math.max(need, r.height - gr.height);                    /* everything in the card except the photo */
      if (g.offsetHeight) scale = gr.height / g.offsetHeight;          /* visual px per CSS px (big screens zoom the page) */
      w = Math.max(w, g.offsetWidth);
    });
    const cap = kind === 'phone' ? w * 0.8 : w;                        /* phones 5:4, everything else up to square */
    const px = Math.round(Math.max(150, Math.min(cap, (room - need) / scale)));
    grid.style.setProperty('--gal-h', px + 'px');
    /* second pass: text can re-wrap once the photo changes, so correct by what is actually on screen */
    const tall = Math.max(...cards.map(c => c.getBoundingClientRect().height));
    const px2 = Math.round(Math.max(150, Math.min(cap, px + (room - tall) / scale)));
    if (Math.abs(px2 - px) > 2) grid.style.setProperty('--gal-h', px2 + 'px');
  };
  const queueFit = () => { if (!fitRaf) fitRaf = setTimeout(fitCards, 60); };
  addEventListener('resize', queueFit); addEventListener('orientationchange', queueFit); addEventListener('pageshow', queueFit);
  if (window.visualViewport) visualViewport.addEventListener('resize', queueFit);
  if (grid) { new MutationObserver(queueFit).observe(grid, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
    if ('ResizeObserver' in window) new ResizeObserver(queueFit).observe(grid); }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(queueFit);
  queueFit();

  /* ---------- v1124 (Chris): RGBW photo arrows + auto-advance ---------- */
  const sw = [...document.querySelectorAll('.feat-rgbw .swatches button')], media = $('.feat-rgbw .feat-media');
  if (sw.length && media) {
    let hold = 0;
    const cur = () => Math.max(0, sw.findIndex(b => b.classList.contains('on')));
    const to = i => { const b = sw[(i + sw.length) % sw.length]; b.onclick && b.onclick(); };
    media.insertAdjacentHTML('beforeend', '<button type="button" class="m-arr m-prev" aria-label="Previous color"><i aria-hidden="true"></i></button><button type="button" class="m-arr m-next" aria-label="Next color"><i aria-hidden="true"></i></button>');
    $('.m-prev', media).onclick = () => { hold = Date.now() + 12000; to(cur() - 1); };
    $('.m-next', media).onclick = () => { hold = Date.now() + 12000; to(cur() + 1); };
    sw.forEach(b => b.addEventListener('click', () => { hold = Date.now() + 12000; }));
    if (!matchMedia('(prefers-reduced-motion:reduce)').matches) setInterval(() => {
      if (Date.now() < hold || document.hidden) return; const r = media.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return; to(cur() + 1);
    }, 3500);
  }
  /* ---------- v1126 (Chris): phone gallery shows 6 photos side by side, then See More ---------- */
  const gal = document.querySelector('#gallery .wrap'), blocks = gal ? [...gal.querySelectorAll(':scope > .mosaic, :scope > .mosaic-2')] : [];
  if (blocks.length) {
    const box = document.createElement('div'); box.className = 'g-grid';
    const btn = document.createElement('button'); btn.type = 'button'; btn.className = 'see-more g-more'; btn.setAttribute('aria-expanded', 'false');
    const figs = () => [...box.querySelectorAll('figure')];
    let open = false;
    const paint = () => { const f = figs(), n = f.length - 6;
      f.forEach((x, i) => x.classList.toggle('g-clip', !open && i >= 6));
      btn.innerHTML = open ? '<b>Show Less</b><span></span>' : `<b>See More Photos</b><span>${n} more</span>`;
      btn.setAttribute('aria-expanded', open); };
    const place = () => {
      if (PHONE.matches && !box.isConnected) { blocks[0].before(box); blocks.forEach(b => box.appendChild(b)); box.after(btn); paint(); }
      else if (!PHONE.matches && box.isConnected) { blocks.forEach(b => box.before(b)); box.remove(); btn.remove(); figs().forEach(x => x.classList.remove('g-clip')); blocks.forEach(b => b.querySelectorAll('figure').forEach(x => x.classList.remove('g-clip'))); }
    };
    btn.addEventListener('click', () => { const y0 = btn.getBoundingClientRect().top; open = !open; paint();
      if (!open) scrollBy({ top: btn.getBoundingClientRect().top - y0, behavior: 'instant' }); });
    PHONE.addEventListener('change', place); place();
  }
})();

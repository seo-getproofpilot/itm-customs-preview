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
})();

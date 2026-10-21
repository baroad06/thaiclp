(function () {
  document.querySelectorAll('[data-carousel]').forEach(function (root) {
    var slides = Array.from(root.querySelectorAll('[data-carousel-slide]'));
    if (slides.length < 2) return;
    var dots = Array.from(root.querySelectorAll('[data-carousel-dot]'));
    var toggle = root.querySelector('[data-carousel-toggle]');
    var motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    var index = 0;
    var paused = motion.matches;
    var hovering = false;
    var timer;
    function schedule() {
      window.clearInterval(timer);
      if (!paused && !hovering && !document.hidden) timer = window.setInterval(function () { show(index + 1); }, 6000);
      root.querySelector('[data-carousel-toggle-label]').textContent = paused ? root.dataset.playLabel : root.dataset.pauseLabel;
      root.querySelector('[data-carousel-toggle-icon]').textContent = paused ? '▶' : 'Ⅱ';
      root.querySelector('[data-carousel-slides]').setAttribute('aria-live', paused ? 'polite' : 'off');
    }
    function show(next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, i) { slide.hidden = i !== index; });
      dots.forEach(function (dot, i) { if (i === index) dot.setAttribute('aria-current', 'true'); else dot.removeAttribute('aria-current'); });
      root.querySelector('[data-carousel-current]').textContent = String(index + 1).padStart(2, '0');
    }
    function manual(next) { paused = true; show(next); schedule(); }
    root.querySelector('[data-carousel-previous]').addEventListener('click', function () { manual(index - 1); });
    root.querySelector('[data-carousel-next]').addEventListener('click', function () { manual(index + 1); });
    dots.forEach(function (dot, i) { dot.addEventListener('click', function () { manual(i); }); });
    toggle.addEventListener('click', function () { paused = !paused; schedule(); });
    root.addEventListener('focusin', function (event) { if (event.target !== toggle) { paused = true; schedule(); } });
    root.addEventListener('mouseenter', function () { hovering = true; schedule(); });
    root.addEventListener('mouseleave', function () { hovering = false; schedule(); });
    root.addEventListener('keydown', function (event) {
      if (!event.target.closest('[data-carousel-controls]')) return;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); manual(index + (event.key === 'ArrowRight' ? 1 : -1)); }
    });
    document.addEventListener('visibilitychange', schedule);
    motion.addEventListener('change', function (event) { if (event.matches) { paused = true; schedule(); } });
    root.querySelector('[data-carousel-controls]').hidden = false;
    show(0);
    schedule();
  });
}());

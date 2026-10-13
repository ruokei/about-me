(() => {
  const elements = [...document.querySelectorAll('[data-hyper]')];
  if (!elements.length) return;

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const running = new Map();

  function restore(element) {
    const frame = running.get(element);
    if (frame) cancelAnimationFrame(frame);
    running.delete(element);
    element.querySelector('.hyper-glyphs').textContent = element.dataset.hyper;
  }

  function animate(element) {
    if (reducedMotion.matches) return;
    restore(element);
    const text = [...element.dataset.hyper];
    const visual = element.querySelector('.hyper-glyphs');
    const duration = 700;
    let started;
    let lastPaint = -Infinity;

    function frame(now) {
      if (started === undefined) started = now;
      const progress = Math.min((now - started) / duration, 1);
      if (now - lastPaint >= 32 || progress === 1) {
        const settled = Math.floor(progress * text.length);
        visual.textContent = text.map((character, index) => {
          if (index < settled || !/[A-Za-z]/.test(character)) return character;
          return alphabet[Math.floor(Math.random() * alphabet.length)];
        }).join('');
        lastPaint = now;
      }
      if (progress < 1) {
        running.set(element, requestAnimationFrame(frame));
      } else {
        restore(element);
      }
    }

    running.set(element, requestAnimationFrame(frame));
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        const delay = [...entry.target.parentElement.querySelectorAll('[data-hyper]')].indexOf(entry.target) * 120;
        setTimeout(() => animate(entry.target), delay);
      });
    }, { threshold: 0.7 });
    elements.forEach((element) => observer.observe(element));
  }

  elements.forEach((element) => {
    element.addEventListener('pointerenter', () => {
      if (finePointer.matches) animate(element);
    });
  });
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) elements.forEach(restore);
  });
})();

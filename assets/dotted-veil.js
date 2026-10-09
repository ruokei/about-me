// Static-site adaptation of the Dotted Veil halftone background:
// https://21st.dev/@serafimcloud/components/dotted-veil (MIT)
(() => {
  const canvas = document.getElementById("dotted-veil");
  if (!canvas) return;
  const ctx = canvas.getContext("2d", { alpha: false });
  if (!ctx) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let width = 0;
  let height = 0;
  let ratio = 1;
  let frame = 0;
  let lastDraw = 0;

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const smoothstep = (a, b, value) => {
    const t = clamp((value - a) / (b - a), 0, 1);
    return t * t * (3 - 2 * t);
  };

  function resize() {
    const bounds = canvas.getBoundingClientRect();
    width = Math.max(1, Math.round(bounds.width));
    height = Math.max(1, Math.round(bounds.height));
    ratio = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    draw(0);
  }

  function draw(time) {
    ctx.fillStyle = "#02010a";
    ctx.fillRect(0, 0, width, height);

    const wash = ctx.createRadialGradient(width * .73, height * .48, 0, width * .73, height * .48, width * .62);
    wash.addColorStop(0, "#241957");
    wash.addColorStop(.53, "#0d0b32");
    wash.addColorStop(1, "#02010a");
    ctx.fillStyle = wash;
    ctx.fillRect(0, 0, width, height);

    const spacing = width < 650 ? 14 : 17;
    const seconds = time * .001;
    for (let y = spacing / 2; y < height; y += spacing) {
      for (let x = spacing / 2; x < width; x += spacing) {
        const nx = x / width;
        const ny = y / height;
        const distance = Math.hypot((nx - .73) / .63, (ny - .48) / .64);
        const envelope = Math.max(0, 1 - distance);
        const wave = Math.sin(x * .011 + seconds * .46 + Math.sin(y * .006 + seconds * .19) * 1.3);
        const ripple = Math.cos(y * .016 - seconds * .31 + x * .004);
        const light = clamp(.48 + wave * .28 + ripple * .18, 0, 1);
        const leftFade = .18 + .82 * smoothstep(.12, .53, nx);
        const alpha = clamp((.09 + envelope * (.31 + light * .25)) * leftFade, 0, .58);
        const radius = .65 + envelope * (.85 + light * 1.15);

        ctx.fillStyle = light > .68
          ? `rgba(145,107,191,${alpha})`
          : `rgba(61,44,141,${alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  function tick(time) {
    if (time - lastDraw >= 33) {
      draw(time);
      lastDraw = time;
    }
    frame = requestAnimationFrame(tick);
  }

  function updateMotion() {
    cancelAnimationFrame(frame);
    draw(0);
    if (!reducedMotion.matches && !document.hidden) frame = requestAnimationFrame(tick);
  }

  if (typeof ResizeObserver === "function") {
    new ResizeObserver(resize).observe(canvas);
  } else {
    window.addEventListener("resize", resize);
  }
  reducedMotion.addEventListener("change", updateMotion);
  document.addEventListener("visibilitychange", updateMotion);
  resize();
  updateMotion();
})();

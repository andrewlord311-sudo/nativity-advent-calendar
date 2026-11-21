// Shared helpers for the surprises. Objects are drawn around their own origin (0,0 = bottom centre) inside a wrapper that
// is moved with CSS, so they can slide, tip and squash. Everything uses the crayon globals (P, ell, poly, cr, ln, dot, C).
export function toolkit(api) {
  const layer = (html, seed = 1) => {
    const w = document.createElementNS(NS, "g"), g = document.createElementNS(NS, "g");
    w.appendChild(g); api.draw().appendChild(w);
    const h = crayonMount(g, html, seed); crayonFrame(h, crayonEnd(h));
    w.g = g; return w;
  };
  const place = (w, x, y, rot = 0, sx = 1, sy = 1, ms = 0, ease = "ease-in-out") => {
    w.style.transition = ms ? `transform ${ms}ms ${ease}` : "none";
    w.style.transform = `translate(${x}px, ${y}px) rotate(${rot}deg) scale(${sx}, ${sy})`;
  };
  const bump = (el, cls = "bounce") => { el.classList.remove(cls); void el.getBBox(); el.classList.add(cls); };
  const say = (txt, x, y, size = 110, col = "#d8302a") => api.top().insertAdjacentHTML("beforeend",
    `<text x="${x}" y="${y}" font-size="${size}" text-anchor="middle" fill="${col}" stroke="#fff" stroke-width="12" paint-order="stroke" class="elfSay">${txt}</text>`);
  const press = handler => new Promise(resolve => {   // resolves when the handler returns true
    const svg = api.svg();
    const f = e => { if (handler(api.svgPoint(e), e) === true) { svg.removeEventListener("pointerdown", f); resolve(); } };
    svg.addEventListener("pointerdown", f);
  });
  const near = (p, x, y, r) => Math.hypot(p.x - x, p.y - y) < r;
  const raw = (svg) => api.top().insertAdjacentHTML("beforeend", svg);
  const frames = (fn, el) => new Promise(resolve => {   // calls fn(dt seconds) each frame until it returns true; stops if the scene is gone
    let last = performance.now();
    const tick = now => {
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      if (el && !el.isConnected) return resolve();
      if (fn(dt) === true) return resolve();
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
  return { layer, place, bump, say, press, near, raw, frames };
}

export const gift = (w, h, col) => P(poly([-w / 2, -h], [w / 2, -h], [w / 2, 0], [-w / 2, 0]), { s: C.ink, f: col, w: 7 })
  + P(ln([0, -h], [0, 0]), { s: "#ffd23f", w: 12 }) + P(ln([-w / 2, -h / 2], [w / 2, -h / 2]), { s: "#ffd23f", w: 12 })
  + P(ell(-18, -h - 14, 20, 14), { s: C.ink, f: "#ffd23f", w: 5 }) + P(ell(18, -h - 14, 20, 14), { s: C.ink, f: "#ffd23f", w: 5 });
export const wheel = (x, y, r) => P(ell(x, y, r, r), { s: C.ink, f: "#2b2b2b", w: 8 }) + P(ell(x, y, r * 0.5, r * 0.5), { s: C.ink, f: "#c9c9c9", w: 5 }) + dot(x, y, r * 0.12);

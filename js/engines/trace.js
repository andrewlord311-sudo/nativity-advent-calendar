// Trace a path with your finger (windows 1 and 7). A dotted guide, a green dot to start at, and a ghost finger
// that shows the way until the child touches. The crayon line only grows forwards and is forgiving: a 4-year-old's
// finger can wander well off the line. step: { scene, path: [[x,y]...], prompt, done(): scene drawn when finished,
// doneCaption }

const TOL = 85;            // how far (in scene units) a finger can be from the line and still count
const AHEAD = 30;          // how many samples ahead a finger can jump (so you can't skip across the shape)

function resample(pts, gap = 10) {
  const out = [pts[0]];
  for (let i = 1; i < pts.length; i++) {
    const [ax, ay] = pts[i - 1], [bx, by] = pts[i], L = Math.hypot(bx - ax, by - ay), n = Math.max(1, Math.round(L / gap));
    for (let k = 1; k <= n; k++) out.push([ax + (bx - ax) * k / n, ay + (by - ay) * k / n]);
  }
  return out;
}

export async function trace(step, api) {
  api.showScene(step.scene(), step.seed || 1);
  const pts = resample(step.path), last = pts.length - 1;
  const d = "M" + pts.map(p => p.map(v => v.toFixed(1)).join(",")).join(" L");
  const draw = api.draw(), top = api.top();
  draw.innerHTML = `<path d="${d}" fill="none" stroke="#ffffff" stroke-width="30" stroke-linecap="round" stroke-linejoin="round" opacity="0.75"/>
    <path d="${d}" fill="none" stroke="#9a9a9a" stroke-width="12" stroke-dasharray="2 30" stroke-linecap="round"/>
    <path class="ink" d="${d}" fill="none" stroke="#e8392c" stroke-width="20" stroke-linecap="round" stroke-linejoin="round" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="1"/>`;
  top.innerHTML = `<circle class="startdot" cx="${pts[0][0]}" cy="${pts[0][1]}" r="30" fill="#43b04a" stroke="#fff" stroke-width="8"/>
    <text class="ghost" font-size="110" text-anchor="middle">👆</text>`;
  const ink = draw.querySelector(".ink"), ghost = top.querySelector(".ghost");
  api.caption(step.prompt);
  api.say("yourTurn");

  // the ghost finger walks the first third of the path, again and again, until a finger goes down
  let demo = true;
  const g0 = performance.now();
  const walk = now => {
    if (!demo) { ghost.remove(); return; }
    // the first frame's timestamp can be a moment before g0, so clamp at 0
    const u = (Math.max(0, now - g0) / 2600) % 1, p = pts[Math.floor(u * last * 0.35)];
    ghost.setAttribute("x", p[0] + 28); ghost.setAttribute("y", p[1] + 95);
    ghost.style.opacity = u > 0.85 ? (1 - u) / 0.15 : 1;
    requestAnimationFrame(walk);
  };
  requestAnimationFrame(walk);

  let cur = 0, down = false, lastSound = 0, cleanup = () => {};
  const svg = api.svg();
  try {
  await api.until(new Promise(resolve => {
    const move = e => {
      if (!down) return;
      const p = api.svgPoint(e);
      let best = -1;
      for (let i = cur; i <= Math.min(last, cur + AHEAD); i++) if (Math.hypot(pts[i][0] - p.x, pts[i][1] - p.y) < TOL) best = i;
      if (best > cur) {
        cur = best;
        ink.setAttribute("stroke-dashoffset", String(1 - cur / last));
        const now = performance.now();
        if (now - lastSound > 90) { api.sfx.crayon(); lastSound = now; }
        if (cur >= last - 2) { cleanup(); resolve(); }
      }
    };
    const start = e => { down = true; demo = false; top.querySelector(".startdot")?.classList.add("used"); svg.setPointerCapture?.(e.pointerId); move(e); };
    const end = () => { down = false; };
    cleanup = () => { svg.removeEventListener("pointerdown", start); svg.removeEventListener("pointermove", move); svg.removeEventListener("pointerup", end); svg.removeEventListener("pointercancel", end); };
    svg.addEventListener("pointerdown", start); svg.addEventListener("pointermove", move);
    svg.addEventListener("pointerup", end); svg.addEventListener("pointercancel", end);
  }));
  } finally { cleanup(); demo = false; }

  draw.innerHTML = ""; top.innerHTML = "";
  if (step.done) api.showScene(step.done(), (step.seed || 1) + 1);
  api.sfx.sparkle(); api.say("brilliant");
  await api.caption(step.doneCaption || "Brilliant!");
  await api.next();
}

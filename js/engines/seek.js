// Find the hidden things in a busy picture (windows 1★, 9, 16, 17). The things to find are shown in colour, with
// their names, in a tray under the picture. A wrong tap just shows a "?". If nothing has been found for a while, the
// next thing twinkles as a hint. step: { scene, prompt, items: [{ id, label, at: [x,y], r, icon(): svg markup in a
// 200 x 200 box centred on 0,0, sticker(): optional svg drawn on top of the picture (for chibi animals hiding in it) }] }

const HINT_AFTER = 15000;   // ms without a find before the next thing twinkles

// crayon strokes ask for their colour with data-fill (the scribble is added when a scene is mounted);
// a tray icon is never mounted, so give it a plain solid fill instead
const solid = svg => svg.replace(/fill="none"([^>]*?)data-fill="([^"]+)"/g, 'fill="$2"$1');

export async function seek(step, api) {
  api.showScene(step.scene(), step.seed || 1);
  const top = api.top(), tray = api.tray();
  top.innerHTML = step.items.filter(it => it.sticker).map(it => it.sticker()).join("")
    + `<g class="rings"></g><g class="hints"></g><text class="nope" font-size="90" text-anchor="middle" opacity="0">?</text>`;
  tray.innerHTML = step.items.map(it => `<div class="slot" data-id="${it.id}"><svg viewBox="-100 -100 200 200">${solid(it.icon())}</svg><span>${it.label || ""}</span></div>`).join("");
  api.caption(step.prompt);
  api.say("letsTry");

  const found = new Set(), svg = api.svg(), rings = top.querySelector(".rings"), hints = top.querySelector(".hints"), nope = top.querySelector(".nope");
  let tap, timer, lastFind = performance.now();
  const hint = () => {
    if (performance.now() - lastFind < HINT_AFTER || hints.firstChild) return;
    const next = step.items.find(it => !found.has(it.id));
    if (next) hints.innerHTML = `<circle class="hint" cx="${next.at[0]}" cy="${next.at[1]}" r="${(next.r || 90) * 0.8}" fill="#fff6a8" opacity="0.6"/>`;
  };
  try {
    await api.until(new Promise(resolve => {
      tap = e => {
        const p = api.svgPoint(e);
        const hit = step.items.find(it => !found.has(it.id) && Math.hypot(it.at[0] - p.x, it.at[1] - p.y) < (it.r || 90));
        if (!hit) {
          nope.setAttribute("x", p.x); nope.setAttribute("y", p.y);
          nope.classList.remove("show"); void nope.getBBox(); nope.classList.add("show");
          return;
        }
        found.add(hit.id);
        lastFind = performance.now(); hints.innerHTML = "";
        api.sfx.chime();
        rings.insertAdjacentHTML("beforeend", `<circle class="ring" cx="${hit.at[0]}" cy="${hit.at[1]}" r="${(hit.r || 90) * 0.95}" fill="none" stroke="#f7d117" stroke-width="12" stroke-dasharray="7 14" stroke-linecap="round"/>`);
        tray.querySelector(`[data-id="${hit.id}"]`).classList.add("found");
        if (found.size === step.items.length) resolve();
      };
      svg.addEventListener("pointerdown", tap);
      timer = setInterval(hint, 1000);
    }));
  } finally { svg.removeEventListener("pointerdown", tap); clearInterval(timer); }
  api.sfx.fanfare(); api.say("gotIt");
  await api.caption(step.doneCaption || "You found them all!");
  await api.wait(400);
}

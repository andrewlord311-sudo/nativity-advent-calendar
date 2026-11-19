// Drag things into a bag (window 5). Items are crayon pictures in the scene; drop one on the target to pack it. step: { scene,
// items: [{ kind, art(): scene string, at: [x, y], r }], need: { kind: count }, target: { at, r }, prompt, doneCaption, silly(kind) }
// A kind that is not needed (or already full) bounces back with a wobble: nothing can be failed.

export async function drag(step, api) {
  api.showScene(step.scene(), step.seed || 1);
  const top = api.top(), svg = api.svg();
  top.innerHTML = step.items.map((it, i) => `<g class="it" data-i="${i}" style="cursor:grab"><g class="art" filter="url(#kid-still)"></g><circle cx="${it.at[0]}" cy="${it.at[1]}" r="${it.r || 80}" fill="#fff" opacity="0"/></g>`).join("") + `<text class="nope" font-size="90" text-anchor="middle" opacity="0">✋</text>`;
  const els = [...top.querySelectorAll(".it")];
  els.forEach((g, i) => { const h = crayonMount(g.querySelector(".art"), step.items[i].art(), 90 + i); crayonFrame(h, crayonEnd(h)); });
  const zones = step.zones;   // optional: [{ kind, at, r }]: drop each item on the zone of its own kind (sorting, or snapping pieces into place)
  if (zones && zones.some(z => z.ghost)) {   // a faint picture of each piece where it belongs, so it is obvious where everything goes
    top.insertAdjacentHTML("afterbegin", `<g class="ghosts" opacity="${step.ghostOpacity || 0.32}" style="pointer-events:none" filter="url(#kid-still)"></g>`);
    const gg = top.querySelector(".ghosts"); zones.forEach((z, i) => { if (!z.ghost) return; const g = document.createElementNS("http://www.w3.org/2000/svg", "g"); gg.appendChild(g); const h = crayonMount(g, z.ghost(), 300 + i); crayonFrame(h, crayonEnd(h)); });
    if (zones.some(z => z.ring)) top.insertAdjacentHTML("afterbegin", zones.filter(z => z.ring).map(z => `<circle cx="${z.at[0]}" cy="${z.at[1] - (z.ringUp || 0)}" r="${z.ring}" fill="#ffe680" fill-opacity=".28" stroke="#f7a800" stroke-width="7" stroke-dasharray="14 11" style="pointer-events:none"/>`).join(""));
  }
  if (zones) top.insertAdjacentHTML("afterbegin", zones.filter(z => !z.ghost).map(z => `<circle cx="${z.at[0]}" cy="${z.at[1]}" r="${z.r}" fill="${z.fill || "none"}" fill-opacity=".25" stroke="${z.stroke || "#f7a800"}" stroke-width="9" stroke-dasharray="16 12"/>${z.label ? `<text x="${z.at[0]}" y="${z.at[1] + z.r + 46}" font-size="46" text-anchor="middle" fill="#2b2b2b">${z.label}</text>` : ""}`).join(""));
  const left = zones ? {} : { ...step.need };
  if (zones) step.items.forEach(it => { left[it.kind] = (left[it.kind] || 0) + 1; });
  const total = Object.values(left).reduce((a, b) => a + b, 0); let packed = 0;
  const nope = top.querySelector(".nope");
  api.caption(step.prompt); api.say("yourTurn");
  let cur = null, off = null;
  const down = e => { const g = e.target.closest(".it"); if (!g || g.dataset.gone) return; const p = api.svgPoint(e); cur = { g, i: +g.dataset.i, sx: p.x, sy: p.y }; g.style.transition = "none"; svg.setPointerCapture?.(e.pointerId); };
  const move = e => { if (!cur) return; const p = api.svgPoint(e); cur.g.setAttribute("transform", `translate(${p.x - cur.sx} ${p.y - cur.sy})`); };
  const back = g => { g.style.transition = "transform .35s cubic-bezier(.3,1.6,.5,1)"; g.setAttribute("transform", "translate(0 0)"); };
  try {
    await api.until(new Promise(resolve => {
      const up = e => {
        if (!cur) return; const { g, i } = cur; cur = null; const it = step.items[i], p = api.svgPoint(e);
        const own = zones ? zones.find(z => z.kind === it.kind) : null;
        const inArea = zones && step.dropArea && p.x >= step.dropArea[0] && p.x <= step.dropArea[2] && p.y >= step.dropArea[1] && p.y <= step.dropArea[3];   // a forgiving drop: anywhere in this box sends the piece to its own place
        const zone = inArea && own ? own : zones ? ((own && Math.hypot(p.x - own.at[0], p.y - own.at[1]) < own.r * 1.4) ? own : zones.find(z => Math.hypot(p.x - z.at[0], p.y - z.at[1]) < z.r)) : null;
        const inside = zones ? !!zone : Math.hypot(p.x - step.target.at[0], p.y - step.target.at[1]) < step.target.r;
        if (inside && (zones ? zone.kind === it.kind : left[it.kind] > 0)) {
          left[it.kind]--; packed++; g.dataset.gone = "1"; api.sfx.chime();
          if (step.snap) g.setAttribute("transform", `translate(${zone.at[0] - it.at[0]} ${zone.at[1] - it.at[1]})`); else { g.style.transition = "opacity .3s"; g.style.opacity = "0"; }
          if (step.count) api.caption(`${packed}`, { big: true });
          if (packed === total) resolve();
        } else if (inside) {   // not needed: it bounces out
          api.sfx.wrong(); nope.setAttribute("x", p.x); nope.setAttribute("y", p.y - 60); nope.classList.remove("show"); void nope.getBBox(); nope.classList.add("show"); back(g);
        } else back(g);
      };
      svg.addEventListener("pointerdown", down); svg.addEventListener("pointermove", move); svg.addEventListener("pointerup", up); svg.addEventListener("pointercancel", up);
      off = () => { svg.removeEventListener("pointerdown", down); svg.removeEventListener("pointermove", move); svg.removeEventListener("pointerup", up); svg.removeEventListener("pointercancel", up); };
    }));
  } finally { off && off(); }
  api.sfx.fanfare();
  await api.caption(step.doneCaption || "All packed!");
  await api.wait(600);
}

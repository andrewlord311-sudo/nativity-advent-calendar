// Wrap the gifts (window 18). Tap a gift to pick it, then a paper colour in the tray: it is wrapped with a ribbon and bow.
// step: { scene, boxes: [{ at, w, h, label, icon }], papers: [colours], prompt, doneCaption }

export async function wrap(step, api) {
  api.showScene(step.scene(), step.seed || 1);
  const top = api.top(), tray = api.tray(), svg = api.svg();
  const box = (b, i, fill) => `<g class="gift" data-i="${i}" style="cursor:pointer"><rect x="${b.at[0] - b.w / 2}" y="${b.at[1] - b.h / 2}" width="${b.w}" height="${b.h}" rx="12" fill="${fill || "#c9a66b"}" stroke="#2b2b2b" stroke-width="8"/>
    ${fill ? `<rect x="${b.at[0] - 14}" y="${b.at[1] - b.h / 2}" width="28" height="${b.h}" fill="#fff" stroke="#2b2b2b" stroke-width="5"/><circle cx="${b.at[0] - 26}" cy="${b.at[1] - b.h / 2 - 18}" r="24" fill="#fff" stroke="#2b2b2b" stroke-width="5"/><circle cx="${b.at[0] + 26}" cy="${b.at[1] - b.h / 2 - 18}" r="24" fill="#fff" stroke="#2b2b2b" stroke-width="5"/>` : `<text x="${b.at[0]}" y="${b.at[1] + 30}" font-size="90" text-anchor="middle">${b.icon}</text>`}
    <text x="${b.at[0]}" y="${b.at[1] + b.h / 2 + 56}" font-size="44" text-anchor="middle" fill="#2b2b2b">${b.label}</text></g>`;
  top.innerHTML = step.boxes.map((b, i) => box(b, i)).join("");
  tray.innerHTML = step.papers.map(c => `<button class="swatch" data-c="${c}" style="background:${c}" aria-label="paper"></button>`).join("");
  api.caption(step.prompt); api.say("letsTry");
  let sel = 0; const wrapped = new Set();
  const hilite = () => top.querySelectorAll(".gift").forEach((g, i) => g.setAttribute("opacity", wrapped.has(i) || i === sel ? "1" : "0.65"));
  hilite();
  await api.until(new Promise(resolve => {
    top.onpointerdown = e => { const g = e.target.closest(".gift"); if (g && !wrapped.has(+g.dataset.i)) { sel = +g.dataset.i; api.sfx.tap(); hilite(); } };
    tray.onclick = e => {
      const b = e.target.closest(".swatch"); if (!b || wrapped.has(sel)) return;
      wrapped.add(sel); api.sfx.chime();
      top.querySelectorAll(".gift")[sel].outerHTML = box(step.boxes[sel], sel, b.dataset.c);
      const next = step.boxes.findIndex((_, i) => !wrapped.has(i)); if (next < 0) resolve(); else { sel = next; }
      hilite();
    };
  }));
  top.onpointerdown = null; tray.onclick = null; tray.innerHTML = "";
  api.sfx.fanfare();
  await api.caption(step.doneCaption || "All wrapped!", { big: true });
  await api.wait(700);
}

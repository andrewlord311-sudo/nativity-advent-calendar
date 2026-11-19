// Spot the differences (window 22). Two pictures stacked: the top is the original and the bottom has things changed.
// step: { scene, regions: [{ at: [x, y], r }] (centres in the BOTTOM picture's scene coordinates), prompt, doneCaption }. Tapping either picture counts.

export async function diff(step, api) {
  api.showScene(step.scene(), step.seed || 1);
  const top = api.top(), svg = api.svg();
  top.innerHTML = `<line x1="420" y1="540" x2="1500" y2="540" stroke="#fff" stroke-width="10"/><g class="rings"></g><text class="nope" font-size="90" text-anchor="middle" opacity="0">?</text>`;
  const rings = top.querySelector(".rings"), nope = top.querySelector(".nope");
  api.caption(`${step.prompt}`); api.say("letsTry");
  const found = new Set(); let tap;
  const tell = () => api.caption(`${step.prompt} (${found.size} of ${step.regions.length})`);
  tell();
  try {
    await api.until(new Promise(resolve => {
      tap = e => {
        const p = api.svgPoint(e), y2 = p.y < 540 ? p.y + 540 : p.y;
        const i = step.regions.findIndex((r, k) => !found.has(k) && Math.hypot(r.at[0] - p.x, r.at[1] - y2) < r.r);
        if (i < 0) { api.sfx.wrong(); nope.setAttribute("x", p.x); nope.setAttribute("y", p.y); nope.classList.remove("show"); void nope.getBBox(); nope.classList.add("show"); return; }
        found.add(i); api.sfx.chime();
        for (const dy of [0, -540]) rings.insertAdjacentHTML("beforeend", `<circle class="ring" cx="${step.regions[i].at[0]}" cy="${step.regions[i].at[1] + dy}" r="${step.regions[i].r}" fill="none" stroke="#e8392c" stroke-width="10"/>`);
        tell();
        if (found.size === step.regions.length) resolve();
      };
      svg.addEventListener("pointerdown", tap);
    }));
  } finally { svg.removeEventListener("pointerdown", tap); }
  api.sfx.fanfare();
  await api.caption(step.doneCaption || "You found them all!", { big: true });
  await api.wait(700);
}

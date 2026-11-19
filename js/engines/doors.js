// Knock on the doors (window 10). Tap a door to knock; it answers with a funny "no" (and sometimes a surprise); the last one opens.
// step: { scene, doors: [{ at, r, say, pop(): svg, last }], ordered, prompt, doneCaption }. With ordered, the doors carry numbers and must be knocked in order
// (a wrong door just wobbles). Without it, any order works; the door with `last` only opens once the others have been tried.

export async function doors(step, api) {
  api.showScene(step.scene(), step.seed || 1);
  const top = api.top(), svg = api.svg();
  top.innerHTML = step.doors.map((d, i) => `<g class="door2" data-i="${i}">${step.ordered ? `<circle cx="${d.at[0]}" cy="${d.at[1] - d.r - 40}" r="34" fill="#fff6c8" stroke="#2b2b2b" stroke-width="5"/><text x="${d.at[0]}" y="${d.at[1] - d.r - 28}" font-size="40" text-anchor="middle" fill="#2b2b2b">${d.num || i + 1}</text>` : ""}<circle cx="${d.at[0]}" cy="${d.at[1]}" r="${d.r}" fill="#fff" opacity="0"/></g>`).join("") + `<g class="pops"></g><g class="knocks"></g>`;
  const pops = top.querySelector(".pops"), knocks = top.querySelector(".knocks");
  api.caption(step.prompt); api.say("yourTurn");
  const done = new Set(); let tap, lockUntil = 0;
  try {
    await api.until(new Promise(resolve => {
      tap = async e => {
        if (performance.now() < lockUntil) return;   // give the answer time to be read before the next knock
        const p = api.svgPoint(e);
        const i = step.doors.findIndex((d, k) => !done.has(k) && Math.hypot(d.at[0] - p.x, d.at[1] - p.y) < d.r);
        if (i < 0) return;
        const d = step.doors[i], need = step.ordered ? done.size : (d.last ? step.doors.length - 1 : i);
        if (step.ordered ? (d.num || i + 1) !== done.size + 1 : (d.last && done.size < step.doors.length - 1)) { api.sfx.wrong(); return; }
        done.add(i); api.sfx.locked(); lockUntil = performance.now() + 2200;
        knocks.insertAdjacentHTML("beforeend", `<text class="elfSay" x="${d.at[0]}" y="${d.at[1] - d.r - 10}" font-size="64" text-anchor="middle" fill="#8a4a10" stroke="#fff" stroke-width="8" paint-order="stroke">knock knock!</text>`);
        if (d.pop) pops.insertAdjacentHTML("beforeend", `<g class="bounce">${d.pop()}</g>`);
        api.caption(d.say, { big: !!d.last });
        if (d.last) { api.sfx.sparkle(); resolve(); }
      };
      svg.addEventListener("pointerdown", tap);
    }));
  } finally { svg.removeEventListener("pointerdown", tap); }
  if (!step.keepLast) { await api.wait(900); await api.caption(step.doneCaption || "A place to stay!", { big: true }); await api.wait(500); }
}

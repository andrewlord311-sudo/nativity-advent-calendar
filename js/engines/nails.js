// Tap the nails in (window 3). Glowing spots; each tap drives a nail with a hammer and a BANG. When all are in the built thing
// appears. step: { scene, spots: [[x,y]...], built(): scene string, prompt, doneCaption }

export async function nails(step, api) {
  api.showScene(step.scene(), step.seed || 1);
  const top = api.top(), svg = api.svg(), draw = api.draw();
  top.innerHTML = step.spots.map(([x, y], i) => `<g class="spot" data-i="${i}"><circle class="startdot" cx="${x}" cy="${y}" r="${step.ring || 38}" fill="${step.ring ? "none" : "#ffe27a"}" stroke="${step.ring ? "#f7a800" : "#fff"}" stroke-width="${step.ring ? 10 : 7}" ${step.ring ? 'stroke-dasharray="14 12"' : ""}/></g>`).join("") + `<g class="bangs"></g>`;
  const bangs = top.querySelector(".bangs");
  // optional: each spot is an animal that stands until tapped, then lies down (step.arts: [{ up(), down() }])
  const artG = [];
  if (step.arts) step.arts.forEach((a, i) => { const g = document.createElementNS("http://www.w3.org/2000/svg", "g"); draw.appendChild(g); artG.push(g); const h = crayonMount(g, a.up(), 120 + i); crayonFrame(h, crayonEnd(h)); });
  api.caption(step.prompt); api.say("yourTurn");
  const done = new Set(); let tap;
  try {
    await api.until(new Promise(resolve => {
      tap = e => {
        const p = api.svgPoint(e);
        const i = step.spots.findIndex(([x, y], k) => !done.has(k) && (!step.ordered || k === done.size) && Math.hypot(x - p.x, y - p.y) < (step.tol || Math.max(110, (step.ring || 38) * 1.6)));
        if (i < 0) { api.sfx.wrong(); return; }
        done.add(i);
        const [x, y] = step.spots[i];
        if (step.arts) { const g = artG[i]; g.innerHTML = ""; const h = crayonMount(g, step.arts[i].down(), 140 + i); crayonFrame(h, crayonEnd(h)); g.setAttribute("class", "bounce"); }
        top.querySelector(`.spot[data-i="${i}"]`).innerHTML = step.spotDone ? step.spotDone(x, y, i) : `<rect x="${x - 7}" y="${y - 30}" width="14" height="60" rx="4" fill="#7b7f89" stroke="#2b2b2b" stroke-width="5"/>`;
        bangs.insertAdjacentHTML("beforeend", `<text class="elfSay" x="${x}" y="${y - 70}" font-size="80" text-anchor="middle" fill="#e8392c" stroke="#fff" stroke-width="9" paint-order="stroke">${step.words ? step.words[i] : step.word || "BANG!"}</text>`);
        step.sounds && step.sounds[i] ? api.sfx[step.sounds[i]]() : api.sfx.tap();
        if (done.size === step.spots.length) resolve();
      };
      svg.addEventListener("pointerdown", tap);
    }));
  } finally { svg.removeEventListener("pointerdown", tap); }
  top.innerHTML = step.dim ? `<rect x="420" y="0" width="1080" height="1080" fill="#0a1030" opacity="0.5" pointer-events="none"/>` : ""; api.sfx.fanfare(); if (step.finalSound) setTimeout(() => api.sfx[step.finalSound](), 500);
  if (step.built) { const h = crayonMount(draw, step.built(), 61); crayonFrame(h, crayonEnd(h)); }
  await api.caption(step.doneCaption || "Built!");
  await api.wait(600);
}

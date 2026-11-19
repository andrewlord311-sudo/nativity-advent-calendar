// Join the dots in order (window 8 star). Numbered dots; tap them 1, 2, 3… and the crayon line follows. At the end the picture appears.
// step: { scene, dots: [[x, y]...], reveal(): scene string, prompt, doneCaption }

export async function dots(step, api) {
  api.showScene(step.scene(), step.seed || 1);
  const top = api.top(), svg = api.svg(), draw = api.draw();
  top.innerHTML = `<g class="lines"></g>` + step.dots.map(([x, y], i) => `<g class="dot" data-i="${i}"><circle cx="${x}" cy="${y}" r="30" fill="#fff6c8" stroke="#2b2b2b" stroke-width="5"/><text x="${x}" y="${y + 11}" font-size="32" text-anchor="middle" fill="#2b2b2b">${i + 1}</text></g>`).join("");
  const lines = top.querySelector(".lines");
  api.caption(step.prompt); api.say("yourTurn");
  let n = 0, tap;
  const hilite = () => top.querySelectorAll(".dot").forEach((g, i) => g.querySelector("circle").setAttribute("fill", i === n ? "#ffe27a" : i < n ? "#c8eec0" : "#fff6c8"));
  hilite();
  try {
    await api.until(new Promise(resolve => {
      tap = e => {
        const p = api.svgPoint(e), [x, y] = step.dots[n];
        if (Math.hypot(p.x - x, p.y - y) > 80) return;
        if (n > 0) { const [px, py] = step.dots[n - 1]; lines.insertAdjacentHTML("beforeend", `<line x1="${px}" y1="${py}" x2="${x}" y2="${y}" stroke="#e8392c" stroke-width="12" stroke-linecap="round"/>`); }
        api.sfx.tap(); n++;
        if (n === step.dots.length) { const [a, b] = [step.dots[n - 1], step.dots[0]]; lines.insertAdjacentHTML("beforeend", `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#e8392c" stroke-width="12" stroke-linecap="round"/>`); resolve(); } else hilite();
      };
      svg.addEventListener("pointerdown", tap);
    }));
  } finally { svg.removeEventListener("pointerdown", tap); }
  api.sfx.fanfare();
  await api.wait(500);
  top.innerHTML = "";
  if (step.reveal) { api.showScene(step.reveal(), (step.seed || 1) + 1); }
  await api.caption(step.doneCaption || "It's a picture!");
  await api.wait(700);
}

// Rub the dark away with a finger (window 2). The scene underneath is already drawn; a dark cover with a hole-punch mask
// sits on top, and every touch punches a round hole. When about two thirds of a grid has been touched the cover fades.
// step: { scene, prompt, doneCaption, cover: colour }

const CELL = 90, X0 = 420, COLS = 12, ROWS = 12;

export async function rub(step, api) {
  api.showScene(step.scene(), step.seed || 1);
  const top = api.top(), svg = api.svg();
  top.innerHTML = `<defs><mask id="rubMask" maskUnits="userSpaceOnUse" x="420" y="0" width="1080" height="1080"><rect x="420" y="0" width="1080" height="1080" fill="#fff"/><g class="holes"></g></mask></defs>
    ${step.hay ? `<defs><pattern id="hayPat" width="46" height="34" patternUnits="userSpaceOnUse"><rect width="46" height="34" fill="#e4c862"/><path d="M0,8 L22,2 M10,22 L40,14 M24,33 L46,24 M30,6 L46,10 M2,30 L14,26" stroke="#a8841e" stroke-width="5" stroke-linecap="round"/><path d="M18,14 L34,26 M4,16 L12,10" stroke="#f3dc88" stroke-width="4" stroke-linecap="round"/></pattern></defs>` : ""}<rect class="cover" x="420" y="0" width="1080" height="1080" fill="${step.hay ? "url(#hayPat)" : step.cover || "#101a3d"}" mask="url(#rubMask)"/>
    <text class="ghost" font-size="110" text-anchor="middle" x="960" y="560">👆</text>`;
  const holes = top.querySelector(".holes"), cover = top.querySelector(".cover"), ghost = top.querySelector(".ghost");
  api.caption(step.prompt); api.say("yourTurn");
  const seen = new Set(); let down = false, last = 0;
  const punch = e => {
    const p = api.svgPoint(e);
    holes.insertAdjacentHTML("beforeend", `<circle cx="${p.x}" cy="${p.y}" r="75" fill="#000"/>`);
    ghost.setAttribute("opacity", "0");
    for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) {
      const c = Math.floor((p.x - X0 + dx * 60) / CELL), r = Math.floor((p.y + dy * 60) / CELL);
      if (c >= 0 && c < COLS && r >= 0 && r < ROWS) seen.add(r * COLS + c);
    }
    if (performance.now() - last > 120) { api.sfx.crayon(); last = performance.now(); }
  };
  let move, upr;
  try {
    await api.until(new Promise(resolve => {
      const dn = e => { down = true; punch(e); };
      move = e => { if (!down) return; punch(e); if (seen.size >= COLS * ROWS * 0.62) resolve(); };
      upr = () => { down = false; };
      svg.addEventListener("pointerdown", dn); svg.addEventListener("pointermove", move); window.addEventListener("pointerup", upr);
      step._off = () => { svg.removeEventListener("pointerdown", dn); };
    }));
  } finally { svg.removeEventListener("pointermove", move); window.removeEventListener("pointerup", upr); step._off && step._off(); }
  cover.style.transition = "opacity .6s"; cover.style.opacity = "0";
  api.sfx.sparkle();
  await api.caption(step.doneCaption || "Look!");
  await api.wait(300);
  top.innerHTML = "";
}

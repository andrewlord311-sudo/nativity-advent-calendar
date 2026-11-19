// Slide the doors open (window 24). Two big wooden doors cover the scene; drag them apart from the middle and the light pours out.
// step: { scene (what is behind), prompt, doneCaption, lullaby: [[freq, gap ms]...] }

export async function slide(step, api) {
  api.showScene(step.scene(), step.seed || 1);
  const top = api.top(), svg = api.svg();
  top.innerHTML = `<g class="dl"><rect x="420" y="0" width="540" height="1080" fill="#6a4a22" stroke="#2b2b2b" stroke-width="10"/>${[600, 780].map(x => `<line x1="${x}" y1="0" x2="${x}" y2="1080" stroke="#4a3010" stroke-width="8"/>`).join("")}<circle cx="920" cy="560" r="20" fill="#f2c230" stroke="#2b2b2b" stroke-width="5"/></g>
    <g class="dr"><rect x="960" y="0" width="540" height="1080" fill="#6a4a22" stroke="#2b2b2b" stroke-width="10"/>${[1140, 1320].map(x => `<line x1="${x}" y1="0" x2="${x}" y2="1080" stroke="#4a3010" stroke-width="8"/>`).join("")}<circle cx="1000" cy="560" r="20" fill="#f2c230" stroke="#2b2b2b" stroke-width="5"/></g>
    <text class="ghost" font-size="110" text-anchor="middle" x="960" y="620">👆</text>`;
  const dl = top.querySelector(".dl"), dr = top.querySelector(".dr"), ghost = top.querySelector(".ghost");
  api.caption(step.prompt); api.say("yourTurn");
  let x0 = null, move, dn, up, open = 0;
  const set = d => { open = Math.max(0, Math.min(540, d)); dl.setAttribute("transform", `translate(${-open} 0)`); dr.setAttribute("transform", `translate(${open} 0)`); };
  try {
    await api.until(new Promise(resolve => {
      dn = e => { x0 = api.svgPoint(e).x; ghost.setAttribute("opacity", "0"); };
      move = e => { if (x0 === null) return; const p = api.svgPoint(e); set(Math.abs(p.x - x0) * 1.3); if (open >= 470) resolve(); };
      up = () => { x0 = null; };
      svg.addEventListener("pointerdown", dn); svg.addEventListener("pointermove", move); window.addEventListener("pointerup", up);
    }));
  } finally { svg.removeEventListener("pointerdown", dn); svg.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); }
  set(540);
  api.sfx.sparkle();
  await api.wait(1200);
  await api.caption(step.doneCaption || "", { big: true });
  await api.wait(900);
  top.innerHTML = "";
}

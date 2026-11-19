// Search with a torch or telescope (windows 16 and 17). A round light follows the finger (press and drag); anything hidden inside it is found.
// step: { scene, items: [{ id, at, r, required }], dark (cover opacity, default .93; 0 = no cover), hidden(): svg shown only inside the light,
// lens: draws a ring (a telescope), prompt, doneCaption }.

export async function torch(step, api) {
  api.showScene(step.scene(), step.seed || 1);
  const top = api.top(), svg = api.svg(), R = step.radius || 150;
  const dark = step.dark ?? 0.93;
  top.innerHTML = `<defs><mask id="torchMask" maskUnits="userSpaceOnUse" x="420" y="0" width="1080" height="1080"><rect x="420" y="0" width="1080" height="1080" fill="#fff"/><circle class="hole" cx="960" cy="540" r="${R}" fill="#000"/></mask>
      <clipPath id="torchClip"><circle class="clipc" cx="960" cy="540" r="${R}"/></clipPath></defs>
    ${dark > 0 ? `<rect class="cover" x="420" y="0" width="1080" height="1080" fill="#0a1030" opacity="${dark}" mask="url(#torchMask)"/>` : ""}
    ${step.hidden ? `<g clip-path="url(#torchClip)" class="hid"></g>` : ""}
    <circle class="lens" cx="960" cy="540" r="${R}" fill="none" stroke="${step.lens ? "#8a6a3a" : "#f7d117"}" stroke-width="${step.lens ? 16 : 6}" opacity=".9"/><g class="found"></g>
    <text class="ghost" font-size="110" text-anchor="middle" x="960" y="560">👆</text>`;
  const hole = top.querySelector(".hole"), clipc = top.querySelector(".clipc"), lens = top.querySelector(".lens"), ghost = top.querySelector(".ghost"), foundG = top.querySelector(".found");
  if (step.hidden) { const h = crayonMount(top.querySelector(".hid"), step.hidden(), 77); crayonFrame(h, crayonEnd(h)); }
  api.caption(step.prompt); api.say("yourTurn");
  const found = new Set(); let down = false, move, dn, up;
  const place = p => { for (const el of [hole, clipc, lens]) { el.setAttribute("cx", p.x); el.setAttribute("cy", p.y); } };
  try {
    await api.until(new Promise(resolve => {
      const check = p => step.items.forEach(it => {
        if (found.has(it.id) || Math.hypot(it.at[0] - p.x, it.at[1] - p.y) > (it.r || 90)) return;
        found.add(it.id); api.sfx.chime();
        foundG.insertAdjacentHTML("beforeend", `<circle class="ring" cx="${it.at[0]}" cy="${it.at[1]}" r="${(it.r || 90) + 20}" fill="none" stroke="#43b04a" stroke-width="14"/>`);
        if (it.say) api.caption(it.say);
        if (step.items.every(i => i.optional || found.has(i.id))) resolve();
      });
      dn = e => { down = true; ghost.setAttribute("opacity", "0"); const p = api.svgPoint(e); place(p); check(p); };
      move = e => { if (!down) return; const p = api.svgPoint(e); place(p); check(p); };
      up = () => { down = false; };
      svg.addEventListener("pointerdown", dn); svg.addEventListener("pointermove", move); window.addEventListener("pointerup", up);
    }));
  } finally { svg.removeEventListener("pointerdown", dn); svg.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); }
  api.sfx.fanfare();
  if (step.reveal) api.showScene(step.reveal(), (step.seed || 1) + 1);
  top.querySelector(".cover")?.setAttribute("opacity", "0"); lens.setAttribute("opacity", "0");
  await api.caption(step.doneCaption || "Found it!", { big: true });
  await api.wait(700);
  top.innerHTML = "";
}

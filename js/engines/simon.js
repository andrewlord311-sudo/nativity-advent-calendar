// Copy the order the lanterns flash (window 21 star). Each round flashes a longer pattern; tap the lanterns in the same order.
// step: { scene, lamps: [{ at, r, freq }], rounds: [[lamp index...]], prompt, doneCaption }. Nothing can be failed: after three tries a round is let through.

export async function simon(step, api) {
  api.showScene(step.scene(), step.seed || 1);
  const top = api.top(), svg = api.svg();
  top.innerHTML = "";
  const flash = async (i) => { top.insertAdjacentHTML("beforeend", `<circle class="fl" cx="${step.lamps[i].at[0]}" cy="${step.lamps[i].at[1]}" r="${step.lamps[i].r}" fill="#ffd633" opacity=".8"/>`); api.sfx.chime(); await api.wait(450); top.querySelector(".fl")?.remove(); await api.wait(180); };
  api.caption(step.prompt); api.say("letsTry");
  for (const seq of step.rounds) {
    let ok = false;
    for (let attempt = 0; attempt < 3 && !ok; attempt++) {
      api.caption(attempt ? "Watch again…" : "Watch the lanterns…");
      await api.wait(600);
      for (const i of seq) await flash(i);
      api.caption("Your turn! Tap them in the same order.");
      let n = 0, bad = false, replaying = false;
      const actions = document.getElementById("pActions");
      await api.until(new Promise(res => {
        const tap = e => {
          if (replaying) return;
          const p = api.svgPoint(e), i = step.lamps.findIndex(l => Math.hypot(l.at[0] - p.x, l.at[1] - p.y) < l.r + 20);
          if (i < 0) return;
          api.sfx.tap();
          if (i !== seq[n]) bad = true;
          n++;
          if (n === seq.length) { svg.removeEventListener("pointerdown", tap); res(); }
        };
        svg.addEventListener("pointerdown", tap);
        // a button to see the pattern again at any time: it forgets the taps so far and flashes the lanterns once more
        actions.innerHTML = `<button class="btn" id="showAgain">👀 Show me again</button>`;
        document.getElementById("showAgain").onclick = async () => {
          if (replaying) return; api.sfx.tap(); replaying = true; n = 0; bad = false;
          api.caption("Watch the lanterns…"); await api.wait(500);
          for (const i of seq) await flash(i);
          await api.wait(300); api.caption("Your turn! Tap them in the same order."); replaying = false;
        };
      }));
      actions.innerHTML = "";
      ok = !bad || attempt === 2;
      if (ok) api.sfx.chime(); else api.sfx.wrong();
      await api.wait(500);
    }
  }
  api.sfx.fanfare();
  await api.caption(step.doneCaption || "You remembered them all!", { big: true });
  await api.wait(600);
}

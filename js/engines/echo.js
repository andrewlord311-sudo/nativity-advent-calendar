// Copy the rhythm (window 6 star). The hoofprints light and clop in a pattern; tap it back anywhere on the picture.
// step: { scene, patterns: [[gaps in ms between hoofbeats]...], prompt, doneCaption }. Loosely marked: a few wrong tries, then it is let through.

const spots = n => [...Array(n)].map((_, i) => [560 + (i + 0.5) * (880 / n), 900]);

export async function echo(step, api) {
  api.showScene(step.scene(), step.seed || 1);
  const top = api.top(), svg = api.svg();
  api.caption(step.prompt); api.say("letsTry");
  for (const gaps of step.patterns) {
    const n = gaps.length + 1, sp = spots(n);
    top.innerHTML = sp.map(([x, y], i) => `<g class="hoof" data-i="${i}"><ellipse cx="${x}" cy="${y}" rx="44" ry="54" fill="#fff" stroke="#5a3614" stroke-width="8" opacity=".85"/></g>`).join("");
    const light = (i, on = true) => top.querySelector(`.hoof[data-i="${i}"] ellipse`)?.setAttribute("fill", on ? "#ffe27a" : "#fff");
    let ok = false;
    for (let attempt = 0; attempt < 3 && !ok; attempt++) {
      api.caption(attempt ? "Listen again…" : "Listen…");
      await api.wait(700);
      let playing = false;
      const play = async () => { playing = true; for (let i = 0; i < n; i++) { light(i); api.sfx.tap(); await api.wait(180); light(i, false); if (i < n - 1) await api.wait(gaps[i] - 180); } playing = false; };
      await play();
      await api.wait(400);
      api.caption("Your turn! Tap the same clip-clop.");
      const taps = [], actions = document.getElementById("pActions");
      await api.until(new Promise(res => {
        const tap = e => { if (playing) return; taps.push(performance.now()); const i = taps.length - 1; light(Math.min(i, n - 1)); api.sfx.tap(); if (taps.length === n) { svg.removeEventListener("pointerdown", tap); res(); } };
        svg.addEventListener("pointerdown", tap);
        // a button to hear the clip-clop again at any time: it clears any taps so far and plays the beat once more
        actions.innerHTML = `<button class="btn" id="hearAgain">🔊 Hear it again</button>`;
        document.getElementById("hearAgain").onclick = async () => {
          if (playing) return; api.sfx.tap(); taps.length = 0; for (let i = 0; i < n; i++) light(i, false);
          api.caption("Listen…"); await api.wait(500); await play(); await api.wait(300); api.caption("Your turn! Tap the same clip-clop.");
        };
      }));
      actions.innerHTML = "";
      const got = taps.slice(1).map((v, i) => v - taps[i]);
      ok = got.every((g, i) => Math.abs(g - gaps[i]) < gaps[i] * 0.5 + 150);
      await api.wait(300);
      if (ok || attempt === 2) { ok = true; api.sfx.chime(); }
      else { api.sfx.wrong(); for (let i = 0; i < n; i++) light(i, false); }
    }
    await api.caption("Clip-clop, clip-clop!"); await api.wait(500);
  }
  top.innerHTML = ""; api.sfx.fanfare();
  await api.caption(step.doneCaption || "You've got the beat!");
  await api.wait(500);
}

// Tap the right one of a few (window 3 star). Wrong taps just wobble and try again.
// step: { scene, options: [{ at: [x, y], r }], answer: index, prompt, doneCaption }

export async function pick(step, api) {
  api.showScene(step.scene(), step.seed || 1);
  const top = api.top(), svg = api.svg();
  top.innerHTML = `<g class="rings"></g><text class="nope" font-size="90" text-anchor="middle" opacity="0">?</text>`;
  const rings = top.querySelector(".rings"), nope = top.querySelector(".nope");
  api.caption(step.prompt); api.say("letsTry");
  let tap, busy = false;
  const tween = (g, p, q, ms) => new Promise(res => {   // move g from p to q over ms, easing in and out (set as an attribute: works everywhere)
    const t0 = performance.now();
    const step = now => { const u = Math.min(1, (now - t0) / ms), e = u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
      g.setAttribute("transform", `translate(${p[0] + (q[0] - p[0]) * e} ${p[1] + (q[1] - p[1]) * e})`); if (u < 1) requestAnimationFrame(step); else res(); };
    requestAnimationFrame(step);
  });
  const slideIt = async (m, to, back) => {   // a copy of the chosen thing slides to where it would go (and back, if it does not fit)
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g"); g.innerHTML = m.svg; g.setAttribute("transform", `translate(${m.from[0]} ${m.from[1]})`); top.appendChild(g);
    await tween(g, m.from, m.to, 800); if (!back) return g;
    await api.wait(1100);
    await tween(g, m.to, m.from, 600); g.remove();
  };
  try {
    await api.until(new Promise(resolve => {
      tap = async e => {
        if (busy) return;
        const p = api.svgPoint(e);
        let i = -1, best = Infinity;   // the nearest option whose circle holds the tap (circles of long planks overlap their neighbours)
        step.options.forEach((o, k) => { const d = Math.hypot(o.at[0] - p.x, o.at[1] - p.y); if (d < o.r && d < best) { best = d; i = k; } });
        if (i < 0) return;
        const mv = step.options[i].move;
        if (i !== step.answer && mv) { busy = true; api.sfx.tap(); api.caption(mv.say || "Hmm…"); await slideIt(mv, null, true); api.sfx.wrong(); api.caption(step.prompt); busy = false; return; }
        if (i === step.answer && mv) { busy = true; api.sfx.tap(); await slideIt(mv, null, false); }
        if (i !== step.answer) {
          if (step.wrongSay) api.caption(step.wrongSay);
          api.sfx.wrong(); nope.setAttribute("x", p.x); nope.setAttribute("y", p.y);
          nope.classList.remove("show"); void nope.getBBox(); nope.classList.add("show"); return;
        }
        const o = step.options[i];
        if (step.reveal) {   // something appears at the right answer (the lamb behind the rock)
          const g = document.createElementNS("http://www.w3.org/2000/svg", "g"); g.setAttribute("class", "pop"); api.draw().appendChild(g);
          const h = crayonMount(g, step.reveal(i), 88); crayonFrame(h, crayonEnd(h));
        }
        rings.innerHTML = `<circle class="ring" cx="${o.at[0]}" cy="${o.at[1]}" r="${o.r}" fill="none" stroke="#43b04a" stroke-width="14"/>`;
        api.sfx.chime(); resolve();
      };
      svg.addEventListener("pointerdown", tap);
    }));
  } finally { svg.removeEventListener("pointerdown", tap); }
  await api.caption(step.doneCaption || "Yes!");
  await api.wait(500);
}

// Surprise: a friendly T. rex in a Santa hat wanders in. Tap him to make him roar; the sheep jump. Not in the nativity story!
const LINES = ["ROAR!", "RAAAWR!", "ROAR! ROAR!", "…ROAR!"];

export default async function trexSurprise(api) {
  api.sfx.fanfare();
  api.showScene(sky(0) + ground(860, 0.2) + sun(1330, 170, 0.2), 31);
  const layer = (id, html, seed) => { const g = document.createElementNS(NS, "g"); g.id = id; api.draw().appendChild(g); const h = crayonMount(g, html, seed); crayonFrame(h, crayonEnd(h)); return g; };
  const sheepA = layer("shA", sheep(620, 930, 1.1), 41), sheepB = layer("shB", sheep(1370, 940, 0.95), 42);
  const rex = layer("rex", trex(900, 960, 1.15), 43);
  api.caption("Wait… a DINOSAUR?! That's not in the Christmas story! Tap him!");
  api.say("letsTry");
  const svg = api.svg(), top = api.top();
  let n = 0;
  const bump = (g, cls) => { g.classList.remove(cls); void g.getBBox(); g.classList.add(cls); };
  await api.until(new Promise(resolve => {
    const tap = e => {
      const p = api.svgPoint(e);
      if (Math.hypot(p.x - 960, p.y - 760) > 330) { api.sfx.wrong(); return; }
      api.sfx.roar(); bump(rex, "bounce"); bump(sheepA, "hop"); setTimeout(() => bump(sheepB, "hop"), 120);
      top.insertAdjacentHTML("beforeend", `<text x="${960 + [-150, 130, -110, 90][n % 4]}" y="${330 + n * 55}" font-size="110" text-anchor="middle" fill="#d8302a" stroke="#fff" stroke-width="12" paint-order="stroke" class="elfSay">${LINES[n % 4]}</text>`);
      if (++n >= 4) { svg.removeEventListener("pointerdown", tap); resolve(); }
    };
    svg.addEventListener("pointerdown", tap);
  }));
  api.sfx.sparkle();
  await api.caption("Dinosaurs weren't at the first Christmas… but he's very welcome at the party!");
  api.mark();
  await api.next("Bye, T. rex! ▶");
}

// Window 11 (Fri 11 Dec): the stable. Activity: sweep away the dust, then shoo the spiders. ★ Star challenge: sort the stable things into "keep" and "out".

const inside = () => P(poly([400, -20], [1520, -20], [1520, 900], [400, 900]), { s: N.woodDark, f: "#a98355", w: 6 })
  + [520, 700, 880, 1060, 1240, 1420].map(x => P(ln([x, -20], [x, 900]), { s: N.woodDark, w: 5 })).join("") + ground(900, 0.1, "#d8bf7a", "#a8823f")
  + P(poly([760, 900], [1160, 900], [1160, 520], [760, 520]), { s: N.woodDark, f: "#2a1a10", w: 6 });
const webs = () => cobweb(430, 10, 1.6) + cobweb(1490, 10, 1.6) + cobweb(960, 480, 1.1);
const clean = () => inside() + G(donkey(1240, 920, 0.5), { t: 0.5, dur: 0.5 });
const dusty = () => inside() + webs();
const SPIDERS = [[560, 330], [1330, 450], [960, 660], [700, 720]];
const spiderScene = () => inside() + webs() + SPIDERS.map(([x, y]) => spider(x, y, 1.6)).join("");

// sorting: things to keep (colourful and useful) and rubbish (grey, broken, smelly)
const rub = (art) => (x, y) => art(x, y) + stink(x, y - 70, 0.9) + dot(x - 30, y - 120, 5) + dot(x + 34, y - 100, 5);
const KEEP = (kind, art, x, y) => ({ kind, at: [x, y], r: 80, art: () => art(x, y) });
const SORT = [KEEP("keep", (x, y) => jug(x, y + 30, 1.2), 560, 700), KEEP("out", rub(tinCan), 760, 720), KEEP("keep", (x, y) => oilLamp(x, y, 1.5), 960, 700), KEEP("out", rub(appleCore), 1160, 720),
  KEEP("keep", (x, y) => blanket(x, y, 0.8), 1360, 700), KEEP("out", rub(brokenPot), 660, 920), KEEP("keep", (x, y) => loaf(x, y + 30, 1.3), 880, 900), KEEP("out", rub(tinCan), 1100, 920)];
const sortScene = () => P(poly([400, -20], [1520, -20], [1520, 1100], [400, 1100]), { s: N.woodDark, f: "#a98355", w: 6 }) + ground(620, 0.1, "#d8bf7a", "#a8823f");

const door = () => night3() + G(stable(960, 800, 520, 360), { t: 0.3, dur: 0.8 }) + G(mary(560, 1000, { sc: 0.8 }) + joseph(1380, 1010, { sc: 0.85 }), { t: 1, dur: 0.8 });
const night3 = () => P(poly([420, -20], [1500, -20], [1500, 1100], [420, 1100]), { s: N.night, f: N.night, w: 2 }) + [[560, 120], [900, 200], [1240, 140]].map(([x, y]) => starP(x, y, 24)).join("") + ground(870, 0.1, N.nightHill, N.nightHillEdge);

export default {
  day: 11,
  title: "The stable",
  sticker: { name: "the Stable", found: "You found a sticker: the Stable!", crayon: () => stable(0, 0, 300, 210), at: [2000, 1195], scale: 0.38, showAt: 1000, showScale: 1.4 },
  steps: [
    { type: "story", scene: door, seed: 111, elf: { at: [440, 140], kind: "leg" }, captions: [
      "The innkeeper led Mary and Joseph to his stable.",
      "It was dusty and full of cobwebs. Let's get it ready!",
    ] },
    { type: "rub", scene: clean, seed: 112, cover: "#cbbf9e", elf: { at: [1480, 700], kind: "ear" }, prompt: "Sweep away the dust with your finger!", doneCaption: "The floor is clean!" },
    { type: "nails", scene: spiderScene, seed: 113, spots: SPIDERS, ring: 70, word: "Shoo!", elf: { at: [1480, 860], kind: "hat" },
      spotDone: (x, y) => `<text x="${x}" y="${y + 24}" font-size="90" text-anchor="middle">💨</text>`,
      prompt: "Shoo the spiders away! Tap each one.", doneCaption: "All gone! The stable is ready for visitors." },
  ],
  star: { steps: [{ type: "drag", scene: sortScene, seed: 114, items: SORT, zones: [{ kind: "keep", at: [700, 330], r: 150, label: "keep ✓", stroke: "#43b04a" }, { kind: "out", at: [1220, 330], r: 150, label: "rubbish 🗑", stroke: "#e8392c" }],
    elf: { at: [1480, 1000], kind: "ear" }, prompt: "★ Keep the useful things. Drag the smelly rubbish into the bin!", doneCaption: "A tidy stable, ready for the baby!" }], after: clean },
};

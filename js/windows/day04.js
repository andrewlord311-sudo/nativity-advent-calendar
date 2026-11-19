// Window 4 (Fri 4 Dec): the Emperor's order. Activity: ring the town crier's bells. ★ Star challenge: count the people in the queue.

const palace = () => sky(0) + ground(900, 0.2, "#d8c9a6", "#a8956a")
  + [560, 1360].map((x, i) => G(P(poly([x - 55, 900], [x - 45, 260], [x + 45, 260], [x + 55, 900]), { s: "#9a8660", f: "#efe3c4", w: 7 }) + P(poly([x - 75, 260], [x + 75, 260], [x + 75, 220], [x - 75, 220]), { s: "#9a8660", f: "#efe3c4", w: 7 }), { t: 0.2 + i * 0.2, dur: 0.5 })).join("")
  + G(P(poly([800, 900], [1120, 900], [1120, 600], [800, 600]), { s: N.woodDark, f: "#8a2a2a", w: 8 }), { t: 0.8, dur: 0.5 })
  + G(emperor(960, 830, { sc: 0.9, rh: [110, -240] }), { t: 1.2, dur: 0.9 });

const crier = () => sky(0) + ground(860, 0.1) + G(flatHouse(620, 860, 260, 230, {}), { t: 0.3, dur: 0.5 }) + G(flatHouse(1330, 860, 300, 260, { doorAt: -0.28 }), { t: 0.5, dur: 0.5 })
  + [[780, 520], [960, 460], [1140, 520]].map(([x, y], i) => G(bell(x, y, 0.8), { t: 0.8 + i * 0.2, dur: 0.4 })).join("")
  + G(kid("theo", 960, 1020, { sc: 1.1, mouth: "wow", rh: [95, -260] }), { t: 1.3, dur: 0.8 });
const BELLS = [[780, 480], [960, 420], [1140, 480]];

const road = () => sky(0) + sun(1330, 170, 0.1) + ground(860, 0.1) + G(flatHouse(640, 860, 250, 210, {}), { t: 0.3, dur: 0.5 })
  + G(mary(900, 990, { sc: 0.95, rh: [95, -230] }), { t: 0.8, dur: 0.8 }) + G(joseph(1130, 1000, { sc: 1, lh: [-95, -230] }), { t: 1.1, dur: 0.8 });

const queueScene = n => sky(0) + ground(880, 0.1) + G(flatHouse(1280, 880, 340, 300, { doorAt: -0.3 }), { t: 0.2, dur: 0.4 })
  + [...Array(n)].map((_, i) => G(person(520 + i * 105, 870 + (i % 2) * 18, { sc: 0.42, c: ["#e8392c", "#2f7de1", "#43b04a", "#8e4fc9", "#f28c28"][i % 5] }), { t: 0.3 + i * 0.12, dur: 0.3 })).join("");
const nums = (vals) => vals.map((v, i) => P(ell(660 + i * 300, 990, 62, 62), { s: C.ink, f: "#fff6c8", w: 7 }) + TX(String(v), 660 + i * 300, 1012, { size: 70 })).join("");
const COUNT = (n, vals, ans, seed) => ({
  type: "pick", scene: () => queueScene(n) + nums(vals), seed, elf: { at: [1450, 360], kind: "ear" },
  options: vals.map((_, i) => ({ at: [660 + i * 300, 990], r: 85 })), answer: ans,
  prompt: `★ How many people are in the queue? Tap the right number.`, doneCaption: `Yes, ${n}! Well counted!`,
});

export default {
  day: 4,
  title: "The Emperor's order",
  sticker: { name: "the Scroll", found: "You found a sticker: the Scroll!", crayon: () => scroll(0, 0, 240, 200, ["COUNT", "ME!"]), at: [560, 965], scale: 0.5, showAt: 980, showScale: 1.5 },
  steps: [
    { type: "story", scene: palace, seed: 41, elf: { at: [1460, 240], kind: "hat" }, captions: [
      "Far away, a powerful Emperor ruled the land. His name was Augustus.",
      "He wanted to count everybody. So he gave an order…",
      "“Everyone must go to the town where their family comes from!”",
    ] },
    { type: "nails", scene: crier, seed: 42, spots: BELLS, word: "DING!", ring: 80, elf: { at: [450, 880], kind: "leg" },
      spotDone: (x, y) => `<text x="${x}" y="${y + 20}" font-size="120" text-anchor="middle">🔔</text>`,
      built: () => scroll(1290, 730, 300, 250, ["EVERYONE", "MUST BE", "COUNTED!"]),
      prompt: "Theo is the town crier! Tap each bell to tell everyone the news.", doneCaption: "Everybody heard! They all have to go to be counted." },
    { type: "story", scene: road, seed: 43, elf: { at: [440, 240], kind: "ear" }, captions: [
      "Mary and Joseph heard the news too.",
      "Joseph's family came from Bethlehem, so that is where they had to go.",
      "It was a long way for Mary to walk…",
    ] },
  ],
  star: { steps: [COUNT(6, [5, 6, 7], 1, 44), COUNT(8, [9, 7, 8], 2, 45)], after: () => queueScene(8) },
};

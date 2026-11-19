// Window 15 (Tue 15 Dec): the shepherds. Activity: count the sheep into the fold, 1 to 5 (the caption counts as they go).
// ★ Star challenge: count to 20 in twos.

const hill = () => P(poly([420, -20], [1500, -20], [1500, 1100], [420, 1100]), { s: N.night, f: N.night, w: 2 })
  + [[560, 120], [900, 200], [1240, 140], [1400, 300]].map(([x, y]) => starP(x, y, 24)).join("") + ground(700, 0.1, N.nightHill, N.nightHillEdge);
const fold = () => P(poly([660, 480], [1260, 480], [1260, 280], [660, 280]), { s: "#5a3614", f: "#7a5a2a", w: 8 }) + [740, 860, 960, 1060, 1180].map(x => P(ln([x, 480], [x, 280]), { s: "#5a3614", w: 7 })).join("");
const FOLD = [960, 400];
const field = () => hill() + fold();
const ptsFive = [[560, 760], [760, 860], [960, 780], [1160, 880], [1360, 780]];
const scene5 = () => field() + G(shepherd(480, 1060, { sc: 0.6 }), { t: 0.3, dur: 0.5 });
const SHEEP5 = ptsFive.map(([x, y]) => ({ kind: "sheep", at: [x, y], r: 90, art: () => sheep(x, y, 1.7) }));

const twos = [...Array(10)].map((_, i) => [560 + (i % 5) * 200, 520 + Math.floor(i / 5) * 280]);
const sceneTwos = () => hill() + twos.map(([x, y], i) => G(sheep(x - 40, y + 40, 1.1) + sheep(x + 40, y + 70, 1.1), { t: 0.2 + i * 0.1, dur: 0.3 })).join("");

export default {
  day: 15,
  title: "The shepherds",
  sticker: { name: "the Shepherds", found: "You found a sticker: the Shepherds!", crayon: () => shepherd(0, 0, { sc: 0.8 }), at: [2830, 935], scale: 0.4, showAt: 1000, showScale: 1.6 },
  steps: [
    { type: "story", scene: () => hill() + G(shepherd(900, 1060, { sc: 0.9 }), { t: 0.3, dur: 0.6 }) + G(sheep(1200, 900, 1.5) + sheep(640, 920, 1.3), { t: 0.8, dur: 0.5 }), seed: 151, elf: { at: [440, 760], kind: "ear" }, top: () => ANIMAL_SET.animalSvg("owl", ANIMAL_SET.PART_ORDER).replace("<svg ", '<svg x="1150" y="150" width="200" height="200" '), captions: [
      "That same night, on the hills outside Bethlehem, some shepherds were looking after their sheep.",
      "Every night they counted the sheep into the fold, to keep them safe.",
    ] },
    { type: "drag", scene: scene5, seed: 152, items: SHEEP5, need: { sheep: 5 }, target: { at: FOLD, r: 220 }, count: true, elf: { at: [1480, 1040], kind: "leg" },
      prompt: "Help the shepherd! Drag each sheep into the fold and count them.", doneCaption: "Five sheep, all safe in the fold!" },
  ],
  star: { steps: [{ type: "nails", scene: sceneTwos, seed: 153, ordered: true, ring: 110, spots: twos.map(([x, y]) => [x, y + 40]), words: ["2", "4", "6", "8", "10", "12", "14", "16", "18", "20"], elf: { at: [1480, 1040], kind: "leg" },
    spotDone: (x, y) => `<text x="${x}" y="${y + 10}" font-size="80" text-anchor="middle">🐑</text>`,
    prompt: "★ Count the sheep in twos: tap each pair in order!", doneCaption: "2, 4, 6, 8… all the way to 20!" }], after: scene5 },
};

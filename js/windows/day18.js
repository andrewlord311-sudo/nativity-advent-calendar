// Window 18 (Fri 18 Dec): three gifts. Activity: wrap each gift (choose the paper and the bow). ★ Star challenge: which king carries which gift?

const hall = () => P(poly([400, -20], [1520, -20], [1520, 900], [400, 900]), { s: N.plasterEdge, f: "#e8d8b8", w: 6 }) + ground(900, 0.1, "#c9a66b", "#8a6a3a");
const BOXES = [{ at: [660, 540], w: 220, h: 170, label: "gold", icon: "🪙" }, { at: [960, 540], w: 220, h: 170, label: "frankincense", icon: "🌿" }, { at: [1260, 540], w: 220, h: 170, label: "myrrh", icon: "🏺" }];
const table2 = () => hall() + G(table(960, 880, 960, 220), { t: 0.3, dur: 0.5 }) + G(wiseman(600, 880, { sc: 0.55 }) + wiseman(960, 880, { sc: 0.6, c: "#2f7de1", hat: "#e8392c" }) + wiseman(1320, 880, { sc: 0.55, c: "#43b04a", hat: "#f28c28" }), { t: 0.6, dur: 0.6 });
const KINGS = [[640, "#e8392c"], [960, "#2f7de1"], [1280, "#43b04a"]];
const GIFTS = { gold: "gold", frank: "frankincense", myrrh: "myrrh" };
const round = (txt, order, ans, seed) => ({ type: "pick", seed, elf: { at: [1490, 160], kind: "hat" },
  scene: () => hall() + KINGS.map(([x, c]) => wiseman(x, 620, { sc: 0.55, c })).join("") + order.map((g, i) => giftArt(g, KINGS[i][0], 1010, 1.3)).join(""),
  options: order.map((_, i) => ({ at: [KINGS[i][0], 930], r: 100 })), answer: order.indexOf(ans), prompt: `★ ${txt}`, doneCaption: "Yes, that's the one!" });

export default {
  day: 18,
  title: "Three gifts",
  sticker: { name: "the Gifts", found: "You found a sticker: the Gifts!", crayon: () => giftArt("gold", -120, 40, 0.8) + giftArt("frankincense", 0, 40, 0.8) + giftArt("myrrh", 120, 40, 0.8), at: [3420, 1090], scale: 0.5, showAt: 1000, showScale: 1.6 },
  steps: [
    { type: "story", scene: table2, seed: 181, elf: { at: [440, 200], kind: "leg" }, captions: [
      "The wise men gathered gifts for the new king.",
      "Gold, a treasure for a king. Frankincense, a sweet-smelling resin that is burned like perfume. And myrrh, a precious oil.",
    ] },
    { type: "wrap", scene: table2, seed: 182, boxes: BOXES, papers: ["#e8392c", "#2f7de1", "#43b04a", "#8e4fc9", "#f28c28"], elf: { at: [440, 200], kind: "leg" },
      prompt: "Wrap the gifts! Tap a gift, then tap a colour of paper.", doneCaption: "Beautiful! Three gifts, all wrapped." },
  ],
  star: { steps: [
    round("The king in RED carries the gift that shines like the sun. Tap it!", ["gold", "frankincense", "myrrh"], "gold", 183),
    round("The king in BLUE carries the sweet-smelling resin, frankincense. Tap it!", ["myrrh", "frankincense", "gold"], "frankincense", 184),
    round("The king in GREEN carries the precious oil, myrrh. Tap it!", ["gold", "myrrh", "frankincense"], "myrrh", 185)], after: table2 },
};

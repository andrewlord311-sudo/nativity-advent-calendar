// Window 20 (Sun 20 Dec): supper for the sheep. Activity: tap each hungry sheep to give it some hay.
// ★ Star challenge: which sheep is the biggest? Which is the smallest?

const night = () => P(poly([420, -20], [1500, -20], [1500, 1100], [420, 1100]), { s: N.night, f: N.night, w: 2 })
  + [[560, 120], [900, 200], [1240, 140], [1400, 300], [700, 330]].map(([x, y]) => starP(x, y, 24)).join("") + ground(640, 0.1, N.nightHill, N.nightHillEdge);
const FLOCK = [[560, 760], [960, 740], [1340, 780], [700, 960], [1100, 980], [1400, 990]];
const scene = () => night() + FLOCK.map(([x, y], i) => G(sheep(x, y, 1.4), { t: 0.3 + i * 0.12, dur: 0.4 })).join("") + G(shepherd(480, 1060, { sc: 0.55 }), { t: 1.2, dur: 0.5 });

const XS = [660, 960, 1260];
const sizes = (order, seed) => ({ type: "pick", seed, elf: { at: [1480, 200], kind: "hat" }, scene: () => night() + order.map((s, i) => sheep(XS[i], 900, s)).join(""),
  options: order.map((s, i) => ({ at: [XS[i], 900 - 45 * s], r: 110 * Math.max(s, 0.8) })), answer: 0 });
const round = (order, want, seed) => { const r = sizes(order, seed); r.answer = order.indexOf(want === "biggest" ? Math.max(...order) : Math.min(...order)); r.prompt = `★ Which sheep is the ${want}? Tap it!`; r.doneCaption = `Yes, that is the ${want}!`; return r; };

export default {
  day: 20,
  title: "Supper for the sheep",
  sticker: { name: "the Flock", found: "You found a sticker: the Flock!", crayon: () => sheep(-70, 40, 1.2) + sheep(80, 60, 1.0), at: [1930, 930], scale: 0.45, showAt: 1000, showScale: 1.5 },
  steps: [
    { type: "story", scene: () => night() + G(shepherd(900, 1040, { sc: 0.85 }), { t: 0.3, dur: 0.6 }) + G(sheep(620, 900, 1.4) + sheep(1240, 920, 1.3), { t: 0.8, dur: 0.5 }), seed: 201, elf: { at: [440, 800], kind: "ear" }, captions: [
      "The shepherds looked after their sheep all night long, in the cold.",
      "The sheep were hungry. The shepherd had some hay for supper. Can you feed them all?",
    ] },
    { type: "nails", scene: scene, seed: 202, spots: FLOCK.map(([x, y]) => [x, y - 50]), ring: 90, word: "Munch!", elf: { at: [440, 800], kind: "ear" },
      spotDone: (x, y) => `<text x="${x}" y="${y - 30}" font-size="100" text-anchor="middle">🌾</text>`,
      prompt: "Tap each sheep to give it some hay!", doneCaption: "Munch, munch! Every sheep has had its supper." },
  ],
  star: { steps: [round([0.9, 1.9, 1.3], "biggest", 203), round([1.7, 1.0, 0.7], "smallest", 204)], after: scene },
};

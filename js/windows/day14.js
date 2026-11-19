// Window 14 (Mon 14 Dec): the stable animals. Activity: tap each animal to hear it. ★ Star challenge: match the animal to its footprints.

const pic = (key, x, y, size) => ANIMAL_SET.animalSvg(key, ANIMAL_SET.PART_ORDER).replace("<svg ", `<svg x="${x - size / 2}" y="${y - size}" width="${size}" height="${size}" `);
const shed = () => P(poly([400, -20], [1520, -20], [1520, 900], [400, 900]), { s: N.woodDark, f: "#a98355", w: 6 })
  + [520, 700, 880, 1060, 1240, 1420].map(x => P(ln([x, -20], [x, 900]), { s: N.woodDark, w: 5 })).join("") + ground(900, 0.1, "#d8bf7a", "#a8823f");
const ANIMALS = [[640, 960], [1000, 960], [1320, 940]];
const scene = () => shed() + G(ox(ANIMALS[0][0] - 120, ANIMALS[0][1], 0.9), { t: 0.4, dur: 0.6 }) + G(sheep(ANIMALS[1][0], ANIMALS[1][1], 1.8), { t: 0.7, dur: 0.6 }) + G(donkey(ANIMALS[2][0] - 150, ANIMALS[2][1], 0.8), { t: 1, dur: 0.6 }) + G(manger(960, 700, 0.9), { t: 1.3, dur: 0.4 });

const ROUND = (kind, opts, ans, seed) => ({
  type: "pick", seed, elf: { at: [1480, 160], kind: "hat" },
  scene: () => P(poly([400, -20], [1520, -20], [1520, 1100], [400, 1100]), { s: N.plasterEdge, f: "#d8bf7a", w: 6 })
    + hoofprint(700, 300, kind, 2.2) + hoofprint(900, 380, kind, 2.2) + hoofprint(1100, 300, kind, 2.2),
  top: undefined,
  options: opts.map((k, i) => ({ at: [640 + i * 320, 840], r: 130 })), answer: ans,
  prompt: "★ Whose footprints are these? Tap the animal!", doneCaption: "Yes! You are a good tracker.",
  _opts: opts,
});
const withPics = r => ({ ...r, scene: () => r.scene() + r._opts.map((k, i) => G(k === "ox" ? ox(540 + i * 320, 960, 0.45) : k === "sheep" ? sheep(640 + i * 320, 920, 1.3) : "", { t: 0.2, dur: 0.2 })).join("") });

export default {
  day: 14,
  title: "The stable animals",
  sticker: { name: "the Ox", found: "You found a sticker: the Ox!", crayon: () => ox(-130, 150, 0.6), at: [2660, 1150], scale: 0.55, showAt: 1000, showScale: 1.5 },
  steps: [
    { type: "story", scene: () => shed() + G(manger(960, 840, 1.1), { t: 0.3, dur: 0.5 }), seed: 141, elf: { at: [1490, 300], kind: "ear" }, captions: [
      "The stable was warm, and it had some friends living in it already.",
      "Who is here? Let's say hello to them all!",
    ] },
    { type: "nails", scene: scene, seed: 142, spots: [[ANIMALS[0][0], 780], [ANIMALS[1][0], 800], [ANIMALS[2][0], 760]], ring: 100, words: ["Moo!", "Baa!", "Hee-haw!"], sounds: ["moo", "baa", "hee"],
      spotDone: (x, y) => `<text x="${x}" y="${y + 20}" font-size="100" text-anchor="middle">🎵</text>`, elf: { at: [1490, 300], kind: "ear" },
      prompt: "Tap each animal to hear what it says!", doneCaption: "The ox, the sheep and the donkey all say hello." },
  ],
  star: { steps: [withPics(ROUND("ox", ["sheep", "ox", "sheep"], 1, 143)), withPics(ROUND("sheep", ["ox", "sheep", "ox"], 1, 144))], after: scene },
};

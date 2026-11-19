// Window 23 (Wed 23 Dec): almost time. Activity: tap each animal to tuck it in; the lights go down. ★ Star challenge: put each animal in its own place.

const shed = () => P(poly([400, -20], [1520, -20], [1520, 900], [400, 900]), { s: N.woodDark, f: "#a98355", w: 6 })
  + [520, 700, 880, 1060, 1240, 1420].map(x => P(ln([x, -20], [x, 900]), { s: N.woodDark, w: 5 })).join("") + ground(900, 0.1, "#d8bf7a", "#a8823f");
const A = { ox: [790, 980], sheep: [980, 960], donkey: [1330, 950] };
const scene = () => shed() + G(manger(960, 700, 0.9), { t: 0.3, dur: 0.4 }) + G(ox(A.ox[0] - 120, A.ox[1], 0.85), { t: 0.5, dur: 0.5 }) + G(sheep(A.sheep[0], A.sheep[1], 1.7), { t: 0.7, dur: 0.5 }) + G(donkey(A.donkey[0] - 150, A.donkey[1], 0.75), { t: 0.9, dur: 0.5 });
const emptyStable = () => shed() + manger(960, 700, 0.9);
const ARTS = [
  { up: () => ox(A.ox[0] - 120, A.ox[1], 0.85), down: () => oxLying(A.ox[0] - 150, A.ox[1], 0.85) },
  { up: () => sheep(A.sheep[0], A.sheep[1], 1.7), down: () => sheepLying(A.sheep[0], A.sheep[1], 1.7) },
  { up: () => donkey(A.donkey[0] - 150, A.donkey[1], 0.75), down: () => donkeyLying(A.donkey[0] - 170, A.donkey[1], 0.75) },
];
const dim = () => scene() + P(poly([400, -20], [1520, -20], [1520, 1100], [400, 1100]), { s: "#0a1030", f: "#0a1030", w: 2 });

// the star challenge: each animal goes to its own sleeping place
const ITEMS = [{ kind: "ox", at: [700, 1000], r: 100, art: () => ox(580, 1000, 0.6) }, { kind: "sheep", at: [1000, 960], r: 100, art: () => sheep(1000, 980, 1.5) }, { kind: "donkey", at: [1280, 980], r: 100, art: () => donkey(1180, 1000, 0.55) }];
const ZONES = [{ kind: "ox", at: [640, 560], r: 120, label: "ox's straw", stroke: "#8a5a35" }, { kind: "sheep", at: [960, 520], r: 120, label: "sheep's corner", stroke: "#9a9a9a" }, { kind: "donkey", at: [1280, 560], r: 120, label: "donkey's spot", stroke: "#5a5148" }];
const quiet = () => shed() + P(poly([400, 620], [1520, 620], [1520, 900], [400, 900]), { s: "#a8823f", f: "#d8bf7a", w: 4 });

export default {
  day: 23,
  title: "Almost time",
  sticker: { name: "the Sleeping Animals", found: "You found a sticker: the Sleeping Animals!", crayon: () => ox(-150, 80, 0.45) + sheep(120, 70, 1.2), at: [2470, 1300], scale: 0.36, showAt: 1000, showScale: 1.5 },
  steps: [
    { type: "story", scene: scene, seed: 231, elf: { at: [1490, 160], kind: "ear" }, captions: [
      "It was nearly bedtime in the stable. Everyone was tired after a long day.",
      "Mary and Joseph were waiting for something wonderful to happen. Let's get the animals to sleep!",
    ] },
    { type: "nails", scene: emptyStable, seed: 232, arts: ARTS, dim: true, spots: [[A.ox[0], 800], [A.sheep[0], 840], [A.donkey[0], 780]], ring: 100, words: ["Zzz…", "Zzz…", "Zzz…"], built: undefined,
      spotDone: (x, y) => `<text x="${x}" y="${y}" font-size="110" text-anchor="middle">💤</text>`, elf: { at: [1490, 160], kind: "ear" }, prompt: "Tap each animal and watch it lie down to sleep.", doneCaption: "Sleep tight, everyone. The lights go down…" },
  ],
  star: { steps: [{ type: "drag", scene: quiet, seed: 233, items: ITEMS, zones: ZONES, snap: true, elf: { at: [1490, 160], kind: "ear" }, prompt: "★ Drag each animal to its own sleeping place.", doneCaption: "Everybody is in the right place. Goodnight!" }], after: dim },
};

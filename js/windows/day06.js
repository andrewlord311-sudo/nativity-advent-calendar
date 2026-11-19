// Window 6 (Sun 6 Dec): meet the donkey. Activity: brush the dust off, then choose his name (kept on this phone).
// ★ Star challenge: copy the donkey's clip-clop rhythm.

const rabbit = (x, y, size) => ANIMAL_SET.animalSvg("rabbit", ANIMAL_SET.PART_ORDER).replace("<svg ", `<svg x="${x - size / 2}" y="${y - size / 2}" width="${size}" height="${size}" `);
const field = () => sky(0) + sun(1340, 170, 0.1) + ground(850, 0.1) + G(palm(560, 880, 0.8), { t: 0.5, dur: 0.5 });
const meet = () => field() + G(joseph(640, 1000, { sc: 1, rh: [110, -190] }), { t: 0.6, dur: 0.8 });
const donkeyScene = () => field() + donkey(980, 990, 1.25) + joseph(640, 1000, { sc: 1, rh: [110, -190] });
const named = () => donkeyScene() + G(P(poly([1380, 780], [1460, 780], [1440, 870], [1400, 870]), { s: "#8a4a10", f: "#f28c28", w: 6 }) + P(ln([1420, 780], [1410, 740]), { s: C.green, w: 8 }), { t: 0.4, dur: 0.4 });
const track = (extra = "") => () => field() + donkey(820, 700, 0.7) + extra;

export default {
  day: 6,
  title: "Meet the donkey",
  sticker: { name: "the Donkey", found: "You found a sticker: the Donkey!", crayon: () => donkey(-120, 150, 0.55), at: [900, 1215], scale: 0.5, showAt: 980, showScale: 1.7 },
  steps: [
    { type: "story", scene: meet, seed: 61, elf: { at: [1480, 650], kind: "ear" }, captions: [
      "Mary needed something to ride on for the long road.",
      "Joseph found a gentle donkey. But he was buried in hay!",
    ] },
    { type: "rub", scene: donkeyScene, seed: 62, hay: true, elf: { at: [1450, 900], kind: "hat" }, prompt: "Brush the hay off the donkey with your finger!", doneCaption: "What a handsome donkey!" },
    { type: "names", scene: named, seed: 63, key: "donkeyName", names: ["Biscuit", "Clop", "Nutmeg", "Pip"], elf: { at: [700, 0], kind: "leg" },
      prompt: "What shall we call him? Choose a name!", doneCaption: n => `Hello, ${n}! Hee-haw!` },
  ],
  star: { steps: [{ type: "echo", scene: track(), seed: 64, elf: { at: [1470, 140], kind: "hat" }, patterns: [[500, 500, 500], [350, 350, 700], [700, 350, 350, 350]],
    prompt: "★ Copy the donkey's clip-clop!", doneCaption: "You've got the donkey's beat!" }], after: donkeyScene },
};

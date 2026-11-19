// Window 9 (Wed 9 Dec): Bethlehem at last. Activity: find Melody, Barnaby and Theo in the crowd. ★ Star challenge: find ten hidden things.

const sticker = (m, x, y, w) => m.replace("<svg ", `<svg x="${x - w / 2}" y="${y - w / 2}" width="${w}" height="${w}" `);
const icon = (m) => m.replace("<svg ", '<svg x="-90" y="-90" width="180" height="180" ');
const town = () => night2() + townGate(960, 760, 760, 480);
const night2 = () => sky(0) + sun(1350, 160, 0.1) + ground(760, 0.1, "#d8c9a6", "#a8956a");
const crowdAt = (rows) => rows.map(([y, xs]) => xs.map((x, i) => G(crowdPerson(x, y, i + y), { t: 0.5 + (i % 6) * 0.1, dur: 0.3 })).join("")).join("");
const CROWD = [[880, [470, 650, 800, 1100, 1260, 1420]], [960, [540, 700, 900, 1040, 1200, 1360]], [1040, [480, 620, 780, 960, 1140, 1280, 1440]]];

const arrive = () => night2() + townGate(960, 760, 760, 480) + G(crowdAt(CROWD.slice(0, 1)), { t: 0.3, dur: 0.1 })
  + G(mary(760, 1000, { sc: 0.75 }) + joseph(1130, 1010, { sc: 0.8 }) + donkey(950, 1010, 0.55), { t: 0.6, dur: 1 });

const seekScene = () => town() + crowdAt(CROWD) + G(kid("theo", 1210, 1030, { sc: 0.55, mouth: "grin" }), { t: 0.6, dur: 0.4 });
const MEL = [650, 800], BAR = [1360, 940];
const finds = () => [
  { id: "melody", label: "Melody", at: MEL, r: 80, icon: () => icon(MASCOTS.melody({ pose: "idle" })), sticker: () => sticker(MASCOTS.melody({ pose: "wave" }), MEL[0], MEL[1], 150) },
  { id: "barnaby", label: "Barnaby", at: BAR, r: 80, icon: () => icon(MASCOTS.barnaby({ pose: "idle" })), sticker: () => sticker(MASCOTS.barnaby({ pose: "wave" }), BAR[0], BAR[1], 160) },
  { id: "theo", label: "Theo", at: [1210, 880], r: 90, icon: () => kid("theo", 0, 95, { sc: 0.55, mouth: "grin" }) },
];

// ten hidden things for the star challenge (each is drawn in the scene and again, bigger, in the tray)
const H = [
  { id: "bell", label: "bell", at: [500, 600], draw: () => bell(500, 640, 0.55), icon: () => bell(0, 60, 0.9) },
  { id: "jug", label: "jug", at: [1410, 700], draw: () => jug(1410, 730, 0.9), icon: () => jug(0, 60, 1.4) },
  { id: "loaf", label: "bread", at: [950, 560], draw: () => loaf(950, 580, 1.1), icon: () => loaf(0, 40, 1.7) },
  { id: "lamp", label: "lamp", at: [1230, 640], draw: () => oilLamp(1230, 660, 1.1), icon: () => oilLamp(0, 20, 1.6) },
  { id: "scroll", label: "scroll", at: [700, 700], draw: () => scroll(700, 720, 100, 80, true), icon: () => scroll(0, 0, 140, 110, true) },
  { id: "sheep", label: "sheep", at: [1330, 1060], draw: () => sheep(1330, 1080, 0.8), icon: () => sheep(-10, 40, 1.3) },
  { id: "tree", label: "tree", at: [560, 760], draw: () => tree(560, 780, 0.28), icon: () => tree(0, 90, 0.45) },
  { id: "blanket", label: "blanket", at: [880, 1090], draw: () => blanket(880, 1085, 0.45), icon: () => blanket(0, 0, 0.9) },
  { id: "bag", label: "bag", at: [1100, 1090], draw: () => bag(1100, 1080, 0.32), icon: () => bag(0, 10, 0.6) },
  { id: "dove", label: "dove", at: [1450, 560], draw: () => dove(1450, 580, 0.9), icon: () => dove(0, 20, 1.5) },
];
const hiddenScene = () => town() + crowdAt(CROWD) + H.map(h => h.draw()).join("");

export default {
  day: 9,
  title: "Bethlehem at last!",
  sticker: { name: "the Town Gate", found: "You found a sticker: the Town Gate!", crayon: () => townGate(0, 0, 330, 220), at: [1230, 950], scale: 0.42, showAt: 900, showScale: 1.5 },
  steps: [
    { type: "story", scene: arrive, seed: 91, elf: { at: [440, 400], kind: "ear" }, captions: [
      "At last! Mary, Joseph and the donkey reached Bethlehem.",
      "The town was full of people. Everyone had come to be counted!",
    ] },
    { type: "seek", scene: seekScene, seed: 92, items: finds(), elf: { at: [1480, 300], kind: "hat" }, prompt: "Melody, Barnaby and Theo are hiding in the crowd. Can you find them?", doneCaption: "You found all three friends!" },
  ],
  star: { steps: [{ type: "seek", scene: hiddenScene, seed: 93, items: H.map(({ id, label, at, icon }) => ({ id, label, at, r: 75, icon })), elf: { at: [1480, 300], kind: "hat" },
    prompt: "★ Ten things are hiding in Bethlehem. Can you find them all?", doneCaption: "You found all ten!" }], after: hiddenScene },
};

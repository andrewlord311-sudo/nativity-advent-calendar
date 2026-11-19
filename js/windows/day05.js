// Window 5 (Sat 5 Dec): packing for Bethlehem. Activity: drag the right things into the saddlebag; Theo's silly ones bounce out.
// ★ Star challenge: read the list: 3 loaves, 2 blankets, 1 lamp.

const room = () => P(poly([400, -20], [1520, -20], [1520, 880], [400, 880]), { s: N.plasterEdge, f: N.plaster, w: 6 }) + ground(880, 0.2, "#c9a66b", "#8a6a3a");
const bagAt = [960, 400];
const scene = (list) => () => room() + G(bag(...bagAt, 1.6), { t: 0.3, dur: 0.5 })
  + G(kid("theo", 560, 1040, { sc: 0.7, mouth: "grin", rh: [80, -250] }), { t: 0.6, dur: 0.5 }) + (list ? G(scroll(1320, 260, 300, 240, false) + list, { t: 0.8, dur: 0.4 }) : "");

const ART = {
  loaf: (x, y) => loaf(x, y, 1.4), jug: (x, y) => jug(x, y, 1.1), lamp: (x, y) => oilLamp(x, y, 1.4), blanket: (x, y) => blanket(x, y, 0.9),
  tv: (x, y) => oldTV(x, y, 0.5), board: (x, y) => skateboard(x, y, 0.9),
};
const item = (kind, x, y) => ({ kind, at: [x, y], r: 85, art: () => ART[kind](x, y) });
const SIMPLE = [item("loaf", 600, 700), item("jug", 800, 720), item("blanket", 1020, 720), item("lamp", 1230, 700), item("tv", 690, 920), item("board", 1100, 930)];
const LIST = TX("3 loaves", 1320, 215, { size: 34 }) + TX("2 blankets", 1320, 262, { size: 34 }) + TX("1 lamp", 1320, 309, { size: 34 });
const MANY = [item("loaf", 560, 690), item("loaf", 690, 690), item("loaf", 820, 690), item("loaf", 950, 690), item("blanket", 1140, 700), item("blanket", 1310, 700),
  item("blanket", 640, 880), item("lamp", 850, 890), item("lamp", 1010, 890), item("tv", 1210, 910), item("board", 1380, 960)];

const trip = () => sky(0) + ground(860, 0.1) + G(flatHouse(660, 860, 280, 230, {}), { t: 0.3, dur: 0.5 })
  + G(mary(950, 990, { sc: 0.95, rh: [95, -230] }), { t: 0.7, dur: 0.8 }) + G(joseph(1200, 1000, { sc: 1 }), { t: 1, dur: 0.8 })
  + G(kid("theo", 520, 1030, { sc: 0.6, mouth: "grin", lh: [-70, -330] }), { t: 1.3, dur: 0.5 });

export default {
  day: 5,
  title: "Packing for Bethlehem",
  sticker: { name: "the Saddlebags", found: "You found a sticker: the Saddlebags!", crayon: () => bag(0, 0, 0.8), at: [740, 1045], scale: 0.38, showAt: 980, showScale: 1.5 },
  steps: [
    { type: "story", scene: trip, seed: 51, elf: { at: [1500, 560], kind: "leg" }, captions: [
      "Bethlehem was about ninety miles away. That's a very long walk!",
      "Mary and Joseph needed to pack. Theo wanted to help.",
    ] },
    { type: "drag", scene: scene(null), seed: 52, items: SIMPLE, need: { loaf: 1, jug: 1, blanket: 1, lamp: 1 }, target: { at: bagAt, r: 230 },
      elf: { at: [1470, 120], kind: "hat" }, prompt: "Drag the useful things into the bag. Theo's telly won't fit!", doneCaption: "All packed! The telly stays at home, Theo." },
  ],
  star: { steps: [{ type: "drag", scene: scene(LIST), seed: 53, items: MANY, need: { loaf: 3, blanket: 2, lamp: 1 }, target: { at: bagAt, r: 230 },
    elf: { at: [1470, 120], kind: "hat" }, prompt: "★ Read the list and pack exactly what it says!", doneCaption: "Exactly right: 3 loaves, 2 blankets and 1 lamp!" }], after: scene(null) },
};

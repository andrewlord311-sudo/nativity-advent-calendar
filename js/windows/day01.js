import trexSurprise from "../surprises/trex.js";

// Window 1 (Tue 1 Dec): the magic door. Maya draws a door into the Christmas story; behind it is Nazareth, and Mary.
// Activity: trace the door. ★ Star challenge: find six things in Mary's house.
// Scenes are drawn in the kids-video 1920 x 1080 frame; the player shows the square from x = 420 to 1500.

const DOOR = { x: 985, y: 925, w: 280, h: 500 };
const MAYA = [610, 990], THEO = [1345, 990];
const mayaHand = kidHand(...MAYA, 1, [120, -300]);

const kids = (t = 0) =>
  G(kid("maya", ...MAYA, { sc: 1, rh: [120, -300], mouth: "grin" }), { t, dur: 0.7 })
  + G(crayon(mayaHand[0], mayaHand[1] + 25, 1.0, 30), { t: t + 0.4, dur: 0.3 })
  + G(kid("theo", ...THEO, { sc: 0.95, mouth: "wow", lh: [-85, -190] }), { t: t + 0.6, dur: 0.7 });

const denScene = () => den(0) + kids(0.5) + sparkle(mayaHand[0] - 10, mayaHand[1] - 40, 22, 1.6, C.red);

const doorDone = () => den(0, { rug: false }) + kids(0)
  + G(archDoor(DOOR.x, DOOR.y, DOOR.w, DOOR.h, 0, false), { a: "fade", t: 0, dur: 0.1, out: 1.4 })
  + archDoor(DOOR.x, DOOR.y, DOOR.w, DOOR.h, 1.4, true);

const nazareth = () => sky(0) + sun(1360, 165, 0.2) + ground(860, 0.2)
  + G(flatHouse(600, 860, 230, 200, {}), { t: 0.5, dur: 0.8 })
  + G(flatHouse(1200, 860, 300, 250, { doorAt: -0.28 }), { t: 0.8, dur: 0.9 })
  + G(palm(1440, 880, 0.85), { t: 1.2, dur: 0.6 }) + G(tree(1330, 905, 0.55), { t: 2.0, dur: 0.6 })
  + G(mary(1010, 960, { sc: 0.95, rh: [95, -230] }), { t: 1.7, dur: 1.0 })
  + G(kid("maya", 540, 1030, { sc: 0.6, rh: [70, -330], mouth: "grin" }) + kid("theo", 650, 1035, { sc: 0.56, lh: [-70, -330], mouth: "smile" }), { t: 2.6, dur: 0.8 });

// Mary's house, inside: the six things to find
const house = () =>
  G(P(poly([400, -20], [1520, -20], [1520, 820], [400, 820]), { s: N.plasterEdge, f: N.plaster, w: 6 }), { t: 0, dur: 0.6 })
  + ground(820, 0.3, "#c9a66b", "#8a6a3a")
  + G(P(poly([500, 110], [720, 110], [720, 300], [500, 300]), { s: N.woodDark, f: C.sky, w: 9 }) + P(ln([610, 110], [610, 300]), { s: N.woodDark, w: 7 }), { t: 0.5, dur: 0.6 })
  + G(dove(612, 296, 1.35), { t: 1.0, dur: 0.5 })
  + G(P(ln([1130, 440], [1440, 440]), { s: N.woodDark, w: 14 }), { t: 0.6, dur: 0.3 }) + G(oilLamp(1285, 432, 1.5), { t: 1.1, dur: 0.5 })
  + G(table(900, 960, 400, 290), { t: 0.8, dur: 0.6 }) + G(loaf(870, 668, 1), { t: 1.3, dur: 0.5 })
  + G(jug(1185, 990, 1.1), { t: 1.5, dur: 0.5 }) + G(broom(1430, 985, 1), { t: 1.7, dur: 0.5 })
  + clutter();

// everyday things that aren't on the list: they make the six harder to spot (kept clear of the six, and none is a
// dove, lamp, loaf, jug, broom or cat)
function clutter() {
  const brown = { s: N.woodDark, f: N.wood, w: 7 }, cloth = { s: "#7a3412", f: "#c9a66b", w: 6 };
  const hanging = P(poly([800, 90], [1010, 90], [1010, 270], [800, 270]), { s: "#7a3a1a", f: "#d9a05b", w: 7 })
    + P(ln([830, 130], [980, 130]), { s: C.red, w: 8 }) + P(ln([830, 180], [980, 180]), { s: C.blue, w: 8 }) + P(ln([830, 230], [980, 230]), { s: C.red, w: 8 });
  const shelf = P(ln([440, 520], [720, 520]), { s: N.woodDark, w: 14 })
    + [490, 565, 650].map((x, i) => P(poly([x - 24, 520], [x - 18, 462 - i * 6], [x + 18, 462 - i * 6], [x + 24, 520]), { s: "#7a3412", f: i === 1 ? "#d9b26b" : N.clay, w: 6 })).join("");
  const onions = [0, 1, 2].map(i => P(ell(1120 + i * 6, 150 + i * 50, 18, 20), { s: "#8a5a2b", f: "#e9c27a", w: 5 })).join("") + P(ln([1126, 90], [1138, 260]), { s: N.woodDark, w: 5 });
  const stool = P(poly([520, 960], [650, 960], [660, 975], [510, 975]), brown) + P(ln([535, 975], [525, 1050]), { s: N.woodDark, w: 12 }) + P(ln([635, 975], [645, 1050]), { s: N.woodDark, w: 12 });
  const basket = P(cr([[740, 960], [750, 1030], [850, 1040], [880, 960], [810, 945], [740, 960]]), { s: "#7a5a2a", f: "#d6b46a", w: 6 }) + P(ln([760, 990], [868, 995]), { s: "#7a5a2a", w: 4 });
  const sack = P(bumpy(1010, 1010, 52, 62, 0.06, 5), cloth) + P(ln([990, 950], [1030, 950]), { s: "#7a3412", w: 8 });
  const bowl = P(cr([[1290, 1010], [1310, 1050], [1390, 1050], [1410, 1010], [1290, 1010]]), { s: "#7a3412", f: "#e4c9a0", w: 6 });
  const bucket = P(poly([1280, 830], [1380, 830], [1365, 920], [1295, 920]), { s: "#4a3a2a", f: "#9a7a52", w: 6 }) + P(cr([[1290, 830], [1330, 780], [1370, 830]]), { s: "#4a3a2a", w: 5 });
  const rug = P(ell(800, 1060, 170, 28), { s: C.red, f: "#f0a79c", w: 5 });
  const pegs = [1480, 1500].map(x => P(ln([x, 300], [x, 330]), { s: N.woodDark, w: 8 })).join("") + P(poly([1465, 330], [1510, 330], [1510, 470], [1465, 470]), { s: "#7a3412", f: "#c46a3a", w: 5 });
  return [hanging, shelf, onions, stool, basket, sack, bowl, bucket, rug, pegs].map((s, i) => G(s, { t: 0.8 + i * 0.12, dur: 0.4 })).join("");
}

const cat = (x, y, size) => ANIMAL_SET.animalSvg("cat", ANIMAL_SET.PART_ORDER).replace("<svg ", `<svg x="${x - size / 2}" y="${y - size / 2}" width="${size}" height="${size}" `);

export default {
  day: 1,
  title: "The magic door",
  sticker: {
    name: "Mary",
    found: "You found a sticker: Mary!",
    crayon: () => mary(0, 0, { sc: 1 }),
    at: [455, 905], scale: 0.42,      // in the big scene: in front of Mary's house in Nazareth
    showAt: 990, showScale: 2,
  },
  surprise: new URLSearchParams(location.search).has("surprise") ? trexSurprise : undefined,   // trial only: this surprise belongs on day 3
  steps: [
    { type: "story", scene: denScene, seed: 11, elf: { at: [1250, 0], kind: "leg" }, captions: [
      "This is Maya, and this is Theo.",
      "Maya has a magic red crayon. Whatever she draws comes to life!",
      "Today she is going to draw a door… into the very first Christmas.",
    ] },
    { type: "trace", scene: () => den(0, { rug: false }) + kids(0), seed: 12, elf: { at: [1250, 0], kind: "leg" },
      path: archDoorPath(DOOR.x, DOOR.y, DOOR.w, DOOR.h),
      prompt: "Help Maya draw the door! Start at the green dot.",
      done: doorDone, doneCaption: "A magic door! Let's go through…" },
    { type: "story", scene: nazareth, seed: 13, elf: { at: [612, 664], kind: "hat" }, captions: [
      "Behind the door is a little town called Nazareth, a long, long time ago.",
      "This is Mary. She lives here, in Nazareth.",
      "Soon Mary will get some very BIG news…",
    ] },
  ],
  star: {
    steps: [
      { type: "seek", scene: house, seed: 14, elf: { at: [690, 528], kind: "leg", s: 0.9 },
        prompt: "★ Can you find these six things in Mary's house?",
        doneCaption: "You found them all, and you found the cat!",
        items: [
          { id: "dove", label: "dove", at: [612, 262], r: 95, icon: () => dove(-5, 30, 1.5) },
          { id: "lamp", label: "lamp", at: [1290, 408], r: 95, icon: () => oilLamp(-5, 20, 1.6) },
          { id: "bread", label: "bread", at: [870, 645], r: 85, icon: () => loaf(0, 40, 1.7) },
          { id: "jug", label: "jug", at: [1190, 945], r: 85, icon: () => jug(-8, 60, 1.6) },
          { id: "broom", label: "broom", at: [1450, 875], r: 115, icon: () => broom(-20, 95, 0.8) },
          { id: "cat", label: "cat", at: [960, 885], r: 85, icon: () => cat(0, 0, 180), sticker: () => cat(960, 885, 150) },
        ] },
    ],
    after: house,
  },
};

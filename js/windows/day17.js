// Window 17 (Thu 17 Dec): find the star. Activity: sweep the telescope across the night sky until you find the brightest star.
// ★ Star challenge: spot the shape in the stars.

const sky2 = () => P(poly([420, -20], [1500, -20], [1500, 1100], [420, 1100]), { s: N.night, f: N.night, w: 2 });
const dull = [[560, 160], [780, 260], [1020, 140], [1260, 230], [1400, 120], [640, 480], [900, 560], [1180, 500], [1380, 640], [720, 760], [1040, 800], [1300, 860], [560, 900]];
const skyScene = (bright) => () => sky2() + dull.map(([x, y], i) => G(starP(x, y, 14 + (i % 3) * 4), { t: 0.1 + i * 0.05, dur: 0.2 })).join("") + (bright ? starP(...BRIGHT, 50) + planetArt() : "");
const BRIGHT = [1130, 340];
const PLANETS = [["saturn", 640, 560, 46, "That's Saturn, with its beautiful rings!"], ["jupiter", 980, 760, 62, "That's Jupiter, the biggest planet of all!"], ["mars", 1330, 560, 34, "That's Mars, the red planet!"]];
const planetArt = () => PLANETS.map(([k, x, y, r]) => planet(k, x, y, r)).join("");
const star = () => starP(...BRIGHT, 60) + [0, 1, 2, 3, 4, 5, 6, 7].map(i => P(ln([BRIGHT[0] + Math.cos(i * Math.PI / 4) * 80, BRIGHT[1] + Math.sin(i * Math.PI / 4) * 80], [BRIGHT[0] + Math.cos(i * Math.PI / 4) * 130, BRIGHT[1] + Math.sin(i * Math.PI / 4) * 130]), { s: "#fff3b0", w: 8 })).join("");

const roof = () => sky2() + dull.slice(0, 7).map(([x, y]) => starP(x, y, 16)).join("") + P(poly([420, 860], [1500, 860], [1500, 1100], [420, 1100]), { s: N.plasterEdge, f: N.plaster, w: 8 })
  + G(wiseman(760, 1040, { sc: 0.8, rh: [100, -300] }) + wiseman(1140, 1050, { sc: 0.8, c: "#2f7de1", hat: "#e8392c" }) + wiseman(1380, 1050, { sc: 0.8, c: "#43b04a", hat: "#f28c28" }), { t: 0.4, dur: 0.8 });

// shapes in the stars
const cluster = (pts, cx, cy) => pts.map(([dx, dy]) => starP(cx + dx, cy + dy, 22)).join("");
const SHAPES = { triangle: [[-70, 60], [70, 60], [0, -70]], line: [[-90, 0], [-30, 0], [30, 0], [90, 0]], square: [[-60, -60], [60, -60], [60, 60], [-60, 60]], cross: [[0, -80], [0, 0], [0, 80], [-70, 0], [70, 0]] };
const CX = [660, 960, 1260];
const shapeRound = (name, order, seed) => ({ type: "pick", seed, elf: { at: [1490, 200], kind: "hat" },
  scene: () => sky2() + order.map((k, i) => cluster(SHAPES[k], CX[i], 640)).join(""), options: order.map((_, i) => ({ at: [CX[i], 640], r: 150 })), answer: order.indexOf(name),
  prompt: `★ Which group of stars makes a ${name === "line" ? "straight line" : name}? Tap it!`, doneCaption: `Yes, that's the ${name}!` });

// which planet? (the star challenge also asks about the planets)
const planetRound = (name, clue, order, seed) => ({ type: "pick", seed, elf: { at: [1490, 200], kind: "hat" },
  scene: () => sky2() + order.map((k, i) => planet(k, CX[i], 640, k === "jupiter" ? 80 : k === "saturn" ? 56 : 50)).join(""), options: order.map((_, i) => ({ at: [CX[i], 640], r: 150 })), answer: order.indexOf(name),
  prompt: `★ ${clue} Tap the planet!`, doneCaption: `Yes, that's ${name[0].toUpperCase() + name.slice(1)}!` });

export default {
  day: 17,
  title: "Find the star",
  sticker: { name: "the Star", found: "You found a sticker: the Star!", crayon: () => star(), at: [3300, 480], scale: 0.4, showAt: 1000, showScale: 1.2 },
  steps: [
    { type: "story", scene: roof, seed: 171, elf: { at: [440, 300], kind: "ear" }, captions: [
      "Far away in the East, three wise men studied the stars.",
      "One night, they saw something wonderful: a new star, brighter than all the rest!",
      "It meant a great king had been born. Can you find it with their telescope?",
    ] },
    { type: "torch", scene: skyScene(false), seed: 172, dark: 0, lens: true, radius: 140, hidden: () => star() + planetArt(), reveal: skyScene(true), items: [{ id: "star", at: BRIGHT, r: 80 }, ...PLANETS.map(([k, x, y, r, say]) => ({ id: k, at: [x, y], r: r + 50, optional: true, say }))], elf: { at: [1490, 700], kind: "hat" },
      prompt: "Drag the telescope across the sky to find the brightest star. You might spot some planets on the way!", doneCaption: "There it is, the brightest star of all!" },
  ],
  star: { steps: [shapeRound("triangle", ["line", "triangle", "square"], 173), shapeRound("square", ["cross", "triangle", "square"], 174), planetRound("saturn", "Which planet has beautiful rings?", ["mars", "saturn", "jupiter"], 175), planetRound("mars", "Which one is the red planet?", ["jupiter", "saturn", "mars"], 176)], after: skyScene(true) },
};

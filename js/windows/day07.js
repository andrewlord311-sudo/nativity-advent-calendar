// Window 7 (Mon 7 Dec): the long road. Activity: lead the donkey along the winding path. ★ Star challenge: read the signposts.

const hills = () => sky(0) + sun(1360, 170, 0.1) + hillBand(420, 1500, 700, 70, 6, "#8dbb7a", "#4f7f4a", 1) + ground(820, 0.1);
const PATH = [[470, 960], [640, 900], [820, 960], [1000, 900], [1160, 800], [1000, 700], [820, 640], [940, 560], [1060, 500], [1140, 450]];
const smooth = pts => { const out = []; for (let i = 0; i < pts.length - 1; i++) for (let k = 0; k < 6; k++) { const u = k / 6, [a, b] = [pts[i], pts[i + 1]]; out.push([a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u]); } out.push(pts[pts.length - 1]); return out; };
const walkers = (x, y, sc = 0.55) => donkey(x, y, sc) + mary(x + 40, y - 120, { sc: sc * 0.7 }) + joseph(x - 130, y + 5, { sc: sc * 0.9 });

const start = () => hills() + G(walkers(700, 1000, 0.8), { t: 0.5, dur: 1 });
const road = () => hills() + P(cr(smooth(PATH)), { s: "#b99a63", w: 52 }) + G(signpost(1270, 500, [["Bethlehem", 1]], 0.9), { t: 0.6, dur: 0.5 });
const arrived = () => hills() + P(cr(smooth(PATH)), { s: "#b99a63", w: 52 }) + signpost(1270, 500, [["Bethlehem", 1]], 0.9) + walkers(1000, 560, 0.4);
const tired = () => hills() + G(walkers(900, 1000, 0.8), { t: 0.3, dur: 0.8 }) + G(palm(560, 900, 0.9), { t: 0.6, dur: 0.5 });

const post = (signs, seed, ans) => ({
  type: "pick", seed, elf: { at: [1450, 120], kind: "hat" }, scene: () => hills() + G(signpost(960, 1000, signs, 1.2), { t: 0.3, dur: 0.5 }),
  options: signs.map((_, i) => ({ at: [960, 1000 - 280 * 1.2 + i * 90 * 1.2], r: 90 })), answer: ans,
  prompt: "★ Which sign points to Bethlehem? Read the words and tap it!", doneCaption: "Yes! Bethlehem is that way.",
});

export default {
  day: 7,
  title: "The long road",
  sticker: { name: "the Signpost", found: "You found a sticker: the Signpost!", crayon: () => signpost(0, 0, [["Bethlehem", 1]], 0.5), at: [1090, 1030], scale: 0.7, showAt: 1000, showScale: 2 },
  steps: [
    { type: "story", scene: start, seed: 71, elf: { at: [440, 100], kind: "leg" }, captions: [
      "Mary and Joseph set off for Bethlehem, with their donkey.",
      "The road was long and winding. Can you help the donkey find the way?",
    ] },
    { type: "trace", scene: road, seed: 72, path: smooth(PATH), elf: { at: [1480, 780], kind: "hat" },
      prompt: "Lead the donkey along the path! Start at the green dot.", done: arrived, doneCaption: "Well done! You found the signpost to Bethlehem." },
    { type: "story", scene: tired, seed: 73, elf: { at: [440, 900], kind: "ear" }, captions: [
      "They walked for many days, over hills and through valleys.",
      "Mary was tired, but the donkey carried her carefully.",
    ] },
  ],
  star: { steps: [post([["Nazareth", -1], ["Bethlehem", 1], ["Egypt", -1]], 74, 1), post([["Jericho", 1], ["Nazareth", -1], ["Bethlehem", 1]], 75, 2)], after: () => hills() + signpost(960, 1000, [["Bethlehem", 1]], 1.2) },
};

// Window 2 (Wed 2 Dec): the angel's message. Activity: rub the dark window until the angel's light shines through.
// ★ Star challenge: put the angel's words in order.

const stickerAt = (m, x, y, w) => m.replace("<svg ", `<svg x="${x}" y="${y}" width="${w}" height="${w}" `);

const nightBg = (t = 0) => G(P(poly([420, -20], [1500, -20], [1500, 1100], [420, 1100]), { s: N.night, f: N.night, w: 2 }), { t, dur: 0.3 })
  + [[560, 120], [760, 220], [1180, 140], [1380, 260], [940, 90], [1320, 70]].map(([x, y], i) => G(starP(x, y, 22 + (i % 3) * 6), { t: t + 0.2 + i * 0.1, dur: 0.3 })).join("")
  + ground(880, t, N.nightHill, N.nightHillEdge);

const mayHouse = () => G(flatHouse(1130, 900, 380, 320, { lit: true, doorAt: -0.25 }), { t: 0.5, dur: 0.8 });

const evening = () => nightBg() + mayHouse() + G(mary(700, 1010, { sc: 1, rh: [80, -200] }), { t: 1.2, dur: 0.9 });
// the glow: a big golden light growing in the sky beside Mary, with rays
const glowing = () => nightBg()
  + G(P(ell(900, 520, 420, 470), { s: "#ffe27a", f: "#ffe680", w: 2 }), { t: 0.2, dur: 1.2 }) + G(P(ell(900, 520, 280, 320), { s: "#fff6c8", f: "#fffbe0", w: 2 }), { t: 0.7, dur: 1.0 })
  + mayHouse() + mary(700, 1010, { sc: 1, rh: [80, -200], lh: [-80, -200] })
  + G([0, 1, 2, 3, 4, 5, 6, 7].map(i => P(ln([820 + Math.cos(i * Math.PI / 4) * 480, 560 + Math.sin(i * Math.PI / 4) * 520], [820 + Math.cos(i * Math.PI / 4) * 640, 560 + Math.sin(i * Math.PI / 4) * 700]), { s: "#ffe680", w: 12 })).join(""), { t: 1.1, dur: 0.8 });

// what is under the dark: the angel, in a golden glow
const angel = () => nightBg(0) + mayHouse()
  + P(ell(800, 560, 380, 430), { s: "#fff6a8", f: "#fff3b0", w: 2 })
  + gabriel(800, 940, { sc: 1.35 })
  + mary(1230, 1020, { sc: 0.95, lh: [-80, -250], rh: [80, -250] });

const message = () => nightBg(0) + mayHouse() + P(ell(800, 560, 380, 430), { s: "#fff6a8", f: "#fff3b0", w: 2 }) + gabriel(800, 940, { sc: 1.35, rh: [135, -300] })
  + mary(1230, 1020, { sc: 0.95, lh: [-80, -250], rh: [80, -250] });

export default {
  day: 2,
  title: "The angel's message",
  sticker: {
    name: "Gabriel",
    found: "You found a sticker: Gabriel!",
    crayon: () => gabriel(0, 0, { sc: 0.9 }),
    at: [690, 590], scale: 0.4,
    showAt: 1000, showScale: 1.6,
  },
  steps: [
    { type: "story", scene: evening, seed: 21, elf: { at: [1380, 70], kind: "hat" }, captions: [
      "It is evening in Nazareth. Mary is at home, thinking.",
    ] },
    { type: "story", scene: glowing, seed: 28, elf: { at: [1380, 70], kind: "hat" }, captions: [
      "Suddenly, a strange golden glow shines in the dark…",
    ] },
    { type: "rub", scene: angel, seed: 22, elf: { at: [440, 330], kind: "ear" }, prompt: "Rub the dark away with your finger to see who is there!", doneCaption: "It's an angel! The angel Gabriel!" },
    { type: "story", scene: message, seed: 23, elf: { at: [1240, 612], kind: "hat" },
      top: () => stickerAt(MASCOTS.melody({ pose: "cheer" }), 1160, 130, 260),
      captions: [
        "“Do not be afraid, Mary,” said the angel. “I have good news!”",
        "“You are going to have a baby. You must call him Jesus.”",
        "Melody flew ahead to bring the happy news!",
      ] },
  ],
  star: {
    steps: [
      { type: "order", scene: message, seed: 3, words: ["Do", "not", "be", "afraid,", "Mary!"], prompt: "★ Put the angel's words in the right order!", doneCaption: "“Do not be afraid, Mary!”" },
      { type: "order", scene: message, seed: 5, words: ["You", "must", "call", "him", "Jesus."], prompt: "★ Now the baby's name. Put the words in order!", doneCaption: "“You must call him Jesus.”" },
    ],
    after: message,
  },
};

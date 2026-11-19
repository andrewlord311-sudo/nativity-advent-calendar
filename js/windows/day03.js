// Window 3 (Thu 3 Dec): Joseph the carpenter. Activity: nail a stool together (Barnaby holds the wood).
// ★ Star challenge: pick the plank that is exactly the right length.

const stickerAt = (m, x, y, w) => m.replace("<svg ", `<svg x="${x}" y="${y}" width="${w}" height="${w}" `);
const wall = () => P(poly([400, -20], [1520, -20], [1520, 880], [400, 880]), { s: N.plasterEdge, f: N.plaster, w: 6 }) + ground(880, 0.2, "#c9a66b", "#8a6a3a");
const bench = () => G(P(poly([470, 800], [1450, 800], [1450, 840], [470, 840]), { s: N.woodDark, f: N.wood, w: 8 }), { t: 0.3, dur: 0.5 });

const workshop = () => wall() + bench()
  + G(joseph(760, 960, { sc: 1.15, rh: [110, -170], lh: [-95, -220] }), { t: 0.6, dur: 0.9 }) + G(hammer(930, 860, 0.9, 25), { t: 1.2, dur: 0.4 })
  + G(plank(1300, 770, 280, 40), { t: 1.4, dur: 0.4 }) + G(plank(1300, 725, 240, 40), { t: 1.6, dur: 0.4 });

// the stool, waiting for its nails: the seat floats just above the legs
const stoolParts = () => wall()
  + P(poly([620, 580], [1300, 580], [1300, 640], [620, 640]), { s: N.woodDark, f: N.wood, w: 8 })
  + [660, 1260].map(x => P(poly([x - 30, 640], [x + 30, 640], [x + 30, 860], [x - 30, 860]), { s: N.woodDark, f: "#b07a3c", w: 7 })).join("")
  + G(hammer(1450, 960, 1, 15), { t: 0.5, dur: 0.4 });
const stoolBuilt = () => stool(960, 880, 2.6 / 2);
const NAILS = [[660, 600], [660, 790], [1260, 600], [1260, 790]];

const dreamBg = () => P(poly([420, -20], [1500, -20], [1500, 1100], [420, 1100]), { s: N.night, f: N.night, w: 2 })
  + [[560, 120], [1240, 200], [1380, 330], [760, 90]].map(([x, y]) => starP(x, y, 24)).join("") + ground(900, 0.1, N.nightHill, N.nightHillEdge);
const dream = () => dreamBg()
  + P(poly([420, 960], [1500, 960], [1500, 1100], [420, 1100]), { s: N.woodDark, f: "#c9a66b", w: 6 })
  + joseph(720, 1060, { sc: 0.9, shut: true })
  + P(bumpy(1190, 360, 270, 190, 0.1, 8), { s: "#9fb4d9", f: "#f4f8ff", w: 7 }) + gabriel(1190, 520, { sc: 0.65 });

// a gap in a shelf of a given length, and three planks. (the window asks which plank fits)
const shelf = (gap, lens) => wall()
  + P(poly([480, 520], [480 + 60, 520], [480 + 60, 760], [480, 760]), { s: N.woodDark, f: N.wood, w: 7 })
  + P(poly([540 + gap, 520], [600 + gap, 520], [600 + gap, 760], [540 + gap, 760]), { s: N.woodDark, f: N.wood, w: 7 })
  + lens.map((L, i) => plank(960, 840 + i * 80, L, 46)).join("");
const ROUNDS = [{ gap: 280, lens: [200, 280, 360], ans: 1 }, { gap: 340, lens: [340, 260, 420], ans: 0 }, { gap: 240, lens: [320, 190, 240], ans: 2 }];
const plankSvg = L => `<rect x="${-L / 2}" y="-23" width="${L}" height="46" rx="6" fill="#c08a4a" stroke="#5a3614" stroke-width="7"/><line x1="${-L / 2 + 16}" y1="0" x2="${L / 2 - 16}" y2="0" stroke="#9a6a30" stroke-width="4"/>`;
const round = (r, i) => ({
  type: "pick", scene: () => shelf(r.gap, r.lens), seed: 40 + i, elf: { at: [1440, 280], kind: "ear" },
  options: r.lens.map((L, k) => ({ at: [960, 840 + k * 80], r: Math.max(L / 2, 60),
    move: { svg: plankSvg(L), from: [960, 840 + k * 80], to: [540 + r.gap / 2, 640], say: L < r.gap ? "Too short! There's a gap." : "Too long! It won't fit." } })), answer: r.ans,
  prompt: `★ Which plank fits the gap exactly? (${i + 1} of 3)`, doneCaption: "Just right!",
});

export default {
  day: 3,
  title: "Joseph the carpenter",
  sticker: {
    name: "Joseph",
    found: "You found a sticker: Joseph!",
    crayon: () => joseph(0, 0, { sc: 0.9 }),
    at: [210, 935], scale: 0.4,
    showAt: 1000, showScale: 1.6,
  },
  steps: [
    { type: "story", scene: workshop, seed: 31, elf: { at: [1440, 930], kind: "leg" },
      top: () => stickerAt(MASCOTS.barnaby({ pose: "wave" }), 1170, 640, 300),
      captions: [
        "This is Joseph. He is a carpenter in Nazareth.",
        "He makes doors, tables and stools out of wood.",
        "Barnaby is helping today. Let's make a stool!",
      ] },
    { type: "nails", scene: stoolParts, seed: 32, spots: NAILS, ring: 62, built: stoolBuilt, elf: { at: [440, 300], kind: "ear" },
      prompt: "Tap each glowing spot to hammer a nail in!", doneCaption: "A strong stool! Well done." },
    { type: "story", scene: dream, seed: 33, elf: { at: [1000, 960], kind: "hat" }, captions: [
      "One night, Joseph had a dream.",
      "An angel said: “Do not be afraid to look after Mary. Her baby will be very special.”",
      "When Joseph woke up, he did just what the angel said.",
    ] },
  ],
  star: { steps: ROUNDS.map(round), after: () => shelf(280, [200, 280, 360]) },
};

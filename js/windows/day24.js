// Window 24 (Thu 24 Dec): Christmas Eve. Activity: slide the stable doors open; the light pours out and a lullaby plays. ★ Star challenge: find six things in the stable.

const shed = () => P(poly([400, -20], [1520, -20], [1520, 900], [400, 900]), { s: N.woodDark, f: "#a98355", w: 6 })
  + [520, 700, 880, 1060, 1240, 1420].map(x => P(ln([x, -20], [x, 900]), { s: N.woodDark, w: 5 })).join("") + ground(900, 0.1, "#d8bf7a", "#a8823f");
const birth = () => shed() + P(ell(960, 700, 420, 380), { s: "#fff6a8", f: "#fff3b0", w: 2 }) + manger(960, 880, 1.2) + baby(960, 745, 1.2)
  + joseph(600, 1000, { sc: 0.85, lh: [-70, -200] }) + mary(1330, 1010, { sc: 0.85, lh: [-110, -150] }) + ox(430, 1040, 0.4) + donkey(1160, 1060, 0.4) + starP(960, 90, 60);

// the star challenge: the stable with a dove on the beam and a lamp on its hook
const lit = () => birth() + P(ln([420, 330], [700, 330]), { s: N.woodDark, w: 14 }) + oilLamp(560, 322, 1.4) + P(ln([1250, 250], [1500, 250]), { s: N.woodDark, w: 14 }) + dove(1380, 244, 1.3);

export default {
  day: 24,
  title: "Christmas Eve",
  sticker: { name: "Baby Jesus", found: "You found a sticker: Baby Jesus!", crayon: () => manger(0, 0, 0.8) + baby(0, -150, 0.7), at: [2425, 1100], scale: 0.4, showAt: 1000, showScale: 1.6 },
  steps: [
    { type: "story", scene: () => shed() + G(joseph(600, 1000, { sc: 0.85 }) + mary(1330, 1010, { sc: 0.85 }) + manger(960, 880, 1.2), { t: 0.3, dur: 0.8 }), seed: 241, elf: { at: [1490, 160], kind: "ear" }, captions: [
      "It was Christmas Eve. The stars shone over Bethlehem.",
      "Inside the stable, something very special was about to happen…",
    ] },
    { type: "slide", scene: birth, seed: 242, elf: { at: [440, 160], kind: "ear" }, prompt: "Slide the stable doors open, very gently.",
      doneCaption: "Baby Jesus was born. Mary wrapped him up warmly and laid him in the manger." },
  ],  star: {
    steps: [
      { type: "seek", scene: lit, seed: 243, elf: { at: [1490, 560], kind: "hat" },
        prompt: "★ Can you find these six things in the stable?",
        doneCaption: "You found them all. What a wonderful night!",
        items: [
          { id: "star", label: "star", at: [960, 90], r: 95, icon: () => starP(0, 10, 55) },
          { id: "lamp", label: "lamp", at: [560, 300], r: 85, icon: () => oilLamp(0, 40, 1.6) },
          { id: "dove", label: "dove", at: [1380, 215], r: 85, icon: () => dove(0, 30, 1.5) },
          { id: "ox", label: "ox", at: [450, 960], r: 100, icon: () => ox(0, 60, 0.4) },
          { id: "donkey", label: "donkey", at: [1170, 975], r: 100, icon: () => donkey(0, 60, 0.4) },
          { id: "baby", label: "baby", at: [960, 745], r: 95, icon: () => baby(0, 20, 0.9) },
        ] },
    ],
    after: birth,
  },
};

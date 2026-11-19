// Window 8 (Tue 8 Dec): a night under the stars. Activity: tap the stars to light them (the owl hoots). ★ Star challenge: join the dots 1 to 20 to draw a sheep.

const owl = (x, y, size) => ANIMAL_SET.animalSvg("owl", ANIMAL_SET.PART_ORDER).replace("<svg ", `<svg x="${x - size / 2}" y="${y - size}" width="${size}" height="${size}" `);
const night = () => P(poly([420, -20], [1500, -20], [1500, 1100], [420, 1100]), { s: N.night, f: N.night, w: 2 }) + ground(850, 0.1, N.nightHill, N.nightHillEdge);
const OWL = [1280, 760];
const owlBranch = () => G(owlOnBranch(OWL[0], OWL[1], 1.05), { t: 0.5, dur: 0.8 });
const camp = () => night() + owlBranch() + G(P(ell(700, 960, 200, 60), { s: "#2a1a10", f: "#5a3a1e", w: 6 }), { t: 0.4, dur: 0.4 })
  + G(donkey(1200, 960, 0.8), { t: 0.6, dur: 0.6 }) + G(mary(850, 960, { sc: 0.75, shut: true }), { t: 0.9, dur: 0.6 }) + G(joseph(640, 960, { sc: 0.8, shut: true }), { t: 1.2, dur: 0.6 });
const STARS = [[560, 150], [760, 320], [940, 140], [1130, 300], [1330, 160], [1400, 400], [640, 520], [1000, 520]];
const dotsScene = () => night() + G(starP(1320, 200, 30), { t: 0.2, dur: 0.3 });
const SHEEP_DOTS = [[1260, 640], [1300, 580], [1260, 520], [1190, 540], [1150, 470], [1070, 430], [990, 450], [900, 420], [800, 450], [730, 520], [700, 610], [730, 700], [720, 810], [800, 810], [810, 720], [960, 730], [990, 810], [1075, 810], [1075, 700], [1150, 690]];
const sheepPic = () => night() + sheep(940, 850, 3.2);

export default {
  day: 8,
  title: "A night under the stars",
  sticker: { name: "the Owl", found: "You found a sticker: the Owl!", svg: () => owl(0, 0, 220), at: [1090, 390], scale: 0.8, showAt: 1000, showScale: 1.7 },
  steps: [
    { type: "story", scene: camp, seed: 81, elf: { at: [1460, 860], kind: "leg" }, captions: [
      "When night came, Mary and Joseph stopped to rest.",
      "They slept on the hillside under the stars.",
    ] },
    { type: "nails", scene: () => night() + owlOnBranch(OWL[0], OWL[1], 1.05), seed: 82, finalSound: "hoot", spots: STARS, ring: 70, word: "✨", elf: { at: [440, 860], kind: "hat" },
      spotDone: (x, y) => `<text x="${x}" y="${y + 30}" font-size="110" text-anchor="middle">⭐</text>`,
      prompt: "The night is dark, but a little owl is watching. Tap the stars to light them up!", doneCaption: "Hoo-hoo! The owl is watching over them. Look at all those stars!" },
  ],
  star: { steps: [{ type: "dots", scene: dotsScene, seed: 83, dots: SHEEP_DOTS, reveal: sheepPic, elf: { at: [1480, 860], kind: "hat" },
    prompt: "★ Join the dots from 1 to 20 to draw something woolly!", doneCaption: "It's a sheep!" }], after: sheepPic },
};

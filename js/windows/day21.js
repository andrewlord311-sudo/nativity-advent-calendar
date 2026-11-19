// Window 21 (Mon 21 Dec): lighting the lanterns. Activity: tap each lantern to light it. ★ Star challenge: copy the order the lanterns flash.

const night = () => P(poly([420, -20], [1500, -20], [1500, 1100], [420, 1100]), { s: N.night, f: N.night, w: 2 })
  + [[560, 120], [900, 200], [1240, 140], [1400, 320]].map(([x, y]) => starP(x, y, 24)).join("") + ground(880, 0.1, N.nightHill, N.nightHillEdge);
const POS = [[560, 560], [760, 640], [960, 540], [1160, 640], [1360, 560], [960, 800]];
const FREQ = [523.25, 587.33, 659.25, 783.99, 880, 1046.5];
const scene = () => night() + P(ln([480, 420], [1440, 420]), { s: N.woodDark, w: 12 }) + POS.map(([x, y], i) => G(lantern(x, y, 1.2), { t: 0.3 + i * 0.12, dur: 0.3 })).join("");
const lit = () => night() + P(ln([480, 420], [1440, 420]), { s: N.woodDark, w: 12 }) + POS.map(([x, y]) => P(ell(x, y - 20, 120, 120), { s: "#ffe27a", f: "#fff3b0", w: 2 }) + lantern(x, y, 1.2, true)).join("");

// the finished picture: the six lanterns lit, and the whole sky full of glowing lanterns
const EXTRA = [[520, 220], [700, 160], [900, 250], [1100, 170], [1300, 240], [1440, 160], [620, 420], [1240, 400], [800, 940], [1130, 960], [520, 920], [1380, 920]];
const litFull = () => lit() + EXTRA.map(([x, y]) => P(ell(x, y - 10, 70, 70), { s: "#ffe27a", f: "#fff3b0", w: 2 }) + lantern(x, y, 0.7, true)).join("");

export default {
  day: 21,
  title: "Lighting the lanterns",
  sticker: { name: "the Lanterns", found: "You found a sticker: the Lanterns!", crayon: () => lantern(-70, 0, 1, true) + lantern(70, 30, 0.9, true), at: [1775, 1130], scale: 0.5, showAt: 1000, showScale: 1.6 },
  steps: [
    { type: "story", scene: () => night() + G(flatHouse(700, 880, 260, 240, {}), { t: 0.3, dur: 0.5 }) + G(flatHouse(1250, 880, 300, 280, { doorAt: -0.25 }), { t: 0.5, dur: 0.5 }), seed: 211, elf: { at: [1490, 140], kind: "hat" }, captions: [
      "It was the longest night of the year, and it was very dark.",
      "The people of Bethlehem hung up lanterns to light the way. Will you help?",
    ] },
    { type: "nails", scene: scene, seed: 212, spots: POS.map(([x, y]) => [x, y]), ring: 80, word: "Whoosh!",
      built: litFull,
      spotDone: (x, y) => `<circle cx="${x}" cy="${y - 20}" r="95" fill="#fff3b0" opacity=".85"/><text x="${x}" y="${y + 20}" font-size="110" text-anchor="middle">🏮</text>`, elf: { at: [440, 700], kind: "ear" },
      prompt: "Tap each lantern to light it up!", doneCaption: "All the lanterns are shining. What a beautiful night!" },
  ],
  star: { steps: [{ type: "simon", scene: scene, seed: 213, lamps: POS.map(([x, y], i) => ({ at: [x, y - 20], r: 80, freq: FREQ[i] })), rounds: [[0, 2, 4], [1, 3, 5, 2], [4, 0, 3, 1, 5]], elf: { at: [440, 700], kind: "ear" },
    prompt: "★ Watch the order the lanterns flash, then copy it!", doneCaption: "You remembered all the patterns!" }], after: lit },
};

// Window 13 (Sun 13 Dec): mend the roof. Activity: tap the holes in the stable roof to patch them with straw.
// ★ Star challenge: drag each straw patch to the hole of the same shape.

const night = () => P(poly([420, -20], [1500, -20], [1500, 1100], [420, 1100]), { s: N.night, f: N.night, w: 2 })
  + [[560, 120], [900, 200], [1240, 140], [1400, 300], [700, 330]].map(([x, y]) => starP(x, y, 24)).join("") + ground(880, 0.1, N.nightHill, N.nightHillEdge);
const HOLES = [[780, 520], [860, 505], [960, 455], [1060, 505], [1140, 520]];
const holeArt = ([x, y]) => P(ell(x, y, 44, 34), { s: "#1a1208", f: "#1a1208", w: 4 });
const roofScene = () => night() + G(stable(960, 880, 520, 360), { t: 0.3, dur: 0.8 }) + HOLES.map(holeArt).join("") + G(joseph(640, 1030, { sc: 0.7, rh: [100, -300] }), { t: 1, dur: 0.6 });

// the shapes game: three differently shaped holes, three matching patches
const SHAPES = {
  circle: (x, y, f) => P(ell(x, y, 50, 50), f),
  square: (x, y, f) => P(poly([x - 46, y - 46], [x + 46, y - 46], [x + 46, y + 46], [x - 46, y + 46]), f),
  triangle: (x, y, f) => P(poly([x, y - 54], [x + 54, y + 42], [x - 54, y + 42]), f),
};
const HOLE = { s: "#1a1208", f: "#1a1208", w: 4 }, PATCH = { s: "#8a6a1a", f: "#eccb5e", w: 7 };
const SPOTS = { circle: [820, 560], square: [960, 480], triangle: [1100, 560] };
const OFF = { circle: [680, 990], square: [960, 990], triangle: [1240, 990] };
const shapeScene = () => night() + stable(960, 880, 520, 360);
const ITEMS = Object.keys(SHAPES).map(k => ({ kind: k, at: OFF[k], r: 90, art: () => SHAPES[k](...OFF[k], PATCH), final: SPOTS[k] }));
const ZONES = ITEMS.map(it => ({ kind: it.kind, at: it.final, r: 70, ghost: () => SHAPES[it.kind](...it.final, HOLE) }));

export default {
  day: 13,
  title: "Mend the roof",
  sticker: { name: "the Stable Roof", found: "You found a sticker: the Stable Roof!", crayon: () => stable(0, 60, 260, 170), at: [1510, 730], scale: 0.5, showAt: 1000, showScale: 1.5 },
  steps: [
    { type: "story", scene: () => night() + G(stable(960, 880, 520, 360), { t: 0.3, dur: 0.8 }) + G(joseph(640, 1030, { sc: 0.7 }) + mary(1280, 1030, { sc: 0.7 }), { t: 1, dur: 0.7 }), seed: 131, elf: { at: [1480, 140], kind: "hat" }, captions: [
      "The wind blew cold across Bethlehem. Mary and Joseph looked up at the stable roof.",
      "It had holes in it, and the cold night was coming in. Joseph wanted to mend it with straw!",
    ] },
    { type: "nails", scene: roofScene, seed: 132, spots: HOLES, ring: 60, word: "Patch!", elf: { at: [440, 400], kind: "ear" },
      spotDone: (x, y) => `<ellipse cx="${x}" cy="${y}" rx="52" ry="42" fill="#eccb5e" stroke="#8a6a1a" stroke-width="7"/><path d="M${x - 30},${y - 8} l50,10 M${x - 26},${y + 14} l48,-8" stroke="#b8902a" stroke-width="5" stroke-linecap="round"/>`,
      prompt: "Tap each hole in the roof to patch it with straw!", doneCaption: "The roof is mended. Now the stable is warm and snug!" },
  ],
  star: { steps: [{ type: "drag", scene: shapeScene, seed: 133, items: ITEMS, zones: ZONES, snap: true, elf: { at: [440, 400], kind: "ear" },
    prompt: "★ Drag each straw patch onto the hole with the same shape.", doneCaption: "Every hole is patched, and the shapes all match!" }], after: roofScene },
};

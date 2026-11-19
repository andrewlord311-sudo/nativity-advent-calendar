// Window 12 (Sat 12 Dec): a bed for the baby. Activity: build the manger from four pieces (Barnaby drops in the straw).
// ★ Star challenge: the same, with nine pieces.

const sticker = (m, x, y, w) => m.replace("<svg ", `<svg x="${x - w / 2}" y="${y - w / 2}" width="${w}" height="${w}" `);
const shed = () => P(poly([400, -20], [1520, -20], [1520, 900], [400, 900]), { s: N.woodDark, f: "#a98355", w: 6 })
  + [520, 700, 880, 1060, 1240, 1420].map(x => P(ln([x, -20], [x, 900]), { s: N.woodDark, w: 5 })).join("") + ground(900, 0.1, "#6a4a22", "#3a2410");
const scene = () => shed();

const P4 = {
  legA: (x, y) => P(ln([x - 55, y + 70], [x + 55, y - 70]), { s: N.woodDark, w: 18 }),
  legB: (x, y) => P(ln([x + 55, y + 70], [x - 55, y - 70]), { s: N.woodDark, w: 18 }),
  trough: (x, y) => P(poly([x - 170, y - 40], [x + 170, y - 40], [x + 120, y + 40], [x - 120, y + 40]), { s: N.woodDark, f: N.wood, w: 8 }),
  straw: (x, y) => P(cr([[x - 140, y + 18], [x - 70, y - 20], [x, y - 2], [x + 80, y - 22], [x + 140, y + 18]]), { s: "#a8823f", f: N.straw, w: 7 }),
  hay: (x, y) => P(cr([[x - 30, y + 12], [x - 12, y - 18], [x + 4, y + 2], [x + 18, y - 16], [x + 30, y + 12]]), { s: "#a8823f", f: N.straw, w: 6 }),
  cloth: (x, y) => P(bumpy(x, y, 90, 26, 0.1, 6), { s: "#9fb4d9", f: "#f4f8ff", w: 6 }),
};
const FIN = { legA: [905, 860], legB: [1015, 860], trough: [960, 735], straw: [960, 660] };
const mk = (kind, from, to, art = kind.replace(/\d/g, "")) => ({ kind, at: from, r: 100, art: () => P4[art](...from), art2: P4[art], final: to });
const zonesFor = (items, big) => items.map(it => ({ kind: it.kind, at: it.final, r: big ? 58 : 66, stroke: "#f7a800", ghost: () => it.art2(...it.final) }));
const ITEMS4 = [mk("trough", [640, 1000], FIN.trough), mk("legA", [1330, 1000], FIN.legA), mk("straw", [960, 1010], FIN.straw), mk("legB", [1330, 880], FIN.legB)];
// nine clear pieces: two crossed legs, a crossbar, a base board, two side boards, two bundles of straw and a soft cloth
const shed9 = () => P(poly([400, -20], [1520, -20], [1520, 640], [400, 640]), { s: N.plasterEdge, f: "#efe3c4", w: 6 }) + ground(640, 0.1, "#b58a52", "#6a4a22");
const P9 = {
  legA: P4.legA, legB: P4.legB,
  cross: (x, y) => P(poly([x - 75, y - 9], [x + 75, y - 9], [x + 75, y + 9], [x - 75, y + 9]), { s: N.woodDark, f: "#b07a3c", w: 7 }),
  base: (x, y) => P(poly([x - 130, y - 14], [x + 130, y - 14], [x + 130, y + 14], [x - 130, y + 14]), { s: N.woodDark, f: N.wood, w: 7 }),
  sideL: (x, y) => P(poly([x - 26, y - 44], [x + 8, y - 44], [x + 30, y + 44], [x - 4, y + 44]), { s: N.woodDark, f: N.wood, w: 7 }),
  sideR: (x, y) => P(poly([x - 8, y - 44], [x + 26, y - 44], [x + 4, y + 44], [x - 30, y + 44]), { s: N.woodDark, f: N.wood, w: 7 }),
  straw: (x, y) => P(ell(x, y, 56, 26), { s: "#a8823f", f: "#f0d060", w: 7 }) + [-36, -14, 12, 34].map((dx, i) => P(ln([x + dx, y - 14], [x + dx + (i % 2 ? 10 : -8), y + 16]), { s: "#b8902a", w: 5 })).join("") + P(ln([x - 8, y - 26], [x - 8, y + 26]), { s: "#8a5a2b", w: 8 }),
  cloth: (x, y) => P(bumpy(x, y, 64, 20, 0.1, 6), { s: "#7f98c9", f: "#f4f8ff", w: 6 }),
};
const K9 = 1.35, fin9 = ([x, y]) => [960 + (x - 960) * K9, 540 + (y - 540) * K9];   // everything drawn 35% bigger so the pieces are easy to see and grab
const FIN9 = Object.fromEntries(Object.entries({ legA: [960, 590], legB: [960, 590], cross: [960, 625], base: [960, 470], sideL: [862, 422], sideR: [1058, 422], strawL: [905, 392], strawR: [1015, 392], cloth: [960, 372] }).map(([k, v]) => [k, fin9(v)]));
const START9 = { legA: [600, 800], legB: [960, 800], cross: [1330, 800], base: [620, 915], sideL: [960, 915], sideR: [1330, 915], strawL: [600, 1020], strawR: [960, 1020], cloth: [1330, 1020] };
const big = f => (x, y) => `<g transform="translate(${x} ${y}) scale(${K9}) translate(${-x} ${-y})">${f(x, y)}</g>`;
const ART9 = { legA: "legA", legB: "legB", cross: "cross", base: "base", sideL: "sideL", sideR: "sideR", strawL: "straw", strawR: "straw", cloth: "cloth" };
const ITEMS9 = Object.keys(START9).map(k => ({ kind: k, at: START9[k], r: 95, art: () => big(P9[ART9[k]])(...START9[k]), art2: big(P9[ART9[k]]), final: FIN9[k] }));
const ZONES9 = ITEMS9.map(it => ({ kind: it.kind, at: it.final, r: 62, ghost: () => it.art2(...it.final) }));
// after dropping, the piece sits where the scene's final centre is: draw each piece's art relative to its OWN start, so snapping moves it by (final - start)
const built = () => scene() + manger(960, 880, 1.2);

export default {
  day: 12,
  title: "A bed for the baby",
  sticker: { name: "the Manger", found: "You found a sticker: the Manger!", crayon: () => manger(0, 0, 0.8), at: [2220, 1295], scale: 0.38, showAt: 1000, showScale: 1.5 },
  steps: [
    { type: "story", scene: () => scene() + G(joseph(560, 1000, { sc: 0.85 }) + mary(1380, 1000, { sc: 0.8 }), { t: 0.5, dur: 0.8 }), seed: 121, elf: { at: [1490, 300], kind: "ear" }, top: () => sticker(MASCOTS.barnaby({ pose: "wave" }), 960, 760, 260), captions: [
      "The baby would need somewhere soft and safe to sleep.",
      "In a stable, animals eat from a wooden box called a manger.",
      "Joseph and Barnaby made a bed from it. Can you help build it?",
    ] },
    { type: "drag", scene: scene, seed: 122, items: ITEMS4, zones: zonesFor(ITEMS4), snap: true, elf: { at: [1490, 300], kind: "ear" }, prompt: "Drag each piece onto its faint outline to build the manger!", doneCaption: "The manger is ready! Barnaby drops in the soft straw." },
  ],
  star: { steps: [{ type: "drag", scene: shed9, seed: 123, items: ITEMS9, zones: ZONES9, snap: true, elf: { at: [1490, 300], kind: "ear" },
    prompt: "★ Build the manger from nine pieces! Put each piece on its faint outline.", doneCaption: "A cosy bed, made with nine pieces!" }], after: built },
};

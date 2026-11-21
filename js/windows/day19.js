// Window 19 (Sat 19 Dec): the camel caravan. Activity: tap each dune to make the camel hop over it (it can't fall). ★ Star challenge: a longer ride: trace the winding path and collect the stars.

const desert = () => sky(0) + sun(1360, 170, 0.1) + ground(900, 0.1, "#e0c27a", "#b58a3a");
const DUNES = [[560, 780], [780, 740], [1000, 790], [1200, 740], [1380, 790]];
const scene = () => desert() + DUNES.map(([x, y], i) => G(dune(x, y + 120, 300, 130), { t: 0.2 + i * 0.12, dur: 0.4 })).join("");   // the camel itself is the hopping figure (see the nails step)
const trail = [[480, 1000], [640, 900], [800, 960], [960, 840], [1120, 900], [1260, 760], [1120, 660], [960, 600], [1120, 500], [1300, 440], [1420, 360]];
const smooth = pts => { const out = []; for (let i = 0; i < pts.length - 1; i++) for (let k = 0; k < 6; k++) { const u = k / 6, [a, b] = [pts[i], pts[i + 1]]; out.push([a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u]); } out.push(pts[pts.length - 1]); return out; };
const longRide = () => desert() + P(cr(smooth(trail)), { s: "#c9a14a", w: 50 }) + [[800, 960], [1120, 900], [960, 600], [1300, 440], [640, 900]].map(([x, y]) => starP(x, y - 60, 30)).join("");
const arrived = () => desert() + P(cr(smooth(trail)), { s: "#c9a14a", w: 50 }) + camel(1320, 460, 0.5) + [[800, 960], [1120, 900], [960, 600], [1300, 440], [640, 900]].map(([x, y]) => starP(x, y - 60, 30)).join("");

export default {
  day: 19,
  title: "The camel caravan",
  sticker: { name: "the Camels", found: "You found a sticker: the Camels!", crayon: () => camel(-100, 120, 0.55) + camel(110, 150, 0.45), at: [3150, 1270], scale: 0.55, showAt: 1000, showScale: 1.5 },
  steps: [
    { type: "story", scene: () => desert() + G(wiseman(640, 1020, { sc: 0.8 }) + wiseman(1260, 1030, { sc: 0.8, c: "#2f7de1", hat: "#e8392c" }) + camel(950, 1080, 0.8), { t: 0.4, dur: 0.9 }), seed: 191, elf: { at: [440, 840], kind: "ear" }, captions: [
      "The wise men followed the star across the desert, riding on camels.",
      "It was a very long journey, over many sandy dunes.",
    ] },
    { type: "nails", scene: scene, seed: 192, ordered: true, spots: DUNES.map(([x, y]) => [x, y + 20]), ring: 90, word: "Hop!", sounds: DUNES.map(() => "hee"),
      mover: { art: () => camel(0, 0, 0.55), from: [560, 1050], to: ([x, y]) => [x - 55, y + 20], arc: 230 },
      spotDone: (x, y) => `<ellipse cx="${x}" cy="${y + 20}" rx="42" ry="12" fill="#b58a3a" opacity=".55"/>`, elf: { at: [1490, 360], kind: "hat" },
      prompt: "Tap each dune, one after another, and watch the camel hop over it!", doneCaption: "The camels hopped over every dune!" },
  ],
  star: { steps: [{ type: "trace", scene: longRide, seed: 193, path: smooth(trail), done: arrived, elf: { at: [1490, 900], kind: "hat" }, prompt: "★ A longer ride! Trace the winding path and collect the stars.", doneCaption: "What a long journey! You collected all the stars." }], after: arrived },
};

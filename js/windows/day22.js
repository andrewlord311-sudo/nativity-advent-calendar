// Window 22 (Tue 22 Dec): the stable at night. Activity: spot three differences between two pictures. ★ Star challenge: spot seven.

const panel = (dy, B, diffs) => {
  const has = i => !(B && diffs.includes(i));
  const y = dy;
  return `<g transform="translate(420 ${y})">`
    + P(poly([0, 0], [1080, 0], [1080, 540], [0, 540]), { s: N.night, f: N.night, w: 2 })
    + (has(0) ? moon(900, 90, 55) : "") + (has(4) ? cloud(300, 160, 1) : "") + (has(5) ? dove(780, 215, 0.7) : "")
    + starP(540, 70, B && diffs.includes(3) ? 22 : 34)
    + ground(440, 0, N.nightHill, N.nightHillEdge) + stable(540, 450, 300, 180)
    + sheep(250, 500, 0.8) + sheep(390, 505, 0.8) + (has(1) ? sheep(120, 505, 0.8) : "")
    + ox(800, 505, 0.45) + (has(6) ? tree(980, 470, 0.3) : "")
    + lantern(700, 360, 0.5, has(2))
    + `</g>`;
};
const scene = diffs => () => panel(0, false, diffs) + panel(540, true, diffs);
const D3 = [0, 1, 2], D7 = [0, 1, 2, 3, 4, 5, 6];
const REG = [[900, 90], [120, 480], [700, 360], [540, 70], [300, 160], [780, 190], [980, 420]].map(([x, y]) => ({ at: [420 + x, 540 + y], r: 70 }));

export default {
  day: 22,
  title: "The stable at night",
  sticker: { name: "the Moon", found: "You found a sticker: the Moon!", crayon: () => moon(0, 0, 90), at: [2000, 470], scale: 0.7, showAt: 1000, showScale: 1.6 },
  steps: [
    { type: "story", scene: () => panel(0, false, []).replace("translate(420 0)", "translate(420 270)") + P(poly([420, 0], [1500, 0], [1500, 270], [420, 270]), { s: N.night, f: N.night, w: 2 }), seed: 221, elf: { at: [440, 200], kind: "ear" }, captions: [
      "Night came to Bethlehem. The stable was quiet and still.",
      "The stars were out, and the sheep were sleeping.",
      "Here are two pictures of the stable. They look the same… but they are not quite!",
    ] },
    { type: "diff", scene: scene(D3), seed: 222, regions: REG.filter((_, i) => D3.includes(i)), elf: { at: [1490, 560], kind: "hat" }, prompt: "Spot 3 differences!", doneCaption: "You found all three differences!" },
  ],
  star: { steps: [{ type: "diff", scene: scene(D7), seed: 223, regions: REG, elf: { at: [1490, 560], kind: "hat" }, prompt: "★ Spot 7 differences!", doneCaption: "All seven found. Sharp eyes!" }], after: scene([]) },
};

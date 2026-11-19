// Window 16 (Wed 16 Dec): the lost lamb. Activity: move your torch over the dark hill to find the lamb. ★ Star challenge: follow the clues to the right rock.

// a red fox seen from the side, facing right: bushy white-tipped tail, dark stockings, pointed snout (feet at x, y)
const fox = (x, y, s = 1) => {
  const T = pts => pts.map(([a, b]) => [x + a * s, y + b * s]), O = { s: C.ink, f: "#d9612a", w: 5 }, DK = { s: C.ink, f: "#3a2418", w: 4 }, WH = { s: C.ink, f: "#fff7ec", w: 4 };
  const leg = (a, h = 0) => P(poly(...T([[a, -62], [a + 15, -62], [a + 13 + h, 0], [a - 3 + h, 0]])), DK);
  return P(cr(T([[-70, -92], [-118, -118], [-172, -108], [-204, -70], [-190, -36], [-150, -42], [-108, -56], [-68, -66], [-70, -92]])), O)
    + P(cr(T([[-204, -70], [-190, -36], [-176, -40], [-182, -78], [-204, -70]])), WH)
    + leg(-60, -4) + leg(40, 6)
    + P(cr(T([[-78, -96], [-35, -114], [30, -114], [68, -100], [72, -72], [40, -54], [-30, -54], [-72, -64], [-78, -96]])), O)
    + leg(-38, 4) + leg(18, -4)
    + P(cr(T([[30, -112], [70, -128], [98, -118], [96, -92], [66, -58], [32, -62], [30, -112]])), O)
    + P(cr(T([[40, -108], [58, -86], [66, -64], [48, -52], [34, -80], [40, -108]])), WH)
    + P(poly(...T([[88, -138], [96, -182], [116, -142]])), O) + P(poly(...T([[96, -148], [97, -172], [106, -148]])), DK)
    + P(poly(...T([[114, -142], [132, -178], [138, -130]])), O) + P(poly(...T([[122, -142], [131, -164], [132, -138]])), DK)
    + P(cr(T([[58, -112], [86, -142], [122, -146], [158, -118], [124, -104], [96, -92], [62, -92], [58, -112]])), O)
    + P(cr(T([[92, -98], [124, -106], [158, -118], [128, -98], [96, -90], [92, -98]])), WH)
    + dot(...T([[162, -118]])[0], 7 * s) + dot(...T([[112, -126]])[0], 5 * s);
};
const night = () => P(poly([420, -20], [1500, -20], [1500, 1100], [420, 1100]), { s: N.night, f: N.night, w: 2 })
  + [[560, 120], [900, 200], [1240, 140], [1400, 300], [700, 330]].map(([x, y]) => starP(x, y, 24)).join("") + ground(560, 0.1, N.nightHill, N.nightHillEdge);
const hillScene = () => night() + rock(600, 760, 190, 130) + rock(1320, 700, 250, 170) + rock(1000, 1010, 170, 110) + G(palm(820, 800, 0.8), { t: 0.5, dur: 0.4 });
const LAMB = [1330, 800], FOX = [640, 940];
const withAnimals = () => hillScene() + sheep(LAMB[0], LAMB[1] + 60, 1.1) + fox(FOX[0], FOX[1], 1);

// clues for the star challenge: which rock hides the lamb?
const R = [[640, 880, 190, 130], [960, 900, 250, 170], [1290, 880, 150, 100]];
const rocks = () => night() + G(rock(...R[0]) + rock(...R[1]) + rock(...R[2]), { t: 0.2, dur: 0.3 });
const clue = (txt, ans, seed, extra = "") => ({ type: "pick", seed, scene: () => rocks() + extra, elf: { at: [1490, 200], kind: "hat" }, options: R.map(([x, y, w, h]) => ({ at: [x, y - h / 2], r: Math.max(w / 2, 90) })), answer: ans,
  prompt: `★ Clue: ${txt} Tap that rock!`, doneCaption: "Baa! The lamb was hiding there!",
  reveal: i => sheep(R[i][0] + R[i][2] / 2 + 70, R[i][1] + 10, 1.2), wrongSay: "No lamb behind that rock. Read the clue again!" });

export default {
  day: 16,
  title: "The lost lamb",
  sticker: { name: "the Lamb", found: "You found a sticker: the Lamb!", crayon: () => sheep(0, 0, 1.6), at: [3070, 1180], scale: 0.5, showAt: 1000, showScale: 1.6 },
  steps: [
    { type: "story", scene: () => night() + G(shepherd(780, 1060, { sc: 0.9 }), { t: 0.3, dur: 0.6 }) + G(sheep(1100, 940, 1.3), { t: 0.7, dur: 0.4 }), seed: 161, elf: { at: [440, 300], kind: "ear" }, captions: [
      "On the hillside, it was very dark. The shepherd counted his sheep… and one little lamb was missing!",
      "Can you help find the lost lamb with a torch?",
    ] },
    { type: "torch", scene: withAnimals, seed: 162, items: [{ id: "lamb", at: LAMB, r: 110, say: "Baa! Found the lamb!" }, { id: "fox", at: FOX, r: 110, say: "A fox! It is only looking. Keep going!" }], radius: 150,
      elf: { at: [1490, 560], kind: "hat" }, prompt: "It's dark! Drag your finger to move the torch and find the lamb… and who else is out tonight?", doneCaption: "You found the lamb, and the fox too!" },
  ],
  star: { steps: [clue("The lamb is hiding behind the BIGGEST rock.", 1, 163), clue("The lamb is hiding behind the SMALLEST rock.", 2, 164), clue("The lamb is NOT behind the big rock or the small one.", 0, 165)], after: hillScene },
};

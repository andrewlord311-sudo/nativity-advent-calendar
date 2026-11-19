// Window 25 (Fri 25 Dec): Christmas Day, the last window. Activity: bring everyone to the stable (drag each person and animal onto its faint outline).
// Then the grand finale scene: the FULL nativity, with everyone and everything in it. (No star challenge: this is the big finish.)

const night = () => P(poly([420, -20], [1500, -20], [1500, 1100], [420, 1100]), { s: N.night, f: N.night, w: 2 })
  + [[480, 110], [640, 200], [820, 90], [1100, 120], [1300, 220], [1440, 100], [560, 340], [1380, 360], [720, 300], [1220, 320]].map(([x, y]) => starP(x, y, 22)).join("");

// ---------- the gathering game
const base = () => night() + G(starP(960, 120, 70), { t: 0.2, dur: 0.4 }) + ground(700, 0.1, N.nightHill, N.nightHillEdge) + G(stable(960, 600, 340, 230), { t: 0.3, dur: 0.7 }) + manger(960, 650, 0.6);
const PIECES = {
  mary:     { at: [860, 665], sc: 0.4,  art: (x, y) => mary(x, y, { sc: 0.4 }) },
  joseph:   { at: [1060, 665], sc: 0.4, art: (x, y) => joseph(x, y, { sc: 0.4 }) },
  baby:     { at: [960, 640], sc: 1,    art: (x, y) => baby(x, y, 0.55) },
  ox:       { at: [730, 665], sc: 0.3,  art: (x, y) => ox(x, y, 0.3) },
  donkey:   { at: [1190, 665], sc: 0.3, art: (x, y) => donkey(x, y, 0.28) },
  shepherd: { at: [600, 675], sc: 0.4,  art: (x, y) => shepherd(x, y, { sc: 0.4 }) },
  sheep:    { at: [500, 680], sc: 1,    art: (x, y) => sheep(x, y, 0.8) },
  wise1:    { at: [1320, 675], sc: 0.4, art: (x, y) => wiseman(x, y, { sc: 0.4 }) },
  wise2:    { at: [1420, 690], sc: 0.38, art: (x, y) => wiseman(x, y, { sc: 0.38, c: "#2f7de1", hat: "#e8392c" }) },
  angel:    { at: [640, 380], sc: 0.34, art: (x, y) => gabriel(x, y, { sc: 0.34 }) },
};
const START = { mary: [540, 850], joseph: [750, 850], baby: [960, 830], ox: [1170, 850], donkey: [1380, 850], shepherd: [540, 1055], sheep: [780, 1055], wise1: [1000, 1055], wise2: [1200, 1055], angel: [1400, 1055] };
const ITEMS = Object.keys(PIECES).map(k => ({ kind: k, at: START[k], r: 95, art: () => PIECES[k].art(...START[k]), art2: PIECES[k].art, final: PIECES[k].at }));
const ZONES = ITEMS.map(it => ({ kind: it.kind, at: it.final, r: 90, ring: 78, ringUp: 60, ghost: () => it.art2(...it.final) }));

// ---------- the grand scene: everyone, everything, built up piece by piece
const beam = () => P(poly([940, 150], [980, 150], [1160, 860], [760, 860]), { s: "#fff3b0", f: "#fff3b0", w: 2 });
const rays = () => [...Array(12)].map((_, i) => { const a = i * Math.PI / 6; return P(ln([960 + Math.cos(a) * 96, 130 + Math.sin(a) * 96], [960 + Math.cos(a) * 170, 130 + Math.sin(a) * 170]), { s: "#fff3b0", w: 10 }); }).join("");
const grand = () => night()
  + [[600, 500], [1330, 540], [520, 260], [1420, 280], [880, 380], [1060, 400], [700, 640], [1240, 650]].map(([x, y]) => starP(x, y, 14)).join("")
  + G(beam(), { t: 0.3, dur: 1.2 }) + G(P(ell(960, 130, 120, 120), { s: "#fff6c8", f: "#fffbe0", w: 2 }) + rays() + starP(960, 130, 80), { t: 0.5, dur: 1 })
  + ground(800, 0.2, N.nightHill, N.nightHillEdge)
  + G(stable(960, 860, 500, 340), { t: 0.8, dur: 0.9 })
  + G(ox(770, 840, 0.55) + donkey(1160, 840, 0.5), { t: 1.6, dur: 0.7 })
  + G(manger(960, 925, 1.1), { t: 2.0, dur: 0.6 }) + G(baby(960, 790, 1.05), { t: 2.5, dur: 0.6 })
  + G(mary(830, 960, { sc: 0.72, lh: [-110, -150] }) + joseph(1100, 970, { sc: 0.74, lh: [-70, -200] }), { t: 3.0, dur: 0.8 })
  + G(giftArt("gold", 880, 1070, 0.6) + giftArt("frankincense", 960, 1075, 0.6) + giftArt("myrrh", 1040, 1070, 0.6), { t: 3.6, dur: 0.6 })
  + G(shepherd(560, 990, { sc: 0.66 }) + shepherd(650, 1010, { sc: 0.6, c: "#8a5a2b" }) + sheep(490, 1050, 1.1) + sheep(740, 1060, 0.95) + sheep(600, 1070, 0.9), { t: 4.0, dur: 0.9 })
  + G(camel(1380, 900, 0.5) + wiseman(1290, 1000, { sc: 0.62 }) + wiseman(1370, 1015, { sc: 0.6, c: "#2f7de1", hat: "#e8392c" }) + wiseman(1445, 1030, { sc: 0.56, c: "#43b04a", hat: "#f28c28" }), { t: 4.6, dur: 0.9 })
  + G(gabriel(600, 360, { sc: 0.45 }) + gabriel(780, 250, { sc: 0.4 }) + gabriel(1150, 240, { sc: 0.4 }) + gabriel(1330, 370, { sc: 0.45 }), { t: 5.4, dur: 1 })
  + [[700, 180], [1230, 170], [560, 560], [1380, 640], [880, 220], [1050, 260]].map(([x, y], i) => sparkle(x, y, 24, 6 + i * 0.3, "#f7d117")).join("");

export default {
  day: 25,
  title: "Christmas Day",
  sticker: { name: "the Nativity", found: "You found a sticker: the Nativity!", crayon: () => stable(0, 70, 280, 190) + starP(0, -190, 36) + baby(0, 20, 0.5), at: [2620, 430], scale: 0.55, showAt: 1000, showScale: 1.5 },
  steps: [
    { type: "story", scene: () => night() + G(starP(960, 130, 80), { t: 0.2, dur: 0.5 }) + ground(780, 0.1, N.nightHill, N.nightHillEdge) + G(stable(960, 760, 300, 200), { t: 0.4, dur: 0.7 })
        + G(shepherd(560, 1000, { sc: 0.7 }) + sheep(700, 1040, 1.0), { t: 1.2, dur: 0.7 }) + G(camel(1350, 960, 0.45) + wiseman(1260, 1010, { sc: 0.6 }), { t: 1.6, dur: 0.7 }),
      seed: 251, elf: { at: [440, 700], kind: "ear" }, captions: [
      "At last it was Christmas Day! Everyone in the story was hurrying to Bethlehem.",
      "The shepherds ran down from the hills. The wise men rode in from the desert, following the great star.",
      "They all wanted to see the baby. Can you help everyone find their place at the stable?",
    ] },
    { type: "drag", scene: base, seed: 252, items: ITEMS, zones: ZONES, snap: true, dropArea: [420, 0, 1500, 740], ghostOpacity: 0.6, elf: { at: [1490, 160], kind: "hat" }, prompt: "Drag everyone up to the stable. Let go anywhere in the sky and they hop into their places!", doneCaption: "Everyone is at the stable!" },
    { type: "story", scene: grand, seed: 253, elf: { at: [1490, 480], kind: "leg" }, captions: [
      "And there it was: the very first Christmas. Mary, Joseph and baby Jesus, the ox and the donkey,",
      "the shepherds and their sheep, the three wise men with their gifts, and angels singing in the sky,",
      "all gathered under the great star of Bethlehem. Happy Christmas!",
    ] },
  ],
};

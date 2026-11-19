// The nativity kit: people, buildings and objects for the advent calendar, built from core.js's crayon primitives
// (P, G, TX, ell, cr, ln, poly, bumpy, dot, sparkle...) so everything keeps the kids-video look.
// x, y is the feet / base centre of each thing unless it says otherwise; s is a scale.

const N = {
  robeBlue: "#3d6fd6", veil: "#dfe9ff", plaster: "#eadbb4", plasterEdge: "#a88a55", mud: "#c9a66b", wood: "#8a5a2b",
  woodDark: "#5a3614", clay: "#c4683a", lampGlow: "#ffe27a", night: "#16204a", nightHill: "#2b4a3f", nightHillEdge: "#6fa36b",
  farHill: "#2a3d6b", farHillEdge: "#5b7fa8", sand: "#d9b26b", sandEdge: "#a8823f", window: "#ffd75e", straw: "#eccb5e",
};

// ---------------------------------------------------------------- people
// Mary: a grown-up in a blue robe with a pale veil over her head and shoulders.
function mary(x, y, o = {}) {
  const s = o.sc || 1, p = (dx, dy) => [x + dx * s, y + dy * s], w = Math.max(4, 7 * Math.min(1, s + 0.25));
  let str = person(x, y, { sc: s, c: N.robeBlue, hair: N.veil, lh: o.lh, rh: o.rh });
  str += P(cr([p(-40, -352), p(-54, -310), p(-62, -250)]), { s: N.veil, w: w * 2.6 });
  str += P(cr([p(40, -352), p(54, -310), p(62, -250)]), { s: N.veil, w: w * 2.6 });
  return str;
}

// ---------------------------------------------------------------- buildings
// a flat-roofed house of the time: plaster walls, a parapet, a small dark door and window. lit = glowing window (night)
function flatHouse(x, y, w, h, o = {}) {
  const l = x - w / 2, r = x + w / 2, top = y - h;
  let s = P(poly([l, y], [l, top], [r, top], [r, y]), { s: N.plasterEdge, f: o.col || N.plaster, w: 7 });
  s += P(ln([l - 10, top], [r + 10, top]), { s: N.plasterEdge, w: 12 });                                     // roof edge
  if (o.door !== false) { const dx = x + (o.doorAt || -0.2) * w; s += P(poly([dx - 26, y], [dx - 26, y - 78], [dx + 26, y - 78], [dx + 26, y]), { s: N.woodDark, f: o.lit ? N.window : N.wood, w: 6 }); }
  const wx = x + (o.winAt || 0.22) * w, wy = top + h * 0.35;
  s += P(poly([wx - 24, wy - 22], [wx + 24, wy - 22], [wx + 24, wy + 22], [wx - 24, wy + 22]), { s: N.woodDark, f: o.lit ? N.window : "#5a4a3a", w: 6 });
  return s;
}

function palm(x, y, s = 1) {
  let str = P(cr([[x, y], [x + 8 * s, y - 90 * s], [x + 22 * s, y - 180 * s], [x + 30 * s, y - 250 * s]]), { s: N.wood, w: 18 * s });
  const tx = x + 30 * s, ty = y - 250 * s;
  for (const [dx, dy] of [[-120, 30], [-90, -40], [0, -70], [90, -40], [120, 35]]) str += P(cr([[tx, ty], [tx + dx * 0.5 * s, ty + (dy - 30) * s], [tx + dx * s, ty + dy * s]]), { s: C.dkgreen, w: 14 * s });
  return str;
}

// a door with a round top, as drawn by Maya. open=true: swung back, light pouring out
function archDoorPath(x, y, w, h) {
  const r = w / 2, pts = [[x - r, y], [x - r, y - h + r]];
  for (let i = 1; i < 12; i++) { const a = Math.PI + (i / 12) * Math.PI; pts.push([x + Math.cos(a) * r, y - h + r + Math.sin(a) * r]); }
  pts.push([x + r, y - h + r], [x + r, y]);
  return pts;
}
function archDoor(x, y, w, h, t = 0, open = false) {
  const pts = archDoorPath(x, y, w, h);
  if (!open) return G(P(cr([...pts, pts[0]]), { s: "#7a3a1a", f: "#c46a3a", w: 9 }) + P(ell(x + w / 2 - 36, y - h * 0.45, 13), { s: C.gold, f: C.gold, w: 7 }), { t, dur: 0.6 });
  return G(P(cr([...pts, pts[0]]), { s: "#7a3a1a", f: "#fff1a8", w: 9 }), { t, dur: 0.3 })
    + G(P(ell(x, y - h * 0.45, w * 0.32, h * 0.32), { s: "#fff1a8", f: C.yellow, w: 3 }), { a: "fade", t: t + 0.1, dur: 0.5, loop: "pulse:0.04:0.9", ox: x, oy: y - h * 0.45 })
    + G(P(poly([x - w / 2, y], [x - w / 2, y - h + w / 2], [x - w / 2 - 90, y - h + w / 2 + 40], [x - w / 2 - 90, y + 30]), { s: "#7a3a1a", f: "#c46a3a", w: 9 }), { t: t + 0.2, dur: 0.4 })
    + sparkle(x - 30, y - h * 0.75, 26, t + 0.5) + sparkle(x + 50, y - h * 0.35, 22, t + 0.7) + sparkle(x, y - h - 30, 20, t + 0.9);
}

// ---------------------------------------------------------------- things in Mary's house (each roughly centred on x, y)
function jug(x, y, s = 1) {
  return P(cr([[x - 22 * s, y - 80 * s], [x - 40 * s, y - 40 * s], [x - 34 * s, y], [x + 34 * s, y], [x + 40 * s, y - 40 * s], [x + 22 * s, y - 80 * s], [x - 22 * s, y - 80 * s]]), { s: "#7a3412", f: N.clay, w: 7 })
    + P(cr([[x + 30 * s, y - 70 * s], [x + 58 * s, y - 60 * s], [x + 38 * s, y - 30 * s]]), { s: "#7a3412", w: 8 });
}
function oilLamp(x, y, s = 1) {
  return P(cr([[x - 44 * s, y], [x - 30 * s, y - 22 * s], [x + 30 * s, y - 22 * s], [x + 50 * s, y - 8 * s], [x + 30 * s, y], [x - 44 * s, y]]), { s: "#7a3412", f: N.clay, w: 6 })
    + P(tear(x + 46 * s, y - 14 * s, 9 * s, 30 * s), { s: C.orange, f: C.yellow, w: 4 });
}
function loaf(x, y, s = 1) {
  return P(bumpy(x, y - 22 * s, 52 * s, 24 * s, 0.04, 3), { s: "#8a5a2b", f: "#e0a95a", w: 6 })
    + P(ln([x - 22 * s, y - 34 * s], [x - 12 * s, y - 14 * s]), { s: "#8a5a2b", w: 5 }) + P(ln([x + 6 * s, y - 36 * s], [x + 16 * s, y - 14 * s]), { s: "#8a5a2b", w: 5 });
}
function broom(x, y, s = 1) {
  return P(ln([x, y - 230 * s], [x + 16 * s, y - 60 * s]), { s: N.wood, w: 10 * s })
    + P(poly([x + 2 * s, y - 70 * s], [x + 34 * s, y - 70 * s], [x + 54 * s, y], [x - 24 * s, y]), { s: "#a8823f", f: N.straw, w: 6 });
}
function dove(x, y, s = 1) {
  return P(cr([[x - 50 * s, y], [x - 20 * s, y - 26 * s], [x + 24 * s, y - 22 * s], [x + 44 * s, y - 40 * s], [x + 50 * s, y - 20 * s], [x + 30 * s, y + 4 * s], [x - 50 * s, y]]), { s: C.dkgrey, f: C.white, w: 6 })
    + P(cr([[x - 14 * s, y - 14 * s], [x + 2 * s, y - 52 * s], [x + 14 * s, y - 16 * s]]), { s: C.dkgrey, f: C.white, w: 6 })
    + dot(x + 38 * s, y - 28 * s, 4) + P(ln([x + 52 * s, y - 28 * s], [x + 64 * s, y - 24 * s]), { s: C.orange, w: 6 });
}
function table(x, y, w, h) {
  return P(poly([x - w / 2, y - h], [x + w / 2, y - h], [x + w / 2, y - h + 22], [x - w / 2, y - h + 22]), { s: N.woodDark, f: N.wood, w: 7 })
    + P(ln([x - w / 2 + 24, y - h + 22], [x - w / 2 + 24, y]), { s: N.woodDark, w: 14 }) + P(ln([x + w / 2 - 24, y - h + 22], [x + w / 2 - 24, y]), { s: N.woodDark, w: 14 });
}

// ---------------------------------------------------------------- night things
function star5(x, y, r, inner = 0.45) {
  const pts = [];
  for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * inner : r; pts.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr]); }
  return poly(...pts);
}
function starP(x, y, r) { return P(star5(x, y, r), { s: "#a8820a", f: "#f7d117", w: 5 }); }
function hillBand(x0, x1, y, amp, n, fill, edge, seedShift = 0) {
  const pts = [[x0 - 20, y]];
  for (let i = 1; i <= n; i++) { const u = i / n; pts.push([x0 + (x1 - x0) * u, y - amp * Math.sin(u * Math.PI * (2 + seedShift)) ** 2 + J(8)]); }
  pts.push([x1 + 20, 1500], [x0 - 20, 1500]);
  return P(poly(...pts), { s: edge, f: fill, w: 8 });
}
function stable(x, y, w, h) {
  const l = x - w / 2, r = x + w / 2;
  return P(poly([l, y], [l, y - h], [r, y - h], [r, y]), { s: N.woodDark, f: N.wood, w: 9 })
    + P(poly([l + 40, y], [l + 40, y - h + 50], [r - 40, y - h + 50], [r - 40, y]), { s: N.woodDark, f: "#2a1a10", w: 6 })
    + P(poly([l - 50, y - h + 10], [x, y - h - 120], [r + 50, y - h + 10]), { s: "#a8823f", f: N.straw, w: 9 })
    + [0.25, 0.5, 0.75].map(u => P(ln([l + w * u, y - h + 10], [l + w * u, y]), { s: N.woodDark, w: 5 })).join("");
}
function tent(x, y, w, h) {
  return P(poly([x - w / 2, y], [x, y - h], [x + w / 2, y]), { s: "#5a3a1e", f: "#b5835a", w: 8 })
    + P(poly([x - w * 0.12, y], [x, y - h * 0.55], [x + w * 0.12, y]), { s: "#5a3a1e", f: "#2a1a10", w: 6 });
}
function sheep(x, y, s = 1) {   // a fluffy sheep facing right: a cloud of wool, a dark face with ears, four dark legs
  const wool = [[-40, -60, 30], [-8, -76, 34], [28, -66, 30], [-52, -34, 28], [-14, -40, 34], [24, -36, 32], [-30, -16, 24], [8, -14, 26]]
    .map(([dx, dy, r]) => P(ell(x + dx * s, y + dy * s, r * s, r * s), { s: "#b9b4aa", f: C.white, w: 5 })).join("");
  const leg = dx => P(ln([x + dx * s, y - 20 * s], [x + dx * s, y + 34 * s]), { s: "#3a3a3a", w: 9 * s }) + P(ell(x + dx * s, y + 36 * s, 8 * s, 5 * s), { s: "#222", f: "#222", w: 3 });
  return leg(-30) + leg(-6) + leg(16) + leg(34) + wool
    + P(ell(x + 62 * s, y - 52 * s, 20 * s, 24 * s), { s: C.ink, f: "#4a4a4a", w: 5 })
    + P(poly([x + 46 * s, y - 66 * s], [x + 22 * s, y - 70 * s], [x + 48 * s, y - 52 * s]), { s: C.ink, f: "#4a4a4a", w: 4 })
    + P(poly([x + 76 * s, y - 66 * s], [x + 104 * s, y - 62 * s], [x + 78 * s, y - 50 * s]), { s: C.ink, f: "#4a4a4a", w: 4 })
    + dot(x + 66 * s, y - 56 * s, 4 * s, C.white) + dot(x + 66 * s, y - 56 * s, 2 * s, C.ink);
}
function dune(x, y, w, h) {
  return P(cr([[x - w / 2, y], [x - w / 4, y - h * 0.8], [x, y - h], [x + w / 4, y - h * 0.7], [x + w / 2, y]]), { s: N.sandEdge, f: N.sand, w: 7 });
}


// ---------------------------------------------------------------- surprises (not in the nativity story!)
// a Christmas tree, wrongly in the Holy Land: decorated, with a star on top
function tree(x, y, s = 1) {
  const tier = (w, top, bot) => P(poly([x - w * s, bot * s + y], [x, top * s + y], [x + w * s, bot * s + y]), { s: "#1f5a2a", f: "#3f9b4a", w: 6 });
  const bauble = (dx, dy, c) => P(ell(x + dx * s, y + dy * s, 9 * s, 9 * s), { s: C.ink, f: c, w: 3 });
  return P(poly([x - 10 * s, y], [x + 10 * s, y], [x + 10 * s, y - 24 * s], [x - 10 * s, y - 24 * s]), { s: N.woodDark, f: N.wood, w: 5 })
    + tier(70, -100, -20) + tier(56, -150, -66) + tier(40, -195, -112)
    + starP(x, y - 205 * s, 20 * s) + bauble(-28, -50, C.red) + bauble(24, -78, C.blue) + bauble(-12, -118, "#f7d117") + bauble(14, -150, C.red);
}
// the elf on the shelf, hiding: only a bit of him shows. kind: "leg" (dangling from behind something), "hat" (pointy tip), "ear"
function elfPeek(x, y, kind = "leg", s = 1) {
  const red = { s: C.ink, f: "#d8302a", w: 5 }, skin = { s: C.ink, f: "#f2c9a0", w: 4 };
  if (kind === "hat") return P(poly([x - 18 * s, y], [x + 4 * s, y - 56 * s], [x + 24 * s, y]), red) + P(ell(x + 4 * s, y - 58 * s, 7 * s, 7 * s), { s: C.ink, f: C.white, w: 3 });
  if (kind === "ear") return P(cr([[x, y], [x + 26 * s, y - 34 * s], [x + 34 * s, y + 4 * s], [x + 12 * s, y + 18 * s]]), skin) + P(ln([x + 8 * s, y - 2 * s], [x + 22 * s, y - 10 * s]), { s: "#d98a7a", w: 3 });
  return P(poly([x - 8 * s, y], [x + 8 * s, y], [x + 7 * s, y + 46 * s], [x - 7 * s, y + 46 * s]), { s: C.ink, f: C.white, w: 5 })   // striped stocking leg
    + P(ln([x - 7 * s, y + 14 * s], [x + 7 * s, y + 14 * s]), { s: "#d8302a", w: 5 }) + P(ln([x - 7 * s, y + 30 * s], [x + 7 * s, y + 30 * s]), { s: "#d8302a", w: 5 })
    + P(cr([[x - 9 * s, y + 46 * s], [x - 12 * s, y + 62 * s], [x + 18 * s, y + 62 * s], [x + 8 * s, y + 46 * s]]), { s: C.ink, f: "#2e8b3a", w: 5 });
}
// a friendly T. rex in a Santa hat, facing right
function trex(x, y, s = 1) {
  const g = { s: "#1f5a2a", f: "#4fae5a", w: 7 };
  return P(cr([[x - 210 * s, y - 20 * s], [x - 120 * s, y - 70 * s], [x - 60 * s, y - 180 * s], [x + 40 * s, y - 330 * s], [x + 150 * s, y - 340 * s], [x + 215 * s, y - 280 * s], [x + 205 * s, y - 230 * s], [x + 90 * s, y - 215 * s], [x + 40 * s, y - 120 * s], [x + 20 * s, y], [x - 60 * s, y], [x - 70 * s, y - 70 * s]]), g)
    + P(cr([[x - 60 * s, y - 10 * s], [x - 55 * s, y + 5 * s], [x + 50 * s, y + 5 * s], [x + 20 * s, y - 20 * s]]), g)
    + P(poly([x + 95 * s, y - 175 * s], [x + 140 * s, y - 165 * s], [x + 120 * s, y - 130 * s]), { s: "#1f5a2a", f: "#4fae5a", w: 5 })   // tiny arm
    + P(ell(x + 150 * s, y - 298 * s, 11 * s, 11 * s), { s: C.ink, f: C.white, w: 4 }) + dot(x + 153 * s, y - 296 * s, 5 * s)
    + [0, 1, 2, 3].map(i => P(poly([x + 100 * s + i * 24 * s, y - 232 * s], [x + 112 * s + i * 24 * s, y - 214 * s], [x + 124 * s + i * 24 * s, y - 232 * s]), { s: C.ink, f: C.white, w: 3 })).join("")
    + [0, 1, 2, 3, 4].map(i => P(poly([x - 160 * s + i * 22 * s, y - 56 * s - i * 14 * s], [x - 150 * s + i * 22 * s, y - 80 * s - i * 14 * s], [x - 138 * s + i * 22 * s, y - 56 * s - i * 14 * s]), { s: "#1f5a2a", f: "#2e7d3a", w: 4 })).join("")
    + P(poly([x + 90 * s, y - 330 * s], [x + 150 * s, y - 335 * s], [x + 125 * s, y - 410 * s]), { s: C.ink, f: "#d8302a", w: 5 })   // santa hat
    + P(ell(x + 125 * s, y - 412 * s, 14 * s, 14 * s), { s: C.ink, f: C.white, w: 4 }) + P(ln([x + 85 * s, y - 328 * s], [x + 152 * s, y - 336 * s]), { s: C.ink, w: 14 });
}


// ---------------------------------------------------------------- windows 2 and 3: Gabriel, Joseph, the workshop
// the angel Gabriel: white robe, golden hair, big wings and a halo
function gabriel(x, y, o = {}) {
  const s = o.sc || 1, p = (dx, dy) => [x + dx * s, y + dy * s];
  const wing = side => P(cr([p(side * 30, -280), p(side * 150, -420), p(side * 235, -330), p(side * 190, -230), p(side * 90, -150)]), { s: "#9fb4d9", f: "#f4f8ff", w: 6 });
  return wing(-1) + wing(1)
    + person(x, y, { sc: s, c: "#fffdf0", hair: "#f2c63a", lh: o.lh || [-120, -190], rh: o.rh || [120, -330] })
    + P(ell(...p(0, -418), 52 * s, 13 * s), { s: "#f7d117", w: 8 * s });
}
// Joseph the carpenter: brown robe, dark hair and a beard
function joseph(x, y, o = {}) {
  const s = o.sc || 1, p = (dx, dy) => [x + dx * s, y + dy * s];
  return person(x, y, { sc: s, c: "#8a5a2b", hair: "#3a2414", lh: o.lh, rh: o.rh, shut: o.shut })
    + P(cr([p(-30, -318), p(-26, -285), p(0, -272), p(26, -285), p(30, -318)]), { s: "#3a2414", w: 6 * s });
}
function hammer(x, y, s = 1, ang = -30) {
  return `<g transform="translate(${x} ${y}) rotate(${ang}) scale(${s})">${P(ln([0, 0], [0, -150]), { s: N.woodDark, w: 12 })}${P(poly([-45, -150], [45, -150], [45, -190], [-45, -190]), { s: C.ink, f: "#8a8f99", w: 7 })}</g>`;
}
// a stool: seat and four legs. nailed = how many of the four joins are shown with a nail
function stool(x, y, s = 1) {
  return P(poly([x - 130 * s, y - 150 * s], [x + 130 * s, y - 150 * s], [x + 130 * s, y - 185 * s], [x - 130 * s, y - 185 * s]), { s: N.woodDark, f: N.wood, w: 8 })
    + [-100, 100].map(dx => P(poly([x + (dx - 14) * s, y - 150 * s], [x + (dx + 14) * s, y - 150 * s], [x + (dx + 14) * s, y], [x + (dx - 14) * s, y]), { s: N.woodDark, f: "#b07a3c", w: 7 })).join("");
}
function plank(x, y, len, h = 46) {
  return P(poly([x - len / 2, y - h / 2], [x + len / 2, y - h / 2], [x + len / 2, y + h / 2], [x - len / 2, y + h / 2]), { s: N.woodDark, f: "#c08a4a", w: 7 })
    + P(ln([x - len / 2 + 20, y], [x + len / 2 - 20, y]), { s: "#9a6a30", w: 4 });
}


// ---------------------------------------------------------------- windows 4 to 6: the Emperor, the bell, the scroll, the donkey, the bags
function emperor(x, y, o = {}) {
  const s = o.sc || 1, p = (dx, dy) => [x + dx * s, y + dy * s];
  return person(x, y, { sc: s, c: "#7b2d8e", hair: "#6b4a2a", lh: o.lh, rh: o.rh })
    + P(poly(p(-34, -372), p(-22, -420), p(-8, -388), p(0, -430), p(8, -388), p(22, -420), p(34, -372)), { s: C.ink, f: "#f7d117", w: 6 * s });
}
function bell(x, y, s = 1) {
  return P(ln([x, y - 150 * s], [x, y - 110 * s]), { s: N.woodDark, w: 8 * s })
    + P(cr([[x - 70 * s, y], [x - 55 * s, y - 70 * s], [x, y - 120 * s], [x + 55 * s, y - 70 * s], [x + 70 * s, y], [x - 70 * s, y]]), { s: "#8a6a10", f: "#f2c230", w: 7 * s })
    + dot(x, y + 14 * s, 14 * s, "#8a6a10");
}
function scroll(x, y, w = 360, h = 300, lines = true) {   // lines: true = squiggly lines, an array of words = written text, false = blank
  const body = P(poly([x - w / 2, y - h / 2], [x + w / 2, y - h / 2], [x + w / 2, y + h / 2], [x - w / 2, y + h / 2]), { s: "#8a6a3a", f: "#f6e7b8", w: 7 })
    + P(poly([x - w / 2 - 14, y - h / 2 - 16], [x + w / 2 + 14, y - h / 2 - 16], [x + w / 2 + 14, y - h / 2 + 18], [x - w / 2 - 14, y - h / 2 + 18]), { s: "#6a4a1a", f: "#c9a14a", w: 7 })
    + P(poly([x - w / 2 - 14, y + h / 2 - 18], [x + w / 2 + 14, y + h / 2 - 18], [x + w / 2 + 14, y + h / 2 + 16], [x - w / 2 - 14, y + h / 2 + 16]), { s: "#6a4a1a", f: "#c9a14a", w: 7 });
  if (Array.isArray(lines)) { const n = lines.length, sz = Math.min(40, (w - 50) / 7.5); return body + lines.map((t, i) => TX(t, x, y - ((n - 1) / 2 - i) * (sz + 14) + sz * 0.35, { size: sz })).join("") + dot(x + w * 0.3, y + h * 0.32, 14, "#c0392b"); }
  return body + (lines ? [-0.28, -0.08, 0.12, 0.3].map((u, i) => P(ln([x - w * 0.36, y + h * u], [x + w * (i % 2 ? 0.2 : 0.36), y + h * u]), { s: "#5a3a1e", w: 6 })).join("") : "");
}
function donkey(x, y, s = 1) {
  const g = { s: "#5a5148", f: "#a39a8e", w: 7 };
  const leg = dx => P(poly([x + (dx - 14) * s, y - 120 * s], [x + (dx + 14) * s, y - 120 * s], [x + (dx + 12) * s, y], [x + (dx - 12) * s, y]), g);
  return leg(-100) + leg(-60) + leg(70) + leg(110)
    + P(ell(x, y - 190 * s, 160 * s, 80 * s), g)
    + P(cr([[x + 120 * s, y - 230 * s], [x + 190 * s, y - 330 * s], [x + 250 * s, y - 330 * s], [x + 270 * s, y - 250 * s], [x + 230 * s, y - 215 * s], [x + 150 * s, y - 190 * s]]), g)
    + P(poly([x + 190 * s, y - 330 * s], [x + 170 * s, y - 420 * s], [x + 215 * s, y - 340 * s]), g) + P(poly([x + 225 * s, y - 335 * s], [x + 232 * s, y - 430 * s], [x + 250 * s, y - 335 * s]), g)
    + P(ell(x + 258 * s, y - 238 * s, 26 * s, 20 * s), { s: "#5a5148", f: "#e6d8c4", w: 5 }) + dot(x + 225 * s, y - 282 * s, 7 * s)
    + P(cr([[x - 150 * s, y - 210 * s], [x - 195 * s, y - 160 * s], [x - 185 * s, y - 100 * s]]), { s: "#5a5148", w: 9 * s });
}
function bag(x, y, s = 1) {
  return P(poly([x - 110 * s, y - 120 * s], [x + 110 * s, y - 120 * s], [x + 130 * s, y + 60 * s], [x - 130 * s, y + 60 * s]), { s: "#5a3614", f: "#b07a3c", w: 8 })
    + P(poly([x - 118 * s, y - 120 * s], [x + 118 * s, y - 120 * s], [x + 100 * s, y - 40 * s], [x - 100 * s, y - 40 * s]), { s: "#5a3614", f: "#8a5a2b", w: 7 })
    + dot(x, y - 50 * s, 12 * s, "#f2c230");
}
function blanket(x, y, s = 1) {
  return P(poly([x - 80 * s, y - 40 * s], [x + 80 * s, y - 40 * s], [x + 80 * s, y + 40 * s], [x - 80 * s, y + 40 * s]), { s: "#7a3412", f: "#d65a4a", w: 6 })
    + [-20, 10].map(dy => P(ln([x - 80 * s, y + dy * s], [x + 80 * s, y + dy * s]), { s: "#f6d98a", w: 5 })).join("");
}
function skateboard(x, y, s = 1) {
  return P(poly([x - 130 * s, y - 14 * s], [x + 130 * s, y - 14 * s], [x + 130 * s, y + 6 * s], [x - 130 * s, y + 6 * s]), { s: C.ink, f: C.blue, w: 6 })
    + [-85, 85].map(dx => P(ell(x + dx * s, y + 26 * s, 20 * s, 20 * s), { s: C.ink, f: C.white, w: 5 })).join("");
}


// ---------------------------------------------------------------- windows 7 to 9: signposts, the night sky, the town gate and its crowd
function signpost(x, y, signs, s = 1) {   // signs: [[text, dir (1 right, -1 left)]...] from the top
  return P(poly([x - 12 * s, y], [x + 12 * s, y], [x + 12 * s, y - 330 * s], [x - 12 * s, y - 330 * s]), { s: N.woodDark, f: N.wood, w: 7 })
    + signs.map(([t, d], i) => {
      const cy = y - 280 * s + i * 90 * s, l = x - 190 * s, r = x + 190 * s, sz = 34 * s;
      const pts = d > 0 ? [[l, cy - 34 * s], [r, cy - 34 * s], [r + 40 * s, cy], [r, cy + 34 * s], [l, cy + 34 * s]] : [[r, cy - 34 * s], [l, cy - 34 * s], [l - 40 * s, cy], [l, cy + 34 * s], [r, cy + 34 * s]];
      const tx = d > 0 ? x + 20 * s : x - 20 * s;
      return P(poly(...pts), { s: N.woodDark, f: "#d9b26b", w: 6 }) + TX(t, tx, cy + 11 * s, { size: sz });
    }).join("");
}
function townGate(x, y, w = 700, h = 520) {
  return P(poly([x - w / 2, y], [x - w / 2, y - h], [x + w / 2, y - h], [x + w / 2, y]), { s: N.plasterEdge, f: N.plaster, w: 8 })
    + [...Array(7)].map((_, i) => P(poly([x - w / 2 + i * (w / 6.5), y - h], [x - w / 2 + i * (w / 6.5), y - h - 40], [x - w / 2 + i * (w / 6.5) + 50, y - h - 40], [x - w / 2 + i * (w / 6.5) + 50, y - h]), { s: N.plasterEdge, f: N.plaster, w: 6 })).join("")
    + P(cr([[x - 110, y], [x - 110, y - 260], [x - 60, y - 340], [x, y - 360], [x + 60, y - 340], [x + 110, y - 260], [x + 110, y]]), { s: N.woodDark, f: "#3a2414", w: 8 });
}
function crowdPerson(x, y, i) {
  const cols = ["#e8392c", "#2f7de1", "#43b04a", "#8e4fc9", "#f28c28", "#c2185b", "#2aa5a5"];
  return person(x, y, { sc: 0.34 + (i % 3) * 0.04, c: cols[i % cols.length], hair: ["#3a2414", "#6b4a2a", "#c9a14a", "#222"][i % 4], lh: i % 2 ? [-70, -230] : undefined });
}


// ---------------------------------------------------------------- windows 10 to 12: the inn, the stable, the manger
function innkeeper(x, y, o = {}) {
  const s = o.sc || 1, p = (dx, dy) => [x + dx * s, y + dy * s];
  return person(x, y, { sc: s, c: "#c46a3a", hair: "#4a3020", lh: o.lh, rh: o.rh })
    + P(poly(p(-30, -270), p(30, -270), p(40, -150), p(-40, -150)), { s: C.ink, f: "#fff6e0", w: 5 * s })
    + P(poly(p(-44, -364), p(44, -364), p(36, -400), p(-36, -400)), { s: C.ink, f: "#d8302a", w: 5 * s });
}
function inn(x, y, w = 420, h = 420) {   // a big two-storey inn with a lit window
  return flatHouse(x, y, w, h, { lit: true, doorAt: 0 }) + P(ln([x - w / 2 - 10, y - h / 2], [x + w / 2 + 10, y - h / 2]), { s: N.plasterEdge, w: 10 })
    + P(poly([x + w * 0.1, y - h * 0.78], [x + w * 0.35, y - h * 0.78], [x + w * 0.35, y - h * 0.55], [x + w * 0.1, y - h * 0.55]), { s: N.woodDark, f: N.window, w: 6 });
}
function manger(x, y, s = 1) {   // a wooden feeding trough on crossed legs, with straw
  return P(ln([x - 110 * s, y], [x + 70 * s, y - 120 * s]), { s: N.woodDark, w: 16 * s }) + P(ln([x + 110 * s, y], [x - 70 * s, y - 120 * s]), { s: N.woodDark, w: 16 * s })
    + P(poly([x - 160 * s, y - 150 * s], [x + 160 * s, y - 150 * s], [x + 120 * s, y - 90 * s], [x - 120 * s, y - 90 * s]), { s: N.woodDark, f: N.wood, w: 8 })
    + P(cr([[x - 140 * s, y - 150 * s], [x - 70 * s, y - 185 * s], [x, y - 170 * s], [x + 80 * s, y - 190 * s], [x + 140 * s, y - 150 * s]]), { s: "#a8823f", f: N.straw, w: 7 });
}
function cobweb(x, y, s = 1) {
  return [0, 1, 2, 3, 4].map(i => P(ln([x, y], [x + Math.cos(i * 0.4) * 90 * s, y + Math.sin(i * 0.4) * 90 * s + 20 * s]), { s: "#b9b5ad", w: 3 })).join("");
}


// ---------------------------------------------------------------- windows 13 to 15: bells, the ox, the shepherds
function shepherd(x, y, o = {}) {
  const s = o.sc || 1, p = (dx, dy) => [x + dx * s, y + dy * s];
  return P(ln(p(110, 0), p(110, -330), p(150, -380), p(170, -340)), { s: N.woodDark, w: 8 * s })
    + person(x, y, { sc: s, c: o.c || "#6b8e3a", hair: "#3a2414", lh: o.lh, rh: o.rh || [95, -230] })
    + P(poly(p(-46, -360), p(46, -360), p(30, -420), p(-30, -420)), { s: C.ink, f: "#f2e4c0", w: 5 * s });
}
function ox(x, y, s = 1) {
  const g = { s: "#3a2414", f: "#8a5a35", w: 7 };
  const leg = dx => P(poly([x + (dx - 16) * s, y - 110 * s], [x + (dx + 16) * s, y - 110 * s], [x + (dx + 14) * s, y], [x + (dx - 14) * s, y]), g);
  return leg(-110) + leg(-60) + leg(70) + leg(120) + P(ell(x, y - 180 * s, 170 * s, 90 * s), g)
    + P(cr([[x + 130 * s, y - 250 * s], [x + 220 * s, y - 280 * s], [x + 270 * s, y - 220 * s], [x + 240 * s, y - 160 * s], [x + 150 * s, y - 170 * s]]), g)
    + P(ln([x + 190 * s, y - 280 * s], [x + 170 * s, y - 330 * s], [x + 200 * s, y - 350 * s]), { s: C.ink, w: 9 * s }) + P(ln([x + 240 * s, y - 275 * s], [x + 270 * s, y - 335 * s], [x + 295 * s, y - 330 * s]), { s: C.ink, w: 9 * s })
    + P(ell(x + 255 * s, y - 200 * s, 24 * s, 18 * s), { s: "#3a2414", f: "#d9a98a", w: 5 }) + dot(x + 225 * s, y - 238 * s, 7 * s)
    + P(ln([x - 165 * s, y - 200 * s], [x - 200 * s, y - 120 * s]), { s: "#3a2414", w: 9 * s });
}
function hoofprint(x, y, kind, s = 1) {
  const f = { s: C.ink, f: "#6a4a2a", w: 5 };
  if (kind === "paw") return P(ell(x, y + 18 * s, 34 * s, 28 * s), f) + [[-36, -18], [-12, -36], [12, -36], [36, -18]].map(([dx, dy]) => P(ell(x + dx * s, y + dy * s, 11 * s, 14 * s), f)).join("");
  if (kind === "rabbit") return P(ell(x - 24 * s, y + 20 * s, 14 * s, 36 * s), f) + P(ell(x + 24 * s, y + 20 * s, 14 * s, 36 * s), f) + P(ell(x, y - 26 * s, 12 * s, 14 * s), f);
  const w = kind === "sheep" ? 20 : 32;   // ox: wide split hoof, sheep: slim split hoof
  return P(ell(x - (w - 4) * s, y, w * 0.7 * s, w * 1.3 * s), f) + P(ell(x + (w - 4) * s, y, w * 0.7 * s, w * 1.3 * s), f);
}


// ---------------------------------------------------------------- windows 16 to 18: the lamb, the telescope, the wise men and their gifts
function wiseman(x, y, o = {}) {
  const s = o.sc || 1, p = (dx, dy) => [x + dx * s, y + dy * s];
  return person(x, y, { sc: s, c: o.c || "#7b2d8e", hair: "#2a1a10", lh: o.lh, rh: o.rh })
    + P(poly(p(-44, -366), p(44, -366), p(36, -420), p(0, -440), p(-36, -420)), { s: C.ink, f: o.hat || "#f7d117", w: 5 * s })
    + P(cr([[x - 36 * s, y - 310 * s], [x, y - 270 * s], [x + 36 * s, y - 310 * s]]), { s: "#d9d9d9", w: 6 * s });
}
function giftArt(kind, x, y, s = 1) {   // gold: a treasure chest; frankincense: a jar with a lid; myrrh: a little bottle
  if (kind === "gold") return P(poly([x - 70 * s, y], [x + 70 * s, y], [x + 70 * s, y - 70 * s], [x - 70 * s, y - 70 * s]), { s: C.ink, f: "#b07a3c", w: 6 }) + P(cr([[x - 70 * s, y - 70 * s], [x - 50 * s, y - 120 * s], [x + 50 * s, y - 120 * s], [x + 70 * s, y - 70 * s]]), { s: C.ink, f: "#f2c230", w: 6 }) + dot(x, y - 68 * s, 10 * s, C.ink);
  if (kind === "frankincense") return P(ell(x, y - 55 * s, 60 * s, 55 * s), { s: C.ink, f: "#e8d8a8", w: 6 }) + P(poly([x - 36 * s, y - 105 * s], [x + 36 * s, y - 105 * s], [x + 30 * s, y - 130 * s], [x - 30 * s, y - 130 * s]), { s: C.ink, f: "#8a5a2b", w: 6 });
  return P(poly([x - 28 * s, y], [x + 28 * s, y], [x + 50 * s, y - 80 * s], [x + 18 * s, y - 120 * s], [x - 18 * s, y - 120 * s], [x - 50 * s, y - 80 * s]), { s: C.ink, f: "#c46a3a", w: 6 }) + P(ln([x - 18 * s, y - 130 * s], [x + 18 * s, y - 130 * s]), { s: C.ink, w: 10 * s });
}
function rock(x, y, w, h) { return P(bumpy(x, y - h / 2, w / 2, h / 2, 0.08, 7), { s: "#4a4a52", f: "#8a8d96", w: 7 }); }

// planets for the telescope window: kind is saturn, jupiter, mars, earth or venus; r is the radius
function planet(kind, x, y, r) {
  const col = { saturn: ["#c9a14a", "#e8d08a"], jupiter: ["#b5651d", "#e8a15a"], mars: ["#a8321e", "#e2573b"], earth: ["#1d5fa8", "#3fa86a"], venus: ["#b89a3a", "#f5e08a"] }[kind];
  let str = "";
  if (kind === "saturn") str += P(ell(x, y, r * 1.9, r * 0.5), { s: "#a8823f", w: 7 });
  str += P(ell(x, y, r, r), { s: col[0], f: col[1], w: 7 });
  if (kind === "jupiter") str += [-0.45, -0.1, 0.3].map(u => P(ln([x - r * 0.9, y + r * u], [x + r * 0.9, y + r * u]), { s: col[0], w: 7 })).join("");
  if (kind === "earth") str += P(cr([[x - r * 0.5, y - r * 0.2], [x - r * 0.1, y - r * 0.6], [x + r * 0.3, y - r * 0.1]]), { s: "#1d6a3a", w: 8 });
  if (kind === "saturn") str += P(ln([x - r * 1.85, y + r * 0.12], [x - r * 0.6, y + r * 0.46]), { s: "#a8823f", w: 7 }) + P(ln([x + r * 0.6, y + r * 0.46], [x + r * 1.85, y + r * 0.12]), { s: "#a8823f", w: 7 });
  return str;
}


// ---------------------------------------------------------------- windows 19 to 21: camels, a keyboard, lanterns
function camel(x, y, s = 1) {
  const g = { s: "#6b4a1a", f: "#c9a14a", w: 7 };
  const leg = dx => P(poly([x + (dx - 14) * s, y - 130 * s], [x + (dx + 14) * s, y - 130 * s], [x + (dx + 12) * s, y], [x + (dx - 12) * s, y]), g);
  return leg(-100) + leg(-55) + leg(60) + leg(105) + P(ell(x, y - 200 * s, 150 * s, 70 * s), g) + P(cr([[x - 30 * s, y - 250 * s], [x, y - 330 * s], [x + 40 * s, y - 260 * s]]), g)
    + P(cr([[x + 100 * s, y - 230 * s], [x + 150 * s, y - 340 * s], [x + 190 * s, y - 360 * s], [x + 215 * s, y - 330 * s], [x + 190 * s, y - 300 * s], [x + 160 * s, y - 270 * s], [x + 130 * s, y - 210 * s]]), g)
    + dot(x + 188 * s, y - 336 * s, 6 * s) + P(cr([[x - 150 * s, y - 220 * s], [x - 180 * s, y - 160 * s], [x - 170 * s, y - 120 * s]]), { s: "#6b4a1a", w: 8 * s });
}
function lantern(x, y, s = 1, lit = false) {
  return P(ln([x, y - 120 * s], [x, y - 80 * s]), { s: N.woodDark, w: 6 * s })
    + P(poly([x - 44 * s, y - 80 * s], [x + 44 * s, y - 80 * s], [x + 54 * s, y + 40 * s], [x - 54 * s, y + 40 * s]), { s: N.woodDark, f: lit ? "#ffe27a" : "#6a6a74", w: 6 * s })
    + P(ln([x - 36 * s, y - 80 * s], [x - 44 * s, y + 40 * s]), { s: N.woodDark, w: 4 * s }) + P(ln([x + 36 * s, y - 80 * s], [x + 44 * s, y + 40 * s]), { s: N.woodDark, w: 4 * s });
}
function pianoKeys(x0, y, n, w, h) {
  return [...Array(n)].map((_, i) => P(poly([x0 + i * w, y], [x0 + (i + 1) * w, y], [x0 + (i + 1) * w, y + h], [x0 + i * w, y + h]), { s: C.ink, f: "#fffdf6", w: 6 })).join("");
}


// ---------------------------------------------------------------- windows 22 to 24: night, bedtime, the birth
function moon(x, y, r = 60) { return P(cr([[x, y - r], [x + r * 0.7, y - r * 0.3], [x + r * 0.5, y + r * 0.7], [x - r * 0.3, y + r], [x + r * 0.2, y + r * 0.3], [x + r * 0.1, y - r * 0.4], [x, y - r]]), { s: "#a8820a", f: "#f6e7a8", w: 6 }); }
function baby(x, y, s = 1) {   // a swaddled baby with a soft glow
  return P(ell(x, y, 70 * s, 28 * s), { s: "#9fb4d9", f: "#f4f8ff", w: 6 }) + P(ell(x - 62 * s, y - 6 * s, 24 * s, 22 * s), { s: C.ink, f: C.skin, w: 5 }) + dot(x - 70 * s, y - 10 * s, 3 * s) + dot(x - 54 * s, y - 10 * s, 3 * s);
}
function cloud(x, y, s = 1) { return P(bumpy(x, y, 90 * s, 36 * s, 0.14, 6), { s: "#9fb4d9", f: "#eef3ff", w: 6 }); }

function spider(x, y, s = 1) {   // a little black spider on a thread
  return P(ln([x, y - 140 * s], [x, y - 24 * s]), { s: "#9a9a9a", w: 3 * s })
    + [-1, 1].map(d => [0, 1, 2].map(k => P(ln([x + d * 10 * s, y - 4 * s + k * 5 * s], [x + d * (40 + k * 6) * s, y - 20 * s + k * 14 * s]), { s: C.ink, w: 4 * s })).join("")).join("")
    + P(ell(x, y, 22 * s, 18 * s), { s: C.ink, f: "#2a2a2a", w: 5 }) + dot(x - 7 * s, y - 4 * s, 4 * s, "#e8392c") + dot(x + 7 * s, y - 4 * s, 4 * s, "#e8392c");
}
function stink(x, y, s = 1) { return [-24, 0, 24].map(dx => P(cr([[x + dx * s, y], [x + (dx - 10) * s, y - 20 * s], [x + (dx + 10) * s, y - 40 * s], [x + dx * s, y - 60 * s]]), { s: "#7a9a3a", w: 4 })).join(""); }
function appleCore(x, y) { return P(poly([x - 26, y - 50], [x + 26, y - 50], [x + 14, y - 14], [x + 22, y + 24], [x - 22, y + 24], [x - 14, y - 14]), { s: "#6a4a2a", f: "#b89a6a", w: 6 }) + P(ln([x, y - 50], [x + 6, y - 70]), { s: "#4a3010", w: 6 }); }
function tinCan(x, y) { return P(poly([x - 34, y - 50], [x + 34, y - 50], [x + 26, y + 30], [x - 28, y + 28]), { s: C.ink, f: "#9a9fa8", w: 6 }) + P(ln([x - 30, y - 20], [x + 30, y - 10]), { s: "#5a5f68", w: 5 }) + P(ell(x, y - 50, 34, 9), { s: C.ink, f: "#c9ccd2", w: 5 }); }
function brokenPot(x, y) { return P(poly([x - 44, y - 40], [x + 20, y - 40], [x + 6, y - 6], [x + 38, y + 4], [x + 40, y + 30], [x - 40, y + 30]), { s: "#5a2a14", f: "#b0562c", w: 6 }) + P(ln([x - 10, y - 40], [x - 2, y - 14], [x - 16, y + 4], [x - 6, y + 28]), { s: C.ink, w: 4 }); }

// an owl perched on a branch (x, y = where its feet grip the branch)
function owlOnBranch(x, y, s = 1) {
  const brown = { s: "#4a3010", f: "#a07a4a", w: 6 };
  return P(ln([x - 180 * s, y + 8 * s], [x + 180 * s, y - 6 * s]), { s: N.woodDark, w: 16 * s })
    + P(ell(x, y - 70 * s, 62 * s, 78 * s), brown) + P(ell(x, y - 48 * s, 38 * s, 52 * s), { s: "#6a4a28", f: "#e6cfa0", w: 5 })
    + P(poly([x - 54 * s, y - 128 * s], [x - 36 * s, y - 160 * s], [x - 22 * s, y - 130 * s]), brown) + P(poly([x + 54 * s, y - 128 * s], [x + 36 * s, y - 160 * s], [x + 22 * s, y - 130 * s]), brown)
    + [-26, 26].map(dx => P(ell(x + dx * s, y - 100 * s, 20 * s, 20 * s), { s: C.ink, f: C.white, w: 5 }) + dot(x + dx * s, y - 100 * s, 8 * s)).join("")
    + P(poly([x - 8 * s, y - 86 * s], [x + 8 * s, y - 86 * s], [x, y - 66 * s]), { s: C.ink, f: "#f2a02a", w: 4 })
    + P(cr([[x - 56 * s, y - 80 * s], [x - 74 * s, y - 40 * s], [x - 50 * s, y - 20 * s]]), brown) + P(cr([[x + 56 * s, y - 80 * s], [x + 74 * s, y - 40 * s], [x + 50 * s, y - 20 * s]]), brown);
}

// animals lying down asleep (x, y = the ground under them)
function oxLying(x, y, s = 1) {
  const g = { s: "#3a2414", f: "#8a5a35", w: 7 };
  return P(ell(x, y - 55 * s, 175 * s, 62 * s), g) + P(ell(x + 120 * s, y - 25 * s, 40 * s, 22 * s), g) + P(ell(x - 90 * s, y - 14 * s, 55 * s, 18 * s), g)
    + P(cr([[x + 130 * s, y - 80 * s], [x + 215 * s, y - 70 * s], [x + 250 * s, y - 28 * s], [x + 190 * s, y - 6 * s], [x + 130 * s, y - 30 * s]]), g)
    + P(ln([x + 175 * s, y - 80 * s], [x + 165 * s, y - 118 * s], [x + 190 * s, y - 128 * s]), { s: C.ink, w: 8 * s }) + P(cr([[x + 196 * s, y - 36 * s], [x + 210 * s, y - 32 * s], [x + 224 * s, y - 36 * s]]), { w: 5 })
    + P(ell(x + 238 * s, y - 20 * s, 18 * s, 12 * s), { s: "#3a2414", f: "#d9a98a", w: 4 });
}
function sheepLying(x, y, s = 1) {
  const wool = [[-34, -34, 30], [0, -44, 32], [34, -36, 28], [-14, -16, 24], [20, -14, 24]].map(([dx, dy, r]) => P(ell(x + dx * s, y + dy * s, r * s, r * s), { s: "#b9b4aa", f: C.white, w: 5 })).join("");
  return wool + P(ell(x + 62 * s, y - 18 * s, 22 * s, 18 * s), { s: C.ink, f: "#4a4a4a", w: 5 }) + P(cr([[x + 56 * s, y - 22 * s], [x + 64 * s, y - 20 * s], [x + 72 * s, y - 22 * s]]), { s: C.white, w: 3 });
}
function donkeyLying(x, y, s = 1) {
  const g = { s: "#5a5148", f: "#a39a8e", w: 7 };
  return P(ell(x, y - 60 * s, 165 * s, 58 * s), g) + P(ell(x - 90 * s, y - 14 * s, 50 * s, 16 * s), g) + P(ell(x + 100 * s, y - 20 * s, 44 * s, 18 * s), g)
    + P(cr([[x + 120 * s, y - 85 * s], [x + 195 * s, y - 70 * s], [x + 235 * s, y - 30 * s], [x + 180 * s, y - 8 * s], [x + 125 * s, y - 34 * s]]), g)
    + P(poly([x + 150 * s, y - 84 * s], [x + 128 * s, y - 138 * s], [x + 170 * s, y - 92 * s]), g) + P(poly([x + 178 * s, y - 86 * s], [x + 190 * s, y - 138 * s], [x + 206 * s, y - 80 * s]), g)
    + P(cr([[x + 170 * s, y - 38 * s], [x + 184 * s, y - 34 * s], [x + 198 * s, y - 38 * s]]), { w: 5 })
    + P(ell(x + 224 * s, y - 20 * s, 20 * s, 14 * s), { s: "#5a5148", f: "#e6d8c4", w: 4 });
}

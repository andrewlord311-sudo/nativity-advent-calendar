// The surprises for days 5 to 24 (day 3 is trex.js). Not in the nativity story, just silly: each is 20 to 30 seconds,
// nothing can be failed, and it ends with api.mark() and a Next button. Names stay out of this file on purpose.
import { toolkit, gift, wheel } from "./kit.js";

// ---------------------------------------------------------------- day 5: the monster truck
export async function truck(api) {
  const k = toolkit(api);
  api.sfx.fanfare();
  api.showScene(sky(0) + ground(880, 0.2) + sun(1340, 160, 0.2), 51);
  const presents = [[850, "#2a9d5a", 120, 150], [1030, "#2a6fd8", 150, 120], [1210, "#c0398f", 110, 170]]
    .map(([x, col, w, h], i) => { const g = k.layer(gift(w, h, col), 52 + i); k.place(g, x, 905); return g; });
  const body = P(poly([-230, -120], [230, -120], [230, -230], [-230, -230]), { s: C.ink, f: "#d8302a", w: 8 })
    + P(poly([30, -230], [190, -230], [150, -330], [60, -330]), { s: C.ink, f: "#2a6fd8", w: 8 })
    + P(poly([80, -315], [140, -315], [160, -242], [62, -242]), { s: C.ink, f: "#cfe8ff", w: 6 })
    + P(poly([-200, -170], [-40, -170], [-70, -200], [-200, -200]), { s: "#ffd23f", w: 9 })
    + wheel(-140, -90, 90) + wheel(150, -90, 90);
  const truck = k.layer(body, 55), TS = 0.8; k.place(truck, 640, 905, 0, TS, TS);
  api.caption("Wait… a MONSTER TRUCK! And a pile of presents. Tap to make it go!");
  api.say("letsTry");
  let n = 0, busy = false;
  await k.press(() => {
    if (busy) return false;
    busy = true; const i = n++, px = [850, 1030, 1210][i];
    api.sfx.vroom();
    k.place(truck, px - 150, 905, -4, TS, TS, 500, "ease-in");
    setTimeout(() => { k.place(truck, px, 840, -12, TS, TS, 260, "ease-out"); }, 520);
    setTimeout(() => {
      k.place(truck, px + 50, 905, 3, TS, TS, 260, "ease-in");
      k.place(presents[i], px, 905, 0, 1.25, 0.18, 120);
      api.sfx.crunch(); k.say("CRUNCH!", px, 640 - i * 20); busy = false;
    }, 800);
    return n >= 3 && (busy = true);
  });
  await api.wait(1100);
  api.sfx.sparkle();
  await api.caption("Oh dear! Flat presents. Don't worry, the elves will make some more!");
  api.mark();
  await api.next("Bye, truck! ▶");
}

// ---------------------------------------------------------------- day 8: guinea pigs in tea-towel headdresses
const pig = (patch) => P(ell(-30, -5, 18, 9), { s: C.ink, f: "#f0d9b5", w: 5 }) + P(ell(50, -5, 18, 9), { s: C.ink, f: "#f0d9b5", w: 5 })
  + P(ell(0, -66, 108, 62), { s: C.ink, f: patch[0], w: 7 }) + P(ell(-34, -88, 38, 28), { s: "#6a4a2a", f: patch[1], w: 5 })
  + P(ell(92, -58, 50, 46), { s: C.ink, f: patch[0], w: 7 }) + P(ell(74, -98, 15, 21), { s: C.ink, f: "#f2b6a8", w: 5 })
  + dot(110, -70, 7) + dot(138, -56, 8, "#d96a6a")
  + P(poly([54, -104], [132, -102], [162, -36], [136, -26], [62, -58]), { s: C.ink, f: "#fff", w: 6 })
  + P(ln([84, -102], [108, -34]), { s: "#d8302a", w: 6 }) + P(ln([112, -102], [136, -34]), { s: "#d8302a", w: 6 })
  + P(ln([58, -102], [130, -100]), { s: "#6a4a2a", w: 11 });
export async function pigs(api) {
  const k = toolkit(api);
  api.sfx.fanfare();
  api.showScene(sky(0) + ground(840, 0.2, "#e6c878", "#a8823f"), 81);
  const SPOTS = [[590, "Pip", ["#f4efe4", "#c4803c"]], [950, "Biscuit", ["#c4803c", "#f4efe4"]], [1310, "Nibbles", ["#3d3028", "#f4efe4"]]];
  const gps = SPOTS.map(([x, , c], i) => { const g = k.layer(pig(c), 82 + i); k.place(g, x, 940, 0, 1.25, 1.25); return g; });
  api.caption("Guinea pigs! In tea-towel shepherd hats! Tap one to give it a carrot.");
  api.say("letsTry");
  const fed = new Set();
  await k.press(p => {
    SPOTS.forEach(([x, name], i) => {
      if (fed.has(i) || !k.near(p, x + 50, 840, 150)) return;
      fed.add(i); api.sfx.munch(); k.bump(gps[i].g);
      k.say("🥕", x + 130, 700, 120);
      setTimeout(() => api.sfx.munch(), 300);
      setTimeout(() => api.top().insertAdjacentHTML("beforeend", `<text x="${x + 60}" y="995" font-size="78" text-anchor="middle" fill="#7a2a8a" stroke="#fff" stroke-width="12" paint-order="stroke">${name}</text>`), 500);
    });
    return fed.size >= 3;
  });
  await api.wait(900); api.sfx.sparkle();
  await api.caption("Pip, Biscuit and Nibbles! They'd make very fluffy shepherds.");
  api.mark();
  await api.next("Bye, piggies! ▶");
}

// ---------------------------------------------------------------- day 10: keepy-uppy
export async function keepy(api) {
  const k = toolkit(api);
  api.sfx.fanfare();
  api.showScene(sky(0) + ground(900, 0.2) + P(poly([1230, 900], [1230, 640], [1450, 640], [1450, 900]), { s: "#fff", w: 9 }), 101);
  const body = P(ln([-30, -250], [-34, -30]), { s: C.ink, w: 34 }) + P(ln([30, -250], [60, -110], [92, -40]), { s: C.ink, w: 34 })
    + P(ell(-34, -22, 30, 14), { s: C.ink, f: "#222", w: 5 }) + P(ell(104, -34, 30, 14), { s: C.ink, f: "#222", w: 5 })
    + P(poly([-60, -400], [60, -400], [66, -250], [-66, -250]), { s: C.ink, f: "#fff", w: 7 })
    + P(poly([-70, -520], [70, -520], [66, -400], [-66, -400]), { s: C.ink, f: "#d8302a", w: 7 })
    + P(ell(0, -565, 42, 48), { s: C.ink, f: C.skin, w: 7 }) + P(cr([[-40, -585], [0, -625], [42, -585]]), { s: "#5a3a1a", w: 14 }) + dot(14, -566, 5) + P(cr([[4, -544], [20, -538], [34, -548]]), { s: C.ink, w: 4 });
  const player = k.layer(body, 102); k.place(player, 880, 900, 0, 0.95, 0.95);
  const ball = k.layer(P(ell(0, 0, 46, 46), { s: C.ink, f: "#fff", w: 7 }) + P(poly([0, -22], [20, -6], [12, 18], [-12, 18], [-20, -6]), { s: C.ink, f: "#222", w: 5 }), 103);
  api.caption("A footballer! Can you keep the ball up? Tap when it comes down to his foot!");
  api.say("letsTry");
  let by = 780, vy = -700, rot = 0, n = 0, over = false;
  const BX = 1010, show = () => k.place(ball, BX, by, rot);
  const counter = () => { api.top().querySelector("#kc")?.remove(); api.top().insertAdjacentHTML("beforeend", `<text id="kc" x="960" y="170" font-size="130" text-anchor="middle" fill="#fff" stroke="#16204a" stroke-width="14" paint-order="stroke">${n} / 5</text>`); };
  counter(); show();
  const tapped = k.press(() => {
    if (by > 560) { vy = -1250; n++; rot += 60; api.sfx.kick(); k.bump(player.g, "bounce"); counter(); if (n >= 5) { over = true; return true; } }
    else api.sfx.wrong();
    return false;
  });
  k.frames(dt => {
    vy += 2300 * dt; by += vy * dt; rot += 120 * dt;
    if (by > 840 && vy > 0) { by = 840; vy = -520; }
    show(); return over;
  }, ball);
  await api.until(tapped);
  over = true;
  api.sfx.sparkle(); k.say("5! ⚽", 960, 380, 150);
  await api.caption("Five keepy-uppies! He's ready for the big match.");
  api.mark();
  await api.next("Goal! ▶");
}

// ---------------------------------------------------------------- day 12: finger painting a mammoth
export async function cave(api) {
  const k = toolkit(api);
  api.sfx.fanfare();
  api.showScene(P(poly([420, -20], [1500, -20], [1500, 1100], [420, 1100]), { s: "#2b1d12", f: "#5e4632", w: 6 })
    + [[540, 120, 90], [1380, 160, 110], [500, 900, 100], [1400, 880, 90]].map(([x, y, r]) => P(bumpy(x, y, r, r * 0.7, 0.2, 7), { s: "#3b2a1d", f: "#6b5039", w: 6 })).join("")
    + P(ell(1330, 200, 40, 70), { s: "#ff9a2e", f: "#ffd23f", w: 6 }), 121);
  const ghost = `<g id="gh" opacity=".5" fill="none" stroke="#e8c9a0" stroke-width="10" stroke-dasharray="4 28" stroke-linecap="round">
    <ellipse cx="900" cy="600" rx="260" ry="170"/><ellipse cx="1180" cy="560" rx="110" ry="120"/><path d="M1260 600 C1320 700 1290 800 1230 830"/>
    <path d="M760 740 L760 880 M880 760 L880 880 M1000 760 L1000 880 M1100 740 L1100 880"/><path d="M1190 650 C1260 700 1280 650 1240 620"/></g>`;
  k.raw(ghost);
  api.caption("A cave! Use your finger to paint the mammoth, just like cave people did.");
  api.say("letsTry");
  const svg = api.svg(), top = api.top();
  const paint = document.createElementNS(NS, "g"); paint.setAttribute("stroke-linecap", "round"); paint.setAttribute("stroke-linejoin", "round"); top.appendChild(paint);
  let drawing = false, last = null, len = 0, cur = null;
  const down = e => { drawing = true; last = api.svgPoint(e); cur = document.createElementNS(NS, "path"); cur.setAttribute("d", `M${last.x} ${last.y} l0.1 0`); cur.setAttribute("stroke", "#d8602a"); cur.setAttribute("stroke-width", 54); cur.setAttribute("fill", "none"); cur.setAttribute("opacity", ".9"); paint.appendChild(cur); };
  let finished; const done = new Promise(r => { finished = r; });
  const move = e => { if (!drawing) return; const p = api.svgPoint(e); len += Math.hypot(p.x - last.x, p.y - last.y); cur.setAttribute("d", cur.getAttribute("d") + ` L${p.x} ${p.y}`); last = p; if (len > 2600) finished(); };
  const up = () => { drawing = false; };
  svg.addEventListener("pointerdown", down); svg.addEventListener("pointermove", move); window.addEventListener("pointerup", up);
  await api.until(done);
  svg.removeEventListener("pointerdown", down); svg.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up);
  const mam = [-160, -70, 80, 170].map(x => P(ln([x, -120], [x, -5]), { s: C.ink, w: 60 }) + P(ln([x, -120], [x, -8]), { s: "#a8431f", w: 44 })).join("")
    + P(ell(0, -210, 250, 160), { s: C.ink, f: "#a8431f", w: 9 }) + P(ell(250, -190, 110, 120), { s: C.ink, f: "#a8431f", w: 9 })
    + P(cr([[330, -170], [390, -90], [370, 0], [320, 20]]), { s: C.ink, w: 38 })
    + P(cr([[300, -120], [380, -70], [360, -20]]), { s: "#f5e6c4", w: 16 })
    + [-200, -140, -80, -20, 40, 100, 160].map(x => P(poly([x - 22, -70], [x, -10], [x + 22, -70]), { s: C.ink, f: "#7a2e12", w: 4 })).join("")
    + dot(285, -220, 9, C.white) + dot(288, -218, 5);
  const m = k.layer(mam, 122); k.place(m, 880, 840); paint.remove(); top.querySelector("#gh")?.remove();
  api.sfx.roar(); k.say("MAMMOTH!", 960, 260, 140); api.sfx.sparkle();
  await api.caption("You painted a woolly mammoth! People did this 30,000 years ago.");
  api.mark();
  await api.next("Wow! ▶");
}

// ---------------------------------------------------------------- day 15: stop the train! (the red flag, a fallen tree, who's on board)
export async function train(api) {
  const k = toolkit(api);
  api.sfx.fanfare();
  const track = P(ln([420, 905], [1500, 905]), { s: "#555", w: 10 }) + [440, 520, 600, 680, 760, 840, 920, 1000, 1080, 1160, 1240, 1320, 1400, 1480].map(x => P(ln([x, 890], [x, 940]), { s: "#6a4a2a", w: 14 })).join("");
  api.showScene(sky(0) + ground(900, 0.2) + hillBand(420, 1500, 640, 80, 6, "#7fbf6a", "#3f7a3a") + track, 151);
  const loco = P(poly([-20, -150], [-300, -150], [-300, -300], [-20, -300]), { s: C.ink, f: "#2a6f4a", w: 8 })
    + P(poly([-300, -300], [-420, -300], [-420, -150], [-300, -150]), { s: C.ink, f: "#d8302a", w: 8 })
    + P(poly([-410, -300], [-410, -390], [-310, -390], [-300, -300]), { s: C.ink, f: "#d8302a", w: 8 })
    + P(poly([-60, -300], [-40, -400], [10, -400], [30, -300]), { s: C.ink, f: "#222", w: 8 })
    + P(poly([0, -150], [50, -90], [-20, -60]), { s: C.ink, f: "#ffd23f", w: 6 })
    + wheel(-80, -75, 70) + wheel(-250, -75, 70) + wheel(-370, -55, 50);
  const carriage = x => P(poly([x, -150], [x - 260, -150], [x - 260, -330], [x, -330]), { s: C.ink, f: "#2a6fd8", w: 8 })
    + P(poly([x - 220, -290], [x - 150, -290], [x - 150, -220], [x - 220, -220]), { s: C.ink, f: "#cfe8ff", w: 5 }) + P(poly([x - 110, -290], [x - 40, -290], [x - 40, -220], [x - 110, -220]), { s: C.ink, f: "#cfe8ff", w: 5 })
    + wheel(x - 60, -60, 55) + wheel(x - 200, -60, 55);
  const t = k.layer(loco + carriage(-450) + carriage(-730), 152), TS = 0.6;
  // the fallen tree and two rocks, lying on the line ahead
  const logArt = P(poly([-170, -60], [170, -40], [175, 10], [-170, 0]), { s: C.ink, f: "#8a5a2b", w: 8 }) + P(ell(-170, -30, 18, 32), { s: C.ink, f: "#c08a4a", w: 6 })
    + P(ln([-60, -50], [-110, -150]), { s: "#5a3614", w: 14 }) + P(ln([60, -48], [110, -140]), { s: "#5a3614", w: 14 })
    + P(ell(-115, -165, 55, 40), { s: "#1f5a2a", f: "#4fae5a", w: 6 }) + P(ell(115, -155, 55, 40), { s: "#1f5a2a", f: "#4fae5a", w: 6 });
  const rockArt = r => P(bumpy(0, -r * 0.6, r, r * 0.7, 0.15, 7), { s: C.ink, f: "#9a9a9a", w: 7 });
  const items = [[k.layer(rockArt(70), 154), 1170], [k.layer(logArt, 155), 1290], [k.layer(rockArt(55), 156), 1410]].map(([g, x]) => { k.place(g, x, 905); return { g, x, gone: false }; });
  const TARGET = 1000;
  let x = 330, v = 150, waves = 0, braking = false, chug = 0;
  k.place(t, x, 905, 0, TS, TS);
  k.raw(`<g id="meter">${[0, 1, 2, 3, 4, 5].map(i => `<circle id="m${i}" cx="${795 + i * 74}" cy="150" r="28" fill="#fff" stroke="#2b2b2b" stroke-width="7" opacity=".85"/>`).join("")}</g>`);
  k.raw(`<g id="flag" transform="translate(960 700)"><line x1="0" y1="0" x2="0" y2="220" stroke="#6a4a2a" stroke-width="16" stroke-linecap="round"/><polygon points="0,0 150,24 136,110 0,96" fill="#d8302a" stroke="#2b2b2b" stroke-width="8" stroke-linejoin="round"/></g>`);
  const flag = api.top().querySelector("#flag");
  api.caption("A train is coming, but a tree has fallen on the line! Wave the red flag: wiggle your finger left and right!");
  api.say("letsTry");
  // waving: every swing of the finger from one side to the other fills a circle
  const svg = api.svg();
  let down = false, last = null, dir = 0, anchor = 0;
  const onDown = e => { down = true; last = api.svgPoint(e); anchor = last.x; dir = 0; };
  const onMove = e => {
    if (!down) return;
    const p = api.svgPoint(e);
    flag.setAttribute("transform", `translate(${p.x} ${Math.min(p.y, 780) - 140}) rotate(${Math.max(-28, Math.min(28, (p.x - last.x) * 2.2))})`);
    const d = Math.sign(p.x - anchor);
    if (Math.abs(p.x - anchor) > 60) {
      if (d !== dir && dir !== 0 && waves < 6) { api.top().querySelector(`#m${waves}`)?.setAttribute("fill", "#d8302a"); api.sfx.note(waves); waves++; }
      dir = d; anchor = p.x;
    }
    last = p;
  };
  const onUp = () => { down = false; };
  svg.addEventListener("pointerdown", onDown); svg.addEventListener("pointermove", onMove); window.addEventListener("pointerup", onUp);
  await k.frames(dt => {
    const vmax = 150 * (1 - 0.8 * Math.min(1, waves / 6));
    if (!braking) { v += (vmax - v) * Math.min(1, dt * 3); x += v * dt; if (waves >= 6 || x + v * v / 900 >= TARGET) braking = true; }
    else { v -= 420 * dt; if (v <= 0) return true; x += v * dt; }
    chug += v * dt; if (chug > 40) { chug = 0; api.sfx.chug(); }
    k.place(t, x, 905, 0, TS, TS); return false;
  }, t);
  svg.removeEventListener("pointerdown", onDown); svg.removeEventListener("pointermove", onMove); window.removeEventListener("pointerup", onUp);
  flag.remove(); api.top().querySelector("#meter")?.remove();
  api.sfx.squeak(); k.say("SQUEEEAK!", 960, 300, 120);
  if (x < TARGET - 30) { await api.wait(900); k.place(t, TARGET, 905, 0, TS, TS, Math.max(900, (TARGET - x) * 12), "ease-out"); await api.wait(Math.max(900, (TARGET - x) * 12) + 100); x = TARGET; }
  await api.wait(500);
  // clear the line
  api.caption("The train stopped just in time! Quick, clear the line: tap the rocks and the tree!");
  let cleared = 0;
  await k.press(p => {
    const it = items.find(i => !i.gone && k.near(p, i.x, 800, 150));
    if (!it) return false;
    it.gone = true; cleared++; api.sfx.crunch(); k.bump(it.g.g, "hop");
    setTimeout(() => { k.place(it.g, it.x + (cleared % 2 ? 260 : -260), 300, cleared * 120, 0.6, 0.6, 800, "ease-out"); it.g.style.opacity = "0"; it.g.style.transition += ", opacity 800ms"; }, 200);
    return cleared >= 3;
  });
  await api.wait(1000); api.sfx.toot(); k.say("TOOT!", 960, 300, 120);
  // who's on board?
  api.caption("The line is clear! Tap the train to see who is on board!");
  const WIN = [-525, -635, -805, -915], FACES = [["🐑", () => api.sfx.baa()], ["🐰", () => api.sfx.squeak()], ["🐻", () => api.sfx.roar()], ["🐧", () => api.sfx.hoot()]];
  let seen = 0;
  const riders = document.createElementNS(NS, "g"); api.top().appendChild(riders);   // the passengers ride with the train
  await k.press(p => {
    if (p.x < x - 1000 * TS || p.x > x + 40 || p.y < 600 || p.y > 960) return false;
    const wx = x - 110 - seen * 115;
    FACES[seen][1]();
    riders.insertAdjacentHTML("beforeend", `<text class="elfFound" x="${wx}" y="690" font-size="100" text-anchor="middle">${FACES[seen][0]}</text>`);
    k.say("Hi!", wx, 560, 70, "#2a6fd8");
    seen++; return seen >= 4;
  });
  await api.wait(900);
  api.sfx.toot(); k.say("CHOO CHOO!", 960, 300, 120);
  k.place(t, 2500, 905, 0, TS, TS, 3200, "ease-in");
  riders.style.transition = "transform 3200ms ease-in"; riders.style.transform = `translate(${2500 - x}px, 0)`;
  let cc = 0; const iv = setInterval(() => { if (++cc > 10) clearInterval(iv); api.sfx.chug(); }, 300);
  await api.caption("Thank you for saving the train! All aboard, next stop Bethlehem!");
  api.mark();
  await api.next("Choo choo! ▶");
}

// ---------------------------------------------------------------- day 17: the animal dance party
const hat = (x, y, c) => P(poly([x - 30, y], [x + 30, y], [x, y - 80]), { s: C.ink, f: c, w: 6 }) + starP(x, y - 88, 18);
// each animal has three dance moves; tapping it again switches to the next. o = what to do at t seconds; c = pivot height (px above the feet)
const ease = u => u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
const MOVES = [
  [{ n: "TWIRL!", c: 80, f: t => ({ dy: -Math.abs(Math.sin(t * 5)) * 90, rot: t * 640 }) },
   { n: "BOING!", c: 0, f: t => { const u = Math.abs(Math.sin(t * 4.5)); return { dy: -u * 230, sx: 1 + 0.18 * (1 - u), sy: 1 - 0.22 * (1 - u) }; } },
   { n: "WOOLLY WIGGLE!", c: 40, f: t => ({ dx: Math.sin(t * 7) * 40, rot: Math.sin(t * 14) * 16, sx: 1 + 0.12 * Math.sin(t * 14), sy: 1 - 0.1 * Math.sin(t * 14) }) }],
  [{ n: "MOONWALK!", c: 0, f: t => ({ dx: Math.sin(t * 2.2) * 150, dy: -Math.abs(Math.sin(t * 8)) * 14, rot: Math.cos(t * 2.2) * -4 }) },
   { n: "HEAD BANG!", c: 0, f: t => ({ rot: Math.sin(t * 7) * 17 + 5, dy: -Math.abs(Math.sin(t * 7)) * 20 }) },
   { n: "BACKFLIP!", c: 120, f: t => { const u = (t * 0.8) % 1; return { rot: -360 * ease(u), dy: -Math.sin(Math.PI * u) * 280 }; } }],
  [{ n: "ROBOT!", c: 0, f: t => { const q = Math.floor(t * 6); return { dx: ((q % 4) - 1.5) * 55, rot: q % 2 ? 9 : -9, dy: q % 3 === 0 ? -30 : 0 }; } },
   { n: "SPLITS!", c: 0, f: t => { const u = Math.abs(Math.cos(t * 2.6)); return { sy: 0.5 + 0.5 * u, sx: 1.35 - 0.35 * u }; } },
   { n: "CONGA!", c: 0, f: t => ({ dx: Math.sin(t * 3) * 190, dy: -Math.abs(Math.sin(t * 6)) * 55, rot: Math.sin(t * 6) * 6 }) }],
];
const CRIES = ["baa", "hee", "moo"];
export async function party(api) {
  const k = toolkit(api);
  api.sfx.fanfare();
  api.showScene(P(poly([420, -20], [1500, -20], [1500, 1100], [420, 1100]), { s: "#241049", f: "#2b1458", w: 4 }) + ground(880, 0.1, "#5a2b8a", "#c06bff")
    + P(ell(960, 150, 70, 70), { s: C.ink, f: "#d9d9e8", w: 7 }) + P(ln([960, -20], [960, 80]), { s: C.ink, w: 6 })
    + [[-60, -40], [-20, 20], [30, 50], [60, -10]].map(([dx, dy]) => dot(960 + dx, 150 + dy, 8, "#7aa7ff")).join(""), 171);
  const cast = [
    { x: 610, y: 905, s: 0.9, art: sheep(0, 0, 1.5) + hat(70, -100, "#ff4fa3") },
    { x: 930, y: 905, s: 0.8, art: donkey(0, 0, 1.0) + hat(120, -300, "#3fd0ff") },
    { x: 1250, y: 905, s: 0.75, art: ox(0, 0, 0.9) + hat(120, -330, "#ffd23f") }];
  const an = cast.map((c, i) => { const g = k.layer(c.art, 172 + i); k.place(g, c.x, c.y, 0, c.s, c.s); return g; });
  api.caption("A dance party! Tap an animal to make it dance. Tap again for a new move!");
  api.say("letsTry");
  const taps = [0, 0, 0], t0 = [0, 0, 0], beams = ["#ff4fa3", "#3fd0ff", "#ffd23f"];
  let over = false, beat = 0;
  k.frames(() => {
    const now = performance.now() / 1000;
    cast.forEach((c, i) => {
      if (!taps[i]) return;
      const m = MOVES[i][(taps[i] - 1) % 3], o = m.f(now - t0[i]);
      an[i].style.transition = "none";
      an[i].style.transform = `translate(${c.x + (o.dx || 0)}px, ${c.y + (o.dy || 0) - m.c}px) rotate(${o.rot || 0}deg) scale(${c.s * (o.sx || 1)}, ${c.s * (o.sy || 1)}) translate(0, ${m.c / c.s}px)`;
    });
    return over;
  }, an[0]);
  const iv = setInterval(() => { if (!an[0].isConnected || over) return clearInterval(iv); if (taps.some(Boolean)) api.sfx.note(beat++); }, 420);
  await k.press(p => {
    cast.forEach((c, i) => {
      if (!k.near(p, c.x + 40, 700, 220)) return;
      if (!taps[i]) k.raw(`<polygon points="960,150 ${c.x - 100},900 ${c.x + 140},900" fill="${beams[i]}" opacity=".28"/>`);
      taps[i]++; t0[i] = performance.now() / 1000; api.sfx[CRIES[i]]();
      k.say(MOVES[i][(taps[i] - 1) % 3].n, c.x + 40, 360 + i * 80, 72, ["#ff4fa3", "#3fd0ff", "#c99a00"][i]);
    });
    return taps.every(n => n >= 2);
  });
  k.say("PARTY!", 960, 300, 160, "#ff4fa3");
  await api.wait(4200); over = true;
  await api.caption("A twirling sheep, a moonwalking donkey and a robot ox. Best dance party on the farm!");
  api.mark();
  await api.next("Encore! ▶");
}

// ---------------------------------------------------------------- day 19: the mystery carriage
export async function carriage(api) {
  const k = toolkit(api);
  api.sfx.fanfare();
  api.showScene(P(poly([420, -20], [1500, -20], [1500, 1100], [420, 1100]), { s: "#101840", f: "#16204a", w: 3 }) + moon(1300, 160, 70)
    + [[560, 100], [760, 220], [1000, 90], [1160, 260], [1420, 380], [520, 360]].map(([x, y]) => starP(x, y, 20)).join("")
    + ground(900, 0.1, "#2b4a3f", "#6fa36b") + P(ln([420, 905], [1500, 905]), { s: "#777", w: 9 }), 191);
  const WIN = [-220, 0, 220];
  const car = P(poly([-360, -120], [360, -120], [360, -400], [-360, -400]), { s: "#0b0b20", f: "#3a2a4f", w: 9 })
    + P(poly([-390, -400], [390, -400], [330, -470], [-330, -470]), { s: "#0b0b20", f: "#2a1d3a", w: 9 })
    + WIN.map(x => P(poly([x - 70, -340], [x + 70, -340], [x + 70, -190], [x - 70, -190]), { s: "#0b0b20", f: "#1a1230", w: 7 })).join("")
    + wheel(-230, -60, 60) + wheel(230, -60, 60);
  const c = k.layer(car, 192); k.place(c, -300, 905);
  const lantern = k.layer(P(ln([0, -40], [0, 0]), { s: C.ink, w: 6 }) + P(poly([-20, 0], [20, 0], [26, 50], [-26, 50]), { s: C.ink, f: "#ffe27a", w: 6 }), 193);
  api.caption("What's that rumbling in the dark?");
  await api.wait(300); k.place(c, 920, 905, 0, 1, 1, 2600, "ease-out"); k.place(lantern, 1300, 520, 0, 1, 1, 2600, "ease-out");
  for (const d of [0, 400, 900, 1500]) setTimeout(() => api.sfx.chug(), d);
  await api.wait(2800);
  // part 1: it's dark! slide a finger about to shine a lantern; each window you light shows who is inside
  const top = api.top(), riders = document.createElementNS(NS, "g");
  top.insertAdjacentHTML("beforeend", `<defs><radialGradient id="lgr"><stop offset="0.4" stop-color="#000"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
    <mask id="lmk" maskUnits="userSpaceOnUse" x="420" y="0" width="1080" height="1080"><rect x="420" y="0" width="1080" height="1080" fill="#fff"/><circle id="lcirc" cx="1300" cy="580" r="230" fill="url(#lgr)"/></mask></defs>
    <rect x="420" y="0" width="1080" height="1080" fill="#050818" opacity=".78" mask="url(#lmk)" pointer-events="none"/>`);
  top.appendChild(riders);
  const circ = top.querySelector("#lcirc");
  api.caption("It's very dark! Slide your finger over the carriage to shine your lantern and find who's inside.");
  api.say("letsTry");
  const FACES = [["🦉", () => api.sfx.hoot()], ["🐈‍⬛", () => api.sfx.meow()], ["🦇", () => api.sfx.squeak()]];
  const seen = new Set(), svg = api.svg();
  let down = false;
  const light = e => {
    const p = api.svgPoint(e); circ.setAttribute("cx", p.x); circ.setAttribute("cy", p.y);
    WIN.forEach((dx, i) => {
      if (seen.has(i) || !k.near(p, 920 + dx, 640, 115)) return;
      seen.add(i); FACES[i][1]();
      riders.insertAdjacentHTML("beforeend", `<rect x="${920 + dx - 70}" y="${905 - 340}" width="140" height="150" rx="6" fill="#ffe27a" stroke="#0b0b20" stroke-width="7"/><text class="elfFound" x="${920 + dx}" y="${905 - 215}" font-size="110" text-anchor="middle">${FACES[i][0]}</text>`);
      k.say(["Hoot!", "Meow!", "Eek!"][i], 920 + dx, 520, 90, "#ffe27a");
    });
    return seen.size >= 3;
  };
  await new Promise(resolve => {
    const dn = e => { down = true; if (light(e)) resolve(); }, mv = e => { if (down && light(e)) resolve(); }, up = () => { down = false; };
    svg.addEventListener("pointerdown", dn); svg.addEventListener("pointermove", mv); window.addEventListener("pointerup", up);
    api.until(new Promise(r => { const iv = setInterval(() => { if (seen.size >= 3) { clearInterval(iv); r(); } }, 100); })).then(() => { svg.removeEventListener("pointerdown", dn); svg.removeEventListener("pointermove", mv); window.removeEventListener("pointerup", up); });
  });
  await api.wait(900); api.sfx.sparkle();
  // part 2: everyone is aboard, so start the train: each tap is a chug
  api.caption("An owl, a cat and a bat! Now let's get going: tap and tap to make the train chug!");
  let cx = 920, n = 0;
  const NEED = 8;
  await k.press(() => {
    n++; cx += 30; api.sfx.chug(); setTimeout(() => api.sfx.chug(), 120);
    k.place(c, cx, 905, 0, 1, 1, 180); k.place(lantern, 1300 + (cx - 920), 520, 0, 1, 1, 180);
    riders.style.transition = "transform 180ms"; riders.style.transform = `translate(${cx - 920}px, 0)`;
    k.say("chug", cx - 330, 430 - (n % 3) * 40, 70, "#cfd6ff");
    return n >= NEED;
  });
  await api.wait(300); api.sfx.toot(); k.say("TOOT TOOT!", 960, 300, 120, "#ffe27a");
  const dx = 2500 - cx;
  k.place(c, 2500, 905, 0, 1, 1, 3000, "ease-in"); k.place(lantern, 1300 + (2500 - 920), 520, 0, 1, 1, 3000, "ease-in");
  riders.style.transition = "transform 3000ms ease-in"; riders.style.transform = `translate(${2500 - 920}px, 0)`;
  let cc = 0; const iv = setInterval(() => { if (++cc > 10) clearInterval(iv); api.sfx.chug(); }, 280);
  await api.caption("An owl, a cat and a bat, off into the night. Where is the carriage going? Nobody knows…");
  api.mark();
  await api.next("Goodnight! ▶");
}

// ---------------------------------------------------------------- day 22: the penguin on a tea tray
export async function penguin(api) {
  const k = toolkit(api);
  api.sfx.fanfare();
  api.showScene(P(poly([420, -20], [1500, -20], [1500, 1100], [420, 1100]), { s: "#cfe2f5", f: "#dbe9f7", w: 3 })
    + P(poly([420, 470], [1500, 860], [1500, 1100], [420, 1100]), { s: "#9bb8d9", f: "#f6fbff", w: 8 })
    + [[560, 100], [760, 300], [980, 150], [1220, 260], [1400, 90], [650, 520]].map(([x, y]) => dot(x, y, 9, "#fff")).join("")
    + P(bumpy(1340, 810, 120, 60, 0.2, 7), { s: "#9bb8d9", f: "#fff", w: 7 }), 221);
  const art = P(poly([-80, 14], [80, 14], [96, 0], [-96, 0]), { s: C.ink, f: "#d8302a", w: 7 }) + P(ell(0, 0, 60, 10), { s: "#999", w: 4 })
    + P(ell(-34, -4, 24, 10), { s: C.ink, f: "#ff9a2e", w: 5 }) + P(ell(34, -4, 24, 10), { s: C.ink, f: "#ff9a2e", w: 5 })
    + P(ell(0, -100, 62, 98), { s: C.ink, f: "#2b2b3a", w: 7 }) + P(ell(0, -84, 40, 74), { s: C.ink, f: "#fff", w: 5 })
    + P(ln([-60, -110], [-98, -60]), { s: C.ink, w: 18 }) + P(ln([60, -110], [98, -60]), { s: C.ink, w: 18 })
    + P(ell(0, -196, 46, 42), { s: C.ink, f: "#2b2b3a", w: 7 }) + P(poly([-10, -190], [34, -184], [-6, -172]), { s: C.ink, f: "#ff9a2e", w: 5 })
    + dot(-16, -204, 8, "#fff") + dot(-14, -204, 4) + dot(14, -204, 8, "#fff") + dot(16, -204, 4)
    + P(poly([-40, -222], [40, -222], [10, -300]), { s: C.ink, f: "#d8302a", w: 6 }) + P(ell(10, -302, 14, 14), { s: C.ink, f: "#fff", w: 4 }) + P(ln([-44, -222], [44, -222]), { s: C.ink, w: 14, f: "#fff" });
  const pen = k.layer(art, 222);
  const STOPS = [[600, 540, -8], [930, 655, 6], [1250, 775, -4]];
  k.place(pen, STOPS[0][0], STOPS[0][1], -10);
  api.caption("A penguin in a Santa hat, sitting on a tea tray! Tap to give him a push!");
  api.say("letsTry");
  let i = 0, busy = false;
  await k.press(() => {
    if (busy) return false; busy = true;
    i++; api.sfx.whee();
    const [x, y] = STOPS[i];
    k.place(pen, (STOPS[i - 1][0] + x) / 2, (STOPS[i - 1][1] + y) / 2 - 90, 25, 1, 1, 600, "ease-out");
    setTimeout(() => { k.place(pen, x, y, i === 2 ? 0 : -8, 1, 1, 600, "ease-in"); }, 600);
    setTimeout(() => { busy = false; }, 1250);
    return i >= 2;
  });
  await api.wait(1250);
  api.sfx.crunch(); k.place(pen, 1340, 800, 0, 1.2, 0.5, 250); k.say("SPLOSH!", 1100, 520, 130, "#2a6fd8");
  await api.wait(700); k.place(pen, 1340, 800, 0, 1, 1, 400); api.sfx.hee();
  await api.caption("Splosh! Right into the snowdrift. Squawk! Merry Christmas!");
  api.mark();
  await api.next("Again! ▶");
}

// ---------------------------------------------------------------- day 24: Santa's sleigh and Rudolph's nose
const deer = (nose) => P(ln([-40, -50], [-48, 0]), { s: "#5a3614", w: 14 }) + P(ln([-10, -50], [-14, 0]), { s: "#5a3614", w: 14 }) + P(ln([30, -50], [34, 0]), { s: "#5a3614", w: 14 }) + P(ln([58, -50], [66, 0]), { s: "#5a3614", w: 14 })
  + P(ell(0, -70, 78, 42), { s: C.ink, f: "#a8703a", w: 7 }) + P(ell(86, -120, 34, 30), { s: C.ink, f: "#a8703a", w: 7 })
  + P(ln([80, -148], [66, -200], [44, -216]), { s: "#5a3614", w: 9 }) + P(ln([96, -148], [112, -204], [136, -214]), { s: "#5a3614", w: 9 })
  + dot(94, -128, 6, "#fff") + dot(96, -128, 3) + dot(116, -112, nose ? 15 : 8, nose ? "#ff2a2a" : "#3a2a1a");
export async function sleigh(api) {
  const k = toolkit(api);
  api.sfx.fanfare();
  api.showScene(P(poly([420, -20], [1500, -20], [1500, 1100], [420, 1100]), { s: "#101840", f: "#16204a", w: 3 })
    + [[560, 100], [760, 200], [1000, 70], [1160, 150], [1420, 90], [640, 380], [1380, 400]].map(([x, y]) => starP(x, y, 20)).join("")
    + hillBand(420, 1500, 880, 60, 5, "#2b4a3f", "#6fa36b") + stable(960, 1010, 420, 260) + moon(500, 130, 55), 241);
  const rig = P(ln([-80, -60], [330, -60]), { s: "#a8820a", w: 5 })
    + P(cr([[-190, -150], [-120, -60], [100, -40], [210, -90], [200, -150]]), { s: C.ink, f: "#d8302a", w: 8 }) + P(ln([-210, -20], [210, -20], [250, -60]), { s: "#d4a017", w: 10 })
    + P(ell(0, -150, 36, 34), { s: C.ink, f: C.skin, w: 6 }) + P(poly([-32, -172], [32, -172], [10, -240]), { s: C.ink, f: "#d8302a", w: 6 }) + P(poly([-30, -140], [30, -140], [0, -90]), { s: C.ink, f: "#fff", w: 5 })
    + P(poly([-40, -100], [40, -100], [46, -30], [-46, -30]), { s: C.ink, f: "#d8302a", w: 6 });
  const s = k.layer(rig, 242); const d1 = k.layer(deer(false), 243), d2 = k.layer(deer(true), 244);
  const at = (x, y, ms = 0, ease) => { k.place(s, x, y, 0, 1, 1, ms, ease); k.place(d1, x + 320, y + 40, 0, 1, 1, ms, ease); k.place(d2, x + 520, y + 20, 0, 1, 1, ms, ease); };
  at(-700, 330);
  api.caption("Look up! It's a sleigh in the sky!");
  await api.wait(300); at(640, 330, 2600, "ease-out"); await api.wait(2800);
  const NX = 640 + 520 + 116, NY = 330 + 20 - 112;
  api.caption("It's Santa! Tap Rudolph's red nose to make it glow!");
  api.say("letsTry");
  let n = 0;
  await k.press(p => {
    if (!k.near(p, NX, NY, 120)) return false;
    n++; api.sfx.note(n * 2); k.raw(`<circle cx="${NX}" cy="${NY}" r="${n * 90}" fill="#ff4a4a" opacity=".22"/>`);
    k.bump(d2.g);
    return n >= 3;
  });
  api.sfx.sparkle(); k.say("Ho ho ho!", 960, 150, 130);
  await api.wait(1400);
  at(1900, 280, 1800, "ease-in");
  await api.caption("Even Santa stopped to look at the baby, then zoomed off to deliver the presents!");
  api.mark();
  await api.next("Merry Christmas! ▶");
}

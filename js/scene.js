// The big Bethlehem scene that fills in day by day: night sky, Nazareth on the left, the road, Bethlehem, the stable
// under the star, the shepherds' hill and the desert road from the East. The doors sit where their bit of the story
// happens, so December travels from left to right. Drawn once with the crayon kit (globals from crayon/*.js).

export const W = 3600, H = 1200, TOP = 150;   // the picture is drawn 3600 x 1400; the top 150 and bottom 50 are trimmed off

// window number -> where its door sits (centre) and its size.
export const DOORS = {
  1: [330, 760], 2: [560, 520], 3: [170, 830], 4: [650, 900], 5: [820, 1080], 6: [1000, 1230], 7: [1170, 1080],
  8: [1000, 400], 9: [1365, 905], 10: [1720, 865, 120, 150], 11: [2110, 1080], 12: [2330, 1250], 13: [1600, 640],
  14: [2730, 1090], 15: [2905, 845], 16: [3070, 1150], 17: [3300, 360], 18: [3420, 1030], 19: [3230, 1250],
  20: [2010, 850], 21: [1855, 1080], 22: [2000, 380], 23: [2560, 1270], 24: [2425, 990, 150, 190], 25: [2620, 300],
};
const DOOR_COLOURS = ["#e8392c", "#2f7de1", "#43b04a", "#8e4fc9", "#f28c28", "#c2185b"];

function sceneArt() {
  rng = mulberry32(2026);
  let s = "";
  // stars, scattered but kept off the hills
  for (let i = 0; i < 90; i++) { const x = R(20, W - 20), y = R(20, 640); s += dot(x, y, R(2.5, 5.5), rng() < 0.7 ? "#fff6c8" : C.yellow); }
  for (let i = 0; i < 9; i++) s += sparkle(R(100, W - 100), R(60, 560), R(12, 20), 0, "#fff6c8");
  // the moon, over Nazareth
  s += P(ell(190, 210, 72), { s: "#e8d98a", f: "#fff3b0", w: 6 }) + `<circle cx="225" cy="190" r="66" fill="#121a40"/>`;
  // hills get a solid colour under their crayon scribble, so the sky doesn't show through the gaps
  const far = hillBand(0, W, 940, 210, 26, N.farHill, N.farHillEdge, 3);
  s += far.replace(/<path class="o" d="([^"]+)"[^>]*>/, `<path d="$1" fill="${N.farHill}"/>`) + far;
  // the near ground: Nazareth's hill, down to the road, up to Bethlehem, the stable hollow, the shepherds' hill, the desert
  const g = [[-20, 840], [200, 800], [450, 810], [650, 880], [900, 1060], [1150, 1020], [1400, 960], [1700, 930], [2000, 980],
    [2250, 1090], [2600, 1100], [2780, 960], [2950, 900], [3150, 990], [3350, 1160], [3620, 1180]];
  const near = poly(...g, [3620, 1420], [-20, 1420]);
  s += `<path d="${near}" fill="${N.nightHill}"/>` + P(near, { s: N.nightHillEdge, f: N.nightHill, w: 8 });
  // the road from Nazareth to Bethlehem
  const road = [[600, 880], [760, 960], [900, 1110], [1060, 1130], [1240, 1050], [1365, 985]];
  s += P(cr(road), { s: "#6d5a3c", w: 74 }) + P(cr(road), { s: "#b39a6b", w: 54 });
  // Nazareth: a carpenter's shed, Mary's house, two neighbours and a palm
  s += palm(70, 850, 0.8);
  s += flatHouse(175, 900, 160, 130, { lit: true });
  s += flatHouse(330, 845, 220, 190, { lit: true, doorAt: 0.25, winAt: -0.22 });
  s += flatHouse(520, 870, 170, 150, { lit: true });
  // Bethlehem: the town gate, houses, the inn, a lantern
  s += P(poly([1300, 1000], [1300, 860], [1340, 820], [1390, 820], [1430, 860], [1430, 1000]), { s: N.plasterEdge, f: "#cdb88a", w: 8 });
  s += flatHouse(1490, 990, 150, 170, { lit: true });
  s += flatHouse(1600, 960, 160, 260, { lit: true, door: false });
  s += flatHouse(1720, 950, 250, 300, { lit: true, door: false, winAt: 0.3 });
  s += P(poly([1650, 700], [1790, 700], [1790, 750], [1650, 750]), { s: N.woodDark, f: N.wood, w: 6 }) + TX("INN", 1720, 740, { size: 40, c: "#fff3b0", a: "fade", dur: 0.1 });
  s += flatHouse(2010, 1000, 200, 220, { lit: true, door: false, winAt: 0 });
  s += flatHouse(2140, 1040, 130, 120, { lit: true });
  s += P(ln([1900, 1150], [1900, 1020]), { s: N.woodDark, w: 10 }) + P(ell(1900, 1000, 20, 26), { s: C.orange, f: N.lampGlow, w: 5 });
  // the stable, in the hollow under the star
  s += stable(2425, 1100, 420, 300);
  // the shepherds' hill: a tent, a fire, the sheep
  s += tent(2905, 905, 210, 180) + fire(3010, 950, 0.35, 0);
  s += sheep(2790, 1010, 0.8) + sheep(3100, 1040, 0.75) + sheep(2950, 1090, 0.85);
  // the desert road from the East
  s += dune(3330, 1300, 560, 170) + dune(3540, 1260, 420, 140) + palm(3450, 1180, 0.7);
  return s;
}

function doorArt(n, x, y, w, h, state) {
  const col = DOOR_COLOURS[n % DOOR_COLOURS.length], l = x - w / 2, r = x + w / 2, t = y - h / 2, b = y + h / 2;
  const num = `<text x="${x}" y="${y + 22}" font-size="${n === 26 ? 48 : 64}" text-anchor="middle" fill="#fff" class="num">${n === 26 ? "★" : n}</text>`;
  if (state === "done") {
    return `<path d="${poly([l, b], [l, t], [r, t], [r, b])}" fill="#fff1a8" stroke="#2b2b2b" stroke-width="6"/>`
      + `<path d="${poly([l, b], [l, t], [l - w * 0.42, t + 14], [l - w * 0.42, b + 10])}" fill="${col}" stroke="#2b2b2b" stroke-width="6"/>`
      + `<text x="${x}" y="${y + 18}" font-size="52" text-anchor="middle" fill="${col}" class="num">${n === 26 ? "★" : n}</text>`
      + `<circle cx="${r - 4}" cy="${t + 6}" r="30" fill="${C.green}" stroke="#fff" stroke-width="6"/>`
      + `<path d="M${r - 18},${t + 6} l10,12 l20,-24" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>`;
  }
  return (state === "today" ? `<circle class="halo" cx="${x}" cy="${y}" r="${Math.max(w, h) * 0.9}" fill="url(#doorGlow)"/>` : "")
    + `<g class="leaf"><path d="${poly([l, b], [l, t], [r, t], [r, b])}" fill="${col}" stroke="#2b2b2b" stroke-width="6"/>`
    + `<circle cx="${r - 16}" cy="${y + 6}" r="7" fill="${C.gold}" stroke="#2b2b2b" stroke-width="3"/>${num}</g>`;
}

export function drawScene(svg) {
  svg.setAttribute("viewBox", `0 ${TOP} ${W} ${H}`);
  svg.innerHTML = `<defs>
      ${crayonDefs("kid-scene", false)}
      <filter id="kid-door" x="-5%" y="-5%" width="110%" height="110%">
        <feTurbulence type="fractalNoise" baseFrequency="0.011" numOctaves="2" seed="3" result="n"/>
        <feDisplacementMap in="SourceGraphic" in2="n" scale="9" xChannelSelector="R" yChannelSelector="G"/>
      </filter>
      <linearGradient id="nightSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b1130"/><stop offset="0.7" stop-color="#1d2a63"/><stop offset="1" stop-color="#2b3b7a"/></linearGradient>
      <radialGradient id="starGlow"><stop offset="0" stop-color="#fff7c2" stop-opacity="0.9"/><stop offset="0.35" stop-color="#ffd84a" stop-opacity="0.35"/><stop offset="1" stop-color="#ffd84a" stop-opacity="0"/></radialGradient>
      <radialGradient id="doorGlow"><stop offset="0.4" stop-color="#ffe680" stop-opacity="0.9"/><stop offset="1" stop-color="#ffe680" stop-opacity="0"/></radialGradient>
      <filter id="sticker" x="-20%" y="-20%" width="140%" height="140%">
        <feMorphology in="SourceAlpha" operator="dilate" radius="9" result="fat"/>
        <feFlood flood-color="#ffffff"/><feComposite in2="fat" operator="in" result="edge"/>
        <feGaussianBlur in="fat" stdDeviation="6" result="blur"/><feOffset in="blur" dx="4" dy="8" result="drop"/>
        <feFlood flood-color="#000" flood-opacity="0.45"/><feComposite in2="drop" operator="in" result="shadow"/>
        <feMerge><feMergeNode in="shadow"/><feMergeNode in="edge"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#nightSky)"/>
    <g id="theStar" transform="translate(2425 230)">
      <path class="beam" d="M-40,40 L-260,${870} L260,${870} L40,40 Z" fill="#fff3a0"/>
      <circle class="glow" r="260" fill="url(#starGlow)"/>
      <path class="star" d="${star5(0, 0, 70)}" fill="${C.yellow}" stroke="#fff6c8" stroke-width="6"/>
    </g>
    <g id="art" filter="url(#kid-scene)"></g>
    <g id="doors" filter="url(#kid-door)"></g>
    <g id="stickers"></g>`;
  const h = crayonMount(svg.querySelector("#art"), sceneArt(), 2026);
  crayonFrame(h, crayonEnd(h));
}

// state(n) -> 'locked' | 'ready' | 'today' | 'done' | 'hidden'
export function drawDoors(svg, state) {
  const g = svg.querySelector("#doors");
  g.innerHTML = Object.entries(DOORS).map(([k, [x, y, w = 110, h = 140]]) => {
    const n = +k, st = state(n);
    if (st === "hidden") return "";
    return `<g class="door ${st}" data-n="${n}" style="transform-origin:${x}px ${y}px">${doorArt(n, x, y, w, h, st)}</g>`;
  }).join("");
}

// the star over the stable gets brighter with every window done (like the cards' love-o-meter, it only goes up)
export function setStar(svg, done, total = 25) {
  const u = Math.min(1, done / total), star = svg.querySelector("#theStar");
  star.querySelector(".star").setAttribute("transform", `scale(${(0.55 + 0.75 * u).toFixed(3)})`);
  star.querySelector(".star").style.opacity = (0.45 + 0.55 * u).toFixed(3);
  star.querySelector(".glow").style.opacity = (0.15 + 0.85 * u).toFixed(3);
  star.querySelector(".beam").style.opacity = (0.22 * u * u).toFixed(3);
}

// a sticker in the scene: crayon drawings are mounted (scribble fills) inside the sticker border; others are plain SVG
export function placeSticker(svg, day, st, arrive = false) {
  const layer = svg.querySelector("#stickers");
  layer.querySelector(`[data-day="${day}"]`)?.remove();
  const outer = document.createElementNS("http://www.w3.org/2000/svg", "g");
  outer.dataset.day = day;
  outer.setAttribute("transform", `translate(${st.at[0]} ${st.at[1]}) scale(${st.scale})`);
  outer.innerHTML = `<g class="stk${arrive ? " arrive" : ""}" filter="url(#sticker)"><g class="ink" filter="url(#kid-scene)"></g></g>`;
  layer.appendChild(outer);
  const ink = outer.querySelector(".ink");
  if (st.crayon) { const h = crayonMount(ink, st.crayon(), 500 + day); crayonFrame(h, crayonEnd(h)); }
  else { ink.removeAttribute("filter"); ink.innerHTML = st.svg(); }
  return outer;
}

// Live crayon: the kids-video look (core.js, kit.js and runtime.js, copied unchanged from kids-videos/ks1-history/lib)
// played in real time in the page rather than rendered frame by frame into a video.
//
//   crayonDefs(id, boil)        -> the <filter> markup for one <svg>; id must be unique in the page
//   crayonMount(g, html, seed)  -> draws a scene (a string from P/G/TX...) into <g g>, adds the scribble fills, returns a handle
//   crayonFrame(h, t)           -> shows the scene at t seconds (draw-on, pop, letters, loops), using runtime.js's upd()
//   crayonEnd(h)                -> the time by which everything has finished drawing

function crayonDefs(id, boil = true) {
  return `<filter id="${id}" x="-3%" y="-3%" width="106%" height="106%" color-interpolation-filters="sRGB">
      <feTurbulence ${boil ? `class="wob"` : ""} type="fractalNoise" baseFrequency="0.011" numOctaves="2" seed="1" result="n"/>
      <feDisplacementMap in="SourceGraphic" in2="n" scale="11" xChannelSelector="R" yChannelSelector="G" result="d"/>
      <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="1" seed="7" result="g"/>
      <feColorMatrix in="g" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -2.3 0 0 0 1.9" result="ga"/>
      <feComposite in="d" in2="ga" operator="in"/>
    </filter>`;
}

let crayonClipN = 0;
function crayonMount(g, html, seed = 1) {
  rng = mulberry32(seed);
  g.innerHTML = html;
  const svg = g.ownerSVGElement;
  let defs = svg.querySelector("defs.clips");
  if (!defs) { defs = document.createElementNS(NS, "defs"); defs.setAttribute("class", "clips"); svg.prepend(defs); }
  // scribble fills: a zig-zag crayon stroke clipped to each shape that asked for colour (as runtime.js build() does)
  g.querySelectorAll("path[data-fill]").forEach(p => {
    const bb = p.getBBox(), id = "cc" + (crayonClipN++);
    const cp = document.createElementNS(NS, "clipPath"); cp.id = id;
    const q = p.cloneNode(); q.removeAttribute("class"); cp.appendChild(q); defs.appendChild(cp);
    const pts = [];
    for (let y = bb.y - 12, k = 0; y <= bb.y + bb.height + 14; y += 13, k++) pts.push([(k % 2 ? bb.x + bb.width + 14 : bb.x - 14) + J(4), y + J(3)]);
    if (pts.length < 2) pts.push([bb.x + bb.width + 14, bb.y + bb.height]);
    const sc = document.createElementNS(NS, "path");
    sc.setAttribute("d", "M" + pts.map(f).join(" L"));
    sc.setAttribute("fill", "none"); sc.setAttribute("stroke", p.dataset.fill);
    sc.setAttribute("stroke-width", "21"); sc.setAttribute("stroke-linejoin", "round"); sc.setAttribute("stroke-linecap", "round");
    sc.setAttribute("pathLength", "1"); sc.setAttribute("clip-path", `url(#${id})`);
    sc.style.strokeDasharray = "1 1";
    sc._fd = clamp(Math.sqrt(bb.width * bb.height) / 650, 0.25, 1.1);
    p.parentNode.insertBefore(sc, p);
    p._scrib = sc;
  });
  const items = [...g.querySelectorAll("g.it")].map((el, k) => ({
    el, a: el.dataset.a, t0: +el.dataset.t, dur: +el.dataset.dur, ox: +el.dataset.ox, oy: +el.dataset.oy,
    out: el.dataset.out === "" ? null : +el.dataset.out, ph: k * 1.7,
    loops: el.dataset.loop.split(" ").filter(Boolean).map(s => s.split(":")),
    paths: [...el.querySelectorAll("path.o")], tsp: [...el.querySelectorAll("tspan")],
  }));
  items.forEach(it => it.paths.forEach(p => { p.style.strokeDasharray = "1 1"; }));
  // plain strokes outside any G() item are shown straight away
  g.querySelectorAll("path.o").forEach(p => { if (!p.closest("g.it")) { p.style.strokeDasharray = "none"; if (p._scrib) p._scrib.style.strokeDasharray = "none"; } });
  return { g, items };
}

function crayonFrame(h, t) {
  for (const it of h.items) upd(it, t);
  const wob = h.g.ownerSVGElement.querySelector(".wob");
  if (wob) wob.setAttribute("seed", String(1 + (Math.floor(t * 6) % 23)));   // line boil, 6 times a second
}

function crayonEnd(h) {
  return h.items.reduce((m, it) => Math.max(m, it.t0 + it.dur + 1.2), 0);
}

window.crayonDefs = crayonDefs; window.crayonMount = crayonMount; window.crayonFrame = crayonFrame; window.crayonEnd = crayonEnd;

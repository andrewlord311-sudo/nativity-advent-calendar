// The calendar page: the opening tap, the big scene with its doors, and opening a window.
//   #for=Name+Name   names to greet (the family link; the part after # never leaves the phone)
//   ?day=N           pretend it's N December (0 = before advent, 25 = Christmas Day); local copy, or add &elf
//   ?test            every window open
//   ?reset           forget this phone's progress      ?mute   no sound

import { status, previewDay, previewDate } from "./dates.js";
import * as progress from "./progress.js";
import { unlock, sfx } from "./sound.js";
import { drawScene, bakeScene, drawDoors, setStar, placeSticker, DOORS, W, H } from "./scene.js";   // H is the visible height
import { playWindow, playerMarkup } from "./player.js";
import { WINDOWS, TITLES } from "./windows/index.js";

const $ = id => document.getElementById(id);
const q = new URLSearchParams(location.search);

const names = (new URLSearchParams(location.hash.slice(1)).get("for") || "")
  .split(/[\s,&]+/).map(s => s.trim()).filter(Boolean).slice(0, 4)
  .map(s => s.slice(0, 20)).join(" and ").replace(/ and (?=.* and )/g, ", ");

const preview = previewDay(location);
const now = () => (preview === null ? new Date() : previewDate(preview, status().season));
let st = status(now());
if (q.has("reset")) progress.reset(st.season);
let prog = progress.load(st.season);
const modules = {};

async function windowModule(n) {
  if (!WINDOWS[n]) return null;
  return (modules[n] ||= (await WINDOWS[n]()).default);
}

function doorState(n) {
  if (prog.done.includes(n)) return "done";
  if (!st.isOpen(n)) return "locked";
  const today = n === st.opened;
  return today ? "today" : "ready";
}

function headline() {
  if (st.opened === 0) { const n = st.sleepsUntil(1); return n === 1 ? "Advent starts tomorrow!" : `Advent starts in ${n} sleeps`; }
  const waiting = [...Array(st.opened).keys()].map(i => i + 1).filter(n => !prog.done.includes(n));
  if (waiting.includes(st.opened)) return `Window ${st.opened} is ready!`;
  if (waiting.length) return `Window ${waiting[0]} is still waiting`;
  return st.opened >= 25 ? "Happy Christmas!" : `Window ${st.opened} done ✓ See you tomorrow!`;
}

// what to say about the next window once window n is finished
function whatsNext(n) {
  if (n === 25) return "Happy Christmas! 🎄";
  const m = n + 1;
  if (st.isOpen(m) && !prog.done.includes(m)) return `Window ${m} is ready too!`;
  if (st.isOpen(m)) return "";
  const s = st.sleepsUntil(m);
  return `Come back ${s === 1 ? "tomorrow" : `in ${s} sleeps`} for window ${m}: ${TITLES[m]}.`;
}

function finishCard(n, win) {
  const card = $("finish");
  card.querySelector(".fTitle").textContent = `Window ${n} finished!`;
  card.querySelector(".fSticker").textContent = win.sticker ? `${win.sticker.name} is in the picture.` : "";
  card.querySelector(".fNext").textContent = whatsNext(n);
  card.hidden = false;
  sfx.fanfare();
  return new Promise(resolve => { card.querySelector("button").onclick = () => { sfx.tap(); card.hidden = true; resolve(); }; });
}

const pause = ms => new Promise(r => setTimeout(r, ms));

function refresh() {
  const svg = $("scene");
  drawDoors(svg, doorState);
  setStar(svg, prog.done.filter(n => n <= 25).length);
  $("status").textContent = headline();
  $("finaleBtn").hidden = !prog.done.includes(25);
  const found = (prog.elf || []).length, total = Math.max(st.opened, 1);
  $("elfChip").textContent = `🧝 ${found}/${Math.min(total, 26)}`;
}

// the finale: after window 25 (and from the Finale button): Melody and Barnaby in their hats, a blazing star and snow
function showFinale() {
  $("fMel").innerHTML = withHat(MASCOTS.melody({ pose: "cheer" }));
  $("fBar").innerHTML = withHat(MASCOTS.barnaby({ pose: "wave" }));
  $("fSnow").innerHTML = $("snow").innerHTML;
  $("fNames").textContent = names ? `to ${names}` : "";
  const f = $("finale"); f.hidden = false;
  const ef = (prog.elf || []).length; $("fElf").textContent = ef ? `🧝 You found the elf in ${ef} window${ef === 1 ? "" : "s"}!` : "🧝 The elf is still hiding. Can you find him in the windows?";
  sfx.fanfare();
  return new Promise(resolve => { $("finaleClose").onclick = () => { sfx.tap(); f.hidden = true; resolve(); }; });
}

function sizeScene() {
  const wrap = $("sceneWrap"), svg = $("scene");
  svg.style.width = `${(wrap.clientHeight * W) / H}px`;
}

function scrollToDoor(n, smooth = true) {
  const wrap = $("sceneWrap"), [x] = DOORS[n], k = wrap.clientHeight / H;
  wrap.scrollTo({ left: Math.max(0, x * k - wrap.clientWidth / 2), behavior: smooth ? "smooth" : "auto" });
}

let toastTimer;
function toast(text) {
  const t = $("toast");
  t.textContent = text; t.classList.add("show");
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove("show"), 2600);
}

function shake(el) { el.classList.remove("shake"); void el.getBBox(); el.classList.add("shake"); }

async function openDoor(n, el) {
  const state = doorState(n);
  if (state === "locked") {
    sfx.locked(); shake(el);
    const s = st.sleepsUntil(n);
    toast(s === 1 ? `Not yet! Window ${n} opens tomorrow.` : `Not yet! ${s} more sleeps until window ${n}.`);
    return;
  }
  const win = await windowModule(n);
  if (!win) { sfx.locked(); shake(el); toast(`Window ${n}, "${TITLES[n]}", is still being painted…`); return; }
  sfx.tap();
  const result = await playWindow(win, {
    names, elfFound: (prog.elf || []).includes(n),
    onDone: kind => { progress.mark(st.season, prog, n, kind === "star" ? "star" : kind === "elf" ? "elf" : kind === "surprise" ? "surprise" : "done"); },
  });
  refresh();
  if (result === "collected") {
    // the sticker flies into the scene where its door is, then a clear "finished" card
    scrollToDoor(n);
    await pause(700);
    if (win.sticker) placeSticker($("scene"), n, win.sticker, true);
    sfx.sparkle();
    await pause(1300);
    await finishCard(n, win);
    if (n === 25) await showFinale();
  } else if (prog.done.includes(n) && win.sticker && !$("scene").querySelector(`#stickers [data-day="${n}"]`)) {
    placeSticker($("scene"), n, win.sticker);   // finished but closed before collecting: it still goes in, quietly
  }
}

// a Santa hat to sit on Melody's or Barnaby's head (their drawings are 100 units wide, head top near y = 12)
const HAT = `<g transform="translate(50 6) rotate(-8)"><path d="M-27,12 C-22,-12 6,-30 30,-26 L27,-16 C16,-16 12,-6 27,12 Z" fill="#e8392c" stroke="#2b2250" stroke-width="2.3" stroke-linejoin="round"/>
  <rect x="-31" y="6" width="62" height="13" rx="6.5" fill="#fff" stroke="#2b2250" stroke-width="2.3"/><circle cx="31" cy="-25" r="7" fill="#fff" stroke="#2b2250" stroke-width="2.3"/></g>`;
const withHat = svg => svg.replace(/<\/svg>$/, HAT + "</svg>");

function dressIntro() {
  $("palMelody").innerHTML = withHat(MASCOTS.melody({ pose: "cheer" }));
  $("palBarnaby").innerHTML = withHat(MASCOTS.barnaby({ pose: "wave" }));
  const flakes = [...Array(44)].map(() => {
    const size = 3 + Math.random() * 6;
    return `<i style="left:${(Math.random() * 100).toFixed(1)}%;width:${size.toFixed(1)}px;height:${size.toFixed(1)}px;animation-duration:${(7 + Math.random() * 9).toFixed(1)}s,${(2.5 + Math.random() * 3).toFixed(1)}s;animation-delay:-${(Math.random() * 14).toFixed(1)}s,0s;opacity:${(0.5 + Math.random() * 0.5).toFixed(2)}"></i>`;
  });
  $("snow").innerHTML = flakes.join("");
  const ready = st.opened > 0 && !prog.done.includes(st.opened);
  $("introToday").textContent = st.opened === 0
    ? (st.sleepsUntil(1) === 1 ? "Window 1 opens tomorrow!" : `${st.sleepsUntil(1)} sleeps until window 1!`)
    : ready ? `Window ${st.opened} is ready to open!` : headline();
}

async function start() {
  $("player").innerHTML = playerMarkup();
  dressIntro();
  if (names) $("forWho").textContent = `for ${names}`;
  document.title = names ? `Advent calendar for ${names}` : "The nativity advent calendar";
  const svg = $("scene");
  sizeScene();
  drawScene(svg);
  bakeScene(svg);
  refresh();
  for (const n of prog.done) { const win = await windowModule(n); if (win?.sticker) placeSticker(svg, n, win.sticker); }
  $("doors").addEventListener("click", e => {
    const d = e.target.closest(".door");
    if (d) openDoor(+d.dataset.n, d);
  });
  $("finaleBtn").addEventListener("click", showFinale);
  $("elfChip").addEventListener("click", () => {
    const days = [...(prog.elf || [])].sort((a, b) => a - b);
    toast(days.length ? `You found the elf in window${days.length === 1 ? "" : "s"} ${days.join(", ")}. He hides in every window!` : "The elf hides in every window. Tap him when you spot him!");
  });

  addEventListener("resize", sizeScene);
  // roll the clock over without a reload (e.g. left open overnight): check once a minute
  setInterval(() => { const s = status(now()); if (s.opened !== st.opened) { st = s; refresh(); } }, 60000);
  if (preview !== null) $("previewNote").textContent = q.has("test") ? "test mode: every window is open" : `preview: day ${preview}`;

  $("open").addEventListener("click", () => {
    unlock(); sfx.chime();
    document.body.classList.add("opened");   // until now the scene is hidden: nothing paints under the intro
    $("intro").classList.add("gone"); setTimeout(() => { $("intro").style.display = "none"; }, 900);   // fully off: its snow was animating (and repainting) behind everything
    scrollToDoor(st.opened > 0 ? st.opened : 1, false);
  });
}

start();

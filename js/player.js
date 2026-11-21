// Plays one window: its story and activity steps (pitched at a 4-year-old), the sticker, then (optionally) the ★ star
// challenge for an older child.
// A window module (js/windows/dayNN.js) is plain data plus scene-drawing functions; the activities are the shared
// engines in js/engines/. Closing (✕) at any point just returns to the calendar.

import { say, sfx } from "./sound.js";
import { trace } from "./engines/trace.js";
import { seek } from "./engines/seek.js";
import { rub } from "./engines/rub.js";
import { order } from "./engines/order.js";
import { nails } from "./engines/nails.js";
import { pick } from "./engines/pick.js";
import { drag } from "./engines/drag.js";
import { names } from "./engines/names.js";
import { echo } from "./engines/echo.js";
import { dots } from "./engines/dots.js";
import { doors } from "./engines/doors.js";
import { torch } from "./engines/torch.js";
import { wrap } from "./engines/wrap.js";
import { simon } from "./engines/simon.js";
import { diff } from "./engines/diff.js";
import { slide } from "./engines/slide.js";
import SURPRISES from "./surprises/index.js";

const ENGINES = { trace, seek, rub, order, nails, pick, drag, names, echo, dots, doors, torch, wrap, simon, diff, slide };
const $ = id => document.getElementById(id);
const VIEW = [420, 0, 1080, 1080];   // a square cut from the middle of the kids-video 1920 x 1080 frame

let handle = null, t0 = 0, rafOn = false, closeResolve = null;

const SPEED = 1.7, BOIL_MS = 170;   // scenes draw in 1.7x faster than in the videos; once drawn, only the line wobble keeps running (6 a second)
let lastBoil = 0;
function loop(now) {
  if (handle) {
    const t = (now - t0) / 1000 * SPEED;
    if (t < (handle.end ??= crayonEnd(handle)) + 0.3) crayonFrame(handle, t);
    else if (now - lastBoil > BOIL_MS) { lastBoil = now; crayonFrame(handle, t); }
  }
  if (rafOn) requestAnimationFrame(loop);
}

class Closed extends Error {}
const closed = () => new Promise((_, reject) => { closeResolve = () => reject(new Closed()); });
let closing;   // one promise per playthrough, raced against every wait

const until = p => Promise.race([p, closing]);

export function showScene(html, seed = 1) {
  $("pTop").innerHTML = "";
  handle = crayonMount($("pCrayon"), html, seed);
  t0 = performance.now();
  return handle;
}

export function caption(text, { big = false } = {}) {
  const el = $("pCaption");
  el.classList.toggle("big", big);
  el.textContent = "";
  return new Promise(resolve => {
    let i = 0;
    const tick = () => {
      if (el.dataset.token !== token) return;
      i += 1; el.textContent = text.slice(0, i);
      if (i < text.length) setTimeout(tick, 9); else resolve();
    };
    const token = String(Math.random()); el.dataset.token = token;
    el.onclick = () => { i = text.length - 1; };   // tap the words to show them all at once
    tick();
  });
}

export function buttons(list) {
  const box = $("pActions");
  box.innerHTML = "";
  return until(new Promise(resolve => {
    for (const [label, value, cls = ""] of list) {
      const b = document.createElement("button");
      b.className = "btn " + cls; b.textContent = label;
      b.onclick = () => { sfx.tap(); box.innerHTML = ""; resolve(value); };
      box.appendChild(b);
    }
  }));
}
export const next = (label = "Next ▶") => buttons([[label, true, "go"]]);

const svgPoint = (svg, e) => { const p = svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY; return p.matrixTransform($("pCrayon").getScreenCTM().inverse()); };
const wait = ms => until(new Promise(r => setTimeout(r, ms)));

// what the engines get to work with
const api = {
  svg: () => $("pStage"), top: () => $("pTop"), draw: () => $("pDraw"), tray: () => $("pTray"),
  showScene, caption, buttons, next, say, sfx, wait, until, svgPoint: e => svgPoint($("pStage"), e),
};

async function story(step) {
  showScene(step.scene(), step.seed || 1);
  if (step.top) $("pTop").innerHTML = step.top();   // stickers (Melody, Barnaby…) standing in the scene
  for (const c of step.captions) { await until(caption(c)); await next(); }
}

async function activity(step) {
  await ENGINES[step.type](step, api);
  await until(next("Next ▶"));   // the activity's last words stay up until the child is ready
}

// The elf on the shelf: each scene can hide a bit of him ({ at: [x, y], kind: "leg" | "hat" | "ear" }). Tapping him sparkles and is kept.
let onElf = () => {};
function showElf(e) {
  const layer = $("pElf");
  layer.innerHTML = e ? `<g class="elfHit" style="cursor:pointer"><g class="elfArt"></g><circle cx="${e.at[0]}" cy="${e.at[1] + 20}" r="70" fill="#fff" opacity="0"/></g>` : "";
  const hit = layer.querySelector(".elfHit");
  if (hit) { const h = crayonMount(hit.querySelector(".elfArt"), elfPeek(e.at[0], e.at[1], e.kind, e.s || 1), 77); crayonFrame(h, crayonEnd(h)); }
  if (hit) hit.addEventListener("pointerdown", ev => {
    ev.stopPropagation(); sfx.sparkle(); onElf();
    hit.classList.add("elfFound");
    layer.insertAdjacentHTML("beforeend", `<text class="elfSay" x="${e.at[0]}" y="${e.at[1] - 40}" font-size="64" text-anchor="middle" fill="#d8302a" stroke="#fff" stroke-width="8" paint-order="stroke">Ho ho ho!</text>`);
  }, { once: true });
}

async function run(steps) {
  for (const step of steps) {
    $("pTray").innerHTML = ""; $("pDraw").innerHTML = "";
    showElf(step.elf);
    if (step.type === "story") await story(step);
    else await activity(step);
  }
}

function stickerScene(win) {
  showElf(null);
  $("pCrayon").innerHTML = ""; $("pDraw").innerHTML = "";
  handle = null;
  const st = win.sticker, top = $("pTop");
  top.innerHTML = `<rect x="420" y="0" width="1080" height="1080" fill="#1d2a63"/>
    <g class="pop"><g transform="translate(960 ${st.showAt || 900}) scale(${st.showScale || 1.25})"><g filter="url(#pSticker)"><g class="ink" filter="url(#kid-still)"></g></g></g></g>`;
  const ink = top.querySelector(".ink");
  if (st.crayon) { const h = crayonMount(ink, st.crayon(), 700 + win.day); crayonFrame(h, crayonEnd(h)); }
  else { ink.removeAttribute("filter"); ink.innerHTML = st.svg(); }
  // sit the sticker in the middle of the square, whatever its drawing's origin: measure it, fit it, centre it
  try {
    const b = ink.getBBox();
    if (b.width > 0 && b.height > 0) {
      const m = Math.max(b.width, b.height), sc = Math.min(700 / m, Math.max(st.showScale || 1.25, 460 / m));   // small things are enlarged a little
      top.querySelector(".pop > g").setAttribute("transform", `translate(${960 - (b.x + b.width / 2) * sc} ${540 - (b.y + b.height / 2) * sc}) scale(${sc})`);
    }
  } catch { /* keep the hand-set position */ }
}

// The order: the window's steps → "well done" (and the ★ star challenge, if wanted) → collect the sticker → back to the
// calendar, where the sticker flies into the scene. Resolves with "collected" (the sticker was collected), "done"
// (finished but closed before collecting) or "closed".
export async function playWindow(win, { names, onDone, elfFound }) {
  const p = $("player");
  const hint = $("pElfHint");
  hint.textContent = elfFound ? "🧝 ✓ elf found!" : "🧝 Find the elf!"; hint.classList.toggle("found", !!elfFound);
  onElf = () => { hint.textContent = "🧝 ✓ elf found!"; hint.classList.add("found"); onDone("elf"); };
  p.hidden = false; document.body.classList.add("playing");
  $("pTitle").textContent = `${win.day} · ${win.title}`;
  $("pCaption").textContent = ""; $("pActions").innerHTML = ""; $("pTray").innerHTML = "";
  closing = closed();
  closing.catch(() => {});
  rafOn = true; requestAnimationFrame(loop);
  $("pClose").onclick = () => { sfx.tap(); closeResolve && closeResolve(); };
  let result = "closed";
  const poss = /s$/.test(win.sticker.name) ? win.sticker.name + "'" : win.sticker.name + "'s";
  const collect = `Collect ${poss} sticker ▶`;
  try {
    await run(win.steps);
    onDone("done");
    result = "done";
    if (win.star) {
      sfx.sparkle();
      await until(caption(`Well done${names ? `, ${names}` : ""}!`, { big: true }));
      if ((await buttons([["★ Try the star challenge", "star", "star"], [collect, "go", "go"]])) === "star") {
        await run(win.star.steps);
        onDone("star");
        await next(collect);
      }
    } else {
      await next(collect);
    }
    stickerScene(win);
    sfx.fanfare();
    await until(caption(win.sticker.found, { big: true }));
    const surprise = names ? (win.surprise || SURPRISES[win.day]) : null;   // the family link only: the public copy has none
    if (surprise) {
      await next("🎁 Wait… what's that?");
      showElf(null); $("pTop").innerHTML = ""; $("pTray").innerHTML = ""; $("pDraw").innerHTML = "";
      await surprise({ ...api, mark: () => onDone("surprise") });
      $("pTop").innerHTML = ""; $("pDraw").innerHTML = "";
      stickerScene(win);
    }
    await next(`Put ${win.sticker.name} in the picture ▶`);
    result = "collected";
  } catch (e) {
    if (!(e instanceof Closed)) throw e;
  } finally {
    rafOn = false; handle = null; showElf(null);
    $("pCrayon").innerHTML = ""; $("pTop").innerHTML = ""; $("pDraw").innerHTML = "";
    p.hidden = true; document.body.classList.remove("playing");
  }
  return result;
}

export function playerMarkup() {
  return `<header class="pbar"><button id="pClose" class="close" aria-label="Back to the calendar">✕</button><h2 id="pTitle"></h2><span id="pElfHint" class="elfHint"></span></header>
    <div class="stagebox"><svg id="pStage" viewBox="${VIEW.join(" ")}" preserveAspectRatio="xMidYMid meet">
      <defs>${crayonDefs("kid-play", true)}${crayonDefs("kid-still", false)}
        <filter id="pSticker" x="-20%" y="-20%" width="140%" height="140%">
          <feMorphology in="SourceAlpha" operator="dilate" radius="10" result="fat"/>
          <feFlood flood-color="#ffffff"/><feComposite in2="fat" operator="in" result="edge"/>
          <feGaussianBlur in="fat" stdDeviation="7" result="blur"/><feOffset in="blur" dx="5" dy="10" result="drop"/>
          <feFlood flood-color="#000" flood-opacity="0.45"/><feComposite in2="drop" operator="in" result="shadow"/>
          <feMerge><feMergeNode in="shadow"/><feMergeNode in="edge"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter></defs>
      <rect x="420" y="0" width="1080" height="1080" fill="#fffdf6"/>
      <g id="pCrayon" filter="url(#kid-play)"></g>
      <g id="pDraw" filter="url(#kid-play)"></g>
      <g id="pTop"></g>
      <g id="pElf" filter="url(#kid-still)"></g>
    </svg></div>
    <div class="below"><p id="pCaption" class="caption"></p>
    <div id="pTray" class="tray"></div>
    <div id="pActions" class="actions"></div></div>`;
}

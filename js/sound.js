// Sound: Melody and Barnaby's recorded clips (reused from the Nuggets videos) and little effects made in the page.
// Phones only allow sound after a tap, so unlock() runs on the opening tap (the method that worked for the cards).
// ?mute keeps everything silent (for testing on the Mac).

const CLIPS = {
  yourTurn: "audio/clips/your-turn.mp3",   // Melody: "Now it's your turn!"
  letsTry: "audio/clips/lets-try.mp3",     // Melody: "Let's try!"
  brilliant: "audio/clips/brilliant.mp3",  // Barnaby: "Brilliant!"
  gotIt: "audio/clips/got-it.mp3",         // Barnaby: "You've got it!"
};

const muted = new URLSearchParams(location.search).has("mute");
let ctx = null;
const buffers = {};

export function unlock() {
  if (muted || ctx) return;
  try {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    const b = ctx.createBuffer(1, 1, 22050), s = ctx.createBufferSource();
    s.buffer = b; s.connect(ctx.destination); s.start(0);
    for (const [name, url] of Object.entries(CLIPS)) {
      fetch(url).then(r => r.arrayBuffer()).then(a => ctx.decodeAudioData(a)).then(buf => { buffers[name] = buf; }).catch(() => {});
    }
  } catch { ctx = null; }
}

export function say(name) {
  if (!ctx || !buffers[name]) return;
  if (ctx.state === "suspended") ctx.resume();
  const s = ctx.createBufferSource();
  s.buffer = buffers[name]; s.connect(ctx.destination); s.start();
}

// a soft bell-ish note: freq in Hz, at seconds from now
function tone(freq, at = 0, len = 0.6, type = "sine", vol = 0.18) {
  if (!ctx) return;
  const t = ctx.currentTime + at, o = ctx.createOscillator(), g = ctx.createGain();
  o.type = type; o.frequency.value = freq;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.015);
  g.gain.exponentialRampToValueAtTime(0.0001, t + len);
  o.connect(g); g.connect(ctx.destination); o.start(t); o.stop(t + len + 0.05);
}

export const sfx = {
  tap: () => tone(880, 0, 0.12, "triangle", 0.12),
  chime: () => { tone(1046.5, 0, 0.7); tone(1568, 0.08, 0.7, "sine", 0.1); },
  sparkle: () => [1318.5, 1568, 2093, 2637].forEach((f, i) => tone(f, i * 0.07, 0.5, "sine", 0.09)),
  // a locked door: two low knocks
  locked: () => { tone(160, 0, 0.12, "square", 0.08); tone(150, 0.16, 0.12, "square", 0.08); },
  wrong: () => { tone(330, 0, 0.15, "triangle", 0.1); tone(262, 0.12, 0.2, "triangle", 0.1); },
  // C major arpeggio up to the top C, for a finished window
  fanfare: () => [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, i * 0.12, 0.9, "triangle", 0.12)),
  moo: () => { tone(130, 0, 0.7, "sawtooth", 0.09); tone(98, 0.25, 0.6, "sawtooth", 0.09); },
  baa: () => { [300, 340, 300, 330].forEach((f, i) => tone(f, i * 0.09, 0.14, "sawtooth", 0.07)); },
  hee: () => { [500, 380, 520, 360].forEach((f, i) => tone(f, i * 0.14, 0.18, "sawtooth", 0.07)); },
  meow: () => { tone(620, 0, 0.12, "triangle", 0.1); tone(760, 0.1, 0.25, "triangle", 0.1); },
  hoot: () => { tone(330, 0, 0.35, "sine", 0.12); tone(262, 0.45, 0.6, "sine", 0.12); },
  roar: () => { if (!ctx) return; [110, 82, 65].forEach((f, i) => tone(f, i * 0.12, 0.5, "sawtooth", 0.12)); },
  vroom: () => { if (!ctx) return; [90, 120, 170, 230].forEach((f, i) => tone(f, i * 0.1, 0.25, "sawtooth", 0.08)); },
  crayon: () => {   // a short scratchy noise burst while tracing
    if (!ctx) return;
    const len = 0.06, b = ctx.createBuffer(1, ctx.sampleRate * len, ctx.sampleRate), d = b.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
    const s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    f.type = "bandpass"; f.frequency.value = 2400; g.gain.value = 0.05;
    s.buffer = b; s.connect(f); f.connect(g); g.connect(ctx.destination); s.start();
  },
};


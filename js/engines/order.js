// Put the words in order (window 2 star). Word buttons in the tray, shuffled; tap them in the right order and the sentence
// builds up in the caption. step: { scene, words: [...], prompt, doneCaption }

function shuffled(words, seed) {   // never comes out in the right order
  const a = words.map((w, i) => [w, i]);
  let s = seed * 9301 + 49297;
  for (let i = a.length - 1; i > 0; i--) { s = (s * 9301 + 49297) % 233280; const j = s % (i + 1); [a[i], a[j]] = [a[j], a[i]]; }
  if (a.every(([, i], k) => i === k)) a.push(a.shift());
  return a;
}

export async function order(step, api) {
  api.showScene(step.scene(), step.seed || 1);
  const tray = api.tray();
  api.caption(step.prompt); api.say("letsTry");
  const target = step.words; let n = 0;
  tray.innerHTML = shuffled(target, step.seed || 3).map(([w, i]) => `<button class="word btn" data-i="${i}">${w}</button>`).join("");
  await api.until(new Promise(resolve => {
    tray.onclick = e => {
      const b = e.target.closest(".word"); if (!b || b.disabled) return;
      if (+b.dataset.i === n) {
        b.disabled = true; b.classList.add("used"); api.sfx.chime(); n++;
        api.caption(target.slice(0, n).join(" "), { big: true });
        if (n === target.length) resolve();
      } else { api.sfx.wrong(); b.classList.remove("shake"); void b.offsetWidth; b.classList.add("shake"); }
    };
  }));
  tray.onclick = null;
  api.sfx.fanfare();
  await api.wait(900);
  tray.innerHTML = "";
  await api.caption(step.doneCaption || target.join(" "), { big: true });
  await api.wait(500);
}

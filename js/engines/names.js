// Choose a name (window 6: the donkey). Buttons in the tray; the choice is kept on this phone (advent-calendar:<key>) so later windows can use it.
export async function names(step, api) {
  api.showScene(step.scene(), step.seed || 1);
  const tray = api.tray();
  api.caption(step.prompt); api.say("letsTry");
  tray.innerHTML = step.names.map(n => `<button class="word btn" data-n="${n}">${n}</button>`).join("");
  const chosen = await api.until(new Promise(res => { tray.onclick = e => { const b = e.target.closest(".word"); if (b) { api.sfx.chime(); res(b.dataset.n); } }; }));
  tray.onclick = null; tray.innerHTML = "";
  try { localStorage.setItem(`advent-calendar:${step.key || "name"}`, chosen); } catch { /* not saved */ }
  api.sfx.fanfare();
  await api.caption(step.doneCaption(chosen), { big: true });
  await api.wait(700);
}

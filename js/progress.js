// What has been done, kept on this phone only. If it's ever lost nothing breaks: playing a window again earns its sticker again.
const key = season => `advent-calendar:${season}`;

export function load(season) {
  try { return { done: [], star: [], ...JSON.parse(localStorage.getItem(key(season)) || "{}") }; }
  catch { return { done: [], star: [] }; }
}

export function save(season, p) {
  try { localStorage.setItem(key(season), JSON.stringify(p)); } catch { /* private mode: progress lasts until the tab closes */ }
}

export function mark(season, p, day, field = "done") {
  p[field] = p[field] || [];
  if (!p[field].includes(day)) p[field].push(day);
  save(season, p);
}

export function reset(season) {
  try { localStorage.removeItem(key(season)); } catch { /* nothing saved */ }
}

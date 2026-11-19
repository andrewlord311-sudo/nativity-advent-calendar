// Which windows are open. All of it runs on the phone, so a determined grown-up can get round it; that's fine for children.
//
// "Today" is the date in the UK (Europe/London), whatever the phone's own time zone is set to, and a new day
// starts at 06:00 rather than midnight, so nobody opens tomorrow's window at 00:01.
// Windows 1-25 open on 1-25 December. Christmas Day (25) is the last window.
// Earlier windows stay open, and everything stays open until the summer, when the calendar resets for next year.

export const UNLOCK_HOUR = 6;
export const LAST_DAY = 25;

const ukFormat = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/London", year: "numeric", month: "numeric", day: "numeric", hour: "numeric", hourCycle: "h23",
});

export function ukParts(date) {
  const p = Object.fromEntries(ukFormat.formatToParts(date).map(x => [x.type, x.value]));
  return { y: +p.year, m: +p.month, d: +p.day, h: +p.hour };
}

// the UK calendar date, moved back a day before 06:00
export function adventDate(date) {
  const { y, m, d, h } = ukParts(date);
  const day = new Date(Date.UTC(y, m - 1, d - (h < UNLOCK_HOUR ? 1 : 0)));
  return { y: day.getUTCFullYear(), m: day.getUTCMonth() + 1, d: day.getUTCDate() };
}

const dayNumber = ({ y, m, d }) => Date.UTC(y, m - 1, d) / 86400000;

// season = the year whose December this is (July to June belongs to the same season)
export function status(date = new Date()) {
  const a = adventDate(date);
  const season = a.m >= 7 ? a.y : a.y - 1;
  const today = dayNumber(a);
  let opened;
  if (a.y === season && a.m < 12) opened = 0;
  else if (a.y === season) opened = Math.min(a.d, LAST_DAY);
  else opened = LAST_DAY;
  const opensOn = n => dayNumber({ y: season, m: 12, d: n });
  return {
    season, opened,
    isOpen: n => n <= opened,
    // "sleeps" until window n opens (0 when it is open)
    sleepsUntil: n => Math.max(0, opensOn(n) - today),
  };
}

// A pretend date for previewing: day 0 = the day before advent, 1-25 = that December day.
export function previewDate(day, season) {
  const at = (y, m, d) => new Date(Date.UTC(y, m - 1, d, 12));
  if (day <= 0) return at(season, 11, 30);
  if (day >= LAST_DAY) return at(season, 12, LAST_DAY);
  return at(season, 12, day);
}

// ?day=N is honoured on the Mac's own copy, or anywhere with the extra word "elf" (?day=17&elf).
export function previewDay(location) {
  const q = new URLSearchParams(location.search);
  if (!q.has("day") && !q.has("test")) return null;   // ?test opens every window (same as ?day=26)
  const local = ["localhost", "127.0.0.1", ""].includes(location.hostname) || location.hostname.endsWith(".local")
    || /^192\.168\./.test(location.hostname);
  if (!local && !q.has("elf")) return null;
  const n = q.has("test") ? LAST_DAY : parseInt(q.get("day"), 10);
  return Number.isFinite(n) ? Math.max(0, Math.min(LAST_DAY, n)) : null;
}

// Window 10 (Thu 10 Dec): no room! Activity: knock on five doors (funny answers, a cat pops out); the last is the kind innkeeper.
// ★ Star challenge: the doors are numbered: knock in order, 1 to 5.

const cat = (x, y, size) => ANIMAL_SET.animalSvg("cat", ANIMAL_SET.PART_ORDER).replace("<svg ", `<svg x="${x - size / 2}" y="${y - size}" width="${size}" height="${size}" `);
const night = () => P(poly([420, -20], [1500, -20], [1500, 1100], [420, 1100]), { s: N.night, f: N.night, w: 2 })
  + [[560, 120], [900, 200], [1240, 140], [1420, 300]].map(([x, y]) => starP(x, y, 24)).join("") + ground(870, 0.1, N.nightHill, N.nightHillEdge);
const XS = [520, 710, 900, 1090], INN = 1330;
const street = (keeper = true) => night()
  + XS.map((x, i) => G(flatHouse(x, 880, 170, 230, { lit: i !== 1, doorAt: 0 }), { t: 0.3 + i * 0.15, dur: 0.4 })).join("")
  + G(inn(INN, 880, 300, 340), { t: 0.9, dur: 0.6 }) + (keeper ? G(innkeeper(INN, 1040, { sc: 0.75 }), { t: 1.4, dur: 0.6 }) : "");
const DOORS = [[XS[0], 840], [XS[1], 840], [XS[2], 840], [XS[3], 840], [INN, 840]];
const SAY = ["“No room! The inn is full of visitors!”", "“No room! Shh, we are all asleep!”", "“Meow!”… A cat jumps out! “No room here either!”", "“No room! There are people on the roof already!”",
  "“I am sorry, there is no room in the inn… but you can stay in my stable!”"];
const doorList = nums => DOORS.map((at, i) => ({ at, r: 85, num: nums ? nums[i] : undefined, say: SAY[nums ? nums[i] - 1 : i], last: (nums ? nums[i] : i + 1) === 5, pop: (nums ? nums[i] : i + 1) === 3 ? () => cat(DOORS[i][0] + 40, 800, 190) : undefined }));
const arrive = () => night() + G(flatHouse(500, 880, 220, 260, { lit: true }), { t: 0.2, dur: 0.5 }) + G(mary(850, 1000, { sc: 0.8 }) + joseph(1080, 1010, { sc: 0.85 }) + donkey(1300, 1010, 0.55), { t: 0.6, dur: 1 });
const kind = () => street() ;

export default {
  day: 10,
  title: "No room!",
  sticker: { name: "the Innkeeper", found: "You found a sticker: the Innkeeper!", crayon: () => innkeeper(0, 0, { sc: 0.9 }), at: [1630, 960], scale: 0.45, showAt: 1000, showScale: 1.7 },
  steps: [
    { type: "story", scene: arrive, seed: 101, elf: { at: [1480, 360], kind: "hat" }, captions: [
      "Mary and Joseph were very tired. It was dark, and the town was full.",
      "Mary's baby was going to be born very soon. They needed somewhere to stay!",
    ] },
    { type: "doors", scene: street, seed: 102, keepLast: true, doors: doorList(), elf: { at: [440, 700], kind: "ear" }, prompt: "Knock on the doors to ask for a room! Tap each door.", doneCaption: "At last! The kind innkeeper offers them his stable." },
  ],
  star: { steps: [{ type: "doors", scene: () => street(false), seed: 103, keepLast: true, ordered: true, doors: doorList([3, 1, 5, 2, 4]), elf: { at: [440, 700], kind: "ear" },
    prompt: "★ The doors are numbered. Knock on them in order, from 1 to 5!", doneCaption: "In order, all the way to number 5!" }], after: () => street() },
};

// Which windows are built. A window that isn't built yet shows "still being painted" (only reachable in a preview).
export const WINDOWS = {
  1: () => import("./day01.js"),
  2: () => import("./day02.js"),
  3: () => import("./day03.js"),
  4: () => import("./day04.js"),
  5: () => import("./day05.js"),
  6: () => import("./day06.js"),
  7: () => import("./day07.js"),
  8: () => import("./day08.js"),
  9: () => import("./day09.js"),
  10: () => import("./day10.js"),
  11: () => import("./day11.js"),
  12: () => import("./day12.js"),
  13: () => import("./day13.js"),
  14: () => import("./day14.js"),
  15: () => import("./day15.js"),
  16: () => import("./day16.js"),
  17: () => import("./day17.js"),
  18: () => import("./day18.js"),
  19: () => import("./day19.js"),
  20: () => import("./day20.js"),
  21: () => import("./day21.js"),
  22: () => import("./day22.js"),
  23: () => import("./day23.js"),
  24: () => import("./day24.js"),
  25: () => import("./day25.js"),
};

export const TITLES = {
  1: "The magic door", 2: "The angel's message", 3: "Joseph the carpenter", 4: "The Emperor's order",
  5: "Packing for Bethlehem", 6: "Meet the donkey", 7: "The long road", 8: "A night under the stars",
  9: "Bethlehem at last!", 10: "No room!", 11: "The stable", 12: "A bed for the baby", 13: "Mend the roof",
  14: "The stable animals", 15: "The shepherds", 16: "The lost lamb", 17: "Find the star", 18: "Three gifts",
  19: "The camel caravan", 20: "Supper for the sheep", 21: "Lighting the lanterns", 22: "The stable at night",
  23: "Almost time", 24: "Christmas Eve", 25: "Christmas Day"
};

const { getLocalDay } = require("./localDay");

const timezone = "Asia/Kolkata";

const checkInA = new Date("2026-03-10T14:30:00Z");
const checkInB = new Date("2026-03-11T10:30:00Z");
const checkInC = new Date("2026-03-11T21:30:00Z");
const checkInD = new Date("2026-03-12T17:30:00Z");

console.log("A:", getLocalDay(checkInA, timezone));
console.log("B:", getLocalDay(checkInB, timezone));
console.log("C:", getLocalDay(checkInC, timezone));
console.log("D:", getLocalDay(checkInD, timezone));
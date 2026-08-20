const { DateTime } = require("luxon");

function getLocalDay(date, timezone) {
  const localDateTime = DateTime.fromJSDate(date, { zone: "utc" }).setZone(
    timezone
  );

  if (!localDateTime.isValid) {
    throw new Error(`Invalid timezone: ${timezone}`);
  }

  return localDateTime.toISODate();
}

function getTodayLocalDay(timezone) {
  const now = DateTime.now().setZone(timezone);

  if (!now.isValid) {
    throw new Error(`Invalid timezone: ${timezone}`);
  }

  return now.toISODate();
}

module.exports = {
  getLocalDay,
  getTodayLocalDay,
};
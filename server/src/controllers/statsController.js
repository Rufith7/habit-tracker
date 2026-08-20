const prisma = require("../lib/prisma");
const { DateTime } = require("luxon");

async function getHabitStats(req, res) {
  try {
    const { id: habitId } = req.params;
    const userId = req.user.userId;

    // Make sure the habit belongs to the authenticated user
    const habit = await prisma.habit.findFirst({
      where: {
        id: habitId,
        userId,
      },
      select: {
        id: true,
        user: {
          select: {
            timezone: true,
          },
        },
      },
    });

    if (!habit) {
      return res.status(404).json({
        message: "Habit not found",
      });
    }

    const timezone = habit.user.timezone;

    const today = DateTime.now()
      .setZone(timezone)
      .toISODate();

    const checkIns = await prisma.checkIn.findMany({
      where: {
        habitId,
      },
      orderBy: {
        localDay: "desc",
      },
      select: {
        id: true,
        localDay: true,
        occurredAt: true,
      },
    });

    const localDays = checkIns.map((checkIn) =>
      DateTime.fromJSDate(checkIn.localDay, {
        zone: "utc",
      }).toISODate()
    );

    const uniqueDays = [...new Set(localDays)];

    const completedToday = uniqueDays.includes(today);

    // Calculate current streak
    let currentStreak = 0;

    let streakDate = DateTime.fromISO(today, {
      zone: timezone,
    });

    while (uniqueDays.includes(streakDate.toISODate())) {
      currentStreak++;

      streakDate = streakDate.minus({
        days: 1,
      });
    }

    // Calculate longest streak
    let longestStreak = 0;
    let runningStreak = 0;

    const sortedDays = [...uniqueDays].sort();

    for (let i = 0; i < sortedDays.length; i++) {
      if (i === 0) {
        runningStreak = 1;
      } else {
        const previousDay = DateTime.fromISO(sortedDays[i - 1]);
        const currentDay = DateTime.fromISO(sortedDays[i]);

        const difference = currentDay.diff(
          previousDay,
          "days"
        ).days;

        if (difference === 1) {
          runningStreak++;
        } else {
          runningStreak = 1;
        }
      }

      longestStreak = Math.max(
        longestStreak,
        runningStreak
      );
    }

    res.json({
      stats: {
        currentStreak,
        longestStreak,
        totalCheckIns: checkIns.length,
        completedToday,
      },
    });
  } catch (error) {
    console.error("Get habit stats error:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
}

module.exports = {
  getHabitStats,
};
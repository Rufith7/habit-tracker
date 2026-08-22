const prisma = require("../lib/prisma");
const { DateTime } = require("luxon");

async function getHabitStats(req, res) {
  try {
    const { id: habitId } = req.params;
    const userId = req.user.userId;

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

    const now = DateTime.now().setZone(timezone);

    if (!now.isValid) {
      return res.status(500).json({
        message: "User timezone is invalid",
      });
    }

    const today = now.toISODate();

    const checkIns = await prisma.checkIn.findMany({
      where: {
        habitId,
      },
      orderBy: {
        localDay: "asc",
      },
      select: {
        id: true,
        localDay: true,
        occurredAt: true,
      },
    });

    const uniqueDays = [
      ...new Set(
        checkIns.map((checkIn) =>
          DateTime.fromJSDate(checkIn.localDay, {
            zone: "utc",
          }).toISODate()
        )
      ),
    ].sort();

    const completedToday = uniqueDays.includes(today);

    /*
     * Current streak:
     *
     * If today is completed:
     *   start from today.
     *
     * Otherwise:
     *   start from yesterday.
     *
     * This matches the assignment requirement:
     * "ending today, or yesterday if today isn't logged."
     */
    let currentStreak = 0;

    let streakDate = completedToday
      ? DateTime.fromISO(today, { zone: timezone })
      : DateTime.fromISO(today, { zone: timezone }).minus({
          days: 1,
        });

    while (uniqueDays.includes(streakDate.toISODate())) {
      currentStreak++;

      streakDate = streakDate.minus({
        days: 1,
      });
    }

    /*
     * Longest streak
     */
    let longestStreak = 0;
    let runningStreak = 0;

    for (let i = 0; i < uniqueDays.length; i++) {
      if (i === 0) {
        runningStreak = 1;
      } else {
        const previous = DateTime.fromISO(uniqueDays[i - 1], {
          zone: timezone,
        });

        const current = DateTime.fromISO(uniqueDays[i], {
          zone: timezone,
        });

        const difference = current
          .diff(previous, "days")
          .days;

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

    return res.json({
      stats: {
        currentStreak,
        longestStreak,
        totalCheckIns: checkIns.length,
        completedToday,
      },
    });
  } catch (error) {
    console.error("Get habit stats error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

module.exports = {
  getHabitStats,
};
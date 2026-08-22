const prisma = require("../lib/prisma");
const { DateTime } = require("luxon");
const { getTodayLocalDay } = require("../utils/localDay");

function parseLocalDay(localDayString) {
  if (!localDayString || !/^\d{4}-\d{2}-\d{2}$/.test(localDayString)) {
    return null;
  }

  const parsed = DateTime.fromISO(localDayString, {
    zone: "utc",
  });

  if (!parsed.isValid || parsed.toISODate() !== localDayString) {
    return null;
  }

  return parsed;
}

async function createCheckIn(req, res) {
  try {
    const { id: habitId } = req.params;
    const { localDay: requestedLocalDay } = req.body || {};
    const userId = req.user.userId;

    const habit = await prisma.habit.findFirst({
      where: {
        id: habitId,
        userId,
      },
      include: {
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

    /*
     * If localDay is not supplied, check in for today.
     * If supplied, this allows backfilling a past local day.
     */
    const localDayString =
      requestedLocalDay || getTodayLocalDay(timezone);

    const parsedLocalDay = parseLocalDay(localDayString);

    if (!parsedLocalDay) {
      return res.status(400).json({
        message: "localDay must be a valid date in YYYY-MM-DD format",
      });
    }

    const todayLocalDay = getTodayLocalDay(timezone);

    if (localDayString > todayLocalDay) {
      return res.status(400).json({
        message: "You cannot check in for a future date",
      });
    }

    /*
     * The habit's createdAt is an instant in time.
     * Convert it into the user's local calendar day before
     * comparing it with the requested local day.
     */
    const habitCreatedLocalDay = DateTime.fromJSDate(
      habit.createdAt,
      { zone: "utc" }
    )
      .setZone(timezone)
      .toISODate();

    if (localDayString < habitCreatedLocalDay) {
      return res.status(400).json({
        message:
          "You cannot check in for a date before the habit was created",
      });
    }

    /*
     * localDay is stored as a UTC date-only value.
     * It represents the user's calendar day, not an instant
     * in the user's timezone.
     */
    const localDay = new Date(
      `${localDayString}T00:00:00.000Z`
    );

    const existingCheckIn = await prisma.checkIn.findUnique({
      where: {
        habitId_localDay: {
          habitId,
          localDay,
        },
      },
    });

    if (existingCheckIn) {
      return res.status(409).json({
        message: `Habit is already checked in for ${localDayString}`,
        checkIn: existingCheckIn,
      });
    }

    const checkIn = await prisma.checkIn.create({
      data: {
        habitId,
        localDay,
      },
    });

    return res.status(201).json({
      message: "Habit checked in successfully",
      checkIn,
    });
  } catch (error) {
    console.error("Create check-in error:", error);

    /*
     * Protect against a race condition where two requests
     * attempt to create the same local-day check-in.
     */
    if (error.code === "P2002") {
      return res.status(409).json({
        message: "Habit is already checked in for this local day",
      });
    }

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

async function getCheckIns(req, res) {
  try {
    const { id: habitId } = req.params;
    const userId = req.user.userId;

    const habit = await prisma.habit.findFirst({
      where: {
        id: habitId,
        userId,
      },
    });

    if (!habit) {
      return res.status(404).json({
        message: "Habit not found",
      });
    }

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

    return res.json({
      checkIns,
    });
  } catch (error) {
    console.error("Get check-ins error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

async function deleteCheckIn(req, res) {
  try {
    const { id: habitId, localDay: localDayString } = req.params;
    const userId = req.user.userId;

    const habit = await prisma.habit.findFirst({
      where: {
        id: habitId,
        userId,
      },
    });

    if (!habit) {
      return res.status(404).json({
        message: "Habit not found",
      });
    }

    const parsedLocalDay = parseLocalDay(localDayString);

    if (!parsedLocalDay) {
      return res.status(400).json({
        message: "localDay must use YYYY-MM-DD format",
      });
    }

    const localDay = new Date(
      `${localDayString}T00:00:00.000Z`
    );

    const checkIn = await prisma.checkIn.findUnique({
      where: {
        habitId_localDay: {
          habitId,
          localDay,
        },
      },
    });

    if (!checkIn) {
      return res.status(404).json({
        message: "Check-in not found",
      });
    }

    await prisma.checkIn.delete({
      where: {
        id: checkIn.id,
      },
    });

    return res.json({
      message: "Check-in removed successfully",
    });
  } catch (error) {
    console.error("Delete check-in error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

module.exports = {
  createCheckIn,
  getCheckIns,
  deleteCheckIn,
};
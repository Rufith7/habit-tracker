const prisma = require("../lib/prisma");
const { getTodayLocalDay } = require("../utils/localDay");

async function createCheckIn(req, res) {
  try {
    const { id: habitId } = req.params;
    const userId = req.user.userId;

    // Make sure the habit belongs to the logged-in user
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

    // Calculate today's date using the user's timezone
    const localDayString = getTodayLocalDay(habit.user.timezone);

    // Convert YYYY-MM-DD to a UTC Date representing that calendar date.
    const localDay = new Date(`${localDayString}T00:00:00.000Z`);

    // Prevent duplicate check-ins for the same habit/day
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
        message: "Habit is already checked in for today",
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

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

async function getCheckIns(req, res) {
  try {
    const { id: habitId } = req.params;
    const userId = req.user.userId;

    // Verify ownership before returning check-in history
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

    // Verify habit ownership
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

    // Validate the YYYY-MM-DD format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(localDayString)) {
      return res.status(400).json({
        message: "localDay must use YYYY-MM-DD format",
      });
    }

    const localDay = new Date(`${localDayString}T00:00:00.000Z`);

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
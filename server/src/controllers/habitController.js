const prisma = require("../lib/prisma");

async function createHabit(req, res) {
  try {
    const { name, description } = req.body;
    const userId = req.user.userId;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Habit name is required",
      });
    }

    const habit = await prisma.habit.create({
      data: {
        userId,
        name: name.trim(),
        description: description?.trim() || null,
      },
    });

    return res.status(201).json({
      message: "Habit created successfully",
      habit,
    });
  } catch (error) {
    console.error("Create habit error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

async function getHabits(req, res) {
  try {
    const userId = req.user.userId;

    const habits = await prisma.habit.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.json({
      habits,
    });
  } catch (error) {
    console.error("Get habits error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

async function getHabitById(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const habit = await prisma.habit.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!habit) {
      return res.status(404).json({
        message: "Habit not found",
      });
    }

    return res.json({
      habit,
    });
  } catch (error) {
    console.error("Get habit error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

async function updateHabit(req, res) {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const userId = req.user.userId;

    if (name !== undefined && !name.trim()) {
      return res.status(400).json({
        message: "Habit name cannot be empty",
      });
    }

    const existingHabit = await prisma.habit.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existingHabit) {
      return res.status(404).json({
        message: "Habit not found",
      });
    }

    const habit = await prisma.habit.update({
      where: {
        id,
      },
      data: {
        ...(name !== undefined && {
          name: name.trim(),
        }),
        ...(description !== undefined && {
          description: description?.trim() || null,
        }),
      },
    });

    return res.json({
      message: "Habit updated successfully",
      habit,
    });
  } catch (error) {
    console.error("Update habit error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

async function deleteHabit(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const existingHabit = await prisma.habit.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existingHabit) {
      return res.status(404).json({
        message: "Habit not found",
      });
    }

    await prisma.habit.delete({
      where: {
        id,
      },
    });

    return res.json({
      message: "Habit deleted successfully",
    });
  } catch (error) {
    console.error("Delete habit error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

module.exports = {
  createHabit,
  getHabits,
  getHabitById,
  updateHabit,
  deleteHabit,
};
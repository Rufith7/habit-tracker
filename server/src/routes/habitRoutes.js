const express = require("express");
const { getHabitStats } = require("../controllers/statsController");
const authMiddleware = require("../middleware/auth");

const {
  createHabit,
  getHabits,
  getHabitById,
  updateHabit,
  deleteHabit,
} = require("../controllers/habitController");

const router = express.Router();

router.use(authMiddleware);

router.post("/", createHabit);
router.get("/:id/stats", getHabitStats);
router.get("/", getHabits);
router.get("/:id", getHabitById);
router.patch("/:id", updateHabit);
router.delete("/:id", deleteHabit);

module.exports = router;
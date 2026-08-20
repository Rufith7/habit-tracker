const express = require("express");

const authMiddleware = require("../middleware/auth");

const {
  createCheckIn,
  getCheckIns,
  deleteCheckIn,
} = require("../controllers/checkInController");

const router = express.Router();

router.use(authMiddleware);

router.post("/:id/check-ins", createCheckIn);
router.get("/:id/check-ins", getCheckIns);
router.delete("/:id/check-ins/:localDay", deleteCheckIn);

module.exports = router;
const express = require("express");
const { saveOrUpdateRoutine, getDailyRoutine } = require("../controllers/dailyRoutineController");
const router = express.Router();

router.post("/routine", saveOrUpdateRoutine);
router.get("/routine/:date", getDailyRoutine);

module.exports = router;

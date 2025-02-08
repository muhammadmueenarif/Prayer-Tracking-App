const express = require("express");
const { saveOrUpdatePrayer, getPrayersByDate } = require("../controllers/prayerController");
const router = express.Router();

router.post("/prayer", saveOrUpdatePrayer);
router.get("/prayer/:date", getPrayersByDate); 

module.exports = router;

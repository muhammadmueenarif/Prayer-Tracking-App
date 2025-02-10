const express = require("express");
const { uploadProfilePicture, getProfilePicture, saveOrUpdateBio, getUserBio, getUserInfo } = require("../controllers/profileController");
const router = express.Router();

router.post("/profile/picture", uploadProfilePicture);
router.get("/profile/picture", getProfilePicture);
router.post("/profile/bio", saveOrUpdateBio);
router.get("/profile/bio", getUserBio);
router.get("/profile/info", getUserInfo);

module.exports = router;
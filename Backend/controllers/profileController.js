const { db } = require("../config/firebase");
const jwt = require("jsonwebtoken");

// Upload or update profile picture
const uploadProfilePicture = async (req, res) => {
  const { pictureUrl } = req.body;
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized. Token required." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.uid;
    const userRef = db.collection("users").doc(userId);
    
    await userRef.update({ profilePicture: pictureUrl });
    return res.status(200).json({ message: "Profile picture updated successfully." });
  } catch (error) {
    console.error("Profile Picture Error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// Get profile picture
const getProfilePicture = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized. Token required." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.uid;
    const userDoc = await db.collection("users").doc(userId).get();
    if (!userDoc.exists) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json({ profilePicture: userDoc.data().profilePicture });
  } catch (error) {
    console.error("Get Profile Picture Error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// Save or update bio
const saveOrUpdateBio = async (req, res) => {
  const { bio } = req.body;
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized. Token required." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.uid;
    const userRef = db.collection("users").doc(userId);
    
    await userRef.update({ bio });
    return res.status(200).json({ message: "Bio updated successfully." });
  } catch (error) {
    console.error("Bio Error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// Get user bio
const getUserBio = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized. Token required." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.uid;
    const userDoc = await db.collection("users").doc(userId).get();
    if (!userDoc.exists) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json({ bio: userDoc.data().bio });
  } catch (error) {
    console.error("Get Bio Error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// Get user info (username, email, password)
const getUserInfo = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized. Token required." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.uid;
    const userDoc = await db.collection("users").doc(userId).get();
    if (!userDoc.exists) {
      return res.status(404).json({ message: "User not found." });
    }

    const { username, email, password } = userDoc.data();
    return res.status(200).json({ username, email, password });
  } catch (error) {
    console.error("Get User Info Error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = { uploadProfilePicture, getProfilePicture, saveOrUpdateBio, getUserBio, getUserInfo };
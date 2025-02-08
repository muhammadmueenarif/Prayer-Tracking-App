const { db } = require("../config/firebase");
const jwt = require("jsonwebtoken");

const saveOrUpdateRoutine = async (req, res) => {
  const { date, text } = req.body;
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized. Token required." });
  }

  try {
    // Verify user token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.uid;

    if (!date || !text) {
      return res.status(400).json({ message: "Date and text are required." });
    }

    const routineRef = db.collection("users").doc(userId).collection("dailyRoutines").doc(date);
    const routineDoc = await routineRef.get();

    if (routineDoc.exists) {
      // Update existing routine
      await routineRef.update({ text });
      return res.status(200).json({ message: "Routine updated successfully." });
    } else {
      // Save new routine
      await routineRef.set({ text, createdAt: new Date() });
      return res.status(201).json({ message: "Routine saved successfully." });
    }
  } catch (error) {
    console.error("Routine Error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};


// Get daily routine for a specific date
const getDailyRoutine = async (req, res) => {
  const { date } = req.params;
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized. Token required." });
  }

  try {
    // Verify user token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.uid;

    const routineRef = db.collection("users").doc(userId).collection("dailyRoutines").doc(date);
    const routineDoc = await routineRef.get();

    if (!routineDoc.exists) {
      return res.status(404).json({ message: "No routine found for this date." });
    }

    return res.status(200).json({ message: "Routine retrieved successfully.", data: routineDoc.data() });
  } catch (error) {
    console.error("Get Routine API Error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};


module.exports = { saveOrUpdateRoutine, getDailyRoutine };

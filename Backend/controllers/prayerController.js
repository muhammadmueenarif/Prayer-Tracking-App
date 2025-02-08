const { db } = require("../config/firebase");
const jwt = require("jsonwebtoken");

const saveOrUpdatePrayer = async (req, res) => {
  const { date, prayerName, status } = req.body;
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized. Token required." });
  }

  if (!date || !prayerName || !status) {
    return res.status(400).json({ message: "Date, prayer name, and status are required." });
  }

  if (!["Offered", "Not Offered", "Qazaa"].includes(status)) {
    return res.status(400).json({ message: "Invalid status. Choose from 'Offered', 'Not Offered', or 'Qazaa'." });
  }

  try {
    // Verify user token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.uid;

    const prayerRef = db.collection("users").doc(userId).collection("prayers").doc(date);
    const prayerDoc = await prayerRef.get();

    if (prayerDoc.exists) {
      // Update the specific prayer status
      await prayerRef.update({ [prayerName]: status });
      return res.status(200).json({ message: "Prayer status updated successfully." });
    } else {
      // Save a new prayer status for the selected date
      await prayerRef.set({ [prayerName]: status, createdAt: new Date() });
      return res.status(201).json({ message: "Prayer status saved successfully." });
    }
  } catch (error) {
    console.error("Prayer API Error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// Get all prayers for a specific date
const getPrayersByDate = async (req, res) => {
    const { date } = req.params;
    const token = req.headers.authorization?.split(" ")[1];
  
    if (!token) {
      return res.status(401).json({ message: "Unauthorized. Token required." });
    }
  
    try {
      // Verify user token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.uid;
  
      const prayerRef = db.collection("users").doc(userId).collection("prayers").doc(date);
      const prayerDoc = await prayerRef.get();
  
      if (!prayerDoc.exists) {
        return res.status(404).json({ message: "No prayers found for this date." });
      }
  
      return res.status(200).json({ message: "Prayers retrieved successfully.", data: prayerDoc.data() });
    } catch (error) {
      console.error("Get Prayers API Error:", error);
      return res.status(500).json({ message: "Internal server error." });
    }
  };


module.exports = { saveOrUpdatePrayer, getPrayersByDate };

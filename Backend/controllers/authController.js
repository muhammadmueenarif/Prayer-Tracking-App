const { db, auth } = require("../config/firebase");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
  const { email, username, password } = req.body;

  if (!email || !username || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    // Check if email already exists
    const emailExists = await auth.getUserByEmail(email).catch(() => null);
    if (emailExists) {
      return res.status(400).json({ message: "Email already registered." });
    }

    // Check if username already exists in Firestore
    const usernameQuery = await db.collection("users").where("username", "==", username).get();
    if (!usernameQuery.empty) {
      return res.status(400).json({ message: "Username already taken." });
    }

    // Create user in Firebase Authentication
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: username,
    });

    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

    // Save user details in Firestore
    await db.collection("users").doc(userRecord.uid).set({
      uid: userRecord.uid,
      email,
      username,
      hashedPassword, // Store hashed password in Firestore
      createdAt: new Date(),
    });

    return res.status(201).json({ message: "User registered successfully.", uid: userRecord.uid });
  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};


const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    // Get user by email
    const userRecord = await auth.getUserByEmail(email).catch(() => null);
    if (!userRecord) {
      return res.status(400).json({ message: "Incorrect email." });
    }

    // Get user details from Firestore
    const userDoc = await db.collection("users").doc(userRecord.uid).get();
    if (!userDoc.exists) {
      return res.status(400).json({ message: "User not found." });
    }

    const userData = userDoc.data();

    // Check password (assuming you store hashed passwords in Firestore)
    const passwordMatch = await bcrypt.compare(password, userData.hashedPassword);
    if (!passwordMatch) {
      return res.status(400).json({ message: "Incorrect password." });
    }

    // Generate JWT token
    const token = jwt.sign({ uid: userRecord.uid, email: userRecord.email }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    return res.status(200).json({ message: "Login successful.", token });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = { signup, login };

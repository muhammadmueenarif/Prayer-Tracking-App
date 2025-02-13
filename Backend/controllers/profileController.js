const { db, storage } = require("../config/firebase");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");


// Set up Multer storage engine for handling file uploads
const storageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // The directory to save the uploaded images temporarily
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Add timestamp to avoid filename clashes
  },
});

const upload = multer({ storage: storageEngine }).single('file'); // Expect the file field in the form data to be 'file'

// Upload or update profile picture
const uploadProfilePicture = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized. Token required." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.uid;

    upload(req, res, async (err) => {
      if (err) {
        console.error("File upload error:", err); // Log the error for debugging
        return res.status(500).json({ message: "File upload failed", error: err });
      }

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded." });
      }

      // File upload successful, now upload to Firebase Storage
      const filePath = path.join(__dirname, 'uploads', req.file.filename);
      console.log("File uploaded successfully:", req.file); // Log the uploaded file details
      
      try {
        const file = storage.bucket().file(`profile_pictures/${userId}/${req.file.filename}`);
        
        await file.save(filePath);
        await file.makePublic();

        const pictureUrl = file.publicUrl(); // Get the URL of the uploaded image in Firebase Storage
        console.log("Image URL:", pictureUrl); // Log the URL for debugging

        // Update Firestore with the new picture URL
        const userRef = db.collection("users").doc(userId);
        await userRef.update({ profilePicture: pictureUrl });

        // Return the success response
        return res.status(200).json({ message: "Profile picture updated successfully.", pictureUrl });
      } catch (firebaseError) {
        console.error("Firebase upload error:", firebaseError); // Log any Firebase-related errors
        return res.status(500).json({ message: "Error uploading to Firebase", error: firebaseError });
      }
    });
  }  catch (error) {
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
'use client'
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from 'next/navigation';

export default function Profile() {
  const [profilePic, setProfilePic] = useState(null);  // For the profile picture (not needed for this task)
  const [bio, setBio] = useState("");  // To hold the bio
  const [userInfo, setUserInfo] = useState({ username: "", email: "", password: "" });
  const router = useRouter();

  // Function to fetch user info (username, email, password) and bio
  const fetchUserInfo = async () => {
    try {
      const res = await fetch("http://localhost:5500/api/profile/info", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`, // Use token stored in localStorage
        },
      });
      const data = await res.json();
      if (data.username) {
        setUserInfo({ username: data.username, email: data.email, password: data.password });
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  const fetchBio = async () => {
    try {
      const res = await fetch("http://localhost:5500/api/profile/bio", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      if (data.bio) {
        setBio(data.bio);
      }
    } catch (error) {
      console.error("Error fetching bio:", error);
    }
  };

  const saveBio = async () => {
    try {
      const res = await fetch("http://localhost:5500/api/profile/bio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ bio }),
      });

      const data = await res.json();
      if (data.message === "Bio updated successfully.") {
        alert("Bio updated successfully!");
      } else {
        alert("Error updating bio");
      }
    } catch (error) {
      console.error("Error saving bio:", error);
    }
  };

  // Fetch user info and bio when the component mounts
  useEffect(() => {
    fetchUserInfo();
    fetchBio();
  }, []);

  const handleBack = () => {
    router.push('/home');
  };

  const handleLogout = () => {
    router.push('/login');
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      {/* Back and Logout buttons */}
      <button 
        onClick={handleBack} 
        className="absolute top-4 left-4 bg-gray-500 text-white px-4 py-2 rounded">
        Back
      </button>
      <button 
        onClick={handleLogout} 
        className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded">
        Logout
      </button>

      <h2 className="text-2xl font-semibold text-center mb-4">Profile</h2>

      {/* User Info */}
      <div className="bg-gray-100 p-4 rounded mb-4">
        <p><strong>Username:</strong> {userInfo.username}</p>
        <p><strong>Email:</strong> {userInfo.email}</p>
        <p><strong>Password:</strong> ********</p>
      </div>

      {/* Bio Section */}
      <div className="mb-4">
        <label className="block font-medium">Bio:</label>
        <textarea
          className="w-full p-2 border rounded mt-1"
          rows="3"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        ></textarea>
        <button 
          onClick={saveBio}
          className="mt-2 bg-green-500 text-white px-4 py-1 rounded">
          Save Bio
        </button>
      </div>
    </div>
  );
}

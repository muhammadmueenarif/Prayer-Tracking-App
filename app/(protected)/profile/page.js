'use client';
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';

export default function Profile() {
  const [bio, setBio] = useState("");  // To hold the bio
  const [userInfo, setUserInfo] = useState({ username: "", email: "" });
  const [profilePic, setProfilePic] = useState(null); // For the profile picture
  const router = useRouter();

  // Function to check if the user is authenticated
  const checkAuth = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login"); // Redirect to login page if not authenticated
    }
  };

  // Fetch user info (username, email, profile picture)
  const fetchUserInfo = async () => {
    try {
      const res = await fetch("http://localhost:5500/api/profile/info", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      if (data.username) {
        setUserInfo({ username: data.username, email: data.email });
        setProfilePic(data.profilePic); // Assuming the API returns a profilePic URL
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
    checkAuth();  // Check for authentication on page load
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
    <div className="min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      {/* Header */}
      <header className="bg-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <button
            onClick={handleBack}
            className="text-sm font-medium text-gray-700 hover:text-white px-4 py-2 rounded-md hover:bg-purple-600 transition-colors"
          >
            ← Back
          </button>
          <button
            onClick={handleLogout}
            className="text-sm font-medium text-gray-700 hover:text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center min-h-[calc(100vh-160px)] p-4">
        <div className="w-full max-w-lg space-y-6">
          {/* Profile Info */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-semibold text-center text-purple-700 mb-4">Profile Information</h2>

            {/* Profile Picture */}
            <div className="flex justify-center items-center mb-4">
              {profilePic ? (
                <img
                  src={profilePic} // If profilePic exists, show the image
                  alt="Profile Picture"
                  className="w-32 h-32 rounded-full object-cover border-4 border-purple-300"
                />
              ) : (
                <div className="w-32 h-32 flex items-center justify-center text-gray-500 border-4 border-purple-300 rounded-full">
                  No Image
                </div>
              )}
            </div>

            <p><strong className="text-purple-600">Username:</strong> {userInfo.username}</p>
            <p><strong className="text-purple-600">Email:</strong> {userInfo.email}</p>
            <p><strong className="text-purple-600">Password:</strong> ********</p>
          </div>

          {/* Bio Section */}
          <div className="bg-white shadow-lg rounded-lg p-6 mt-6">
            <h2 className="text-xl font-semibold text-center text-purple-700 mb-4">Your Bio</h2>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={6}
              className="w-full p-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder="Tell us something about yourself..."
            />
            <div className="flex justify-center mt-4">
              <button
                onClick={saveBio}
                className="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Save Bio
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

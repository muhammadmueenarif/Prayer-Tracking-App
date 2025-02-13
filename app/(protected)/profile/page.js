'use client'
import { useState } from "react";
import Image from "next/image";
import { useRouter } from 'next/navigation'; 

export default function Profile() {
  const [profilePic, setProfilePic] = useState(null);
  const [bio, setBio] = useState("");
  const router = useRouter(); 

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(URL.createObjectURL(file));
    }
  };

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
      
      {/* Profile Picture */}
      <div className="flex flex-col items-center mb-4">
        {profilePic ? (
          <Image src={profilePic} alt="Profile" width={100} height={100} className="rounded-full" />
        ) : (
          <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
            No Image
          </div>
        )}
        <input type="file" className="mt-2" onChange={handleImageChange} />
        <button className="mt-2 bg-blue-500 text-white px-4 py-1 rounded">Save</button>
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
        <button className="mt-2 bg-green-500 text-white px-4 py-1 rounded">Save</button>
      </div>

      {/* User Info */}
      <div className="bg-gray-100 p-4 rounded">
        <p><strong>Username:</strong> user123</p>
        <p><strong>Email:</strong> user@example.com</p>
        <p><strong>Password:</strong> ********</p>
      </div>
    </div>
  );
}

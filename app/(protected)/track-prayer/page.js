'use client'
import { useRouter } from 'next/navigation';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '@/app/context/AuthContext';

export default function TrackPrayerPage() {
  const router = useRouter();
  const { logout } = useContext(AuthContext);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // State for each prayer's status
  const [prayers, setPrayers] = useState({
    fajr: 'Not Offered',
    zohar: 'Not Offered',
    asar: 'Not Offered',
    maghrib: 'Not Offered',
    isha: 'Not Offered',
  });

  // Fetch prayer statuses on component mount
  useEffect(() => {
    const fetchPrayerStatus = async () => {
      try {
        const response = await fetch(`http://localhost:5500/api/prayer/${selectedDate}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
  
        if (response.ok) {
          const { data } = await response.json(); // Destructure data from response
          console.log("API Response:", data); // Log to inspect the data structure
  
          // Initialize prayers object with default "Not Offered" status
          const updatedPrayers = {
            fajr: 'Not Offered',
            zohar: 'Not Offered',
            asar: 'Not Offered',
            maghrib: 'Not Offered',
            isha: 'Not Offered',
          };
  
          // Check if the data contains status for each prayer and update
          for (const [prayer, status] of Object.entries(data)) {
            if (updatedPrayers.hasOwnProperty(prayer)) {
              updatedPrayers[prayer] = status; // Set the status if prayer exists
            }
          }
  
          // Set the state with the updated prayer statuses
          setPrayers(updatedPrayers);
          console.log("Prayer statuses fetched and updated:", updatedPrayers);
        } else {
          console.error('Failed to fetch prayer statuses');
        }
      } catch (error) {
        console.error('Error fetching prayer statuses:', error);
      }
    };
  
    fetchPrayerStatus();
  }, [selectedDate]);
  
  
   
  

  const handleStatusChange = (prayer, status) => {
    setPrayers(prev => ({ ...prev, [prayer]: status }));
  };

  const handleSave = async (prayer) => {
    try {
      const response = await fetch('http://localhost:5500/api/prayer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          date: selectedDate,
          prayerName: prayer,
          status: prayers[prayer],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save prayer status');
      }

      const data = await response.json();
      alert(`${prayer.charAt(0).toUpperCase() + prayer.slice(1)} status saved.`);
    } catch (error) {
      console.error("Error saving prayer:", error);
      alert("Error saving prayer status.");
    }
  };

  const handleUpdate = async (prayer) => {
    try {
      const response = await fetch('http://localhost:5500/api/prayer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          date: selectedDate,
          prayerName: prayer,
          status: prayers[prayer],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update prayer status');
      }

      const data = await response.json();
      alert(`${prayer.charAt(0).toUpperCase() + prayer.slice(1)} status updated.`);
    } catch (error) {
      console.error("Error updating prayer:", error);
      alert("Error updating prayer status.");
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <button
            onClick={() => router.push('/home')}
            className="text-sm font-medium text-gray-700 hover:text-gray-900 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            ← Back
          </button>
          <button
            onClick={handleLogout}
            className="text-sm font-medium text-gray-700 hover:text-gray-900 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center min-h-[calc(100vh-160px)] p-4">
        <div className="w-full max-w-md space-y-6">
          {/* Date Selection */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Select Date
            </label>
            <input
              type="date"
              id="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Prayer List */}
          <div className="space-y-4">
            {['fajr', 'zohar', 'asar', 'maghrib', 'isha'].map((prayer) => (
              <div key={prayer} className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="capitalize font-medium text-gray-700">
                    {prayer}
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSave(prayer)}
                      className="text-sm bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => handleUpdate(prayer)}
                      className="text-sm bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700"
                    >
                      Update
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {['Offered', 'Not Offered', 'Qazaa'].map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(prayer, status)}
                      className={`p-2 rounded-md text-sm ${
                        prayers[prayer] === status
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

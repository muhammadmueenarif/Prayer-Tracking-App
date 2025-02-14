'use client'
import { useRouter } from 'next/navigation';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '@/app/context/AuthContext';

export default function TrackPrayerPage() {
  const router = useRouter();
  const { logout, isAuthenticated } = useContext(AuthContext);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // State for each prayer's status
  const [prayers, setPrayers] = useState({
    fajr: 'Not Offered',
    zohar: 'Not Offered',
    asar: 'Not Offered',
    maghrib: 'Not Offered',
    isha: 'Not Offered',
  });

  // Check if the user is authenticated on page load
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else {
      fetchPrayerStatus();
    }
  }, [isAuthenticated, selectedDate]);

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
        const { data } = await response.json();
        const updatedPrayers = {
          fajr: 'Not Offered',
          zohar: 'Not Offered',
          asar: 'Not Offered',
          maghrib: 'Not Offered',
          isha: 'Not Offered',
        };

        for (const [prayer, status] of Object.entries(data)) {
          if (updatedPrayers.hasOwnProperty(prayer)) {
            updatedPrayers[prayer] = status;
          }
        }

        setPrayers(updatedPrayers);
      } else {
        console.error('Failed to fetch prayer statuses');
      }
    } catch (error) {
      console.error('Error fetching prayer statuses:', error);
    }
  };

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
    <div className="min-h-screen bg-gradient-to-r from-teal-400 to-blue-500">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
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
      <main className="flex flex-col items-center justify-center min-h-[calc(100vh-160px)] p-6">
        <div className="w-full max-w-lg space-y-6">
          {/* Date Selection */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
              Select Date
            </label>
            <input
              type="date"
              id="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Prayer List */}
          <div className="space-y-6">
            {['fajr', 'zohar', 'asar', 'maghrib', 'isha'].map((prayer) => (
              <div key={prayer} className="bg-white p-6 rounded-lg shadow-lg transition-all duration-300 hover:shadow-2xl">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="capitalize font-medium text-xl text-gray-700">
                    {prayer}
                  </h3>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleSave(prayer)}
                      className="text-sm bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => handleUpdate(prayer)}
                      className="text-sm bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                    >
                      Update
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {['Offered', 'Not Offered', 'Qazaa'].map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(prayer, status)}
                      className={`p-3 rounded-md text-sm font-semibold transition-all duration-200 ${
                        prayers[prayer] === status
                          ? 'bg-teal-600 text-white'
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

'use client';
import { useRouter } from 'next/navigation';
import { useContext, useState } from 'react';
import { AuthContext } from '@/app/context/AuthContext';

export default function TrackPrayerPage() {
  const router = useRouter();
  const { logout } = useContext(AuthContext);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // State for each prayer's status
  const [prayers, setPrayers] = useState({
    fajr: 'offered',
    zohar: 'offered',
    asar: 'offered',
    maghrib: 'offered',
    isha: 'offered',
  });

  const handleStatusChange = (prayer, status) => {
    setPrayers(prev => ({ ...prev, [prayer]: status }));
  };

  const handleSave = (prayer) => {
    console.log('Saving:', prayer, prayers[prayer]);
  // Show alert after save
  alert(`${prayer.charAt(0).toUpperCase() + prayer.slice(1)} status saved.`);
  // Add save logic here
  };

  const handleUpdate = (prayer) => {
    console.log('Updating:', prayer, prayers[prayer]);
  // Show alert after update
  alert(`${prayer.charAt(0).toUpperCase() + prayer.slice(1)} status updated.`);
  // Add update logic here
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
                  {['offered', 'not offered', 'qazaa'].map((status) => (
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
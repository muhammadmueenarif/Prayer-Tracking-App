'use client';
import { useRouter } from 'next/navigation';
import { useContext, useState } from 'react';
import { AuthContext } from '@/app/context/AuthContext';

export default function DailyRoutinePage() {
  const router = useRouter();
  const { logout } = useContext(AuthContext);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [routine, setRoutine] = useState('');

  const handleSave = () => {
    // Check if routine is empty
    if (!routine.trim()) {
      alert('Please enter something to save.');
      return;
    }
    
    // Add save logic here
    console.log('Saving routine:', { date: selectedDate, routine });
    alert('Daily routine saved successfully!');
  };

  const handleUpdate = () => {
    // Check if routine is empty
    if (!routine.trim()) {
      alert('Please enter something to update.');
      return;
    }
    
    // Add update logic here
    console.log('Updating routine:', { date: selectedDate, routine });
    alert('Daily routine updated successfully!');
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
      <main className="flex flex-col items-center justify-center min-h-[calc(100vh-160px)] p-4">
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

          {/* Routine Input */}
          <div>
            <label htmlFor="routine" className="block text-sm font-medium text-gray-700 mb-1">
              Daily Routine
            </label>
            <textarea
              id="routine"
              value={routine}
              onChange={(e) => setRoutine(e.target.value)}
              rows={6}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your daily routine..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleSave}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save
            </button>
            <button
              onClick={handleUpdate}
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
            >
              Update
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
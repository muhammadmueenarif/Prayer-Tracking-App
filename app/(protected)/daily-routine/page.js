'use client';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '@/app/context/AuthContext';

export default function DailyRoutinePage() {
  const router = useRouter();
  const { logout, isAuthenticated, checkAuth } = useContext(AuthContext);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [routine, setRoutine] = useState('');
  const [loading, setLoading] = useState(false);
  const [routineNotFound, setRoutineNotFound] = useState(false);
  const [statusMessage, setStatusMessage] = useState(''); // To show status messages (Saving, Updating)

  // Fetch the routine when the date is changed
  const fetchRoutine = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5500/api/routine/${selectedDate}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setRoutine(data.data ? data.data.text : ''); // Show the routine if available
        setRoutineNotFound(!data.data); // If no routine found, set routineNotFound to true
      } else {
        setRoutine(''); // Clear routine if no data
        setRoutineNotFound(true); // Routine not found
      }
    } catch (error) {
      console.error('Error fetching routine:', error);
      alert('Failed to fetch routine');
    } finally {
      setLoading(false);
    }
  };

  // Handle saving the routine (POST request)
  const handleSave = async () => {
    if (!routine.trim()) {
      alert('Please enter something to save.');
      return;
    }

    try {
      setStatusMessage('Saving...'); // Show saving message
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5500/api/routine', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ date: selectedDate, text: routine }),
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        fetchRoutine(); // Refetch the routine after saving
      } else {
        alert(data.message || 'Failed to save routine');
      }
    } catch (error) {
      console.error('Error saving routine:', error);
      alert('Failed to save routine');
    } finally {
      setStatusMessage(''); // Clear status message after saving
      setLoading(false);
    }
  };

  // Handle updating the routine (POST request)
  const handleUpdate = async () => {
    if (!routine.trim()) {
      alert('Please enter something to update.');
      return;
    }

    try {
      setStatusMessage('Updating...'); // Show updating message
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5500/api/routine', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ date: selectedDate, text: routine }),
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        fetchRoutine(); // Refetch the routine after updating
      } else {
        alert(data.message || 'Failed to update routine');
      }
    } catch (error) {
      console.error('Error updating routine:', error);
      alert('Failed to update routine');
    } finally {
      setStatusMessage(''); // Clear status message after updating
      setLoading(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    router.push('/');
  };

  // Check if user is authenticated and fetch routine on page load or when date is changed
  useEffect(() => {
    if (!checkAuth()) {
      router.push('/login'); // Redirect to login if not authenticated
    } else {
      fetchRoutine();
    }
  }, [selectedDate]);

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

          {/* Show message if no routine found */}
          {routineNotFound && (
            <div className="text-sm text-red-500 mt-2">
              No routine found for this date. Please enter something to save.
            </div>
          )}

          {/* Status message (Saving, Updating, etc.) */}
          {statusMessage && (
            <div className="text-sm text-blue-500 mt-2">
              {statusMessage}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleSave}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              disabled={loading}
            >
              Save
            </button>
            <button
              onClick={handleUpdate}
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
              disabled={loading}
            >
              Update
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

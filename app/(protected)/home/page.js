'use client';
import { useRouter } from 'next/navigation';
import { useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, logout } = useContext(AuthContext);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-400 to-blue-500">
      {/* Header */}
      <header className="bg-white shadow-lg">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800">Welcome Home</h1>
          <button
            onClick={handleLogout}
            className="text-sm font-medium text-gray-700 hover:text-gray-900 px-4 py-2 rounded-md hover:bg-gray-200 transition-all duration-200"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center min-h-[calc(100vh-160px)] space-y-6">
        <div className="space-y-6 w-full max-w-lg px-6">
          <button
            onClick={() => router.push('/track-prayer')}
            className="w-full bg-white py-4 px-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow text-lg font-medium text-gray-700 hover:bg-gray-50 transform hover:scale-105 duration-200"
          >
            Track Prayer
          </button>
          <button
            onClick={() => router.push('/daily-routine')}
            className="w-full bg-white py-4 px-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow text-lg font-medium text-gray-700 hover:bg-gray-50 transform hover:scale-105 duration-200"
          >
            Daily Routine
          </button>
          <button
            onClick={() => router.push('/profile')}
            className="w-full bg-white py-4 px-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow text-lg font-medium text-gray-700 hover:bg-gray-50 transform hover:scale-105 duration-200"
          >
            Profile
          </button>
        </div>
      </main>
    </div>
  );
}

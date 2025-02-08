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
    router.push('/');
  };

  // ... rest of the home page component
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Logout Button */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-end">
          <button
            onClick={handleLogout}
            className="text-sm font-medium text-gray-700 hover:text-gray-900 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center min-h-[calc(100vh-160px)]">
        <div className="space-y-4 w-full max-w-md px-4">
          <button
            onClick={() => navigateTo('/track-prayer')}
            className="w-full bg-white py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-lg font-medium text-gray-700 hover:bg-gray-50"
          >
            Track Prayer
          </button>
          <button
            onClick={() => navigateTo('/daily-routine')}
            className="w-full bg-white py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-lg font-medium text-gray-700 hover:bg-gray-50"
          >
            Daily Routine
          </button>
        </div>
      </main>
    </div>
  );
}
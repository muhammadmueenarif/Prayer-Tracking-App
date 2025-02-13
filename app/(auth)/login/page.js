'use client';
import { useRouter } from 'next/navigation';
import { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import AuthForm from '../../components/AuthForm';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useContext(AuthContext);
  const [error, setError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false); // To track logging in state

  const handleLogin = async (email, password) => {
    try {
      if (!email || !password) {
        throw new Error('Please enter both email and password');
      }

      setLoggingIn(true); // Set loggingIn to true when login attempt starts

      const response = await fetch('http://localhost:5500/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Call the login function from context to update auth state
      login(data.token);

    } catch (error) {
      setError(error.message);
    } finally {
      setLoggingIn(false); // Set loggingIn to false when login attempt finishes
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AuthForm isLogin={true} onSubmit={handleLogin} />
      <div className="text-center pb-8">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <button
            onClick={() => router.push('/signup')}
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Signup
          </button>
        </p>
      </div>

      {/* Show the logging in message when the login process is ongoing */}
      {loggingIn && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-blue-100 text-blue-700 text-center">
          Logging in...
        </div>
      )}

      {/* Show error message if any */}
      {error && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-red-100 text-red-700 text-center">
          {error}
        </div>
      )}
    </div>
  );
}

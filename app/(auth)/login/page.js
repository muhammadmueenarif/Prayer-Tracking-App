// pages/login.js
'use client';
import { useRouter } from 'next/navigation';
import { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import AuthForm from '../../components/AuthForm';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useContext(AuthContext);
  const [error, setError] = useState('');

  const handleLogin = async (email, password) => {
    try {
      if (!email || !password) {
        throw new Error('Please enter both email and password');
      }

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
      {error && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-red-100 text-red-700 text-center">
          {error}
        </div>
      )}
    </div>
  );
}

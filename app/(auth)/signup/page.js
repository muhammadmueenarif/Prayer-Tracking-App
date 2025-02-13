'use client';
import { useRouter } from 'next/navigation';
import { useContext, useState } from 'react';
import AuthForm from '../../components/AuthForm';
import { AuthContext } from '../../context/AuthContext';

export default function SignupPage() {
  const router = useRouter();
  const { login } = useContext(AuthContext);
  const [error, setError] = useState('');
  const [signingUp, setSigningUp] = useState(false); // Track signup process

  const handleSignup = async (email, password, username) => {
    try {
      if (!email || !password || !username) {
        throw new Error('Please fill all fields');
      }

      setSigningUp(true); // Set signingUp to true when signup starts

      const response = await fetch('http://localhost:5500/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, username }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      // Auto-login after successful signup
      await login(email, password);
      router.push('/home');
    } catch (error) {
      setError(error.message);
    } finally {
      setSigningUp(false); // Set signingUp to false when signup attempt finishes
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AuthForm isLogin={false} onSubmit={handleSignup} />
      <div className="text-center pb-8">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <button
            onClick={() => router.push('/login')}
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Login
          </button>
        </p>
      </div>

      {/* Show the "Signing up..." message when the signup process is ongoing */}
      {signingUp && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-blue-100 text-blue-700 text-center">
          Signing up...
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

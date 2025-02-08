'use client';
import { useRouter } from 'next/navigation';
import { useContext, useState } from 'react';
import AuthForm from '../../components/AuthForm';
import { AuthContext } from '../../context/AuthContext';

export default function SignupPage() {
  const router = useRouter();
  const { login } = useContext(AuthContext);
  const [error, setError] = useState('');

  const handleSignup = async (email, password, username) => {
    try {
      // Basic validation
      if (!email || !password || !username) {
        throw new Error('Please fill all fields');
      }
      
      // Mock signup process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // After successful signup, log the user in
      await login(email, password);
      router.push('/home');
    } catch (error) {
      setError(error.message);
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
      {error && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-red-100 text-red-700 text-center">
          {error}
        </div>
      )}
    </div>
  );
}
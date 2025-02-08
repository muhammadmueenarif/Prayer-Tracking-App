'use client';
import { useRouter } from 'next/navigation';
import { useContext, useState } from 'react';
import AuthForm from '../../components/AuthForm';
import { AuthContext } from '../../context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login, loading } = useContext(AuthContext);
  const [error, setError] = useState('');

  const handleLogin = async (email, password) => {
    try {
      // Basic validation
      if (!email || !password) {
        throw new Error('Please enter both email and password');
      }
      
      await login(email, password);
      router.push('/home');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AuthForm isLogin={true} onSubmit={handleLogin} isLoading={loading} />
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
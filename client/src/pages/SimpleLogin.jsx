import { useState } from 'react';
import toast from 'react-hot-toast';
import mascotImage from '../assets/moodicat_cry.png';

export default function SimpleLogin({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    console.log('Submitting:', { username, password, isLogin });

    try {
      const url = `http://localhost:10000/api/v1/auth/${isLogin ? 'login' : 'register'}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
          ...(isLogin ? {} : { email: `${username}@example.com` })
        }),
      });

      let data;
      const contentType = response.headers.get('content-type');
      try {
        if (contentType && contentType.includes('application/json')) {
          data = await response.json();
        } else {
          // Handle text response (like "Username already exists")
          const text = await response.text();
          data = { message: text || 'An error occurred' };
        }
      } catch (e) {
        data = { message: 'Invalid response from server' };
      }

      console.log('Response:', data);

      if (response.ok) {
        if (data.token) {
          localStorage.setItem('aiDiaryToken', data.token);
          localStorage.setItem('aiDiaryUser', JSON.stringify(data.user));
          toast.success(isLogin ? 'Welcome back! 🎉' : 'Account created successfully! 🎉');
          if (onLoginSuccess) {
            onLoginSuccess();
          } else {
            window.location.reload();
          }
        }
      } else {
        // Handle different error cases
        if (response.status === 409 && !isLogin) {
          // Username already exists during registration
          toast.error('Username already exists. Please sign in instead.', {
            duration: 5000,
          });
          // Automatically switch to login mode
          setTimeout(() => {
            setIsLogin(true);
          }, 500);
        } else if (response.status === 401 && isLogin) {
          // Login failed
          toast.error('Invalid username or password. Please try again.');
        } else if (response.status === 400) {
          // Bad request
          toast.error(data.message || 'Please check your input and try again.');
        } else {
          // Other errors
          toast.error(data.message || 'An error occurred. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Network error: Unable to connect to server. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div className="min-h-screen flex items-center justify-center" style={{backgroundColor: '#38BECF'}}>
        <div className="max-w-md w-full space-y-8 p-8">
          <div className="text-center">

            <div className="mb-4">
              <img
                  src={mascotImage}
                  alt="Moodicat Mascot"
                  className="w-80 h-80 mx-auto" //size of logo
              />
            </div>

            <h2 className="text-3xl font-bold text-white">
              {isLogin ? 'Welcome Back' : 'Join Moodicat'}
            </h2>
            <p className="text-white/80 mt-2">
              {isLogin ? 'Sign in to your account' : 'Create your account'}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Enter your username"
                    required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Enter your password"
                    required
                />
              </div>

              <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-teal-600 hover:text-teal-500"
              >
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </div>
          </div>
        </div>
      </div>
  );
}
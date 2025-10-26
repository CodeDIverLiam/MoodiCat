import { useState, useEffect } from 'react';

export default function TestApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('TestApp mounted');
    const token = localStorage.getItem('aiDiaryToken');
    console.log('Token found:', !!token);
    setIsAuthenticated(!!token);
    setIsLoading(false);
  }, []);

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:10000/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'demo',
          password: 'demo123'
        }),
      });

      const data = await response.json();
      console.log('Login response:', data);

      if (response.ok && data.token) {
        localStorage.setItem('aiDiaryToken', data.token);
        localStorage.setItem('aiDiaryUser', JSON.stringify(data.user));
        setIsAuthenticated(true);
      } else {
        alert('Login failed: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Network error: ' + error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('aiDiaryToken');
    localStorage.removeItem('aiDiaryUser');
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{backgroundColor: '#38BECF'}}>
        <div className="text-center">
          <div className="text-6xl mb-4">🐱</div>
          <div className="text-white text-xl">Loading...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{backgroundColor: '#38BECF'}}>
        <div className="max-w-md w-full space-y-8 p-8">
          <div className="text-center">
            <div className="text-6xl mb-4">🐱</div>
            <h2 className="text-3xl font-bold text-white">Moodicat Test</h2>
            <p className="text-white/80 mt-2">Click to login with demo account</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <button
              onClick={handleLogin}
              className="w-full px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
            >
              Login as Demo User
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{backgroundColor: '#38BECF'}}>
      <div className="p-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">🎉 Success!</h1>
          <p className="text-gray-600 mb-4">You are now logged in to Moodicat!</p>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

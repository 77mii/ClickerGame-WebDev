




import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';


const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);

        // Decode the token to extract the userId
        const decodedToken: { userId: string } = jwtDecode(data.token);
        localStorage.setItem('userId', decodedToken.userId);

        navigate('/game');
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'Login failed');
      }
    } catch (error) {
      setErrorMessage('Error logging in. Please try again.');
      console.error('Error logging in:', error);
    }
  };

  const handleRegisterNavigation = () => {
    navigate('/register');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-950">
      <div className="bg-blue-400 rounded-lg shadow-lg p-14">
        <h1 className="mb-6 text-2xl font-bold">Login</h1>
        {errorMessage && (
          <div className="mb-4 text-red-500">
            {errorMessage}
          </div>
        )}
        <form onSubmit={handleLogin} className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="p-2 border border-gray-300 rounded w-80"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="p-2 border border-gray-300 rounded w-80"
          />
          <button type="submit" className="p-2 text-white bg-blue-500 rounded hover:bg-blue-600">
            Login
          </button>
        </form>
        <div className="flex justify-center mt-4">
          <button
            onClick={handleRegisterNavigation}
            className="p-2 text-white bg-gray-500 rounded hover:bg-gray-600"
          >
            Press here to register
          </button>
         <p></p>
        </div>
      </div>
    </div>
  );
};

export default Login;


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        navigate('/login');
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'Registration failed');
      }
    } catch (error) {
      setErrorMessage('Error registering. Please try again.');
      console.error('Error registering:', error);
    }
  };

  const handleLoginNavigation = () => {
    navigate('/login');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-950">
      <div className="bg-blue-400 rounded-lg shadow-lg p-14">
        <h1 className="mb-6 text-2xl font-bold">Register</h1>
        {errorMessage && (
          <div className="mb-4 text-red-500">
            {errorMessage}
          </div>
        )}
        <form onSubmit={handleRegister} className="flex flex-col space-y-4">
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
            Register
          </button>
        </form>
        <div className="flex justify-center mt-4">
          <button
            onClick={handleLoginNavigation}
            className="p-2 text-white bg-gray-500 rounded hover:bg-gray-600"
          >
            Press here to login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
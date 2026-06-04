














import React, { useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';
import '../styles/Game.css';
import capybaraImage from '../assets/capybara.jpg';
import { useNavigate } from 'react-router-dom';
import Shop from './Shop';

interface Item {
  id: number;
  itemname: string;
  price: number;
  effect: string;
}

interface UserData {
  userid: number;
  userScore: number;
  pointsPerClick: number;
  autoClickPurchased: boolean;
  autoClickInterval: number;
  criticalHitChance: number;
  comboMultiplier: number;
  energyBoosts: number;
  boostActive: boolean;
}

const Game: React.FC = () => {
  const [score, setScore] = useState<number>(0);
  const [pointsPerClick, setPointsPerClick] = useState<number>(1);
  const [autoClickPurchased, setAutoClickPurchased] = useState<boolean>(false);
  const [autoClickInterval, setAutoClickInterval] = useState<number>(2000);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const [purchaseMessage, setPurchaseMessage] = useState<string>('');
  const token = localStorage.getItem('token'); 
  const navigate = useNavigate(); 

  let userId: string | null = null;
  if (token) {
    const decodedToken: { userId: string } = jwtDecode(token);
    userId = decodedToken.userId;
  }

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/user/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setUserData(data);
        setScore(data.userScore);
        setPointsPerClick(data.pointsPerClick);
        setAutoClickPurchased(data.autoClickPurchased);
        setAutoClickInterval(data.autoClickInterval);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId, token]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    if (autoClickPurchased) {
      intervalId = setInterval(async () => {
        try {
          const response = await fetch('http://localhost:3001/api/update-score', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ userId, score: score + pointsPerClick }),
          });

          if (response.ok) {
            setScore(prevScore => prevScore + pointsPerClick);
          } else {
            const errorData = await response.json();
            console.error('Error updating score:', errorData.error);
          }
        } catch (error) {
          console.error('Error updating score:', error);
        }
      }, autoClickInterval);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [autoClickPurchased, autoClickInterval, pointsPerClick, score, userId, token]);

  const handleClick = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/update-score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, score: score + pointsPerClick }),
      });

      if (response.ok) {
        setScore(score + pointsPerClick);
      } else {
        const errorData = await response.json();
        console.error('Error updating score:', errorData.error);
      }
    } catch (error) {
      console.error('Error updating score:', error);
    }

    setIsClicked(true);
    setTimeout(() => {
      setIsClicked(false);
    }, 100);
  };

  const handleDeleteAccount = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/user/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        localStorage.removeItem('token');
        navigate('/register');
      } else {
        const errorData = await response.json();
        console.error('Error deleting account:', errorData.error);
      }
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  const handleBuy = async (item: Item) => {
    if (score >= item.price) {
      try {
        const response = await fetch('http://localhost:3001/api/purchase-item', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ userId, itemId: item.id }),
        });

        if (response.ok) {
          const responseData = await response.json();
          setScore(responseData.remainingScore);
          setPurchaseMessage(`✅ ${item.itemname} purchased!`);
          setTimeout(() => setPurchaseMessage(''), 3000);
          
          // Fetch updated user data
          const userResponse = await fetch(`http://localhost:3001/api/user/${userId}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          const data = await userResponse.json();
          setUserData(data);
          setPointsPerClick(data.pointsPerClick);
          setAutoClickPurchased(data.autoClickPurchased);
          setAutoClickInterval(data.autoClickInterval);
        } else {
          const errorData = await response.json();
          setPurchaseMessage(`❌ ${errorData.error}`);
          setTimeout(() => setPurchaseMessage(''), 3000);
        }
      } catch (error) {
        console.error('Error purchasing item:', error);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="flex w-full min-h-screen flex-col lg:flex-row bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950">
      {/* Sidebar */}
      <div className="flex flex-col p-6 w-full lg:w-80 bg-blue-950 shadow-lg border-b lg:border-r border-blue-800">
        {/* Stats */}
        <div className="pb-8 bg-blue-900 rounded-lg p-4 mb-6">
          <h2 className="text-sm font-semibold text-blue-200 uppercase tracking-wide">Stats</h2>
          <p className="text-3xl font-bold text-yellow-400 mt-2">{score}</p>
          <p className="text-xs text-blue-300 mt-1">Points</p>
          
          <div className="mt-4 pt-4 border-t border-blue-700">
            <p className="text-xs text-blue-300 mb-1">Damage per click</p>
            <p className="text-2xl font-bold text-green-400">{pointsPerClick}</p>
          </div>

          {autoClickPurchased && (
            <div className="mt-4 pt-4 border-t border-blue-700">
              <p className="text-xs text-blue-300 mb-1">Auto-Click Speed</p>
              <p className="text-lg font-bold text-purple-400">{(2000 / autoClickInterval).toFixed(1)}x</p>
            </div>
          )}
        </div>

        {/* Purchase Message */}
        {purchaseMessage && (
          <div className="mb-4 p-3 bg-blue-800 border-l-4 border-yellow-400 rounded text-white text-sm font-semibold">
            {purchaseMessage}
          </div>
        )}

        {/* Shop Component */}
        <div className="flex-1 overflow-y-auto mb-6">
          <Shop 
            onPurchase={handleBuy} 
            userScore={score}
            userData={userData}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button 
            onClick={handleLogout} 
            className="flex-1 px-4 py-2 font-bold text-white bg-red-600 rounded-lg hover:bg-red-500 transition transform hover:scale-105"
          >
            Logout
          </button>
          <button 
            onClick={handleDeleteAccount} 
            className="flex-1 px-4 py-2 font-bold text-white bg-red-800 rounded-lg hover:bg-red-700 transition transform hover:scale-105"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="flex flex-col items-center justify-center flex-grow p-8">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-white mb-2">🦫 Click Clicker</h1>
          <p className="text-blue-200 text-lg mb-12">Tap the capybara to earn points!</p>
          
          <img 
            src={capybaraImage} 
            alt="Capybara" 
            className={`w-80 h-80 rounded-2xl shadow-2xl cursor-pointer object-cover transition-all duration-100 ${
              isClicked ? 'transform scale-110 shadow-yellow-400/50' : 'hover:shadow-yellow-300/50'
            }`} 
            onClick={handleClick} 
          />
          
          <div className="mt-12 text-center">
            <p className="text-blue-200 text-sm uppercase tracking-widest">Click Power</p>
            <p className="text-6xl font-bold text-yellow-400">{pointsPerClick}</p>
            <p className="text-blue-300 text-sm mt-2">Points per click</p>
          </div>

          {autoClickPurchased && (
            <div className="mt-8 p-4 bg-green-900/30 border-2 border-green-400 rounded-lg">
              <p className="text-green-300 font-semibold">🤖 Auto-Click Active</p>
              <p className="text-green-200 text-sm">Earning {Math.floor(pointsPerClick * (1000 / autoClickInterval))} pts/sec</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Game;















import React, { useState, useEffect, useRef } from 'react';
import {jwtDecode} from 'jwt-decode';
import '../styles/Game.css';
import capybaraImage from '../assets/capybara.jpg';
import { useNavigate } from 'react-router-dom';
import Shop from './Shop';
import Settings from './Settings';
import { getImageById, AVAILABLE_IMAGES } from '../utils/imageConfig';

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
  selectedImage: string;
  autoClickPower: number;
}

const Game: React.FC = () => {
  const [score, setScore] = useState<number>(0);
  const [pointsPerClick, setPointsPerClick] = useState<number>(1);
  const [autoClickPurchased, setAutoClickPurchased] = useState<boolean>(false);
  const [autoClickInterval, setAutoClickInterval] = useState<number>(2000);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('capybara');
  const [autoClickPower, setAutoClickPower] = useState<number>(0);
  const [sidebarWidth, setSidebarWidth] = useState<number>(320);
  const isResizingRef = useRef(false);
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const [purchaseMessage, setPurchaseMessage] = useState<string>('');
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
    

    const handleImageChange = async (imageName: string) => {
      try {
        const response = await fetch('http://localhost:3001/api/update-image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ userId, imageName }),
        });

        if (response.ok) {
          setSelectedImage(imageName);
        } else {
          console.error('Error updating image preference');
          throw new Error('Failed to update image');
        }
      } catch (error) {
        console.error('Error:', error);
        throw error;
      }
    };

    const renderClickerElement = () => {
      const imageConfig = getImageById(selectedImage);
    
      if (!imageConfig) {
        return <img src={capybaraImage} alt="Clicker" />;
      }

      // Check if it's an emoji
      if (imageConfig.image.match(/^[\p{Emoji}]/u)) {
        return (
          <button
            onClick={handleClick}
            className={`text-9xl cursor-pointer transition-all duration-100 select-none ${
              isClicked ? 'transform scale-110' : 'hover:scale-105'
            }`}
            style={{ background: 'none', border: 'none' }}
          >
            {imageConfig.image}
          </button>
        );
      }

      // It's an image file
      return (
        <img 
          src={imageConfig.image} 
          alt={imageConfig.name} 
          className={`w-80 h-80 rounded-2xl shadow-2xl cursor-pointer object-cover transition-all duration-100 ${
            isClicked ? 'transform scale-110 shadow-yellow-400/50' : 'hover:shadow-yellow-300/50'
          }`} 
          onClick={handleClick} 
        />
      );
    };

    
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
        setSelectedImage(data.selectedImage || 'capybara');
        setAutoClickPower(data.autoClickPower || 0);
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
            body: JSON.stringify({ userId, score: score + pointsPerClick + (autoClickPower || 0) }),
          });

          if (response.ok) {
            setScore(prevScore => prevScore + pointsPerClick + (autoClickPower || 0));
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

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isResizingRef.current) return;
      const dx = e.clientX - startXRef.current;
      const newWidth = Math.max(200, Math.min(600, startWidthRef.current + dx));
      setSidebarWidth(newWidth);
    };

    const onMouseUp = () => {
      if (!isResizingRef.current) return;
      isResizingRef.current = false;
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

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
          setAutoClickPower(data.autoClickPower || 0);
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
    <div className="flex flex-col w-full min-h-screen lg:flex-row bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950">
      {/* Sidebar */}
      <div
        className="flex flex-col w-full p-6 border-b border-blue-800 shadow-lg bg-blue-950 lg:border-r"
        style={{ width: sidebarWidth }}
      >
        {/* Stats */}
        <div className="p-4 pb-8 mb-6 bg-blue-900 rounded-lg">
          <h2 className="text-sm font-semibold tracking-wide text-blue-200 uppercase">Stats</h2>
          <p className="mt-2 text-3xl font-bold text-yellow-400">{score}</p>
          <p className="mt-1 text-xs text-blue-300">Points</p>
          
          <div className="pt-4 mt-4 border-t border-blue-700">
            <p className="mb-1 text-xs text-blue-300">Click Power</p>
            <p className="text-2xl font-bold text-green-400">{pointsPerClick}</p>
          </div>

          {autoClickPurchased && (
            <div className="pt-4 mt-4 border-t border-blue-700">
              <p className="mb-1 text-xs text-blue-300">Auto-Click Speed</p>
              <p className="text-lg font-bold text-purple-400">{(2000 / autoClickInterval).toFixed(1)}x</p>
            </div>
          )}
          {/* Auto-Click Power indicator */}
          <div className="pt-4 mt-4 border-t border-blue-700">
            <p className="mb-1 text-xs text-blue-300">Auto-Click Power</p>
            <p
              className="text-lg font-bold text-yellow-300 cursor-help"
              title={
                `Each Auto-Click Power adds +1 to every auto-click. ` +
                `Auto-click income per tick = pointsPerClick + autoClickPower. ` +
                `Example: pointsPerClick=${pointsPerClick}, autoClickPower=${autoClickPower} -> auto-click gives ${pointsPerClick + autoClickPower} per tick.`
              }
            >
              +{autoClickPower}
            </p>
          </div>
        </div>

        {/* Purchase Message */}
        {purchaseMessage && (
          <div className="p-3 mb-4 text-sm font-semibold text-white bg-blue-800 border-l-4 border-yellow-400 rounded">
            {purchaseMessage}
          </div>
        )}

        {/* Shop Component */}
        <div className="flex-1 mb-6 overflow-y-auto">
          <Shop 
            onPurchase={handleBuy} 
            userScore={score}
            userData={userData}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="w-full px-4 py-2 font-bold text-white transition transform bg-purple-600 rounded-lg hover:bg-purple-500 hover:scale-105"
          >
            ⚙️ Settings
          </button>
          <div className="flex gap-3">
          <button 
            onClick={handleLogout} 
            className="flex-1 px-4 py-2 font-bold text-white transition transform bg-red-600 rounded-lg hover:bg-red-500 hover:scale-105"
          >
            Logout
          </button>
          <button 
            onClick={handleDeleteAccount} 
            className="flex-1 px-4 py-2 font-bold text-white transition transform bg-red-800 rounded-lg hover:bg-red-700 hover:scale-105"
          >
            Delete
          </button>
          </div>
        </div>
      </div>

      {/* Draggable divider for desktop */}
      <div
        className="items-stretch hidden lg:flex"
        style={{ width: 8 }}
        onMouseDown={(e) => {
          isResizingRef.current = true;
          startXRef.current = e.clientX;
          startWidthRef.current = sidebarWidth;
          const onMouseMove = (ev: MouseEvent) => {
            if (!isResizingRef.current) return;
            const dx = ev.clientX - startXRef.current;
            const newWidth = Math.max(200, Math.min(600, startWidthRef.current + dx));
            setSidebarWidth(newWidth);
          };
          const onMouseUp = () => {
            if (!isResizingRef.current) return;
            isResizingRef.current = false;
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
          };
          window.addEventListener('mousemove', onMouseMove);
          window.addEventListener('mouseup', onMouseUp);
        }}
      >
        <div className="w-full h-full bg-transparent hover:bg-yellow-500/30 cursor-col-resize" />
      </div>

      {/* Main Game Area */}
      <div className="flex flex-col items-center justify-center flex-grow p-8">
        <div className="text-center">
          <h1 className="mb-2 text-5xl font-bold text-white">Click Clicker</h1>
          
          
          <p className="mb-12 text-lg text-blue-200">Tap to earn points!</p>
          
          <div 
            onClick={handleClick}
            className={`flex items-center justify-center transition-all duration-100 ${
              isClicked ? 'transform scale-110' : ''
            }`}
          >
            {renderClickerElement()}
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-sm tracking-widest text-blue-200 uppercase">Click Power</p>
            <p className="text-6xl font-bold text-yellow-400">{pointsPerClick}</p>
            <p className="mt-2 text-sm text-blue-300">Points per click</p>
          </div>

          {autoClickPurchased && (
            <div className="p-4 mt-8 border-2 border-green-400 rounded-lg bg-green-900/30">
              <p className="font-semibold text-green-300">🤖 Auto-Click Active</p>
              <p className="text-sm text-green-200">Earning {Math.floor((pointsPerClick + autoClickPower) * (1000 / autoClickInterval))} pts/sec</p>
            </div>
          )}
        </div>
      </div>

      {/* Settings Modal */}
      <Settings 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        selectedImage={selectedImage}
        onImageSelect={handleImageChange}
      />
    </div>
  );
}

export default Game;
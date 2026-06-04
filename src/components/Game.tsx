














import React, { useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';
import '../styles/Game.css';
import capybaraImage from '../assets/capybara.jpg';
import { useNavigate } from 'react-router-dom';




interface Item {
  id: number;
  itemname: string;
  price: number;
  effect: string;
}

const Game: React.FC = () => {
  const [score, setScore] = useState<number>(0);
  const [pointsPerClick, setPointsPerClick] = useState<number>(1);
  const [autoClickPurchased, setAutoClickPurchased] = useState<boolean>(false);
  const [autoClickInterval, setAutoClickInterval] = useState<number>(2000); // 2s default
  const [items, setItems] = useState<Item[]>([]);
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const token = localStorage.getItem('token'); 
  const navigate = useNavigate(); 

  // Decode the token to extract the userId
  let userId: string | null = null;
  if (token) {
    const decodedToken: { userId: string } = jwtDecode(token);
    userId = decodedToken.userId;
  }

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/shop-items', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const itemsFromDb: Item[] = await response.json();
        setItems(itemsFromDb);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };

    fetchItems();
  }, [token]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/user/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const userData = await response.json();
        setScore(userData.userScore);
        setPointsPerClick(userData.pointsPerClick);
        setAutoClickPurchased(userData.autoClickPurchased);
        setAutoClickInterval(userData.autoClickInterval);
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
    }, 100); // click timeout to let the animation play out
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
        localStorage.removeItem('token'); // Clear the token from local storage
        navigate('/register'); // Redirect to the register page
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
          setScore(score - item.price);
          // Fetch updated user data to apply item effects
          const userResponse = await fetch(`http://localhost:3001/api/user/${userId}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          const userData = await userResponse.json();
          setPointsPerClick(userData.pointsPerClick);
          setAutoClickPurchased(userData.autoClickPurchased);
          setAutoClickInterval(userData.autoClickInterval);
        } else {
          const errorData = await response.json();
          console.error('Error purchasing item:', errorData.error);
        }
      } catch (error) {
        console.error('Error purchasing item:', error);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear the token from local storage
    navigate('/login'); // Redirect to the login page
  };

  return (
   


    


    <div className="flex w-full h-full min-h-screen" id="container"> 
    <div className="flex flex-col p-6 w-52 bg-blue-950" id="sidebar">
      <div className="pb-10" id="data">
        <h2 className="text-white">Current pts per click</h2>
        <p className="text-white">{pointsPerClick}</p>
      </div>
      <div className="py-4">
        <h2 className="pb-6 font-bold text-white">Shop</h2>
        <div>
          {items.map((item, index) => (
            <div key={index} className="py-4">
              <p className="font-bold text-white">{item.itemname}</p>
              <button 
                onClick={() => handleBuy(item)} 
                disabled={item.itemname === 'Auto Click SPD +' && !autoClickPurchased || score < item.price ||item.itemname === 'Auto Click' && autoClickPurchased}
                className="w-32 px-2 py-1 font-bold text-white bg-blue-800 rounded-full hover:bg-blue-500 disabled:opacity-50"
                
              >
                Buy for {item.price}
              </button>
            </div>
          ))}
        </div>
      </div>
      <button 
        onClick={handleLogout} 
        className="w-32 px-2 py-1 mt-4 font-bold text-white bg-red-600 rounded-full hover:bg-red-500"
      >
        Logout
      </button>
      <button 
  onClick={handleDeleteAccount} 
  className="w-32 px-2 py-1 mt-4 font-bold text-white bg-red-600 rounded-full hover:bg-red-500"
>
  Delete Account
</button>
    </div>
    <div className="flex flex-col items-center justify-center flex-grow p-5 bg-blue-900" id="main">
      <h1 className="font-bold text-white">Image Clicker</h1>
      <p className="pt-4 pb-10 text-white">Score: {score}</p>
      <img 
        src={capybaraImage} 
        alt="Capybara" 
        className={`w-96 rounded-md h-auto cursor-pointer ${isClicked ? 'transform scale-110' : ''}`} 
        onClick={handleClick} 
      />
    </div>
  </div>
  );
}

export default Game;
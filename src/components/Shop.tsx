import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

interface ShopItem {
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

interface ShopProps {
  onPurchase: (item: ShopItem) => void;
  userScore: number;
  userData: UserData | null;
}

const Shop: React.FC<ShopProps> = ({ onPurchase, userScore, userData }) => {
  const [items, setItems] = useState<ShopItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/shop-items', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const itemsFromDb: ShopItem[] = await response.json();
        setItems(itemsFromDb);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };

    fetchItems();
  }, [token]);

  const getCategoryByEffect = (effect: string): string => {
    if (effect.includes('Click Power')) return 'Power';
    if (effect.includes('Click Multiplier')) return 'Multiplier';
    if (effect.includes('Auto Click')) return 'Auto';
    if (effect.includes('Critical')) return 'Critical';
    if (effect.includes('Combo')) return 'Combo';
    if (effect.includes('Energy') || effect.includes('Boost') || effect.includes('Overdrive')) return 'Energy';
    return 'Special';
  };

  const getItemIcon = (effect: string): string => {
    if (effect.includes('Click Power')) return '💪';
    if (effect.includes('Multiplier')) return '📈';
    if (effect.includes('Auto Click')) return '🤖';
    if (effect.includes('Critical')) return '⚡';
    if (effect.includes('Combo')) return '🔥';
    if (effect.includes('Energy') || effect.includes('Boost')) return '⚙️';
    if (effect.includes('Golden')) return '👑';
    if (effect.includes('Time')) return '⏰';
    return '🎁';
  };

  const filterItems = () => {
    if (selectedCategory === 'all') return items;
    return items.filter(item => getCategoryByEffect(item.effect) === selectedCategory);
  };

  const isItemAffordable = (price: number) => userScore >= price;

  const categories = [
    'all',
    ...Array.from(new Set(items.map(item => getCategoryByEffect(item.effect))))
  ];

  const filteredItems = filterItems();

  return (
    <div className="bg-gradient-to-b from-blue-900 to-blue-950 rounded-lg p-6 shadow-xl">
      <h2 className="text-2xl font-bold text-white mb-4">🛒 Power-Up Shop</h2>
      
      {/* Category Filter */}
      <div className="mb-6 flex flex-wrap gap-2">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full font-semibold transition-all ${
              selectedCategory === category
                ? 'bg-yellow-500 text-blue-900'
                : 'bg-blue-800 text-white hover:bg-blue-700'
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            title={`Effect: ${item.effect}`}
            className={`p-4 rounded-lg border-2 transition-all overflow-hidden ${
              isItemAffordable(item.price)
                ? 'bg-blue-800 border-blue-600 hover:border-yellow-400'
                : 'bg-blue-900 border-blue-700 opacity-60'
            }`}
            style={{ minHeight: 120 }}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">{getItemIcon(item.effect)}</span>
                <h3 className="font-bold text-white text-sm break-words whitespace-normal leading-tight flex-1">{item.itemname}</h3>
              </div>
            </div>
            
            <p className="text-xs text-blue-200 mb-3">{item.effect}</p>
            
            <div className="flex items-center justify-between">
              <span className={`font-bold ${isItemAffordable(item.price) ? 'text-yellow-300' : 'text-red-300'}`}>
                {item.price} pts
              </span>
              <button
                onClick={() => onPurchase(item)}
                disabled={!isItemAffordable(item.price)}
                className={`px-3 py-1 rounded font-semibold text-sm transition-all ${
                  isItemAffordable(item.price)
                    ? 'bg-yellow-400 text-blue-900 hover:bg-yellow-300 cursor-pointer'
                    : 'bg-gray-500 text-gray-300 cursor-not-allowed'
                }`}
              >
                Buy
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <p className="text-white text-center py-8">No items in this category</p>
      )}
    </div>
  );
};

export default Shop;

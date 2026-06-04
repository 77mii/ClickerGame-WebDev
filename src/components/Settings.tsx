import React, { useState } from 'react';
import { AVAILABLE_IMAGES, AvailableImage } from '../utils/imageConfig';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  selectedImage: string;
  onImageSelect: (imageName: string) => Promise<void>;
}

const Settings: React.FC<SettingsProps> = ({ isOpen, onClose, selectedImage, onImageSelect }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleImageSelect = async (imageId: string) => {
    setLoading(true);
    try {
      await onImageSelect(imageId);
      setMessage('✅ Image changed successfully!');
      setTimeout(() => setMessage(''), 2000);
    } catch (error) {
      setMessage('❌ Failed to change image');
      setTimeout(() => setMessage(''), 2000);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gradient-to-b from-blue-900 to-blue-950 rounded-xl shadow-2xl max-w-2xl w-full mx-4 p-8 border-2 border-blue-700">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-white">⚙️ Settings</h2>
          <button
            onClick={onClose}
            className="text-2xl text-blue-300 hover:text-white transition"
          >
            ✕
          </button>
        </div>

        {/* Message */}
        {message && (
          <div className="mb-4 p-3 bg-blue-800 border-l-4 border-yellow-400 rounded text-white font-semibold">
            {message}
          </div>
        )}

        {/* Clicker Image Selection */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-white mb-4">🖼️ Choose Your Clicker Image</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {AVAILABLE_IMAGES.map((img) => (
              <button
                key={img.id}
                onClick={() => handleImageSelect(img.id)}
                disabled={loading}
                className={`p-4 rounded-lg transition-all transform hover:scale-105 ${
                  selectedImage === img.id
                    ? 'bg-yellow-500 shadow-lg shadow-yellow-400/50 border-2 border-yellow-300'
                    : 'bg-blue-800 border-2 border-blue-600 hover:border-yellow-400'
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="text-4xl mb-2">{img.emoji}</div>
                <p className="font-bold text-white text-sm">{img.name}</p>
                <p className="text-xs text-blue-200 mt-1">{img.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-2 px-4 bg-blue-700 text-white font-bold rounded-lg hover:bg-blue-600 transition"
        >
          Close Settings
        </button>
      </div>
    </div>
  );
};

export default Settings;

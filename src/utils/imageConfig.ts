import capybaraImage from '../assets/capybara.jpg';
import reactImage from '../assets/react.svg';

export interface AvailableImage {
  id: string;
  name: string;
  emoji: string;
  image: string;
  description: string;
}

export const AVAILABLE_IMAGES: AvailableImage[] = [
  {
    id: 'capybara',
    name: 'Capybara',
    emoji: '🦫',
    image: capybaraImage,
    description: 'The chill capybara - everyone\'s favorite rodent!'
  },
  {
    id: 'react',
    name: 'React Logo',
    emoji: '⚛️',
    image: reactImage,
    description: 'The React library logo - click for a component boost!'
  },
  {
    id: 'pizza',
    name: '🍕 Pizza',
    emoji: '🍕',
    image: '🍕',
    description: 'Delicious pizza - satisfying to click!'
  },
  {
    id: 'rocket',
    name: '🚀 Rocket',
    emoji: '🚀',
    image: '🚀',
    description: 'To the moon! High energy clicks!'
  },
  {
    id: 'star',
    name: '⭐ Star',
    emoji: '⭐',
    image: '⭐',
    description: 'Shine bright like a star!'
  },
  {
    id: 'diamond',
    name: '💎 Diamond',
    emoji: '💎',
    image: '💎',
    description: 'Rare and valuable - each click counts!'
  },
];

export const getImageById = (id: string): AvailableImage | undefined => {
  return AVAILABLE_IMAGES.find(img => img.id === id);
};

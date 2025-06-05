import React from 'react';

interface GameMenuProps {
  onSelectMode: (mode: 'classic' | 'tricky-tech' | 'ultimate') => void;
  onReplayIntro: () => void;
}

const GameMenu: React.FC<GameMenuProps> = ({ onSelectMode, onReplayIntro }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
      <div className="max-w-4xl w-full mx-4">
        <h1 className="text-5xl font-bold text-white text-center mb-8 drop-shadow-lg">
          Brain Battle
        </h1>
        <p className="text-xl text-white text-center mb-12">
          Choose your game mode and start your journey to better mental health!
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Classic Mode */}
          <div 
            className="bg-white rounded-lg shadow-xl overflow-hidden cursor-pointer transform transition-all hover:scale-105"
            onClick={() => onSelectMode('classic')}
          >
            <div className="h-48 bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
              <span className="text-6xl">🧠</span>
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Classic Brain Battle</h2>
              <p className="text-gray-600">
                The original game mode where Alternative Thoughts battle against Thinking Traps.
                Master the basics of cognitive behavioral concepts!
              </p>
              <button className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors">
                Play Classic
              </button>
            </div>
          </div>

          {/* Tricky Tech Mode */}
          <div
            className="bg-white rounded-lg shadow-xl overflow-hidden cursor-pointer transform transition-all hover:scale-105"
            onClick={() => onSelectMode('tricky-tech')}
          >
            <div className="h-48 bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
              <span className="text-6xl">📱</span>
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Tricky Tech</h2>
              <p className="text-gray-600">
                Battle the unique challenges of social media, screen time, and digital distractions.
                Master the art of healthy tech habits!
              </p>
              <button className="mt-4 w-full bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600 transition-colors">
                Play Tricky Tech
              </button>
            </div>
          </div>

          {/* Ultimate Mode */}
          <div 
            className="bg-white rounded-lg shadow-xl overflow-hidden cursor-not-allowed opacity-75"
          >
            <div className="h-48 bg-gradient-to-br from-yellow-400 to-red-500 flex items-center justify-center">
              <span className="text-6xl">⚡</span>
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Brain Battle Ultimate</h2>
              <p className="text-gray-600">
                The ultimate challenge with advanced cards, special powers, and intense battles.
                Coming soon!
              </p>
              <button className="mt-4 w-full bg-gray-400 text-white py-2 px-4 rounded cursor-not-allowed">
                Coming Soon
              </button>
            </div>
          </div>
        </div>

        {/* Footer with Debug Option */}
        <div className="text-center mt-12 text-white">
          <p className="text-sm opacity-75 mb-4">
            Created to help young minds understand and manage their thoughts better.
          </p>
          <button
            onClick={onReplayIntro}
            className="text-xs text-white opacity-50 hover:opacity-75 transition-opacity underline"
          >
            🎬 Replay Intro
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameMenu; 
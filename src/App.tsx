import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import GameBoard from './components/GameBoard';
import GameMenu from './components/GameMenu';
import TrickyTechBoard from './components/TrickyTechBoard';
import VideoIntro from './components/VideoIntro';


type GameMode = 'classic' | 'tricky-tech' | 'ultimate' | null;

const App: React.FC = () => {
  const [selectedMode, setSelectedMode] = useState<GameMode>(null);
  const [showIntro, setShowIntro] = useState(true);

  const handleSelectMode = (mode: 'classic' | 'tricky-tech' | 'ultimate') => {
    setSelectedMode(mode);
  };

  const handleBackToMenu = () => {
    setSelectedMode(null);
  };

  const handleIntroEnd = () => {
    setShowIntro(false);
  };

  const handleSkipIntro = () => {
    setShowIntro(false);
  };

  const handleReplayIntro = () => {
    setShowIntro(true);
  };

  // Show intro first
  if (showIntro) {
    return <VideoIntro onVideoEnd={handleIntroEnd} onSkip={handleSkipIntro} />;
  }



  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gray-100">
        {selectedMode === null ? (
          <GameMenu onSelectMode={handleSelectMode} onReplayIntro={handleReplayIntro} />
        ) : (
          <div>
            <div className="bg-white shadow-sm">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex justify-between items-center">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {selectedMode === 'classic' && 'Classic Brain Battle'}
                    {selectedMode === 'tricky-tech' && 'Tricky Tech'}
                    {selectedMode === 'ultimate' && 'Brain Battle Ultimate'}
                  </h1>
                  <button
                    onClick={handleBackToMenu}
                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                  >
                    Back to Menu
                  </button>
                </div>
              </div>
            </div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {selectedMode === 'classic' && <GameBoard />}
              {selectedMode === 'tricky-tech' && <TrickyTechBoard />}
              {selectedMode === 'ultimate' && (
                <div className="text-center py-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Coming Soon!</h2>
                  <p className="text-gray-600">
                    Brain Battle Ultimate is currently in development. Check back later for updates!
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DndProvider>
  );
};

export default App; 
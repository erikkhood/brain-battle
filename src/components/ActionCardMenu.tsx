import React from 'react';
import { ActionCard as TrickyTechActionCard, Team as TrickyTechTeam } from '../store/trickyTechSlice';

interface ActionCardMenuProps {
  actionCards: TrickyTechActionCard[];
  onPlayCard: (card: TrickyTechActionCard) => void;
  onClose: () => void;
  currentTeam: TrickyTechTeam;
}

const ActionCardMenu: React.FC<ActionCardMenuProps> = ({
  actionCards,
  onPlayCard,
  onClose,
  currentTeam
}) => {
  const filteredCards = actionCards.filter(card => card.team === currentTeam);

  const getTeamEmoji = (team: TrickyTechTeam) => {
    if (team === 'design-tricks') return '🌪️';
    if (team === 'healthy-habits') return '🌟';
    return '✨';
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-6 max-h-[85vh] max-w-4xl mx-auto overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-purple-900">Action Cards</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-2xl font-bold p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          ✕
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4 justify-center">
        {filteredCards.map((card) => (
          <div
            key={card.id}
            className="w-48 mx-auto cursor-pointer transition-all duration-200 hover:shadow-xl transform hover:scale-105"
            onClick={() => {
              onPlayCard(card);
              onClose();
            }}
          >
            {/* Card Image with same aspect ratio as regular cards */}
            <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden shadow-md border-2 border-purple-200 hover:border-purple-400 bg-white">
              <img
                src={card.image}
                alt={card.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 bg-white bg-opacity-90 rounded-full p-1 shadow-sm">
                <span className="text-lg">{getTeamEmoji(card.team)}</span>
              </div>
            </div>
            
            {/* Card Info - Similar to regular cards */}
            <div className="mt-2 space-y-1">
              <h3 className="font-semibold text-gray-800 text-sm">{card.name}</h3>
              <div className="text-xs text-gray-600">
                <span className={`${
                  card.team === 'design-tricks' ? 'text-red-600' : 'text-green-600'
                }`}>
                  {card.team === 'design-tricks' ? 'Design Trick' : 'Healthy Habit'}
                </span>
              </div>
              <p className="text-xs text-purple-800 font-medium">{card.effect}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActionCardMenu; 
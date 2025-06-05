import React from 'react';
import { ActionCard, Team } from '../store/gameSlice';

interface ClassicActionCardMenuProps {
  actionCards: ActionCard[];
  onPlayCard: (card: ActionCard) => void;
  onClose: () => void;
  currentTeam: Team;
}

const ClassicActionCardMenu: React.FC<ClassicActionCardMenuProps> = ({
  actionCards,
  onPlayCard,
  onClose,
  currentTeam
}) => {
  const filteredCards = actionCards.filter(card => card.team === currentTeam);

  const getTeamEmoji = (team: Team) => {
    if (team === 'thought-trappers') return '🌪️';
    if (team === 'thought-defenders') return '🌟';
    return '✨';
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-4 max-h-[80vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Action Cards</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>
      <div className="space-y-4">
        {filteredCards.map((card) => (
          <div
            key={card.id}
            className="bg-purple-50 rounded-lg p-4 cursor-pointer hover:bg-purple-100 transition-colors"
            onClick={() => {
              onPlayCard(card);
              onClose();
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{getTeamEmoji(card.team)}</span>
              <h3 className="font-bold text-purple-900">{card.name}</h3>
            </div>
            <p className="text-sm text-purple-800 mb-2">{card.effect}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClassicActionCardMenu; 
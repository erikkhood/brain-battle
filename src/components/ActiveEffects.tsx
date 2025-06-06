import React from 'react';

interface ActiveEffect {
  type: string;
  turnsRemaining: number;
  sourceCard: string;
  description: string;
  effects: {
    designTrickHpBoost?: number;
    designTrickDamageMultiplier?: number;
    healthyHabitHpReduction?: number;
    healthyHabitHealingReduction?: number;
    healthyHabitHpBoost?: number;
    healthyHabitHealingMultiplier?: number;
    brainHealthChange?: number;
    blockCard?: boolean;
    removeDesignTrick?: boolean;
    designTrickHpReduction?: number;
  };
}

interface ActiveEffectsProps {
  effects: ActiveEffect[];
}



const ActiveEffects: React.FC<ActiveEffectsProps> = ({ effects }) => {
  if (effects.length === 0) {
    return null;
  }

  return (
    <div className="bg-purple-50 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-purple-800 mb-3">Active Effects</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {effects.map((effect, index) => (
          <div
            key={index}
            className="bg-white rounded-lg p-3 shadow-sm border border-purple-100"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">
                {effect.type.includes('design-trick') ? '🌪️' : '🌟'}
              </span>
              <h4 className="font-medium text-purple-900">
                {effect.type.split('-').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')}
              </h4>
            </div>
            <p className="text-sm text-gray-600">{effect.description}</p>
            <div className="mt-2 text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded inline-block">
              {effect.turnsRemaining} {effect.turnsRemaining === 1 ? 'turn' : 'turns'} remaining
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActiveEffects; 
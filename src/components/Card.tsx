import React, { useState } from 'react'
import { useDrag } from 'react-dnd'
import type { Card as TrickyTechCard } from '../store/trickyTechSlice'
import type { Card as ClassicCard } from '../store/gameSlice'
import TrickyTechPlaceholder from './TrickyTechPlaceholder'
import { soundManager } from '../utils/soundManager'

// Type guard to check if a card is a TrickyTech card
const isTrickyTechCard = (card: TrickyTechCard | ClassicCard): card is TrickyTechCard => {
  return 'description' in card;
};

interface CardProps {
  card: TrickyTechCard | ClassicCard
  isDraggable?: boolean
  isInBattle?: boolean
  isTargetable?: boolean
  isFirstTurn?: boolean
  onConfirmAttack?: (attackNumber: number, target: 'brain-health' | 'card') => void
  // For classic mode only
  onSelectTarget?: (card: ClassicCard) => void
  onClick?: () => void

  size?: 'normal' | 'small'
  isInGraveyard?: boolean
}

const CardComponent: React.FC<CardProps> = ({ 
  card, 
  isDraggable = false, 
  isInBattle = false,
  isTargetable = false,
  isFirstTurn = false,
  onConfirmAttack,
  onSelectTarget,
  onClick,
  size = 'normal',
  isInGraveyard = false
}) => {
  const [isFlipped] = useState(card.isFlipped || false);
  const [showTargetSelection, setShowTargetSelection] = useState(false);
  const [selectedAttack, setSelectedAttack] = useState<number | null>(null);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: card.type,
    item: () => {
      // Play sound when drag starts
      soundManager.play('cardMove');
      return {
        ...card,
        isInBattle: isInBattle,
        isFirstTurn: isFirstTurn
      };
    },
    canDrag: () => {
      if (!isDraggable) return false;
      if (isInBattle) return false;
      return true;
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [card, isDraggable, isInBattle, isFirstTurn]);

  const handleClick = () => {
    console.log('Card clicked:', card.name, 'isTargetable:', isTargetable, 'onSelectTarget exists:', !!onSelectTarget);
    
    if (isTargetable && onSelectTarget) {
      console.log('Calling onSelectTarget for card:', card.name);
      // Call onSelectTarget for both classic and tricky tech cards
      if (isTrickyTechCard(card)) {
        // For TrickyTech cards, we need to cast properly
        console.log('TrickyTech card - calling onSelectTarget');
        onSelectTarget(card as any);
      } else {
        // For classic cards
        console.log('Classic card - calling onSelectTarget');
        onSelectTarget(card as ClassicCard);
      }
    } else if (onClick) {
      console.log('Calling onClick');
      onClick();
    } else {
      console.log('No action taken for card click');
    }
  };

  const handleAttackSelect = (attackNumber: number) => {
    setSelectedAttack(attackNumber);
    setShowTargetSelection(true);
  };

  const handleTargetSelect = (target: 'brain-health' | 'card') => {
    setShowTargetSelection(false);
    if (onConfirmAttack && selectedAttack) {
      onConfirmAttack(selectedAttack, target);
    }
    setSelectedAttack(null);
  };

  const handleCancelAttack = () => {
    setSelectedAttack(null);
    setShowTargetSelection(false);
  };

  const getAttackUsesRemaining = (attackNumber: number) => {
    const usage = attackNumber === 1 ? card.attackUsage.attack1 : card.attackUsage.attack2;
    return Math.max(0, 2 - usage);
  };

  const isAttackDisabled = (attackNumber: number) => {
    return getAttackUsesRemaining(attackNumber) === 0;
  };

  const cardClasses = `
    relative 
    ${size === 'normal' ? 'w-64' : 'w-48'} 
    ${isDragging ? 'opacity-50' : 'opacity-100'}
    ${isTargetable ? 'cursor-pointer ring-2 ring-yellow-400 animate-pulse' : ''}
    ${isInGraveyard ? 'opacity-50 grayscale' : ''}
    ${isDraggable && !isInBattle ? 'cursor-grab hover:shadow-lg' : ''}
    ${isDragging ? 'transform scale-105 z-50' : ''}
    transition-all
    duration-300
  `;

  const getCardTypeStyle = () => {
    if (isTrickyTechCard(card)) {
      return card.type === 'design-trick' ? 'text-red-600' : 'text-green-600';
    } else {
      return card.type === 'thinking-trap' ? 'text-red-600' : 'text-green-600';
    }
  };

  const getCardTypeName = () => {
    if (isTrickyTechCard(card)) {
      return card.type === 'design-trick' ? 'Design Trick' : 'Healthy Habit';
    } else {
      return card.type === 'thinking-trap' ? 'Thinking Trap' : 'Alternative Thought';
    }
  };

  return (
    <div
      ref={isDraggable ? drag : undefined}
      className={cardClasses}
      onClick={handleClick}
    >
      <div className={`relative w-full aspect-[3/4] rounded-lg overflow-hidden shadow-md ${
        isFlipped ? 'rotate-y-180' : ''
      }`}>
        {/* Front of card */}
        <div className="absolute inset-0 w-full h-full">
          {card.frontImage ? (
            <img
              src={card.frontImage}
              alt={card.name}
              className="w-full h-full object-cover"
              onError={() => {
                // If image fails to load, use placeholder
                return <TrickyTechPlaceholder type={card.type} name={card.name} />;
              }}
            />
          ) : (
            <TrickyTechPlaceholder type={card.type} name={card.name} />
          )}
        </div>

        {/* Back of card */}
        <div className={`absolute inset-0 w-full h-full backface-hidden ${
          isFlipped ? 'visible' : 'invisible'
        }`}>
          {card.backImage ? (
            <img
              src={card.backImage}
              alt="Card Back"
              className="w-full h-full object-cover"
              onError={() => {
                return <TrickyTechPlaceholder type="card-back" name="" />;
              }}
            />
          ) : (
            <TrickyTechPlaceholder type="card-back" name="" />
          )}
        </div>

        {/* HP Circle - Show when in battle */}
        {(isInBattle || (card.attackUsage.attack1 > 0 || card.attackUsage.attack2 > 0)) && (
          <div className={`absolute top-2 right-2 w-12 h-12 rounded-full border-2 flex items-center justify-center shadow-lg transition-all duration-300 ${
            card.hp <= 20 ? 'bg-red-100 border-red-400' :
            card.hp <= 50 ? 'bg-yellow-100 border-yellow-400' :
            'bg-green-100 border-green-400'
          }`}>
            <div className="text-center">
              <div className={`text-xs font-bold leading-none ${
                card.hp <= 20 ? 'text-red-700' :
                card.hp <= 50 ? 'text-yellow-700' :
                'text-green-700'
              }`}>{card.hp}</div>
              <div className={`text-xs leading-none ${
                card.hp <= 20 ? 'text-red-600' :
                card.hp <= 50 ? 'text-yellow-600' :
                'text-green-600'
              }`}>HP</div>
            </div>
          </div>
        )}
      </div>

      {/* Card Info */}
      <div className="mt-2 space-y-2">
        {/* Show card info only when NOT in battle */}
        {!isInBattle && (
          <>
            <h3 className="font-semibold text-gray-800">{card.name}</h3>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">HP: {card.hp}</span>
              <span className={getCardTypeStyle()}>
                {getCardTypeName()}
              </span>
            </div>
            {isTrickyTechCard(card) && (
              <p className="text-xs text-gray-600">{card.description}</p>
            )}
          </>
        )}
        
        {/* Attack Options - Show when card is in battle */}
        {isInBattle && onConfirmAttack && !showTargetSelection && (
          <div className="space-y-2 mt-3 p-2 bg-gray-50 rounded">
            <div className="text-xs font-medium text-gray-700 text-center">Choose Attack:</div>
            
            {/* Show reset hint when one attack is exhausted */}
            {(getAttackUsesRemaining(1) === 0 && getAttackUsesRemaining(2) > 0) || 
             (getAttackUsesRemaining(2) === 0 && getAttackUsesRemaining(1) > 0) ? (
              <div className="text-xs text-purple-600 text-center mb-2 font-medium">
                💡 Use both attacks to reset uses!
              </div>
            ) : null}
            
            {/* Show reset notification when both attacks are exhausted */}
            {getAttackUsesRemaining(1) === 0 && getAttackUsesRemaining(2) === 0 && (
              <div className="text-xs text-green-600 text-center mb-2 font-medium animate-pulse">
                ✨ Attacks reset! Both available again.
              </div>
            )}
            
            <button
              className={`w-full p-2 rounded text-left text-sm transition-colors ${
                isAttackDisabled(1) 
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                  : 'bg-blue-100 hover:bg-blue-200 text-blue-800'
              }`}
              onClick={() => handleAttackSelect(1)}
              disabled={isAttackDisabled(1)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1 pr-2">
                  <div className="font-medium">{card.attack1.name}</div>
                  <div className="text-xs">{card.attack1.damage} damage</div>
                  <div className="text-xs mt-1 opacity-75 leading-tight">
                    {card.attack1.description}
                  </div>
                </div>
                <div className={`text-xs font-bold flex-shrink-0 ${isAttackDisabled(1) ? 'text-red-500' : 'text-green-600'}`}>
                  {getAttackUsesRemaining(1)}/2
                </div>
              </div>
            </button>
            
            <button
              className={`w-full p-2 rounded text-left text-sm transition-colors ${
                isAttackDisabled(2) 
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                  : 'bg-blue-100 hover:bg-blue-200 text-blue-800'
              }`}
              onClick={() => handleAttackSelect(2)}
              disabled={isAttackDisabled(2)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1 pr-2">
                  <div className="font-medium">{card.attack2.name}</div>
                  <div className="text-xs">{card.attack2.damage} damage</div>
                  <div className="text-xs mt-1 opacity-75 leading-tight">
                    {card.attack2.description}
                  </div>
                </div>
                <div className={`text-xs font-bold flex-shrink-0 ${isAttackDisabled(2) ? 'text-red-500' : 'text-green-600'}`}>
                  {getAttackUsesRemaining(2)}/2
                </div>
              </div>
            </button>
          </div>
        )}
        
        {/* Target Selection - Show when attack is selected */}
        {showTargetSelection && selectedAttack && (
          <div className="space-y-2 mt-3 p-2 bg-yellow-50 rounded border-2 border-yellow-300">
            <div className="text-xs font-medium text-yellow-800 text-center">
              Using: {selectedAttack === 1 ? card.attack1.name : card.attack2.name}
            </div>
            <div className="text-xs text-yellow-700 text-center mb-2">Choose Target:</div>
            
            <button
              className="w-full p-2 bg-green-100 hover:bg-green-200 text-green-800 rounded text-sm transition-colors"
              onClick={() => handleTargetSelect('brain-health')}
            >
              <div className="flex items-center justify-center gap-2">
                <span>🧠</span>
                <span>Brain Health</span>
              </div>
            </button>
            
            {!isFirstTurn && (
              <button
                className="w-full p-2 bg-orange-100 hover:bg-orange-200 text-orange-800 rounded text-sm transition-colors"
                onClick={() => handleTargetSelect('card')}
              >
                <div className="flex items-center justify-center gap-2">
                  <span>🎯</span>
                  <span>Opponent Card</span>
                </div>
              </button>
            )}
            
            <button
              className="w-full p-1 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded text-xs transition-colors"
              onClick={handleCancelAttack}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardComponent; 
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useDrop } from 'react-dnd'
import { RootState } from '../store'
import { Card, ActionCard, playCard, playActionCard, updateTimer, resetGame, processTurnEffects, forceClearBattleArena } from '../store/gameSlice'
import CardComponent from './Card'
import ClassicActionCardMenu from './ClassicActionCardMenu'

// ErrorBoundary component for debugging
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: any }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  componentDidCatch() {
    // You can log errorInfo here if needed
    // console.error(error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ color: 'red', padding: 20 }}>
          <h2>Something went wrong in GameBoard:</h2>
          <pre>{this.state.error && this.state.error.toString()}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

const GameBoard: React.FC = () => {
  const dispatch = useDispatch()
  const { 
    brainHealth, 
    currentTeam, 
    timeRemaining,
    actionCards,
    trapperCards,
    defenderCards,
    playedCards,
    graveyardCards,
    isFirstTurn,
    activeEffects
  } = useSelector((state: RootState) => state.game)

  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [isTargeting, setIsTargeting] = useState(false);
  const [targetingInfo, setTargetingInfo] = useState<{
    attackNumber: number;
    sourceCard: Card;
  } | null>(null);
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [lastPlayedAction, setLastPlayedAction] = useState<ActionCard | null>(null);

  // Start timer
  useEffect(() => {
    const timer = setInterval(() => {
      dispatch(updateTimer())
    }, 1000)
    return () => clearInterval(timer)
  }, [dispatch])

  // Listen for targeting events
  useEffect(() => {
    const handleStartTargeting = (event: CustomEvent) => {
      setIsTargeting(true);
      setTargetingInfo(event.detail);
    };

    document.addEventListener('start-targeting', handleStartTargeting as EventListener);

    return () => {
      document.removeEventListener('start-targeting', handleStartTargeting as EventListener);
    };
  }, []);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: ['thinking-trap', 'alternative-thought'],
    drop: (item: Card) => {
      // Don't allow dropping if action menu is open
      if (showActionMenu) return;

      // Only set the selected card if it's the correct team's turn
      if ((item.type === 'thinking-trap' && currentTeam === 'thought-trappers') ||
          (item.type === 'alternative-thought' && currentTeam === 'thought-defenders')) {
        console.log('Card dropped in GameBoard:', item.name); // Debug log
        // Place card in battle arena for attack selection
        setSelectedCard(item);
      }
    },
    canDrop: (item: Card) => {
      // Don't allow dropping if action menu is open
      if (showActionMenu) return false;

      // Allow dropping if it's the correct team's turn
      return (item.type === 'thinking-trap' && currentTeam === 'thought-trappers') ||
             (item.type === 'alternative-thought' && currentTeam === 'thought-defenders');
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver() && monitor.canDrop(),
    }),
  }), [currentTeam, showActionMenu, dispatch]);

  const handleConfirmAttack = (attackNumber: number, target: 'brain-health' | 'card') => {
    if (target === 'card') {
      // Enter targeting mode
      setIsTargeting(true);
      setTargetingInfo({
        attackNumber,
        sourceCard: selectedCard!
      });
    } else {
      // Direct brain health attack/heal
      dispatch(playCard({
        card: selectedCard!,
        selectedAttack: attackNumber,
        target: 'brain-health'
      }));
      setSelectedCard(null);
    }
  };

  const handleSelectTarget = (targetCard: Card) => {
    if (isTargeting && targetingInfo) {
      dispatch(playCard({
        card: targetingInfo.sourceCard,
        selectedAttack: targetingInfo.attackNumber,
        target: 'card',
        targetCardId: targetCard.id,
        removeFromPlay: true
      }));

      // Reset targeting state
      setIsTargeting(false);
      setTargetingInfo(null);
      setSelectedCard(null);

      // Add visual feedback for the attack
      const attackEffect = document.createElement('div');
      attackEffect.className = 'attack-effect';
      document.body.appendChild(attackEffect);
      
      // Remove the effect after animation
      setTimeout(() => {
        document.body.removeChild(attackEffect);
      }, 1000);
    }
  };

  // Add CSS for the attack effect
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .attack-effect {
        position: fixed;
        pointer-events: none;
        width: 50px;
        height: 50px;
        background: radial-gradient(circle, #ff9900, transparent);
        border-radius: 50%;
        animation: explode 0.5s ease-out forwards;
        z-index: 1000;
      }

      @keyframes explode {
        0% {
          transform: scale(0);
          opacity: 1;
        }
        100% {
          transform: scale(4);
          opacity: 0;
        }
      }

      .targeting-active {
        cursor: crosshair !important;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Add targeting cursor to body when in targeting mode
  useEffect(() => {
    if (isTargeting) {
      document.body.classList.add('targeting-active');
    } else {
      document.body.classList.remove('targeting-active');
    }
    return () => {
      document.body.classList.remove('targeting-active');
    };
  }, [isTargeting]);

  const handleResetGame = () => {
    // Clear all local states
    setSelectedCard(null);
    setIsTargeting(false);
    setTargetingInfo(null);
    setShowActionMenu(false);
    setLastPlayedAction(null);
    
    // Reset game state
    dispatch(resetGame());
  }

  const handlePlayActionCard = (actionCard: ActionCard) => {
    dispatch(playActionCard(actionCard));
    setLastPlayedAction(actionCard);
    setShowActionMenu(false);
    setSelectedCard(null); // Clear any selected card
  };

  // Add effect to process turn effects when teams switch
  useEffect(() => {
    if (!isFirstTurn) {
      dispatch(processTurnEffects());
    }
  }, [currentTeam, dispatch, isFirstTurn]);

  const getBrainHealthColor = () => {
    if (brainHealth > 30) return 'bg-green-500'
    if (brainHealth > -30) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }
  const thinkingTraps = playedCards.filter(card => card.type === 'thinking-trap')
  const alternativeThoughts = playedCards.filter(card => card.type === 'alternative-thought')

  const isOpponentCard = (card: Card) => {
    return (currentTeam === 'thought-trappers' && card.type === 'alternative-thought') ||
           (currentTeam === 'thought-defenders' && card.type === 'thinking-trap');
  };

  const checkGameOver = () => {
    if (brainHealth <= -100) return 'Thought Trappers Win!'
    if (brainHealth >= 100) return 'Thought Defenders Win!'
    if (timeRemaining <= 0) {
      if (currentTeam === 'thought-trappers') {
        return brainHealth < 0 ? 'Thought Trappers Win!' : 'Thought Defenders Win!'
      } else {
        return brainHealth > 0 ? 'Thought Defenders Win!' : 'Thought Trappers Win!'
      }
    }
    if (trapperCards.length === 0 && thinkingTraps.length === 0) return 'Thought Defenders Win!'
    if (defenderCards.length === 0 && alternativeThoughts.length === 0) return 'Thought Trappers Win!'
    return null
  }

  const gameOver = checkGameOver()

  const isCardInPlay = (cardId: string) => {
    return playedCards.some(card => card.id === cardId);
  };

  const canDragCard = (card: Card) => {
    const isCorrectTeam = (card.type === 'thinking-trap' && currentTeam === 'thought-trappers') ||
                         (card.type === 'alternative-thought' && currentTeam === 'thought-defenders');
    const notInPlay = !isCardInPlay(card.id);
    return isCorrectTeam && notInPlay;
  };

  // Add effect to clear last played action after a delay
  useEffect(() => {
    if (lastPlayedAction) {
      const timer = setTimeout(() => {
        setLastPlayedAction(null);
      }, 3000); // Clear after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [lastPlayedAction]);

  // Add type guard for Card
  const isClassicCard = (item: any): item is Card => {
    return (
      typeof item === 'object' &&
      'type' in item &&
      (item.type === 'thinking-trap' || item.type === 'alternative-thought')
    );
  };

  // Clear last played action when its effects expire
  useEffect(() => {
    if (lastPlayedAction && !activeEffects.activeCardEffects.some(effect => effect.sourceCard === lastPlayedAction.id)) {
      setLastPlayedAction(null);
    }
  }, [activeEffects.activeCardEffects, lastPlayedAction]);

  const handleShowActionMenu = () => {
    // Force clear the battle arena before showing action cards
    dispatch(forceClearBattleArena());
    // Clear any selected card
    setSelectedCard(null);
    setShowActionMenu(true);
  };

  const handleCloseActionMenu = () => {
    setShowActionMenu(false);
  };

  return (
    <ErrorBoundary>
      <div className="space-y-8">
        {/* Header with Game Info */}
        <div className="flex flex-col gap-4">
          {/* Timer and Reset Row */}
          <div className="flex justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="text-lg font-semibold">
                Time: <span className="font-mono">{formatTime(timeRemaining)}</span>
              </div>
              {/* Active Effects Display */}
              {(activeEffects.doubleDamage || activeEffects.shield || activeEffects.activeCardEffects.length > 0 || lastPlayedAction) && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-purple-600">Active Effects:</span>
                  {activeEffects.doubleDamage && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-sm">
                      Double Damage
                    </span>
                  )}
                  {activeEffects.shield && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                      Shield Active
                    </span>
                  )}
                  {activeEffects.activeCardEffects.map((effect, index) => (
                    <span key={index} className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                      {effect.description} ({effect.turnsRemaining} turns)
                    </span>
                  ))}
                  {lastPlayedAction && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-sm animate-pulse">
                      {lastPlayedAction.name} Activated!
                    </span>
                  )}
                </div>
              )}
            </div>
            <button
              onClick={handleResetGame}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              Reset Game
            </button>
          </div>

          {/* Brain Health Bar */}
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold">Brain Health:</h2>
            <div className="brain-health-bar flex-grow">
              <div
                className={`brain-health-progress ${getBrainHealthColor()}`}
                style={{ width: `${((brainHealth + 100) / 200) * 100}%` }}
              />
            </div>
            <span className="font-mono">{brainHealth}</span>
          </div>
        </div>

        {/* Current Team Display */}
        <div className={`text-center text-2xl font-bold p-6 rounded-lg shadow-lg ${
          currentTeam === 'thought-trappers' 
            ? 'bg-red-100 text-red-800 border-2 border-red-500' 
            : 'bg-green-100 text-green-800 border-2 border-green-500'
        }`}>
          Current Team: {currentTeam === 'thought-trappers' ? 'Thought Trappers' : 'Thought Defenders'}
        </div>

        {/* Game Over Message */}
        {gameOver && (
          <div className="text-center text-2xl font-bold p-6 bg-yellow-100 text-yellow-800 rounded-lg">
            {gameOver}
          </div>
        )}

        {/* Battle Area */}
        <div className="flex gap-4">
          {/* Thinking Traps Active Play Area */}
          <div className="w-1/4 space-y-4">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-red-600">Thinking Traps</h2>
              <p className="text-sm text-gray-600 mt-1">
                Active Play
                {trapperCards.filter(card => card.attackUsage && (card.attackUsage.attack1 > 0 || card.attackUsage.attack2 > 0)).length > 0 && (
                  <span className="ml-1">
                    ({trapperCards.filter(card => card.attackUsage && (card.attackUsage.attack1 > 0 || card.attackUsage.attack2 > 0)).length})
                  </span>
                )}
              </p>
            </div>
            <div className={`space-y-4 p-4 rounded-lg min-h-[200px] ${currentTeam === 'thought-trappers' ? 'border-2 border-dashed border-red-300' : ''}`}>
              {trapperCards
                .filter(card => card.attackUsage && (card.attackUsage.attack1 > 0 || card.attackUsage.attack2 > 0))
                .map((card) => (
                  <CardComponent 
                    key={card.id}
                    card={card}
                    isDraggable={canDragCard(card)}
                    isTargetable={isTargeting && isOpponentCard(card)}
                    onConfirmAttack={handleConfirmAttack}
                    onSelectTarget={isClassicCard(card) ? handleSelectTarget : undefined}
                    isFirstTurn={isFirstTurn}
                    size="small"
                  />
                ))}
            </div>
          </div>

          {/* Battle Field */}
          <div className="w-1/2">
            <div
              ref={drop}
              className={`min-h-[300px] border-4 rounded-lg p-3 ${
                isOver ? 'border-blue-500 bg-blue-50' : 'border-dashed border-gray-300'
              } ${isTargeting ? 'bg-orange-50' : ''}`}
            >
              <h2 className="text-xl font-semibold mb-4 text-center">Battle Arena</h2>
              <p className={`text-center text-gray-600 mb-4 ${
                isTargeting ? 'text-orange-600 font-semibold animate-pulse' : ''
              }`}>
                {isTargeting 
                  ? '🎯 Select an opponent\'s card to attack' 
                  : selectedCard 
                    ? `${selectedCard.name} is ready! Select an attack below.`
                    : currentTeam === 'thought-trappers'
                      ? 'Drag a Thinking Trap to play'
                      : 'Drag an Alternative Thought to play'}
              </p>
              
              {/* Selected Card for Attack */}
              {selectedCard && !isTargeting && (
                <div className="mb-6 text-center">
                  <div className="inline-block p-4 bg-yellow-50 border-2 border-yellow-300 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2 text-yellow-800">Ready to Attack!</h3>
                    <CardComponent 
                      card={selectedCard} 
                      isDraggable={false}
                      isInBattle={true}
                      onConfirmAttack={handleConfirmAttack}
                      isFirstTurn={isFirstTurn}
                      size="normal"
                    />
                  </div>
                </div>
              )}
              
              {/* Played Cards */}
              <div className="flex flex-wrap gap-4 justify-center">
                {playedCards.map((card) => (
                  <CardComponent
                    key={card.id}
                    card={card}
                    isDraggable={false}
                    isInBattle={true}
                    isTargetable={isTargeting && isOpponentCard(card)}
                    onConfirmAttack={handleConfirmAttack}
                    onSelectTarget={isClassicCard(card) ? handleSelectTarget : undefined}
                    isFirstTurn={isFirstTurn}
                    size="normal"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Alternative Thoughts Active Play Area */}
          <div className="w-1/4 space-y-4">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-green-600">Alternative Thoughts</h2>
              <p className="text-sm text-gray-600 mt-1">
                Active Play
                {defenderCards.filter(card => card.attackUsage && (card.attackUsage.attack1 > 0 || card.attackUsage.attack2 > 0)).length > 0 && (
                  <span className="ml-1">
                    ({defenderCards.filter(card => card.attackUsage && (card.attackUsage.attack1 > 0 || card.attackUsage.attack2 > 0)).length})
                  </span>
                )}
              </p>
            </div>
            <div className={`space-y-4 p-4 rounded-lg min-h-[200px] ${currentTeam === 'thought-defenders' ? 'border-2 border-dashed border-green-300' : ''}`}>
              {defenderCards
                .filter(card => card.attackUsage && (card.attackUsage.attack1 > 0 || card.attackUsage.attack2 > 0))
                .map((card) => (
                  <CardComponent 
                    key={card.id}
                    card={card}
                    isDraggable={canDragCard(card)}
                    isTargetable={isTargeting && isOpponentCard(card)}
                    onConfirmAttack={handleConfirmAttack}
                    onSelectTarget={isClassicCard(card) ? handleSelectTarget : undefined}
                    isFirstTurn={isFirstTurn}
                    size="small"
                  />
                ))}
            </div>
          </div>
        </div>

        {/* Player's Hand - Fixed Height */}
        <div className="mt-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold">Your Hand (All Cards)</h2>
            {actionCards.length > 0 && (
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleShowActionMenu}
                  className="px-3 py-1.5 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors flex items-center gap-2 text-sm"
                >
                  <span>View Action Cards</span>
                  <span className="bg-purple-500 px-1.5 py-0.5 rounded-full text-xs">
                    {actionCards.length}
                  </span>
                </button>
              </div>
            )}
          </div>

          <div className={`max-h-48 overflow-y-auto flex flex-wrap justify-center gap-4 p-3 rounded-lg border-2 ${
            currentTeam === 'thought-trappers' ? 'border-dashed border-red-300' : 'border-dashed border-green-300'
          }`}>
            {/* Thinking Traps Cards */}
            {trapperCards.map((card) => {
              const inPlay = isCardInPlay(card.id);
              const inActivePlay = card.attackUsage.attack1 > 0 || card.attackUsage.attack2 > 0;
              const isSelected = selectedCard && selectedCard.id === card.id;
              const isUnavailable = inPlay || inActivePlay || isSelected;
              
              return (
                <div key={card.id} className={isUnavailable ? 'opacity-50 grayscale pointer-events-none' : ''}>
                  <CardComponent 
                    key={card.id} 
                    card={card} 
                    isDraggable={!isUnavailable}
                    isInBattle={false}
                    isFirstTurn={isFirstTurn}
                    size="small"
                  />
                </div>
              );
            })}
            
            {/* Alternative Thoughts Cards */}
            {defenderCards.map((card) => {
              const inPlay = isCardInPlay(card.id);
              const inActivePlay = card.attackUsage.attack1 > 0 || card.attackUsage.attack2 > 0;
              const isSelected = selectedCard && selectedCard.id === card.id;
              const isUnavailable = inPlay || inActivePlay || isSelected;
              
              return (
                <div key={card.id} className={isUnavailable ? 'opacity-50 grayscale pointer-events-none' : ''}>
                  <CardComponent 
                    key={card.id} 
                    card={card} 
                    isDraggable={!isUnavailable}
                    isInBattle={false}
                    isFirstTurn={isFirstTurn}
                    size="small"
                  />
                </div>
              );
            })}
          </div>
          
          {/* Drag Hint */}
          <div className="text-center mt-2">
            <p className="text-xs text-gray-500">
              💡 Drag cards from here to the Battle Arena • Scroll to see more cards
            </p>
          </div>
        </div>

        {/* Action Card Menu */}
        {showActionMenu && (
          <div className="fixed bottom-5 right-5 max-w-[400px] z-50">
            <ClassicActionCardMenu
              actionCards={actionCards}
              onPlayCard={handlePlayActionCard}
              onClose={handleCloseActionMenu}
              currentTeam={currentTeam}
            />
          </div>
        )}

        {/* Last Played Action Card Effect */}
        {lastPlayedAction && !showActionMenu && (
          <div className="fixed bottom-5 right-5 bg-purple-900 bg-opacity-90 text-white p-4 rounded-lg shadow-lg max-w-[300px] z-50">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{lastPlayedAction.team === 'thought-trappers' ? '🌪️' : '🌟'}</span>
              <h3 className="font-bold">{lastPlayedAction.name}</h3>
            </div>
            <p className="text-sm opacity-90 mb-2">{lastPlayedAction.effect}</p>
            {activeEffects.activeCardEffects.find(effect => effect.sourceCard === lastPlayedAction.id) && (
              <div className="text-xs bg-purple-800 px-2 py-1 rounded">
                {activeEffects.activeCardEffects.find(effect => effect.sourceCard === lastPlayedAction.id)?.description}
              </div>
            )}
          </div>
        )}

        {/* Graveyard */}
        {graveyardCards.length > 0 && (
          <div className="mt-8 p-6 bg-gray-800 rounded-lg text-white">
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold">Graveyard</h2>
              <p className="text-gray-400 mt-1">Defeated Cards ({graveyardCards.length})</p>
            </div>
            <div className="flex flex-wrap gap-4 justify-center">
              {graveyardCards.map((card) => (
                <div key={card.id} className="relative">
                  {isClassicCard(card) ? (
                    <>
                      <CardComponent 
                        card={card}
                        isDraggable={false}
                        isInBattle={false}
                        isFirstTurn={isFirstTurn}
                        size="small"
                        isInGraveyard={true}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-70 rounded-lg flex items-center justify-center">
                        <span className="text-white text-4xl">💀</span>
                      </div>
                    </>
                  ) : (
                    <div className={`w-[150px] h-[210px] rounded-lg overflow-hidden ${
                      card.team === 'thought-trappers' 
                        ? 'bg-gradient-to-br from-red-800 to-red-900' 
                        : 'bg-gradient-to-br from-green-800 to-green-900'
                    }`}>
                      <img
                        src={card.image}
                        alt={card.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.parentElement?.classList.add('flex', 'items-center', 'justify-center');
                          const span = document.createElement('span');
                          span.textContent = card.team === 'thought-trappers' ? '🌪️' : '🌟';
                          span.className = 'text-4xl';
                          target.parentElement?.appendChild(span);
                        }}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end justify-center p-2">
                        <h3 className="font-semibold text-sm text-white text-center">{card.name}</h3>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  )
}

export default GameBoard
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useDrop } from 'react-dnd'
import { RootState } from '../store'
import { Card, ActionCard, playCard, playActionCard, updateTimer, resetGame, processTurnEffects, forceClearBattleArena } from '../store/trickyTechSlice'
import CardComponent from './Card'
import ActionCardMenu from './ActionCardMenu'
import ActiveEffects from './ActiveEffects'
import { soundManager } from '../utils/soundManager'

const TrickyTechBoard: React.FC = () => {
  const dispatch = useDispatch()
  const { 
    brainHealth, 
    currentTeam, 
    timeRemaining,
    actionCards,
    designTrickCards,
    healthyHabitCards,
    playedCards,
    isFirstTurn,
    activeEffects
  } = useSelector((state: RootState) => state.trickyTech)

  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [isTargeting, setIsTargeting] = useState(false);
  const [targetingInfo, setTargetingInfo] = useState<{
    attackNumber: number;
    sourceCard: Card;
  } | null>(null);
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [lastPlayedAction, setLastPlayedAction] = useState<ActionCard | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(soundManager.isEnabled());

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
    accept: ['design-trick', 'healthy-habit'],
    drop: (item: Card) => {
      // Don't allow dropping if action menu is open
      if (showActionMenu) return;

      // Only set the selected card if it's the correct team's turn
      if ((item.type === 'design-trick' && currentTeam === 'design-tricks') ||
          (item.type === 'healthy-habit' && currentTeam === 'healthy-habits')) {
        console.log('Card dropped:', item.name); // Debug log
        setSelectedCard(item);
      }
    },
    canDrop: (item: Card) => {
      // Don't allow dropping if action menu is open
      if (showActionMenu) return false;

      // Allow dropping if it's the correct team's turn
      return (item.type === 'design-trick' && currentTeam === 'design-tricks') ||
             (item.type === 'healthy-habit' && currentTeam === 'healthy-habits');
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver() && monitor.canDrop(),
    }),
  }), [currentTeam, showActionMenu, dispatch])

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
    console.log('TrickyTech handleSelectTarget called with:', targetCard);
    console.log('isTargeting:', isTargeting);
    console.log('targetingInfo:', targetingInfo);
    
    if (isTargeting && targetingInfo) {
      console.log('Dispatching attack:', {
        card: targetingInfo.sourceCard,
        selectedAttack: targetingInfo.attackNumber,
        target: 'card',
        targetCardId: targetCard.id,
        removeFromPlay: true
      });
      
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
    } else {
      console.log('Not dispatching attack - missing conditions');
    }
  };

  // Wrapper function to handle type compatibility
  const handleSelectTargetWrapper = (targetCard: any) => {
    handleSelectTarget(targetCard as Card);
  };

  const handleResetGame = () => {
    setSelectedCard(null);
    setIsTargeting(false);
    setTargetingInfo(null);
    setShowActionMenu(false);
    setLastPlayedAction(null);
    dispatch(resetGame());
  };

  const handlePlayActionCard = (actionCard: ActionCard) => {
    dispatch(playActionCard(actionCard));
    setLastPlayedAction(actionCard);
    setShowActionMenu(false);
    setSelectedCard(null); // Clear any selected card
    dispatch(processTurnEffects());
  };

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

  const handleToggleSound = () => {
    const newSoundEnabled = !soundEnabled;
    setSoundEnabled(newSoundEnabled);
    soundManager.setEnabled(newSoundEnabled);
  };

  // Add effect to process turn effects when teams switch
  useEffect(() => {
    if (!isFirstTurn) {
      dispatch(processTurnEffects());
    }
  }, [currentTeam, dispatch, isFirstTurn]);

  // Clear lastPlayedAction when no active effects remain
  useEffect(() => {
    if (lastPlayedAction && activeEffects.activeCardEffects.length === 0 && !activeEffects.doubleDamage) {
      setLastPlayedAction(null);
    }
  }, [activeEffects, lastPlayedAction]);

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

  const isOpponentCard = (card: Card) => {
    if (currentTeam === 'design-tricks') {
      return card.type === 'healthy-habit';
    } else {
      return card.type === 'design-trick';
    }
  };

  const canDragCard = (card: Card) => {
    // Can't drag if it's not your team's card
    if (currentTeam === 'design-tricks' && card.type !== 'design-trick') return false;
    if (currentTeam === 'healthy-habits' && card.type !== 'healthy-habit') return false;
    
    // Can't drag if already in play
    if (card.attackUsage && (card.attackUsage.attack1 > 0 || card.attackUsage.attack2 > 0)) return false;
    
    // Can't drag if action menu is open
    if (showActionMenu) return false;
    
    // Can't drag if card is selected for battle
    if (selectedCard && selectedCard.id === card.id) return false;
    
    return true;
  };

  return (
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
            {(activeEffects.doubleDamage || lastPlayedAction) && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-purple-600">Active Effects:</span>
                {activeEffects.doubleDamage && (
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-sm">
                    Double Damage
                  </span>
                )}
                {lastPlayedAction && (
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-sm animate-pulse">
                    {lastPlayedAction.name} Activated!
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleToggleSound}
              className={`px-4 py-2 rounded transition-colors ${
                soundEnabled 
                  ? 'bg-green-600 text-white hover:bg-green-700' 
                  : 'bg-gray-400 text-white hover:bg-gray-500'
              }`}
              title={soundEnabled ? 'Sound On' : 'Sound Off'}
            >
              {soundEnabled ? '🔊' : '🔇'}
            </button>
            <button
              onClick={handleResetGame}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              Reset Game
            </button>
          </div>
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
        currentTeam === 'design-tricks' 
          ? 'bg-red-100 text-red-800 border-2 border-red-500' 
          : 'bg-green-100 text-green-800 border-2 border-green-500'
      }`}>
        Current Team: {currentTeam === 'design-tricks' ? 'Design Tricks' : 'Healthy Habits'}
      </div>

      {/* Battle Area */}
      <div className="flex gap-4">
            {/* Design Tricks Active Play Area */}
            <div className="w-1/4 space-y-4">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-red-600">Design Tricks</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Active Play
                  {designTrickCards.filter(card => card.attackUsage && (card.attackUsage.attack1 > 0 || card.attackUsage.attack2 > 0)).length > 0 && (
                    <span className="ml-1">
                      ({designTrickCards.filter(card => card.attackUsage && (card.attackUsage.attack1 > 0 || card.attackUsage.attack2 > 0)).length})
                    </span>
                  )}
                </p>
              </div>
              <div className={`space-y-4 p-4 rounded-lg min-h-[200px] ${currentTeam === 'design-tricks' ? 'border-2 border-dashed border-red-300' : ''}`}>
                {designTrickCards
                  .filter(card => card.attackUsage && (card.attackUsage.attack1 > 0 || card.attackUsage.attack2 > 0))
                  .map((card) => (
                    <CardComponent 
                      key={card.id} 
                      card={card}
                      isDraggable={canDragCard(card)}
                      isTargetable={isTargeting && isOpponentCard(card)}
                      onConfirmAttack={handleConfirmAttack}
                      onSelectTarget={handleSelectTargetWrapper}
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
                      : currentTeam === 'design-tricks'
                        ? 'Drag a Design Trick to play'
                        : 'Drag a Healthy Habit to play'}
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
                      onSelectTarget={handleSelectTargetWrapper}
                      isFirstTurn={isFirstTurn}
                      size="normal"
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Healthy Habits Active Play Area */}
            <div className="w-1/4 space-y-4">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-green-600">Healthy Habits</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Active Play
                  {healthyHabitCards.filter(card => card.attackUsage && (card.attackUsage.attack1 > 0 || card.attackUsage.attack2 > 0)).length > 0 && (
                    <span className="ml-1">
                      ({healthyHabitCards.filter(card => card.attackUsage && (card.attackUsage.attack1 > 0 || card.attackUsage.attack2 > 0)).length})
                    </span>
                  )}
                </p>
              </div>
              <div className={`space-y-4 p-4 rounded-lg min-h-[200px] ${currentTeam === 'healthy-habits' ? 'border-2 border-dashed border-green-300' : ''}`}>
                {healthyHabitCards
                  .filter(card => card.attackUsage && (card.attackUsage.attack1 > 0 || card.attackUsage.attack2 > 0))
                  .map((card) => (
                    <CardComponent 
                      key={card.id} 
                      card={card}
                      isDraggable={canDragCard(card)}
                      isTargetable={isTargeting && isOpponentCard(card)}
                      onConfirmAttack={handleConfirmAttack}
                      onSelectTarget={handleSelectTargetWrapper}
                      isFirstTurn={isFirstTurn}
                      size="small"
                    />
                ))}
              </div>
            </div>
        </div>

        {/* Active Effects Display */}
        {activeEffects.activeCardEffects.length > 0 && (
          <div className="mb-4">
            <ActiveEffects effects={activeEffects.activeCardEffects} />
          </div>
        )}

        {/* Action Cards Menu */}
        {showActionMenu && (
          <div className="mb-4">
            <ActionCardMenu
              actionCards={actionCards}
              currentTeam={currentTeam}
              onPlayCard={handlePlayActionCard}
              onClose={handleCloseActionMenu}
            />
          </div>
        )}

        {/* Player's Hand - Fixed Height */}
        <div className="mt-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold">Your Hand (All Cards)</h2>
            {actionCards.length > 0 && (
              <div className="flex items-center space-x-4">
                <button
                  onClick={showActionMenu ? handleCloseActionMenu : handleShowActionMenu}
                  className="px-3 py-1.5 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors flex items-center gap-2 text-sm"
                >
                  <span>{showActionMenu ? 'Close Action Cards' : 'View Action Cards'}</span>
                  <span className="bg-purple-500 px-1.5 py-0.5 rounded-full text-xs">
                    {actionCards.length}
                  </span>
                </button>
              </div>
            )}
          </div>

          <div className={`max-h-48 overflow-y-auto flex flex-wrap justify-center gap-4 p-3 rounded-lg border-2 ${
            currentTeam === 'design-tricks' ? 'border-dashed border-red-300' : 'border-dashed border-green-300'
          }`}>
            {/* Design Tricks Cards */}
            {designTrickCards.map((card) => (
              <CardComponent
                key={card.id}
                card={card}
                isDraggable={canDragCard(card)}
                isInBattle={false}
                isFirstTurn={isFirstTurn}
                size="small"
              />
            ))}
            
            {/* Healthy Habits Cards */}
            {healthyHabitCards.map((card) => (
              <CardComponent
                key={card.id}
                card={card}
                isDraggable={canDragCard(card)}
                isInBattle={false}
                isFirstTurn={isFirstTurn}
                size="small"
              />
            ))}
          </div>
          
          {/* Drag Hint */}
          <div className="text-center mt-2">
            <p className="text-xs text-gray-500">
              💡 Drag cards from here to the Battle Arena • Scroll to see more cards
            </p>
          </div>
        </div>
    </div>
  );
};

export default TrickyTechBoard; 
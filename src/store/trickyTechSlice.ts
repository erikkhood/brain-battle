import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { soundManager } from '../utils/soundManager'

// Import card images
import cardBackImage from '../assets/cards/card-back.webp'

// Design Trick Cards
import engagementImage from '../assets/cards/tricky-tech/DT - Engagement.webp'
import notifierImage from '../assets/cards/tricky-tech/DT - Notifier.webp'
import autoplayerImage from '../assets/cards/tricky-tech/DT - Autoplayer.webp'
import infiniteScrollImage from '../assets/cards/tricky-tech/DT - Infinite Scroll.webp'

// Healthy Habit Cards
import touchGrassImage from '../assets/cards/tricky-tech/HH - Touch Grass.webp'
import timeLimitImage from '../assets/cards/tricky-tech/HH - Time Limit.webp'
import silenceImage from '../assets/cards/tricky-tech/HH - Silence.webp'
import mindfulMomentImage from '../assets/cards/tricky-tech/HH - Mindful Moment.webp'

// Action card images
import phonePolicyImage from '../assets/cards/tricky-tech/AC - Phone Policy.webp'
import flowHobbyImage from '../assets/cards/tricky-tech/AC - Flow Hobby.webp'
import miniGameDistractorImage from '../assets/cards/tricky-tech/AC - Mini-Game Distractor.webp'
import lateNightScrollImage from '../assets/cards/tricky-tech/AC - Late Night Scroll.webp'

export interface Attack {
  name: string
  damage: number
  description: string
}

export interface Card {
  id: string
  type: 'design-trick' | 'healthy-habit'
  name: string
  hp: number
  attack1: Attack
  attack2: Attack
  frontImage: string
  backImage: string
  isFlipped?: boolean
  attackUsage: {
    attack1: number
    attack2: number
  }
  description: string
}

export interface ActionCardEffects {
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
  doubleDamage?: boolean;
}

export interface ActionCard {
  id: string;
  name: string;
  effect: string;
  description: string;
  type: 'action';
  team: Team;
  image: string;
  duration?: number;
  effects: ActionCardEffects;
}

export interface ActiveCardEffect {
  type: string;
  turnsRemaining: number;
  sourceCard: string;
  description: string;
  effects: ActionCardEffects;
}

export type Team = 'design-tricks' | 'healthy-habits'
export type Target = 'brain-health' | 'card'

// Sample cards for the game
const sampleCards: Card[] = [
  {
    id: 'dt1',
    type: 'design-trick',
    name: 'Infinite Scroll',
    description: 'Makes you scroll endlessly through social media content',
    hp: 70,
    attack1: {
      name: 'Endless Feed',
      damage: 30,
      description: 'Makes you scroll endlessly through social media content'
    },
    attack2: {
      name: 'Just One More',
      damage: 50,
      description: 'Convinces you to scroll "just one more minute" repeatedly'
    },
    frontImage: infiniteScrollImage,
    backImage: cardBackImage,
    isFlipped: false,
    attackUsage: { attack1: 0, attack2: 0 }
  },
  {
    id: 'dt2',
    type: 'design-trick',
    name: 'Notifier',
    description: 'Bombards you with endless notifications to break focus',
    hp: 65,
    attack1: {
      name: 'Buzz Blast',
      damage: 25,
      description: 'Interrupts your focus with constant notifications'
    },
    attack2: {
      name: 'FOMO Strike',
      damage: 45,
      description: 'Fear of missing out makes you keep checking notifications'
    },
    frontImage: notifierImage,
    backImage: cardBackImage,
    isFlipped: false,
    attackUsage: { attack1: 0, attack2: 0 }
  },
  {
    id: 'dt3',
    type: 'design-trick',
    name: 'Autoplayer',
    description: 'Automatically plays the next video to keep you watching',
    hp: 75,
    attack1: {
      name: 'Next Episode',
      damage: 35,
      description: 'Automatically starts the next video before you can decide'
    },
    attack2: {
      name: 'Binge Mode',
      damage: 55,
      description: 'Makes you watch entire seasons in one sitting'
    },
    frontImage: autoplayerImage,
    backImage: cardBackImage,
    isFlipped: false,
    attackUsage: { attack1: 0, attack2: 0 }
  },
  {
    id: 'dt4',
    type: 'design-trick',
    name: 'Engagement',
    description: 'Uses likes and comments to keep you engaged and scrolling',
    hp: 80,
    attack1: {
      name: 'Like Addiction',
      damage: 30,
      description: 'Makes you crave likes and social validation'
    },
    attack2: {
      name: 'Comment Chaos',
      damage: 50,
      description: 'Pulls you into endless comment arguments and drama'
    },
    frontImage: engagementImage,
    backImage: cardBackImage,
    isFlipped: false,
    attackUsage: { attack1: 0, attack2: 0 }
  },
  {
    id: 'hh1',
    type: 'healthy-habit',
    name: 'Touch Grass',
    description: 'Reminds you to take breaks and go outside for fresh air',
    hp: 90,
    attack1: {
      name: 'Nature Break',
      damage: 45,
      description: 'Reconnects you with the real world outside'
    },
    attack2: {
      name: 'Fresh Air',
      damage: 65,
      description: 'Clears your mind with outdoor activities'
    },
    frontImage: touchGrassImage,
    backImage: cardBackImage,
    isFlipped: false,
    attackUsage: { attack1: 0, attack2: 0 }
  },
  {
    id: 'hh2',
    type: 'healthy-habit',
    name: 'Time Limit',
    description: 'Helps you set and stick to healthy screen time limits',
    hp: 85,
    attack1: {
      name: 'App Timer',
      damage: 40,
      description: 'Sets healthy boundaries on app usage'
    },
    attack2: {
      name: 'Digital Sunset',
      damage: 60,
      description: 'Helps you wind down before bedtime'
    },
    frontImage: timeLimitImage,
    backImage: cardBackImage,
    isFlipped: false,
    attackUsage: { attack1: 0, attack2: 0 }
  },
  {
    id: 'hh3',
    type: 'healthy-habit',
    name: 'Silence',
    description: 'Helps you manage notifications and reduce distractions',
    hp: 80,
    attack1: {
      name: 'Do Not Disturb',
      damage: 35,
      description: 'Blocks distracting notifications during focus time'
    },
    attack2: {
      name: 'Focus Mode',
      damage: 55,
      description: 'Creates periods of uninterrupted focus'
    },
    frontImage: silenceImage,
    backImage: cardBackImage,
    isFlipped: false,
    attackUsage: { attack1: 0, attack2: 0 }
  },
  {
    id: 'hh4',
    type: 'healthy-habit',
    name: 'Mindful Moment',
    description: 'Promotes mindful and intentional technology use',
    hp: 95,
    attack1: {
      name: 'Deep Breath',
      damage: 50,
      description: 'Takes a moment to center yourself and be present'
    },
    attack2: {
      name: 'Meditation',
      damage: 70,
      description: 'Practices mindfulness to resist digital distractions'
    },
    frontImage: mindfulMomentImage,
    backImage: cardBackImage,
    isFlipped: false,
    attackUsage: { attack1: 0, attack2: 0 }
  }
]

// Sample action cards
const actionCards: ActionCard[] = [
  {
    id: 'late-night-scroll',
    name: 'Late Night Scroll',
    effect: 'Increases all Design Tricks HP by 25, enables double damage for 2 turns, and reduces all Healthy Habits HP by 15.',
    description: 'Late night scrolling makes design tricks more powerful as your brain gets tired',
    type: 'action',
    team: 'design-tricks',
    image: lateNightScrollImage,
    duration: 2,
    effects: {
      designTrickHpBoost: 25,
      doubleDamage: true,
      healthyHabitHpReduction: 15
    }
  },
  {
    id: 'mini-game-distractor',
    name: 'Mini-Game Distractor',
    effect: 'Reduces all Healthy Habits HP by 20 and halves their healing for 2 turns.',
    description: 'Small games within apps can distract you from your healthy tech habits',
    type: 'action',
    team: 'design-tricks',
    image: miniGameDistractorImage,
    duration: 2,
    effects: {
      healthyHabitHpReduction: 20,
      healthyHabitHealingReduction: 0.5
    }
  },
  {
    id: 'flow-hobby',
    name: 'Flow Hobby',
    effect: 'Activates a shield to block the next attack and boosts your strongest Healthy Habit by 30 HP.',
    description: 'Getting absorbed in a non-tech hobby helps strengthen your healthy habits',
    type: 'action',
    team: 'healthy-habits',
    image: flowHobbyImage,
    duration: 1,
    effects: {
      healthyHabitHpBoost: 30,
      blockCard: true
    }
  },
  {
    id: 'phone-policy',
    name: 'Phone Policy',
    effect: 'Reduces all Design Tricks HP by 20 and increases all Healthy Habits HP by 10. Effect continues for 3 turns.',
    description: 'Clear rules about device usage help weaken design tricks',
    type: 'action',
    team: 'healthy-habits',
    image: phonePolicyImage,
    duration: 3,
    effects: {
      designTrickHpReduction: 20,
      healthyHabitHpBoost: 10
    }
  }
]

interface GameState {
  brainHealth: number;
  currentTeam: Team;
  timeRemaining: number;
  actionCards: ActionCard[];
  designTrickCards: Card[];
  healthyHabitCards: Card[];
  playedCards: Card[];
  graveyardCards: (Card | ActionCard)[];
  isFirstTurn: boolean;
  activeEffects: {
    activeCardEffects: ActiveCardEffect[];
    doubleDamage: boolean;
    blockedCards: string[];
    lastActionType: 'attack' | 'action' | null;
  };
  matchingPairsBoost: {
    'Touch Grass': 'Infinity Scroller';
    'Time Limiter': 'Autoplayer';
    'Silencer': 'Notifier';
    'Mindful Moment': 'Engagementer';
  };
}

const initialState: GameState = {
  brainHealth: 0,
  currentTeam: 'design-tricks',
  timeRemaining: 600, // 10 minutes
  actionCards: [...actionCards],
  designTrickCards: sampleCards.filter(card => card.type === 'design-trick'),
  healthyHabitCards: sampleCards.filter(card => card.type === 'healthy-habit'),
  playedCards: [],
  graveyardCards: [],
  isFirstTurn: true,
  activeEffects: {
    activeCardEffects: [],
    doubleDamage: false,
    blockedCards: [],
    lastActionType: null
  },
  matchingPairsBoost: {
    'Touch Grass': 'Infinity Scroller',
    'Time Limiter': 'Autoplayer',
    'Silencer': 'Notifier',
    'Mindful Moment': 'Engagementer'
  }
};

const trickyTechSlice = createSlice({
  name: 'trickyTech',
  initialState,
  reducers: {
    playCard: (state, action: PayloadAction<{
      card: Card
      selectedAttack: number
      target: Target
      targetCardId?: string
      removeFromPlay?: boolean
    }>) => {
      const { card, selectedAttack, target, targetCardId } = action.payload
      
      // Find the card in the current game state to get the most up-to-date information
      let cardInState: Card | undefined;
      
      // First check current team's hand
      if (state.currentTeam === 'design-tricks') {
        cardInState = state.designTrickCards.find(c => c.id === card.id);
      } else {
        cardInState = state.healthyHabitCards.find(c => c.id === card.id);
      }
      
      // If not in hand, check played cards
      if (!cardInState) {
        cardInState = state.playedCards.find(c => c.id === card.id);
      }

      if (!cardInState) {
        console.error('Card not found in game state');
        return;
      }

      // Check attack usage limit
      const currentUsage = selectedAttack === 1 ? cardInState.attackUsage.attack1 : cardInState.attackUsage.attack2;
      if (currentUsage >= 2) {
        console.warn('Attack usage limit reached');
        return; // Don't allow the attack
      }

      // If there are any active effects from action cards played this turn, return early
      if (state.activeEffects.lastActionType === 'action') {
        return;
      }

      const attack = selectedAttack === 1 ? cardInState.attack1 : cardInState.attack2;
      let damage = attack.damage;

      // Apply active effects for Design Tricks
      if (state.activeEffects.doubleDamage && cardInState.type === 'design-trick') {
        damage *= 2;
      }

      // Update attack usage counter
      if (selectedAttack === 1) {
        cardInState.attackUsage.attack1++;
      } else {
        cardInState.attackUsage.attack2++;
      }

      // Reset attack usage if both attacks have been used twice
      if (cardInState.attackUsage.attack1 >= 2 && cardInState.attackUsage.attack2 >= 2) {
        cardInState.attackUsage = { attack1: 0, attack2: 0 };
      }

      // Apply the attack effects based on target
      if (target === 'brain-health') {
        const impact = cardInState.type === 'design-trick' ? -damage : damage;
        state.brainHealth = Math.max(-100, Math.min(100, state.brainHealth + impact));
        
        // Play sound effect based on health change
        if (impact > 0) {
          soundManager.play('healthIncrease');
        } else if (impact < 0) {
          soundManager.play('healthDecrease');
        }
        
        // Move card to played cards if not already there
        if (!state.playedCards.some(c => c.id === card.id)) {
          state.playedCards.push({...cardInState});
          soundManager.play('cardPlace');
          
          // Remove from team's hand
          if (card.type === 'design-trick') {
            state.designTrickCards = state.designTrickCards.filter(c => c.id !== card.id);
          } else {
            state.healthyHabitCards = state.healthyHabitCards.filter(c => c.id !== card.id);
          }
        }
      } else if (target === 'card' && targetCardId) {
        let targetCard = state.playedCards.find(c => c.id === targetCardId);
        if (!targetCard) {
          targetCard = state.designTrickCards.find(c => c.id === targetCardId) ||
                      state.healthyHabitCards.find(c => c.id === targetCardId);
        }

        if (targetCard) {
          targetCard.hp -= Math.abs(damage);
          soundManager.play('attack');
          
          if (targetCard.hp <= 0) {
            state.playedCards = state.playedCards.filter(c => c.id !== targetCardId);
            state.designTrickCards = state.designTrickCards.filter(c => c.id !== targetCardId);
            state.healthyHabitCards = state.healthyHabitCards.filter(c => c.id !== targetCardId);
            state.graveyardCards.push({...targetCard});
            soundManager.play('cardGraveyard');
          }
        }
      }

      // Move all current team's cards from battle to their active area when switching turns
      const currentTeamType = state.currentTeam === 'design-tricks' ? 'design-trick' : 'healthy-habit';
      const cardsToMove = state.playedCards.filter(c => c.type === currentTeamType);
      
      cardsToMove.forEach(card => {
        // Check if card should go to graveyard
        if (card.hp <= 0) {
          state.graveyardCards.push({...card});
        } else {
          if (card.type === 'design-trick') {
            state.designTrickCards.push({...card});
          } else {
            state.healthyHabitCards.push({...card});
          }
        }
      });
      
      // Remove the moved cards from played cards
      state.playedCards = state.playedCards.filter(c => c.type !== currentTeamType);

      // Switch teams and update first turn flag
      state.currentTeam = state.currentTeam === 'design-tricks' ? 'healthy-habits' : 'design-tricks';
      soundManager.play('turnSwitch');
      if (state.isFirstTurn) {
        state.isFirstTurn = false;
      }

      // Mark that an attack was made this turn
      (state.activeEffects.lastActionType as 'attack' | 'action' | null) = 'attack';
    },

    playActionCard: (state, action: PayloadAction<ActionCard>) => {
      const actionCard = action.payload;
      soundManager.play('actionCard');

      // Clear the battle arena before playing action card
      state.playedCards.forEach(card => {
        if (card.type === 'design-trick') {
          if (!state.designTrickCards.some(c => c.id === card.id)) {
            state.designTrickCards.push({...card});
          }
        } else {
          if (!state.healthyHabitCards.some(c => c.id === card.id)) {
            state.healthyHabitCards.push({...card});
          }
        }
      });
      state.playedCards = [];

      // Mark that an action was played this turn
      state.activeEffects.lastActionType = 'action';

      // Apply the action card effects
      if (actionCard.effects.designTrickHpBoost) {
        state.designTrickCards.forEach(card => {
          card.hp += actionCard.effects.designTrickHpBoost!;
        });
      }

      if (actionCard.effects.designTrickHpReduction) {
        state.designTrickCards.forEach(card => {
          card.hp -= actionCard.effects.designTrickHpReduction!;
          if (card.hp <= 0) {
            card.hp = 0;
          }
        });
      }

      if (actionCard.effects.healthyHabitHpBoost) {
        state.healthyHabitCards.forEach(card => {
          card.hp += actionCard.effects.healthyHabitHpBoost!;
        });
      }

      if (actionCard.effects.healthyHabitHpReduction) {
        state.healthyHabitCards.forEach(card => {
          card.hp -= actionCard.effects.healthyHabitHpReduction!;
          if (card.hp <= 0) {
            card.hp = 0;
          }
        });
      }

      if (actionCard.effects.doubleDamage) {
        state.activeEffects.doubleDamage = true;
      }

      // Apply shield effect for Flow Hobby
      if (actionCard.effects.blockCard) {
        state.activeEffects.blockedCards = []; // Clear any existing blocks
        // Find the strongest healthy habit to boost
        const strongestCard = state.healthyHabitCards.reduce((prev, current) => 
          (current.hp > prev.hp) ? current : prev
        );
        if (strongestCard) {
          strongestCard.hp += actionCard.effects.healthyHabitHpBoost || 0;
        }
      }

      // Add active card effect if it has lasting effects
      if (actionCard.duration && actionCard.duration > 0) {
        state.activeEffects.activeCardEffects.push({
          type: actionCard.id,
          turnsRemaining: actionCard.duration,
          sourceCard: actionCard.id,
          description: actionCard.effect,
          effects: actionCard.effects
        });
      }

      // Remove the played action card and add to graveyard
      state.actionCards = state.actionCards.filter(c => c.id !== actionCard.id);
      state.graveyardCards.push(actionCard);

      // Switch teams after action card is played
      state.currentTeam = state.currentTeam === 'design-tricks' ? 'healthy-habits' : 'design-tricks';
    },

    blockCard: (state, action: PayloadAction<string>) => {
      const cardId = action.payload;
      state.activeEffects.blockedCards.push(cardId);
    },

    removeDesignTrick: (state, action: PayloadAction<string>) => {
      const cardId = action.payload;
      const card = [...state.designTrickCards, ...state.playedCards]
        .find(c => c.id === cardId && c.type === 'design-trick');
      
      if (card) {
        state.designTrickCards = state.designTrickCards.filter(c => c.id !== cardId);
        state.playedCards = state.playedCards.filter(c => c.id !== cardId);
        state.graveyardCards.push({...card});
      }
    },

    updateTimer: (state) => {
      if (state.timeRemaining > 0) {
        state.timeRemaining -= 1;
      }
    },

    forceClearBattleArena: (state) => {
      // First return all cards to their respective hands
      state.playedCards.forEach(card => {
        if (card.type === 'design-trick') {
          if (!state.designTrickCards.some(c => c.id === card.id)) {
            state.designTrickCards.push({...card});
          }
        } else {
          if (!state.healthyHabitCards.some(c => c.id === card.id)) {
            state.healthyHabitCards.push({...card});
          }
        }
      });
      
      // Clear the battle arena
      state.playedCards = [];
    },

    processTurnEffects: (state) => {
      // Process ongoing effects
      state.activeEffects.activeCardEffects = state.activeEffects.activeCardEffects
        .map(effect => ({
          ...effect,
          turnsRemaining: effect.turnsRemaining - 1
        }))
        .filter(effect => effect.turnsRemaining > 0);

      // Clear double damage if no active effects with double damage remain
      if (!state.activeEffects.activeCardEffects.some(effect => effect.effects.doubleDamage)) {
        state.activeEffects.doubleDamage = false;
      }

      // Clear blocked cards list if no blocking effects are active
      if (!state.activeEffects.activeCardEffects.some(effect => effect.effects.blockCard)) {
        state.activeEffects.blockedCards = [];
      }

      // Reset the action type at the end of turn
      state.activeEffects.lastActionType = null;
    },

    resetGame: (state) => {
      Object.assign(state, {
        ...initialState,
        actionCards: [...actionCards],
        designTrickCards: sampleCards.filter(card => card.type === 'design-trick'),
        healthyHabitCards: sampleCards.filter(card => card.type === 'healthy-habit'),
        playedCards: [],
        graveyardCards: [],
        activeEffects: {
          doubleDamage: false,
          blockedCards: [],
          activeCardEffects: [],
          lastActionType: null
        }
      });
    }
  }
});

export const {
  playCard,
  playActionCard,
  updateTimer,
  resetGame,
  processTurnEffects,
  blockCard,
  removeDesignTrick,
  forceClearBattleArena
} = trickyTechSlice.actions;

export default trickyTechSlice.reducer; 
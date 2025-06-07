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
    name: 'Infinity Scroller',
    description: 'Makes you scroll endlessly through social media content',
    hp: 75,
    attack1: {
      name: 'Bottomless Feed',
      damage: 35,
      description: 'Makes you keep scrolling through content without noticing time passing.'
    },
    attack2: {
      name: 'Just One More',
      damage: 55,
      description: 'Convinces you to keep watching videos or viewing posts way past bedtime.'
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
      name: 'Red Alert',
      damage: 30,
      description: 'Uses bright colors and numbers to make you check your phone quickly.'
    },
    attack2: {
      name: 'FOMO Blast',
      damage: 45,
      description: 'Creates fear of missing out if you don\'t check notifications right away.'
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
    hp: 70,
    attack1: {
      name: 'Next Episode',
      damage: 40,
      description: 'Automatically plays the next video or episode before you can decide to stop.'
    },
    attack2: {
      name: 'Recommendation Rabbit Hole',
      damage: 50,
      description: 'Pulls you into watching more and more related content for hours.'
    },
    frontImage: autoplayerImage,
    backImage: cardBackImage,
    isFlipped: false,
    attackUsage: { attack1: 0, attack2: 0 }
  },
  {
    id: 'dt4',
    type: 'design-trick',
    name: 'Engagementer',
    description: 'Uses likes and comments to keep you engaged and scrolling',
    hp: 80,
    attack1: {
      name: 'Like Checker',
      damage: 35,
      description: 'Makes you check constantly to see how many likes your post received.'
    },
    attack2: {
      name: 'Fire Streak',
      damage: 60,
      description: 'Forces you to open the app daily to maintain your streak, even when busy.'
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
    hp: 95,
    attack1: {
      name: 'Reality Check',
      damage: 50,
      description: 'Reminds you there\'s a whole real world outside your screen.'
    },
    attack2: {
      name: 'Nature Reset',
      damage: 75,
      description: 'Uses time outdoors to reset your brain\'s attention without screens.'
    },
    frontImage: touchGrassImage,
    backImage: cardBackImage,
    isFlipped: false,
    attackUsage: { attack1: 0, attack2: 0 }
  },
  {
    id: 'hh2',
    type: 'healthy-habit',
    name: 'Time Limiter',
    description: 'Helps you set and stick to healthy screen time limits',
    hp: 85,
    attack1: {
      name: 'Screen Time Alert',
      damage: 45,
      description: 'Reminds you exactly how much time you\'re spending on different apps.'
    },
    attack2: {
      name: 'App Settings',
      damage: 65,
      description: 'Sets healthy time limits on apps to prevent excessive use.'
    },
    frontImage: timeLimitImage,
    backImage: cardBackImage,
    isFlipped: false,
    attackUsage: { attack1: 0, attack2: 0 }
  },
  {
    id: 'hh3',
    type: 'healthy-habit',
    name: 'Silencer',
    description: 'Helps you manage notifications and reduce distractions',
    hp: 90,
    attack1: {
      name: 'Do Not Disturb',
      damage: 55,
      description: 'Blocks notifications during important activities like homework or sleep.'
    },
    attack2: {
      name: 'Push Away Notifications',
      damage: 70,
      description: 'Turns off non-essential alerts to prevent constant interruptions.'
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
    hp: 100,
    attack1: {
      name: 'Attention Anchor',
      damage: 60,
      description: 'Brings your focus back to the present moment when tech distracts you.'
    },
    attack2: {
      name: 'Purpose Pause',
      damage: 80,
      description: 'Helps you pause and ask \'Why am I using this app right now?\' before getting trapped.'
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
    effect: 'When played, all Design Trick cards gain 30 HP and their attacks do double damage for 2 turns. Healthy Habit cards lose 20 HP and their healing is reduced by half.',
    description: 'Using devices late at night makes design tricks much more powerful',
    type: 'action',
    team: 'design-tricks',
    image: lateNightScrollImage,
    duration: 2,
    effects: {
      designTrickHpBoost: 30,
      doubleDamage: true,
      healthyHabitHpReduction: 20,
      healthyHabitHealingReduction: 0.5
    }
  },
  {
    id: 'mini-game-distractor',
    name: 'Mini-Game Distractor',
    effect: 'When played, one Healthy Habit card is blocked from attacking for 2 turns. Brain Health decreases by 15 points immediately.',
    description: 'Many apps include small games designed to keep you engaged longer',
    type: 'action',
    team: 'design-tricks',
    image: miniGameDistractorImage,
    duration: 2,
    effects: {
      blockCard: true,
      brainHealthChange: -15
    }
  },
  {
    id: 'flow-hobby',
    name: 'Flow Hobby',
    effect: 'When played, all Healthy Habit cards gain 40 HP and their healing effects double for 3 turns. All Design Trick cards lose 15 HP immediately.',
    description: 'Getting absorbed in a non-tech hobby puts your brain in a flow state',
    type: 'action',
    team: 'healthy-habits',
    image: flowHobbyImage,
    duration: 3,
    effects: {
      healthyHabitHpBoost: 40,
      healthyHabitHealingMultiplier: 2,
      designTrickHpReduction: 15
    }
  },
  {
    id: 'phone-policy',
    name: 'Phone Policy',
    effect: 'When played, all players must choose one Design Trick card and remove it from play. Healthy Habit cards get +10 HP for the remainder of the game.',
    description: 'Creating clear rules about when and where phones can be used',
    type: 'action',
    team: 'healthy-habits',
    image: phonePolicyImage,
    duration: 999, // Permanent effect
    effects: {
      removeDesignTrick: true,
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

      // No attack usage limits - cards can be used indefinitely as long as they're alive

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

      // Track usage for display purposes only (no limits)
      if (selectedAttack === 1) {
        cardInState.attackUsage.attack1++;
      } else {
        cardInState.attackUsage.attack2++;
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
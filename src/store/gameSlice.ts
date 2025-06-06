import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// Import card back image
import cardBackImage from '../assets/cards/card-back.webp'

// Import thinking trap card images
import allOrNothingImage from '../assets/cards/all-or-nothing-front.webp'
import labelerImage from '../assets/cards/labeler-front.webp'
import mindReaderImage from '../assets/cards/mind-reader-front.webp'
import negativeFilterImage from '../assets/cards/negative-filter-front.webp'
import shouldMonsterImage from '../assets/cards/should-monster-front.webp'
import personalizerImage from '../assets/cards/personalizer-front.webp'
import fortuneTellerImage from '../assets/cards/fortune-teller-front.webp'

// Import alternative thought card images
import middlePathImage from '../assets/cards/middle-path-front.webp'
import growthMindsetImage from '../assets/cards/growth-mindset-front.webp'
import factCheckerImage from '../assets/cards/fact-checker-front.webp'
import balancedViewerImage from '../assets/cards/balanced-viewer-front.webp'
import flexibleThinkerImage from '../assets/cards/flexible-thinker-front.webp'
import realityCheckerImage from '../assets/cards/reality-checker-front.webp'
import possibilityExplorerImage from '../assets/cards/possibility-explorer-front.webp'

// Import action card images
import restRechargeImage from '../assets/cards/rest-recharge.webp'
import friendSupportImage from '../assets/cards/friend-support.webp'
import socialMediaStormImage from '../assets/cards/social-media-storm.webp'
import distractionOverloadImage from '../assets/cards/distraction-overload.webp'

// Use imported images
const cardBack = cardBackImage
const allOrNothingFront = allOrNothingImage
const labelerFront = labelerImage
const mindReaderFront = mindReaderImage
const middlePathFront = middlePathImage
const growthMindsetFront = growthMindsetImage
const factCheckerFront = factCheckerImage
const negativeFilterFront = negativeFilterImage
const shouldMonsterFront = shouldMonsterImage
const personalizerFront = personalizerImage
const fortuneTellerFront = fortuneTellerImage
const balancedViewerFront = balancedViewerImage
const flexibleThinkerFront = flexibleThinkerImage
const realityCheckerFront = realityCheckerImage
const possibilityExplorerFront = possibilityExplorerImage

export interface Attack {
  name: string
  damage: number
  description: string
}

export interface SpecialEffect {
  type: 'bonus-damage'
  targetCardId: string
  amount: number
}

export interface Card {
  id: string
  type: 'thinking-trap' | 'alternative-thought'
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
  specialEffect?: SpecialEffect
}

export interface ActionCard {
  id: string
  name: string
  effect: string
  type: 'action'
  team: 'thought-defenders' | 'thought-trappers'
  image: string
}

export type Team = 'thought-trappers' | 'thought-defenders'
export type Target = 'brain-health' | 'card'

// Sample action cards
const actionCards: ActionCard[] = [
  {
    id: 'rest-recharge',
    name: 'Rest & Recharge',
    effect: 'Reduces all Thinking Traps HP by 20 and increases all Alternative Thoughts HP by 10. Effect continues for 3 turns.',
    type: 'action',
    team: 'thought-defenders',
    image: restRechargeImage
  },
  {
    id: 'friend-support',
    name: 'Friend Support',
    effect: 'Activates a shield to block the next attack and boosts your strongest Alternative Thought by 30 HP.',
    type: 'action',
    team: 'thought-defenders',
    image: friendSupportImage
  },
  {
    id: 'social-media-storm',
    name: 'Social Media Storm',
    effect: 'Increases all Thinking Traps HP by 25, enables double damage for 2 turns, and reduces all Alternative Thoughts HP by 15.',
    type: 'action',
    team: 'thought-trappers',
    image: socialMediaStormImage
  },
  {
    id: 'distraction-overload',
    name: 'Distraction Overload',
    effect: 'Reduces all Alternative Thoughts HP by 20 and halves their healing for 2 turns.',
    type: 'action',
    team: 'thought-trappers',
    image: distractionOverloadImage
  }
]

// Sample cards for the game
const sampleCards: Card[] = [
  {
    id: 'tt1',
    type: 'thinking-trap',
    name: 'All-or-Nothing',
    hp: 70,
    attack1: {
      name: 'Black and White',
      damage: 30,
      description: "Makes you see things as all good or all bad with no middle ground."
    },
    attack2: {
      name: 'Never/Always Blast',
      damage: 50,
      description: "Uses words like 'never' or 'always' to make problems seem bigger."
    },
    frontImage: allOrNothingFront,
    backImage: cardBack,
    isFlipped: false,
    attackUsage: { attack1: 0, attack2: 0 }
  },
  {
    id: 'tt2',
    type: 'thinking-trap',
    name: 'Labeler',
    hp: 70,
    attack1: {
      name: 'Bad Name Tag',
      damage: 25,
      description: "Puts a mean label on yourself instead of just on your mistake."
    },
    attack2: {
      name: 'Failure Flurry',
      damage: 45,
      description: "Makes you think one bad grade means you're bad at everything."
    },
    frontImage: labelerFront,
    backImage: cardBack,
    attackUsage: { attack1: 0, attack2: 0 }
  },
  {
    id: 'tt3',
    type: 'thinking-trap',
    name: 'Mind Reader',
    hp: 65,
    attack1: {
      name: 'Friend Guesser',
      damage: 30,
      description: "Makes you think you know why your friend isn't talking to you."
    },
    attack2: {
      name: 'Thought Reader',
      damage: 40,
      description: "Assumes others are thinking bad things about you without asking them."
    },
    frontImage: mindReaderFront,
    backImage: cardBack,
    attackUsage: { attack1: 0, attack2: 0 }
  },
  {
    id: 'tt4',
    type: 'thinking-trap',
    name: 'Negative Filter',
    hp: 75,
    attack1: {
      name: 'Good Stuff Eraser',
      damage: 25,
      description: "Makes all the nice comments disappear from your mind."
    },
    attack2: {
      name: 'Bad Comment Focus',
      damage: 45,
      description: "Zooms in on one mean comment and ignores ten nice ones."
    },
    frontImage: negativeFilterFront,
    backImage: cardBack,
    isFlipped: false,
    attackUsage: { attack1: 0, attack2: 0 }
  },
  {
    id: 'tt5',
    type: 'thinking-trap',
    name: 'Should Monster',
    hp: 65,
    attack1: {
      name: 'Should-a, Would-a, Could-a',
      damage: 35,
      description: "Drops 'should' and 'shouldn't' words that make you feel bad."
    },
    attack2: {
      name: 'Perfect Student',
      damage: 50,
      description: "Makes you think you should never make mistakes on homework."
    },
    frontImage: shouldMonsterFront,
    backImage: cardBack,
    isFlipped: false,
    attackUsage: { attack1: 0, attack2: 0 }
  },
  {
    id: 'tt6',
    type: 'thinking-trap',
    name: 'Personalizer',
    hp: 60,
    attack1: {
      name: 'My Fault Magnet',
      damage: 30,
      description: "Pulls blame toward you for things you didn't do."
    },
    attack2: {
      name: 'Mood Blamer',
      damage: 40,
      description: "Makes you think your friend's bad mood is because of you."
    },
    frontImage: personalizerFront,
    backImage: cardBack,
    isFlipped: false,
    attackUsage: { attack1: 0, attack2: 0 }
  },
  {
    id: 'tt7',
    type: 'thinking-trap',
    name: 'Fortune Teller',
    hp: 70,
    attack1: {
      name: 'Test Disaster',
      damage: 35,
      description: "Makes you sure you'll fail tomorrow's test before taking it."
    },
    attack2: {
      name: 'Future Fail',
      damage: 55,
      description: "Convinces you that bad things will definitely happen at school."
    },
    frontImage: fortuneTellerFront,
    backImage: cardBack,
    isFlipped: false,
    attackUsage: { attack1: 0, attack2: 0 }
  },
  {
    id: 'at1',
    type: 'alternative-thought',
    name: 'Middle Path Finder',
    hp: 90,
    attack1: {
      name: 'Gray Area Reveal',
      damage: 45,
      description: "Shows that most things aren't all good or all bad."
    },
    attack2: {
      name: 'Sometimes Perspective',
      damage: 65,
      description: "Replaces 'always' and 'never' with 'sometimes' to see things more clearly."
    },
    frontImage: middlePathFront,
    backImage: cardBack,
    attackUsage: { attack1: 0, attack2: 0 }
  },
  {
    id: 'at2',
    type: 'alternative-thought',
    name: 'Growth Mindset',
    hp: 85,
    attack1: {
      name: 'Second Chance',
      damage: 50,
      description: "Turns mistakes into chances to learn and grow."
    },
    attack2: {
      name: 'More Than Mistakes',
      damage: 70,
      description: "Reminds you that not being good at something YET doesn't define who you are."
    },
    frontImage: growthMindsetFront,
    backImage: cardBack,
    attackUsage: { attack1: 0, attack2: 0 }
  },
  {
    id: 'at3',
    type: 'alternative-thought',
    name: 'Fact Checker',
    hp: 85,
    attack1: {
      name: 'Curious Question',
      damage: 45,
      description: "Asks what's really happening instead of jumping to conclusions."
    },
    attack2: {
      name: 'Evidence Collection',
      damage: 65,
      description: "Gathers facts before deciding what others are thinking."
    },
    frontImage: factCheckerFront,
    backImage: cardBack,
    attackUsage: { attack1: 0, attack2: 0 }
  },
  {
    id: 'at4',
    type: 'alternative-thought',
    name: 'Balanced Viewer',
    hp: 90,
    attack1: {
      name: 'Full Picture',
      damage: 45,
      description: "Helps you see both the good and challenging parts of a situation."
    },
    attack2: {
      name: 'Positive Spotlight',
      damage: 70,
      description: "Shines light on the good things that negative filters try to hide."
    },
    frontImage: balancedViewerFront,
    backImage: cardBack,
    isFlipped: false,
    attackUsage: { attack1: 0, attack2: 0 }
  },
  {
    id: 'at5',
    type: 'alternative-thought',
    name: 'Flexible Thinker',
    hp: 95,
    attack1: {
      name: 'Preference Shift',
      damage: 55,
      description: "Changes rigid 'shoulds' into gentler preferences and goals."
    },
    attack2: {
      name: 'Effort Champion',
      damage: 75,
      description: "Celebrates trying hard and making progress instead of demanding perfection."
    },
    frontImage: flexibleThinkerFront,
    backImage: cardBack,
    isFlipped: false,
    attackUsage: { attack1: 0, attack2: 0 }
  },
  {
    id: 'at6',
    type: 'alternative-thought',
    name: 'Reality Checker',
    hp: 80,
    attack1: {
      name: 'Other Explanations',
      damage: 50,
      description: "Finds different reasons why things might be happening."
    },
    attack2: {
      name: 'Not About Me',
      damage: 65,
      description: "Remembers that most things aren't personal or about you at all."
    },
    frontImage: realityCheckerFront,
    backImage: cardBack,
    isFlipped: false,
    attackUsage: { attack1: 0, attack2: 0 }
  },
  {
    id: 'at7',
    type: 'alternative-thought',
    name: 'Possibility Explorer',
    hp: 100,
    attack1: {
      name: 'Maybe Maker',
      damage: 60,
      description: "Replaces 'definitely will happen' with 'maybe' to open up new possibilities."
    },
    attack2: {
      name: 'Future Path',
      damage: 80,
      description: "Discovers multiple possible futures instead of just one negative one."
    },
    frontImage: possibilityExplorerFront,
    backImage: cardBack,
    isFlipped: false,
    attackUsage: { attack1: 0, attack2: 0 }
  }
]

// Shuffle array function
const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

interface ActiveCardEffect {
  type: 'rest-recharge' | 'friend-support' | 'social-media-storm' | 'distraction-overload'
  turnsRemaining: number
  sourceCard: string
  description: string
  affectedCards?: string[]
  effectValues: {
    hpChange?: number
    doubleDamage?: boolean
    shield?: boolean
    healingReduction?: boolean
  }
}

export interface GameState {
  brainHealth: number
  currentTeam: Team
  timeRemaining: number // in seconds (600 = 10 minutes)
  actionCards: ActionCard[]
  trapperCards: Card[]
  defenderCards: Card[]
  playedCards: Card[]
  graveyardCards: (Card | ActionCard)[]
  isFirstTurn: boolean
  activeEffects: {
    doubleDamage?: boolean
    shield?: boolean
    activeCardEffects: ActiveCardEffect[]
    lastActionType: 'attack' | 'action' | null
  }
}

const initialState: GameState = {
  brainHealth: 0,
  currentTeam: 'thought-trappers',
  timeRemaining: 600,
  actionCards: shuffleArray(actionCards),
  trapperCards: shuffleArray(sampleCards.filter(card => card.type === 'thinking-trap')).map(card => ({
    ...card,
    attackUsage: { attack1: 0, attack2: 0 }
  })),
  defenderCards: shuffleArray(sampleCards.filter(card => card.type === 'alternative-thought')).map(card => ({
    ...card,
    attackUsage: { attack1: 0, attack2: 0 }
  })),
  playedCards: [],
  graveyardCards: [],
  isFirstTurn: true,
  activeEffects: {
    doubleDamage: false,
    shield: false,
    activeCardEffects: [],
    lastActionType: null
  }
}

export interface PlayCardAction {
  card: Card;
  selectedAttack: number;
  target: Target;
  targetCardId?: string;
  removeFromPlay?: boolean;
}

const gameSlice = createSlice({
  name: 'game',
  initialState: {
    ...initialState,
    activeEffects: {
      ...initialState.activeEffects,
      lastActionType: null
    }
  },
  reducers: {
    playCard: (state, action: PayloadAction<PlayCardAction>) => {
      const { card, selectedAttack, target, targetCardId } = action.payload;
      
      // Find the card in the current game state to get the most up-to-date information
      let cardInState: Card | undefined;
      
      // First check current team's hand
      if (state.currentTeam === 'thought-trappers') {
        cardInState = state.trapperCards.find(c => c.id === card.id);
      } else {
        cardInState = state.defenderCards.find(c => c.id === card.id);
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

      // Check if this is a Thinking Trap attack and shield is active
      if (cardInState.type === 'thinking-trap' && state.activeEffects.shield) {
        // Shield blocks the attack completely
        state.activeEffects.shield = false; // Consume the shield
        state.activeEffects.activeCardEffects = state.activeEffects.activeCardEffects.filter(
          effect => effect.type !== 'friend-support'
        );
        return; // Exit early - attack is blocked
      }

      // If we get here, either no shield or not a Thinking Trap attack
      const attack = selectedAttack === 1 ? cardInState.attack1 : cardInState.attack2;
      let damage = attack.damage;

      // Apply double damage effect if active and this is a Thinking Trap card
      if (state.activeEffects.doubleDamage && cardInState.type === 'thinking-trap') {
        damage *= 2;
      }

      // Apply healing reduction effect for Alternative Thoughts
      const hasHealingReduction = state.activeEffects.activeCardEffects.some(
        effect => effect.type === 'distraction-overload' && effect.turnsRemaining > 0
      );
      if (hasHealingReduction && card.type === 'alternative-thought' && target === 'brain-health') {
        // Only reduce healing when targeting brain health
        damage = Math.floor(damage / 2);
      }

      // Apply special effects if targeting a specific card
      if (target === 'card' && targetCardId && cardInState.specialEffect) {
        if (cardInState.specialEffect.type === 'bonus-damage' && 
            cardInState.specialEffect.targetCardId === targetCardId) {
          damage += cardInState.specialEffect.amount;
        }
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
        // Check for shield effect against Thinking Trap attacks
        if (state.activeEffects.shield && damage < 0) {
          // Shield blocks negative damage (attacks from Thinking Traps)
          state.activeEffects.shield = false;
        } else {
          // No shield or not a Thinking Trap - apply normal damage
          const impact = cardInState.type === 'thinking-trap' ? -damage : damage;
          state.brainHealth = Math.max(-100, Math.min(100, state.brainHealth + impact));
          
          // Move card to played cards if not already there
          if (!state.playedCards.some(c => c.id === card.id)) {
            state.playedCards.push({...cardInState});
            
            // Remove from team's hand
            if (card.type === 'thinking-trap') {
              state.trapperCards = state.trapperCards.filter(c => c.id !== card.id);
            } else {
              state.defenderCards = state.defenderCards.filter(c => c.id !== card.id);
            }
          }
        }
      } else if (target === 'card' && targetCardId) {
        // For card-to-card attacks, check shield
        if (state.activeEffects.shield && cardInState.type === 'thinking-trap') {
          // Shield blocks the attack
          state.activeEffects.shield = false; // Consume the shield
          // Remove the friend-support effect
          state.activeEffects.activeCardEffects = state.activeEffects.activeCardEffects.filter(
            effect => effect.type !== 'friend-support'
          );
        } else {
          // No shield or not a Thinking Trap - apply normal damage
          let targetCard = state.playedCards.find(c => c.id === targetCardId);
          if (!targetCard) {
            targetCard = state.trapperCards.find(c => c.id === targetCardId) ||
                        state.defenderCards.find(c => c.id === targetCardId);
          }

          if (targetCard) {
            targetCard.hp -= Math.abs(damage);
            
            if (targetCard.hp <= 0) {
              state.playedCards = state.playedCards.filter(c => c.id !== targetCardId);
              state.trapperCards = state.trapperCards.filter(c => c.id !== targetCardId);
              state.defenderCards = state.defenderCards.filter(c => c.id !== targetCardId);
              state.graveyardCards.push({...targetCard});
            }
          }
        }
      }

      // Move all current team's cards from battle to their active area when switching turns
      const currentTeamType = state.currentTeam === 'thought-trappers' ? 'thinking-trap' : 'alternative-thought';
      const cardsToMove = state.playedCards.filter(c => c.type === currentTeamType);
      
      cardsToMove.forEach(card => {
        // Check if card should go to graveyard
        if (card.hp <= 0) {
          state.graveyardCards.push({...card});
        } else {
          if (card.type === 'thinking-trap') {
            state.trapperCards.push({...card});
          } else {
            state.defenderCards.push({...card});
          }
        }
      });
      
      // Remove the moved cards from played cards
      state.playedCards = state.playedCards.filter(c => c.type !== currentTeamType);

      // Switch teams and update first turn flag
      state.currentTeam = state.currentTeam === 'thought-trappers' ? 'thought-defenders' : 'thought-trappers';
      if (state.isFirstTurn) {
        state.isFirstTurn = false;
      }

      // Mark that an attack was made this turn
      (state.activeEffects.lastActionType as 'attack' | 'action' | null) = 'attack';
    },
    playActionCard: (state, action: PayloadAction<ActionCard>) => {
      const actionCard = action.payload;

      // Only allow playing action cards for the correct team
      if (
        (actionCard.team === 'thought-defenders' && state.currentTeam !== 'thought-defenders') ||
        (actionCard.team === 'thought-trappers' && state.currentTeam !== 'thought-trappers')
      ) {
        return;
      }

      // Force return ALL cards to their respective hands
      const allCards = [...state.playedCards];
      allCards.forEach(card => {
        if (card.type === 'thinking-trap') {
          if (!state.trapperCards.some(c => c.id === card.id)) {
            state.trapperCards.push({...card});
          }
        } else {
          if (!state.defenderCards.some(c => c.id === card.id)) {
            state.defenderCards.push({...card});
          }
        }
      });

      // Clear battle arena
      state.playedCards = [];

      // Mark that an action card was played this turn
      (state.activeEffects.lastActionType as 'attack' | 'action' | null) = 'action';

      // Apply initial effects immediately
      
      switch (actionCard.id) {
        case 'social-media-storm':
          // Apply one-time HP changes
          state.trapperCards.forEach(card => {
            card.hp += 25; // One-time boost for Thinking Traps
          });
          
          state.defenderCards.forEach(card => {
            card.hp = Math.max(0, card.hp - 15); // One-time reduction for Alternative Thoughts
          });
          
          state.playedCards.forEach(card => {
            if (card.type === 'thinking-trap') {
              card.hp += 25;
            } else if (card.type === 'alternative-thought') {
              card.hp = Math.max(0, card.hp - 15);
            }
          });
          
          // Remove any existing Social Media Storm effects
          state.activeEffects.activeCardEffects = state.activeEffects.activeCardEffects.filter(
            effect => effect.type !== 'social-media-storm'
          );
          
          // Add new Social Media Storm effect for double damage
          state.activeEffects.activeCardEffects.push({
            type: 'social-media-storm',
            turnsRemaining: 2,
            sourceCard: actionCard.id,
            description: 'Double damage enabled for Thinking Traps for 2 turns',
            effectValues: {
              doubleDamage: true
            }
          });
          
          // Enable double damage
          state.activeEffects.doubleDamage = true;
          break;

        case 'rest-recharge':
          // Apply one-time HP changes
          [...state.trapperCards, ...state.defenderCards, ...state.playedCards].forEach(card => {
            if (card.type === 'thinking-trap') {
              card.hp = Math.max(0, card.hp - 20); // One-time reduction
            } else if (card.type === 'alternative-thought') {
              card.hp += 10; // One-time increase
            }
          });
          
          // Add effect tracking just to track duration
          state.activeEffects.activeCardEffects = state.activeEffects.activeCardEffects.filter(
            effect => effect.type !== 'rest-recharge'
          );
          
          state.activeEffects.activeCardEffects.push({
            type: 'rest-recharge',
            turnsRemaining: 3,
            sourceCard: actionCard.id,
            description: 'Effect active for 3 turns',
            effectValues: {}
          });
          break;

        case 'friend-support':
          // Find the strongest Alternative Thought that's not in graveyard
          const friendSupportTargets = [
            ...state.defenderCards,
            ...state.playedCards.filter(card => card.type === 'alternative-thought')
          ];
          
          if (friendSupportTargets.length > 0) {
            // Sort by HP to find the strongest card
            const strongestCard = friendSupportTargets.reduce((prev, current) => 
              (current.hp > prev.hp) ? current : prev
            );
            
            // Boost the strongest card by 30 HP
            strongestCard.hp += 30;
          }
          
          // Clear any existing Friend Support effects
          state.activeEffects.activeCardEffects = state.activeEffects.activeCardEffects.filter(
            effect => effect.type !== 'friend-support'
          );
          
          // Add new shield effect
          state.activeEffects.activeCardEffects.push({
            type: 'friend-support',
            turnsRemaining: 1,
            sourceCard: actionCard.id,
            description: 'Shield active - next attack blocked',
            effectValues: {
              shield: true
            }
          });
          
          // Enable shield
          state.activeEffects.shield = true;
          break;

        case 'distraction-overload':
          // Get all Alternative Thought cards
          const distractionTargets = [
            ...state.defenderCards,
            ...state.playedCards.filter(card => card.type === 'alternative-thought')
          ];
          
          // Apply one-time -20 HP reduction
          distractionTargets.forEach(card => {
            card.hp = Math.max(0, card.hp - 20);
          });
          
          // Add effect for healing reduction only (no HP changes)
          state.activeEffects.activeCardEffects = state.activeEffects.activeCardEffects.filter(
            effect => effect.type !== 'distraction-overload'
          );
          
          state.activeEffects.activeCardEffects.push({
            type: 'distraction-overload',
            turnsRemaining: 2,
            sourceCard: actionCard.id,
            description: 'Alternative Thoughts healing reduced by 50% for 2 turns',
            effectValues: {
              healingReduction: true
            }
          });
          break;
      }

      // Process effects immediately after playing the card
      state.activeEffects.activeCardEffects.forEach(effect => {
        switch (effect.type) {
          case 'rest-recharge':
            // No HP changes during turn processing - effect was applied once when played
            break;
            
          case 'social-media-storm':
            // JUST maintain the effect - damage doubling is handled in playCard
            break;
            
          case 'distraction-overload':
            // Only maintain healing reduction - NO HP CHANGES
            break;
        }
      });

      // Check for any cards that were defeated by the action card effects
      [...state.playedCards, ...state.trapperCards, ...state.defenderCards].forEach(card => {
        if (card.hp <= 0) {
          // Remove from all possible locations
          state.playedCards = state.playedCards.filter(c => c.id !== card.id);
          state.trapperCards = state.trapperCards.filter(c => c.id !== card.id);
          state.defenderCards = state.defenderCards.filter(c => c.id !== card.id);
          
          // Add to graveyard if not already there
          if (!state.graveyardCards.some(c => 'id' in c && c.id === card.id)) {
            state.graveyardCards.push({...card});
          }
        }
      });

      // Remove the played action card and add to graveyard
      state.actionCards = state.actionCards.filter(c => c.id !== actionCard.id);
      state.graveyardCards.push(actionCard);

      // Switch teams
      state.currentTeam = state.currentTeam === 'thought-trappers' ? 'thought-defenders' : 'thought-trappers';
    },
    updateTimer: (state) => {
      if (state.timeRemaining > 0) {
        state.timeRemaining -= 1
      }
    },
    resetGame: (state) => {
      const freshTrapperCards = shuffleArray(sampleCards.filter(card => card.type === 'thinking-trap')).map(card => ({
        ...card,
        attackUsage: { attack1: 0, attack2: 0 },
        isFlipped: false
      }));
      
      const freshDefenderCards = shuffleArray(sampleCards.filter(card => card.type === 'alternative-thought')).map(card => ({
        ...card,
        attackUsage: { attack1: 0, attack2: 0 },
        isFlipped: false
      }));

      Object.assign(state, {
        ...initialState,
        actionCards: shuffleArray([...actionCards]),
        trapperCards: freshTrapperCards,
        defenderCards: freshDefenderCards,
        playedCards: [],
        graveyardCards: [],
        activeEffects: {
          doubleDamage: false,
          shield: false,
          activeCardEffects: [],
          lastActionType: null
        }
      });
    },
    updateCardImage: (
      state,
      action: PayloadAction<{ cardId: string; imageType: 'front' | 'back'; imageUrl: string }>
    ) => {
      const { cardId, imageType, imageUrl } = action.payload;
      const card = [...state.trapperCards, ...state.defenderCards, ...state.playedCards].find(
        (c) => c.id === cardId
      );
      if (card) {
        if (imageType === 'front') {
          card.frontImage = imageUrl;
        } else {
          card.backImage = imageUrl;
        }
      }
    },
    toggleCardFlip: (state, action: PayloadAction<string>) => {
      const cardId = action.payload;
      const card = [...state.trapperCards, ...state.defenderCards, ...state.playedCards].find(
        (c) => c.id === cardId
      );
      if (card) {
        card.isFlipped = !card.isFlipped;
      }
    },
    processTurnEffects: (state) => {
      // Process ongoing effects
      state.activeEffects.activeCardEffects.forEach(effect => {
        switch (effect.type) {
          case 'rest-recharge':
            // No HP changes during turn processing - effect was applied once when played
            break;
            
          case 'social-media-storm':
            // Just maintain the effect - damage doubling is handled in playCard
            break;
            
          case 'distraction-overload':
            // Only maintain healing reduction - NO HP CHANGES
            break;
        }
      });

      // Update turn counters and remove expired effects
      state.activeEffects.activeCardEffects = state.activeEffects.activeCardEffects
        .map(effect => ({
          ...effect,
          turnsRemaining: effect.turnsRemaining - 1
        }))
        .filter(effect => effect.turnsRemaining > 0);

      // Clear shield effect only if Friend Support is not active
      if (!state.activeEffects.activeCardEffects.some(effect => effect.type === 'friend-support')) {
        state.activeEffects.shield = false;
      }
      
      // Clear double damage only if Social Media Storm is not active
      if (!state.activeEffects.activeCardEffects.some(effect => effect.type === 'social-media-storm')) {
        state.activeEffects.doubleDamage = false;
      }

      // Reset the action type at the end of turn
      state.activeEffects.lastActionType = null;
    },
    forceClearBattleArena: (state) => {
      // First return all cards to their respective hands
      state.playedCards.forEach(card => {
        if (card.type === 'thinking-trap') {
          if (!state.trapperCards.some(c => c.id === card.id)) {
            state.trapperCards.push({...card});
          }
        } else {
          if (!state.defenderCards.some(c => c.id === card.id)) {
            state.defenderCards.push({...card});
          }
        }
      });
      
      // Clear the battle arena
      state.playedCards = [];
    },
    switchTeams: (state) => {
      // Return all current team's cards to hand
      const currentTeamType = state.currentTeam === 'thought-trappers' ? 'thinking-trap' : 'alternative-thought';
      state.playedCards.forEach(card => {
        if (card.type === currentTeamType) {
          if (card.type === 'thinking-trap') {
            if (!state.trapperCards.some(c => c.id === card.id)) {
              state.trapperCards.push({...card});
            }
          } else {
            if (!state.defenderCards.some(c => c.id === card.id)) {
              state.defenderCards.push({...card});
            }
          }
        }
      });

      // Remove current team's cards from battle arena
      state.playedCards = state.playedCards.filter(card => card.type !== currentTeamType);

      // Switch teams
      state.currentTeam = state.currentTeam === 'thought-trappers' ? 'thought-defenders' : 'thought-trappers';
      
      // Reset action type when switching teams
      state.activeEffects.lastActionType = null;
    },
  },
})

export const { 
  playCard, 
  playActionCard, 
  updateTimer, 
  resetGame, 
  updateCardImage, 
  toggleCardFlip, 
  processTurnEffects,
  forceClearBattleArena,
  switchTeams
} = gameSlice.actions
export default gameSlice.reducer 
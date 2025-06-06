// Sound Manager for Brain Battle Game
// Uses Web Audio API to create simple sound effects

class SoundManager {
  private audioContext: AudioContext | null = null;
  private sounds: Map<string, () => void> = new Map();
  private enabled = true;

  constructor() {
    this.initializeAudioContext();
    this.createSounds();
  }

  private initializeAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.warn('Web Audio API not supported:', error);
    }
  }

  private resumeAudioContext() {
    if (this.audioContext?.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  private createOscillator(frequency: number, type: OscillatorType = 'sine'): OscillatorNode | null {
    if (!this.audioContext) return null;
    
    const oscillator = this.audioContext.createOscillator();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    return oscillator;
  }

  private createGain(volume: number = 0.1): GainNode | null {
    if (!this.audioContext) return null;
    
    const gain = this.audioContext.createGain();
    gain.gain.setValueAtTime(volume, this.audioContext.currentTime);
    return gain;
  }

  private createSounds() {
    // Card movement/placement sound
    this.sounds.set('cardMove', () => {
      if (!this.audioContext) return;
      this.resumeAudioContext();
      
      const oscillator = this.createOscillator(200, 'sine');
      const gain = this.createGain(0.05);
      
      if (oscillator && gain) {
        oscillator.connect(gain);
        gain.connect(this.audioContext.destination);
        
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.1);
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.1);
      }
    });

    // Card placed sound
    this.sounds.set('cardPlace', () => {
      if (!this.audioContext) return;
      this.resumeAudioContext();
      
      const oscillator1 = this.createOscillator(300, 'sine');
      const oscillator2 = this.createOscillator(400, 'sine');
      const gain = this.createGain(0.08);
      
      if (oscillator1 && oscillator2 && gain) {
        oscillator1.connect(gain);
        oscillator2.connect(gain);
        gain.connect(this.audioContext.destination);
        
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.15);
        oscillator1.start();
        oscillator2.start();
        oscillator1.stop(this.audioContext.currentTime + 0.15);
        oscillator2.stop(this.audioContext.currentTime + 0.15);
      }
    });

    // Health increase sound (positive, uplifting)
    this.sounds.set('healthIncrease', () => {
      if (!this.audioContext) return;
      this.resumeAudioContext();
      
      const frequencies = [262, 330, 392, 523]; // C major chord
      const gain = this.createGain(0.06);
      
      if (gain) {
        frequencies.forEach((freq, index) => {
          const oscillator = this.createOscillator(freq, 'sine');
          if (oscillator) {
            oscillator.connect(gain);
            oscillator.start(this.audioContext!.currentTime + index * 0.05);
            oscillator.stop(this.audioContext!.currentTime + 0.3 + index * 0.05);
          }
        });
        
        gain.connect(this.audioContext.destination);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.5);
      }
    });

    // Health decrease sound (negative, ominous)
    this.sounds.set('healthDecrease', () => {
      if (!this.audioContext) return;
      this.resumeAudioContext();
      
      const frequencies = [200, 180, 160, 140]; // Descending ominous tones
      const gain = this.createGain(0.08);
      
      if (gain) {
        frequencies.forEach((freq, index) => {
          const oscillator = this.createOscillator(freq, 'sawtooth');
          if (oscillator) {
            oscillator.connect(gain);
            oscillator.start(this.audioContext!.currentTime + index * 0.08);
            oscillator.stop(this.audioContext!.currentTime + 0.2 + index * 0.08);
          }
        });
        
        gain.connect(this.audioContext.destination);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.6);
      }
    });

    // Card to graveyard sound
    this.sounds.set('cardGraveyard', () => {
      if (!this.audioContext) return;
      this.resumeAudioContext();
      
      const oscillator = this.createOscillator(150, 'triangle');
      const gain = this.createGain(0.07);
      
      if (oscillator && gain) {
        oscillator.connect(gain);
        gain.connect(this.audioContext.destination);
        
        // Slow fade out like a card falling
        oscillator.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.4);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.5);
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.5);
      }
    });

    // Attack sound (sharp, impactful)
    this.sounds.set('attack', () => {
      if (!this.audioContext) return;
      this.resumeAudioContext();
      
      const oscillator = this.createOscillator(100, 'square');
      const gain = this.createGain(0.1);
      
      if (oscillator && gain) {
        oscillator.connect(gain);
        gain.connect(this.audioContext.destination);
        
        // Quick burst
        oscillator.frequency.setValueAtTime(100, this.audioContext.currentTime);
        oscillator.frequency.linearRampToValueAtTime(50, this.audioContext.currentTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.1);
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.1);
      }
    });

    // Shield/defense sound
    this.sounds.set('shield', () => {
      if (!this.audioContext) return;
      this.resumeAudioContext();
      
      const oscillator = this.createOscillator(800, 'sine');
      const gain = this.createGain(0.06);
      
      if (oscillator && gain) {
        oscillator.connect(gain);
        gain.connect(this.audioContext.destination);
        
        // Shimmering effect
        oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
        oscillator.frequency.linearRampToValueAtTime(1000, this.audioContext.currentTime + 0.1);
        oscillator.frequency.linearRampToValueAtTime(900, this.audioContext.currentTime + 0.2);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.25);
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.25);
      }
    });

    // Action card sound
    this.sounds.set('actionCard', () => {
      if (!this.audioContext) return;
      this.resumeAudioContext();
      
      const frequencies = [440, 554, 659]; // A major chord
      const gain = this.createGain(0.07);
      
      if (gain) {
        frequencies.forEach((freq, index) => {
          const oscillator = this.createOscillator(freq, 'triangle');
          if (oscillator) {
            oscillator.connect(gain);
            oscillator.start(this.audioContext!.currentTime + index * 0.02);
            oscillator.stop(this.audioContext!.currentTime + 0.3);
          }
        });
        
        gain.connect(this.audioContext.destination);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.35);
      }
    });

    // Turn switch sound
    this.sounds.set('turnSwitch', () => {
      if (!this.audioContext) return;
      this.resumeAudioContext();
      
      const oscillator1 = this.createOscillator(400, 'sine');
      const oscillator2 = this.createOscillator(300, 'sine');
      const gain = this.createGain(0.05);
      
      if (oscillator1 && oscillator2 && gain) {
        oscillator1.connect(gain);
        oscillator2.connect(gain);
        gain.connect(this.audioContext.destination);
        
        oscillator1.start();
        oscillator2.start(this.audioContext.currentTime + 0.1);
        oscillator1.stop(this.audioContext.currentTime + 0.1);
        oscillator2.stop(this.audioContext.currentTime + 0.2);
        
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.25);
      }
    });
  }

  public play(soundName: string) {
    if (!this.enabled) return;
    
    const sound = this.sounds.get(soundName);
    if (sound) {
      try {
        sound();
      } catch (error) {
        console.warn(`Error playing sound ${soundName}:`, error);
      }
    } else {
      console.warn(`Sound ${soundName} not found`);
    }
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  public isEnabled() {
    return this.enabled;
  }
}

// Create singleton instance
export const soundManager = new SoundManager(); 
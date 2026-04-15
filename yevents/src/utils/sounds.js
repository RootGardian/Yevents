/**
 * Utility to play scanner sounds using the Web Audio API
 * Avoids external assets and works in most modern browsers (with user interaction)
 */

class SoundService {
  constructor() {
    this.audioCtx = null;
  }

  /**
   * Initialize the AudioContext. 
   * Must be called during a user gesture (e.g. click).
   */
  init() {
    if (!this.audioCtx) {
      try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
          this.audioCtx = new AudioContextClass();
        }
      } catch (e) {
        console.error("Web Audio API not supported", e);
      }
    }
  }

  /**
   * Internal helper to schedule a beep
   */
  _scheduleBeep(frequency, duration, startTime, type = 'sine') {
    if (!this.audioCtx) return;

    const oscillator = this.audioCtx.createOscillator();
    const gainNode = this.audioCtx.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, startTime);
    
    // Envelope: quick start, exponential decay
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(0.1, startTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(this.audioCtx.destination);

    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
  }

  /**
   * Play a success sound: High, positive pitch
   */
  playSuccess() {
    this.init();
    if (this.audioCtx) {
      if (this.audioCtx.state === 'suspended') this.audioCtx.resume();
      const now = this.audioCtx.currentTime;
      this._scheduleBeep(880, 0.15, now, 'sine');
    }
  }

  /**
   * Play an error sound: Low, harsh double beep
   */
  playError() {
    this.init();
    if (this.audioCtx) {
      if (this.audioCtx.state === 'suspended') this.audioCtx.resume();
      const now = this.audioCtx.currentTime;
      // Double low beep
      this._scheduleBeep(220, 0.15, now, 'square');
      this._scheduleBeep(220, 0.15, now + 0.2, 'square');
    }
  }
}

export const soundService = new SoundService();

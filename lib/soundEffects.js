// Web Audio API synthesizer for sci-fi SFX + HTML5 Audio Engine for soundtrack
// Track: "Forever" by The Little Dippers (Obsession 2026 End Credits Theme)
// YouTube: https://youtu.be/HQkpBZhv4vc?si=URCILui03yguJ-Ku

export const TRACK_INFO = {
  title: 'Forever',
  artist: 'The Little Dippers',
  badge: 'Obsession End Credits Theme',
  youtubeUrl: 'https://youtu.be/HQkpBZhv4vc?si=URCILui03yguJ-Ku',
  audioSources: [
    { src: '/audio/forever_theme.webm', type: 'audio/webm' },
    { src: '/audio/forever_theme.m4a', type: 'audio/mp4' },
  ],
};

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.sfxEnabled = true;
    this.musicPlaying = false;
    this.volume = 0.45;
    this.isMuted = false;
    this.currentTime = 0;
    this.duration = 144; // ~2:24 default until metadata loads
    this.listeners = new Set();
    this.audioElement = null;

    if (typeof window !== 'undefined') {
      const savedSfx = localStorage.getItem('portfolio_sfx_enabled');
      if (savedSfx !== null) {
        this.sfxEnabled = savedSfx === 'true';
      }

      const savedVol = localStorage.getItem('portfolio_music_vol');
      if (savedVol !== null) {
        const parsed = parseFloat(savedVol);
        if (!isNaN(parsed)) this.volume = Math.max(0, Math.min(1, parsed));
      }
    }
  }

  initAudioElement() {
    if (this.audioElement || typeof window === 'undefined') return;

    try {
      const audio = new Audio();
      audio.preload = 'metadata';
      audio.loop = true;
      audio.volume = this.volume;

      // Add sources
      const sourceWebm = document.createElement('source');
      sourceWebm.src = '/audio/forever_theme.webm';
      sourceWebm.type = 'audio/webm';
      audio.appendChild(sourceWebm);

      const sourceM4a = document.createElement('source');
      sourceM4a.src = '/audio/forever_theme.m4a';
      sourceM4a.type = 'audio/mp4';
      audio.appendChild(sourceM4a);

      audio.addEventListener('timeupdate', () => {
        this.currentTime = audio.currentTime;
        if (audio.duration && !isNaN(audio.duration)) {
          this.duration = audio.duration;
        }
        this.notify();
      });

      audio.addEventListener('loadedmetadata', () => {
        if (audio.duration && !isNaN(audio.duration)) {
          this.duration = audio.duration;
        }
        this.notify();
      });

      audio.addEventListener('play', () => {
        this.musicPlaying = true;
        this.notify();
      });

      audio.addEventListener('pause', () => {
        this.musicPlaying = false;
        this.notify();
      });

      audio.addEventListener('ended', () => {
        this.musicPlaying = false;
        this.notify();
      });

      this.audioElement = audio;
    } catch (e) {
      console.warn('Audio element initialization failed:', e);
    }
  }

  initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Soundtrack controls
  async playMusic() {
    this.initAudioElement();
    if (!this.audioElement) return;

    try {
      this.initContext();
      this.audioElement.volume = this.isMuted ? 0 : this.volume;
      await this.audioElement.play();
      this.musicPlaying = true;
      this.notify();
    } catch (err) {
      console.warn('Autoplay prevented by browser policy. User gesture required.', err);
      this.musicPlaying = false;
      this.notify();
    }
  }

  pauseMusic() {
    if (!this.audioElement) return;
    this.audioElement.pause();
    this.musicPlaying = false;
    this.notify();
  }

  async toggleMusic() {
    this.initAudioElement();
    if (this.musicPlaying) {
      this.pauseMusic();
    } else {
      await this.playMusic();
    }
  }

  setVolume(newVol) {
    const clamped = Math.max(0, Math.min(1, newVol));
    this.volume = clamped;
    this.isMuted = clamped === 0;

    if (this.audioElement) {
      this.audioElement.volume = clamped;
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem('portfolio_music_vol', String(clamped));
    }
    this.notify();
  }

  toggleMute() {
    if (this.isMuted) {
      this.isMuted = false;
      if (this.volume === 0) this.volume = 0.45;
      if (this.audioElement) this.audioElement.volume = this.volume;
    } else {
      this.isMuted = true;
      if (this.audioElement) this.audioElement.volume = 0;
    }
    this.notify();
  }

  seek(seconds) {
    if (this.audioElement && this.duration) {
      const clamped = Math.max(0, Math.min(this.duration, seconds));
      this.audioElement.currentTime = clamped;
      this.currentTime = clamped;
      this.notify();
    }
  }

  // SFX controls
  toggleSfx() {
    this.sfxEnabled = !this.sfxEnabled;
    if (typeof window !== 'undefined') {
      localStorage.setItem('portfolio_sfx_enabled', String(this.sfxEnabled));
    }
    if (this.sfxEnabled) {
      this.playToggle(true);
    }
    this.notify();
    return this.sfxEnabled;
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    const state = this.getState();
    for (const listener of this.listeners) {
      try {
        listener(state);
      } catch (e) {
        console.error('Error notifying audio listener:', e);
      }
    }
  }

  getState() {
    return {
      musicPlaying: this.musicPlaying,
      volume: this.volume,
      isMuted: this.isMuted,
      currentTime: this.currentTime,
      duration: this.duration || 144,
      sfxEnabled: this.sfxEnabled,
      trackInfo: TRACK_INFO,
    };
  }

  // Legacy compat getter for components expecting soundEngine.enabled
  get enabled() {
    return this.musicPlaying || this.sfxEnabled;
  }

  toggle() {
    // Master toggle: toggle soundtrack playback
    this.toggleMusic();
  }

  // Web Audio API Synthesizers for UI feedback
  playHover() {
    if (!this.sfxEnabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(900, now);
      osc.frequency.exponentialRampToValueAtTime(1400, now + 0.04);

      gain.gain.setValueAtTime(0.02, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.045);
    } catch (e) {}
  }

  playClick() {
    if (!this.sfxEnabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(700, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.06);

      gain.gain.setValueAtTime(0.035, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.065);
    } catch (e) {}
  }

  playToggle(turningOn) {
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      if (turningOn) {
        osc.frequency.setValueAtTime(500, now);
        osc.frequency.exponentialRampToValueAtTime(1100, now + 0.08);
      } else {
        osc.frequency.setValueAtTime(1100, now);
        osc.frequency.exponentialRampToValueAtTime(500, now + 0.08);
      }

      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.085);
    } catch (e) {}
  }

  playModalOpen() {
    if (!this.sfxEnabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const freqs = [440, 660, 880];

      freqs.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + 0.16 + idx * 0.04);

        gain.gain.setValueAtTime(0.018, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.23);
      });
    } catch (e) {}
  }

  playSuccess() {
    if (!this.sfxEnabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99];

      notes.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        const start = now + i * 0.07;
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.03, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.18);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(start);
        osc.stop(start + 0.19);
      });
    } catch (e) {}
  }

  playCelestialChime(pitchMultiplier = 1.0) {
    if (!this.sfxEnabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const baseHarmonics = [1318.51, 1661.22, 1975.53, 2637.02];

      baseHarmonics.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        const start = now + idx * 0.035;
        const targetFreq = freq * pitchMultiplier;
        osc.frequency.setValueAtTime(targetFreq, start);
        osc.frequency.exponentialRampToValueAtTime(targetFreq * 1.05, start + 0.35);

        gain.gain.setValueAtTime(0.018, start);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.45);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(start);
        osc.stop(start + 0.48);
      });
    } catch (e) {}
  }

  playMeteorSwoosh() {
    if (!this.sfxEnabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.5);

      gain.gain.setValueAtTime(0.02, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.52);
    } catch (e) {}
  }
}

export const soundEngine = new SoundEngine();

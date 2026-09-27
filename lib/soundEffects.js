// Silent Audio & SFX stub - audio features disabled
export const TRACK_INFO = {
  title: '',
  artist: '',
  badge: '',
  youtubeUrl: '',
  audioSources: [],
};

class SoundEngine {
  constructor() {
    this.sfxEnabled = false;
    this.musicPlaying = false;
    this.volume = 0;
    this.isMuted = true;
    this.currentTime = 0;
    this.duration = 0;
    this.listeners = new Set();
  }

  playMusic() {}
  pauseMusic() {}
  toggleMusic() {}
  setVolume() {}
  toggleMute() {}
  seek() {}
  toggleSfx() { return false; }
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
  notify() {}
  getState() {
    return {
      musicPlaying: false,
      volume: 0,
      isMuted: true,
      currentTime: 0,
      duration: 0,
      sfxEnabled: false,
      trackInfo: TRACK_INFO,
    };
  }
  get enabled() {
    return false;
  }
  toggle() {}
  playHover() {}
  playClick() {}
  playToggle() {}
  playModalOpen() {}
  playSuccess() {}
  playCelestialChime() {}
  playMeteorSwoosh() {}
}

export const soundEngine = new SoundEngine();

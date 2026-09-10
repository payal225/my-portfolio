// Reactive state manager for the interactive 3D galaxy background
// Zero external dependencies, pub/sub architecture for 60 FPS Three.js rendering

export const GALAXY_THEMES = {
  sapphire: {
    id: 'sapphire',
    name: 'Deep Sapphire',
    tagline: 'Deep Cosmic Indigo & Celestial Azure',
    insideColor: '#fffdf5',  // Luminous stellar core
    midColor: '#6366f1',     // Royal indigo / violet
    outsideColor: '#0284c7', // Deep ocean azure
    dustColor: [0.12, 0.1, 0.35], // Low brightness rgb
    coreGlow: '#38bdf8',
    gradient: 'linear-gradient(135deg, #fef08a 0%, #6366f1 50%, #0284c7 100%)',
    chipColor: '#38bdf8',
  },
  rose: {
    id: 'rose',
    name: 'Rose Nebula',
    tagline: 'Cosmic Magenta & Warm Soft Rose',
    insideColor: '#fff1f2',
    midColor: '#db2777',
    outsideColor: '#f43f5e',
    dustColor: [0.28, 0.05, 0.16],
    coreGlow: '#fb7185',
    gradient: 'linear-gradient(135deg, #fff1f2 0%, #db2777 50%, #f43f5e 100%)',
    chipColor: '#f43f5e',
  },
  emerald: {
    id: 'emerald',
    name: 'Emerald Aurora',
    tagline: 'Radiant Golden Core & Mint Emerald',
    insideColor: '#fefce8',
    midColor: '#10b981',
    outsideColor: '#06b6d4',
    dustColor: [0.03, 0.22, 0.16],
    coreGlow: '#34d399',
    gradient: 'linear-gradient(135deg, #fefce8 0%, #10b981 50%, #06b6d4 100%)',
    chipColor: '#10b981',
  },
  solar: {
    id: 'solar',
    name: 'Solar Flare',
    tagline: 'Blazing White Core & Fiery Amber',
    insideColor: '#ffffff',
    midColor: '#f59e0b',
    outsideColor: '#ea580c',
    dustColor: [0.28, 0.12, 0.02],
    coreGlow: '#fbbf24',
    gradient: 'linear-gradient(135deg, #ffffff 0%, #f59e0b 50%, #ea580c 100%)',
    chipColor: '#f59e0b',
  },
};

export const TILT_MODES = {
  oblique: {
    id: 'oblique',
    label: 'Oblique (56°)',
    rotX: Math.PI / 3.2,
    rotY: -Math.PI / 5.5,
  },
  faceOn: {
    id: 'faceOn',
    label: 'Face-On (Top)',
    rotX: 0.18,
    rotY: 0.0,
  },
  edgeOn: {
    id: 'edgeOn',
    label: 'Edge-On (Disk)',
    rotX: Math.PI / 2.05,
    rotY: -0.15,
  },
};

const DEFAULT_STATE = {
  theme: 'sapphire',
  twist: 1.35,     // range: 0.5 to 2.5
  speed: 1.0,      // range: 0 to 3.0
  starSize: 0.115, // range: 0.08 to 0.22
  tilt: 'oblique',  // oblique, faceOn, edgeOn
  customizerOpen: false,
};

const STORAGE_KEY = 'payal_galaxy_customizer_v1';

class GalaxyManager {
  constructor() {
    this.state = { ...DEFAULT_STATE };
    this.listeners = new Set();
    this.loadFromStorage();
  }

  loadFromStorage() {
    if (typeof window === 'undefined') return;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (GALAXY_THEMES[parsed.theme]) {
          this.state.theme = parsed.theme;
        }
        if (typeof parsed.twist === 'number') {
          this.state.twist = Math.max(0.5, Math.min(2.5, parsed.twist));
        }
        if (typeof parsed.speed === 'number') {
          this.state.speed = Math.max(0, Math.min(3.0, parsed.speed));
        }
        if (typeof parsed.starSize === 'number') {
          this.state.starSize = Math.max(0.08, Math.min(0.22, parsed.starSize));
        }
        if (TILT_MODES[parsed.tilt]) {
          this.state.tilt = parsed.tilt;
        }
      }
    } catch {
      // Ignore storage errors gracefully
    }
  }

  saveToStorage() {
    if (typeof window === 'undefined') return;
    try {
      const toSave = {
        theme: this.state.theme,
        twist: this.state.twist,
        speed: this.state.speed,
        starSize: this.state.starSize,
        tilt: this.state.tilt,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch {
      // Storage unavailable or disabled
    }
  }

  getState() {
    return { ...this.state };
  }

  getThemeConfig() {
    return GALAXY_THEMES[this.state.theme] || GALAXY_THEMES.sapphire;
  }

  getTiltConfig() {
    return TILT_MODES[this.state.tilt] || TILT_MODES.oblique;
  }

  setTheme(themeId) {
    if (!GALAXY_THEMES[themeId]) return;
    this.state.theme = themeId;
    this.saveToStorage();
    this.notify({ type: 'theme', value: themeId });
  }

  setTwist(twistVal) {
    const val = Math.max(0.5, Math.min(2.5, parseFloat(twistVal) || 1.35));
    this.state.twist = val;
    this.saveToStorage();
    this.notify({ type: 'twist', value: val });
  }

  setSpeed(speedVal) {
    const val = Math.max(0, Math.min(3.0, parseFloat(speedVal) || 1.0));
    this.state.speed = val;
    this.saveToStorage();
    this.notify({ type: 'speed', value: val });
  }

  setStarSize(sizeVal) {
    const val = Math.max(0.08, Math.min(0.22, parseFloat(sizeVal) || 0.115));
    this.state.starSize = val;
    this.saveToStorage();
    this.notify({ type: 'starSize', value: val });
  }

  setTilt(tiltId) {
    if (!TILT_MODES[tiltId]) return;
    this.state.tilt = tiltId;
    this.saveToStorage();
    this.notify({ type: 'tilt', value: tiltId });
  }

  toggleOpen() {
    this.state.customizerOpen = !this.state.customizerOpen;
    this.notify({ type: 'ui' });
  }

  setOpen(isOpen) {
    this.state.customizerOpen = !!isOpen;
    this.notify({ type: 'ui' });
  }

  resetDefaults() {
    this.state = { ...DEFAULT_STATE, customizerOpen: this.state.customizerOpen };
    this.saveToStorage();
    this.notify({ type: 'reset' });
  }

  triggerMeteorShower(count = 7) {
    this.notify({ type: 'meteor_shower', count: count || 7 });
  }

  triggerSingleMeteor(originX, originY) {
    this.notify({ type: 'meteor_single', originX, originY });
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify(event) {
    this.listeners.forEach((fn) => {
      try {
        fn(this.getState(), event);
      } catch (err) {
        console.error('GalaxyManager subscriber error:', err);
      }
    });
  }
}

export const galaxyManager = new GalaxyManager();

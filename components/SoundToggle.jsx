'use client';

import { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { soundEngine, TRACK_INFO } from '../lib/soundEffects';

export default function SoundToggle() {
  const [state, setState] = useState(() => soundEngine.getState());

  useEffect(() => {
    const unsubscribe = soundEngine.subscribe((newState) => {
      setState(newState);
    });
    return unsubscribe;
  }, []);

  const handleToggle = () => {
    soundEngine.playClick();
    soundEngine.toggleMusic();
  };

  const isAudioActive = state.musicPlaying;

  return (
    <button
      onClick={handleToggle}
      className={`sound-toggle-btn ${isAudioActive ? 'sound-active' : 'sound-muted'}`}
      title={
        isAudioActive
          ? `Now Playing: ${TRACK_INFO.title} — ${TRACK_INFO.artist} (Click to pause)`
          : `Play Soundtrack: ${TRACK_INFO.title} — ${TRACK_INFO.artist}`
      }
      aria-label="Toggle Soundtrack"
    >
      {isAudioActive ? (
        <Volume2 size={16} color="var(--neon-cyan)" />
      ) : (
        <VolumeX size={16} color="rgba(255, 255, 255, 0.65)" />
      )}
    </button>
  );
}

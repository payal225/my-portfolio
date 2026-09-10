'use client';

import { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  Volume2,
  Volume1,
  VolumeX,
  Disc3,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Radio,
  Music,
} from 'lucide-react';
import { soundEngine, TRACK_INFO } from '../lib/soundEffects';

function formatTime(seconds) {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export default function MusicPlayer() {
  const [state, setState] = useState(() => soundEngine.getState());
  const [minimized, setMinimized] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const unsubscribe = soundEngine.subscribe((newState) => {
      setState(newState);
    });
    return unsubscribe;
  }, []);

  const handlePlayToggle = (e) => {
    e.stopPropagation();
    soundEngine.playClick();
    soundEngine.toggleMusic();
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const seekTime = pos * (state.duration || 144);
    soundEngine.seek(seekTime);
  };

  const handleVolumeChange = (e) => {
    const newVol = parseFloat(e.target.value);
    soundEngine.setVolume(newVol);
  };

  const handleMuteToggle = (e) => {
    e.stopPropagation();
    soundEngine.playClick();
    soundEngine.toggleMute();
  };

  const progressPercent = state.duration
    ? Math.min(100, (state.currentTime / state.duration) * 100)
    : 0;

  return (
    <aside
      className={`cyber-player-container ${minimized ? 'is-minimized' : 'is-expanded'} ${
        state.musicPlaying ? 'is-playing' : ''
      }`}
      aria-label="Soundtrack Player"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Minimized Pill Mode */}
      {minimized ? (
        <div
          className="cyber-player-pill"
          onClick={() => {
            soundEngine.playClick();
            setMinimized(false);
          }}
          title="Click to expand audio player"
        >
          <div className="pill-disc-wrapper">
            <Disc3
              size={18}
              className={`pill-disc-icon ${state.musicPlaying ? 'spin-disc' : ''}`}
            />
          </div>

          <div className="pill-info">
            <span className="pill-track">{TRACK_INFO.title}</span>
            <span className="pill-artist"> — {TRACK_INFO.artist}</span>
          </div>

          {state.musicPlaying && (
            <div className="pill-eq">
              <span className="pill-eq-bar bar-1"></span>
              <span className="pill-eq-bar bar-2"></span>
              <span className="pill-eq-bar bar-3"></span>
            </div>
          )}

          <button
            onClick={handlePlayToggle}
            className="pill-play-btn"
            title={state.musicPlaying ? 'Pause Soundtrack' : 'Play Soundtrack'}
            aria-label="Toggle Playback"
          >
            {state.musicPlaying ? <Pause size={14} /> : <Play size={14} className="ml-05" />}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              soundEngine.playClick();
              setMinimized(false);
            }}
            className="pill-expand-btn"
            title="Expand Player"
            aria-label="Expand Player"
          >
            <ChevronUp size={16} />
          </button>
        </div>
      ) : (
        /* Expanded Deck Mode */
        <div className="cyber-player-card">
          {/* Deck Header */}
          <div className="player-header">
            <div className="player-badge">
              <Radio size={12} className="pulse-cyan" />
              <span>NOW PLAYING</span>
            </div>
            <div className="player-header-actions">
              <a
                href={TRACK_INFO.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="player-yt-link"
                title="View original video on YouTube"
                onClick={() => soundEngine.playClick()}
              >
                <ExternalLink size={13} />
                <span>YouTube</span>
              </a>
              <button
                onClick={() => {
                  soundEngine.playClick();
                  setMinimized(true);
                }}
                className="player-minimize-btn"
                title="Minimize player"
                aria-label="Minimize player"
              >
                <ChevronDown size={16} />
              </button>
            </div>
          </div>

          {/* Track Display */}
          <div className="player-track-body">
            <div className="player-art-frame">
              <div className={`player-vinyl-disc ${state.musicPlaying ? 'spin-disc' : ''}`}>
                <div className="vinyl-grooves"></div>
                <div className="vinyl-center">
                  <Music size={12} color="#38bdf8" />
                </div>
              </div>
            </div>

            <div className="player-meta">
              <div className="player-title-row">
                <h4 className="player-song-title">{TRACK_INFO.title}</h4>
                <span className="player-theme-tag">Obsession 2026</span>
              </div>
              <p className="player-artist-name">{TRACK_INFO.artist}</p>
              <div className="player-status-row">
                <span className="player-source-note">End Credits Theme</span>
                {state.musicPlaying && (
                  <div className="player-mini-bars">
                    <span className="bar bar-a"></span>
                    <span className="bar bar-b"></span>
                    <span className="bar bar-c"></span>
                    <span className="bar bar-d"></span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Timeline Scrubber */}
          <div className="player-progress-area">
            <div
              className="player-scrubber-track"
              onClick={handleSeek}
              title="Click to seek"
            >
              <div
                className="player-scrubber-fill"
                style={{ width: `${progressPercent}%` }}
              >
                <div className="scrubber-thumb"></div>
              </div>
            </div>
            <div className="player-time-row">
              <span className="time-curr">{formatTime(state.currentTime)}</span>
              <span className="time-dur">{formatTime(state.duration)}</span>
            </div>
          </div>

          {/* Controls Footer */}
          <div className="player-controls">
            <div className="volume-control-group">
              <button
                onClick={handleMuteToggle}
                className="control-icon-btn mute-btn"
                title={state.isMuted ? 'Unmute' : 'Mute'}
                aria-label="Toggle Mute"
              >
                {state.isMuted || state.volume === 0 ? (
                  <VolumeX size={15} color="rgba(255, 255, 255, 0.4)" />
                ) : state.volume < 0.5 ? (
                  <Volume1 size={15} color="#00f7ff" />
                ) : (
                  <Volume2 size={15} color="#00f7ff" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.02"
                value={state.isMuted ? 0 : state.volume}
                onChange={handleVolumeChange}
                className="player-volume-slider"
                title={`Volume: ${Math.round((state.isMuted ? 0 : state.volume) * 100)}%`}
                aria-label="Volume slider"
              />
            </div>

            <button
              onClick={handlePlayToggle}
              className={`player-main-play-btn ${state.musicPlaying ? 'playing' : ''}`}
              title={state.musicPlaying ? 'Pause Soundtrack' : 'Play Soundtrack'}
              aria-label={state.musicPlaying ? 'Pause' : 'Play'}
            >
              {state.musicPlaying ? (
                <Pause size={18} color="#050811" />
              ) : (
                <Play size={18} color="#050811" className="play-icon-offset" />
              )}
            </button>

            <button
              onClick={() => {
                soundEngine.toggleSfx();
              }}
              className={`player-sfx-pill ${state.sfxEnabled ? 'sfx-active' : 'sfx-muted'}`}
              title={state.sfxEnabled ? 'Sci-Fi UI Clicks & Chimes: Active' : 'Sci-Fi UI SFX: Off'}
            >
              <span>SFX</span>
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}

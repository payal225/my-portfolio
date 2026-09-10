'use client';

import { useState, useEffect } from 'react';
import {
  Sparkles,
  Sliders,
  RotateCw,
  Compass,
  ChevronUp,
  ChevronDown,
  X,
  RefreshCw,
  Eye,
  Check,
} from 'lucide-react';
import { galaxyManager, GALAXY_THEMES, TILT_MODES } from '../lib/galaxyManager';
import { soundEngine } from '../lib/soundEffects';
import { showToast } from '../lib/toastManager';

export default function GalaxyCustomizer() {
  const [state, setState] = useState(() => galaxyManager.getState());
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const unsub = galaxyManager.subscribe((newState) => {
      setState(newState);
    });
    return unsub;
  }, []);

  const currentTheme = GALAXY_THEMES[state.theme] || GALAXY_THEMES.sapphire;

  const handleSelectTheme = (themeId) => {
    soundEngine.playClick();
    galaxyManager.setTheme(themeId);
    const theme = GALAXY_THEMES[themeId];
    showToast({
      title: `Theme: ${theme.name}`,
      message: theme.tagline,
      type: 'info',
    });
  };

  const handleTwistChange = (e) => {
    const val = parseFloat(e.target.value);
    galaxyManager.setTwist(val);
  };

  const handleSpeedChange = (e) => {
    const val = parseFloat(e.target.value);
    galaxyManager.setSpeed(val);
  };

  const handleStarSizeChange = (e) => {
    const val = parseFloat(e.target.value);
    galaxyManager.setStarSize(val);
  };

  const handleTiltSelect = (tiltKey) => {
    soundEngine.playClick();
    galaxyManager.setTilt(tiltKey);
    const tilt = TILT_MODES[tiltKey];
    showToast({
      title: `Galaxy Angle: ${tilt.label}`,
      message: 'Smoothly gliding into orbital perspective',
      type: 'info',
    });
  };

  const handleReset = () => {
    soundEngine.playClick();
    galaxyManager.resetDefaults();
    showToast({
      title: 'Galaxy Reset',
      message: 'Restored default Deep Sapphire spiral parameters',
      type: 'success',
    });
  };

  const handleMeteorShower = () => {
    soundEngine.playClick();
    galaxyManager.triggerMeteorShower(8);
    showToast({
      title: '🌠 Meteor Shower Cascading',
      message: 'Shooting stars streaking across the spiral arms!',
      type: 'info',
    });
  };

  return (
    <aside
      className="galaxy-customizer-container"
      aria-label="3D Galaxy Background Customizer"
    >
      {!isOpen ? (
        /* Minimized Floating Pill */
        <button
          type="button"
          onClick={() => {
            soundEngine.playClick();
            setIsOpen(true);
          }}
          className="galaxy-pill-btn"
          title="Customize 3D Floating Galaxy"
          aria-expanded={false}
        >
          <div className="galaxy-pill-indicator">
            <span
              className="galaxy-pill-swatch"
              style={{ background: currentTheme.gradient }}
            />
            <span className="galaxy-pill-pulse" />
          </div>
          <span className="galaxy-pill-text">Galaxy Controls</span>
          <span className="galaxy-pill-tag">{currentTheme.name.split(' ')[0]}</span>
          <Sliders size={14} className="galaxy-pill-icon" />
        </button>
      ) : (
        /* Expanded HUD Drawer */
        <div className="galaxy-hud-card">
          {/* Card Header */}
          <div className="galaxy-hud-header">
            <div className="galaxy-hud-title-group">
              <div
                className="galaxy-hud-icon-badge"
                style={{
                  background: `radial-gradient(circle, ${currentTheme.chipColor}25 0%, transparent 70%)`,
                  borderColor: `${currentTheme.chipColor}40`,
                }}
              >
                <Sparkles size={14} color={currentTheme.chipColor} />
              </div>
              <div>
                <h4 className="galaxy-hud-title">COSMIC CONTROLLER</h4>
                <p className="galaxy-hud-subtitle">3D Floating Spiral Galaxy</p>
              </div>
            </div>

            <div className="galaxy-hud-actions">
              <button
                type="button"
                onClick={handleReset}
                className="galaxy-hud-action-btn"
                title="Reset to default settings"
                aria-label="Reset galaxy parameters"
              >
                <RefreshCw size={13} />
              </button>
              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  setIsOpen(false);
                }}
                className="galaxy-hud-action-btn close-btn"
                title="Minimize controller"
                aria-label="Minimize galaxy controller"
              >
                <ChevronDown size={15} />
              </button>
            </div>
          </div>

          {/* Theme Color Presets */}
          <div className="galaxy-section">
            <div className="galaxy-section-header">
              <span className="galaxy-section-label">COSMIC COLOR THEME</span>
              <span className="galaxy-section-badge">{currentTheme.name}</span>
            </div>
            <div className="galaxy-theme-grid">
              {Object.values(GALAXY_THEMES).map((thm) => {
                const isActive = state.theme === thm.id;
                return (
                  <button
                    key={thm.id}
                    type="button"
                    onClick={() => handleSelectTheme(thm.id)}
                    className={`galaxy-theme-chip ${isActive ? 'active' : ''}`}
                    style={{
                      borderColor: isActive ? thm.chipColor : 'transparent',
                      boxShadow: isActive ? `0 0 14px ${thm.chipColor}35` : 'none',
                    }}
                  >
                    <span
                      className="galaxy-chip-circle"
                      style={{ background: thm.gradient }}
                    >
                      {isActive && <Check size={11} color="#ffffff" strokeWidth={3} />}
                    </span>
                    <span className="galaxy-chip-label">{thm.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sliders Area */}
          <div className="galaxy-section">
            <div className="galaxy-section-header">
              <span className="galaxy-section-label">DYNAMICS & GEOMETRY</span>
            </div>

            {/* Slider: Spiral Twist */}
            <div className="galaxy-slider-row">
              <div className="galaxy-slider-info">
                <span className="galaxy-param-name">Spiral Twist</span>
                <span className="galaxy-param-val">{state.twist.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.5"
                step="0.05"
                value={state.twist}
                onChange={handleTwistChange}
                className="galaxy-range-input"
                aria-label="Adjust galaxy spiral twist"
              />
            </div>

            {/* Slider: Rotation Speed */}
            <div className="galaxy-slider-row">
              <div className="galaxy-slider-info">
                <span className="galaxy-param-name">Galactic Spin Speed</span>
                <span className="galaxy-param-val">
                  {state.speed === 0 ? 'Paused' : `${state.speed.toFixed(1)}x`}
                </span>
              </div>
              <input
                type="range"
                min="0.0"
                max="3.0"
                step="0.1"
                value={state.speed}
                onChange={handleSpeedChange}
                className="galaxy-range-input"
                aria-label="Adjust galaxy rotation speed"
              />
            </div>

            {/* Slider: Star Size */}
            <div className="galaxy-slider-row">
              <div className="galaxy-slider-info">
                <span className="galaxy-param-name">Particle Point Size</span>
                <span className="galaxy-param-val">
                  {(state.starSize * 100).toFixed(0)}%
                </span>
              </div>
              <input
                type="range"
                min="0.08"
                max="0.22"
                step="0.01"
                value={state.starSize}
                onChange={handleStarSizeChange}
                className="galaxy-range-input"
                aria-label="Adjust galaxy star particle size"
              />
            </div>
          </div>

          {/* 3D Tilt View Angle Modes */}
          <div className="galaxy-section">
            <div className="galaxy-section-header">
              <span className="galaxy-section-label">PERSPECTIVE ANGLE</span>
            </div>
            <div className="galaxy-tilt-grid">
              {Object.entries(TILT_MODES).map(([key, mode]) => {
                const isActive = state.tilt === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleTiltSelect(key)}
                    className={`galaxy-tilt-btn ${isActive ? 'active' : ''}`}
                  >
                    <Compass size={12} className="tilt-icon" />
                    <span>{mode.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Celestial Events: Meteor Shower */}
          <div className="galaxy-section">
            <div className="galaxy-section-header">
              <span className="galaxy-section-label">CELESTIAL EVENTS</span>
              <span className="galaxy-section-badge">Click Space To Shoot</span>
            </div>
            <button
              type="button"
              onClick={handleMeteorShower}
              className="galaxy-meteor-btn"
            >
              <Sparkles size={14} className="meteor-btn-sparkle" />
              <span>Unleash Meteor Shower</span>
              <span className="meteor-btn-tag">Cascade</span>
            </button>
          </div>

          {/* HUD Footer */}
          <div className="galaxy-hud-footer">
            <span className="galaxy-hud-status">
              <span className="status-dot"></span> 9,500 WebGL Stars @ 60 FPS
            </span>
            <span className="galaxy-hud-hint">Auto-saved</span>
          </div>
        </div>
      )}
    </aside>
  );
}

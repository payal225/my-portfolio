'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Terminal,
  Search,
  FileText,
  Download,
  Music,
  Volume2,
  FolderGit2,
  Award,
  Send,
  User,
  GraduationCap,
  CornerDownLeft,
  X,
  Sparkles,
  Box,
  Paintbrush,
} from 'lucide-react';
import { soundEngine, TRACK_INFO } from '../lib/soundEffects';
import { showToast } from '../lib/toastManager';
import { portfolioData } from '../data/portfolioData';
import { galaxyManager } from '../lib/galaxyManager';

export default function CommandPalette({ isOpen, onClose, onOpenCV, onOpenProject, onSelectDesign }) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  // Define commands
  const allCommands = [
    {
      id: 'cv',
      category: 'Documentation',
      title: 'Open Official 1:1 CV',
      subtitle: 'Sister Nivedita University • B.Tech CSE (8.58 CGPA)',
      icon: <FileText size={16} color="#00f7ff" />,
      action: () => {
        onClose();
        if (onOpenCV) onOpenCV();
      },
    },
    {
      id: 'download-pdf',
      category: 'Documentation',
      title: 'Download Resume PDF',
      subtitle: 'A4 formatted LaTeX official CV',
      icon: <Download size={16} color="#00f7ff" />,
      action: () => {
        onClose();
        const a = document.createElement('a');
        a.href = '/Payal_Resume.pdf';
        a.download = 'Payal_Ghosh_Resume.pdf';
        a.click();
        showToast({ title: 'Download Started', message: 'Payal_Ghosh_Resume.pdf', type: 'success' });
      },
    },
    {
      id: 'music-toggle',
      category: 'Audio Control',
      title: 'Toggle Soundtrack Playback',
      subtitle: `${TRACK_INFO.title} — ${TRACK_INFO.artist} (Obsession End Credits Theme)`,
      icon: <Music size={16} color="#a855f7" />,
      action: () => {
        soundEngine.toggleMusic();
        const state = soundEngine.getState();
        showToast({
          title: state.musicPlaying ? 'Soundtrack Playing' : 'Soundtrack Paused',
          message: `${TRACK_INFO.title} — ${TRACK_INFO.artist}`,
          type: 'info',
        });
      },
    },
    {
      id: 'sfx-toggle',
      category: 'Audio Control',
      title: 'Toggle UI Sound Effects',
      subtitle: 'Subtle tactile feedback for button clicks and hovers',
      icon: <Volume2 size={16} color="#a855f7" />,
      action: () => {
        const newState = soundEngine.toggleSfx();
        showToast({
          title: newState ? 'UI Audio: Enabled' : 'UI Audio: Muted',
          message: 'Sound feedback preference updated',
          type: 'info',
        });
      },
    },
    {
      id: 'galaxy-theme-sapphire',
      category: 'Cosmic Galaxy',
      title: 'Galaxy Theme: Deep Sapphire',
      subtitle: 'Warm gold core, deep royal indigo & celestial azure spiral arms',
      icon: <Sparkles size={16} color="#38bdf8" />,
      action: () => {
        onClose();
        galaxyManager.setTheme('sapphire');
        showToast({
          title: 'Theme: Deep Sapphire',
          message: 'Deep Cosmic Indigo & Celestial Azure',
          type: 'info',
        });
      },
    },
    {
      id: 'galaxy-theme-rose',
      category: 'Cosmic Galaxy',
      title: 'Galaxy Theme: Rose Nebula',
      subtitle: 'Diamond starlight core, cosmic magenta & soft rose arms',
      icon: <Sparkles size={16} color="#fb7185" />,
      action: () => {
        onClose();
        galaxyManager.setTheme('rose');
        showToast({
          title: 'Theme: Rose Nebula',
          message: 'Cosmic Magenta & Warm Soft Rose',
          type: 'info',
        });
      },
    },
    {
      id: 'galaxy-theme-emerald',
      category: 'Cosmic Galaxy',
      title: 'Galaxy Theme: Emerald Aurora',
      subtitle: 'Radiant golden core, mint emerald & deep cyan spiral arms',
      icon: <Sparkles size={16} color="#34d399" />,
      action: () => {
        onClose();
        galaxyManager.setTheme('emerald');
        showToast({
          title: 'Theme: Emerald Aurora',
          message: 'Radiant Golden Core & Mint Emerald',
          type: 'info',
        });
      },
    },
    {
      id: 'galaxy-theme-solar',
      category: 'Cosmic Galaxy',
      title: 'Galaxy Theme: Solar Flare',
      subtitle: 'Blazing white core, warm gold & fiery vermilion arms',
      icon: <Sparkles size={16} color="#fbbf24" />,
      action: () => {
        onClose();
        galaxyManager.setTheme('solar');
        showToast({
          title: 'Theme: Solar Flare',
          message: 'Blazing White Core & Fiery Amber',
          type: 'info',
        });
      },
    },
    {
      id: 'galaxy-tilt-faceon',
      category: 'Cosmic Galaxy',
      title: 'Galaxy Perspective: Face-On (Top View)',
      subtitle: 'Glide camera to look directly into the 3D galactic disk',
      icon: <Sparkles size={16} color="#38bdf8" />,
      action: () => {
        onClose();
        galaxyManager.setTilt('faceOn');
        showToast({
          title: 'Galaxy Angle: Face-On',
          message: 'Smoothly gliding into orbital perspective',
          type: 'info',
        });
      },
    },
    {
      id: 'galaxy-tilt-edgeon',
      category: 'Cosmic Galaxy',
      title: 'Galaxy Perspective: Edge-On (Disk View)',
      subtitle: 'Glide camera into the horizontal plane of interstellar dust',
      icon: <Sparkles size={16} color="#38bdf8" />,
      action: () => {
        onClose();
        galaxyManager.setTilt('edgeOn');
        showToast({
          title: 'Galaxy Angle: Edge-On',
          message: 'Smoothly gliding into orbital perspective',
          type: 'info',
        });
      },
    },
    {
      id: 'galaxy-reset',
      category: 'Cosmic Galaxy',
      title: 'Reset Galaxy to Default',
      subtitle: 'Restore 1.35x spiral twist, 1.0x rotation speed & Deep Sapphire',
      icon: <Sparkles size={16} color="#a855f7" />,
      action: () => {
        onClose();
        galaxyManager.resetDefaults();
        showToast({
          title: 'Galaxy Reset',
          message: 'Restored default Deep Sapphire spiral parameters',
          type: 'success',
        });
      },
    },
    {
      id: 'galaxy-meteor-shower',
      category: 'Cosmic Galaxy',
      title: 'Unleash Cosmic Meteor Shower',
      subtitle: 'Trigger a radiant cascade of 8 shooting stars across the spiral arms',
      icon: <Sparkles size={16} color="#38bdf8" />,
      action: () => {
        onClose();
        galaxyManager.triggerMeteorShower(8);
        showToast({
          title: '🌠 Meteor Shower Cascading',
          message: 'Shooting stars streaking across the spiral arms!',
          type: 'info',
        });
      },
    },
    {
      id: 'nav-about',
      category: 'Navigation',
      title: 'Jump to About Me',
      subtitle: 'Bio, philosophy & engineering principles',
      icon: <User size={16} color="#38bdf8" />,
      action: () => {
        onClose();
        document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
      },
    },
    {
      id: 'nav-journey',
      category: 'Navigation',
      title: 'Jump to Journey & Education',
      subtitle: 'Sister Nivedita University & DPS Ruby Park Timeline',
      icon: <GraduationCap size={16} color="#38bdf8" />,
      action: () => {
        onClose();
        document.getElementById('journey')?.scrollIntoView({ behavior: 'smooth' });
      },
    },
    {
      id: 'nav-skills',
      category: 'Navigation',
      title: 'Jump to Skills Bento',
      subtitle: 'MERN, Python, C++, Google Cloud & DevOps',
      icon: <Sparkles size={16} color="#38bdf8" />,
      action: () => {
        onClose();
        document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' });
      },
    },
    {
      id: 'nav-projects',
      category: 'Navigation',
      title: 'Jump to Featured Projects',
      subtitle: 'HabitFlow, TripNest & Mini ERP System',
      icon: <FolderGit2 size={16} color="#38bdf8" />,
      action: () => {
        onClose();
        document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
      },
    },
    {
      id: 'proj-habitflow',
      category: 'Projects',
      title: 'Inspect HabitFlow Architecture',
      subtitle: 'MERN habit tracker with streak engine & analytics',
      icon: <FolderGit2 size={16} color="#ec4899" />,
      action: () => {
        onClose();
        if (onOpenProject) onOpenProject('habitflow');
      },
    },
    {
      id: 'proj-tripnest',
      category: 'Projects',
      title: 'Inspect TripNest Architecture',
      subtitle: 'Full-stack travel booking & itinerary planner',
      icon: <FolderGit2 size={16} color="#ec4899" />,
      action: () => {
        onClose();
        if (onOpenProject) onOpenProject('tripnest');
      },
    },
    {
      id: 'proj-minierp',
      category: 'Projects',
      title: 'Inspect Mini ERP System Architecture',
      subtitle: 'Inventory, orders, stock alerts & PDF invoices',
      icon: <FolderGit2 size={16} color="#ec4899" />,
      action: () => {
        onClose();
        if (onOpenProject) onOpenProject('minierp');
      },
    },
    {
      id: 'nav-designs',
      category: 'Navigation',
      title: 'Jump to UI/UX Design Showcase',
      subtitle: 'Mobile apps, web dashboards & Figma design systems',
      icon: <Sparkles size={16} color="#00f7ff" />,
      action: () => {
        onClose();
        document.getElementById('designs')?.scrollIntoView({ behavior: 'smooth' });
      },
    },
    {
      id: '3d-blender-studio',
      category: '3D Models',
      title: 'Launch 3D Blender Model Studio',
      subtitle: 'Interactive 3D viewport with Donut, Cyber Car & Bonsai Tree',
      icon: <Box size={16} color="#00f7ff" />,
      action: () => {
        onClose();
        document.getElementById('designs')?.scrollIntoView({ behavior: 'smooth' });
      },
    },
    {
      id: 'design-cyber-pop',
      category: 'Digital Art',
      title: 'Inspect Neon Pop — Cyberpunk Retro Portrait',
      subtitle: 'Original digital art: 80s anime city-pop aesthetics & neon color blocking',
      icon: <Paintbrush size={16} color="#ec4899" />,
      action: () => {
        onClose();
        const d = portfolioData.designs.find((x) => x.id === 'cyber-pop-art');
        if (onSelectDesign && d) onSelectDesign(d);
      },
    },
    {
      id: 'design-manga-noir',
      category: 'Digital Art',
      title: 'Inspect Nocturne — Manga Noir Portrait',
      subtitle: 'Original digital art: layered hair linework, chiaroscuro shading & blush',
      icon: <Paintbrush size={16} color="#ec4899" />,
      action: () => {
        onClose();
        const d = portfolioData.designs.find((x) => x.id === 'manga-noir-art');
        if (onSelectDesign && d) onSelectDesign(d);
      },
    },
    {
      id: 'design-habitflow',
      category: 'Designs',
      title: 'Inspect HabitFlow Mobile UI',
      subtitle: 'Dark-mode habit tracker mobile app interface & dopamine rings',
      icon: <FileText size={16} color="#00f7ff" />,
      action: () => {
        onClose();
        const d = portfolioData.designs.find((x) => x.id === 'habitflow-mobile');
        if (onSelectDesign && d) onSelectDesign(d);
      },
    },
    {
      id: 'design-tripnest',
      category: 'Designs',
      title: 'Inspect TripNest Web UI',
      subtitle: 'Luxury travel itinerary dashboard & multi-day scheduling',
      icon: <FileText size={16} color="#a855f7" />,
      action: () => {
        onClose();
        const d = portfolioData.designs.find((x) => x.id === 'tripnest-web');
        if (onSelectDesign && d) onSelectDesign(d);
      },
    },
    {
      id: 'design-erp',
      category: 'Designs',
      title: 'Inspect Mini ERP Dashboard UI',
      subtitle: 'High-density telemetry dashboard with live stock charts',
      icon: <FileText size={16} color="#38bdf8" />,
      action: () => {
        onClose();
        const d = portfolioData.designs.find((x) => x.id === 'erp-dashboard');
        if (onSelectDesign && d) onSelectDesign(d);
      },
    },
    {
      id: 'design-cybercore',
      category: 'Designs',
      title: 'Inspect CyberCore Design System',
      subtitle: 'Atomic design tokens, color ramps & component primitives',
      icon: <FileText size={16} color="#ec4899" />,
      action: () => {
        onClose();
        const d = portfolioData.designs.find((x) => x.id === 'cybercore-system');
        if (onSelectDesign && d) onSelectDesign(d);
      },
    },
    {
      id: 'nav-certifications',
      category: 'Navigation',
      title: 'Jump to Google Cloud Certifications',
      subtitle: '4x Official Google Cloud Skill Badges',
      icon: <Award size={16} color="#38bdf8" />,
      action: () => {
        onClose();
        document.getElementById('certifications')?.scrollIntoView({ behavior: 'smooth' });
      },
    },
    {
      id: 'nav-connect',
      category: 'Navigation',
      title: 'Jump to Contact Terminal',
      subtitle: 'Send transmission or copy direct email',
      icon: <Send size={16} color="#38bdf8" />,
      action: () => {
        onClose();
        document.getElementById('connect')?.scrollIntoView({ behavior: 'smooth' });
      },
    },
    {
      id: 'action-copy-email',
      category: 'Contact',
      title: 'Copy Email Address',
      subtitle: portfolioData.email,
      icon: <Send size={16} color="#00f7ff" />,
      action: () => {
        onClose();
        navigator.clipboard.writeText(portfolioData.email);
        showToast({
          title: 'Email Copied to Clipboard',
          message: portfolioData.email,
          type: 'success',
        });
      },
    },
  ];

  // Filter commands
  const filtered = allCommands.filter((cmd) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      cmd.title.toLowerCase().includes(q) ||
      cmd.subtitle.toLowerCase().includes(q) ||
      cmd.category.toLowerCase().includes(q)
    );
  });

  // Keep selected index in range
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      soundEngine.playModalOpen();
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Global keydown listeners for Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open handled by parent or toggle
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      soundEngine.playHover();
      setSelectedIndex((prev) => (prev + 1) % (filtered.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      soundEngine.playHover();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % (filtered.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        soundEngine.playClick();
        filtered[selectedIndex].action();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="cmd-overlay" onClick={onClose}>
      <div
        className="cmd-modal-window"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Command Palette"
      >
        {/* Input Header */}
        <div className="cmd-search-bar">
          <div className="cmd-prompt-indicator">
            <Search size={18} color="#38bdf8" />
          </div>
          <input
            ref={inputRef}
            type="text"
            className="cmd-input-field"
            placeholder="Search projects, art, 3D models, or jump to section..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          {query && (
            <button
              className="cmd-clear-btn"
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
            >
              <X size={15} />
            </button>
          )}
          <div className="cmd-esc-badge" onClick={onClose}>
            ESC
          </div>
        </div>

        {/* Results List */}
        <div className="cmd-results-list" ref={listRef}>
          {filtered.length === 0 ? (
            <div className="cmd-empty-state">
              <Terminal size={28} color="rgba(255, 255, 255, 0.2)" />
              <p>No matching commands found for &ldquo;{query}&rdquo;</p>
              <span>Try typing &ldquo;cv&rdquo;, &ldquo;music&rdquo;, &ldquo;projects&rdquo;, or &ldquo;skills&rdquo;</span>
            </div>
          ) : (
            filtered.map((cmd, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={cmd.id}
                  className={`cmd-item ${isSelected ? 'is-selected' : ''}`}
                  onMouseEnter={() => {
                    soundEngine.playHover();
                    setSelectedIndex(idx);
                  }}
                  onClick={() => {
                    soundEngine.playClick();
                    cmd.action();
                  }}
                >
                  <div className="cmd-item-icon">{cmd.icon}</div>
                  <div className="cmd-item-text">
                    <div className="cmd-item-top">
                      <span className="cmd-item-title">{cmd.title}</span>
                      <span className="cmd-item-category">{cmd.category}</span>
                    </div>
                    <span className="cmd-item-subtitle">{cmd.subtitle}</span>
                  </div>
                  {isSelected && (
                    <div className="cmd-enter-hint">
                      <span>Jump</span>
                      <CornerDownLeft size={12} />
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="cmd-footer">
          <div className="cmd-keyboard-shortcuts">
            <span className="shortcut-group">
              <kbd className="kbd-chip">↑</kbd> <kbd className="kbd-chip">↓</kbd> Navigate
            </span>
            <span className="shortcut-group">
              <kbd className="kbd-chip">↵</kbd> Execute
            </span>
            <span className="shortcut-group">
              <kbd className="kbd-chip">ESC</kbd> Close
            </span>
          </div>
          <div className="cmd-footer-tag">
            <span>HUD COMMAND SYSTEM v2.6</span>
          </div>
        </div>
      </div>
    </div>
  );
}

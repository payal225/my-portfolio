'use client';

import { useState, useEffect } from 'react';
import { FileText, Menu, X, Terminal } from 'lucide-react';
import SoundToggle from './SoundToggle';
import { soundEngine } from '../lib/soundEffects';

export default function Navbar({ onOpenCV, onOpenCmd }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e, id) => {
    e.preventDefault();
    soundEngine.playClick();
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-container">
        <a
          href="#"
          className="navbar-logo"
          onMouseEnter={() => soundEngine.playHover()}
          onClick={(e) => {
            e.preventDefault();
            soundEngine.playClick();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <span>P</span>ayal
        </a>

        <nav className={`navbar-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <a
            href="#about"
            onMouseEnter={() => soundEngine.playHover()}
            onClick={(e) => scrollToSection(e, 'about')}
          >
            About
          </a>
          <a
            href="#journey"
            onMouseEnter={() => soundEngine.playHover()}
            onClick={(e) => scrollToSection(e, 'journey')}
          >
            Journey
          </a>
          <a
            href="#skills"
            onMouseEnter={() => soundEngine.playHover()}
            onClick={(e) => scrollToSection(e, 'skills')}
          >
            Skills
          </a>
          <a
            href="#projects"
            onMouseEnter={() => soundEngine.playHover()}
            onClick={(e) => scrollToSection(e, 'projects')}
          >
            Projects
          </a>
          <a
            href="#designs"
            onMouseEnter={() => soundEngine.playHover()}
            onClick={(e) => scrollToSection(e, 'designs')}
          >
            Designs
          </a>
          <a
            href="#certifications"
            onMouseEnter={() => soundEngine.playHover()}
            onClick={(e) => scrollToSection(e, 'certifications')}
          >
            Certifications
          </a>
          <a
            href="#connect"
            onMouseEnter={() => soundEngine.playHover()}
            onClick={(e) => scrollToSection(e, 'connect')}
          >
            Connect
          </a>

          <button
            onMouseEnter={() => soundEngine.playHover()}
            onClick={() => {
              soundEngine.playClick();
              if (onOpenCmd) onOpenCmd();
            }}
            className="nav-cmd-btn"
            title="Quick Search & Actions (Ctrl + K)"
          >
            <span>Search</span>
            <kbd className="cmd-kbd-badge">⌘K</kbd>
          </button>

          <button
            onMouseEnter={() => soundEngine.playHover()}
            onClick={() => {
              soundEngine.playClick();
              setMobileMenuOpen(false);
              if (onOpenCV) onOpenCV();
            }}
            className="nav-cv-btn"
            title="View 1:1 Official CV"
          >
            <FileText size={14} />
            <span>View CV</span>
          </button>

          <SoundToggle />
        </nav>

        <button
          className="mobile-menu-btn"
          onClick={() => {
            soundEngine.playClick();
            setMobileMenuOpen(!mobileMenuOpen);
          }}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={22} color="#ffffff" /> : <Menu size={22} color="#ffffff" />}
        </button>
      </div>
    </header>
  );
}

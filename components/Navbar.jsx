'use client';

import { useState, useEffect } from 'react';
import { FileText, Menu, X } from 'lucide-react';

export default function Navbar({ onOpenCV }) {
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
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <span>P</span>ayal
        </a>

        <nav className={`navbar-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <a
            href="#about"
            onClick={(e) => scrollToSection(e, 'about')}
          >
            About
          </a>
          <a
            href="#journey"
            onClick={(e) => scrollToSection(e, 'journey')}
          >
            Journey
          </a>
          <a
            href="#skills"
            onClick={(e) => scrollToSection(e, 'skills')}
          >
            Skills
          </a>
          <a
            href="#projects"
            onClick={(e) => scrollToSection(e, 'projects')}
          >
            Projects
          </a>
          <a
            href="#designs"
            onClick={(e) => scrollToSection(e, 'designs')}
          >
            Designs
          </a>
          <a
            href="#certifications"
            onClick={(e) => scrollToSection(e, 'certifications')}
          >
            Certifications
          </a>
          <a
            href="#connect"
            onClick={(e) => scrollToSection(e, 'connect')}
          >
            Connect
          </a>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              if (onOpenCV) onOpenCV();
            }}
            className="nav-cv-btn"
            title="View 1:1 Official CV"
          >
            <FileText size={14} />
            <span>View CV</span>
          </button>
        </nav>

        <button
          className="mobile-menu-btn"
          onClick={() => {
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

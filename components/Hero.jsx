'use client';

import { useState } from 'react';
import { portfolioData } from '../data/portfolioData';
import { ArrowDown, FileText, Send, Copy, Check, Sparkles, Terminal } from 'lucide-react';
import { soundEngine } from '../lib/soundEffects';
import { showToast } from '../lib/toastManager';

export default function Hero({ onOpenCV, onOpenCmd }) {
  const [copied, setCopied] = useState(false);

  const handleScrollToProjects = () => {
    soundEngine.playClick();
    const projectsEl = document.getElementById('projects');
    if (projectsEl) {
      projectsEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(portfolioData.email);
    soundEngine.playSuccess();
    setCopied(true);
    showToast({
      title: 'Email Copied to Clipboard',
      message: portfolioData.email,
      type: 'success',
    });
    setTimeout(() => setCopied(false), 2400);
  };

  return (
    <section className="overlay">
      <div
        className="hero-status-pill"
        onMouseEnter={() => soundEngine.playHover()}
      >
        <span className="status-indicator-ring">
          <span className="status-indicator-dot"></span>
        </span>
        <span>{portfolioData.status}</span>
      </div>

      <h1 className="hero-title">
        {portfolioData.headline}{' '}
        <span className="hero-gradient-name">{portfolioData.name}</span>
      </h1>

      <p className="hero-role">{portfolioData.role}</p>
      <p className="hero-bio">{portfolioData.bio}</p>

      <div className="hero-highlights">
        {portfolioData.highlights.map((highlight, index) => (
          <span
            key={index}
            className="highlight-pill"
            onMouseEnter={() => soundEngine.playHover()}
          >
            {highlight}
          </span>
        ))}
      </div>

      <div className="hero-actions">
        <button
          id="explore-projects-btn"
          onMouseEnter={() => soundEngine.playHover()}
          onClick={handleScrollToProjects}
          className="btn-hero-primary"
        >
          <span>Explore Projects</span>
          <ArrowDown size={16} />
        </button>

        <button
          onMouseEnter={() => soundEngine.playHover()}
          onClick={() => {
            soundEngine.playClick();
            if (onOpenCV) onOpenCV();
          }}
          className="btn-hero-resume"
          title="View Official 1:1 Curriculum Vitae"
        >
          <FileText size={16} />
          <span>View 1:1 CV</span>
        </button>

        <button
          onMouseEnter={() => soundEngine.playHover()}
          onClick={() => {
            soundEngine.playClick();
            if (onOpenCmd) onOpenCmd();
          }}
          className="btn-hero-ghost"
          title="Open Quick Search (Ctrl + K)"
        >
          <Terminal size={14} />
          <span>Quick Actions</span>
          <kbd className="hero-kbd-pill">⌘K</kbd>
        </button>

        <a
          href="#connect"
          onMouseEnter={() => soundEngine.playHover()}
          onClick={(e) => {
            e.preventDefault();
            soundEngine.playClick();
            document.getElementById('connect')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="btn-hero-secondary"
        >
          <span>Say Hello</span>
          <Send size={14} style={{ marginLeft: '4px' }} />
        </a>

        <button
          onMouseEnter={() => soundEngine.playHover()}
          onClick={handleCopyEmail}
          className="btn-hero-ghost"
          title="Copy Email Address"
        >
          {copied ? (
            <span className="copy-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Check size={14} />
              <span>Copied!</span>
            </span>
          ) : (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Copy size={14} />
              <span>Copy Email</span>
            </span>
          )}
        </button>
      </div>
    </section>
  );
}

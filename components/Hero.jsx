'use client';

import { useState } from 'react';
import { portfolioData } from '../data/portfolioData';
import { ArrowDown, FileText, Send, Copy, Check, ExternalLink } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './BrandIcons';
import { showToast } from '../lib/toastManager';

export default function Hero({ onOpenCV }) {
  const [copied, setCopied] = useState(false);

  const handleScrollToProjects = () => {
    const projectsEl = document.getElementById('projects');
    if (projectsEl) {
      projectsEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(portfolioData.email);
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
      <div className="hero-status-pill">
        <span className="status-indicator-ring">
          <span className="status-indicator-dot"></span>
        </span>
        <span>{portfolioData.status}</span>
      </div>

      <div className="hero-content-wrapper">
        <div className="hero-text-block">
          <div className="hero-greeting-line">
            <span>Hi, I'm</span>
          </div>
          <h1 className="hero-name-heading">{portfolioData.name}</h1>
          <h2 className="hero-role-title">{portfolioData.role}</h2>
          <p className="hero-bio-lead">
            B.Tech Computer Science student at <strong>Sister Nivedita University (8.58 CGPA)</strong>. 
            Specializing in <strong>React, Node.js, Express</strong>, and database architectures (<strong>MySQL, MongoDB</strong>). 
            Focused on building robust full-stack applications with clean code and real-world utility.
          </p>
        </div>

        <div className="hero-avatar-container">
          <img 
            src="/avatar.jpg" 
            alt="Payal Ghosh" 
            className="hero-avatar-img"
          />
        </div>
      </div>

      <div className="hero-highlights">
        {portfolioData.highlights.map((highlight, index) => (
          <span
            key={index}
            className="highlight-pill"
          >
            {highlight}
          </span>
        ))}
      </div>

      <div className="hero-actions">
        <button
          onClick={() => {
            if (onOpenCV) onOpenCV();
          }}
          className="btn-hero-primary"
          title="View Official 1:1 Curriculum Vitae"
        >
          <FileText size={16} />
          <span>View 1:1 CV</span>
        </button>

        <button
          id="explore-projects-btn"
          onClick={handleScrollToProjects}
          className="btn-hero-resume"
        >
          <span>Explore Projects</span>
          <ArrowDown size={16} />
        </button>

        <a
          href="https://github.com/payal225"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-hero-social"
          title="GitHub Profile"
        >
          <GithubIcon size={16} />
          <span>GitHub</span>
          <ExternalLink size={12} style={{ opacity: 0.6 }} />
        </a>

        <a
          href="https://www.linkedin.com/in/payal-ghosh-1a7345359"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-hero-social"
          title="LinkedIn Profile"
        >
          <LinkedinIcon size={16} />
          <span>LinkedIn</span>
          <ExternalLink size={12} style={{ opacity: 0.6 }} />
        </a>

        <button
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

        <a
          href="#connect"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById('connect')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="btn-hero-secondary"
        >
          <span>Get in Touch</span>
          <Send size={14} style={{ marginLeft: '4px' }} />
        </a>
      </div>
    </section>
  );
}

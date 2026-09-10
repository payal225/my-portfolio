'use client';

import { portfolioData } from '../data/portfolioData';
import CardTilt from './CardTilt';
import { Sparkles, FileText, ExternalLink, Download, ShieldCheck, Code2, Layers, Zap } from 'lucide-react';

export default function About({ onOpenCV }) {
  const { aboutHeading, about } = portfolioData;

  const principleIcons = [
    <Code2 size={22} color="#38bdf8" key="code" />,
    <Layers size={22} color="#a78bfa" key="layers" />,
    <ShieldCheck size={22} color="#38bdf8" key="shield" />,
    <Zap size={22} color="#fb7185" key="zap" />
  ];

  return (
    <section className="about" id="about">
      <div className="section-heading">
        <p className="eyebrow">{aboutHeading.eyebrow}</p>
        <h2 className="section-title-glow">{aboutHeading.title}</h2>
        <p className="section-copy">{aboutHeading.description}</p>
      </div>

      <div className="bento-about-grid">
        {/* Story Card */}
        <CardTilt className="about-bento-card about-story-card">
          <div className="about-card-badge">
            <Sparkles size={14} />
            <span>Background & Journey</span>
          </div>
          <h3 className="about-card-title">Crafting Software With An Eye For Design</h3>
          <div className="about-story-text">
            {about.story.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>

          <div className="about-action-row">
            <button
              onClick={onOpenCV}
              className="bento-btn bento-btn-primary"
            >
              <FileText size={16} />
              <span>View 1:1 Official CV</span>
            </button>
            <a
              href="/resume.html"
              target="_blank"
              rel="noopener noreferrer"
              className="bento-btn bento-btn-secondary"
            >
              <span>Open in New Tab</span>
              <ExternalLink size={14} />
            </a>
            <a
              href="/Payal_Resume.pdf"
              download="Payal_Ghosh_CV.pdf"
              className="bento-btn bento-btn-secondary"
            >
              <Download size={15} />
              <span>Download PDF</span>
            </a>
          </div>
        </CardTilt>

        {/* Stats Card */}
        <CardTilt className="about-bento-card about-stats-card">
          <h4 className="about-subheading">Key Highlights</h4>
          <div className="about-stats-grid">
            {about.stats.map((stat, idx) => (
              <div key={idx} className="about-stat-item">
                <span className="stat-number">{stat.number}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
            ))}
          </div>

          <div className="about-status-banner">
            <span className="status-indicator-dot"></span>
            <span>Sister Nivedita University • Kolkata, West Bengal</span>
          </div>
        </CardTilt>

        {/* Engineering Philosophy Cards */}
        {about.principles.map((item, idx) => (
          <CardTilt key={idx} className="about-bento-card about-principle-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span className="principle-number">0{idx + 1}</span>
              {principleIcons[idx % principleIcons.length]}
            </div>
            <h4 className="principle-title">{item.title}</h4>
            <p className="principle-desc">{item.desc}</p>
          </CardTilt>
        ))}
      </div>
    </section>
  );
}

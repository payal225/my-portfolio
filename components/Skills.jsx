'use client';

import { portfolioData } from '../data/portfolioData';
import CardTilt from './CardTilt';
import SkillsRadar from './SkillsRadar';
import { Code2, Layout, Server, Wrench, ExternalLink } from 'lucide-react';
import { soundEngine } from '../lib/soundEffects';

export default function Skills() {
  const { skillsHeading, skills } = portfolioData;

  const categoryIcons = {
    'Languages': <Code2 size={22} color="#38bdf8" />,
    'Frameworks & Frontend': <Layout size={22} color="#a855f7" />,
    'Backend & Databases': <Server size={22} color="#38bdf8" />,
    'Tools, Platforms & Concepts': <Wrench size={22} color="#fb7185" />,
  };

  return (
    <section className="skills" id="skills">
      <div className="section-heading">
        <p className="eyebrow">{skillsHeading.eyebrow}</p>
        <h2 className="section-title-glow">{skillsHeading.title}</h2>
        <p className="section-copy">{skillsHeading.description}</p>
      </div>

      {/* Interactive Competency Radar */}
      <SkillsRadar />

      {/* Categorized Skills Bento Grid */}
      <div className="bento-skills-grid">
        {skills.map((category) => (
          <CardTilt key={category.category} className="skill-bento-card">
            <div className="skill-card-header">
              <div className="skill-icon-bubble">
                {categoryIcons[category.category] || <Code2 size={22} color="#38bdf8" />}
              </div>
              <span className="skill-badge-subtle">{category.badge}</span>
            </div>

            <h3 className="skill-category-title">{category.category}</h3>

            <div className="skills-pill-cloud">
              {category.items.map((item) => (
                <a
                  key={item.name}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="skill-interactive-chip"
                  onMouseEnter={() => soundEngine.playHover()}
                  onClick={() => soundEngine.playClick()}
                >
                  <span>{item.name}</span>
                  <ExternalLink size={12} className="chip-arrow" />
                </a>
              ))}
            </div>
          </CardTilt>
        ))}
      </div>
    </section>
  );
}

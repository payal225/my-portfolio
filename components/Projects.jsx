'use client';

import { portfolioData } from '../data/portfolioData';
import CardTilt from './CardTilt';
import { ExternalLink, CheckCircle2, Cpu, Terminal } from 'lucide-react';
import { GithubIcon } from './BrandIcons';
import { soundEngine } from '../lib/soundEffects';

export default function Projects({ onOpenProject }) {
  const { projectsHeading, projects } = portfolioData;

  return (
    <section className="projects" id="projects">
      <div className="section-heading">
        <p className="eyebrow">{projectsHeading.eyebrow}</p>
        <h2 className="section-title-glow">{projectsHeading.title}</h2>
        <p className="section-copy">{projectsHeading.description}</p>
      </div>

      <div className="bento-projects-grid">
        {projects.map((project) => {
          const isFeatured = project.featured;

          return (
            <CardTilt
              key={project.id}
              className={`project-bento-card ${isFeatured ? 'bento-featured' : 'bento-standard'}`}
            >
              <div className="card-top-meta">
                <span className={`bento-tag ${isFeatured ? 'tag-cyan' : 'tag-purple'}`}>
                  {project.tag}
                </span>
                <button
                  className="inspect-arch-badge-btn"
                  onClick={() => {
                    soundEngine.playClick();
                    if (onOpenProject) onOpenProject(project.id);
                  }}
                  title="Open System Architecture & Deep Dive Inspector"
                >
                  <Cpu size={12} color="#38bdf8" />
                  <span>View Details</span>
                </button>
              </div>

              <h3 className="project-title">{project.title}</h3>
              <p className="project-desc">{project.description}</p>

              {project.features && (
                <ul className="project-feature-list">
                  {project.features.map((feat, idx) => (
                    <li key={idx}>
                      <CheckCircle2 size={15} color="#38bdf8" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              )}

              <div className="project-footer-wrapper">
                <ul className="bento-tech-pills">
                  {project.stack.map((tech, idx) => (
                    <li key={idx} className="tech-pill">
                      {tech}
                    </li>
                  ))}
                </ul>

                <div className="bento-actions">
                  <button
                    onClick={() => {
                      soundEngine.playClick();
                      if (onOpenProject) onOpenProject(project.id);
                    }}
                    className="bento-btn bento-btn-primary"
                    title="Inspect System Architecture, Schemas & Solutions"
                  >
                    <Terminal size={14} />
                    <span>Inspect System</span>
                  </button>

                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bento-btn bento-btn-secondary"
                      onMouseEnter={() => soundEngine.playHover()}
                      onClick={() => soundEngine.playClick()}
                    >
                      <GithubIcon size={15} />
                      <span>Repository</span>
                    </a>
                  )}
                </div>
              </div>
            </CardTilt>
          );
        })}
      </div>
    </section>
  );
}

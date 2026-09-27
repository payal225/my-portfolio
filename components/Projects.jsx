'use client';

import { portfolioData } from '../data/portfolioData';
import CardTilt from './CardTilt';
import { ExternalLink, CheckCircle2, Layers, BookOpen } from 'lucide-react';
import { GithubIcon } from './BrandIcons';

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
          const hasLiveDemo = project.liveUrl && project.liveUrl !== '#';

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
                    if (onOpenProject) onOpenProject(project.id);
                  }}
                  title="View Architectural Breakdown & Case Study"
                >
                  <BookOpen size={12} color="#38bdf8" />
                  <span>Case Study</span>
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
                  {hasLiveDemo && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bento-btn bento-btn-primary"
                      title={`Open live demo of ${project.title}`}
                    >
                      <ExternalLink size={14} />
                      <span>Live Demo</span>
                    </a>
                  )}

                  <button
                    onClick={() => {
                      if (onOpenProject) onOpenProject(project.id);
                    }}
                    className={`bento-btn ${hasLiveDemo ? 'bento-btn-secondary' : 'bento-btn-primary'}`}
                    title="View Architectural Breakdown & Case Study"
                  >
                    <Layers size={14} />
                    <span>Case Study</span>
                  </button>

                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bento-btn bento-btn-secondary"
                      title={`View GitHub source code for ${project.title}`}
                    >
                      <GithubIcon size={14} />
                      <span>Code</span>
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

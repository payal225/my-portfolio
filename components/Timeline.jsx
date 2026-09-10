'use client';

import { portfolioData } from '../data/portfolioData';
import CardTilt from './CardTilt';
import { Briefcase, Award, GraduationCap, Code2, Calendar } from 'lucide-react';

export default function Timeline() {
  const { timelineHeading, timeline } = portfolioData;

  const milestoneIcons = [
    <Briefcase size={16} key="briefcase" />,
    <Award size={16} key="award" />,
    <GraduationCap size={16} key="grad" />,
    <Code2 size={16} key="code" />
  ];

  return (
    <section className="timeline-section" id="journey">
      <div className="section-heading">
        <p className="eyebrow">{timelineHeading.eyebrow}</p>
        <h2 className="section-title-glow">{timelineHeading.title}</h2>
        <p className="section-copy">{timelineHeading.description}</p>
      </div>

      <div className="timeline-container">
        <div className="timeline-spine"></div>

        <div className="timeline-items-wrapper">
          {timeline.map((item, index) => {
            const isCyan = item.color === 'cyan';

            return (
              <div
                key={index}
                className={`timeline-item-row ${index % 2 === 0 ? 'timeline-left' : 'timeline-right'}`}
              >
                {/* Glowing Node on Spine */}
                <div className="timeline-node-wrapper">
                  <div className={`timeline-node ${isCyan ? 'node-cyan' : 'node-purple'}`}>
                    <div className="node-inner-pulse"></div>
                  </div>
                </div>

                {/* Content Card with 3D Tilt */}
                <CardTilt className="timeline-card">
                  <div className="timeline-card-meta">
                    <span className="timeline-period" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={14} />
                      <span>{item.period}</span>
                    </span>
                    <span className={`timeline-badge ${isCyan ? 'badge-cyan' : 'badge-purple'}`}>
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="timeline-title">{item.title}</h3>
                  <h4 className="timeline-subtitle">{item.subtitle}</h4>
                  <p className="timeline-desc">{item.description}</p>

                  <div className="timeline-tags">
                    {item.tags.map((tag, tIdx) => (
                      <span key={tIdx} className="timeline-tag-pill">
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardTilt>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

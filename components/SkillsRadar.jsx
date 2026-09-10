'use client';

import { useState } from 'react';
import { Cpu, Cloud, Database, Code2, Layers, GitBranch } from 'lucide-react';
import { soundEngine } from '../lib/soundEffects';

const RADAR_SKILLS = [
  {
    name: 'Full-Stack MERN',
    score: 92,
    icon: <Layers size={14} color="#38bdf8" />,
    summary: 'React, Next.js, Node.js, Express.js REST APIs, Component Architecture',
    color: '#38bdf8',
  },
  {
    name: 'Google Cloud (GCP)',
    score: 88,
    icon: <Cloud size={14} color="#a855f7" />,
    summary: 'Cloud Storage, Compute Engine, IAM, VPC, 4x Google Skill Badges',
    color: '#a855f7',
  },
  {
    name: 'Core CS & DSA',
    score: 86,
    icon: <Cpu size={14} color="#38bdf8" />,
    summary: 'Data Structures, Algorithms, OOPs, DBMS, Operating Systems (8.58 CGPA)',
    color: '#38bdf8',
  },
  {
    name: 'Database Systems',
    score: 85,
    icon: <Database size={14} color="#ec4899" />,
    summary: 'MongoDB, Mongoose ODM, Document Modeling, Aggregations, Indexing',
    color: '#ec4899',
  },
  {
    name: 'Programming (C++/Py)',
    score: 90,
    icon: <Code2 size={14} color="#10b981" />,
    summary: 'C, C++, Python, Modern JavaScript (ES6+), Modular Code Design',
    color: '#10b981',
  },
  {
    name: 'DevOps & Tooling',
    score: 82,
    icon: <GitBranch size={14} color="#f59e0b" />,
    summary: 'Git, GitHub workflows, Postman API testing, Linux CLI environments',
    color: '#f59e0b',
  },
];

export default function SkillsRadar() {
  const [activeSkill, setActiveSkill] = useState(null);

  const center = 150;
  const radius = 105;
  const total = RADAR_SKILLS.length;

  // Compute vertices for polygon
  const points = RADAR_SKILLS.map((skill, index) => {
    const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
    const distance = (skill.score / 100) * radius;
    const x = center + distance * Math.cos(angle);
    const y = center + distance * Math.sin(angle);
    return { x, y, angle, skill, index };
  });

  const polygonPointsString = points.map((p) => `${p.x},${p.y}`).join(' ');

  // Grid levels (20%, 40%, 60%, 80%, 100%)
  const levels = [0.2, 0.4, 0.6, 0.8, 1.0];

  return (
    <div className="radar-visualizer-container">
      <div className="radar-header">
        <div className="radar-title-badge">
          <Cpu size={13} className="pulse-cyan" />
          <span>COMPETENCY RADAR MATRIX</span>
        </div>
        <h3 className="radar-title">Multi-Dimensional Engineering Profile</h3>
        <p className="radar-subtitle">
          Hover vertices to inspect verified academic and project proficiencies.
        </p>
      </div>

      <div className="radar-content-grid">
        {/* SVG Spider Chart */}
        <div className="radar-svg-wrapper">
          <svg
            viewBox="0 0 300 300"
            className="radar-svg"
            role="img"
            aria-label="Skill radar visualizer"
          >
            {/* Background Grid Polygons */}
            {levels.map((level, lvlIdx) => {
              const ringPoints = RADAR_SKILLS.map((_, i) => {
                const angle = (Math.PI * 2 * i) / total - Math.PI / 2;
                const dist = level * radius;
                return `${center + dist * Math.cos(angle)},${center + dist * Math.sin(angle)}`;
              }).join(' ');

              return (
                <polygon
                  key={lvlIdx}
                  points={ringPoints}
                  className={`radar-grid-ring ${lvlIdx === levels.length - 1 ? 'outer-ring' : ''}`}
                />
              );
            })}

            {/* Axis Spokes */}
            {RADAR_SKILLS.map((_, i) => {
              const angle = (Math.PI * 2 * i) / total - Math.PI / 2;
              const x2 = center + radius * Math.cos(angle);
              const y2 = center + radius * Math.sin(angle);
              return (
                <line
                  key={i}
                  x1={center}
                  y1={center}
                  x2={x2}
                  y2={y2}
                  className="radar-grid-spoke"
                />
              );
            })}

            {/* Animated Data Area */}
            <polygon
              points={polygonPointsString}
              className="radar-data-polygon"
            />

            {/* Data Vertices & Interactive Dots */}
            {points.map((p, idx) => {
              const isHovered = activeSkill?.name === p.skill.name;
              return (
                <g key={idx}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={isHovered ? 7 : 4.5}
                    className="radar-vertex-dot"
                    style={{ fill: p.skill.color }}
                    onMouseEnter={() => {
                      soundEngine.playHover();
                      setActiveSkill(p.skill);
                    }}
                    onMouseLeave={() => setActiveSkill(null)}
                  />
                  {isHovered && (
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={12}
                      className="radar-vertex-glow"
                      style={{ stroke: p.skill.color }}
                    />
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Dynamic Skill Details Pane */}
        <div className="radar-details-pane">
          {activeSkill ? (
            <div className="radar-detail-card active-detail">
              <div className="detail-top-row">
                <div className="detail-icon-name">
                  {activeSkill.icon}
                  <span className="detail-name">{activeSkill.name}</span>
                </div>
                <span className="detail-score" style={{ color: activeSkill.color }}>
                  {activeSkill.score}%
                </span>
              </div>
              <div className="detail-meter-track">
                <div
                  className="detail-meter-fill"
                  style={{
                    width: `${activeSkill.score}%`,
                    backgroundColor: activeSkill.color,
                  }}
                ></div>
              </div>
              <p className="detail-summary">{activeSkill.summary}</p>
            </div>
          ) : (
            <div className="radar-detail-card placeholder-detail">
              <span className="placeholder-hint">
                Hover over or click any skill below to view details
              </span>
            </div>
          )}

          {/* Mini Chips Matrix */}
          <div className="radar-chips-list">
            {RADAR_SKILLS.map((sk, i) => (
              <button
                key={i}
                className={`radar-chip-btn ${activeSkill?.name === sk.name ? 'is-active' : ''}`}
                onMouseEnter={() => {
                  soundEngine.playHover();
                  setActiveSkill(sk);
                }}
                onClick={() => {
                  soundEngine.playClick();
                  setActiveSkill(sk);
                }}
              >
                {sk.icon}
                <span className="radar-chip-label">{sk.name}</span>
                <span className="radar-chip-val">{sk.score}%</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

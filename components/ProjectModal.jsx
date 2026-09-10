'use client';

import { useState, useEffect } from 'react';
import {
  X,
  Github,
  Server,
  Database,
  ShieldCheck,
  Layers,
  Cpu,
  CheckCircle2,
  Terminal,
  FileCode,
  Zap,
  GitFork,
  Workflow,
} from 'lucide-react';
import { BrandGithub } from './BrandIcons';
import { soundEngine } from '../lib/soundEffects';
import ApiPlayground from './ApiPlayground';
import SystemFlowDiagram from './SystemFlowDiagram';

const PROJECT_DETAILS = {
  habitflow: {
    id: 'habitflow',
    title: 'HabitFlow — Daily Habit Tracker & Progress Analytics',
    tagline: 'React & Node.js • Daily Progress Rings • Streak Tracking',
    github: 'https://github.com/payal225/HabitFlow',
    live: null,
    overview:
      'HabitFlow is a full-stack habit tracking web app designed to help people stay consistent with their daily goals. I built it with a clean dark-mode interface, instant completion feedback, and streak tracking that encourages everyday momentum without feeling like a chore.',
    architecture: [
      {
        layer: 'Client Frontend',
        tech: 'React.js, Modular CSS, Lucide Icons',
        role: 'Responsive UI with optimistic state updates, progress bars, and clean daily habit checklists.',
      },
      {
        layer: 'Backend API',
        tech: 'Node.js, Express.js, REST Architecture',
        role: 'RESTful API controllers handling habit CRUD operations, daily completion toggling, and streak calculations.',
      },
      {
        layer: 'Authentication & Security',
        tech: 'JWT, bcrypt.js, Secure Cookies',
        role: 'User authentication with salted password hashing and secure token validation.',
      },
      {
        layer: 'Database & Storage',
        tech: 'MongoDB, Mongoose ODM',
        role: 'Organized schema storing user profiles, custom habits, and indexed date-stamped completion records.',
      },
    ],
    challenges: [
      'Handling Timezones: Solved day-reset discrepancies by normalizing dates to UTC before recording completions to avoid accidental streak resets.',
      'Instant UI Feedback: Implemented optimistic UI updates so clicking a habit updates the progress ring instantly before server confirmation.',
      'Efficient History Queries: Indexed user habit completions for fast historical trend rendering across weeks and months.',
    ],
    stack: ['React', 'Node.js', 'Express.js', 'MongoDB', 'Mongoose', 'JWT', 'Bcrypt', 'REST API'],
  },
  tripnest: {
    id: 'tripnest',
    title: 'TripNest — Travel Planning & Itinerary Platform',
    tagline: 'React & Vite • Multi-Day Itineraries • Role-Based Access',
    github: 'https://github.com/payal225/TripNest',
    live: null,
    overview:
      'TripNest is a collaborative travel planning web app created to simplify group trips. It lets users organize multi-day itineraries, explore curated destinations, and keep track of accommodation details in one unified dashboard.',
    architecture: [
      {
        layer: 'Frontend Interface',
        tech: 'React.js, Vite, Responsive CSS',
        role: 'Fast, responsive interface with timeline day views, destination cards, and itinerary creation forms.',
      },
      {
        layer: 'Backend Services',
        tech: 'Node.js, Express.js REST API',
        role: 'Handles itinerary data, destination search queries, and role-based route protection.',
      },
      {
        layer: 'Database Layer',
        tech: 'MongoDB, Mongoose Schemas',
        role: 'Stores structured travel schedules, nested daily activity lists, and destination bookmarks.',
      },
      {
        layer: 'Security & Auth',
        tech: 'JWT Bearer Authentication',
        role: 'Protects user itineraries and enforces role-tailored permissions for travellers, hosts, and admins.',
      },
    ],
    challenges: [
      'Flexible Itinerary Structure: Designed clean nested schemas to handle dynamic day-by-day itineraries with multiple activities.',
      'Fast Search & Filters: Built client-side filtering by budget and region for instantaneous search feedback.',
      'Mobile Experience: Ensured timeline schedules collapse into touch-friendly cards on smaller phone screens.',
    ],
    stack: ['React', 'Vite', 'Node.js', 'Express.js', 'MongoDB', 'REST API', 'JWT'],
  },
  minierp: {
    id: 'minierp',
    title: 'Mini ERP — Business Operations & Employee Dashboard',
    tagline: 'Employee Records • Attendance & Payroll • Stock Management',
    github: 'https://github.com/payal225/mini-ERP-System',
    live: null,
    overview:
      'Mini ERP is a clean internal operations dashboard designed for small businesses. It simplifies team management by organizing employee records, attendance tracking, leave requests, and inventory levels in a clear, straightforward interface.',
    architecture: [
      {
        layer: 'Dashboard UI',
        tech: 'React.js, Tabular Data Views, Modal Forms',
        role: 'Clean administrative views for employee records, payroll calculation, and stock alert indicators.',
      },
      {
        layer: 'Backend Controller',
        tech: 'Node.js, Express.js, MySQL / MongoDB',
        role: 'RESTful API endpoints for employee CRUD operations, attendance logging, and inventory counts.',
      },
      {
        layer: 'Document & Reporting',
        tech: 'PDF Generation Utilities',
        role: 'Generates formatted payroll summaries and printable receipts directly from recorded order data.',
      },
      {
        layer: 'Data Integrity',
        tech: 'Relational / Document Schemas',
        role: 'Maintains clean employee records with status flags, role permissions, and historical attendance logs.',
      },
    ],
    challenges: [
      'Clean Role Views: Designed permission checks so staff members see their own records while managers have full overview access.',
      'Readable Data Tables: Structured high-density employee and stock tables with quick search and sorting.',
      'PDF Export Workflow: Built a straightforward export flow for downloading printable attendance and payroll reports.',
    ],
    stack: ['React', 'Node.js', 'Express.js', 'MySQL', 'MongoDB', 'PDF Generation', 'REST API'],
  },
};

export default function ProjectModal({ projectId, onClose }) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'api' | 'topology'

  useEffect(() => {
    if (projectId) {
      soundEngine.playModalOpen();
      setActiveTab('overview');
    }
  }, [projectId]);

  if (!projectId || !PROJECT_DETAILS[projectId]) return null;

  const project = PROJECT_DETAILS[projectId];

  const handleTabChange = (tabKey) => {
    soundEngine.playClick();
    setActiveTab(tabKey);
  };

  return (
    <div className="project-modal-overlay" onClick={onClose}>
      <div
        className="project-modal-window"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={project.title}
      >
        {/* Header */}
        <div className="project-modal-header">
          <div className="project-header-info">
            <div className="project-modal-tag-row">
              <span className="project-arch-badge">
                <Terminal size={12} />
                FULL-STACK PROJECT INSPECTOR
              </span>
              <span className="project-id-badge">{project.id.toUpperCase()}</span>
            </div>
            <h3 className="project-modal-title">{project.title}</h3>
            <p className="project-modal-tagline">{project.tagline}</p>
          </div>

          <button
            onClick={() => {
              soundEngine.playClick();
              onClose();
            }}
            className="project-modal-close-btn"
            aria-label="Close Project Inspector"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="project-modal-nav-tabs">
          <button
            type="button"
            onClick={() => handleTabChange('overview')}
            className={`modal-nav-tab ${activeTab === 'overview' ? 'active' : ''}`}
          >
            <Layers size={14} />
            <span>Architecture & Overview</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('api')}
            className={`modal-nav-tab ${activeTab === 'api' ? 'active' : ''}`}
          >
            <Zap size={14} className="tab-zap-icon" />
            <span>Live API Playground</span>
            <span className="tab-pill-badge">Interactive</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('topology')}
            className={`modal-nav-tab ${activeTab === 'topology' ? 'active' : ''}`}
          >
            <Workflow size={14} />
            <span>System Topology</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="project-modal-body">
          {activeTab === 'overview' && (
            <>
              {/* Overview */}
              <section className="arch-section">
                <h4 className="arch-section-heading">
                  <Layers size={16} color="#38bdf8" />
                  <span>System Purpose & Problem Domain</span>
                </h4>
                <p className="arch-text">{project.overview}</p>
              </section>

              {/* Architecture Layers */}
              <section className="arch-section">
                <h4 className="arch-section-heading">
                  <Cpu size={16} color="#a78bfa" />
                  <span>Tiered System Architecture</span>
                </h4>
                <div className="arch-grid">
                  {project.architecture.map((item, idx) => (
                    <div key={idx} className="arch-card">
                      <div className="arch-card-header">
                        <span className="arch-layer-name">{item.layer}</span>
                        <span className="arch-layer-tech">{item.tech}</span>
                      </div>
                      <p className="arch-layer-role">{item.role}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Key Engineering Challenges */}
              <section className="arch-section">
                <h4 className="arch-section-heading">
                  <ShieldCheck size={16} color="#38bdf8" />
                  <span>Key Engineering Challenges & Solutions</span>
                </h4>
                <ul className="arch-challenges-list">
                  {project.challenges.map((c, i) => (
                    <li key={i} className="arch-challenge-item">
                      <CheckCircle2 size={16} color="#38bdf8" className="mt-2 flex-shrink-0" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Tech Taxonomy */}
              <section className="arch-section">
                <h4 className="arch-section-heading">
                  <FileCode size={16} color="#fb7185" />
                  <span>Tech Stack Taxonomy</span>
                </h4>
                <div className="arch-tags-cloud">
                  {project.stack.map((s, i) => (
                    <span key={i} className="arch-tech-chip">
                      {s}
                    </span>
                  ))}
                </div>
              </section>
            </>
          )}

          {activeTab === 'api' && <ApiPlayground projectId={projectId} />}

          {activeTab === 'topology' && <SystemFlowDiagram projectId={projectId} />}
        </div>

        {/* Footer Actions */}
        <div className="project-modal-footer">
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="arch-action-btn primary"
            onClick={() => soundEngine.playClick()}
          >
            <BrandGithub size={16} />
            <span>Inspect GitHub Repository</span>
          </a>
          <button
            onClick={() => {
              soundEngine.playClick();
              onClose();
            }}
            className="arch-action-btn secondary"
          >
            <span>Close Inspector</span>
          </button>
        </div>
      </div>
    </div>
  );
}

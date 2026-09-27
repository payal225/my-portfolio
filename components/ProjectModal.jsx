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
  ExternalLink,
} from 'lucide-react';
import { BrandGithub } from './BrandIcons';
import ApiPlayground from './ApiPlayground';
import SystemFlowDiagram from './SystemFlowDiagram';

const PROJECT_DETAILS = {
  habitflow: {
    id: 'habitflow',
    title: 'HabitFlow — Daily Habit Tracker & Progress Analytics',
    tagline: 'React & Node.js • Daily Progress Rings • Streak Tracking',
    github: 'https://github.com/payal225/HabitFlow',
    live: 'https://habitflow-nu.vercel.app/',
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
    live: 'https://trip-nest-sandy.vercel.app/',
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
  erp: {
    id: 'erp',
    title: 'Mini ERP — Business Operations & Employee Dashboard',
    tagline: 'Employee Records • Attendance & Payroll • Stock Management',
    github: 'https://github.com/payal225/mini-ERP-System',
    live: 'https://erp-delta-jet.vercel.app/',
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
  minierp: {
    id: 'minierp',
    title: 'Mini ERP — Business Operations & Employee Dashboard',
    tagline: 'Employee Records • Attendance & Payroll • Stock Management',
    github: 'https://github.com/payal225/mini-ERP-System',
    live: 'https://erp-delta-jet.vercel.app/',
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
  hrms: {
    id: 'hrms',
    title: 'HRMS — Human Resource Management System',
    tagline: 'Employee Profiles • Attendance Check-In • Role Permissions',
    github: 'https://github.com/payal225/Human-resource-management-system',
    live: null,
    overview:
      'An enterprise HR dashboard that registers employees, assigns departmental roles, logs attendance, and manages leave approvals without disjointed spreadsheets.',
    architecture: [
      {
        layer: 'Frontend Interface',
        tech: 'React.js, Modular CSS',
        role: 'Clean administrative interfaces for attendance logs, role assignments, and department filters.',
      },
      {
        layer: 'Backend & Controllers',
        tech: 'Node.js, Express.js',
        role: 'REST API endpoints handling employee CRUD, check-in timestamps, and departmental queries.',
      },
      {
        layer: 'Database Layer',
        tech: 'MongoDB, Mongoose',
        role: 'Structured collections for personnel records, time tracking logs, and role-based permissions.',
      },
    ],
    challenges: [
      'Timestamp Accuracy: Ensuring reliable check-in and check-out attendance calculations across shifts.',
      'Role Separation: Providing distinct views for HR managers versus individual employees.',
    ],
    stack: ['React', 'Node.js', 'Express.js', 'MongoDB', 'Mongoose', 'REST API'],
  },
  'study-buddy': {
    id: 'study-buddy',
    title: 'SNU Study Buddy Finder',
    tagline: 'Course-Based Collaboration • University Study Partner Matching',
    github: 'https://github.com/payal225/snustudybuddyfinder',
    live: null,
    overview:
      'A university collaboration tool created for Sister Nivedita University students to find study partners based on shared coursework, semester subjects, and matching availability schedules.',
    architecture: [
      {
        layer: 'Frontend Interface',
        tech: 'HTML5, CSS3, JavaScript',
        role: 'Clean search interfaces for filtering courses, subjects, and study availability slots.',
      },
      {
        layer: 'Backend Services',
        tech: 'Node.js, Express.js',
        role: 'Course matching algorithms and student profile index endpoints.',
      },
    ],
    challenges: [
      'Course Match Filtering: Designed quick query matching based on course codes and subject semesters.',
      'Clean Lightweight UI: Kept dependencies minimal for ultra-fast university portal loading.',
    ],
    stack: ['HTML5', 'CSS3', 'JavaScript', 'Node.js', 'Express.js'],
  },
  'portfolio-3d': {
    id: 'portfolio-3d',
    title: 'Modern Software Engineering Portfolio',
    tagline: 'Next.js 14 App Router • Modular React • Performance & Accessibility',
    github: 'https://github.com/payal225/my-portfolio',
    live: 'https://payalghosh.vercel.app/',
    overview:
      'A fast, accessible, and clean personal portfolio engineered with Next.js 14, modern vanilla CSS design tokens, interactive architectural case studies, and responsive mobile-first views.',
    architecture: [
      {
        layer: 'Application Shell',
        tech: 'Next.js 14 (App Router), React 18',
        role: 'Static site generation (SSG) with optimized client hydration and sub-second load times.',
      },
      {
        layer: 'Design System',
        tech: 'Modern Vanilla CSS Tokens',
        role: 'Modular tokenized styles, WCAG AA contrast compliance, and flexible responsive breakpoints.',
      },
      {
        layer: 'Modals & Case Studies',
        tech: 'React Portals & Modals',
        role: 'Interactive architectural breakdown and API sandbox simulation.',
      },
    ],
    challenges: [
      'Production Performance: Cleaned up bloated micro-animations and heavy canvas loops to achieve zero layout shifts (CLS: 0).',
      'Accessibility: Ensured high contrast ratios and keyboard-accessible modal closures.',
    ],
    stack: ['Next.js 14', 'React', 'CSS Tokens', 'Lucide Icons', 'Vercel'],
  },
};

export default function ProjectModal({ projectId, onClose }) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'api' | 'topology'

  useEffect(() => {
    if (projectId) {
      setActiveTab('overview');
    }
  }, [projectId]);

  if (!projectId || !PROJECT_DETAILS[projectId]) return null;

  const project = PROJECT_DETAILS[projectId];

  const handleTabChange = (tabKey) => {
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
                <Layers size={12} />
                ENGINEERING CASE STUDY
              </span>
              <span className="project-id-badge">{project.id.toUpperCase()}</span>
            </div>
            <h3 className="project-modal-title">{project.title}</h3>
            <p className="project-modal-tagline">{project.tagline}</p>
          </div>

          <button
            onClick={onClose}
            className="project-modal-close-btn"
            aria-label="Close Case Study"
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
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="arch-action-btn primary"
            >
              <ExternalLink size={16} />
              <span>Launch Live App</span>
            </a>
          )}
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className={`arch-action-btn ${project.live ? 'secondary' : 'primary'}`}
            >
              <BrandGithub size={16} />
              <span>View Source Code</span>
            </a>
          )}
          <button
            onClick={onClose}
            className="arch-action-btn secondary"
          >
            <span>Close</span>
          </button>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import {
  Monitor,
  ShieldCheck,
  Cpu,
  Database,
  ArrowRight,
  Sparkles,
  Server,
  Lock,
  Layers,
  Activity,
  CheckCircle2,
} from 'lucide-react';
import { soundEngine } from '../lib/soundEffects';

const DIAGRAM_SPECS = {
  habitflow: {
    title: 'HabitFlow System Topology',
    tagline: 'Optimistic UI ➔ Express JWT Gateway ➔ Streak Algorithm ➔ MongoDB Atlas',
    nodes: [
      {
        id: 'client',
        title: 'Client Frontend',
        category: 'Tier 1: Presentation',
        icon: <Monitor size={18} color="#38bdf8" />,
        accentColor: '#38bdf8',
        tech: 'React.js • CSS Modules • Web Audio',
        summary: 'Renders progress rings, manages optimistic UI state, and catches offline gestures.',
        details: [
          'Optimistic rendering updates the daily habit ring before the server response returns.',
          'Local state caching prevents flickering during network hiccups.',
          'Responsive grid adjusts from mobile cards to desktop dashboard seamlessly.',
        ],
      },
      {
        id: 'gateway',
        title: 'API Gateway & Security',
        category: 'Tier 2: Ingress & Auth',
        icon: <ShieldCheck size={18} color="#a78bfa" />,
        accentColor: '#a78bfa',
        tech: 'Express.js • JWT • bcrypt.js • Helmet',
        summary: 'Validates bearer tokens, applies rate limiting, and sanitizes input payloads.',
        details: [
          'Cryptographic HMAC SHA-256 tokens authenticate protected habit routes.',
          'Express-rate-limit prevents brute-force abuse on authentication endpoints.',
          'CORS policies restrict API access to trusted client origins.',
        ],
      },
      {
        id: 'services',
        title: 'Streak & Analytics Engine',
        category: 'Tier 3: Business Logic',
        icon: <Cpu size={18} color="#ec4899" />,
        accentColor: '#ec4899',
        tech: 'Node.js Controllers • UTC Timezone Engine',
        summary: 'Calculates active streaks, milestone awards, and 30-day velocity aggregations.',
        details: [
          'Normalizes dates to UTC to prevent accidental streak wipes across timezone shifts.',
          'Detects consecutive day records to update streak milestone badges.',
          'Computes weekly completion percentages for dynamic SVG progress rings.',
        ],
      },
      {
        id: 'database',
        title: 'Persistence Layer',
        category: 'Tier 4: Storage & Data',
        icon: <Database size={18} color="#10b981" />,
        accentColor: '#10b981',
        tech: 'MongoDB Atlas • Mongoose ODM',
        summary: 'Indexed collections storing user credentials, habits, and chronological completion logs.',
        details: [
          'Compound indexes on `{ userId: 1, date: -1 }` ensure sub-10ms lookup speeds.',
          'Mongoose schemas enforce strict type validation and enum constraints.',
          'Automatic timestamping supports reliable historical habit retrospectives.',
        ],
      },
    ],
  },

  tripnest: {
    title: 'TripNest Collaborative Itinerary Topology',
    tagline: 'Vite React UI ➔ Role-Based Access Guard ➔ Schedule Mutator ➔ Document Store',
    nodes: [
      {
        id: 'client',
        title: 'Traveler Dashboard',
        category: 'Tier 1: Presentation',
        icon: <Monitor size={18} color="#38bdf8" />,
        accentColor: '#38bdf8',
        tech: 'React.js • Vite • Lucide Icons',
        summary: 'Interactive drag-and-drop itinerary timelines, destination filtering, and budget readouts.',
        details: [
          'Fast Vite bundler delivers sub-second page loads and instantaneous route hydration.',
          'Multi-day timeline view dynamically organizes nested activities by day order.',
          'Interactive search bar provides instant client-side budget range filtering.',
        ],
      },
      {
        id: 'gateway',
        title: 'Auth & Role Guard',
        category: 'Tier 2: Ingress & RBAC',
        icon: <ShieldCheck size={18} color="#a78bfa" />,
        accentColor: '#a78bfa',
        tech: 'Express Router • Role Claims Middleware',
        summary: 'Enforces permissions between trip organizers, invited collaborators, and viewer links.',
        details: [
          'Verifies whether the caller holds Owner, Editor, or Viewer permissions for the trip ID.',
          'Validates signed short-lived share tokens for external group access.',
          'Sanitizes user notes and activity payloads to prevent XSS vulnerabilities.',
        ],
      },
      {
        id: 'services',
        title: 'Itinerary & Budget Engine',
        category: 'Tier 3: Business Logic',
        icon: <Cpu size={18} color="#ec4899" />,
        accentColor: '#ec4899',
        tech: 'Node.js Controllers • Cost Estimator',
        summary: 'Aggregates day-by-day estimated expenses and calculates regional travel budgets.',
        details: [
          'Real-time budget summation updates overall group trip cost on each activity change.',
          'Destination query pipeline merges curated recommendations with regional pricing.',
          'Coordinates conversion formats for geo-tagged sightseeing stops.',
        ],
      },
      {
        id: 'database',
        title: 'MongoDB Itinerary Store',
        category: 'Tier 4: Document Database',
        icon: <Database size={18} color="#10b981" />,
        accentColor: '#10b981',
        tech: 'MongoDB Atlas • Mongoose Schemas',
        summary: 'Stores structured travel schedules, nested daily activity arrays, and destination metadata.',
        details: [
          'Embedded subdocuments in Itinerary.days enable single-query fetch of full trips.',
          'Text indexes on destination tags support multi-keyword travel style discovery.',
          'Soft-deletion flags ensure deleted trips can be restored within 30 days.',
        ],
      },
    ],
  },

  minierp: {
    title: 'Mini ERP Operations Topology',
    tagline: 'Administrative Dashboard ➔ Shift Validator ➔ Transaction Pipeline ➔ Relational/Document Storage',
    nodes: [
      {
        id: 'client',
        title: 'Operations Portal',
        category: 'Tier 1: Presentation',
        icon: <Monitor size={18} color="#38bdf8" />,
        accentColor: '#38bdf8',
        tech: 'React.js • High-Density Tables • Modal Forms',
        summary: 'Tabular views for staff attendance, inventory counters, and downloadable payroll receipts.',
        details: [
          'Searchable employee directory with quick filters for departments and roles.',
          'Live visual indicator badges alert staff to low inventory buffer thresholds.',
          'Instant client-side PDF document preview and printable export workflows.',
        ],
      },
      {
        id: 'gateway',
        title: 'Terminal Gateway',
        category: 'Tier 2: Ingress & Auditing',
        icon: <ShieldCheck size={18} color="#a78bfa" />,
        accentColor: '#a78bfa',
        tech: 'Express.js • Request Logger • Station Auth',
        summary: 'Verifies station terminal hardware keys and validates staff check-in timestamps.',
        details: [
          'X-Terminal-ID validation ensures clock-ins originate from registered physical devices.',
          'Audit trail middleware logs all salary and inventory mutations with timestamps.',
          'Strict parameter validation prevents invalid shift overlaps.',
        ],
      },
      {
        id: 'services',
        title: 'Payroll & Inventory Controllers',
        category: 'Tier 3: Business Logic',
        icon: <Cpu size={18} color="#ec4899" />,
        accentColor: '#ec4899',
        tech: 'Node.js Engine • Tax Computation Utilities',
        summary: 'Calculates overtime, provident fund deductions, and automated reorder triggers.',
        details: [
          'Cross-references monthly attendance sheets against shift codes to determine net days.',
          'Applies statutory tax brackets and professional deductions to base salaries.',
          'Triggers automatic critical alerts when SKU quantities fall below safety thresholds.',
        ],
      },
      {
        id: 'database',
        title: 'Operations Database',
        category: 'Tier 4: Enterprise Storage',
        icon: <Database size={18} color="#10b981" />,
        accentColor: '#10b981',
        tech: 'MongoDB / Relational Schemas',
        summary: 'Maintains employee records, attendance check-in logs, and inventory SKU ledgers.',
        details: [
          'ACID transaction guarantees prevent race conditions on simultaneous stock decrements.',
          'Unique employee ID indices enforce referential integrity across payroll slips.',
          'Historical archives preserve financial records for tax auditing compliance.',
        ],
      },
    ],
  },
};

export default function SystemFlowDiagram({ projectId }) {
  const spec = DIAGRAM_SPECS[projectId] || DIAGRAM_SPECS.habitflow;
  const [selectedNodeId, setSelectedNodeId] = useState(spec.nodes[0].id);

  const activeNode = spec.nodes.find((n) => n.id === selectedNodeId) || spec.nodes[0];

  const handleSelectNode = (id) => {
    soundEngine.playClick();
    setSelectedNodeId(id);
  };

  return (
    <div className="system-flow-root">
      {/* Topology Header */}
      <div className="system-flow-header">
        <div>
          <span className="flow-badge">FULL-STACK TOPOLOGY</span>
          <h4 className="flow-title">{spec.title}</h4>
        </div>
        <p className="flow-tagline">{spec.tagline}</p>
      </div>

      {/* Interactive Node Flowchart Bar */}
      <div className="flow-nodes-track">
        {spec.nodes.map((node, index) => {
          const isSelected = selectedNodeId === node.id;
          return (
            <div key={node.id} className="flow-node-wrapper">
              <button
                type="button"
                onClick={() => handleSelectNode(node.id)}
                className={`flow-node-card ${isSelected ? 'active' : ''}`}
                style={{
                  borderColor: isSelected ? node.accentColor : 'rgba(255, 255, 255, 0.08)',
                  boxShadow: isSelected ? `0 0 20px ${node.accentColor}30` : 'none',
                }}
              >
                <div
                  className="flow-node-icon-box"
                  style={{
                    background: `${node.accentColor}18`,
                    color: node.accentColor,
                  }}
                >
                  {node.icon}
                </div>
                <div className="flow-node-labels">
                  <span className="node-category">{node.category.split(':')[0]}</span>
                  <span className="node-title">{node.title}</span>
                  <span className="node-tech-summary">{node.tech.split('•')[0]}</span>
                </div>
              </button>

              {index < spec.nodes.length - 1 && (
                <div className="flow-arrow-connector">
                  <div className="connector-line">
                    <span className="connector-pulse"></span>
                  </div>
                  <ArrowRight size={14} className="arrow-head" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Selected Node Deep-Dive Inspection Card */}
      <div
        className="flow-node-inspector"
        style={{ borderColor: `${activeNode.accentColor}35` }}
      >
        <div className="inspector-top-row">
          <div className="inspector-title-group">
            <div
              className="inspector-icon-frame"
              style={{
                background: `${activeNode.accentColor}20`,
                borderColor: `${activeNode.accentColor}40`,
              }}
            >
              {activeNode.icon}
            </div>
            <div>
              <div className="inspector-tier-label">{activeNode.category}</div>
              <h4 className="inspector-node-name">{activeNode.title}</h4>
            </div>
          </div>
          <span
            className="inspector-tech-pill"
            style={{
              borderColor: `${activeNode.accentColor}40`,
              color: activeNode.accentColor,
            }}
          >
            {activeNode.tech}
          </span>
        </div>

        <p className="inspector-summary-text">{activeNode.summary}</p>

        <div className="inspector-bullets-list">
          <span className="bullets-title">ENGINEERING RESPONSIBILITIES & INVARIANTS</span>
          {activeNode.details.map((bullet, i) => (
            <div key={i} className="inspector-bullet-item">
              <CheckCircle2
                size={14}
                color={activeNode.accentColor}
                className="bullet-icon flex-shrink-0"
              />
              <span>{bullet}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

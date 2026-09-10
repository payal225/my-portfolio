'use client';

import { useEffect, useState } from 'react';
import {
  X,
  Palette,
  Type,
  Layout,
  Layers,
  Sparkles,
  Copy,
  Check,
  Maximize2,
  ExternalLink,
} from 'lucide-react';
import { soundEngine } from '../lib/soundEffects';
import { showToast } from '../lib/toastManager';

export default function DesignModal({ design, onClose }) {
  const [copiedHex, setCopiedHex] = useState(null);

  useEffect(() => {
    if (design) {
      soundEngine.playModalOpen();
    }
  }, [design]);

  if (!design) return null;

  const handleCopyHex = (hex, name) => {
    soundEngine.playClick();
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    showToast({
      title: 'Color Token Copied',
      message: `${name}: ${hex}`,
      type: 'success',
    });
    setTimeout(() => setCopiedHex(null), 2000);
  };

  return (
    <div className="design-modal-overlay" onClick={onClose}>
      <div
        className="design-modal-window"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={design.title}
      >
        {/* Header */}
        <div className="design-modal-header">
          <div className="design-modal-title-group">
            <div className="design-modal-tag-row">
              <span className="design-category-badge">
                <Layout size={12} />
                <span>{design.category}</span>
              </span>
              <span className="design-badge-pill">{design.badge}</span>
            </div>
            <h3 className="design-modal-title">{design.title}</h3>
          </div>

          <button
            onClick={() => {
              soundEngine.playClick();
              onClose();
            }}
            className="design-modal-close-btn"
            aria-label="Close Design Inspector"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="design-modal-body">
          {/* Main High-Res Mockup Display */}
          <div className="design-mockup-frame">
            <img
              src={design.image}
              alt={design.title}
              className="design-full-img"
            />
          </div>

          {/* Design Specs & Color Tokens */}
          <div className="design-specs-grid">
            {/* Color Palette Tokens */}
            <div className="design-spec-card">
              <div className="spec-card-heading">
                <Palette size={15} color="#00f7ff" />
                <span>Color Token System</span>
              </div>
              <div className="palette-swatches-row">
                {design.palette.map((c) => (
                  <button
                    key={c.hex}
                    onClick={() => handleCopyHex(c.hex, c.name)}
                    className="palette-swatch-item"
                    title={`Click to copy hex: ${c.hex}`}
                  >
                    <span
                      className="swatch-color-box"
                      style={{ backgroundColor: c.hex }}
                    ></span>
                    <div className="swatch-meta">
                      <span className="swatch-name">{c.name}</span>
                      <span className="swatch-hex">
                        {copiedHex === c.hex ? 'COPIED!' : c.hex}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Typography & Tools */}
            <div className="design-spec-card">
              <div className="spec-card-heading">
                <Type size={15} color="#a855f7" />
                <span>Typography & Tooling</span>
              </div>
              <div className="spec-meta-list">
                <div className="spec-meta-item">
                  <span className="meta-label">Typography:</span>
                  <span className="meta-val">{design.typography}</span>
                </div>
                <div className="spec-meta-item">
                  <span className="meta-label">Software / Tools:</span>
                  <div className="tools-chips-wrap">
                    {design.tools.map((t, idx) => (
                      <span key={idx} className="tool-chip">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Case Study Details */}
          <div className="design-case-study">
            <div className="case-study-item">
              <h4 className="case-study-heading">
                <span className="step-num">01</span> Problem Statement & Context
              </h4>
              <p className="case-study-text">{design.caseStudy.problem}</p>
            </div>

            <div className="case-study-item">
              <h4 className="case-study-heading">
                <span className="step-num">02</span> Design Architecture & Solution
              </h4>
              <p className="case-study-text">{design.caseStudy.solution}</p>
            </div>

            <div className="case-study-item">
              <h4 className="case-study-heading">
                <span className="step-num">03</span> Key Deliverables
              </h4>
              <p className="case-study-text">{design.caseStudy.deliverables}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="design-modal-footer">
          {design.liveUrl ? (
            <a
              href={design.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="design-live-app-btn"
              onClick={() => soundEngine.playClick()}
            >
              <ExternalLink size={14} />
              <span>Visit Live Web Application</span>
            </a>
          ) : (
            <span className="design-footer-note">
              Crafted with Figma, atomic design systems & pixel-level precision.
            </span>
          )}
          <button
            onClick={() => {
              soundEngine.playClick();
              onClose();
            }}
            className="design-footer-close-btn"
          >
            <span>Close Showcase</span>
          </button>
        </div>
      </div>
    </div>
  );
}

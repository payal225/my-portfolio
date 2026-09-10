'use client';

import { useEffect } from 'react';
import { FileText, Download, ExternalLink, X } from 'lucide-react';
import { soundEngine } from '../lib/soundEffects';

export default function CVModal({ isOpen, onClose }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      soundEngine.playModalOpen();
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    soundEngine.playClick();
    onClose();
  };

  return (
    <div className="cv-modal-backdrop" onClick={handleClose}>
      <div className="cv-modal-window" onClick={(e) => e.stopPropagation()}>
        <div className="cv-modal-header">
          <div className="cv-modal-title" style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={18} color="#00f7ff" />
              <span>Official 1:1 Curriculum Vitae</span>
            </span>
            <span className="cv-modal-subtitle">Payal Ghosh • B.Tech CSE</span>
          </div>

          <div className="cv-modal-actions">
            <a
              href="/resume.html"
              target="_blank"
              rel="noopener noreferrer"
              className="cv-modal-btn secondary"
              onMouseEnter={() => soundEngine.playHover()}
              onClick={() => soundEngine.playClick()}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <span>Open in New Tab</span>
              <ExternalLink size={14} />
            </a>
            <a
              href="/Payal_Resume.pdf"
              download="Payal_Ghosh_CV.pdf"
              className="cv-modal-btn primary"
              onMouseEnter={() => soundEngine.playHover()}
              onClick={() => soundEngine.playClick()}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <Download size={14} />
              <span>Download PDF</span>
            </a>
            <button
              onClick={handleClose}
              onMouseEnter={() => soundEngine.playHover()}
              className="cv-modal-close-btn"
              aria-label="Close CV preview"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="cv-modal-body">
          <iframe
            src="/resume.html"
            className="cv-modal-iframe"
            title="Payal Ghosh 1:1 CV Viewer"
          />
        </div>
      </div>
    </div>
  );
}

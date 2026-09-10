'use client';

import { ArrowUp, Code2, Heart } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        <p style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          <span>© {new Date().getFullYear()} Payal Ghosh. Built with Next.js, React & Three.js.</span>
        </p>
        <button
          onClick={scrollToTop}
          className="footer-top-btn"
          aria-label="Scroll to top"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <span>Back to Top</span>
          <ArrowUp size={14} />
        </button>
      </div>
    </footer>
  );
}

'use client';

import { portfolioData } from '../data/portfolioData';
import CardTilt from './CardTilt';
import { Award, CheckCircle2, ExternalLink } from 'lucide-react';

export default function Certifications() {
  const { certificationsHeading, certifications } = portfolioData;

  return (
    <section className="certifications" id="certifications">
      <div className="section-heading">
        <p className="eyebrow">{certificationsHeading.eyebrow}</p>
        <h2 className="section-title-glow">{certificationsHeading.title}</h2>
        <p className="section-copy">{certificationsHeading.description}</p>
      </div>

      <div className="bento-cert-grid">
        {certifications.map((cert) => (
          <CardTilt key={cert.title} className="cert-bento-card">
            <div className="cert-top-row">
              <span className={`cert-badge-pill ${cert.badgeColor === 'purple' ? 'badge-purple' : 'badge-cyan'}`}>
                {cert.badge}
              </span>
              <span className="verified-seal" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={14} />
                <span>Verified</span>
              </span>
            </div>

            <h3 className="cert-title">{cert.title}</h3>
            <p className="cert-meta">{cert.meta}</p>
            <p className="cert-description">{cert.description}</p>

            <a
              className="cert-verify-link"
              href={cert.certificateUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Award size={15} />
              <span>Verify Credential on Coursera</span>
              <ExternalLink size={13} />
            </a>
          </CardTilt>
        ))}
      </div>
    </section>
  );
}

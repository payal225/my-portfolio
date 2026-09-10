'use client';

import { useState } from 'react';
import { portfolioData } from '../data/portfolioData';
import CardTilt from './CardTilt';
import { Mail, Phone, MapPin, Copy, Check, ExternalLink, Send, Terminal, Radio, Sparkles } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './BrandIcons';
import { soundEngine } from '../lib/soundEffects';
import { showToast } from '../lib/toastManager';

export default function Connect() {
  const { connectHeading, socials, email, phone, location } = portfolioData;
  const [copied, setCopied] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    topic: 'Full-Time Engineering Role',
    message: '',
  });
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [transmitted, setTransmitted] = useState(false);

  const handleCopyEmail = () => {
    soundEngine.playClick();
    navigator.clipboard.writeText(email);
    setCopied(true);
    showToast({
      title: 'Email Address Copied',
      message: email,
      type: 'success',
    });
    setTimeout(() => setCopied(false), 2400);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      showToast({
        title: 'Input Incomplete',
        message: 'Please fill in all transmission fields.',
        type: 'warn',
      });
      return;
    }

    soundEngine.playClick();
    setIsTransmitting(true);

    // Prepare submission
    setTimeout(() => {
      setIsTransmitting(false);
      setTransmitted(true);
      soundEngine.playSuccess();
      showToast({
        title: 'Message Ready',
        message: `Opening your email client to send to Payal Ghosh.`,
        type: 'success',
      });

      // Prepare mailto link fallback
      const subject = encodeURIComponent(`[Portfolio Inquiry - ${formData.topic}] from ${formData.name}`);
      const body = encodeURIComponent(
        `Hi Payal,\n\n${formData.message}\n\nBest regards,\n${formData.name}\n${formData.email}`
      );
      window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;

      setTimeout(() => {
        setFormData({ name: '', email: '', topic: 'Full-Time Engineering Role', message: '' });
        setTransmitted(false);
      }, 5000);
    }, 800);
  };

  const getSocialIcon = (platform) => {
    if (platform.toLowerCase().includes('github')) return <GithubIcon size={18} />;
    if (platform.toLowerCase().includes('linkedin')) return <LinkedinIcon size={18} />;
    return <ExternalLink size={18} />;
  };

  return (
    <section className="connect" id="connect">
      <div className="section-heading">
        <p className="eyebrow">{connectHeading.eyebrow}</p>
        <h2 className="section-title-glow">{connectHeading.title}</h2>
        <p className="section-copy">{connectHeading.description}</p>
      </div>

      <div className="connect-layout-grid">
        {/* Left: Contact Details & Socials */}
        <div className="connect-details-col">
          <CardTilt className="connect-bento-card connect-email-featured">
            <div className="connect-top-bar">
              <span className="connect-tag-pill tag-cyan">Direct Contact</span>
              <span className="connect-ping">
                <Radio size={12} className="pulse-cyan" />
                <span>Open for Opportunities</span>
              </span>
            </div>

            <h3 className="connect-card-title">{email}</h3>

            <div className="connect-contact-meta">
              <span className="meta-item">
                <MapPin size={15} color="#38bdf8" /> {location}
              </span>
              <span className="meta-item">
                <Phone size={15} color="#a855f7" /> {phone}
              </span>
            </div>

            <p className="connect-card-desc">
              I'm looking for entry-level Web Developer and Full-Stack opportunities where I can build clean, user-friendly software and keep growing. Feel free to drop me a note or connect on LinkedIn and GitHub!
            </p>

            <div className="connect-email-actions">
              <button
                onClick={handleCopyEmail}
                className="bento-btn bento-btn-primary"
              >
                {copied ? (
                  <>
                    <Check size={15} />
                    <span>Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy size={15} />
                    <span>Copy Email Address</span>
                  </>
                )}
              </button>

              <a
                href={`tel:${phone.replace(/\s+/g, '')}`}
                className="bento-btn bento-btn-secondary"
                onMouseEnter={() => soundEngine.playHover()}
                onClick={() => soundEngine.playClick()}
              >
                <Phone size={15} />
                <span>Call Directly</span>
              </a>
            </div>
          </CardTilt>

          {/* Social Links Row */}
          <div className="connect-socials-row">
            {socials.map((social) => (
              <CardTilt key={social.platform} className="connect-bento-card social-mini-card">
                <a
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="connect-card-inner-link"
                  onMouseEnter={() => soundEngine.playHover()}
                  onClick={() => soundEngine.playClick()}
                >
                  <div className="connect-top-bar">
                    <span className="connect-tag-pill tag-purple">
                      {getSocialIcon(social.platform)}
                      <span>{social.platform}</span>
                    </span>
                    <ExternalLink size={14} className="connect-external-arrow" />
                  </div>
                  <h4 className="social-display-tag">{social.handle}</h4>
                  <p className="social-subtext">{social.description}</p>
                </a>
              </CardTilt>
            ))}
          </div>
        </div>

        {/* Right: Message Form */}
        <div className="connect-terminal-col">
          <CardTilt className="transmission-terminal-card">
            <div className="terminal-header">
              <div className="terminal-title-group">
                <Send size={15} color="#38bdf8" />
                <span className="terminal-title">Send a Quick Message</span>
              </div>
              <div className="terminal-dots">
                <span className="t-dot red"></span>
                <span className="t-dot yellow"></span>
                <span className="t-dot green"></span>
              </div>
            </div>

            <form onSubmit={handleFormSubmit} className="terminal-form">
              <div className="form-group-grid">
                <div className="form-field">
                  <label className="terminal-label">YOUR NAME</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="terminal-input"
                  />
                </div>

                <div className="form-field">
                  <label className="terminal-label">YOUR EMAIL</label>
                  <input
                    type="email"
                    required
                    placeholder="alex@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="terminal-input"
                  />
                </div>
              </div>

              <div className="form-field">
                <label className="terminal-label">SUBJECT</label>
                <select
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  className="terminal-select"
                >
                  <option value="Full-Time Engineering Role">💼 Full-Time Engineering Role</option>
                  <option value="Collaborative Project">🚀 Collaborative Project</option>
                  <option value="Freelance Opportunity">⚡ Freelance Opportunity</option>
                  <option value="Tech Discussion / Mentorship">💬 Tech Discussion / Say Hello</option>
                </select>
              </div>

              <div className="form-field">
                <div className="terminal-label-row">
                  <label className="terminal-label">YOUR MESSAGE</label>
                  <span className="char-counter">{formData.message.length} chars</span>
                </div>
                <textarea
                  required
                  rows={4}
                  placeholder="Write your note or question here..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="terminal-textarea"
                />
              </div>

              <div className="terminal-submit-row">
                <button
                  type="submit"
                  disabled={isTransmitting}
                  className={`terminal-send-btn ${isTransmitting ? 'transmitting' : ''}`}
                >
                  {isTransmitting ? (
                    <>
                      <Radio size={15} className="pulse-cyan" />
                      <span>Preparing Message...</span>
                    </>
                  ) : transmitted ? (
                    <>
                      <Check size={15} color="#38bdf8" />
                      <span>Message Ready!</span>
                    </>
                  ) : (
                    <>
                      <Send size={15} />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </CardTilt>
        </div>
      </div>
    </section>
  );
}

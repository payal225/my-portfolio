'use client';

import { useState } from 'react';
import { portfolioData } from '../data/portfolioData';
import CardTilt from './CardTilt';
import BlenderStudio from './BlenderStudio';
import { Layout, Maximize2, Sparkles, Layers, Palette, Box, Paintbrush, ExternalLink } from 'lucide-react';
import { soundEngine } from '../lib/soundEffects';

export default function Designs({ onSelectDesign }) {
  const { designsHeading, designs } = portfolioData;
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Digital Art', '3D Blender Models', 'Mobile App UI', 'Web Dashboards', 'Design Systems'];

  const filteredDesigns = activeCategory === 'All'
    ? designs
    : designs.filter((d) => d.category === activeCategory);

  const show3DStudio = activeCategory === 'All' || activeCategory === '3D Blender Models';

  return (
    <section className="designs-section" id="designs">
      <div className="section-heading">
        <p className="eyebrow">{designsHeading.eyebrow}</p>
        <h2 className="section-title-glow">{designsHeading.title}</h2>
        <p className="section-copy">{designsHeading.description}</p>
      </div>

      {/* Category Filter Tabs */}
      <div className="design-filter-tabs">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              soundEngine.playClick();
              setActiveCategory(cat);
            }}
            onMouseEnter={() => soundEngine.playHover()}
            className={`design-tab-btn ${activeCategory === cat ? 'active-tab' : ''}`}
          >
            {cat === 'All' && <Layers size={13} />}
            {cat === 'Digital Art' && <Paintbrush size={13} color="#ec4899" />}
            {cat === '3D Blender Models' && <Box size={13} color="#38bdf8" />}
            {cat === 'Mobile App UI' && <Layout size={13} />}
            {cat === 'Web Dashboards' && <Sparkles size={13} />}
            {cat === 'Design Systems' && <Palette size={13} />}
            <span>{cat}</span>
          </button>
        ))}
      </div>

      {/* Interactive 3D Blender Studio Viewport */}
      {show3DStudio && (
        <div className="blender-studio-wrapper">
          <BlenderStudio />
        </div>
      )}

      {/* 2D Designs Bento Grid (shown when not solely viewing 3D models) */}
      {activeCategory !== '3D Blender Models' && (
        <div className="designs-bento-grid">
          {filteredDesigns.map((design) => (
            <CardTilt
              key={design.id}
              className="design-bento-card"
            >
              {/* Mockup Preview Thumbnail */}
              <div
                className="design-card-thumbnail"
                onClick={() => {
                  soundEngine.playClick();
                  if (onSelectDesign) onSelectDesign(design);
                }}
                title="Click to inspect design case study"
              >
                <img
                  src={design.image}
                  alt={design.title}
                  className="design-thumb-img"
                  loading="lazy"
                />
                <div className="design-thumb-overlay">
                  <span className="thumb-inspect-badge">
                    <Maximize2 size={14} />
                    <span>Inspect Case Study</span>
                  </span>
                </div>
              </div>

              {/* Meta */}
              <div className="design-card-meta">
                <div className="design-card-header">
                  <span className="design-category-tag">{design.badge}</span>
                  <div className="design-swatch-dots">
                    {design.palette.slice(0, 3).map((c) => (
                      <span
                        key={c.hex}
                        className="swatch-mini-dot"
                        style={{ backgroundColor: c.hex }}
                        title={`${c.name} (${c.hex})`}
                      />
                    ))}
                  </div>
                </div>

                <h3 className="design-card-title">{design.title}</h3>
                <p className="design-card-summary">{design.summary}</p>

                <div className="design-tools-row">
                  {design.tools.map((tool, i) => (
                    <span key={i} className="design-tool-pill">
                      {tool}
                    </span>
                  ))}
                </div>

                <div className="design-card-footer">
                  <button
                    onClick={() => {
                      soundEngine.playClick();
                      if (onSelectDesign) onSelectDesign(design);
                    }}
                    className={`bento-btn bento-btn-primary ${design.liveUrl ? '' : 'w-full'}`}
                  >
                    <Maximize2 size={14} />
                    <span>Inspect Design</span>
                  </button>
                  {design.liveUrl && (
                    <a
                      href={design.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bento-btn bento-btn-secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        soundEngine.playClick();
                      }}
                      title="Open live web app"
                    >
                      <ExternalLink size={13} />
                      <span>Live App</span>
                    </a>
                  )}
                </div>
              </div>
            </CardTilt>
          ))}
        </div>
      )}
    </section>
  );
}

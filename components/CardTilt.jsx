'use client';

import { useState, useRef } from 'react';
import { soundEngine } from '../lib/soundEffects';

export default function CardTilt({ children, className = '', ...props }) {
  const cardRef = useRef(null);
  const [style, setStyle] = useState({
    transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)',
    spotlightX: '50%',
    spotlightY: '50%',
    opacity: 0,
  });

  const handleMouseEnter = () => {
    soundEngine.playHover();
  };

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate subtle tilt (-8deg to 8deg)
    const rotateX = ((y - centerY) / centerY) * -7;
    const rotateY = ((x - centerX) / centerX) * 7;

    setStyle({
      transform: `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`,
      spotlightX: `${x}px`,
      spotlightY: `${y}px`,
      opacity: 1,
    });
  };

  const handleMouseLeave = () => {
    setStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      spotlightX: '50%',
      spotlightY: '50%',
      opacity: 0,
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`tilt-card-wrapper ${className}`}
      style={{
        transform: style.transform,
        transition: 'transform 0.18s cubic-bezier(0.2, 0, 0.2, 1)',
        willChange: 'transform',
      }}
      {...props}
    >
      <div
        className="tilt-spotlight"
        style={{
          background: `radial-gradient(450px circle at ${style.spotlightX} ${style.spotlightY}, rgba(0, 247, 255, 0.15), rgba(168, 85, 247, 0.08), transparent 70%)`,
          opacity: style.opacity,
          transition: 'opacity 0.25s ease',
        }}
      />
      {children}
    </div>
  );
}

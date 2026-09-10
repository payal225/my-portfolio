'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Timeline from '../components/Timeline';
import Skills from '../components/Skills';
import Projects from '../components/Projects';
import Designs from '../components/Designs';
import Certifications from '../components/Certifications';
import Connect from '../components/Connect';
import Footer from '../components/Footer';
import CVModal from '../components/CVModal';
import MusicPlayer from '../components/MusicPlayer';
import CommandPalette from '../components/CommandPalette';
import ProjectModal from '../components/ProjectModal';
import DesignModal from '../components/DesignModal';
import ToastNotification from '../components/ToastNotification';
import GalaxyCustomizer from '../components/GalaxyCustomizer';

// Client-only dynamic import for Three.js 3D canvas
const Starfield = dynamic(() => import('../components/Starfield'), {
  ssr: false,
});

export default function Home() {
  const [cvModalOpen, setCvModalOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [selectedDesign, setSelectedDesign] = useState(null);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setCmdOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <Starfield />
      <Navbar
        onOpenCV={() => setCvModalOpen(true)}
        onOpenCmd={() => setCmdOpen(true)}
      />
      <main className="content">
        <Hero
          onOpenCV={() => setCvModalOpen(true)}
          onOpenCmd={() => setCmdOpen(true)}
        />
        <About onOpenCV={() => setCvModalOpen(true)} />
        <Timeline />
        <Skills />
        <Projects onOpenProject={(id) => setSelectedProjectId(id)} />
        <Designs onSelectDesign={(d) => setSelectedDesign(d)} />
        <Certifications />
        <Connect />
      </main>
      <Footer />

      {/* Persistent Widgets & Modals */}
      <GalaxyCustomizer />
      <MusicPlayer />
      <ToastNotification />

      <CVModal
        isOpen={cvModalOpen}
        onClose={() => setCvModalOpen(false)}
      />

      <CommandPalette
        isOpen={cmdOpen}
        onClose={() => setCmdOpen(false)}
        onOpenCV={() => setCvModalOpen(true)}
        onOpenProject={(id) => setSelectedProjectId(id)}
        onSelectDesign={(d) => setSelectedDesign(d)}
      />

      <ProjectModal
        projectId={selectedProjectId}
        onClose={() => setSelectedProjectId(null)}
      />

      <DesignModal
        design={selectedDesign}
        onClose={() => setSelectedDesign(null)}
      />
    </>
  );
}

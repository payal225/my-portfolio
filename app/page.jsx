'use client';

import { useState } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Timeline from '../components/Timeline';
import Skills from '../components/Skills';
import Projects from '../components/Projects';
import Certifications from '../components/Certifications';
import Connect from '../components/Connect';
import Footer from '../components/Footer';
import CVModal from '../components/CVModal';
import ProjectModal from '../components/ProjectModal';
import DesignModal from '../components/DesignModal';
import ToastNotification from '../components/ToastNotification';

export default function Home() {
  const [cvModalOpen, setCvModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [selectedDesign, setSelectedDesign] = useState(null);

  return (
    <>
      <Navbar
        onOpenCV={() => setCvModalOpen(true)}
      />
      <main className="content">
        <Hero
          onOpenCV={() => setCvModalOpen(true)}
        />
        <About onOpenCV={() => setCvModalOpen(true)} />
        <Timeline />
        <Skills />
        <Projects onOpenProject={(id) => setSelectedProjectId(id)} />

        <Certifications />
        <Connect />
      </main>
      <Footer />

      {/* Persistent Modals & Notifications */}
      <ToastNotification />

      <CVModal
        isOpen={cvModalOpen}
        onClose={() => setCvModalOpen(false)}
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

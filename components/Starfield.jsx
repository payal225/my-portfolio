'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { soundEngine } from '../lib/soundEffects';
import { galaxyManager, GALAXY_THEMES, TILT_MODES } from '../lib/galaxyManager';

// Creates a crisp, deep-space pinpoint star texture with rapid, organic falloff
function createDeepStarTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');

  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(0.08, 'rgba(240, 245, 255, 0.85)');
  gradient.addColorStop(0.24, 'rgba(125, 160, 245, 0.25)');
  gradient.addColorStop(0.55, 'rgba(40, 60, 150, 0.05)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export default function Starfield() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isMusicPlaying = soundEngine.getState().musicPlaying;
    const unsubAudio = soundEngine.subscribe((state) => {
      isMusicPlaying = state.musicPlaying;
    });

    // Initial galaxy state
    let galaxyState = galaxyManager.getState();

    // --- Scene Setup with Deep-Space Cosmic Fog ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x03050a, 0.015);

    const camera = new THREE.PerspectiveCamera(
      58,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0.4, 10.5);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    const starTexture = createDeepStarTexture();

    // Floating Galaxy Group
    const galaxyGroup = new THREE.Group();
    scene.add(galaxyGroup);

    // Deep oblique perspective default
    const isDesktop = window.innerWidth > 768;
    const initialTilt = TILT_MODES[galaxyState.tilt] || TILT_MODES.oblique;
    let currentTiltX = initialTilt.rotX;
    let currentTiltY = initialTilt.rotY;
    galaxyGroup.rotation.x = currentTiltX;
    galaxyGroup.rotation.y = currentTiltY;
    galaxyGroup.position.set(isDesktop ? 1.6 : 0, isDesktop ? 0.1 : 0.6, -1.8);

    // --- 1. DEEP SPIRAL GALAXY ARMS (9,500 Stars with Real-Time Parameterization) ---
    const armCount = 9500;
    const galaxyParams = {
      count: armCount,
      radius: 13.5,
      arms: 3,
      randomness: 0.38,
      power: 3.8,
    };

    const armRadii = new Float32Array(armCount);
    const armBranchAngles = new Float32Array(armCount);
    const armRandomsX = new Float32Array(armCount);
    const armRandomsY = new Float32Array(armCount);
    const armRandomsZ = new Float32Array(armCount);
    const armColorJitters = new Float32Array(armCount);

    const armGeometry = new THREE.BufferGeometry();
    const armPositions = new Float32Array(armCount * 3);
    const armColors = new Float32Array(armCount * 3);

    for (let i = 0; i < armCount; i++) {
      armRadii[i] = Math.pow(Math.random(), 1.7) * galaxyParams.radius;
      armBranchAngles[i] = ((i % galaxyParams.arms) / galaxyParams.arms) * Math.PI * 2;
      const r = armRadii[i];
      armRandomsX[i] = Math.pow(Math.random(), galaxyParams.power) * (Math.random() < 0.5 ? 1 : -1) * galaxyParams.randomness * (r * 0.65 + 0.2);
      armRandomsY[i] = Math.pow(Math.random(), galaxyParams.power) * (Math.random() < 0.5 ? 1 : -1) * (0.22 + r * 0.06);
      armRandomsZ[i] = Math.pow(Math.random(), galaxyParams.power) * (Math.random() < 0.5 ? 1 : -1) * galaxyParams.randomness * (r * 0.65 + 0.2);
      armColorJitters[i] = (Math.random() - 0.5) * 0.08;
    }

    function updateArmPositions(twist) {
      for (let i = 0; i < armCount; i++) {
        const i3 = i * 3;
        const r = armRadii[i];
        const spinAngle = r * twist;
        const branchAngle = armBranchAngles[i];

        armPositions[i3] = Math.cos(branchAngle + spinAngle) * r + armRandomsX[i];
        armPositions[i3 + 1] = armRandomsY[i];
        armPositions[i3 + 2] = Math.sin(branchAngle + spinAngle) * r + armRandomsZ[i];
      }
      armGeometry.attributes.position.needsUpdate = true;
    }

    function updateArmColors(themeKey) {
      const theme = GALAXY_THEMES[themeKey] || GALAXY_THEMES.sapphire;
      const insideColor = new THREE.Color(theme.insideColor);
      const midColor = new THREE.Color(theme.midColor);
      const outsideColor = new THREE.Color(theme.outsideColor);

      for (let i = 0; i < armCount; i++) {
        const i3 = i * 3;
        const r = armRadii[i];
        const t = r / galaxyParams.radius;
        let mixedColor;

        if (t < 0.25) {
          mixedColor = insideColor.clone().lerp(midColor, t / 0.25);
        } else {
          mixedColor = midColor.clone().lerp(outsideColor, (t - 0.25) / 0.75);
        }

        const brightnessFalloff = Math.max(0.35, 1 - t * 0.45);
        const jitter = armColorJitters[i];

        armColors[i3] = Math.min(1, Math.max(0, (mixedColor.r + jitter) * brightnessFalloff));
        armColors[i3 + 1] = Math.min(1, Math.max(0, (mixedColor.g + jitter) * brightnessFalloff));
        armColors[i3 + 2] = Math.min(1, Math.max(0, (mixedColor.b + jitter) * brightnessFalloff));
      }
      armGeometry.attributes.color.needsUpdate = true;
    }

    armGeometry.setAttribute('position', new THREE.BufferAttribute(armPositions, 3));
    armGeometry.setAttribute('color', new THREE.BufferAttribute(armColors, 3));

    updateArmPositions(galaxyState.twist);
    updateArmColors(galaxyState.theme);

    const armMaterial = new THREE.PointsMaterial({
      size: galaxyState.starSize,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
      map: starTexture,
      transparent: true,
      opacity: 0.68,
    });

    const galaxyArms = new THREE.Points(armGeometry, armMaterial);
    galaxyGroup.add(galaxyArms);

    // --- 2. COMPACT, LUMINOUS GALACTIC BULGE (1,200 Stars) ---
    const coreCount = 1200;
    const coreGeometry = new THREE.BufferGeometry();
    const corePositions = new Float32Array(coreCount * 3);
    const coreColors = new Float32Array(coreCount * 3);
    const coreDistances = new Float32Array(coreCount);

    for (let i = 0; i < coreCount; i++) {
      const i3 = i * 3;
      const r = Math.pow(Math.random(), 2.6) * 2.2;
      coreDistances[i] = r;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI * 0.5;

      corePositions[i3] = r * Math.cos(phi) * Math.cos(theta);
      corePositions[i3 + 1] = r * Math.sin(phi) * 0.5;
      corePositions[i3 + 2] = r * Math.cos(phi) * Math.sin(theta);
    }

    function updateCoreColors(themeKey) {
      const theme = GALAXY_THEMES[themeKey] || GALAXY_THEMES.sapphire;
      const coreCenterColor = new THREE.Color(theme.insideColor);
      const coreEdgeColor = new THREE.Color(theme.midColor);

      for (let i = 0; i < coreCount; i++) {
        const i3 = i * 3;
        const t = coreDistances[i] / 2.2;
        const c = coreCenterColor.clone().lerp(coreEdgeColor, t);
        coreColors[i3] = c.r * 0.92;
        coreColors[i3 + 1] = c.g * 0.92;
        coreColors[i3 + 2] = c.b * 0.92;
      }
      coreGeometry.attributes.color.needsUpdate = true;
    }

    coreGeometry.setAttribute('position', new THREE.BufferAttribute(corePositions, 3));
    coreGeometry.setAttribute('color', new THREE.BufferAttribute(coreColors, 3));
    updateCoreColors(galaxyState.theme);

    const coreMaterial = new THREE.PointsMaterial({
      size: galaxyState.starSize * 1.38,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
      map: starTexture,
      transparent: true,
      opacity: 0.85,
    });

    const galaxyCore = new THREE.Points(coreGeometry, coreMaterial);
    galaxyGroup.add(galaxyCore);

    // --- 3. DARK INTERSTELLAR DUST LANES (1,800 Particles) ---
    const dustCount = 1800;
    const dustGeometry = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(dustCount * 3);
    const dustColors = new Float32Array(dustCount * 3);

    const dustRadii = new Float32Array(dustCount);
    const dustBranchAngles = new Float32Array(dustCount);
    const dustJitterX = new Float32Array(dustCount);
    const dustJitterY = new Float32Array(dustCount);
    const dustJitterZ = new Float32Array(dustCount);

    for (let i = 0; i < dustCount; i++) {
      dustRadii[i] = 1.2 + Math.pow(Math.random(), 1.3) * 9.5;
      dustBranchAngles[i] = ((i % 3) / 3) * Math.PI * 2 - 0.22;
      dustJitterX[i] = (Math.random() - 0.5) * 0.8;
      dustJitterY[i] = (Math.random() - 0.5) * 0.15;
      dustJitterZ[i] = (Math.random() - 0.5) * 0.8;
    }

    function updateDustPositions(twist) {
      for (let i = 0; i < dustCount; i++) {
        const i3 = i * 3;
        const r = dustRadii[i];
        const spinAngle = r * (twist * 1.02);
        const branchAngle = dustBranchAngles[i];

        dustPositions[i3] = Math.cos(branchAngle + spinAngle) * r + dustJitterX[i];
        dustPositions[i3 + 1] = dustJitterY[i];
        dustPositions[i3 + 2] = Math.sin(branchAngle + spinAngle) * r + dustJitterZ[i];
      }
      dustGeometry.attributes.position.needsUpdate = true;
    }

    function updateDustColors(themeKey) {
      const theme = GALAXY_THEMES[themeKey] || GALAXY_THEMES.sapphire;
      const [dr, dg, db] = theme.dustColor;
      for (let i = 0; i < dustCount; i++) {
        const i3 = i * 3;
        dustColors[i3] = dr;
        dustColors[i3 + 1] = dg;
        dustColors[i3 + 2] = db;
      }
      dustGeometry.attributes.color.needsUpdate = true;
    }

    dustGeometry.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    dustGeometry.setAttribute('color', new THREE.BufferAttribute(dustColors, 3));
    updateDustPositions(galaxyState.twist);
    updateDustColors(galaxyState.theme);

    const dustMaterial = new THREE.PointsMaterial({
      size: 0.28,
      depthWrite: false,
      transparent: true,
      opacity: 0.35,
      vertexColors: true,
      map: starTexture,
      blending: THREE.AdditiveBlending,
    });

    const galaxyDust = new THREE.Points(dustGeometry, dustMaterial);
    galaxyGroup.add(galaxyDust);

    // --- 4. DEEP-FIELD AMBIENT BACKGROUND STARS ---
    const fieldStarCount = 1500;
    const fieldGeometry = new THREE.BufferGeometry();
    const fieldPositions = new Float32Array(fieldStarCount * 3);
    const fieldColors = new Float32Array(fieldStarCount * 3);

    for (let i = 0; i < fieldStarCount; i++) {
      const i3 = i * 3;
      fieldPositions[i3] = (Math.random() - 0.5) * 180;
      fieldPositions[i3 + 1] = (Math.random() - 0.5) * 180;
      fieldPositions[i3 + 2] = (Math.random() - 0.5) * 180;

      const faintness = 0.3 + Math.random() * 0.45;
      fieldColors[i3] = 0.7 * faintness;
      fieldColors[i3 + 1] = 0.85 * faintness;
      fieldColors[i3 + 2] = 1.0 * faintness;
    }

    fieldGeometry.setAttribute('position', new THREE.BufferAttribute(fieldPositions, 3));
    fieldGeometry.setAttribute('color', new THREE.BufferAttribute(fieldColors, 3));

    const fieldMaterial = new THREE.PointsMaterial({
      size: 0.35,
      depthWrite: false,
      transparent: true,
      opacity: 0.45,
      vertexColors: true,
      map: starTexture,
      blending: THREE.AdditiveBlending,
    });

    const fieldStars = new THREE.Points(fieldGeometry, fieldMaterial);
    scene.add(fieldStars);

    // --- 5. INTERACTIVE SHOOTING STAR & METEOR SHOWER ENGINE ---
    const MAX_METEORS = 16;
    const meteorPool = [];
    const meteorLineGeometry = new THREE.BufferGeometry();
    const meteorPositions = new Float32Array(MAX_METEORS * 2 * 3); // 2 vertices per line (head, tail)
    const meteorColors = new Float32Array(MAX_METEORS * 2 * 3);

    // Head sprites for radiant meteor glow
    const meteorHeadGeometry = new THREE.BufferGeometry();
    const meteorHeadPositions = new Float32Array(MAX_METEORS * 3);
    const meteorHeadColors = new Float32Array(MAX_METEORS * 3);

    for (let i = 0; i < MAX_METEORS; i++) {
      meteorPool.push({
        id: i,
        active: false,
        head: new THREE.Vector3(9999, 9999, 9999),
        tail: new THREE.Vector3(9999, 9999, 9999),
        velocity: new THREE.Vector3(),
        length: 2.2,
        life: 0,
        maxLife: 1.0,
        colorHead: new THREE.Color('#ffffff'),
        colorTail: new THREE.Color('#38bdf8'),
      });
      // Initialize offscreen
      const i6 = i * 6;
      meteorPositions[i6] = 9999;
      meteorPositions[i6 + 1] = 9999;
      meteorPositions[i6 + 2] = 9999;
      meteorPositions[i6 + 3] = 9999;
      meteorPositions[i6 + 4] = 9999;
      meteorPositions[i6 + 5] = 9999;

      const i3 = i * 3;
      meteorHeadPositions[i3] = 9999;
      meteorHeadPositions[i3 + 1] = 9999;
      meteorHeadPositions[i3 + 2] = 9999;
    }

    meteorLineGeometry.setAttribute('position', new THREE.BufferAttribute(meteorPositions, 3));
    meteorLineGeometry.setAttribute('color', new THREE.BufferAttribute(meteorColors, 3));

    const meteorLineMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      linewidth: 2,
    });

    const meteorLines = new THREE.LineSegments(meteorLineGeometry, meteorLineMaterial);
    scene.add(meteorLines);

    meteorHeadGeometry.setAttribute('position', new THREE.BufferAttribute(meteorHeadPositions, 3));
    meteorHeadGeometry.setAttribute('color', new THREE.BufferAttribute(meteorHeadColors, 3));

    const meteorHeadMaterial = new THREE.PointsMaterial({
      size: 0.42,
      map: starTexture,
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const meteorHeads = new THREE.Points(meteorHeadGeometry, meteorHeadMaterial);
    scene.add(meteorHeads);

    // Function to spawn a meteor from a specific or randomized origin
    function spawnMeteor(origin, target, speedMultiplier = 1.0, chimePitch = 1.0) {
      const meteor = meteorPool.find((m) => !m.active);
      if (!meteor) return;

      const theme = GALAXY_THEMES[galaxyState.theme] || GALAXY_THEMES.sapphire;
      meteor.colorHead.set('#ffffff');
      meteor.colorTail.set(theme.outsideColor);

      if (origin && target) {
        meteor.head.copy(origin);
        meteor.velocity.subVectors(target, origin).normalize().multiplyScalar(18 * speedMultiplier);
      } else {
        // Natural ambient streak: high-right to low-left across deep space
        const startX = 6 + Math.random() * 12;
        const startY = 5 + Math.random() * 8;
        const startZ = (Math.random() - 0.5) * 6;
        meteor.head.set(startX, startY, startZ);

        const angle = Math.PI * (1.15 + (Math.random() - 0.5) * 0.25);
        const speed = (16 + Math.random() * 8) * speedMultiplier;
        meteor.velocity.set(Math.cos(angle) * speed, Math.sin(angle) * speed, (Math.random() - 0.5) * 4);
      }

      meteor.tail.copy(meteor.head);
      meteor.length = 1.8 + Math.random() * 2.2;
      meteor.life = 0;
      meteor.maxLife = 0.9 + Math.random() * 0.5;
      meteor.active = true;

      soundEngine.playCelestialChime(chimePitch);
    }

    // Function to handle canvas clicks
    function spawnClickMeteor(normX, normY) {
      // Unproject 2D screen coordinates into 3D space
      const vector = new THREE.Vector3(normX, normY, 0.5);
      vector.unproject(camera);
      const dir = vector.sub(camera.position).normalize();
      const distance = 8.5;
      const targetPos = camera.position.clone().add(dir.multiplyScalar(distance));

      // Origin begins slightly off the trajectory and streaks through the clicked point
      const originPos = targetPos.clone().add(new THREE.Vector3(
        4 + (Math.random() - 0.5) * 2,
        3 + (Math.random() - 0.5) * 2,
        -1.5
      ));

      spawnMeteor(originPos, targetPos, 1.25, 1.1);
    }

    // Function to trigger a meteor shower cascade
    function triggerCascade(count = 7) {
      soundEngine.playMeteorSwoosh();
      const pitches = [1.0, 1.15, 1.3, 1.45, 1.6, 1.8, 2.0];
      for (let i = 0; i < count; i++) {
        setTimeout(() => {
          spawnMeteor(null, null, 1.0 + i * 0.08, pitches[i % pitches.length]);
        }, i * 140);
      }
    }

    // Ambient shooting stars timer
    let nextAmbientMeteorTime = 4.0;

    // --- Dynamic Subscriptions to Galaxy Manager ---
    const unsubGalaxy = galaxyManager.subscribe((newState, event) => {
      galaxyState = newState;

      if (!event || event.type === 'theme' || event.type === 'reset') {
        updateArmColors(galaxyState.theme);
        updateCoreColors(galaxyState.theme);
        updateDustColors(galaxyState.theme);
      }

      if (!event || event.type === 'twist' || event.type === 'reset') {
        updateArmPositions(galaxyState.twist);
        updateDustPositions(galaxyState.twist);
      }

      if (!event || event.type === 'starSize' || event.type === 'reset') {
        armMaterial.size = galaxyState.starSize;
        coreMaterial.size = galaxyState.starSize * 1.38;
      }

      if (event && event.type === 'meteor_shower') {
        triggerCascade(event.count || 7);
      }

      if (event && event.type === 'meteor_single') {
        spawnMeteor(null, null, 1.2, 1.15);
      }
    });

    // --- Interactive Motion & Mouse Tracking ---
    let mouseX = 0;
    let mouseY = 0;
    let targetTiltX = 0;
    let targetTiltY = 0;
    let currentScrollY = window.scrollY || 0;

    const handleMouseMove = (e) => {
      const normX = (e.clientX / window.innerWidth - 0.5) * 2;
      const normY = (e.clientY / window.innerHeight - 0.5) * 2;
      mouseX = normX;
      mouseY = normY;
      targetTiltX = -normY * 0.22;
      targetTiltY = normX * 0.3;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Background click listener for shooting stars
    const handleWindowClick = (e) => {
      // Don't trigger if user clicked an interactive UI element or card
      if (
        e.target.closest(
          'button, a, input, textarea, .galaxy-hud-card, .cyber-player-card, .project-modal-window, .cv-modal-window, .cmd-window, .design-modal-window, .tilt-card-wrapper'
        )
      ) {
        return;
      }
      const normX = (e.clientX / window.innerWidth - 0.5) * 2;
      const normY = -(e.clientY / window.innerHeight - 0.5) * 2;
      spawnClickMeteor(normX, normY);
    };
    window.addEventListener('click', handleWindowClick);

    const handleScroll = () => {
      currentScrollY = window.scrollY || 0;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    const handleResize = () => {
      if (!camera || !renderer) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      const isDesk = window.innerWidth > 768;
      galaxyGroup.position.set(isDesk ? 1.6 : 0, isDesk ? 0.1 : 0.6, -1.8);
    };
    window.addEventListener('resize', handleResize);

    // --- Animation Loop ---
    let animationFrameId;
    const clock = new THREE.Clock();
    let accumulatedArmRotation = 0;
    let accumulatedCoreRotation = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();
      const speedMult = typeof galaxyState.speed === 'number' ? galaxyState.speed : 1.0;

      // 1. Ambient Meteor Spawner
      if (elapsedTime > nextAmbientMeteorTime) {
        spawnMeteor();
        nextAmbientMeteorTime = elapsedTime + 5.0 + Math.random() * 4.5;
      }

      // 2. Update Active Meteors
      let activeMeteorsExist = false;
      for (let i = 0; i < MAX_METEORS; i++) {
        const m = meteorPool[i];
        const i6 = i * 6;
        const i3 = i * 3;

        if (m.active) {
          activeMeteorsExist = true;
          m.life += delta;
          const progress = m.life / m.maxLife;

          if (progress >= 1.0) {
            m.active = false;
            // Move offscreen
            meteorPositions[i6] = 9999;
            meteorPositions[i6 + 1] = 9999;
            meteorPositions[i6 + 2] = 9999;
            meteorPositions[i6 + 3] = 9999;
            meteorPositions[i6 + 4] = 9999;
            meteorPositions[i6 + 5] = 9999;

            meteorHeadPositions[i3] = 9999;
            meteorHeadPositions[i3 + 1] = 9999;
            meteorHeadPositions[i3 + 2] = 9999;
          } else {
            // Advance head
            m.head.x += m.velocity.x * delta;
            m.head.y += m.velocity.y * delta;
            m.head.z += m.velocity.z * delta;

            // Trailing tail
            const velNorm = m.velocity.clone().normalize();
            m.tail.copy(m.head).sub(velNorm.multiplyScalar(m.length));

            // Fade intensity based on progress
            const fade = Math.sin(progress * Math.PI); // Smooth ease-in ease-out
            const headAlpha = fade * 0.95;
            const tailAlpha = fade * 0.05;

            // Update line positions
            meteorPositions[i6] = m.head.x;
            meteorPositions[i6 + 1] = m.head.y;
            meteorPositions[i6 + 2] = m.head.z;
            meteorPositions[i6 + 3] = m.tail.x;
            meteorPositions[i6 + 4] = m.tail.y;
            meteorPositions[i6 + 5] = m.tail.z;

            // Update line colors (head -> tail)
            meteorColors[i6] = m.colorHead.r * headAlpha;
            meteorColors[i6 + 1] = m.colorHead.g * headAlpha;
            meteorColors[i6 + 2] = m.colorHead.b * headAlpha;
            meteorColors[i6 + 3] = m.colorTail.r * tailAlpha;
            meteorColors[i6 + 4] = m.colorTail.g * tailAlpha;
            meteorColors[i6 + 5] = m.colorTail.b * tailAlpha;

            // Update head sprite
            meteorHeadPositions[i3] = m.head.x;
            meteorHeadPositions[i3 + 1] = m.head.y;
            meteorHeadPositions[i3 + 2] = m.head.z;

            meteorHeadColors[i3] = m.colorHead.r * headAlpha;
            meteorHeadColors[i3 + 1] = m.colorHead.g * headAlpha;
            meteorHeadColors[i3 + 2] = m.colorHead.b * headAlpha;
          }
        }
      }

      if (activeMeteorsExist) {
        meteorLineGeometry.attributes.position.needsUpdate = true;
        meteorLineGeometry.attributes.color.needsUpdate = true;
        meteorHeadGeometry.attributes.position.needsUpdate = true;
        meteorHeadGeometry.attributes.color.needsUpdate = true;
      }

      // 3. Galactic rotation
      accumulatedArmRotation += delta * 0.038 * speedMult;
      accumulatedCoreRotation += delta * 0.048 * speedMult;

      galaxyArms.rotation.y = accumulatedArmRotation;
      galaxyCore.rotation.y = accumulatedCoreRotation;
      galaxyDust.rotation.y = accumulatedArmRotation;

      // 4. Gentle zero-g floating sway
      const floatY = Math.sin(elapsedTime * 0.5) * 0.18;
      const floatX = Math.cos(elapsedTime * 0.38) * 0.12;
      const isDesk = window.innerWidth > 768;
      const baseX = isDesk ? 1.6 : 0;
      const baseY = isDesk ? 0.1 : 0.6;

      galaxyGroup.position.x += (baseX + floatX + mouseX * 0.35 - galaxyGroup.position.x) * 0.035;
      galaxyGroup.position.y += (baseY + floatY - mouseY * 0.25 - galaxyGroup.position.y) * 0.035;

      // 5. Smooth 3D tilt tracking + responsive tilt mode transition
      const tiltConfig = TILT_MODES[galaxyState.tilt] || TILT_MODES.oblique;
      currentTiltX += (tiltConfig.rotX - currentTiltX) * 0.045;
      currentTiltY += (tiltConfig.rotY - currentTiltY) * 0.045;

      galaxyGroup.rotation.x += (currentTiltX + targetTiltX - galaxyGroup.rotation.x) * 0.04;
      galaxyGroup.rotation.y += (currentTiltY + targetTiltY - galaxyGroup.rotation.y) * 0.04;

      // 6. Subtle background star drift
      fieldStars.rotation.y = elapsedTime * 0.002;
      fieldStars.rotation.x = elapsedTime * 0.001;

      // 7. Soundtrack pulse
      if (isMusicPlaying) {
        const beatPulse = 1 + 0.04 * Math.sin(elapsedTime * 4.8);
        galaxyCore.scale.set(beatPulse, beatPulse, beatPulse);
        coreMaterial.opacity = 0.82 + 0.08 * Math.sin(elapsedTime * 4.8);
        armMaterial.opacity = 0.65 + 0.07 * Math.cos(elapsedTime * 4.8);
      } else {
        const idlePulse = 1 + 0.01 * Math.sin(elapsedTime * 1.2);
        galaxyCore.scale.set(idlePulse, idlePulse, idlePulse);
        coreMaterial.opacity = 0.85;
        armMaterial.opacity = 0.68;
      }

      // 8. Camera scroll depth
      const scrollOffset = currentScrollY * 0.0035;
      camera.position.y = 0.4 - scrollOffset * 0.5;
      camera.position.z = 10.5 + scrollOffset * 0.7;

      renderer.render(scene, camera);
    };

    animate();

    // --- Cleanup ---
    return () => {
      cancelAnimationFrame(animationFrameId);
      unsubAudio();
      unsubGalaxy();
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleWindowClick);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);

      armGeometry.dispose();
      armMaterial.dispose();
      coreGeometry.dispose();
      coreMaterial.dispose();
      dustGeometry.dispose();
      dustMaterial.dispose();
      fieldGeometry.dispose();
      fieldMaterial.dispose();
      meteorLineGeometry.dispose();
      meteorLineMaterial.dispose();
      meteorHeadGeometry.dispose();
      meteorHeadMaterial.dispose();
      starTexture.dispose();
      renderer.dispose();

      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      id="scene"
      aria-hidden="true"
    />
  );
}

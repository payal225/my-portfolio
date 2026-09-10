'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import {
  RotateCcw,
  Eye,
  Box,
  Layers,
  Sparkles,
  Play,
  Pause,
  Compass,
  Cpu,
  Info,
} from 'lucide-react';
import { soundEngine } from '../lib/soundEffects';

const MODEL_DATA = {
  donut: {
    id: 'donut',
    name: 'The Iconic Blender Donut',
    badge: 'Blender 3D • The Classic Milestone',
    polycount: 'Verts: 2,840 • Faces: 3,210',
    description:
      'The rite of passage for every 3D learner! Modeled following Andrew Price’s beloved tutorial — featuring golden baked dough, glossy strawberry icing with subtle specular highlights, and colorful sprinkles.',
    details: 'Modeled with Torus primitives, sculpting brushes, procedural displacement, and particle hair scatter.',
  },
  car: {
    id: 'car',
    name: 'Low-Poly Sports Car',
    badge: 'Blender 3D • Hard Surface & Automotive',
    polycount: 'Verts: 3,420 • Faces: 4,180',
    description:
      'A stylized low-poly sports coupe designed with angular bodywork, custom rims, tinted windshield, and sleek front & rear lighting.',
    details: 'Engineered via hard-surface box modeling, edge loop beveling, emissive materials, and wheel assemblies.',
  },
  tree: {
    id: 'tree',
    name: 'Stylized Bonsai Pine',
    badge: 'Blender 3D • Nature Environment',
    polycount: 'Verts: 1,980 • Faces: 2,450',
    description:
      'A tranquil low-poly bonsai pine tree with multi-tiered faceted foliage, organic branch structure, and a floating moss stone pedestal.',
    details: 'Sculpted using multi-tiered conical geometry with flat face normals, vertex color shading, and floating island terrain.',
  },
};

export default function BlenderStudio() {
  const containerRef = useRef(null);
  const [activeModel, setActiveModel] = useState('donut');
  const [shadingMode, setShadingMode] = useState('rendered'); // 'rendered' | 'clay' | 'wireframe'
  const [autoRotate, setAutoRotate] = useState(true);
  const [loading, setLoading] = useState(false);

  // References for Three.js animation and controls
  const controlsRef = useRef(null);
  const currentMeshGroupRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const originalMaterialsRef = useRef(new Map());

  // Procedural 3D Mesh Generators
  const createDonutModel = () => {
    const group = new THREE.Group();

    // 1. Baked Dough Torus
    const doughGeo = new THREE.TorusGeometry(1.3, 0.62, 32, 64);
    const doughMat = new THREE.MeshStandardMaterial({
      color: 0xdf9c63,
      roughness: 0.75,
      metalness: 0.05,
    });
    const doughMesh = new THREE.Mesh(doughGeo, doughMat);
    doughMesh.rotation.x = Math.PI / 2.2;
    group.add(doughMesh);

    // 2. Glossy Strawberry Icing
    const icingGeo = new THREE.TorusGeometry(1.32, 0.63, 32, 64, Math.PI * 1.85);
    const icingMat = new THREE.MeshStandardMaterial({
      color: 0xec4899,
      roughness: 0.18,
      metalness: 0.1,
    });
    const icingMesh = new THREE.Mesh(icingGeo, icingMat);
    icingMesh.rotation.x = Math.PI / 2.2;
    icingMesh.position.y = 0.06;
    group.add(icingMesh);

    // 3. Colorful Sprinkles (60 capsule/cylinder meshes)
    const sprinkleColors = [0x00f7ff, 0xa855f7, 0xfacc15, 0x10b981, 0xffffff];
    const sprinkleGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.22, 8);

    for (let i = 0; i < 75; i++) {
      const angle = (i / 75) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
      const radius = 1.3 + (Math.random() - 0.5) * 0.45;
      const x = radius * Math.cos(angle);
      const z = radius * Math.sin(angle);
      const y = 0.58 + Math.random() * 0.08;

      const spMat = new THREE.MeshStandardMaterial({
        color: sprinkleColors[i % sprinkleColors.length],
        roughness: 0.3,
      });
      const sprinkle = new THREE.Mesh(sprinkleGeo, spMat);
      sprinkle.position.set(x, y, z);
      sprinkle.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      group.add(sprinkle);
    }

    return group;
  };

  const createCarModel = () => {
    const group = new THREE.Group();

    // 1. Lower Body Chassis
    const bodyGeo = new THREE.BoxGeometry(3.4, 0.65, 1.6);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.25,
      metalness: 0.85,
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0.45;
    group.add(body);

    // 2. Cockpit / Cabin Roof
    const cabinGeo = new THREE.BoxGeometry(1.8, 0.6, 1.3);
    const cabinMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.1,
      metalness: 0.9,
      transparent: true,
      opacity: 0.8,
    });
    const cabin = new THREE.Mesh(cabinGeo, cabinMat);
    cabin.position.set(-0.2, 0.95, 0);
    group.add(cabin);

    // 3. Glowing Headlights (Neon Cyan)
    const lightMat = new THREE.MeshBasicMaterial({ color: 0x00f7ff });
    const headlightL = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.35), lightMat);
    headlightL.position.set(1.71, 0.5, 0.5);
    const headlightR = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.35), lightMat);
    headlightR.position.set(1.71, 0.5, -0.5);
    group.add(headlightL, headlightR);

    // 4. Rear Taillight Strip (Neon Red)
    const tailMat = new THREE.MeshBasicMaterial({ color: 0xff0055 });
    const taillight = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.1, 1.4), tailMat);
    taillight.position.set(-1.71, 0.55, 0);
    group.add(taillight);

    // 5. Rear Spoiler Wing
    const spoilerWing = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.08, 1.7),
      new THREE.MeshStandardMaterial({ color: 0x00f7ff, metalness: 0.8, roughness: 0.2 })
    );
    spoilerWing.position.set(-1.5, 1.15, 0);
    const spoilerPostL = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.4), bodyMat);
    spoilerPostL.position.set(-1.5, 0.95, 0.55);
    const spoilerPostR = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.4), bodyMat);
    spoilerPostR.position.set(-1.5, 0.95, -0.55);
    group.add(spoilerWing, spoilerPostL, spoilerPostR);

    // 6. Wheels (4 alloy wheels)
    const wheelGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.35, 24);
    wheelGeo.rotateX(Math.PI / 2);
    const tireMat = new THREE.MeshStandardMaterial({ color: 0x050811, roughness: 0.85 });
    const rimMat = new THREE.MeshStandardMaterial({ color: 0x00f7ff, metalness: 0.9, roughness: 0.2 });

    const wheelPositions = [
      [1.1, 0.35, 0.85],
      [1.1, 0.35, -0.85],
      [-1.1, 0.35, 0.85],
      [-1.1, 0.35, -0.85],
    ];

    wheelPositions.forEach(([wx, wy, wz]) => {
      const tire = new THREE.Mesh(wheelGeo, tireMat);
      tire.position.set(wx, wy, wz);
      const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.37, 12).rotateX(Math.PI / 2), rimMat);
      rim.position.set(wx, wy, wz);
      group.add(tire, rim);
    });

    // 7. Neon Underglow Strip
    const underglow = new THREE.PointLight(0x00f7ff, 2.5, 4);
    underglow.position.set(0, 0.1, 0);
    group.add(underglow);

    group.position.y = -0.3;
    return group;
  };

  const createTreeModel = () => {
    const group = new THREE.Group();

    // 1. Floating Pedestal Island
    const islandGeo = new THREE.CylinderGeometry(1.8, 1.2, 0.45, 7);
    const islandMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      flatShading: true,
      roughness: 0.9,
    });
    const island = new THREE.Mesh(islandGeo, islandMat);
    island.position.y = -1.1;
    group.add(island);

    // Floating moss ring
    const mossGeo = new THREE.CylinderGeometry(1.7, 1.7, 0.1, 7);
    const mossMat = new THREE.MeshStandardMaterial({
      color: 0x059669,
      flatShading: true,
      roughness: 0.8,
    });
    const moss = new THREE.Mesh(mossGeo, mossMat);
    moss.position.y = -0.85;
    group.add(moss);

    // 2. Organic Trunk
    const trunkGeo = new THREE.CylinderGeometry(0.22, 0.42, 2.0, 7);
    const trunkMat = new THREE.MeshStandardMaterial({
      color: 0x78350f,
      flatShading: true,
      roughness: 0.85,
    });
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.set(0, 0.1, 0);
    group.add(trunk);

    // 3. Foliage Canopies (3 stacked low-poly cones)
    const foliageColors = [0x047857, 0x10b981, 0x34d399];
    const tiers = [
      { radius: 1.5, height: 1.3, y: 0.9, color: foliageColors[0] },
      { radius: 1.15, height: 1.1, y: 1.7, color: foliageColors[1] },
      { radius: 0.8, height: 0.95, y: 2.35, color: foliageColors[2] },
    ];

    tiers.forEach((tier) => {
      const coneGeo = new THREE.ConeGeometry(tier.radius, tier.height, 7);
      const coneMat = new THREE.MeshStandardMaterial({
        color: tier.color,
        flatShading: true,
        roughness: 0.6,
      });
      const cone = new THREE.Mesh(coneGeo, coneMat);
      cone.position.y = tier.y;
      group.add(cone);
    });

    // 4. Firefly Energy Particles around the tree
    const fireflyGeo = new THREE.BufferGeometry();
    const count = 35;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 3.5;
      positions[i + 1] = Math.random() * 3.2 - 0.5;
      positions[i + 2] = (Math.random() - 0.5) * 3.5;
    }
    fireflyGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const fireflyMat = new THREE.PointsMaterial({
      color: 0x00f7ff,
      size: 0.12,
      transparent: true,
      opacity: 0.85,
    });
    const fireflies = new THREE.Points(fireflyGeo, fireflyMat);
    group.add(fireflies);

    group.position.y = -0.3;
    return group;
  };

  // Load Model into Scene
  const loadModel = (modelId) => {
    if (!sceneRef.current) return;
    const scene = sceneRef.current;

    // Remove existing mesh group
    if (currentMeshGroupRef.current) {
      scene.remove(currentMeshGroupRef.current);
      currentMeshGroupRef.current = null;
    }
    originalMaterialsRef.current.clear();

    // Instantiate high-fidelity procedural 3D model
    let modelGroup;
    if (modelId === 'car') {
      modelGroup = createCarModel();
    } else if (modelId === 'tree') {
      modelGroup = createTreeModel();
    } else {
      modelGroup = createDonutModel();
    }

    scene.add(modelGroup);
    currentMeshGroupRef.current = modelGroup;
    applyShadingMode(modelGroup, shadingMode);
  };

  // Apply Shading Mode (Rendered / Clay / Wireframe)
  const applyShadingMode = (group, mode) => {
    if (!group) return;

    group.traverse((child) => {
      if (child.isMesh) {
        if (!originalMaterialsRef.current.has(child)) {
          originalMaterialsRef.current.set(child, child.material);
        }

        if (mode === 'wireframe') {
          child.material = new THREE.MeshBasicMaterial({
            color: 0x00f7ff,
            wireframe: true,
          });
        } else if (mode === 'clay') {
          child.material = new THREE.MeshStandardMaterial({
            color: 0x94a3b8,
            roughness: 0.9,
            metalness: 0.05,
            flatShading: child.material.flatShading || false,
          });
        } else {
          // Rendered PBR mode: restore original
          const orig = originalMaterialsRef.current.get(child);
          if (orig) child.material = orig;
        }
      }
    });
  };

  // Switch Active Model
  const handleSelectModel = (id) => {
    soundEngine.playClick();
    setActiveModel(id);
    loadModel(id);
    resetCamera();
  };

  // Switch Shading Mode
  const handleSelectShading = (mode) => {
    soundEngine.playClick();
    setShadingMode(mode);
    if (currentMeshGroupRef.current) {
      applyShadingMode(currentMeshGroupRef.current, mode);
    }
  };

  // Reset Camera View
  const resetCamera = () => {
    soundEngine.playClick();
    if (cameraRef.current && controlsRef.current) {
      cameraRef.current.position.set(0, 2.2, 4.8);
      controlsRef.current.target.set(0, 0.2, 0);
      controlsRef.current.update();
    }
  };

  // Three.js Scene Setup
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 2.2, 4.8);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 12;
    controls.minDistance = 2;
    controls.target.set(0, 0.2, 0);
    controlsRef.current = controls;

    // Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(5, 8, 5);
    scene.add(keyLight);

    const fillCyan = new THREE.PointLight(0x00f7ff, 3, 20);
    fillCyan.position.set(-6, 3, 3);
    scene.add(fillCyan);

    const rimViolet = new THREE.PointLight(0xa855f7, 3.5, 20);
    rimViolet.position.set(0, 4, -5);
    scene.add(rimViolet);

    // Initial Model
    loadModel('donut');

    // Resize Observer
    const resizeObserver = new ResizeObserver(() => {
      if (!container || !camera || !renderer) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    });
    resizeObserver.observe(container);

    // Animation Loop
    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      controls.update();

      if (autoRotate && currentMeshGroupRef.current) {
        currentMeshGroupRef.current.rotation.y += 0.008;
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      controls.dispose();
      renderer.dispose();
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  const info = MODEL_DATA[activeModel];

  return (
    <div className="blender-studio-container">
      {/* Studio Header Bar */}
      <div className="studio-top-bar">
        <div className="studio-title-block">
          <div className="blender-badge">
            <Cpu size={14} className="pulse-cyan" />
            <span>BLENDER 3D VIEWPORT STUDIO</span>
          </div>
          <h3 className="studio-heading">Interactive 3D Asset Showcase</h3>
          <p className="studio-subtext">
            Drag to rotate in 3D space, inspect polygon edge flow with Blender viewport shading modes.
          </p>
        </div>

        {/* Model Switcher Buttons */}
        <div className="studio-model-selector">
          <button
            onClick={() => handleSelectModel('donut')}
            className={`model-select-btn ${activeModel === 'donut' ? 'is-active' : ''}`}
          >
            <span>🍩</span>
            <span>The Donut</span>
          </button>
          <button
            onClick={() => handleSelectModel('car')}
            className={`model-select-btn ${activeModel === 'car' ? 'is-active' : ''}`}
          >
            <span>🏎️</span>
            <span>Sports Car</span>
          </button>
          <button
            onClick={() => handleSelectModel('tree')}
            className={`model-select-btn ${activeModel === 'tree' ? 'is-active' : ''}`}
          >
            <span>🌲</span>
            <span>Bonsai Tree</span>
          </button>
        </div>
      </div>

      {/* Viewport Area */}
      <div className="studio-canvas-wrapper">
        <div ref={containerRef} className="studio-three-canvas" />

        {/* Viewport Floating HUD Toolbar */}
        <div className="viewport-hud-toolbar">
          <div className="hud-tools-group">
            <span className="hud-group-label">SHADING:</span>
            <button
              onClick={() => handleSelectShading('rendered')}
              className={`hud-tool-btn ${shadingMode === 'rendered' ? 'active' : ''}`}
              title="Material Preview (PBR Lighting)"
            >
              <Sparkles size={14} />
              <span>Rendered</span>
            </button>
            <button
              onClick={() => handleSelectShading('clay')}
              className={`hud-tool-btn ${shadingMode === 'clay' ? 'active' : ''}`}
              title="Solid Sculpt Mode (Matte Clay)"
            >
              <Box size={14} />
              <span>Solid Clay</span>
            </button>
            <button
              onClick={() => handleSelectShading('wireframe')}
              className={`hud-tool-btn ${shadingMode === 'wireframe' ? 'active' : ''}`}
              title="Wireframe Topology Inspection"
            >
              <Layers size={14} />
              <span>Wireframe</span>
            </button>
          </div>

          <div className="hud-actions-group">
            <button
              onClick={() => {
                soundEngine.playClick();
                setAutoRotate(!autoRotate);
              }}
              className={`hud-tool-btn ${autoRotate ? 'active' : ''}`}
              title={autoRotate ? 'Pause 360° Turntable' : 'Start 360° Turntable'}
            >
              {autoRotate ? <Pause size={14} /> : <Play size={14} />}
              <span>Turntable</span>
            </button>

            <button
              onClick={resetCamera}
              className="hud-tool-btn"
              title="Reset camera to default hero view"
            >
              <RotateCcw size={14} />
              <span>Reset View</span>
            </button>
          </div>
        </div>

        {/* Floating Instruction Hint */}
        <div className="viewport-drag-hint">
          <Compass size={13} className="spin-slow" />
          <span>Left Drag: 3D Orbit • Wheel: Zoom • Right Drag: Pan</span>
        </div>
      </div>

      {/* Model Specs Information Card */}
      <div className="studio-info-footer">
        <div className="info-footer-left">
          <div className="model-name-row">
            <h4 className="model-main-name">{info.name}</h4>
            <span className="model-poly-badge">{info.polycount}</span>
          </div>
          <p className="model-desc-text">{info.description}</p>
        </div>

        <div className="info-footer-right">
          <div className="blender-tools-meta">
            <span className="meta-tag-label">MODELING TECH:</span>
            <span className="meta-tag-value">{info.details}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

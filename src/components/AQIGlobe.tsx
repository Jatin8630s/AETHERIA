import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { CityAQIData } from '../types';
import { createProceduralEarthTexture, createProceduralCloudsTexture } from '../utils/globeTextures';
import { RotateCw, ZoomIn, ZoomOut, Compass, Sparkles, Eye, Info } from 'lucide-react';

interface AQIGlobeProps {
  cities: CityAQIData[];
  selectedCity: CityAQIData;
  onSelectCity: (city: CityAQIData) => void;
}

export const AQIGlobe: React.FC<AQIGlobeProps> = ({ cities, selectedCity, onSelectCity }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const [hoveredCity, setHoveredCity] = useState<CityAQIData | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // References to keep Three.js animation state
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const globeGroupRef = useRef<THREE.Group | null>(null);
  const ringsGroupRef = useRef<THREE.Group | null>(null);
  const cloudsRef = useRef<THREE.Mesh | null>(null);
  const pinsGroupRef = useRef<THREE.Group | null>(null);
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const targetRotationRef = useRef<{ x: number; y: number }>({ x: 0.2, y: 0 });
  const autoRotateRef = useRef(true);

  // Sync autoRotate state to ref
  useEffect(() => {
    autoRotateRef.current = autoRotate;
  }, [autoRotate]);

  // Convert lat/long to 3D Cartesian coordinates on sphere
  const latLngToVector3 = (lat: number, lng: number, radius: number): THREE.Vector3 => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    return new THREE.Vector3(x, y, z);
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 2000);
    camera.position.set(0, 0, 360);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 2. Space Starfield Background
    const starsGeometry = new THREE.BufferGeometry();
    const starCount = 1800;
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount * 3; i += 3) {
      const radius = 600 + Math.random() * 800;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);

      starPositions[i] = radius * Math.sin(phi) * Math.cos(theta);
      starPositions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      starPositions[i + 2] = radius * Math.cos(phi);

      // Cyber space tint: mix of cyan, emerald, purple, white
      const colorMix = Math.random();
      if (colorMix > 0.7) {
        starColors[i] = 0.2; starColors[i + 1] = 0.8; starColors[i + 2] = 0.9;
      } else if (colorMix > 0.4) {
        starColors[i] = 0.2; starColors[i + 1] = 0.9; starColors[i + 2] = 0.6;
      } else {
        starColors[i] = 0.9; starColors[i + 1] = 0.95; starColors[i + 2] = 1.0;
      }
    }

    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starsGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
    const starsMaterial = new THREE.PointsMaterial({
      size: 2.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.85
    });
    const starField = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(starField);

    // 3. Globe Parent Group
    const globeGroup = new THREE.Group();
    globeGroupRef.current = globeGroup;
    scene.add(globeGroup);

    // 4. Procedural Earth Mesh
    const earthRadius = 90;
    const earthGeometry = new THREE.SphereGeometry(earthRadius, 64, 64);
    const earthCanvas = createProceduralEarthTexture();
    const earthTexture = new THREE.CanvasTexture(earthCanvas);
    earthTexture.wrapS = THREE.RepeatWrapping;
    earthTexture.wrapT = THREE.ClampToEdgeWrapping;

    const earthMaterial = new THREE.MeshStandardMaterial({
      map: earthTexture,
      roughness: 0.65,
      metalness: 0.15,
      emissive: new THREE.Color(0x02161b),
      emissiveIntensity: 0.4
    });
    const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
    globeGroup.add(earthMesh);

    // 5. Cloud Layer Mesh
    const cloudGeometry = new THREE.SphereGeometry(earthRadius + 1.2, 48, 48);
    const cloudCanvas = createProceduralCloudsTexture();
    const cloudTexture = new THREE.CanvasTexture(cloudCanvas);
    const cloudMaterial = new THREE.MeshStandardMaterial({
      map: cloudTexture,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending
    });
    const cloudsMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
    cloudsRef.current = cloudsMesh;
    globeGroup.add(cloudsMesh);

    // 6. Glowing Atmospheric Corona / Shader Mesh
    const atmosphereGeometry = new THREE.SphereGeometry(earthRadius + 6, 64, 64);
    const atmosphereMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.2);
          gl_FragColor = vec4(0.06, 0.75, 0.65, 1.0) * intensity * 1.5;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    globeGroup.add(atmosphereMesh);

    // 7. Concentric Orbital Particle Rings (Directly inspired by reference concept!)
    const ringsGroup = new THREE.Group();
    ringsGroupRef.current = ringsGroup;
    ringsGroup.rotation.x = Math.PI / 3.2; // tilted orbital plane
    scene.add(ringsGroup);

    const ringRadii = [135, 160, 190, 225, 260];
    ringRadii.forEach((radius, rIdx) => {
      const ringParticleCount = 450 + rIdx * 150;
      const ringGeometry = new THREE.BufferGeometry();
      const ringPositions = new Float32Array(ringParticleCount * 3);
      const ringColors = new Float32Array(ringParticleCount * 3);

      for (let i = 0; i < ringParticleCount; i++) {
        const angle = (i / ringParticleCount) * Math.PI * 2;
        const jitterRadius = radius + (Math.random() - 0.5) * 6;
        const jitterY = (Math.random() - 0.5) * 3;

        ringPositions[i * 3] = Math.cos(angle) * jitterRadius;
        ringPositions[i * 3 + 1] = jitterY;
        ringPositions[i * 3 + 2] = Math.sin(angle) * jitterRadius;

        // Alternate cyber emerald and cyan glows
        const ringAlpha = 0.5 + Math.random() * 0.5;
        ringColors[i * 3] = 0.05 * ringAlpha;
        ringColors[i * 3 + 1] = 0.75 * ringAlpha;
        ringColors[i * 3 + 2] = (rIdx % 2 === 0 ? 0.85 : 0.45) * ringAlpha;
      }

      ringGeometry.setAttribute('position', new THREE.BufferAttribute(ringPositions, 3));
      ringGeometry.setAttribute('color', new THREE.BufferAttribute(ringColors, 3));

      const ringMaterial = new THREE.PointsMaterial({
        size: 1.8 + (rIdx * 0.2),
        vertexColors: true,
        transparent: true,
        opacity: 0.65 - (rIdx * 0.08),
        blending: THREE.AdditiveBlending
      });

      const particleRing = new THREE.Points(ringGeometry, ringMaterial);
      ringsGroup.add(particleRing);
    });

    // 8. Dynamic AQI City Pins with Pulsing Stems
    const pinsGroup = new THREE.Group();
    pinsGroupRef.current = pinsGroup;
    globeGroup.add(pinsGroup);

    const pinMeshes: { mesh: THREE.Mesh; city: CityAQIData }[] = [];

    cities.forEach(city => {
      const pos = latLngToVector3(city.lat, city.lng, earthRadius);
      const normal = pos.clone().normalize();

      // Pin Head (Glowing Sphere)
      const pinColor = new THREE.Color(city.color);
      const pinGeom = new THREE.SphereGeometry(2.4, 16, 16);
      const pinMat = new THREE.MeshBasicMaterial({
        color: pinColor,
      });
      const pinMesh = new THREE.Mesh(pinGeom, pinMat);
      pinMesh.position.copy(pos.clone().add(normal.clone().multiplyScalar(4.5)));
      pinMesh.userData = { city };
      pinsGroup.add(pinMesh);

      // Pin Stem (line radiating outwards)
      const stemGeom = new THREE.CylinderGeometry(0.3, 0.3, 5, 8);
      const stemMat = new THREE.MeshBasicMaterial({
        color: pinColor,
        transparent: true,
        opacity: 0.6
      });
      const stemMesh = new THREE.Mesh(stemGeom, stemMat);
      stemMesh.position.copy(pos.clone().add(normal.clone().multiplyScalar(2.5)));
      stemMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);
      pinsGroup.add(stemMesh);

      // Outer Pulsing Aura Ring around Pin Head
      const auraGeom = new THREE.RingGeometry(2.8, 3.8, 16);
      const auraMat = new THREE.MeshBasicMaterial({
        color: pinColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending
      });
      const auraMesh = new THREE.Mesh(auraGeom, auraMat);
      auraMesh.position.copy(pinMesh.position);
      auraMesh.lookAt(new THREE.Vector3(0, 0, 0));
      pinsGroup.add(auraMesh);

      pinMeshes.push({ mesh: pinMesh, city });
    });

    // 9. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xa5f3fc, 2.4);
    sunLight.position.set(300, 200, 300);
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(0x10b981, 1.8);
    rimLight.position.set(-300, -100, -200);
    scene.add(rimLight);

    // 10. Mouse Interaction & Raycasting
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handlePointerMove = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      mouse.x = x;
      mouse.y = y;

      setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });

      if (isDraggingRef.current) {
        const deltaX = e.clientX - previousMousePositionRef.current.x;
        const deltaY = e.clientY - previousMousePositionRef.current.y;

        targetRotationRef.current.y += deltaX * 0.005;
        targetRotationRef.current.x += deltaY * 0.005;
        // Clamp vertical pitch so user doesn't flip upside-down
        targetRotationRef.current.x = Math.max(-Math.PI / 2.5, Math.min(Math.PI / 2.5, targetRotationRef.current.x));

        previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
      } else {
        // Raycast for pin hovering
        raycaster.setFromCamera(mouse, camera);
        const pinMeshObjects = pinMeshes.map(p => p.mesh);
        const intersects = raycaster.intersectObjects(pinMeshObjects);

        if (intersects.length > 0) {
          const hit = intersects[0].object;
          setHoveredCity(hit.userData.city);
          container.style.cursor = 'pointer';
        } else {
          setHoveredCity(null);
          container.style.cursor = isDraggingRef.current ? 'grabbing' : 'grab';
        }
      }
    };

    const handlePointerUp = (e: MouseEvent) => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
      }

      // Check click selection
      const rect = renderer.domElement.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      mouse.x = x;
      mouse.y = y;

      raycaster.setFromCamera(mouse, camera);
      const pinMeshObjects = pinMeshes.map(p => p.mesh);
      const intersects = raycaster.intersectObjects(pinMeshObjects);

      if (intersects.length > 0) {
        const clickedCity = intersects[0].object.userData.city as CityAQIData;
        onSelectCity(clickedCity);
      }
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (!cameraRef.current) return;
      const newZ = cameraRef.current.position.z + e.deltaY * 0.2;
      cameraRef.current.position.z = Math.max(180, Math.min(500, newZ));
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);
    domEl.addEventListener('wheel', handleWheel, { passive: false });

    // 11. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Slow cloud rotation
      if (cloudsRef.current) {
        cloudsRef.current.rotation.y += 0.0008;
      }

      // Subtle rotation of orbital particle rings
      if (ringsGroupRef.current) {
        ringsGroupRef.current.rotation.z = elapsedTime * 0.04;
      }

      // Auto-rotation when not dragging
      if (autoRotateRef.current && !isDraggingRef.current) {
        targetRotationRef.current.y += 0.0018;
      }

      // Smooth interpolation (lerp) for rotation
      if (globeGroupRef.current) {
        globeGroupRef.current.rotation.y += (targetRotationRef.current.y - globeGroupRef.current.rotation.y) * 0.08;
        globeGroupRef.current.rotation.x += (targetRotationRef.current.x - globeGroupRef.current.rotation.x) * 0.08;
      }

      // Pulse city pin scales
      const pulseScale = 1 + Math.sin(elapsedTime * 4) * 0.15;
      pinMeshes.forEach(p => {
        p.mesh.scale.set(pulseScale, pulseScale, pulseScale);
      });

      renderer.render(scene, camera);
    };

    animate();

    // 12. Responsive Resize
    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      domEl.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      domEl.removeEventListener('wheel', handleWheel);
      renderer.dispose();
    };
  }, [cities]);

  // Smoothly rotate to selected city when it changes from outside
  useEffect(() => {
    if (!selectedCity) return;
    const phi = (selectedCity.lat) * (Math.PI / 180);
    const theta = (-selectedCity.lng - 90) * (Math.PI / 180);
    targetRotationRef.current = {
      x: phi * 0.6,
      y: theta
    };
  }, [selectedCity]);

  const handleZoom = (direction: 'in' | 'out') => {
    if (!cameraRef.current) return;
    const delta = direction === 'in' ? -40 : 40;
    const currentZ = cameraRef.current.position.z;
    cameraRef.current.position.z = Math.max(180, Math.min(500, currentZ + delta));
  };

  const handleResetCamera = () => {
    if (!cameraRef.current) return;
    cameraRef.current.position.set(0, 0, 360);
    targetRotationRef.current = { x: 0.2, y: 0 };
  };

  return (
    <div className="relative w-full h-[520px] md:h-[620px] lg:h-[700px] overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-b from-[#060b18] via-[#03060f] to-[#040915] shadow-2xl shadow-emerald-950/20">
      {/* 3D WebGL Canvas Mount */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Telemetry HUD Header */}
      <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none z-10">
        <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full glass-panel border-emerald-500/30 text-xs font-mono text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>REAL-TIME PLANETARY AQI ORBITAL RADAR</span>
          <span className="hidden sm:inline text-slate-500">|</span>
          <span className="hidden sm:inline text-slate-400">{cities.length} TELEMETRY NODES ACTIVE</span>
        </div>

        {/* Selected City Mini Pill */}
        <div className="pointer-events-auto flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel-glow border-emerald-400/30">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: selectedCity.color }} />
          <span className="text-xs font-bold text-white tracking-wide">{selectedCity.name}</span>
          <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-black/40" style={{ color: selectedCity.color }}>
            AQI {selectedCity.aqi}
          </span>
        </div>
      </div>

      {/* Bottom Floating Interactive Control Bar */}
      <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 z-10 pointer-events-none">
        {/* AQI Color Scale Legend */}
        <div className="pointer-events-auto flex items-center gap-1.5 p-2 rounded-2xl glass-panel border-white/10 text-[11px] font-mono">
          <span className="text-slate-400 mr-1 hidden sm:inline">AQI:</span>
          <div className="flex items-center gap-1">
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">0-50</span>
            <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/30">51-100</span>
            <span className="px-2 py-0.5 rounded-md bg-orange-500/20 text-orange-400 border border-orange-500/30">101-150</span>
            <span className="px-2 py-0.5 rounded-md bg-red-500/20 text-red-400 border border-red-500/30">151-200</span>
            <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-400 border border-purple-500/30">201+</span>
          </div>
        </div>

        {/* Action Buttons: Auto-rotate, Zoom In/Out, Reset View */}
        <div className="pointer-events-auto flex items-center gap-2">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`p-2.5 rounded-xl border backdrop-blur-md transition-all ${
              autoRotate
                ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300 shadow-lg shadow-emerald-500/20'
                : 'glass-panel border-white/10 text-slate-400 hover:text-white'
            }`}
            title={autoRotate ? 'Pause Rotation' : 'Enable Auto-Rotation'}
          >
            <RotateCw className={`w-4 h-4 ${autoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '8s' }} />
          </button>

          <button
            onClick={() => handleZoom('in')}
            className="p-2.5 rounded-xl glass-panel border-white/10 text-slate-300 hover:text-white hover:border-emerald-500/30 transition-all"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <button
            onClick={() => handleZoom('out')}
            className="p-2.5 rounded-xl glass-panel border-white/10 text-slate-300 hover:text-white hover:border-emerald-500/30 transition-all"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          <button
            onClick={handleResetCamera}
            className="p-2.5 rounded-xl glass-panel border-white/10 text-slate-300 hover:text-white hover:border-emerald-500/30 transition-all"
            title="Reset Orientation"
          >
            <Compass className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Hover Tooltip when cursor hovers over a city pin */}
      {hoveredCity && (
        <div
          className="absolute z-30 pointer-events-none transform -translate-x-1/2 -translate-y-full mb-3"
          style={{ left: mousePos.x, top: mousePos.y - 12 }}
        >
          <div className="glass-panel-glow px-3.5 py-2 rounded-xl border border-emerald-400/40 shadow-2xl backdrop-blur-xl animate-fade-in">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: hoveredCity.color }} />
              <p className="text-xs font-bold text-white">{hoveredCity.name}, {hoveredCity.country}</p>
            </div>
            <div className="flex items-center justify-between gap-4 text-[11px] font-mono">
              <span className="text-slate-400">AQI: <strong className="text-white">{hoveredCity.aqi}</strong></span>
              <span className="px-1.5 py-0.5 rounded text-[10px]" style={{ color: hoveredCity.color, backgroundColor: `${hoveredCity.color}20` }}>
                {hoveredCity.category}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">PM2.5: {hoveredCity.pm25} µg/m³ • Click to inspect</p>
          </div>
        </div>
      )}

      {/* Atmospheric Hint overlay on bottom right */}
      <div className="absolute top-16 right-4 hidden md:flex flex-col items-end gap-1 pointer-events-none">
        <span className="text-[10px] font-mono text-cyan-400/80 bg-cyan-950/40 border border-cyan-500/20 px-2 py-1 rounded-md">
          DRAG TO ROTATE • SCROLL TO ZOOM
        </span>
      </div>
    </div>
  );
};

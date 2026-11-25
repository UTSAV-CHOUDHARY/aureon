import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Eye, EyeOff, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';
import { ProductColorVariant, ProductHotspot, ProductModelType } from '../../types';
import {
  buildAureonModel,
  buildLightTrails,
  ProceduralProductModel,
} from '../../three/headphoneModels';
import {
  createRadialShadowTexture,
  createStudioRenderer,
  disposeSceneResources,
  isSoftwareGl,
  scheduleSoftwareFrame,
} from '../../three/webglUtils';

interface Product3DViewerProps {
  modelType: ProductModelType;
  variant: ProductColorVariant;
  hotspots?: ProductHotspot[];
  activeHotspotId?: string | null;
  onSelectHotspot?: (hotspot: ProductHotspot) => void;
  compact?: boolean;
  fallbackImageUrl: string;
  productName: string;
}

const _projVec = new THREE.Vector3();

export function Product3DViewer({
  modelType,
  variant,
  hotspots = [],
  activeHotspotId = null,
  onSelectHotspot,
  compact = false,
  fallbackImageUrl,
  productName,
}: Product3DViewerProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const modelRef = useRef<ProceduralProductModel | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  const [explodeAmount, setExplodeAmount] = useState(0);
  const explodeTargetRef = useRef(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const autoRotateRef = useRef(true);
  const [controlsCollapsed, setControlsCollapsed] = useState(false);
  const [contextLost, setContextLost] = useState(false);

  const [hotspotScreenCoords, setHotspotScreenCoords] = useState<
    Record<string, { x: number; y: number; visible: boolean }>
  >({});

  const camTransitionRef = useRef<{
    active: boolean;
    pos: THREE.Vector3;
    target: THREE.Vector3;
  }>({
    active: false,
    pos: new THREE.Vector3(0.55, 0.35, 4.1),
    target: new THREE.Vector3(0, 0.1, 0),
  });

  useEffect(() => {
    explodeTargetRef.current = explodeAmount;
  }, [explodeAmount]);

  useEffect(() => {
    autoRotateRef.current = autoRotate;
    if (controlsRef.current && !isSoftwareGl) {
      controlsRef.current.autoRotate = autoRotate;
    }
  }, [autoRotate]);

  useEffect(() => {
    modelRef.current?.applyVariant(variant);
  }, [variant]);

  useEffect(() => {
    if (!activeHotspotId) return;
    const spot = hotspots.find((h) => h.id === activeHotspotId);
    if (!spot) return;
    camTransitionRef.current = {
      active: true,
      pos: new THREE.Vector3(...spot.cameraPosition),
      target: new THREE.Vector3(...spot.cameraTarget),
    };
  }, [activeHotspotId, hotspots]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const { renderer, scene, disposeEnvironment } = createStudioRenderer(container);

    const camera = new THREE.PerspectiveCamera(
      36,
      Math.max(container.clientWidth, 1) / Math.max(container.clientHeight, 1),
      0.1,
      50
    );
    camera.position.set(0.55, 0.35, 4.0);
    cameraRef.current = camera;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.enablePan = false;
    controls.minDistance = 2.1;
    controls.maxDistance = 6.2;
    controls.autoRotate = !isSoftwareGl && autoRotateRef.current;
    controls.autoRotateSpeed = 1.05;
    controls.target.set(0, 0.1, 0);
    controlsRef.current = controls;

    const onControlStart = () => {
      camTransitionRef.current.active = false;
    };
    controls.addEventListener('start', onControlStart);

    const model = buildAureonModel(modelType, variant);
    model.root.scale.setScalar(1.1);
    scene.add(model.root);
    modelRef.current = model;

    const trails = buildLightTrails();
    trails.group.scale.setScalar(0.84);
    scene.add(trails.group);

    const shadowTex = createRadialShadowTexture();
    const shadowPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(3.8, 3.8),
      new THREE.MeshBasicMaterial({
        map: shadowTex,
        transparent: true,
        depthWrite: false,
        opacity: 0.5,
      })
    );
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -1.45;
    scene.add(shadowPlane);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    const onResize = () => {
      if (!container) return;
      const w = Math.max(container.clientWidth, 1);
      const h = Math.max(container.clientHeight, 1);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    const onContextLost = (e: Event) => {
      e.preventDefault();
      setContextLost(true);
    };
    const onContextRestored = () => setContextLost(false);
    renderer.domElement.addEventListener('webglcontextlost', onContextLost);
    renderer.domElement.addEventListener('webglcontextrestored', onContextRestored);

    const clock = new THREE.Clock();
    let frameId = 0;
    let timerId = 0;
    let disposed = false;
    let currentExplode = explodeTargetRef.current;
    let lastHotspotSync = 0;

    const tick = () => {
      if (disposed) return;
      const delta = Math.min(clock.getDelta(), 0.05);
      const elapsed = clock.getElapsedTime();

      currentExplode = THREE.MathUtils.damp(currentExplode, explodeTargetRef.current, 6, delta);
      model.setExplode(currentExplode);
      model.root.position.y = Math.sin(elapsed * 1.1) * 0.045;
      model.updateDynamic?.(elapsed);

      if (camTransitionRef.current.active) {
        camera.position.x = THREE.MathUtils.damp(
          camera.position.x,
          camTransitionRef.current.pos.x,
          5,
          delta
        );
        camera.position.y = THREE.MathUtils.damp(
          camera.position.y,
          camTransitionRef.current.pos.y,
          5,
          delta
        );
        camera.position.z = THREE.MathUtils.damp(
          camera.position.z,
          camTransitionRef.current.pos.z,
          5,
          delta
        );
        controls.target.x = THREE.MathUtils.damp(
          controls.target.x,
          camTransitionRef.current.target.x,
          5,
          delta
        );
        controls.target.y = THREE.MathUtils.damp(
          controls.target.y,
          camTransitionRef.current.target.y,
          5,
          delta
        );
        controls.target.z = THREE.MathUtils.damp(
          controls.target.z,
          camTransitionRef.current.target.z,
          5,
          delta
        );

        if (camera.position.distanceTo(camTransitionRef.current.pos) < 0.03) {
          camTransitionRef.current.active = false;
        }
      }

      controls.update();
      trails.update(elapsed * 0.7);
      renderer.render(scene, camera);

      if (hotspots.length > 0 && elapsed - lastHotspotSync > 0.05) {
        lastHotspotSync = elapsed;
        const w = container.clientWidth;
        const h = container.clientHeight;
        const nextCoords: Record<string, { x: number; y: number; visible: boolean }> = {};
        for (const spot of hotspots) {
          _projVec.set(spot.position[0], spot.position[1], spot.position[2]);
          _projVec.applyMatrix4(model.root.matrixWorld);
          _projVec.project(camera);
          nextCoords[spot.id] = {
            x: ((_projVec.x + 1) / 2) * w,
            y: ((-_projVec.y + 1) / 2) * h,
            visible: _projVec.z < 1 && _projVec.z > -1,
          };
        }
        setHotspotScreenCoords(nextCoords);
      }

      if (isSoftwareGl) {
        scheduleSoftwareFrame(renderer, tick, (id) => {
          timerId = id;
        });
      } else {
        frameId = requestAnimationFrame(tick);
      }
    };

    if (isSoftwareGl) {
      renderer.render(scene, camera);
      scheduleSoftwareFrame(renderer, tick, (id) => {
        timerId = id;
      });
    } else {
      frameId = requestAnimationFrame(tick);
    }

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(timerId);
      controls.removeEventListener('start', onControlStart);
      controls.dispose();
      window.removeEventListener('resize', onResize);
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', onContextRestored);
      disposeSceneResources(scene);
      shadowTex.dispose();
      disposeEnvironment();
      renderer.dispose();
      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
      modelRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modelType]);

  const handleZoom = (direction: 'in' | 'out') => {
    const cam = cameraRef.current;
    const controls = controlsRef.current;
    if (!cam || !controls) return;
    camTransitionRef.current.active = false;
    const offset = cam.position.clone().sub(controls.target);
    const scale = direction === 'in' ? 0.82 : 1.22;
    const nextLength = THREE.MathUtils.clamp(offset.length() * scale, 2.1, 6.2);
    offset.setLength(nextLength);
    cam.position.copy(controls.target).add(offset);
    controls.update();
  };

  const handleResetView = () => {
    setExplodeAmount(0);
    camTransitionRef.current = {
      active: true,
      pos: new THREE.Vector3(0.55, 0.35, 4.0),
      target: new THREE.Vector3(0, 0.1, 0),
    };
  };

  return (
    <div
      className="relative h-full w-full overflow-hidden rounded-2xl border border-[#11291F]/15 bg-[radial-gradient(ellipse_at_70%_40%,#173F2E_0%,#0E281D_55%,#081912_100%)]"
      data-cursor="3d"
    >
      <div ref={mountRef} className="h-full w-full" />

      {contextLost && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#0B2017]">
          <img
            src={fallbackImageUrl}
            alt={productName}
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover"
          />
        </div>
      )}

      {!compact &&
        hotspots.map((spot) => {
          const coord = hotspotScreenCoords[spot.id];
          if (!coord || !coord.visible) return null;
          const isSelected = activeHotspotId === spot.id;
          return (
            <button
              key={spot.id}
              type="button"
              onClick={() => onSelectHotspot?.(spot)}
              style={{
                transform: `translate3d(${coord.x}px, ${coord.y}px, 0) translate(-50%, -50%)`,
              }}
              aria-label={`Inspect ${spot.title}`}
              className={`absolute top-0 left-0 z-10 flex h-8 w-8 items-center justify-center rounded-full border font-mono text-[11px] font-medium transition-colors duration-200 ${
                isSelected
                  ? 'border-[#F7F6F0] bg-[#C49B4B] text-[#0B2017] shadow-lg'
                  : 'border-[#DFBE74]/60 bg-[#0B2017]/90 text-[#F7F6F0] hover:border-[#DFBE74]'
              }`}
            >
              {spot.label}
            </button>
          );
        })}

      <div className="pointer-events-none absolute top-4 left-4 z-10 text-xs font-medium text-[#F7F6F0]/75">
        360° Atelier Studio · Drag to Rotate
      </div>

      {!compact && (
        <div className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2 w-[min(92%,560px)] flex flex-col items-center">
          <button
            type="button"
            onClick={() => setControlsCollapsed((v) => !v)}
            className="mb-2 flex items-center gap-1.5 rounded-md border border-[#DFBE74]/30 bg-[#0B2017]/95 px-3 py-1 text-[11px] font-medium text-[#F7F6F0] hover:border-[#DFBE74] transition-colors"
          >
            {controlsCollapsed ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
            <span>{controlsCollapsed ? 'Show Controls' : 'Hide Controls'}</span>
          </button>

          {!controlsCollapsed && (
            <div className="flex w-full flex-wrap items-center justify-between gap-3 rounded-xl border border-[#DFBE74]/25 bg-[#0B2017]/95 px-4 py-2.5 shadow-xl">
              <div className="flex items-center gap-3 flex-1 min-w-[160px]">
                <label
                  htmlFor="pdp-explode-slider"
                  className="text-[11px] font-medium text-[#F7F6F0] whitespace-nowrap"
                >
                  Explode
                </label>
                <input
                  id="pdp-explode-slider"
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={explodeAmount}
                  onChange={(e) => setExplodeAmount(parseFloat(e.target.value))}
                  className="h-1.5 w-full accent-[#C49B4B] cursor-pointer"
                />
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => handleZoom('in')}
                  aria-label="Zoom in"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/15 text-[#F7F6F0] hover:border-[#C49B4B] transition-colors"
                >
                  <ZoomIn className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleZoom('out')}
                  aria-label="Zoom out"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/15 text-[#F7F6F0] hover:border-[#C49B4B] transition-colors"
                >
                  <ZoomOut className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setAutoRotate((v) => !v)}
                  className={`rounded-lg border px-2.5 py-1.5 text-[11px] font-medium transition-colors whitespace-nowrap ${
                    autoRotate
                      ? 'border-[#C49B4B] bg-[#C49B4B]/20 text-[#DFBE74]'
                      : 'border-white/15 text-[#F7F6F0]/75 hover:text-white'
                  }`}
                >
                  Spin
                </button>
                <button
                  type="button"
                  onClick={handleResetView}
                  aria-label="Reset camera view"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/15 text-[#F7F6F0] hover:border-[#C49B4B] transition-colors"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

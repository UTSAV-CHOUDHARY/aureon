import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { PRODUCTS, TechnologyId } from '../../data/products';
import { buildAureonModel } from '../../three/headphoneModels';
import {
  createStudioRenderer,
  disposeSceneResources,
  isSoftwareGl,
  scheduleSoftwareFrame,
} from '../../three/webglUtils';

interface TechnologyCutawayCanvasProps {
  activeTech: TechnologyId;
}

export function TechnologyCutawayCanvas({ activeTech }: TechnologyCutawayCanvasProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const activeTechRef = useRef<TechnologyId>(activeTech);

  useEffect(() => {
    activeTechRef.current = activeTech;
  }, [activeTech]);

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
    camera.position.set(-2.35, 0.35, 3.15);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.enablePan = false;
    controls.minDistance = 2.0;
    controls.maxDistance = 5.5;
    controls.target.set(-0.45, -0.1, 0);

    const model = buildAureonModel('x1', PRODUCTS[0].variants[0]);
    model.setExplode(0.75);
    scene.add(model.root);

    // Animated 24K Gold & Emerald Acoustic Wave Rings
    const waveGroup = new THREE.Group();
    waveGroup.position.set(-0.85, -0.24, 0);
    const waveRings: THREE.Mesh[] = [];
    for (let i = 0; i < 4; i++) {
      const ringGeo = new THREE.TorusGeometry(0.28 + i * 0.14, 0.01, 10, 48);
      ringGeo.rotateY(Math.PI / 2);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xd6b265,
        transparent: true,
        opacity: 0.55,
        depthWrite: false,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      waveGroup.add(ring);
      waveRings.push(ring);
    }
    scene.add(waveGroup);

    const spatialHalo = new THREE.Mesh(
      new THREE.TorusGeometry(1.55, 0.016, 12, 72),
      new THREE.MeshBasicMaterial({
        color: 0xdfbe74,
        transparent: true,
        opacity: 0.5,
        depthWrite: false,
      })
    );
    spatialHalo.rotation.x = Math.PI / 2.4;
    scene.add(spatialHalo);

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

    const clock = new THREE.Clock();
    let frameId = 0;
    let timerId = 0;
    let disposed = false;

    const targetCamPos = new THREE.Vector3(-2.35, 0.35, 3.15);

    const tick = () => {
      if (disposed) return;
      const delta = Math.min(clock.getDelta(), 0.05);
      const elapsed = clock.getElapsedTime();
      const tech = activeTechRef.current;

      let explodeTarget = 0.72;
      if (tech === 'drivers') {
        explodeTarget = 0.92;
        targetCamPos.set(-2.2, 0.05, 2.75);
      } else if (tech === 'anc') {
        explodeTarget = 0.65;
        targetCamPos.set(-2.5, 0.25, 3.05);
      } else if (tech === 'spatial') {
        explodeTarget = 0.38;
        targetCamPos.set(0.3, 0.85, 4.15);
      } else if (tech === 'battery') {
        explodeTarget = 0.85;
        targetCamPos.set(-1.9, 0.55, 2.9);
      } else if (tech === 'bluetooth') {
        explodeTarget = 0.55;
        targetCamPos.set(2.2, 0.45, 3.1);
      }

      model.setExplode(explodeTarget);
      model.root.position.y = Math.sin(elapsed * 1.1) * 0.04;

      camera.position.x = THREE.MathUtils.damp(camera.position.x, targetCamPos.x, 2.2, delta);
      camera.position.y = THREE.MathUtils.damp(camera.position.y, targetCamPos.y, 2.2, delta);
      camera.position.z = THREE.MathUtils.damp(camera.position.z, targetCamPos.z, 2.2, delta);

      waveRings.forEach((ring, idx) => {
        const phase = (elapsed * 1.4 + idx * 0.45) % 2;
        const scale = 0.85 + phase * 0.45;
        ring.scale.setScalar(scale);
        ring.position.x =
          tech === 'anc'
            ? -0.25 - phase * 0.45
            : tech === 'bluetooth'
              ? 1.7 + phase * 0.4
              : -0.15 - phase * 0.35;
        const mat = ring.material as THREE.MeshBasicMaterial;
        mat.opacity = Math.max(0, 0.7 * (1 - phase / 2));
        mat.color.setHex(
          tech === 'battery' ? 0x62d4a5 : tech === 'bluetooth' ? 0xf7f6f0 : 0xd6b265
        );
      });

      spatialHalo.visible = tech === 'spatial';
      spatialHalo.rotation.z = elapsed * 0.35;

      controls.update();
      renderer.render(scene, camera);

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
      controls.dispose();
      window.removeEventListener('resize', onResize);
      disposeSceneResources(scene);
      disposeEnvironment();
      renderer.dispose();
      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      className="relative h-full w-full overflow-hidden rounded-2xl border border-[#11291F]/15 bg-[radial-gradient(ellipse_at_60%_40%,#173F2E_0%,#0E281D_55%,#081912_100%)]"
      data-cursor="3d"
    >
      <div ref={mountRef} className="h-full w-full" />
      <div className="pointer-events-none absolute bottom-4 left-5 text-xs text-[#F7F6F0]/75">
        Interactive Acoustic Cutaway · Drag to Inspect Architecture
      </div>
    </div>
  );
}

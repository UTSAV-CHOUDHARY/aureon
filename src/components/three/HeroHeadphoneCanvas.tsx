import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { PRODUCTS } from '../../data/products';
import { HeroObjectFocus } from '../../types';
import { buildAureonModel, buildLightTrails } from '../../three/headphoneModels';
import {
  createRadialShadowTexture,
  createStudioRenderer,
  disposeSceneResources,
  isSoftwareGl,
  scheduleSoftwareFrame,
} from '../../three/webglUtils';

interface HeroHeadphoneCanvasProps {
  scrollProgressRef: React.MutableRefObject<number>;
  focusedObject: HeroObjectFocus;
}

const _camTarget = new THREE.Vector3(0.45, 0.05, 0);

export function HeroHeadphoneCanvas({
  scrollProgressRef,
  focusedObject,
}: HeroHeadphoneCanvasProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const focusRef = useRef<HeroObjectFocus>(focusedObject);
  const [contextLost, setContextLost] = useState(false);

  useEffect(() => {
    focusRef.current = focusedObject;
  }, [focusedObject]);

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
    camera.position.set(0.15, 0.25, 5.2);

    // Drag-to-rotate without hijacking vertical scroll
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.minPolarAngle = Math.PI * 0.28;
    controls.maxPolarAngle = Math.PI * 0.72;
    controls.target.copy(_camTarget);

    // Ensemble Stage Group positioned slightly right on desktop for clean split composition
    const ensembleGroup = new THREE.Group();
    const updateEnsemblePosition = () => {
      const w = container.clientWidth;
      ensembleGroup.position.x = w >= 1024 ? 0.95 : 0;
    };
    updateEnsemblePosition();
    scene.add(ensembleGroup);

    // 1. Sovereign One Headphones
    const x1Product = PRODUCTS.find((p) => p.modelType === 'x1') || PRODUCTS[0];
    const headphones = buildAureonModel('x1', x1Product.variants[0]);
    headphones.root.scale.setScalar(1.02);
    ensembleGroup.add(headphones.root);

    // 2. Chronos Watch
    const watchProduct = PRODUCTS.find((p) => p.modelType === 'chronos-watch') || PRODUCTS[1];
    const watch = buildAureonModel('chronos-watch', watchProduct.variants[0]);
    watch.root.scale.setScalar(0.62);
    ensembleGroup.add(watch.root);

    // 3. Audio Sphere
    const sphereProduct = PRODUCTS.find((p) => p.modelType === 'audio-sphere') || PRODUCTS[2];
    const sphere = buildAureonModel('audio-sphere', sphereProduct.variants[0]);
    sphere.root.scale.setScalar(0.55);
    ensembleGroup.add(sphere.root);

    // 4. Sweeping 24K Gold & Jade Glass Orbital Motion Graphics
    const orbitals = buildLightTrails();
    orbitals.group.scale.setScalar(1.02);
    ensembleGroup.add(orbitals.group);

    // Soft studio contact grounding shadow
    const shadowTex = createRadialShadowTexture();
    const shadowPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(5.2, 5.2),
      new THREE.MeshBasicMaterial({
        map: shadowTex,
        transparent: true,
        depthWrite: false,
        opacity: 0.55,
      })
    );
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.set(0, -1.9, 0);
    ensembleGroup.add(shadowPlane);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let pointerX = 0;
    let pointerY = 0;

    const onPointerMove = (e: PointerEvent) => {
      pointerX = (e.clientX / window.innerWidth - 0.5) * 2;
      pointerY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    const onResize = () => {
      if (!container) return;
      const w = Math.max(container.clientWidth, 1);
      const h = Math.max(container.clientHeight, 1);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      updateEnsemblePosition();
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

    let currentExplode = 0.25;
    let hpPos = new THREE.Vector3(-0.35, 0.2, 0.15);
    let watchPos = new THREE.Vector3(1.15, -0.52, 0.78);
    let spherePos = new THREE.Vector3(1.12, 0.92, -0.35);

    const tick = () => {
      if (disposed) return;
      const delta = Math.min(clock.getDelta(), 0.05);
      const elapsed = clock.getElapsedTime();
      const scroll = THREE.MathUtils.clamp(scrollProgressRef.current, 0, 1);
      const focus = focusRef.current;

      // Scroll-driven separation & assembly on headphones
      const targetExplode =
        scroll < 0.35
          ? THREE.MathUtils.lerp(0.24, 0.85, scroll / 0.35)
          : THREE.MathUtils.lerp(0.85, 0.0, (scroll - 0.35) / 0.65);

      currentExplode = THREE.MathUtils.damp(currentExplode, targetExplode, 5.5, delta);
      headphones.setExplode(currentExplode);
      watch.setExplode(scroll > 0.25 && scroll < 0.6 ? 0.35 : 0);
      sphere.setExplode(scroll > 0.25 && scroll < 0.6 ? 0.4 : 0);

      // Focus choreography: smoothly bring selected object to center-front while others orbit
      let hpTarget = new THREE.Vector3(-0.32, 0.18, 0.18);
      let watchTarget = new THREE.Vector3(1.12, -0.52, 0.72);
      let sphereTarget = new THREE.Vector3(1.08, 0.92, -0.35);
      let hpScale = 1.02;
      let watchScale = 0.64;
      let sphereScale = 0.56;

      if (focus === 'x1') {
        hpTarget.set(0.05, 0.12, 0.55);
        watchTarget.set(1.38, -0.68, -0.25);
        sphereTarget.set(-1.25, 0.88, -0.55);
        hpScale = 1.12;
        watchScale = 0.48;
        sphereScale = 0.44;
      } else if (focus === 'chronos-watch') {
        hpTarget.set(-1.15, 0.35, -0.65);
        watchTarget.set(0.15, 0.02, 1.05);
        sphereTarget.set(1.28, 0.85, -0.45);
        hpScale = 0.72;
        watchScale = 0.95;
        sphereScale = 0.46;
      } else if (focus === 'audio-sphere') {
        hpTarget.set(-1.15, 0.25, -0.65);
        watchTarget.set(1.22, -0.65, -0.35);
        sphereTarget.set(0.12, 0.1, 1.05);
        hpScale = 0.72;
        watchScale = 0.5;
        sphereScale = 0.92;
      }

      // Apply harmonic floating motion
      const floatWave = reducedMotion ? 0 : Math.sin(elapsed * 1.05) * 0.08;
      const floatWave2 = reducedMotion ? 0 : Math.cos(elapsed * 1.25) * 0.09;
      const floatWave3 = reducedMotion ? 0 : Math.sin(elapsed * 1.45 + 1.2) * 0.09;

      hpPos.x = THREE.MathUtils.damp(hpPos.x, hpTarget.x, 4.5, delta);
      hpPos.y = THREE.MathUtils.damp(hpPos.y, hpTarget.y + floatWave, 4.5, delta);
      hpPos.z = THREE.MathUtils.damp(hpPos.z, hpTarget.z, 4.5, delta);
      headphones.root.position.copy(hpPos);
      headphones.root.scale.setScalar(
        THREE.MathUtils.damp(headphones.root.scale.x, hpScale, 4.5, delta)
      );

      watchPos.x = THREE.MathUtils.damp(watchPos.x, watchTarget.x, 4.5, delta);
      watchPos.y = THREE.MathUtils.damp(watchPos.y, watchTarget.y + floatWave2, 4.5, delta);
      watchPos.z = THREE.MathUtils.damp(watchPos.z, watchTarget.z, 4.5, delta);
      watch.root.position.copy(watchPos);
      watch.root.scale.setScalar(
        THREE.MathUtils.damp(watch.root.scale.x, watchScale, 4.5, delta)
      );

      spherePos.x = THREE.MathUtils.damp(spherePos.x, sphereTarget.x, 4.5, delta);
      spherePos.y = THREE.MathUtils.damp(spherePos.y, sphereTarget.y + floatWave3, 4.5, delta);
      spherePos.z = THREE.MathUtils.damp(spherePos.z, sphereTarget.z, 4.5, delta);
      sphere.root.position.copy(spherePos);
      sphere.root.scale.setScalar(
        THREE.MathUtils.damp(sphere.root.scale.x, sphereScale, 4.5, delta)
      );

      // Continuous gentle 3D motion & scroll rotation
      const idleSpin = reducedMotion ? 0 : elapsed * 0.16;
      headphones.root.rotation.y = THREE.MathUtils.damp(
        headphones.root.rotation.y,
        -0.38 + scroll * Math.PI * 1.2 + idleSpin + pointerX * 0.18,
        4.5,
        delta
      );
      headphones.root.rotation.x = THREE.MathUtils.damp(
        headphones.root.rotation.x,
        0.08 + pointerY * 0.08,
        4.5,
        delta
      );

      watch.root.rotation.y = -0.4 + Math.sin(elapsed * 0.55) * 0.28 + scroll * 1.5;
      watch.root.rotation.x = 0.15 + Math.cos(elapsed * 0.45) * 0.08;
      watch.updateDynamic?.(elapsed);

      sphere.root.rotation.y = elapsed * 0.35 + scroll * 2.0;
      sphere.updateDynamic?.(elapsed);

      if (!reducedMotion) {
        orbitals.update(elapsed);
        ensembleGroup.rotation.y = THREE.MathUtils.damp(
          ensembleGroup.rotation.y,
          pointerX * 0.08 + scroll * 0.45,
          3.5,
          delta
        );
      }

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
      window.removeEventListener('pointermove', onPointerMove);
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
    };
  }, [scrollProgressRef]);

  return (
    <div className="relative h-full w-full" data-cursor="3d">
      <div ref={mountRef} className="h-full w-full" />
      {contextLost && (
        <div className="absolute inset-0 flex items-center justify-center bg-transparent">
          <img
            src="/assets/aistudio/image_8041c197.png"
            alt="AUREON Sovereign Series 3D Showcase"
            referrerPolicy="no-referrer"
            className="max-h-[80%] w-auto rounded-2xl object-contain"
          />
        </div>
      )}
    </div>
  );
}

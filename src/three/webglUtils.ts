import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';

export const isSoftwareGl: boolean = (() => {
  if (typeof document === 'undefined') return false;
  try {
    const probeCanvas = document.createElement('canvas');
    const gl = probeCanvas.getContext('webgl2') || probeCanvas.getContext('webgl');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param) || '');
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return true;
  }
})();

export function createStudioRenderer(container: HTMLElement): {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  disposeEnvironment: () => void;
} {
  const width = Math.max(container.clientWidth, 1);
  const height = Math.max(container.clientHeight, 1);

  const renderer = new THREE.WebGLRenderer({
    antialias: !isSoftwareGl,
    alpha: true,
    powerPreference: 'high-performance',
  });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.18;
  renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(width, height);
  renderer.shadowMap.enabled = !isSoftwareGl;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.domElement.style.display = 'block';
  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';

  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();

  // Studio IBL environment via RoomEnvironment
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  const envTarget = pmremGenerator.fromScene(new RoomEnvironment(), 0.04);
  scene.environment = envTarget.texture;
  pmremGenerator.dispose();

  // Sovereign Warm Ivory / Deep Emerald Studio Lighting Rig
  const hemiLight = new THREE.HemisphereLight(0xfcf8ee, 0x0b261b, 0.95);
  scene.add(hemiLight);

  const keyLight = new THREE.DirectionalLight(0xfff5e4, 2.35);
  keyLight.position.set(4.5, 6.2, 5.2);
  if (!isSoftwareGl) {
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 20;
    const d = 4.5;
    keyLight.shadow.camera.left = -d;
    keyLight.shadow.camera.right = d;
    keyLight.shadow.camera.top = d;
    keyLight.shadow.camera.bottom = -d;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
  }
  scene.add(keyLight);

  // 24K Gold rim highlight
  const goldRimLight = new THREE.DirectionalLight(0xdfbe74, 2.2);
  goldRimLight.position.set(-4.2, 2.8, -4.0);
  scene.add(goldRimLight);

  // Deep Jade ambient bounce
  const fillLight = new THREE.DirectionalLight(0x2d6a4f, 1.0);
  fillLight.position.set(-3.5, -2.5, 3.5);
  scene.add(fillLight);

  if (!isSoftwareGl) {
    RectAreaLightUniformsLib.init();
    const softboxTop = new THREE.RectAreaLight(0xfff9ee, 2.4, 5.5, 2.2);
    softboxTop.position.set(0, 5.4, 2.0);
    softboxTop.lookAt(0, 0, 0);
    scene.add(softboxTop);

    const softboxGold = new THREE.RectAreaLight(0xd6b265, 2.0, 4.0, 2.0);
    softboxGold.position.set(4.5, 0.8, -2.2);
    softboxGold.lookAt(0, 0, 0);
    scene.add(softboxGold);
  }

  return {
    renderer,
    scene,
    disposeEnvironment: () => {
      envTarget.dispose();
    },
  };
}

export function createRadialShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createRadialGradient(128, 128, 14, 128, 128, 124);
    grad.addColorStop(0, 'rgba(9, 28, 20, 0.36)');
    grad.addColorStop(0.55, 'rgba(17, 41, 31, 0.16)');
    grad.addColorStop(1, 'rgba(17, 41, 31, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function scheduleSoftwareFrame(
  renderer: THREE.WebGLRenderer,
  cb: () => void,
  registerTimer: (id: number) => void
) {
  const gl = renderer.getContext() as WebGL2RenderingContext;
  if (gl && typeof gl.fenceSync === 'function') {
    const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
    gl.flush();
    const poll = () => {
      const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
      if (state === gl.UNSIGNALED) {
        registerTimer(window.setTimeout(poll, 5));
      } else {
        if (sync) gl.deleteSync(sync);
        registerTimer(window.setTimeout(cb, 80));
      }
    };
    registerTimer(window.setTimeout(poll, 5));
  } else {
    registerTimer(window.setTimeout(cb, 80));
  }
}

export function disposeSceneResources(root: THREE.Object3D) {
  root.traverse((obj) => {
    if ((obj as THREE.Mesh).isMesh || (obj as THREE.Points).isPoints) {
      const mesh = obj as THREE.Mesh;
      mesh.geometry?.dispose();
      const mat = mesh.material;
      if (Array.isArray(mat)) {
        mat.forEach((m) => {
          const std = m as THREE.MeshStandardMaterial;
          std.map?.dispose();
          m.dispose();
        });
      } else if (mat) {
        const std = mat as THREE.MeshStandardMaterial;
        std.map?.dispose();
        mat.dispose();
      }
    }
  });
}

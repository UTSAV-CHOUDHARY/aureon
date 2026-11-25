import * as THREE from 'three';
import { ProductColorVariant, ProductModelType } from '../types';

export interface ProceduralProductModel {
  root: THREE.Group;
  applyVariant: (variant: ProductColorVariant) => void;
  setExplode: (amount: number) => void;
  updateDynamic?: (elapsed: number) => void;
  parts: {
    headband: THREE.Group;
    leftCushion: THREE.Group;
    rightCushion: THREE.Group;
    leftShell: THREE.Group;
    rightShell: THREE.Group;
    leftDriver: THREE.Group;
    rightDriver: THREE.Group;
    accentRings: THREE.Mesh[];
    bodyMaterials: THREE.MeshPhysicalMaterial[];
    accentMaterials: THREE.MeshStandardMaterial[];
  };
}

function createEmeraldMarbleTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createLinearGradient(0, 0, 512, 128);
    grad.addColorStop(0, '#0E291E');
    grad.addColorStop(0.5, '#174030');
    grad.addColorStop(1, '#0B2218');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 128);

    // Subtle 24K gold mineral veins
    ctx.strokeStyle = 'rgba(214, 178, 101, 0.55)';
    ctx.lineWidth = 1.6;
    for (let v = 0; v < 7; v++) {
      ctx.beginPath();
      let y = 18 + v * 16;
      ctx.moveTo(0, y);
      for (let x = 24; x <= 512; x += 24) {
        y += Math.sin(x * 0.03 + v * 1.4) * 7;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

function createWatchDialTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createRadialGradient(256, 256, 12, 256, 256, 256);
    grad.addColorStop(0, '#1D523C');
    grad.addColorStop(0.75, '#103224');
    grad.addColorStop(1, '#091E15');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);

    // Minute track ticks
    ctx.save();
    ctx.translate(256, 256);
    for (let i = 0; i < 60; i++) {
      ctx.rotate((Math.PI * 2) / 60);
      ctx.fillStyle = i % 5 === 0 ? '#DFBE74' : 'rgba(223, 190, 116, 0.45)';
      ctx.fillRect(-1.5, -238, i % 5 === 0 ? 3 : 1.5, i % 5 === 0 ? 18 : 8);
    }

    // Three chronograph sub-dials
    const subs: [number, number][] = [
      [-86, 0],
      [86, 0],
      [0, 88],
    ];
    subs.forEach(([sx, sy]) => {
      ctx.beginPath();
      ctx.arc(sx, sy, 52, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(214, 178, 101, 0.65)';
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // Brand wordmark on dial
    ctx.fillStyle = '#F7F6F0';
    ctx.font = '600 22px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('AUREON', 0, -96);
    ctx.fillStyle = '#C49B4B';
    ctx.font = '500 11px sans-serif';
    ctx.fillText('GENÈVE · KINETIC', 0, -76);
    ctx.restore();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createEarCushionGeometry(radiusOuter = 0.62, radiusInner = 0.34, depth = 0.28): THREE.LatheGeometry {
  const points: THREE.Vector2[] = [];
  const mid = (radiusOuter + radiusInner) / 2;
  const halfWidth = (radiusOuter - radiusInner) / 2;
  const steps = 20;
  for (let i = 0; i <= steps; i++) {
    const angle = (i / steps) * Math.PI * 2;
    const r = mid + Math.cos(angle) * halfWidth;
    const y = Math.sin(angle) * (depth * 0.52);
    points.push(new THREE.Vector2(Math.max(0.05, r), y));
  }
  const geo = new THREE.LatheGeometry(points, 48);
  geo.rotateZ(Math.PI / 2);
  geo.computeVertexNormals();
  return geo;
}

function createDomeShellGeometry(radius = 0.58, depth = 0.24): THREE.LatheGeometry {
  const points: THREE.Vector2[] = [
    new THREE.Vector2(0.0, depth),
    new THREE.Vector2(radius * 0.45, depth * 0.96),
    new THREE.Vector2(radius * 0.78, depth * 0.78),
    new THREE.Vector2(radius * 0.96, depth * 0.42),
    new THREE.Vector2(radius, 0.05),
    new THREE.Vector2(radius * 0.97, 0.0),
    new THREE.Vector2(radius * 0.88, 0.0),
  ];
  const geo = new THREE.LatheGeometry(points, 48);
  geo.rotateZ(-Math.PI / 2);
  geo.computeVertexNormals();
  return geo;
}

function createDriverDiaphragmGeometry(radius = 0.38): THREE.LatheGeometry {
  const points: THREE.Vector2[] = [
    new THREE.Vector2(0.0, 0.06),
    new THREE.Vector2(radius * 0.32, 0.055),
    new THREE.Vector2(radius * 0.65, 0.015),
    new THREE.Vector2(radius * 0.85, 0.03),
    new THREE.Vector2(radius, 0.0),
  ];
  const geo = new THREE.LatheGeometry(points, 40);
  geo.rotateZ(Math.PI / 2);
  geo.computeVertexNormals();
  return geo;
}

export function buildAureonModel(
  modelType: ProductModelType,
  initialVariant: ProductColorVariant
): ProceduralProductModel {
  if (modelType === 'air-mini') {
    return buildAirMiniModel(initialVariant);
  }
  if (modelType === 'chronos-watch') {
    return buildChronosWatchModel(initialVariant);
  }
  if (modelType === 'audio-sphere') {
    return buildAudioSphereModel(initialVariant);
  }
  return buildOverEarModel(modelType, initialVariant);
}

function buildOverEarModel(
  modelType: 'x1' | 'pro-studio',
  initialVariant: ProductColorVariant
): ProceduralProductModel {
  const root = new THREE.Group();
  const isStudio = modelType === 'pro-studio';

  const bodyMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(initialVariant.hex),
    metalness: initialVariant.metalness,
    roughness: initialVariant.roughness,
    clearcoat: isStudio ? 0.25 : 0.45,
    clearcoatRoughness: 0.24,
    anisotropy: 0.55,
  });

  const brushedSilverMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#E3E4DE'),
    metalness: 0.95,
    roughness: 0.16,
    anisotropy: 0.85,
  });

  const goldMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(initialVariant.accentHex),
    emissive: new THREE.Color(initialVariant.accentHex),
    emissiveIntensity: 0.18,
    metalness: 0.94,
    roughness: 0.18,
  });

  // Sovereign Emerald Lambskin Cushion (high roughness delta vs titanium/gold)
  const leatherMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(initialVariant.hex).multiplyScalar(0.88),
    metalness: 0.04,
    roughness: 0.66,
  });

  const berylliumMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#D9C38C'),
    metalness: 0.96,
    roughness: 0.14,
    iridescence: 0.25,
    iridescenceIOR: 1.35,
  });

  const copperCoilMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#C87D4B'),
    metalness: 0.9,
    roughness: 0.24,
  });

  const darkAcousticMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#0E1E17'),
    metalness: 0.25,
    roughness: 0.82,
  });

  const headband = new THREE.Group();
  const leftCushion = new THREE.Group();
  const rightCushion = new THREE.Group();
  const leftShell = new THREE.Group();
  const rightShell = new THREE.Group();
  const leftDriver = new THREE.Group();
  const rightDriver = new THREE.Group();
  const accentRings: THREE.Mesh[] = [];

  // 1. Sculpted Emerald Leather + Titanium Headband Arch
  const archCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.98, 0.55, 0),
    new THREE.Vector3(-0.88, 1.22, 0),
    new THREE.Vector3(0, 1.56, 0),
    new THREE.Vector3(0.88, 1.22, 0),
    new THREE.Vector3(0.98, 0.55, 0),
  ]);

  if (isStudio) {
    const archGeo1 = new THREE.TubeGeometry(archCurve, 48, 0.032, 14, false);
    const arch1 = new THREE.Mesh(archGeo1, brushedSilverMat);
    arch1.position.z = 0.06;
    const arch2 = new THREE.Mesh(archGeo1, brushedSilverMat);
    arch2.position.z = -0.06;
    headband.add(arch1, arch2);

    const strapCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.88, 0.65, 0),
      new THREE.Vector3(-0.74, 1.12, 0),
      new THREE.Vector3(0, 1.38, 0),
      new THREE.Vector3(0.74, 1.12, 0),
      new THREE.Vector3(0.88, 0.65, 0),
    ]);
    const strapGeo = new THREE.TubeGeometry(strapCurve, 40, 0.055, 16, false);
    strapGeo.scale(1, 0.55, 2.2);
    const strapMesh = new THREE.Mesh(strapGeo, leatherMat);
    headband.add(strapMesh);
  } else {
    const outerBandGeo = new THREE.TubeGeometry(archCurve, 48, 0.095, 20, false);
    outerBandGeo.scale(1, 0.65, 1.85);
    const outerBand = new THREE.Mesh(outerBandGeo, leatherMat);
    outerBand.castShadow = true;
    headband.add(outerBand);

    const innerPadCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.62, 1.22, 0),
      new THREE.Vector3(0, 1.44, 0),
      new THREE.Vector3(0.62, 1.22, 0),
    ]);
    const innerPadGeo = new THREE.TubeGeometry(innerPadCurve, 32, 0.068, 16, false);
    innerPadGeo.scale(1, 0.62, 1.72);
    const innerPad = new THREE.Mesh(innerPadGeo, leatherMat);
    headband.add(innerPad);
  }

  // Brushed Silver & 24K Gold Slider Collars & Yokes
  [-1, 1].forEach((side) => {
    const collarGeo = new THREE.CylinderGeometry(0.085, 0.075, 0.2, 24);
    collarGeo.scale(1, 1, 1.35);
    const collar = new THREE.Mesh(collarGeo, goldMat);
    collar.position.set(side * 0.98, 0.48, 0);
    collar.rotation.z = side * 0.14;
    headband.add(collar);

    const yokeCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(side * 0.99, 0.36, 0),
      new THREE.Vector3(side * 1.04, 0.16, 0.34),
      new THREE.Vector3(side * 1.0, -0.22, 0.48),
    ]);
    const yoke1 = new THREE.Mesh(
      new THREE.TubeGeometry(yokeCurve, 20, 0.03, 12, false),
      brushedSilverMat
    );

    const yokeCurveBack = new THREE.CatmullRomCurve3([
      new THREE.Vector3(side * 0.99, 0.36, 0),
      new THREE.Vector3(side * 1.04, 0.16, -0.34),
      new THREE.Vector3(side * 1.0, -0.22, -0.48),
    ]);
    const yoke2 = new THREE.Mesh(
      new THREE.TubeGeometry(yokeCurveBack, 20, 0.03, 12, false),
      brushedSilverMat
    );

    const pinFront = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.05, 16), goldMat);
    pinFront.rotation.x = Math.PI / 2;
    pinFront.position.set(side * 1.0, -0.22, 0.5);

    const pinBack = pinFront.clone();
    pinBack.position.z = -0.5;

    headband.add(yoke1, yoke2, pinFront, pinBack);
  });

  // 2. Ear Cushions, Drivers & Outer Acoustic Shells
  const cushionGeo = createEarCushionGeometry(0.61, 0.33, 0.27);
  const shellGeo = createDomeShellGeometry(0.58, isStudio ? 0.19 : 0.25);
  const driverGeo = createDriverDiaphragmGeometry(0.36);

  const buildCupAssembly = (
    side: -1 | 1,
    cushionGroup: THREE.Group,
    shellGroup: THREE.Group,
    driverGroup: THREE.Group
  ) => {
    const baseX = side * 0.78;
    const baseY = -0.24;

    cushionGroup.position.set(baseX - side * 0.14, baseY, 0);
    cushionGroup.rotation.z = side * 0.06;
    const cushionMesh = new THREE.Mesh(cushionGeo, leatherMat);
    cushionMesh.castShadow = true;
    cushionMesh.receiveShadow = true;

    const innerMeshBaffle = new THREE.Mesh(new THREE.CircleGeometry(0.34, 32), darkAcousticMat);
    innerMeshBaffle.rotation.y = side === -1 ? Math.PI / 2 : -Math.PI / 2;
    innerMeshBaffle.position.x = -side * 0.03;
    cushionGroup.add(cushionMesh, innerMeshBaffle);

    // Driver Core
    driverGroup.position.set(baseX + side * 0.02, baseY, 0);
    driverGroup.rotation.z = side * 0.06;
    if (side === 1) driverGroup.rotation.y = Math.PI;

    const bafflePlate = new THREE.Mesh(
      new THREE.CylinderGeometry(0.53, 0.53, 0.04, 40),
      darkAcousticMat
    );
    bafflePlate.rotation.z = Math.PI / 2;

    const diaphragm = new THREE.Mesh(driverGeo, berylliumMat);
    diaphragm.position.x = -0.02;

    const magnetRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.22, 0.045, 16, 36),
      goldMat
    );
    magnetRing.rotation.y = Math.PI / 2;
    magnetRing.position.x = 0.04;

    const voiceCoil = new THREE.Mesh(
      new THREE.CylinderGeometry(0.14, 0.14, 0.09, 28, 1, true),
      copperCoilMat
    );
    voiceCoil.rotation.z = Math.PI / 2;
    voiceCoil.position.x = 0.02;

    driverGroup.add(bafflePlate, diaphragm, magnetRing, voiceCoil);

    // Outer Acoustic Shell with 24K Gold Perforated Acoustic Grille
    shellGroup.position.set(baseX + side * 0.09, baseY, 0);
    shellGroup.rotation.z = side * 0.06;
    if (side === -1) shellGroup.rotation.y = Math.PI;

    const shellMesh = new THREE.Mesh(shellGeo, bodyMat);
    shellMesh.castShadow = true;

    const silverRim = new THREE.Mesh(
      new THREE.TorusGeometry(0.57, 0.026, 16, 48),
      brushedSilverMat
    );
    silverRim.rotation.y = Math.PI / 2;
    silverRim.position.x = 0.01;

    const goldHalo = new THREE.Mesh(
      new THREE.TorusGeometry(0.45, 0.018, 14, 48),
      goldMat
    );
    goldHalo.rotation.y = Math.PI / 2;
    goldHalo.position.x = 0.17;
    accentRings.push(goldHalo);

    // Sculpted 24K Gold acoustic mesh center grille (matching reference image!)
    const goldGrillePlate = new THREE.Mesh(
      new THREE.CylinderGeometry(0.36, 0.38, 0.03, 40),
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(initialVariant.accentHex),
        metalness: 0.92,
        roughness: 0.22,
        wireframe: true,
      })
    );
    goldGrillePlate.rotation.z = Math.PI / 2;
    goldGrillePlate.position.x = 0.21;

    const goldCenterMedallion = new THREE.Mesh(
      new THREE.CylinderGeometry(0.13, 0.13, 0.038, 32),
      goldMat
    );
    goldCenterMedallion.rotation.z = Math.PI / 2;
    goldCenterMedallion.position.x = 0.22;

    shellGroup.add(shellMesh, silverRim, goldHalo, goldGrillePlate, goldCenterMedallion);
  };

  buildCupAssembly(-1, leftCushion, leftShell, leftDriver);
  buildCupAssembly(1, rightCushion, rightShell, rightDriver);

  root.add(
    headband,
    leftCushion,
    rightCushion,
    leftDriver,
    rightDriver,
    leftShell,
    rightShell
  );

  const rest = {
    headbandY: 0,
    leftCushionX: leftCushion.position.x,
    rightCushionX: rightCushion.position.x,
    leftDriverX: leftDriver.position.x,
    rightDriverX: rightDriver.position.x,
    leftShellX: leftShell.position.x,
    rightShellX: rightShell.position.x,
  };

  const applyVariant = (variant: ProductColorVariant) => {
    bodyMat.color.set(variant.hex);
    bodyMat.metalness = variant.metalness;
    bodyMat.roughness = variant.roughness;
    leatherMat.color.set(variant.hex).multiplyScalar(0.88);
    goldMat.color.set(variant.accentHex);
    goldMat.emissive.set(variant.accentHex);
  };

  const setExplode = (amount: number) => {
    const t = THREE.MathUtils.clamp(amount, 0, 1);
    headband.position.y = rest.headbandY + t * 0.62;
    leftCushion.position.x = rest.leftCushionX - t * 0.58;
    rightCushion.position.x = rest.rightCushionX + t * 0.58;
    leftDriver.position.x = rest.leftDriverX - t * 0.18;
    rightDriver.position.x = rest.rightDriverX + t * 0.18;
    leftShell.position.x = rest.leftShellX - t * 0.85;
    rightShell.position.x = rest.rightShellX + t * 0.85;
  };

  return {
    root,
    applyVariant,
    setExplode,
    parts: {
      headband,
      leftCushion,
      rightCushion,
      leftShell,
      rightShell,
      leftDriver,
      rightDriver,
      accentRings,
      bodyMaterials: [bodyMat],
      accentMaterials: [goldMat],
    },
  };
}

function buildAirMiniModel(initialVariant: ProductColorVariant): ProceduralProductModel {
  const root = new THREE.Group();

  const bodyMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(initialVariant.hex),
    metalness: initialVariant.metalness,
    roughness: initialVariant.roughness,
    clearcoat: 0.45,
    clearcoatRoughness: 0.2,
  });

  const silverMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#E3E4DE'),
    metalness: 0.94,
    roughness: 0.16,
  });

  const goldMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(initialVariant.accentHex),
    emissive: new THREE.Color(initialVariant.accentHex),
    emissiveIntensity: 0.2,
    metalness: 0.94,
    roughness: 0.18,
  });

  const siliconeMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#13281F'),
    metalness: 0.02,
    roughness: 0.72,
  });

  const caseBaseGroup = new THREE.Group();
  const caseShell = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.55, 1.0), bodyMat);
  caseShell.position.y = -0.35;
  caseShell.castShadow = true;

  const hingeBar = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.95, 20), silverMat);
  hingeBar.rotation.z = Math.PI / 2;
  hingeBar.position.set(0, -0.06, -0.48);

  const ledStrip = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.028, 0.03), goldMat);
  ledStrip.position.set(0, -0.18, 0.505);

  caseBaseGroup.add(caseShell, hingeBar, ledStrip);

  const lidGroup = new THREE.Group();
  lidGroup.position.set(0, -0.06, -0.48);
  const lidMesh = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.22, 1.0), bodyMat);
  lidMesh.position.set(0, 0.11, 0.48);
  lidGroup.add(lidMesh);
  lidGroup.rotation.x = -0.68;

  const leftBud = new THREE.Group();
  const rightBud = new THREE.Group();

  const buildEarbud = (group: THREE.Group, side: -1 | 1) => {
    const housing = new THREE.Mesh(new THREE.SphereGeometry(0.24, 32, 24), bodyMat);
    housing.scale.set(1.05, 0.88, 1.2);

    const faceplate = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.21, 0.04, 32),
      silverMat
    );
    faceplate.rotation.z = side * (Math.PI / 2);
    faceplate.position.set(side * 0.2, 0.02, 0);

    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.014, 12, 32), goldMat);
    ring.rotation.y = Math.PI / 2;
    ring.position.set(side * 0.225, 0.02, 0);

    const nozzle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.065, 0.09, 0.18, 24),
      silverMat
    );
    nozzle.rotation.z = side * (Math.PI / 2.6);
    nozzle.position.set(-side * 0.18, -0.08, 0.08);

    const earTip = new THREE.Mesh(new THREE.SphereGeometry(0.115, 24, 20), siliconeMat);
    earTip.scale.set(0.85, 0.85, 1.15);
    earTip.position.set(-side * 0.28, -0.13, 0.12);

    group.add(housing, faceplate, ring, nozzle, earTip);
    group.position.set(side * 0.56, 0.36, 0.05);
  };

  buildEarbud(leftBud, -1);
  buildEarbud(rightBud, 1);

  root.add(caseBaseGroup, lidGroup, leftBud, rightBud);

  const emptyGroup = new THREE.Group();

  const applyVariant = (variant: ProductColorVariant) => {
    bodyMat.color.set(variant.hex);
    bodyMat.metalness = variant.metalness;
    bodyMat.roughness = variant.roughness;
    goldMat.color.set(variant.accentHex);
    goldMat.emissive.set(variant.accentHex);
  };

  const setExplode = (amount: number) => {
    const t = THREE.MathUtils.clamp(amount, 0, 1);
    leftBud.position.set(-0.56 - t * 0.25, 0.36 + t * 0.45, 0.05);
    rightBud.position.set(0.56 + t * 0.25, 0.36 + t * 0.45, 0.05);
    lidGroup.rotation.x = -0.68 - t * 0.55;
    caseBaseGroup.position.y = -t * 0.25;
  };

  return {
    root,
    applyVariant,
    setExplode,
    parts: {
      headband: lidGroup,
      leftCushion: leftBud,
      rightCushion: rightBud,
      leftShell: caseBaseGroup,
      rightShell: emptyGroup,
      leftDriver: emptyGroup,
      rightDriver: emptyGroup,
      accentRings: [ledStrip],
      bodyMaterials: [bodyMat],
      accentMaterials: [goldMat],
    },
  };
}

function buildChronosWatchModel(initialVariant: ProductColorVariant): ProceduralProductModel {
  const root = new THREE.Group();

  const dialTex = createWatchDialTexture();
  const bodyMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(initialVariant.hex),
    metalness: initialVariant.metalness,
    roughness: initialVariant.roughness,
  });

  const titaniumMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#D5D7D0'),
    metalness: 0.95,
    roughness: 0.16,
    anisotropy: 0.8,
  });

  const goldMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(initialVariant.accentHex),
    emissive: new THREE.Color(initialVariant.accentHex),
    emissiveIntensity: 0.14,
    metalness: 0.95,
    roughness: 0.16,
  });

  const strapMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(initialVariant.hex).multiplyScalar(0.85),
    metalness: 0.05,
    roughness: 0.72,
  });

  const crystalMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0.05,
    roughness: 0.04,
    transparent: true,
    opacity: 0.28,
    clearcoat: 1.0,
    depthWrite: false,
  });

  const caseGroup = new THREE.Group();
  const bezelGroup = new THREE.Group();
  const strapGroup = new THREE.Group();

  // Case body
  const caseCyl = new THREE.Mesh(new THREE.CylinderGeometry(0.76, 0.74, 0.24, 48), titaniumMat);
  caseCyl.rotation.x = Math.PI / 2;

  // Bezel ring in emerald + gold rim
  const bezelBase = new THREE.Mesh(new THREE.TorusGeometry(0.73, 0.09, 20, 48), bodyMat);
  bezelBase.position.z = 0.11;

  const goldBezelRim = new THREE.Mesh(new THREE.TorusGeometry(0.78, 0.025, 16, 48), goldMat);
  goldBezelRim.position.z = 0.11;

  // Textured sunray emerald dial
  const dialDisc = new THREE.Mesh(
    new THREE.CircleGeometry(0.66, 48),
    new THREE.MeshStandardMaterial({ map: dialTex, roughness: 0.35, metalness: 0.25 })
  );
  dialDisc.position.z = 0.125;

  // Animated watch hands
  const hourPivot = new THREE.Group();
  hourPivot.position.z = 0.14;
  const hourHand = new THREE.Mesh(new THREE.BoxGeometry(0.038, 0.34, 0.015), goldMat);
  hourHand.position.y = 0.15;
  hourPivot.add(hourHand);

  const minPivot = new THREE.Group();
  minPivot.position.z = 0.155;
  const minHand = new THREE.Mesh(new THREE.BoxGeometry(0.026, 0.48, 0.014), goldMat);
  minHand.position.y = 0.22;
  minPivot.add(minHand);

  const secPivot = new THREE.Group();
  secPivot.position.z = 0.17;
  const secHand = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.54, 0.01), goldMat);
  secHand.position.y = 0.24;
  secPivot.add(secHand);

  const centerPin = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.038, 0.05, 20), goldMat);
  centerPin.rotation.x = Math.PI / 2;
  centerPin.position.z = 0.16;

  // Sapphire crystal
  const crystal = new THREE.Mesh(new THREE.CylinderGeometry(0.68, 0.68, 0.03, 48), crystalMat);
  crystal.rotation.x = Math.PI / 2;
  crystal.position.z = 0.19;
  crystal.renderOrder = 2;

  // Crown & Pushers
  const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.095, 0.14, 24), goldMat);
  crown.rotation.z = Math.PI / 2;
  crown.position.set(0.83, 0, 0);

  const pusherTop = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.11, 20), goldMat);
  pusherTop.rotation.z = Math.PI / 2;
  pusherTop.position.set(0.79, 0.28, 0);

  const pusherBot = pusherTop.clone();
  pusherBot.position.y = -0.28;

  caseGroup.add(
    caseCyl,
    dialDisc,
    hourPivot,
    minPivot,
    secPivot,
    centerPin,
    crystal,
    crown,
    pusherTop,
    pusherBot
  );
  bezelGroup.add(bezelBase, goldBezelRim);

  // Sculpted curved emerald watch straps
  [-1, 1].forEach((dir) => {
    const lugL = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.34, 0.18), titaniumMat);
    lugL.position.set(-0.34, dir * 0.8, -0.01);
    const lugR = lugL.clone();
    lugR.position.x = 0.34;

    const strapCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, dir * 0.78, 0.02),
      new THREE.Vector3(0, dir * 1.15, -0.14),
      new THREE.Vector3(0, dir * 1.48, -0.45),
      new THREE.Vector3(0, dir * 1.42, -0.92),
    ]);
    const strapGeo = new THREE.TubeGeometry(strapCurve, 28, 0.12, 14, false);
    strapGeo.scale(2.3, 1, 0.45);
    const strapMesh = new THREE.Mesh(strapGeo, strapMat);
    strapGroup.add(lugL, lugR, strapMesh);
  });

  root.add(caseGroup, bezelGroup, strapGroup);

  const emptyGroup = new THREE.Group();

  const applyVariant = (variant: ProductColorVariant) => {
    bodyMat.color.set(variant.hex);
    strapMat.color.set(variant.hex).multiplyScalar(0.85);
    goldMat.color.set(variant.accentHex);
    goldMat.emissive.set(variant.accentHex);
  };

  const setExplode = (amount: number) => {
    const t = THREE.MathUtils.clamp(amount, 0, 1);
    bezelGroup.position.z = t * 0.52;
    strapGroup.position.z = -t * 0.45;
  };

  const updateDynamic = (elapsed: number) => {
    secPivot.rotation.z = -elapsed * 1.05;
    minPivot.rotation.z = -0.8 - elapsed * 0.05;
    hourPivot.rotation.z = 0.9 - elapsed * 0.008;
  };

  return {
    root,
    applyVariant,
    setExplode,
    updateDynamic,
    parts: {
      headband: bezelGroup,
      leftCushion: strapGroup,
      rightCushion: emptyGroup,
      leftShell: caseGroup,
      rightShell: emptyGroup,
      leftDriver: emptyGroup,
      rightDriver: emptyGroup,
      accentRings: [goldBezelRim],
      bodyMaterials: [bodyMat],
      accentMaterials: [goldMat],
    },
  };
}

function buildAudioSphereModel(initialVariant: ProductColorVariant): ProceduralProductModel {
  const root = new THREE.Group();

  const bodyMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(initialVariant.hex),
    metalness: initialVariant.metalness,
    roughness: initialVariant.roughness,
    clearcoat: 0.5,
    clearcoatRoughness: 0.2,
  });

  const goldMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(initialVariant.accentHex),
    emissive: new THREE.Color(initialVariant.accentHex),
    emissiveIntensity: 0.22,
    metalness: 0.95,
    roughness: 0.16,
  });

  const silverMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#DDE0DA'),
    metalness: 0.94,
    roughness: 0.16,
  });

  const upperHemi = new THREE.Group();
  const lowerHemi = new THREE.Group();
  const eqRingGroup = new THREE.Group();

  const topSphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.68, 48, 24, 0, Math.PI * 2, 0, Math.PI * 0.48),
    bodyMat
  );
  upperHemi.add(topSphere);

  const botSphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.68, 48, 24, 0, Math.PI * 2, Math.PI * 0.52, Math.PI * 0.48),
    bodyMat
  );
  lowerHemi.add(botSphere);

  // Equatorial 24K gold acoustic waveguide collar
  const eqCollar = new THREE.Mesh(new THREE.TorusGeometry(0.69, 0.045, 20, 64), goldMat);
  eqCollar.rotation.x = Math.PI / 2;

  const acousticCore = new THREE.Mesh(new THREE.SphereGeometry(0.48, 32, 32), silverMat);
  const goldGyroRing = new THREE.Mesh(new THREE.TorusGeometry(0.95, 0.022, 16, 64), goldMat);
  goldGyroRing.rotation.set(0.65, 0.3, 0);

  eqRingGroup.add(eqCollar, acousticCore, goldGyroRing);

  root.add(upperHemi, lowerHemi, eqRingGroup);

  const emptyGroup = new THREE.Group();

  const applyVariant = (variant: ProductColorVariant) => {
    bodyMat.color.set(variant.hex);
    bodyMat.metalness = variant.metalness;
    bodyMat.roughness = variant.roughness;
    goldMat.color.set(variant.accentHex);
    goldMat.emissive.set(variant.accentHex);
  };

  const setExplode = (amount: number) => {
    const t = THREE.MathUtils.clamp(amount, 0, 1);
    upperHemi.position.y = t * 0.48;
    lowerHemi.position.y = -t * 0.48;
  };

  const updateDynamic = (elapsed: number) => {
    goldGyroRing.rotation.y = elapsed * 0.55;
    goldGyroRing.rotation.x = 0.65 + Math.sin(elapsed * 0.7) * 0.18;
  };

  return {
    root,
    applyVariant,
    setExplode,
    updateDynamic,
    parts: {
      headband: upperHemi,
      leftCushion: lowerHemi,
      rightCushion: eqRingGroup,
      leftShell: emptyGroup,
      rightShell: emptyGroup,
      leftDriver: emptyGroup,
      rightDriver: emptyGroup,
      accentRings: [eqCollar, goldGyroRing],
      bodyMaterials: [bodyMat],
      accentMaterials: [goldMat],
    },
  };
}

export function buildLightTrails(): {
  group: THREE.Group;
  update: (elapsed: number) => void;
} {
  const group = new THREE.Group();
  const marbleTex = createEmeraldMarbleTexture();

  // 1. Sculpted 24K Gold metallic orbital rings
  const goldRingMat = new THREE.MeshStandardMaterial({
    color: 0xd6b265,
    emissive: 0x8f6b22,
    emissiveIntensity: 0.2,
    metalness: 0.96,
    roughness: 0.16,
  });

  const goldOrbital1 = new THREE.Mesh(new THREE.TorusGeometry(2.15, 0.022, 16, 96), goldRingMat);
  goldOrbital1.rotation.set(1.18, 0.32, 0.25);

  const goldOrbital2 = new THREE.Mesh(new THREE.TorusGeometry(1.78, 0.015, 14, 84), goldRingMat);
  goldOrbital2.rotation.set(-0.92, -0.45, 0.55);

  // 2. Translucent Jade Emerald Glass Ribbon Ring (matching hero visual!)
  const jadeGlassMat = new THREE.MeshPhysicalMaterial({
    color: 0x2a7a56,
    metalness: 0.12,
    roughness: 0.14,
    clearcoat: 1.0,
    clearcoatRoughness: 0.08,
    transparent: true,
    opacity: 0.72,
    side: THREE.DoubleSide,
  });

  const jadeRibbonGeo = new THREE.TorusGeometry(1.98, 0.075, 16, 96);
  jadeRibbonGeo.scale(1, 1, 0.35);
  const jadeRibbon = new THREE.Mesh(jadeRibbonGeo, jadeGlassMat);
  jadeRibbon.rotation.set(1.22, -0.25, -0.18);

  // 3. Emerald-Gold Marbled Stone Ribbon Ring
  const marbleMat = new THREE.MeshStandardMaterial({
    map: marbleTex,
    metalness: 0.35,
    roughness: 0.25,
  });
  const marbleRibbonGeo = new THREE.TorusGeometry(1.68, 0.065, 16, 84);
  marbleRibbonGeo.scale(1, 1, 0.38);
  const marbleRibbon = new THREE.Mesh(marbleRibbonGeo, marbleMat);
  marbleRibbon.rotation.set(1.05, 0.42, 0.3);

  // 4. Floating concentric mini 24K gold rings rising above
  const floatingMiniRings: THREE.Mesh[] = [];
  for (let i = 0; i < 4; i++) {
    const r = 0.16 + i * 0.085;
    const miniRing = new THREE.Mesh(
      new THREE.TorusGeometry(r, 0.012, 12, 48),
      goldRingMat
    );
    miniRing.rotation.x = Math.PI / 2.25;
    miniRing.position.set(0.35 + i * 0.05, 1.05 + i * 0.22, -0.25);
    group.add(miniRing);
    floatingMiniRings.push(miniRing);
  }

  // 5. Floating 24K Gold Micro-Spheres
  const goldBeads: THREE.Mesh[] = [];
  const beadGeo = new THREE.SphereGeometry(0.036, 16, 16);
  const beadOffsets: [number, number, number][] = [
    [-1.6, 0.85, 0.6],
    [1.85, 1.25, -0.35],
    [1.45, -1.15, 0.7],
    [-1.4, -0.95, 0.9],
    [0.55, 1.85, 0.3],
    [-0.45, -1.55, 0.5],
  ];
  beadOffsets.forEach((pos) => {
    const bead = new THREE.Mesh(beadGeo, goldRingMat);
    bead.position.set(...pos);
    group.add(bead);
    goldBeads.push(bead);
  });

  // 6. Fine 24K Gold Acoustic Dust Particles
  const particleCount = 110;
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    const angle = (i / particleCount) * Math.PI * 2;
    const r = 1.6 + (i % 7) * 0.22;
    positions[i * 3] = Math.cos(angle) * r;
    positions[i * 3 + 1] = ((i % 11) - 5) * 0.26;
    positions[i * 3 + 2] = Math.sin(angle) * r;
  }
  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particleMat = new THREE.PointsMaterial({
    color: 0xdfbe74,
    size: 0.028,
    transparent: true,
    opacity: 0.7,
    depthWrite: false,
  });
  const particles = new THREE.Points(particleGeo, particleMat);

  group.add(goldOrbital1, goldOrbital2, jadeRibbon, marbleRibbon, particles);

  const update = (elapsed: number) => {
    goldOrbital1.rotation.z = 0.25 + elapsed * 0.14;
    goldOrbital2.rotation.z = 0.55 - elapsed * 0.18;
    jadeRibbon.rotation.z = -0.18 + elapsed * 0.11;
    marbleRibbon.rotation.z = 0.3 - elapsed * 0.09;
    particles.rotation.y = elapsed * 0.08;

    floatingMiniRings.forEach((ring, idx) => {
      ring.position.y = 1.05 + idx * 0.22 + Math.sin(elapsed * 1.4 + idx * 0.8) * 0.05;
      ring.rotation.z = elapsed * (0.3 + idx * 0.1);
    });

    goldBeads.forEach((bead, idx) => {
      bead.position.y = beadOffsets[idx][1] + Math.sin(elapsed * 1.2 + idx * 1.3) * 0.08;
    });
  };

  return { group, update };
}

import { Product } from '../types';

export const ACOUSTIC_CHAMBER_IMAGE =
  '/src/assets/images/about_acoustic_chamber_1795610569939.jpg';

export const SOVEREIGN_SHOWCASE_IMAGE = '/assets/aistudio/image_8041c197.png';

export const PRODUCTS: Product[] = [
  {
    id: 'aureon-x1',
    slug: 'aureon-x1',
    modelType: 'x1',
    name: 'AUREON Sovereign One Headphones',
    category: 'Over-Ear Wireless',
    tagline: '24K Beryllium Drivers · Geneva Crafted',
    shortDescription:
      '50mm beryllium dynamic drivers, 24K gold acoustic grilles, deep forest-green lambskin cushions, and -48dB adaptive ANC.',
    description:
      'Forged from Grade 5 titanium, 24K gold-plated acoustic grilles, and hand-stitched Sovereign emerald lambskin, the AUREON Sovereign One (X1) delivers studio-reference resolution in complete wireless silence.',
    price: 1290,
    availability: 'In Stock',
    imageUrl: '/src/assets/images/product_aureon_x1_1795610567034.jpg',
    variants: [
      {
        id: 'sovereign-emerald',
        name: 'Sovereign Emerald & 24K Gold',
        hex: '#1B4332',
        accentHex: '#C49B4B',
        metalness: 0.55,
        roughness: 0.34,
      },
      {
        id: 'champagne-titanium',
        name: 'Champagne Titanium',
        hex: '#D6D3C9',
        accentHex: '#C49B4B',
        metalness: 0.9,
        roughness: 0.18,
      },
      {
        id: 'obsidian-gold',
        name: 'Obsidian & Gold',
        hex: '#16181A',
        accentHex: '#DFBE74',
        metalness: 0.78,
        roughness: 0.24,
      },
      {
        id: 'jade-silver',
        name: 'Deep Jade & Silver',
        hex: '#143227',
        accentHex: '#D8DCD8',
        metalness: 0.68,
        roughness: 0.26,
      },
    ],
    specs: [
      { label: 'Transducer', value: '50mm 24K Beryllium Dynamic' },
      { label: 'Frequency Response', value: '4 Hz – 48,000 Hz' },
      { label: 'Noise Cancellation', value: 'Hybrid Adaptive -48 dB (8 Mics)' },
      { label: 'Wireless Protocol', value: 'Bluetooth 5.4 · aptX Lossless · LDAC' },
      { label: 'Battery Endurance', value: '60 Hours (ANC On) · USB-C PD' },
      { label: 'Chassis', value: 'Grade 5 Titanium, 24K Gold & Lambskin' },
      { label: 'Mass', value: '318 g' },
    ],
    highlights: [
      {
        title: '24K Beryllium Dome',
        metric: '0.03% THD',
        detail: 'Vapor-deposited beryllium eliminates breakup resonance up to 48 kHz.',
      },
      {
        title: 'Neural Hybrid ANC',
        metric: '-48 dB',
        detail: 'Eight phase-aligned microphones isolate silence without cabin pressure.',
      },
      {
        title: 'Endurance Architecture',
        metric: '60 Hours',
        detail: 'Dual graphene-lithium cells yield 10 hours playback from a 10-minute charge.',
      },
    ],
    hotspots: [
      {
        id: 'headband',
        label: '01',
        title: 'Emerald Lambskin & Titanium Arch',
        description:
          'Hand-stitched Sovereign green leather over a brushed titanium spring bridge.',
        position: [0, 1.55, 0],
        cameraTarget: [0, 1.15, 0],
        cameraPosition: [0.3, 2.2, 3.3],
      },
      {
        id: 'driver',
        label: '02',
        title: '50mm Beryllium Driver',
        description:
          '24K gold-ringed acoustic dome suspended in a precision N52 neodymium flux ring.',
        position: [-0.95, -0.25, 0.1],
        cameraTarget: [-0.7, -0.25, 0],
        cameraPosition: [-2.6, 0.1, 2.5],
      },
      {
        id: 'ring',
        label: '03',
        title: '24K Gold Perforated Grille',
        description:
          'CNC-etched 24K gold acoustic mesh framed in brushed silver titanium.',
        position: [1.05, -0.25, 0.25],
        cameraTarget: [0.8, -0.25, 0],
        cameraPosition: [2.8, 0.2, 2.4],
      },
      {
        id: 'cushions',
        label: '04',
        title: 'Magnetic Acoustic Cushions',
        description:
          'Acoustic-sealed memory foam wrapped in micro-perforated emerald lambskin.',
        position: [-0.62, -0.3, 0.45],
        cameraTarget: [-0.55, -0.25, 0.2],
        cameraPosition: [-1.8, -0.3, 3.1],
      },
    ],
    comparison: {
      driver: '50mm 24K Beryllium Dynamic',
      anc: 'Hybrid Adaptive -48 dB',
      battery: '60 Hours (USB-C Fast Charge)',
      codec: 'BT 5.4 / aptX Lossless / LDAC',
      weight: '318 g',
      materials: 'Titanium, 24K Gold & Lambskin',
      response: '4 Hz – 48 kHz',
    },
  },
  {
    id: 'aureon-chronos-watch',
    slug: 'aureon-chronos-watch',
    modelType: 'chronos-watch',
    name: 'AUREON Chronos Watch',
    category: 'Timepieces & Wearables',
    tagline: 'Hybrid Kinetic Caliber · Acoustic Telemetry',
    shortDescription:
      'Swiss-crafted hybrid kinetic chronograph in brushed titanium, 24K gold bezel, sapphire crystal, and acoustic pulse haptic alerts.',
    description:
      'Designed as the tactile wrist companion to the Sovereign acoustic ecosystem, the Chronos Watch pairs a Swiss mechanical kinetic rotor with silent acoustic haptics and direct spatial-profile switching.',
    price: 2450,
    availability: 'Limited Allocation',
    imageUrl: '/assets/aistudio/image_8041c197.png',
    variants: [
      {
        id: 'emerald-gold-caliber',
        name: 'Emerald Dial & 24K Gold',
        hex: '#163D2D',
        accentHex: '#C49B4B',
        metalness: 0.75,
        roughness: 0.22,
      },
      {
        id: 'silver-slate',
        name: 'Brushed Titanium & Silver',
        hex: '#C8CDC9',
        accentHex: '#D6B265',
        metalness: 0.92,
        roughness: 0.16,
      },
      {
        id: 'obsidian-chronograph',
        name: 'Obsidian Caliber',
        hex: '#171A19',
        accentHex: '#C49B4B',
        metalness: 0.85,
        roughness: 0.22,
      },
    ],
    specs: [
      { label: 'Caliber', value: 'AUREON Hybrid Kinetic Swiss Movement' },
      { label: 'Case Architecture', value: '42mm Brushed Grade 5 Titanium' },
      { label: 'Bezel & Crown', value: '18K/24K Gold Accented Ceramic' },
      { label: 'Crystal', value: 'Domed Anti-Reflective Sapphire' },
      { label: 'Audio Integration', value: 'BLE 5.4 Sovereign Ecosystem Sync' },
      { label: 'Water Resistance', value: '100m / 10 ATM' },
      { label: 'Strap', value: 'Woven Sovereign Emerald FKM & Calfskin' },
    ],
    highlights: [
      {
        title: 'Hybrid Kinetic Rotor',
        metric: '72 Hours',
        detail: 'Self-winding micro-generator harvests wrist motion for continuous telemetry.',
      },
      {
        title: 'Acoustic Companion',
        metric: 'Instant Sync',
        detail: 'Switch ANC profiles and spatial presets directly from the rotating crown.',
      },
      {
        title: 'Sapphire Clarity',
        metric: '2,000 Vickers',
        detail: 'Box-domed sapphire glass reveals recessed chronograph sub-registers.',
      },
    ],
    hotspots: [
      {
        id: 'bezel',
        label: '01',
        title: 'Emerald & Gold Rotating Bezel',
        description:
          '120-click unidirectional acoustic timer bezel inlaid with brushed 24K gold indices.',
        position: [0, 0.72, 0.2],
        cameraTarget: [0, 0.2, 0],
        cameraPosition: [0.4, 1.3, 3.3],
      },
      {
        id: 'dial',
        label: '02',
        title: 'Sunray Emerald Chronograph Dial',
        description:
          'Triple-register mechanical dial with sweeping gold seconds hand and acoustic reserve meter.',
        position: [0, 0, 0.28],
        cameraTarget: [0, 0, 0],
        cameraPosition: [0, 0.1, 3.0],
      },
      {
        id: 'crown',
        label: '03',
        title: 'Knurled 24K Gold Crown',
        description:
          'Tactile rotary crown controlling both mechanical date setting and ANC attenuation.',
        position: [0.82, 0, 0.05],
        cameraTarget: [0.5, 0, 0],
        cameraPosition: [2.5, 0.3, 2.2],
      },
    ],
    comparison: {
      driver: 'Acoustic Haptic Transducer',
      anc: 'Remote ANC Profile Crown Control',
      battery: 'Hybrid Kinetic Self-Winding (72h Reserve)',
      codec: 'BLE 5.4 Ecosystem Telemetry',
      weight: '94 g',
      materials: 'Titanium, 24K Gold & Sapphire',
      response: 'Sub-millisecond Haptic Pulse',
    },
  },
  {
    id: 'aureon-audio-sphere',
    slug: 'aureon-audio-sphere',
    modelType: 'audio-sphere',
    name: 'AUREON Audio Sphere',
    category: 'Timepieces & Wearables',
    tagline: '360° Omnidirectional Acoustic Sculpture',
    shortDescription:
      'Machined emerald titanium acoustic orb with dual opposing beryllium radiators and 24K gold equatorial resonance rings.',
    description:
      'Engineered to fill an architectural salon with phase-coherent omnidirectional sound, the AUREON Audio Sphere suspends balanced force-cancelling transducers inside a precision-turned emerald alloy sphere.',
    price: 980,
    availability: 'In Stock',
    imageUrl: '/src/assets/images/product_aureon_air_mini_1795610567512.jpg',
    variants: [
      {
        id: 'emerald-gold-orb',
        name: 'Sovereign Emerald & Gold',
        hex: '#193E2E',
        accentHex: '#C49B4B',
        metalness: 0.72,
        roughness: 0.24,
      },
      {
        id: 'ivory-brass',
        name: 'Ivory Ceramic & Brass',
        hex: '#E8E4D8',
        accentHex: '#C49B4B',
        metalness: 0.4,
        roughness: 0.26,
      },
    ],
    specs: [
      { label: 'Architecture', value: 'Omnidirectional 360° Acoustic Sphere' },
      { label: 'Transducers', value: 'Dual Force-Cancelling 45mm Beryllium' },
      { label: 'Frequency Response', value: '32 Hz – 42,000 Hz' },
      { label: 'Connectivity', value: 'Wi-Fi Lossless · AirPlay · BT 5.4' },
      { label: 'Battery Endurance', value: '24 Hours Wireless Salon Playback' },
      { label: 'Diameter', value: '112 mm Solid Machined Alloy' },
      { label: 'Mass', value: '640 g' },
    ],
    highlights: [
      {
        title: 'Force-Cancelling Core',
        metric: '360° Field',
        detail: 'Opposing radiators eliminate cabinet vibration on marble or timber surfaces.',
      },
      {
        title: '24K Waveguide Ring',
        metric: 'Zero Diffraction',
        detail: 'Equatorial gold collar disperses upper frequencies evenly across the room.',
      },
      {
        title: 'Multi-Room Mesh',
        metric: '24-Bit / 192kHz',
        detail: 'Links seamlessly with up to eight AUREON spheres via ultra-wideband sync.',
      },
    ],
    hotspots: [
      {
        id: 'collar',
        label: '01',
        title: '24K Gold Equatorial Waveguide',
        description:
          'Precision-turned acoustic lens dispersing high frequencies through a full 360° horizon.',
        position: [0, 0.1, 0.78],
        cameraTarget: [0, 0, 0],
        cameraPosition: [0.6, 0.5, 3.1],
      },
      {
        id: 'chassis',
        label: '02',
        title: 'Monoblock Emerald Sphere',
        description:
          'Bead-blasted aluminum-magnesium shell damped internally with mineral resin.',
        position: [0.55, 0.55, 0.3],
        cameraTarget: [0, 0.2, 0],
        cameraPosition: [2.2, 1.4, 2.5],
      },
    ],
    comparison: {
      driver: 'Dual 45mm Force-Cancelling Beryllium',
      anc: 'Room-Adaptive Acoustic Calibration',
      battery: '24 Hours Portable / USB-C Dock',
      codec: 'Wi-Fi Lossless / BT 5.4 / UWB',
      weight: '640 g',
      materials: 'Emerald Alloy & 24K Gold Ring',
      response: '32 Hz – 42 kHz',
    },
  },
  {
    id: 'aureon-pro-studio',
    slug: 'aureon-pro-studio',
    modelType: 'pro-studio',
    name: 'AUREON Pro Studio',
    category: 'Open-Back Reference',
    tagline: 'Planar Magnetic Mastering Monitor',
    shortDescription:
      'Open-back 98mm ultra-thin planar magnetic transducers engineered for mastering suites and audiophile reference listening.',
    description:
      'Built without acoustic compression, the AUREON Pro Studio pairs a CNC-milled billet aluminum open grille with dual-sided N52 planar flux arrays and 24K gold acoustic mesh accents.',
    price: 1890,
    availability: 'Limited Allocation',
    imageUrl: '/src/assets/images/product_aureon_pro_studio_1795610567396.jpg',
    variants: [
      {
        id: 'raw-silver-gold',
        name: 'Billet Silver & 24K Gold',
        hex: '#D9D8D0',
        accentHex: '#C49B4B',
        metalness: 0.94,
        roughness: 0.16,
      },
      {
        id: 'sovereign-studio',
        name: 'Sovereign Forest & Gold',
        hex: '#193B2C',
        accentHex: '#C49B4B',
        metalness: 0.72,
        roughness: 0.26,
      },
      {
        id: 'obsidian-anodized',
        name: 'Anodized Obsidian',
        hex: '#1A1C1B',
        accentHex: '#DFBE74',
        metalness: 0.85,
        roughness: 0.22,
      },
    ],
    specs: [
      { label: 'Transducer', value: '98mm Ultra-Thin Planar Magnetic' },
      { label: 'Frequency Response', value: '5 Hz – 65,000 Hz' },
      { label: 'Acoustic Design', value: 'Open-Back Honeycombed Grille' },
      { label: 'Impedance / Sensitivity', value: '38 Ohms · 101 dB/mW' },
      { label: 'Connectivity', value: 'Balanced 4.4mm Pentaconn & 6.35mm Studio' },
      { label: 'Chassis', value: 'CNC 7075 Billet Aluminum & Suede' },
      { label: 'Mass', value: '395 g' },
    ],
    highlights: [
      {
        title: 'Planar Flux Array',
        metric: '1.2 Micron',
        detail: 'Sub-micron diaphragm membrane moves air uniformly across the entire surface.',
      },
      {
        title: 'Open Acoustic Mesh',
        metric: '0 dB Reflection',
        detail: 'Precision-etched honeycomb grille eliminates rear-wave cabinet resonance.',
      },
      {
        title: 'Balanced Cabling',
        metric: '6N OCC Copper',
        detail: 'Braided silver-plated monocrystal copper termination for ultra-low impedance.',
      },
    ],
    hotspots: [
      {
        id: 'suspension',
        label: '01',
        title: 'Dual-Arch Suspension',
        description:
          'Twin tensioned steel arches coupled to a self-adjusting perforated suede headband strap.',
        position: [0, 1.55, 0],
        cameraTarget: [0, 1.2, 0],
        cameraPosition: [0.4, 2.3, 3.2],
      },
      {
        id: 'grille',
        label: '02',
        title: 'CNC Perforated Grille',
        description:
          'Open acoustic matrix milled from solid 7075 aluminum for unrestricted rear-wave dispersion.',
        position: [1.05, -0.25, 0],
        cameraTarget: [0.85, -0.25, 0],
        cameraPosition: [2.9, 0.15, 2.1],
      },
      {
        id: 'planar',
        label: '03',
        title: '98mm Planar Magnetic Core',
        description:
          'Dual push-pull neodymium magnet array driving an etched silver-trace film.',
        position: [-0.95, -0.25, 0.1],
        cameraTarget: [-0.75, -0.25, 0],
        cameraPosition: [-2.6, 0.05, 2.3],
      },
    ],
    comparison: {
      driver: '98mm Planar Magnetic',
      anc: 'Open-Back Reference (Passive)',
      battery: 'Wired Passive (Zero Latency)',
      codec: 'Balanced 4.4mm & 6.35mm Analog',
      weight: '395 g',
      materials: '7075 Billet Aluminum & Lambskin',
      response: '5 Hz – 65 kHz',
    },
  },
  {
    id: 'aureon-air-mini',
    slug: 'aureon-air-mini',
    modelType: 'air-mini',
    name: 'AUREON Air Mini',
    category: 'In-Ear Monitors',
    tagline: 'Pocket-Sized Lossless Precision',
    shortDescription:
      'Dual-armature hybrid wireless monitors housed in Sovereign emerald shells with a machined titanium charging dock.',
    description:
      'Engineered to disappear in the ear while projecting an expansive soundstage, AUREON Air Mini pairs a 10mm dynamic woofer with a custom balanced armature tweeter inside an anodized acoustic chamber.',
    price: 490,
    availability: 'In Stock',
    imageUrl: '/src/assets/images/product_aureon_air_mini_1795610567512.jpg',
    variants: [
      {
        id: 'emerald-gold-mini',
        name: 'Sovereign Emerald & Gold',
        hex: '#193E2E',
        accentHex: '#C49B4B',
        metalness: 0.72,
        roughness: 0.28,
      },
      {
        id: 'platinum-silver',
        name: 'Platinum Silver',
        hex: '#D4D6D2',
        accentHex: '#C49B4B',
        metalness: 0.9,
        roughness: 0.18,
      },
      {
        id: 'obsidian-matte',
        name: 'Obsidian Matte',
        hex: '#16181A',
        accentHex: '#DFBE74',
        metalness: 0.78,
        roughness: 0.24,
      },
    ],
    specs: [
      { label: 'Transducer', value: '10mm Dynamic + Balanced Armature' },
      { label: 'Frequency Response', value: '10 Hz – 40,000 Hz' },
      { label: 'Noise Cancellation', value: 'Adaptive Seal ANC -42 dB' },
      { label: 'Wireless Protocol', value: 'Bluetooth 5.4 · LE Audio · aptX Adaptive' },
      { label: 'Battery Endurance', value: '9h Buds + 27h Machined Case (36h Total)' },
      { label: 'Ingress Protection', value: 'IPX5 Acoustic Mesh Seal' },
      { label: 'Mass', value: '5.4 g per monitor' },
    ],
    highlights: [
      {
        title: 'Coaxial Hybrid Driver',
        metric: '2-Way',
        detail: 'Phase-coherent crossover separates deep sub-bass from crystalline upper harmonics.',
      },
      {
        title: 'Anodized Aluminum Case',
        metric: '36 Hours',
        detail: 'Magnetic Qi2 wireless and USB-C charging vault milled from a single block.',
      },
      {
        title: 'Featherweight Ergonomics',
        metric: '5.4 Grams',
        detail: 'Contoured acoustic nozzle rests flush with zero ear-canal fatigue.',
      },
    ],
    hotspots: [
      {
        id: 'left-bud',
        label: '01',
        title: 'Coaxial Acoustic Nozzle',
        description:
          'Titanium waveguide aligns dynamic low-frequency and balanced armature high-frequency output.',
        position: [-0.65, 0.35, 0.2],
        cameraTarget: [-0.55, 0.25, 0],
        cameraPosition: [-1.8, 1.3, 2.7],
      },
      {
        id: 'right-bud',
        label: '02',
        title: 'Capacitive Sapphire Plate',
        description:
          'Flush-mounted acoustic touch surface with micro-perforated wind-noise reduction port.',
        position: [0.65, 0.35, 0.2],
        cameraTarget: [0.55, 0.25, 0],
        cameraPosition: [1.9, 1.3, 2.7],
      },
      {
        id: 'case',
        label: '03',
        title: 'Precision Charging Vault',
        description:
          'Bead-blasted aluminum enclosure with stainless torsion hinge and 24K gold telemetry bar.',
        position: [0, -0.45, 0.6],
        cameraTarget: [0, -0.3, 0],
        cameraPosition: [0.2, 0.8, 3.4],
      },
    ],
    comparison: {
      driver: '10mm Hybrid + Balanced Armature',
      anc: 'Adaptive Seal -42 dB',
      battery: '36 Hours Total (9h + 27h Case)',
      codec: 'BT 5.4 / LE Audio / aptX Adaptive',
      weight: '5.4 g per ear',
      materials: 'Anodized Aluminum & Medical Silicone',
      response: '10 Hz – 40 kHz',
    },
  },
];

export const TECHNOLOGY_MODULES = [
  {
    id: 'anc',
    index: '01',
    name: 'Active Noise Cancellation',
    subtitle: 'Neural Phase-Aligned Silence',
    metric: '-48 dB Broadband Attenuation',
    summary:
      'Eight bespoke MEMS microphones sample ambient acoustics 48,000 times per second. Our dedicated DSP generates an inverted phase wave in 12 microseconds, cancelling external resonance before it reaches your eardrum.',
    specs: [
      'Sampling Rate: 48 kHz dual-core DSP',
      'Latency: 12 microseconds phase inversion',
      'Transparency Mode: Natural 0-dB acoustic pass-through',
    ],
  },
  {
    id: 'spatial',
    index: '02',
    name: 'Spatial Audio',
    subtitle: '360° Head-Tracked Soundstage',
    metric: '1,000 Hz IMU Tracking',
    summary:
      'Embedded 6-axis gyroscopes and accelerometers lock virtual acoustic sources in physical space. Personalized HRTF acoustic mapping renders concert halls and studio stems in three dimensions.',
    specs: [
      'Sensors: 6-axis ultra-low-drift IMU',
      'Rendering: 32-bit binaural HRTF convolution',
      'Dynamic Range: 124 dB spatial headroom',
    ],
  },
  {
    id: 'battery',
    index: '03',
    name: 'Battery Technology',
    subtitle: 'Graphene-Enhanced Dual Cells',
    metric: '60 Hours Continuous Playback',
    summary:
      'Symmetrical high-density lithium-graphene cells distributed across both earcups preserve acoustic balance while delivering 60 hours of ANC playback with rapid USB-C charging.',
    specs: [
      'Capacity: Dual 820 mAh matched cells',
      'Rapid Charge: 10 min = 10 hours playback',
      'Thermal Guard: Continuous impedance balancing',
    ],
  },
  {
    id: 'drivers',
    index: '04',
    name: 'Premium Drivers',
    subtitle: '50mm Vapor-Deposited Beryllium',
    metric: '4 Hz – 48 kHz · 0.03% THD',
    summary:
      'Beryllium offers three times the stiffness-to-weight ratio of titanium, allowing our 50mm dome to move like an ideal piston with zero harmonic breakup, framed by a 24K gold acoustic mesh.',
    specs: [
      'Diaphragm: 99.8% pure vapor-deposited beryllium',
      'Magnet System: 1.6 Tesla N52 neodymium ring',
      'Total Harmonic Distortion: < 0.03% @ 1 kHz',
    ],
  },
  {
    id: 'bluetooth',
    index: '05',
    name: 'Bluetooth Connectivity',
    subtitle: 'Lossless 24-Bit Wireless Link',
    metric: 'Bluetooth 5.4 · 1.2 Mbps',
    summary:
      'Dual-antenna diversity architecture paired with Bluetooth 5.4 delivers bit-accurate 24-bit/96kHz and 192kHz lossless transmission alongside seamless Chronos Watch telemetry sync.',
    specs: [
      'Radio: Dual-diversity ceramic RF antennas',
      'Codecs: aptX Lossless, LDAC, AAC, LC3',
      'Ecosystem: Instant Chronos & Sphere pairing',
    ],
  },
] as const;

export type TechnologyId = (typeof TECHNOLOGY_MODULES)[number]['id'];

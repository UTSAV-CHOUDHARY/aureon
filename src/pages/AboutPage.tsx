import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { ACOUSTIC_CHAMBER_IMAGE } from '../data/products';
import { useStore } from '../context/StoreContext';
import { MagneticButton } from '../components/MagneticButton';

const MATERIALS = [
  {
    index: '01',
    title: 'Vapor-Deposited Beryllium & 24K Gold',
    detail:
      'Chosen for a stiffness-to-density ratio three times higher than titanium, our 50mm domes achieve piston-like transient accuracy framed by CNC-etched 24K gold acoustic mesh.',
  },
  {
    index: '02',
    title: 'CNC Grade 5 Titanium',
    detail:
      'Every structural yoke and watch lug is five-axis milled from solid aerospace titanium billet, bead-blasted, and finished with warm brushed satin tolerances.',
  },
  {
    index: '03',
    title: 'Sovereign Emerald Lambskin',
    detail:
      'Hand-selected Italian lambskin dyed in deep Sovereign emerald wraps acoustically calibrated memory foam cushions for effortless multi-hour comfort.',
  },
];

const MILESTONES = [
  {
    year: '2019',
    title: 'Founding of the Geneva & Zurich Atelier',
    detail:
      'Established by transducer physicists and horological craftsmen to unite mastering-studio neutrality with enduring material luxury.',
  },
  {
    year: '2022',
    title: 'Zero-Resonance Chamber & Kinetic Caliber',
    detail:
      'Commissioned our floating anechoic chamber and integrated hybrid kinetic watchmaking with ultra-low-latency acoustic telemetry.',
  },
  {
    year: '2026',
    title: 'AUREON Sovereign Series',
    detail:
      'Introduced Sovereign One Wireless Headphones, Chronos Watch, and Audio Sphere as one unified 24-bit ecosystem.',
  },
];

export function AboutPage() {
  const { navigate } = useStore();

  return (
    <div className="min-h-screen bg-[#F7F6F0] pt-28 pb-24 text-[#11291F] atelier-grid-bg">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-10 space-y-20">
        {/* Editorial Hero */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-end">
          <div className="space-y-4 lg:col-span-7">
            <p className="text-xs font-semibold tracking-[0.2em] text-[#A8833B] uppercase">
              Design Philosophy
            </p>
            <h1 className="font-display text-4xl font-semibold tracking-tight text-[#11291F] sm:text-5xl [text-wrap:balance]">
              Sculpted Around Pure Acoustic Truth.
            </h1>
          </div>
          <p className="text-sm leading-relaxed text-[#11291F]/75 sm:text-base lg:col-span-5">
            AUREON was created around a singular conviction: sensory luxury should never ask an
            artist or collector to choose between timeless horological craft and reference sound.
          </p>
        </div>

        {/* Full-Width Anechoic Laboratory Feature */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="overflow-hidden rounded-2xl border border-[#11291F]/15 bg-[#0B2017] text-[#F7F6F0]"
        >
          <div className="aspect-[16/9] max-h-[540px] w-full overflow-hidden">
            <img
              src={ACOUSTIC_CHAMBER_IMAGE}
              alt="AUREON Anechoic Acoustic Engineering Chamber"
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="grid grid-cols-2 gap-6 border-t border-white/10 p-8 sm:grid-cols-4">
            <div>
              <div className="font-mono text-2xl font-medium tabular-nums text-[#DFBE74]">
                -18 dBA
              </div>
              <div className="mt-1 text-xs text-[#F7F6F0]/65">Anechoic Noise Floor</div>
            </div>
            <div>
              <div className="font-mono text-2xl font-medium tabular-nums text-[#DFBE74]">
                0.01 mm
              </div>
              <div className="mt-1 text-xs text-[#F7F6F0]/65">CNC Yoke Tolerance</div>
            </div>
            <div>
              <div className="font-mono text-2xl font-medium tabular-nums text-[#DFBE74]">
                24-Bit
              </div>
              <div className="mt-1 text-xs text-[#F7F6F0]/65">Lossless Signal Path</div>
            </div>
            <div>
              <div className="font-mono text-2xl font-medium tabular-nums text-[#DFBE74]">
                100%
              </div>
              <div className="mt-1 text-xs text-[#F7F6F0]/65">Matched Driver Pairs</div>
            </div>
          </div>
        </motion.div>

        {/* Material Provenance */}
        <section className="space-y-8">
          <div className="border-b border-[#11291F]/10 pb-6">
            <p className="text-xs font-semibold tracking-[0.2em] text-[#A8833B] uppercase">
              Material Provenance
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-[#11291F] sm:text-4xl">
              Tactile Permanence in Every Gram
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {MATERIALS.map((mat) => (
              <div
                key={mat.index}
                className="rounded-2xl border border-[#11291F]/10 bg-white p-7 shadow-sm space-y-3"
              >
                <div className="font-mono text-xs text-[#A8833B]">{mat.index}</div>
                <h3 className="font-display text-2xl font-semibold text-[#11291F]">{mat.title}</h3>
                <p className="text-sm leading-relaxed text-[#11291F]/75">{mat.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Engineering Timeline */}
        <section className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-4">
            <p className="text-xs font-semibold tracking-[0.2em] text-[#A8833B] uppercase">
              Heritage & Innovation
            </p>
            <h2 className="font-display text-3xl font-semibold text-[#11291F] sm:text-4xl">
              Built Beyond Planned Obsolescence
            </h2>
            <p className="text-sm leading-relaxed text-[#11291F]/70">
              Magnetic cushions, modular battery packs, and serviceable titanium hinges ensure an
              AUREON instrument remains a reference companion for decades.
            </p>
            <div className="pt-2">
              <MagneticButton
                onClick={() => navigate('products')}
                className="inline-flex items-center gap-2 rounded-lg bg-[#122B21] px-5 py-3 text-xs font-semibold text-[#DFBE74] hover:bg-[#1B4332] transition-colors"
              >
                <span>Explore the Collection</span>
                <ArrowRight className="h-4 w-4" />
              </MagneticButton>
            </div>
          </div>

          <div className="divide-y divide-[#11291F]/10 rounded-2xl border border-[#11291F]/10 bg-white shadow-sm lg:col-span-8">
            {MILESTONES.map((item) => (
              <div
                key={item.year}
                className="flex flex-col gap-2 p-6 sm:flex-row sm:items-start sm:gap-8 sm:p-8"
              >
                <div className="font-mono text-lg font-medium tabular-nums text-[#A8833B] shrink-0">
                  {item.year}
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-display text-xl font-semibold text-[#11291F]">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-[#11291F]/75">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

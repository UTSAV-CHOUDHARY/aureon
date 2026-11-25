import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { TECHNOLOGY_MODULES, TechnologyId } from '../data/products';
import { TechnologyCutawayCanvas } from '../components/three/TechnologyCutawayCanvas';
import { useStore } from '../context/StoreContext';
import { MagneticButton } from '../components/MagneticButton';

export function TechnologyPage() {
  const { navigate } = useStore();
  const [activeTech, setActiveTech] = useState<TechnologyId>('anc');

  const currentModule =
    TECHNOLOGY_MODULES.find((m) => m.id === activeTech) || TECHNOLOGY_MODULES[0];

  return (
    <div className="min-h-screen bg-[#F7F6F0] pt-28 pb-24 text-[#11291F] atelier-grid-bg">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-10">
        {/* Header */}
        <div className="max-w-2xl space-y-4 border-b border-[#11291F]/10 pb-8">
          <p className="text-xs font-semibold tracking-[0.2em] text-[#A8833B] uppercase">
            Acoustic Architecture
          </p>
          <h1 className="font-display text-4xl font-semibold tracking-tight text-[#11291F] sm:text-5xl">
            Engineering Silence and Resolution
          </h1>
          <p className="text-sm leading-relaxed text-[#11291F]/75 sm:text-base">
            Select any acoustic subsystem below to inspect its animated 3D internal cutaway inside
            the AUREON Sovereign chassis.
          </p>
        </div>

        {/* Interactive 3D Cutaway + Technology Selector */}
        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-stretch">
          {/* Left: 5 Technology Pillars */}
          <div className="flex flex-col justify-between gap-3 lg:col-span-5">
            {TECHNOLOGY_MODULES.map((mod) => {
              const selected = mod.id === activeTech;
              return (
                <button
                  key={mod.id}
                  type="button"
                  onClick={() => setActiveTech(mod.id)}
                  className={`w-full rounded-xl border p-5 text-left transition-colors duration-200 ${
                    selected
                      ? 'border-[#C49B4B] bg-[#122B21] text-white shadow-md'
                      : 'border-[#11291F]/10 bg-white text-[#11291F] hover:border-[#C49B4B]/60'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-display text-lg font-semibold">
                      {mod.index}. {mod.name}
                    </span>
                    <span
                      className={`font-mono text-xs tabular-nums ${
                        selected ? 'text-[#DFBE74]' : 'text-[#A8833B]'
                      }`}
                    >
                      {mod.metric}
                    </span>
                  </div>
                  <p
                    className={`mt-1.5 text-xs ${
                      selected ? 'text-[#F7F6F0]/75' : 'text-[#11291F]/65'
                    }`}
                  >
                    {mod.subtitle}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Right: Animated 3D Cutaway Viewport */}
          <div className="flex flex-col gap-6 lg:col-span-7">
            <div className="h-[420px] sm:h-[480px] w-full">
              <TechnologyCutawayCanvas activeTech={activeTech} />
            </div>

            <motion.div
              key={currentModule.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28 }}
              className="rounded-2xl border border-[#11291F]/10 bg-white p-6 sm:p-8 shadow-sm space-y-5"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-xs font-semibold text-[#A8833B]">
                    {currentModule.subtitle}
                  </div>
                  <h2 className="mt-1 font-display text-2xl sm:text-3xl font-semibold text-[#11291F]">
                    {currentModule.name}
                  </h2>
                </div>
                <div className="font-mono text-sm font-medium tabular-nums text-[#122B21]">
                  {currentModule.metric}
                </div>
              </div>

              <p className="text-sm leading-relaxed text-[#11291F]/75">{currentModule.summary}</p>

              <div className="grid grid-cols-1 gap-3 border-t border-[#11291F]/10 pt-5 sm:grid-cols-3">
                {currentModule.specs.map((spec) => (
                  <div
                    key={spec}
                    className="rounded-lg border border-[#11291F]/10 bg-[#F7F6F0] px-3.5 py-2.5 text-xs text-[#11291F]"
                  >
                    {spec}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 flex flex-col items-start justify-between gap-6 rounded-2xl border border-[#11291F]/15 bg-[#0B2017] p-8 text-[#F7F6F0] sm:flex-row sm:items-center">
          <div>
            <h2 className="font-display text-3xl font-semibold text-white">
              Experience the Architecture Firsthand
            </h2>
            <p className="mt-1 text-sm text-[#F7F6F0]/75">
              Inspect the Sovereign One (X1) in 360° or schedule a private listening session in
              Geneva.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <MagneticButton
              onClick={() => navigate('product-detail', 'aureon-x1')}
              className="inline-flex items-center gap-2 rounded-lg bg-[#C49B4B] px-5 py-3 text-xs font-semibold text-[#0B2017] hover:bg-[#DFBE74] transition-colors"
            >
              <span>Inspect Sovereign One</span>
              <ArrowRight className="h-4 w-4" />
            </MagneticButton>
          </div>
        </div>
      </div>
    </div>
  );
}

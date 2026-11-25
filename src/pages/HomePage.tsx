import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'motion/react';
import { ArrowRight, Heart, Rotate3d } from 'lucide-react';
import { ACOUSTIC_CHAMBER_IMAGE, PRODUCTS } from '../data/products';
import { HeroObjectFocus } from '../types';
import { useStore } from '../context/StoreContext';
import { HeroHeadphoneCanvas } from '../components/three/HeroHeadphoneCanvas';
import { MagneticButton } from '../components/MagneticButton';

gsap.registerPlugin(ScrollTrigger);

const HERO_OBJECTS: {
  id: Exclude<HeroObjectFocus, 'all'>;
  index: string;
  label: string;
  slug: string;
}[] = [
  { id: 'x1', index: '01', label: 'Sovereign Headphones', slug: 'aureon-x1' },
  { id: 'chronos-watch', index: '02', label: 'Chronos Watch', slug: 'aureon-chronos-watch' },
  { id: 'audio-sphere', index: '03', label: 'Audio Sphere', slug: 'aureon-audio-sphere' },
];

const WAVEFORM_BARS = [
  16, 28, 42, 68, 48, 84, 96, 62, 74, 44, 58, 92, 78, 40, 52, 86, 64, 34, 48, 60, 38, 24, 18,
  30, 44, 28, 20,
];

const SCROLL_SPEC_CALLOUTS = [
  {
    id: 'drivers',
    range: [0.22, 0.52],
    title: '50mm 24K Beryllium Transducers',
    metric: '4 Hz – 48,000 Hz',
    detail:
      'Vapor-deposited beryllium dome moves as a rigid piston with < 0.03% harmonic distortion.',
    positionClass: 'top-[22%] left-6 lg:left-12',
  },
  {
    id: 'chronos',
    range: [0.42, 0.72],
    title: 'Hybrid Kinetic Telemetry',
    metric: '72-Hour Reserve',
    detail:
      'Chronos Watch synchronizes spatial audio profiles and ANC levels directly from its fluted crown.',
    positionClass: 'bottom-[18%] left-6 lg:left-12',
  },
  {
    id: 'sphere',
    range: [0.64, 0.96],
    title: '360° Omnidirectional Acoustic Field',
    metric: '24-Bit / 192 kHz',
    detail:
      'Sovereign Headphones, Chronos Watch, and Audio Sphere lock together in lossless wireless harmony.',
    positionClass: 'top-[24%] left-6 lg:left-12',
  },
];

export function HomePage() {
  const { navigate, addToCart, toggleWishlist, isWishlisted } = useStore();
  const scrollStageRef = useRef<HTMLDivElement>(null);
  const scrollProgressRef = useRef(0);
  const [scrollPhase, setScrollPhase] = useState(0);
  const [focusedObject, setFocusedObject] = useState<HeroObjectFocus>('all');
  const [waveTick, setWaveTick] = useState(0);

  useEffect(() => {
    const stage = scrollStageRef.current;
    if (!stage) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: stage,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.6,
        onUpdate: (self) => {
          scrollProgressRef.current = self.progress;
          setScrollPhase(self.progress);
        },
      });
    }, stage);

    return () => ctx.revert();
  }, []);

  // Gentle live acoustic waveform oscillation
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;
    const interval = window.setInterval(() => {
      setWaveTick((t) => (t + 1) % 1000);
    }, 140);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#F7F6F0] text-[#11291F]">
      {/* 1. IMMERSIVE SOVEREIGN HERO WITH 3D FLOATING MOTION GRAPHICS */}
      <section ref={scrollStageRef} className="relative h-[220vh]">
        <div className="sticky top-0 h-screen w-full overflow-hidden atelier-grid-bg">
          {/* Smooth Asymmetric Split Canvas: Warm Ivory Left -> Deep Sovereign Emerald Right */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'linear-gradient(108deg, rgba(247,246,240,0.96) 0%, rgba(244,242,233,0.90) 44%, rgba(22,61,44,0.86) 76%, rgba(8,28,20,0.98) 100%)',
            }}
          />

          {/* Interactive Floating 3D Motion Graphic Canvas (Headphones + Chronos Watch + Audio Sphere + Gold/Jade Ribbons) */}
          <div className="absolute inset-0 z-0">
            <HeroHeadphoneCanvas
              scrollProgressRef={scrollProgressRef}
              focusedObject={focusedObject}
            />
          </div>

          {/* Left Editorial Hero Column */}
          <div
            className="pointer-events-none relative z-10 mx-auto flex h-full max-w-[1440px] flex-col justify-between px-6 pt-24 pb-8 lg:px-10"
            style={{
              opacity: Math.max(0, 1 - scrollPhase * 3.5),
              transform: `translate3d(0, ${-scrollPhase * 70}px, 0)`,
            }}
          >
            <div className="my-auto max-w-xl space-y-5 pointer-events-auto">
              <p className="text-[11px] font-semibold tracking-[0.22em] text-[#A8833B] uppercase">
                AUREON ATELIER · SOUND WITHOUT BOUNDARIES
              </p>

              <h1 className="font-display text-[clamp(2.5rem,5vw,4.35rem)] font-semibold leading-[1.03] tracking-tight text-[#11291F] [text-wrap:balance]">
                Experience Sound Beyond Limits.
              </h1>

              <p className="max-w-md text-sm leading-relaxed text-[#11291F]/75 sm:text-base">
                Crafting the future of sensory luxury. Introducing the Aureon Sovereign Series—bespoke
                audio and wearable instruments forged from aerospace titanium, 24K gold, and
                precision acoustics.
              </p>

              <div className="flex flex-wrap items-center gap-3.5 pt-1">
                <MagneticButton
                  onClick={() => navigate('products')}
                  className="inline-flex items-center gap-2.5 rounded-lg bg-[#122B21] px-6 py-3.5 text-xs font-semibold tracking-[0.12em] uppercase text-[#DFBE74] hover:bg-[#1B4332] transition-colors shadow-sm"
                >
                  <span>Explore Headphones</span>
                  <ArrowRight className="h-4 w-4" />
                </MagneticButton>

                <MagneticButton
                  onClick={() => navigate('technology')}
                  className="inline-flex items-center gap-2 rounded-lg border border-[#11291F]/25 bg-white/80 px-6 py-3.5 text-xs font-semibold tracking-[0.12em] uppercase text-[#11291F] hover:border-[#C49B4B] hover:bg-white transition-colors"
                >
                  <span>Discover Technology</span>
                </MagneticButton>
              </div>

              {/* Clean Unboxed Metadata Strip */}
              <div className="flex flex-wrap items-center gap-2.5 pt-2 font-mono text-[11px] text-[#11291F]/65">
                <span className="tabular-nums text-[#11291F]">01 / 04</span>
                <span aria-hidden="true">·</span>
                <span>24K Beryllium Drivers</span>
                <span aria-hidden="true">·</span>
                <span>Hybrid Kinetic Caliber</span>
                <span aria-hidden="true">·</span>
                <span>Geneva Crafted</span>
              </div>

              {/* Live Frequency Response Acoustic Waveform Card */}
              <div className="w-fit rounded-xl border border-[#11291F]/10 bg-white/90 px-4 py-3 shadow-sm">
                <div className="flex items-end gap-1 h-7">
                  {WAVEFORM_BARS.map((height, idx) => {
                    const dynamicH = Math.max(
                      18,
                      Math.min(100, height + Math.sin(waveTick * 0.45 + idx * 0.7) * 18)
                    );
                    return (
                      <span
                        key={idx}
                        className="w-[3px] rounded-full bg-gradient-to-t from-[#1B4332] to-[#C49B4B] transition-[height] duration-150"
                        style={{ height: `${dynamicH}%` }}
                      />
                    );
                  })}
                </div>
                <div className="mt-2 font-mono text-[10px] tracking-[0.14em] uppercase text-[#11291F]/65">
                  Frequency Response: Studio Reference
                </div>
              </div>
            </div>

            {/* Bottom Interactive 3D Object Switcher Cards + Drag Indicator */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between pointer-events-auto">
              <div className="flex flex-wrap items-center gap-2.5">
                {HERO_OBJECTS.map((obj) => {
                  const isFocused = focusedObject === obj.id;
                  return (
                    <button
                      key={obj.id}
                      type="button"
                      onClick={() =>
                        setFocusedObject((prev) => (prev === obj.id ? 'all' : obj.id))
                      }
                      className={`group flex items-center gap-3 rounded-xl border px-3.5 py-2.5 text-left transition-all duration-200 ${
                        isFocused
                          ? 'border-[#C49B4B] bg-white shadow-md'
                          : 'border-[#11291F]/12 bg-white/85 hover:border-[#C49B4B]/60 hover:bg-white'
                      }`}
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#122B21] font-mono text-[11px] font-semibold text-[#DFBE74]">
                        {obj.index}
                      </span>
                      <div>
                        <div className="text-[11px] font-semibold tracking-[0.06em] uppercase text-[#11291F]">
                          {obj.label}
                        </div>
                        <div className="text-[10px] text-[#11291F]/55">
                          {isFocused ? 'Focused in 3D · Click to Reset' : 'Focus 3D Model'}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="hidden lg:flex items-center gap-2.5 rounded-lg border border-white/15 bg-[#0B2017]/80 px-3.5 py-2 text-[11px] font-medium tracking-[0.12em] uppercase text-[#F7F6F0]/85">
                <Rotate3d className="h-4 w-4 text-[#DFBE74]" />
                <span>3D Interaction Active · Drag to Rotate</span>
              </div>
            </div>
          </div>

          {/* Floating Scroll-Assembly Specification Cards */}
          <div className="pointer-events-none absolute inset-0 z-10 mx-auto max-w-[1440px]">
            {SCROLL_SPEC_CALLOUTS.map((callout) => {
              const visible =
                scrollPhase >= callout.range[0] && scrollPhase <= callout.range[1];
              return (
                <div
                  key={callout.id}
                  className={`absolute max-w-xs rounded-xl border border-[#11291F]/15 bg-white/94 p-5 shadow-lg transition-all duration-500 ${callout.positionClass} ${
                    visible
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-4 pointer-events-none'
                  }`}
                >
                  <div className="font-mono text-xs font-medium text-[#A8833B] tabular-nums">
                    {callout.metric}
                  </div>
                  <h2 className="mt-1 font-display text-xl font-semibold text-[#11291F]">
                    {callout.title}
                  </h2>
                  <p className="mt-1.5 text-xs leading-relaxed text-[#11291F]/75">
                    {callout.detail}
                  </p>
                </div>
              );
            })}

            {scrollPhase > 0.12 && (
              <div className="absolute bottom-8 left-6 right-6 flex items-center justify-between gap-6 lg:left-10 lg:right-10">
                <div className="rounded-md bg-white/90 px-3 py-1.5 text-xs font-medium text-[#11291F]">
                  {scrollPhase < 0.45
                    ? '01. Deconstructed Acoustic Ensemble'
                    : scrollPhase < 0.8
                      ? '02. Precision Beryllium & Kinetic Alignment'
                      : '03. Sovereign Reference Silhouette'}
                </div>
                <div className="h-[2px] w-44 overflow-hidden rounded-full bg-[#11291F]/15">
                  <div
                    className="h-full bg-[#C49B4B] transition-[width] duration-100"
                    style={{ width: `${Math.round(scrollPhase * 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 2. FEATURED SOVEREIGN COLLECTION */}
      <section className="mx-auto max-w-[1440px] px-6 py-24 lg:px-10">
        <div className="flex flex-col gap-4 border-b border-[#11291F]/10 pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-[#A8833B] uppercase">
              Atelier Collection
            </p>
            <h2 className="mt-2 font-display text-4xl font-semibold tracking-tight text-[#11291F] sm:text-5xl">
              Precision Across Every Instrument
            </h2>
          </div>
          <button
            type="button"
            onClick={() => navigate('products')}
            className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.12em] uppercase text-[#11291F] hover:text-[#A8833B] transition-colors self-start md:self-auto"
          >
            <span>Explore Full Catalog</span>
            <ArrowRight className="h-4 w-4 text-[#C49B4B]" />
          </button>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          {PRODUCTS.slice(0, 3).map((product, index) => {
            const wished = isWishlisted(product.id);
            return (
              <motion.article
                key={product.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="group flex flex-col justify-between rounded-2xl border border-[#11291F]/10 bg-white p-5 shadow-sm transition-transform duration-200 hover:-translate-y-0.5"
              >
                <div>
                  <div
                    onClick={() => navigate('product-detail', product.slug)}
                    className="relative aspect-[4/3] cursor-pointer overflow-hidden rounded-xl bg-[#0E281D]"
                  >
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                    <button
                      type="button"
                      aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(product.id);
                      }}
                      className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-[#0B2017]/80 text-white hover:border-[#DFBE74] transition-colors"
                    >
                      <Heart
                        className={`h-4 w-4 ${wished ? 'fill-[#DFBE74] text-[#DFBE74]' : ''}`}
                      />
                    </button>
                  </div>

                  <div className="mt-5 flex items-center gap-2 text-xs text-[#11291F]/60">
                    <span>{product.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{product.availability}</span>
                  </div>

                  <div className="mt-2 flex items-baseline justify-between gap-4">
                    <h3
                      onClick={() => navigate('product-detail', product.slug)}
                      className="cursor-pointer font-display text-xl font-semibold text-[#11291F] group-hover:text-[#1B4332] transition-colors"
                    >
                      {product.name}
                    </h3>
                    <span className="font-mono text-base font-medium tabular-nums text-[#11291F] shrink-0">
                      ${product.price.toLocaleString()}
                    </span>
                  </div>

                  <p className="mt-2.5 text-sm leading-relaxed text-[#11291F]/70">
                    {product.shortDescription}
                  </p>
                </div>

                <div className="mt-6 flex items-center gap-3 border-t border-[#11291F]/10 pt-4">
                  <button
                    type="button"
                    onClick={() => navigate('product-detail', product.slug)}
                    className="flex-1 rounded-lg border border-[#11291F]/20 py-2.5 text-xs font-semibold tracking-wide text-[#11291F] hover:border-[#C49B4B] transition-colors"
                  >
                    Inspect 3D
                  </button>
                  <button
                    type="button"
                    onClick={() => addToCart(product.id, product.variants[0].id, 1)}
                    className="flex-1 rounded-lg bg-[#122B21] py-2.5 text-xs font-semibold tracking-wide text-[#DFBE74] hover:bg-[#1B4332] transition-colors"
                  >
                    Add to Bag
                  </button>
                </div>
              </motion.article>
            );
          })}
        </div>
      </section>

      {/* 3. ACOUSTIC ENGINEERING & CRAFTSMANSHIP */}
      <section className="mx-auto max-w-[1440px] px-6 pb-24 lg:px-10">
        <div className="grid grid-cols-1 items-stretch overflow-hidden rounded-2xl border border-[#11291F]/15 bg-[#0B2017] text-[#F7F6F0] lg:grid-cols-12">
          <div className="relative min-h-[320px] lg:col-span-7">
            <img
              src={ACOUSTIC_CHAMBER_IMAGE}
              alt="AUREON Anechoic Acoustic Engineering Chamber"
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#0B2017]/95 hidden lg:block" />
          </div>

          <div className="flex flex-col justify-between p-8 lg:col-span-5 lg:p-12 space-y-8">
            <div className="space-y-4">
              <p className="text-xs font-semibold tracking-[0.2em] text-[#DFBE74] uppercase">
                Geneva & Zurich Acoustic Lab
              </p>
              <h2 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl [text-wrap:balance]">
                Calibrated in Absolute Silence.
              </h2>
              <p className="text-sm leading-relaxed text-[#F7F6F0]/75">
                Every AUREON transducer is laser-interferometer measured inside our floating
                anechoic chamber before hand-assembly. We pair vapor-deposited beryllium cones with
                aerospace Grade 5 titanium and 24K gold detailing.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 border-t border-white/10 pt-6">
              <div>
                <div className="font-mono text-2xl font-medium tabular-nums text-[#DFBE74]">
                  0.03%
                </div>
                <div className="mt-1 text-xs text-[#F7F6F0]/65">Total Harmonic Distortion</div>
              </div>
              <div>
                <div className="font-mono text-2xl font-medium tabular-nums text-[#DFBE74]">
                  -48 dB
                </div>
                <div className="mt-1 text-xs text-[#F7F6F0]/65">Broadband Neural ANC</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <MagneticButton
                onClick={() => navigate('technology')}
                className="rounded-lg bg-[#C49B4B] px-5 py-3 text-xs font-semibold tracking-wide text-[#0B2017] hover:bg-[#DFBE74] transition-colors"
              >
                Explore Cutaway Tech
              </MagneticButton>
              <button
                type="button"
                onClick={() => navigate('about')}
                className="rounded-lg border border-white/20 px-5 py-3 text-xs font-semibold text-white hover:border-[#DFBE74] transition-colors"
              >
                Our Philosophy
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

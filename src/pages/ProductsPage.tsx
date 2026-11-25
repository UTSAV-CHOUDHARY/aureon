import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Box, Camera, Check, Heart } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { useStore } from '../context/StoreContext';
import { Product3DViewer } from '../components/three/Product3DViewer';

type CategoryFilter =
  | 'All'
  | 'Over-Ear Wireless'
  | 'Open-Back Reference'
  | 'In-Ear Monitors'
  | 'Timepieces & Wearables';
type SortMode = 'featured' | 'price-asc' | 'price-desc';

const CATEGORIES: CategoryFilter[] = [
  'All',
  'Over-Ear Wireless',
  'Open-Back Reference',
  'In-Ear Monitors',
  'Timepieces & Wearables',
];

export function ProductsPage() {
  const { navigate, addToCart, toggleWishlist, isWishlisted } = useStore();

  const [category, setCategory] = useState<CategoryFilter>('All');
  const [sortMode, setSortMode] = useState<SortMode>('featured');

  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>(() =>
    Object.fromEntries(PRODUCTS.map((p) => [p.id, p.variants[0].id]))
  );

  // Default to live 3D preview on Chronos Watch & Audio Sphere, or user can toggle any card!
  const [previewMode, setPreviewMode] = useState<Record<string, 'photo' | '3d'>>({
    'aureon-chronos-watch': '3d',
    'aureon-audio-sphere': '3d',
  });

  const filteredProducts = useMemo(() => {
    const base =
      category === 'All' ? [...PRODUCTS] : PRODUCTS.filter((p) => p.category === category);
    if (sortMode === 'price-asc') return base.sort((a, b) => a.price - b.price);
    if (sortMode === 'price-desc') return base.sort((a, b) => b.price - a.price);
    return base;
  }, [category, sortMode]);

  return (
    <div className="min-h-screen bg-[#F7F6F0] pt-28 pb-24 text-[#11291F] atelier-grid-bg">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-10">
        {/* Page Title & Controls */}
        <div className="flex flex-col gap-6 border-b border-[#11291F]/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <p className="text-xs font-semibold tracking-[0.2em] text-[#A8833B] uppercase">
              Sovereign Collection
            </p>
            <h1 className="font-display text-4xl font-semibold tracking-tight text-[#11291F] sm:text-5xl">
              Engineered Reference Instruments
            </h1>
            <p className="max-w-xl text-sm leading-relaxed text-[#11291F]/70">
              Select a finish, rotate any instrument in real-time 3D directly on its card, or
              compare acoustic specifications across the complete AUREON lineup.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex flex-wrap items-center gap-1 rounded-lg border border-[#11291F]/10 bg-white p-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap ${
                    category === cat
                      ? 'bg-[#122B21] text-[#DFBE74]'
                      : 'text-[#11291F]/65 hover:text-[#11291F]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <select
              aria-label="Sort products"
              value={sortMode}
              onChange={(e) => setSortMode(e.target.value as SortMode)}
              className="rounded-lg border border-[#11291F]/15 bg-white px-3 py-2 text-xs font-semibold text-[#11291F] focus:border-[#C49B4B] focus:outline-none"
            >
              <option value="featured">Sort: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product, idx) => {
            const variantId = selectedVariants[product.id] || product.variants[0].id;
            const activeVariant =
              product.variants.find((v) => v.id === variantId) || product.variants[0];
            const mode = previewMode[product.id] || 'photo';
            const wished = isWishlisted(product.id);

            return (
              <motion.article
                key={product.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
                className="flex flex-col justify-between rounded-2xl border border-[#11291F]/10 bg-white p-6 shadow-sm transition-colors hover:border-[#C49B4B]/50"
              >
                <div>
                  {/* Visual Viewport (Photo or Live 3D) */}
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-[#0B2017]">
                    {mode === '3d' ? (
                      <Product3DViewer
                        modelType={product.modelType}
                        variant={activeVariant}
                        compact
                        fallbackImageUrl={product.imageUrl}
                        productName={product.name}
                      />
                    ) : (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        referrerPolicy="no-referrer"
                        onClick={() => navigate('product-detail', product.slug)}
                        className="h-full w-full cursor-pointer object-cover transition-transform duration-500 hover:scale-[1.03]"
                      />
                    )}

                    <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
                      <button
                        type="button"
                        onClick={() =>
                          setPreviewMode((prev) => ({
                            ...prev,
                            [product.id]: mode === 'photo' ? '3d' : 'photo',
                          }))
                        }
                        className="pointer-events-auto inline-flex items-center gap-1.5 rounded-lg border border-white/20 bg-[#0B2017]/90 px-2.5 py-1.5 text-[11px] font-medium text-[#F7F6F0] hover:border-[#DFBE74] transition-colors"
                      >
                        {mode === 'photo' ? (
                          <>
                            <Box className="h-3.5 w-3.5 text-[#DFBE74]" />
                            <span>3D Preview</span>
                          </>
                        ) : (
                          <>
                            <Camera className="h-3.5 w-3.5 text-[#DFBE74]" />
                            <span>Studio Photo</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
                        onClick={() => toggleWishlist(product.id)}
                        className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-[#0B2017]/90 text-white hover:border-[#DFBE74] transition-colors"
                      >
                        <Heart
                          className={`h-4 w-4 ${wished ? 'fill-[#DFBE74] text-[#DFBE74]' : ''}`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Unboxed Metadata */}
                  <div className="mt-5 flex items-center gap-2 text-xs text-[#11291F]/60">
                    <span>{product.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{product.availability}</span>
                  </div>

                  <div className="mt-2 flex items-baseline justify-between gap-4">
                    <h2
                      onClick={() => navigate('product-detail', product.slug)}
                      className="cursor-pointer font-display text-2xl font-semibold text-[#11291F] hover:text-[#1B4332] transition-colors"
                    >
                      {product.name}
                    </h2>
                    <span className="font-mono text-base font-medium tabular-nums text-[#11291F] shrink-0">
                      ${product.price.toLocaleString()}
                    </span>
                  </div>

                  <p className="mt-2 text-sm leading-relaxed text-[#11291F]/70">
                    {product.shortDescription}
                  </p>

                  {/* Colour Variant Selection */}
                  <div className="mt-5 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#11291F]/60">Finish</span>
                      <span className="font-semibold text-[#11291F]">{activeVariant.name}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      {product.variants.map((variant) => {
                        const selected = variant.id === activeVariant.id;
                        return (
                          <button
                            key={variant.id}
                            type="button"
                            aria-label={`Select ${variant.name} finish`}
                            onClick={() =>
                              setSelectedVariants((prev) => ({
                                ...prev,
                                [product.id]: variant.id,
                              }))
                            }
                            className={`flex h-7 w-7 items-center justify-center rounded-full border transition-transform ${
                              selected
                                ? 'scale-110 border-[#C49B4B] ring-2 ring-[#C49B4B]/40'
                                : 'border-[#11291F]/25 hover:scale-105'
                            }`}
                            style={{ backgroundColor: variant.hex }}
                          >
                            {selected && <Check className="h-3.5 w-3.5 text-white drop-shadow" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="mt-6 flex items-center gap-3 border-t border-[#11291F]/10 pt-5">
                  <button
                    type="button"
                    onClick={() => navigate('product-detail', product.slug)}
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#11291F]/20 py-2.5 text-xs font-semibold text-[#11291F] hover:border-[#C49B4B] transition-colors"
                  >
                    <span>Details</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => addToCart(product.id, activeVariant.id, 1)}
                    className="flex-1 rounded-lg bg-[#122B21] py-2.5 text-xs font-semibold text-[#DFBE74] hover:bg-[#1B4332] transition-colors"
                  >
                    Add to Bag
                  </button>
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* Product Comparison Matrix */}
        <section className="mt-24">
          <div className="space-y-2 border-b border-[#11291F]/10 pb-6">
            <p className="text-xs font-semibold tracking-[0.2em] text-[#A8833B] uppercase">
              Technical Specification Matrix
            </p>
            <h2 className="font-display text-3xl font-semibold text-[#11291F] sm:text-4xl">
              Compare Acoustic Architectures
            </h2>
          </div>

          <div className="mt-6 overflow-x-auto rounded-2xl border border-[#11291F]/10 bg-white shadow-sm">
            <table className="w-full min-w-[780px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[#11291F]/10 bg-[#EFECE2]/40">
                  <th className="px-6 py-5 text-xs font-semibold uppercase tracking-wider text-[#11291F]/65">
                    Specification
                  </th>
                  {PRODUCTS.map((p) => (
                    <th key={p.id} className="px-6 py-5">
                      <button
                        type="button"
                        onClick={() => navigate('product-detail', p.slug)}
                        className="font-display text-lg font-semibold text-[#11291F] hover:text-[#A8833B] transition-colors text-left"
                      >
                        {p.name}
                      </button>
                      <div className="mt-1 font-mono text-xs tabular-nums text-[#A8833B]">
                        ${p.price.toLocaleString()}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#11291F]/10">
                {(
                  [
                    ['Transducer', 'driver'],
                    ['Frequency Range', 'response'],
                    ['Noise Control', 'anc'],
                    ['Power / Endurance', 'battery'],
                    ['Codec / Interface', 'codec'],
                    ['Materials', 'materials'],
                    ['Mass', 'weight'],
                  ] as const
                ).map(([label, key]) => (
                  <tr key={key} className="hover:bg-[#F7F6F0]/70">
                    <td className="px-6 py-4 text-xs font-semibold text-[#11291F]/70">{label}</td>
                    {PRODUCTS.map((p) => (
                      <td
                        key={`${p.id}-${key}`}
                        className="px-6 py-4 text-xs sm:text-sm text-[#11291F] tabular-nums"
                      >
                        {p.comparison[key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

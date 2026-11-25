import { useEffect, useState } from 'react';
import { ArrowLeft, Check, Heart, Minus, Plus, Box, Camera } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { useStore } from '../context/StoreContext';
import { ProductHotspot } from '../types';
import { Product3DViewer } from '../components/three/Product3DViewer';
import { MagneticButton } from '../components/MagneticButton';

export function ProductDetailPage() {
  const { productSlug, navigate, addToCart, toggleWishlist, isWishlisted } = useStore();
  const product = PRODUCTS.find((p) => p.slug === productSlug) || PRODUCTS[0];

  const [selectedVariantId, setSelectedVariantId] = useState(product.variants[0].id);
  const [quantity, setQuantity] = useState(1);
  const [viewMode, setViewMode] = useState<'3d' | 'photo'>('3d');
  const [activeHotspot, setActiveHotspot] = useState<ProductHotspot | null>(
    product.hotspots[0] || null
  );

  useEffect(() => {
    setSelectedVariantId(product.variants[0].id);
    setActiveHotspot(product.hotspots[0] || null);
    setQuantity(1);
    setViewMode('3d');
  }, [product]);

  const activeVariant =
    product.variants.find((v) => v.id === selectedVariantId) || product.variants[0];
  const wished = isWishlisted(product.id);

  return (
    <div className="min-h-screen bg-[#F7F6F0] pt-28 pb-24 text-[#11291F] atelier-grid-bg">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-10">
        {/* Breadcrumb Back */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => navigate('products')}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#11291F]/70 hover:text-[#11291F] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Collection</span>
          </button>

          <div className="flex items-center gap-1 rounded-lg border border-[#11291F]/10 bg-white p-1">
            <button
              type="button"
              onClick={() => setViewMode('3d')}
              className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                viewMode === '3d'
                  ? 'bg-[#122B21] text-[#DFBE74]'
                  : 'text-[#11291F]/70 hover:text-[#11291F]'
              }`}
            >
              <Box className="h-3.5 w-3.5" />
              <span>360° 3D Studio</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('photo')}
              className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                viewMode === 'photo'
                  ? 'bg-[#122B21] text-[#DFBE74]'
                  : 'text-[#11291F]/70 hover:text-[#11291F]'
              }`}
            >
              <Camera className="h-3.5 w-3.5" />
              <span>Studio Photography</span>
            </button>
          </div>
        </div>

        {/* Main 2-Column PDP Split */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start">
          {/* Left Sticky 3D Stage + Hotspots + Floating Feature Cards */}
          <div className="space-y-6 lg:sticky lg:top-24 lg:col-span-7">
            <div className="h-[460px] sm:h-[560px] w-full">
              {viewMode === '3d' ? (
                <Product3DViewer
                  modelType={product.modelType}
                  variant={activeVariant}
                  hotspots={product.hotspots}
                  activeHotspotId={activeHotspot?.id || null}
                  onSelectHotspot={(spot) => setActiveHotspot(spot)}
                  fallbackImageUrl={product.imageUrl}
                  productName={product.name}
                />
              ) : (
                <div className="h-full w-full overflow-hidden rounded-2xl border border-[#11291F]/10 bg-[#0B2017]">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
            </div>

            {product.hotspots.length > 0 && (
              <div className="rounded-2xl border border-[#11291F]/10 bg-white p-5 shadow-sm space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  {product.hotspots.map((spot) => {
                    const active = activeHotspot?.id === spot.id;
                    return (
                      <button
                        key={spot.id}
                        type="button"
                        onClick={() => {
                          setViewMode('3d');
                          setActiveHotspot(spot);
                        }}
                        className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap ${
                          active
                            ? 'border-[#C49B4B] bg-[#122B21] text-[#DFBE74]'
                            : 'border-[#11291F]/15 text-[#11291F]/75 hover:border-[#C49B4B]'
                        }`}
                      >
                        <span className="font-mono mr-1.5 opacity-80">{spot.label}</span>
                        {spot.title}
                      </button>
                    );
                  })}
                </div>
                {activeHotspot && (
                  <p className="text-sm leading-relaxed text-[#11291F]/80">
                    {activeHotspot.description}
                  </p>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {product.highlights.map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl border border-[#11291F]/10 bg-white p-5 shadow-sm"
                >
                  <div className="font-mono text-lg font-medium tabular-nums text-[#A8833B]">
                    {item.metric}
                  </div>
                  <h3 className="mt-1.5 font-display text-lg font-semibold text-[#11291F]">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-[#11291F]/70">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Contiguous Purchase Module & Specifications */}
          <div className="space-y-8 rounded-2xl border border-[#11291F]/10 bg-white p-6 sm:p-8 shadow-sm lg:col-span-5">
            <div className="space-y-3 border-b border-[#11291F]/10 pb-6">
              <div className="flex items-center gap-2 text-xs text-[#11291F]/65">
                <span>{product.category}</span>
                <span aria-hidden="true">·</span>
                <span>{product.availability}</span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-[#11291F]">
                {product.name}
              </h1>
              <div className="font-mono text-2xl font-medium tabular-nums text-[#11291F]">
                ${product.price.toLocaleString()}
              </div>
              <p className="pt-1 text-sm leading-relaxed text-[#11291F]/75">
                {product.description}
              </p>
            </div>

            {/* Finish Selector */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-[#11291F]/70">Anodized Finish</span>
                <span className="font-semibold text-[#11291F]">{activeVariant.name}</span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {product.variants.map((variant) => {
                  const selected = variant.id === activeVariant.id;
                  return (
                    <button
                      key={variant.id}
                      type="button"
                      onClick={() => setSelectedVariantId(variant.id)}
                      className={`flex items-center gap-2.5 rounded-lg border px-3.5 py-2 text-xs font-semibold transition-colors ${
                        selected
                          ? 'border-[#C49B4B] bg-[#122B21] text-[#DFBE74]'
                          : 'border-[#11291F]/15 bg-[#F7F6F0] text-[#11291F]/80 hover:border-[#C49B4B]'
                      }`}
                    >
                      <span
                        className="flex h-4 w-4 items-center justify-center rounded-full border border-white/40"
                        style={{ backgroundColor: variant.hex }}
                      >
                        {selected && <Check className="h-2.5 w-2.5 text-white" />}
                      </span>
                      <span>{variant.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity & Primary Purchase CTAs */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center rounded-lg border border-[#11291F]/20 bg-[#F7F6F0]">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="flex h-11 w-11 items-center justify-center text-[#11291F]/75 hover:text-[#11291F]"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-10 text-center font-mono text-sm tabular-nums">{quantity}</span>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                    className="flex h-11 w-11 items-center justify-center text-[#11291F]/75 hover:text-[#11291F]"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <MagneticButton
                  onClick={() => addToCart(product.id, activeVariant.id, quantity)}
                  className="flex-1 rounded-lg bg-[#122B21] py-3.5 px-6 text-sm font-semibold text-[#DFBE74] hover:bg-[#1B4332] transition-colors"
                >
                  Add to Bag — ${(product.price * quantity).toLocaleString()}
                </MagneticButton>
              </div>

              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                className={`flex w-full items-center justify-center gap-2 rounded-lg border py-3 text-xs font-semibold transition-colors ${
                  wished
                    ? 'border-[#C49B4B] bg-[#EFECE2] text-[#11291F]'
                    : 'border-[#11291F]/20 text-[#11291F]/75 hover:border-[#C49B4B] hover:text-[#11291F]'
                }`}
              >
                <Heart className={`h-4 w-4 ${wished ? 'fill-[#C49B4B] text-[#C49B4B]' : ''}`} />
                <span>{wished ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
              </button>
            </div>

            {/* Specifications Table */}
            <div className="space-y-3 border-t border-[#11291F]/10 pt-6">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-[#11291F]/65">
                Technical Specifications
              </h2>
              <dl className="divide-y divide-[#11291F]/10">
                {product.specs.map((spec) => (
                  <div key={spec.label} className="flex items-baseline justify-between gap-4 py-3">
                    <dt className="text-xs text-[#11291F]/65">{spec.label}</dt>
                    <dd className="text-right font-mono text-xs tabular-nums text-[#11291F]">
                      {spec.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

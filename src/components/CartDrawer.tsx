import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X, Plus, Minus, Trash2, Heart, ShoppingBag, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { PRODUCTS } from '../data/products';
import { DemoOrderResponse } from '../types';

export function CartDrawer() {
  const {
    drawerOpen,
    drawerTab,
    setDrawerOpen,
    setDrawerTab,
    cart,
    wishlist,
    cartCount,
    cartSubtotal,
    updateQuantity,
    removeFromCart,
    clearCart,
    addToCart,
    toggleWishlist,
    navigate,
  } = useStore();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('Switzerland');
  const [submitting, setSubmitting] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [orderReceipt, setOrderReceipt] = useState<DemoOrderResponse | null>(null);

  const shippingCost = cartSubtotal === 0 ? 0 : cartSubtotal >= 1000 ? 0 : 35;
  const orderTotal = cartSubtotal + shippingCost;

  const handlePlaceDemoOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutError(null);
    setSubmitting(true);
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart,
          customer: {
            fullName,
            email,
            address,
            city,
            postalCode,
            country,
          },
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setCheckoutError(data.error || 'Could not complete demo order.');
        return;
      }
      setOrderReceipt(data as DemoOrderResponse);
      clearCart();
    } catch {
      setCheckoutError('Network error submitting demo order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetReceiptAndClose = () => {
    setOrderReceipt(null);
    setCheckoutError(null);
    setDrawerOpen(false);
  };

  return (
    <AnimatePresence>
      {drawerOpen && (
        <div
          className="fixed inset-0 z-[100] flex justify-end"
          role="dialog"
          aria-modal="true"
          aria-label="Shopping Bag and Wishlist"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setDrawerOpen(false)}
            className="fixed inset-0 bg-[#0B2017]/55"
          />

          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 flex h-full w-full max-w-md flex-col border-l border-[#11291F]/15 bg-[#F7F6F0] text-[#11291F] shadow-2xl"
          >
            {/* Header & Tabs */}
            <div className="border-b border-[#11291F]/10 bg-white px-6 py-5">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-2xl font-semibold text-[#11291F]">
                  {drawerTab === 'checkout' ? 'Demo Checkout' : 'Atelier Selection'}
                </h2>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  aria-label="Close drawer"
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#11291F]/15 text-[#11291F]/70 hover:text-[#11291F] transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {!orderReceipt && (
                <div className="mt-4 flex gap-1 rounded-lg bg-[#EFECE2] p-1">
                  <button
                    type="button"
                    onClick={() => setDrawerTab('bag')}
                    className={`flex-1 rounded-md py-2 text-xs font-semibold transition-colors whitespace-nowrap ${
                      drawerTab === 'bag' || drawerTab === 'checkout'
                        ? 'bg-[#122B21] text-[#DFBE74]'
                        : 'text-[#11291F]/70 hover:text-[#11291F]'
                    }`}
                  >
                    Shopping Bag ({cartCount})
                  </button>
                  <button
                    type="button"
                    onClick={() => setDrawerTab('wishlist')}
                    className={`flex-1 rounded-md py-2 text-xs font-semibold transition-colors whitespace-nowrap ${
                      drawerTab === 'wishlist'
                        ? 'bg-[#122B21] text-[#DFBE74]'
                        : 'text-[#11291F]/70 hover:text-[#11291F]'
                    }`}
                  >
                    Wishlist ({wishlist.length})
                  </button>
                </div>
              )}
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              {orderReceipt ? (
                <div className="space-y-6">
                  <div className="rounded-xl border border-[#1B4332]/25 bg-[#122B21] p-5 text-[#F7F6F0] space-y-3">
                    <div className="flex items-center gap-2.5 text-[#DFBE74]">
                      <CheckCircle2 className="h-5 w-5 shrink-0" />
                      <span className="text-xs font-semibold uppercase tracking-wider">
                        {orderReceipt.status}
                      </span>
                    </div>
                    <div>
                      <p className="font-display text-2xl font-semibold text-white">
                        Order {orderReceipt.orderNumber}
                      </p>
                      <p className="mt-1 text-xs text-[#F7F6F0]/75">
                        Confirmation prepared for {orderReceipt.customer.fullName} (
                        {orderReceipt.customer.email})
                      </p>
                    </div>
                    <p className="text-xs text-[#F7F6F0]/70 border-t border-white/10 pt-3">
                      {orderReceipt.note}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-[#11291F]/60">
                      Order Summary
                    </h3>
                    {orderReceipt.items.map((item, i) => (
                      <div
                        key={`${item.productId}-${i}`}
                        className="flex items-center justify-between border-b border-[#11291F]/10 pb-3 text-sm"
                      >
                        <div>
                          <div className="font-semibold text-[#11291F]">{item.productName}</div>
                          <div className="text-xs text-[#11291F]/65">
                            {item.variantName} · Qty {item.quantity}
                          </div>
                        </div>
                        <div className="font-mono text-sm tabular-nums text-[#11291F]">
                          ${item.lineTotal.toLocaleString()}
                        </div>
                      </div>
                    ))}
                    <div className="flex items-center justify-between pt-2 text-base font-semibold">
                      <span>Total Simulated</span>
                      <span className="font-mono tabular-nums">
                        ${orderReceipt.total.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={resetReceiptAndClose}
                    className="w-full rounded-lg bg-[#122B21] py-3.5 text-sm font-semibold text-[#DFBE74] hover:bg-[#1B4332] transition-colors"
                  >
                    Continue Exploring AUREON
                  </button>
                </div>
              ) : drawerTab === 'bag' ? (
                cart.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center text-center py-12 space-y-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#11291F]/15 bg-white text-[#11291F]/60">
                      <ShoppingBag className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-display text-xl font-semibold">Your bag is empty</p>
                      <p className="text-sm text-[#11291F]/65 max-w-xs">
                        Explore our Sovereign headphones, Chronos timepiece, and acoustic sphere.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setDrawerOpen(false);
                        navigate('products');
                      }}
                      className="rounded-lg bg-[#122B21] px-5 py-2.5 text-xs font-semibold text-[#DFBE74] hover:bg-[#1B4332] transition-colors"
                    >
                      View Atelier Collection
                    </button>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {cart.map((item) => {
                      const product = PRODUCTS.find((p) => p.id === item.productId);
                      if (!product) return null;
                      const variant =
                        product.variants.find((v) => v.id === item.variantId) || product.variants[0];

                      return (
                        <div
                          key={`${item.productId}-${item.variantId}`}
                          className="flex gap-4 border-b border-[#11291F]/10 pb-5"
                        >
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            referrerPolicy="no-referrer"
                            className="h-20 w-24 shrink-0 rounded-lg object-cover border border-[#11291F]/10 bg-white"
                          />
                          <div className="flex flex-1 flex-col justify-between min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setDrawerOpen(false);
                                    navigate('product-detail', product.slug);
                                  }}
                                  className="text-left text-sm font-semibold text-[#11291F] hover:text-[#C49B4B] transition-colors truncate block w-full"
                                >
                                  {product.name}
                                </button>
                                <div className="mt-1 flex items-center gap-2 text-xs text-[#11291F]/65">
                                  <span
                                    className="inline-block h-2.5 w-2.5 rounded-full border border-[#11291F]/25"
                                    style={{ backgroundColor: variant.hex }}
                                  />
                                  <span>{variant.name}</span>
                                </div>
                              </div>
                              <button
                                type="button"
                                aria-label={`Remove ${product.name}`}
                                onClick={() => removeFromCart(item.productId, item.variantId)}
                                className="text-[#11291F]/45 hover:text-rose-600 transition-colors p-1"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>

                            <div className="mt-3 flex items-center justify-between">
                              <div className="flex items-center rounded-md border border-[#11291F]/15 bg-white">
                                <button
                                  type="button"
                                  aria-label="Decrease quantity"
                                  onClick={() =>
                                    updateQuantity(item.productId, item.variantId, item.quantity - 1)
                                  }
                                  className="flex h-8 w-8 items-center justify-center text-[#11291F]/75 hover:text-[#11291F]"
                                >
                                  <Minus className="h-3 w-3" />
                                </button>
                                <span className="w-7 text-center font-mono text-xs tabular-nums">
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  aria-label="Increase quantity"
                                  onClick={() =>
                                    updateQuantity(item.productId, item.variantId, item.quantity + 1)
                                  }
                                  className="flex h-8 w-8 items-center justify-center text-[#11291F]/75 hover:text-[#11291F]"
                                >
                                  <Plus className="h-3 w-3" />
                                </button>
                              </div>

                              <span className="font-mono text-sm font-medium tabular-nums text-[#11291F]">
                                ${(product.price * item.quantity).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )
              ) : drawerTab === 'wishlist' ? (
                wishlist.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center text-center py-12 space-y-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#11291F]/15 bg-white text-[#11291F]/60">
                      <Heart className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-display text-xl font-semibold">No saved pieces yet</p>
                      <p className="text-sm text-[#11291F]/65 max-w-xs">
                        Save instruments to your private Atelier list while comparing finishes.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {wishlist.map((productId) => {
                      const product = PRODUCTS.find((p) => p.id === productId);
                      if (!product) return null;
                      return (
                        <div
                          key={product.id}
                          className="flex items-center gap-4 rounded-xl border border-[#11291F]/10 bg-white p-3"
                        >
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            referrerPolicy="no-referrer"
                            className="h-16 w-20 rounded-lg object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-[#11291F] truncate">
                              {product.name}
                            </div>
                            <div className="font-mono text-xs tabular-nums text-[#11291F]/70 mt-0.5">
                              ${product.price.toLocaleString()}
                            </div>
                            <div className="mt-2 flex items-center gap-3">
                              <button
                                type="button"
                                onClick={() => addToCart(product.id, product.variants[0].id, 1)}
                                className="text-xs font-semibold text-[#1B4332] hover:text-[#C49B4B] transition-colors"
                              >
                                Move to Bag
                              </button>
                              <button
                                type="button"
                                onClick={() => toggleWishlist(product.id)}
                                className="text-xs text-[#11291F]/55 hover:text-[#11291F] transition-colors"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )
              ) : (
                <form id="demo-checkout-form" onSubmit={handlePlaceDemoOrder} className="space-y-5">
                  <div className="rounded-lg border border-[#C49B4B]/40 bg-white px-4 py-3 text-xs leading-relaxed text-[#11291F]">
                    <span className="font-semibold">Demo Checkout Environment:</span> Submitting
                    creates a simulated reservation receipt. No live payment gateway is connected.
                  </div>

                  {checkoutError && (
                    <div
                      role="alert"
                      className="rounded-lg border border-rose-500/40 bg-rose-50 px-4 py-3 text-xs text-rose-800"
                    >
                      {checkoutError}
                    </div>
                  )}

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-[#11291F]/80 mb-1.5">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Elena Vance"
                        className="w-full rounded-lg border border-[#11291F]/15 bg-white px-3.5 py-2.5 text-sm text-[#11291F] placeholder:text-[#11291F]/35 focus:border-[#1B4332] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#11291F]/80 mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="elena@example.com"
                        className="w-full rounded-lg border border-[#11291F]/15 bg-white px-3.5 py-2.5 text-sm text-[#11291F] placeholder:text-[#11291F]/35 focus:border-[#1B4332] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#11291F]/80 mb-1.5">
                        Street Address
                      </label>
                      <input
                        type="text"
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Rue du Rhône 42"
                        className="w-full rounded-lg border border-[#11291F]/15 bg-white px-3.5 py-2.5 text-sm text-[#11291F] placeholder:text-[#11291F]/35 focus:border-[#1B4332] focus:outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-[#11291F]/80 mb-1.5">
                          City
                        </label>
                        <input
                          type="text"
                          required
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="Geneva"
                          className="w-full rounded-lg border border-[#11291F]/15 bg-white px-3.5 py-2.5 text-sm text-[#11291F] placeholder:text-[#11291F]/35 focus:border-[#1B4332] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[#11291F]/80 mb-1.5">
                          Postal Code
                        </label>
                        <input
                          type="text"
                          required
                          value={postalCode}
                          onChange={(e) => setPostalCode(e.target.value)}
                          placeholder="1204"
                          className="w-full rounded-lg border border-[#11291F]/15 bg-white px-3.5 py-2.5 text-sm text-[#11291F] placeholder:text-[#11291F]/35 focus:border-[#1B4332] focus:outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#11291F]/80 mb-1.5">
                        Country
                      </label>
                      <input
                        type="text"
                        required
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full rounded-lg border border-[#11291F]/15 bg-white px-3.5 py-2.5 text-sm text-[#11291F] focus:border-[#1B4332] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="border-t border-[#11291F]/10 pt-4 space-y-2 text-sm">
                    <div className="flex justify-between text-[#11291F]/70">
                      <span>Subtotal</span>
                      <span className="font-mono tabular-nums">${cartSubtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-[#11291F]/70">
                      <span>Insured Courier</span>
                      <span className="font-mono tabular-nums">
                        {shippingCost === 0 ? 'Complimentary' : `$${shippingCost}`}
                      </span>
                    </div>
                    <div className="flex justify-between font-semibold text-[#11291F] pt-1">
                      <span>Demo Order Total</span>
                      <span className="font-mono tabular-nums">${orderTotal.toLocaleString()}</span>
                    </div>
                  </div>
                </form>
              )}
            </div>

            {!orderReceipt && drawerTab === 'bag' && cart.length > 0 && (
              <div className="border-t border-[#11291F]/10 bg-white px-6 py-5 space-y-4">
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between text-[#11291F]/75">
                    <span>Subtotal</span>
                    <span className="font-mono tabular-nums font-semibold text-[#11291F]">
                      ${cartSubtotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-[#11291F]/55">
                    <span>Insured Express Delivery</span>
                    <span>{shippingCost === 0 ? 'Complimentary ($1,000+)' : `$${shippingCost}`}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setDrawerTab('checkout')}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#122B21] py-3.5 text-sm font-semibold text-[#DFBE74] hover:bg-[#1B4332] transition-colors"
                >
                  <span>Proceed to Demo Checkout</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}

            {!orderReceipt && drawerTab === 'checkout' && (
              <div className="border-t border-[#11291F]/10 bg-white px-6 py-5 flex gap-3">
                <button
                  type="button"
                  onClick={() => setDrawerTab('bag')}
                  className="rounded-lg border border-[#11291F]/20 px-4 py-3 text-xs font-semibold text-[#11291F] hover:bg-[#F7F6F0] transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  form="demo-checkout-form"
                  disabled={submitting || cart.length === 0}
                  className="flex-1 rounded-lg bg-[#122B21] py-3 text-sm font-semibold text-[#DFBE74] hover:bg-[#1B4332] disabled:opacity-50 transition-colors"
                >
                  {submitting ? 'Confirming Reservation...' : 'Confirm Demo Order'}
                </button>
              </div>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}

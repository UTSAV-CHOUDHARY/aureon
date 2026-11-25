import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CartItem, PageRoute } from '../types';
import { PRODUCTS } from '../data/products';

type DrawerTab = 'bag' | 'wishlist' | 'checkout';

interface StoreContextValue {
  route: PageRoute;
  productSlug: string;
  navigate: (route: PageRoute, slug?: string) => void;
  cart: CartItem[];
  wishlist: string[];
  drawerOpen: boolean;
  drawerTab: DrawerTab;
  setDrawerOpen: (open: boolean) => void;
  setDrawerTab: (tab: DrawerTab) => void;
  openCart: () => void;
  openWishlist: () => void;
  addToCart: (productId: string, variantId: string, quantity?: number) => void;
  updateQuantity: (productId: string, variantId: string, quantity: number) => void;
  removeFromCart: (productId: string, variantId: string) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  cartCount: number;
  cartSubtotal: number;
}

const StoreContext = createContext<StoreContextValue | null>(null);

const CART_STORAGE_KEY = 'aureon_cart_v1';
const WISHLIST_STORAGE_KEY = 'aureon_wishlist_v1';

function parseHash(): { route: PageRoute; slug: string } {
  const hash = window.location.hash.replace(/^#\/?/, '');
  if (!hash || hash === 'home') return { route: 'home', slug: 'aureon-x1' };
  if (hash === 'products') return { route: 'products', slug: 'aureon-x1' };
  if (hash.startsWith('products/')) {
    const slug = hash.slice('products/'.length);
    const exists = PRODUCTS.some((p) => p.slug === slug);
    return { route: 'product-detail', slug: exists ? slug : 'aureon-x1' };
  }
  if (hash === 'technology') return { route: 'technology', slug: 'aureon-x1' };
  if (hash === 'about') return { route: 'about', slug: 'aureon-x1' };
  if (hash === 'contact') return { route: 'contact', slug: 'aureon-x1' };
  return { route: 'home', slug: 'aureon-x1' };
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const initial = parseHash();
  const [route, setRoute] = useState<PageRoute>(initial.route);
  const [productSlug, setProductSlug] = useState<string>(initial.slug);

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore storage errors
    }
    return [];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore storage errors
    }
    return [];
  });

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerTab, setDrawerTab] = useState<DrawerTab>('bag');

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    } catch {
      // ignore
    }
  }, [wishlist]);

  // Sync SEO title and description per page
  useEffect(() => {
    const titles: Record<PageRoute, string> = {
      home: 'AUREON — Experience Sound Beyond Limits',
      products: 'AUREON Collection — Luxury Wireless & Studio Headphones',
      'product-detail': `${PRODUCTS.find((p) => p.slug === productSlug)?.name || 'AUREON'} — Acoustic Atelier`,
      technology: 'AUREON Technology — Beryllium Drivers, Neural ANC & Spatial Audio',
      about: 'About AUREON — Acoustic Engineering Philosophy & Craft',
      contact: 'Contact AUREON — Private Concierge & Acoustic Support',
    };
    document.title = titles[route];
  }, [route, productSlug]);

  useEffect(() => {
    const onHashChange = () => {
      const next = parseHash();
      setRoute(next.route);
      setProductSlug(next.slug);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigate = useCallback((nextRoute: PageRoute, slug?: string) => {
    const targetSlug = slug || 'aureon-x1';
    setRoute(nextRoute);
    if (slug) setProductSlug(targetSlug);

    const nextHash =
      nextRoute === 'home'
        ? '#/'
        : nextRoute === 'product-detail'
          ? `#/products/${targetSlug}`
          : `#/${nextRoute}`;
    if (window.location.hash !== nextHash) {
      window.location.hash = nextHash;
    }
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  const addToCart = useCallback((productId: string, variantId: string, quantity = 1) => {
    setCart((prev) => {
      const idx = prev.findIndex(
        (item) => item.productId === productId && item.variantId === variantId
      );
      if (idx > -1) {
        const updated = [...prev];
        updated[idx] = {
          ...updated[idx],
          quantity: Math.min(10, updated[idx].quantity + quantity),
        };
        return updated;
      }
      return [...prev, { productId, variantId, quantity: Math.min(10, Math.max(1, quantity)) }];
    });
    setDrawerTab('bag');
    setDrawerOpen(true);
  }, []);

  const updateQuantity = useCallback(
    (productId: string, variantId: string, quantity: number) => {
      if (quantity <= 0) {
        setCart((prev) =>
          prev.filter((i) => !(i.productId === productId && i.variantId === variantId))
        );
        return;
      }
      setCart((prev) =>
        prev.map((item) =>
          item.productId === productId && item.variantId === variantId
            ? { ...item, quantity: Math.min(10, quantity) }
            : item
        )
      );
    },
    []
  );

  const removeFromCart = useCallback((productId: string, variantId: string) => {
    setCart((prev) =>
      prev.filter((i) => !(i.productId === productId && i.variantId === variantId))
    );
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const toggleWishlist = useCallback((productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  }, []);

  const isWishlisted = useCallback(
    (productId: string) => wishlist.includes(productId),
    [wishlist]
  );

  const openCart = useCallback(() => {
    setDrawerTab('bag');
    setDrawerOpen(true);
  }, []);

  const openWishlist = useCallback(() => {
    setDrawerTab('wishlist');
    setDrawerOpen(true);
  }, []);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => {
    const product = PRODUCTS.find((p) => p.id === item.productId);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  return (
    <StoreContext.Provider
      value={{
        route,
        productSlug,
        navigate,
        cart,
        wishlist,
        drawerOpen,
        drawerTab,
        setDrawerOpen,
        setDrawerTab,
        openCart,
        openWishlist,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        toggleWishlist,
        isWishlisted,
        cartCount,
        cartSubtotal,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside StoreProvider');
  return ctx;
}

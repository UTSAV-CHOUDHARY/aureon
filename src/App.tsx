/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AnimatePresence, motion } from 'motion/react';
import { StoreProvider, useStore } from './context/StoreContext';
import { CustomCursor } from './components/CustomCursor';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { TechnologyPage } from './pages/TechnologyPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';

function PageView() {
  const { route, productSlug } = useStore();

  const viewKey = route === 'product-detail' ? `${route}-${productSlug}` : route;

  return (
    <AnimatePresence mode="wait">
      <motion.main
        key={viewKey}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      >
        {route === 'home' && <HomePage />}
        {route === 'products' && <ProductsPage />}
        {route === 'product-detail' && <ProductDetailPage />}
        {route === 'technology' && <TechnologyPage />}
        {route === 'about' && <AboutPage />}
        {route === 'contact' && <ContactPage />}
      </motion.main>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <div className="min-h-screen bg-[#F7F6F0] text-[#11291F] flex flex-col justify-between">
        <CustomCursor />
        <Header />
        <div className="flex-1">
          <PageView />
        </div>
        <Footer />
        <CartDrawer />
      </div>
    </StoreProvider>
  );
}

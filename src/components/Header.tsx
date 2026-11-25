import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { PageRoute } from '../types';
import { MagneticButton } from './MagneticButton';

const NAV_ITEMS: { label: string; route: PageRoute }[] = [
  { label: 'Home', route: 'home' },
  { label: 'Products', route: 'products' },
  { label: 'Technology', route: 'technology' },
  { label: 'About', route: 'about' },
  { label: 'Contact', route: 'contact' },
];

export function Header() {
  const { route, navigate, cartCount, openCart } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (target: PageRoute) => {
    setMobileMenuOpen(false);
    navigate(target);
  };

  return (
    <header className="fixed top-3 inset-x-0 z-50 px-4 lg:px-8">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-8 rounded-xl border border-[#11291F]/10 bg-white/92 px-6 shadow-[0_6px_28px_rgba(17,41,31,0.06)]">
        {/* Zone 1: Single text element Brand Wordmark */}
        <a
          href="#/"
          onClick={(e) => {
            e.preventDefault();
            handleNav('home');
          }}
          className="font-display text-xl font-semibold tracking-[0.22em] text-[#11291F] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#C49B4B]"
        >
          AUREON
        </a>

        {/* Zone 2: Clean single-line text navigation links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex items-center gap-8 text-xs font-medium tracking-[0.14em] uppercase text-[#11291F]/70"
        >
          {NAV_ITEMS.map((item) => {
            const active =
              route === item.route ||
              (item.route === 'products' && route === 'product-detail');
            return (
              <a
                key={item.route}
                href={`#/${item.route === 'home' ? '' : item.route}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNav(item.route);
                }}
                className={`relative py-1 whitespace-nowrap shrink-0 transition-colors duration-200 ${
                  active ? 'text-[#11291F] font-semibold' : 'hover:text-[#11291F]'
                }`}
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-0 -bottom-0.5 h-[1.5px] bg-[#C49B4B] transition-transform duration-200 origin-left ${
                    active ? 'scale-x-100' : 'scale-x-0'
                  }`}
                />
              </a>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action (+ compact mobile menu toggle) */}
        <div className="flex items-center gap-3 shrink-0">
          <MagneticButton
            onClick={openCart}
            className="rounded-lg bg-[#122B21] px-4 py-2.5 text-[11px] font-semibold tracking-[0.14em] uppercase text-[#DFBE74] hover:bg-[#1B4332] transition-colors duration-200 tabular-nums"
          >
            Bag ({cartCount})
          </MagneticButton>

          <button
            type="button"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#11291F]/15 text-[#11291F] hover:bg-[#11291F]/5 md:hidden"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <nav
          aria-label="Mobile Navigation"
          className="mx-auto mt-2 max-w-[1400px] rounded-xl border border-[#11291F]/10 bg-white px-4 py-3 shadow-lg md:hidden"
        >
          <div className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const active =
                route === item.route ||
                (item.route === 'products' && route === 'product-detail');
              return (
                <a
                  key={item.route}
                  href={`#/${item.route === 'home' ? '' : item.route}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNav(item.route);
                  }}
                  className={`flex min-h-[44px] items-center rounded-lg px-3 text-xs font-semibold tracking-[0.12em] uppercase transition-colors ${
                    active
                      ? 'bg-[#122B21] text-[#DFBE74]'
                      : 'text-[#11291F] hover:bg-[#F7F6F0]'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
}

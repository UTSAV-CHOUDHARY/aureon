import { useStore } from '../context/StoreContext';

export function Footer() {
  const { navigate, openWishlist } = useStore();

  return (
    <footer className="border-t border-[#11291F]/10 bg-[#0B2017] text-[#F7F6F0]">
      <div className="mx-auto max-w-[1440px] px-6 py-16 lg:px-10">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          <div className="md:col-span-5 space-y-4">
            <div className="font-display text-xl font-semibold tracking-[0.22em] text-white">
              AUREON
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-[#F7F6F0]/75">
              Experience Sound Beyond Limits. Bespoke acoustic instruments, hybrid kinetic
              timepieces, and spatial audio spheres crafted in Geneva and Zurich.
            </p>
          </div>

          <div className="md:col-span-2 space-y-3">
            <div className="text-xs font-semibold tracking-[0.14em] uppercase text-[#DFBE74]">
              Collection
            </div>
            <ul className="space-y-2.5 text-sm text-[#F7F6F0]/75">
              <li>
                <button
                  type="button"
                  onClick={() => navigate('product-detail', 'aureon-x1')}
                  className="hover:text-white transition-colors"
                >
                  Sovereign One (X1)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('product-detail', 'aureon-chronos-watch')}
                  className="hover:text-white transition-colors"
                >
                  Chronos Watch
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('product-detail', 'aureon-audio-sphere')}
                  className="hover:text-white transition-colors"
                >
                  Audio Sphere
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('product-detail', 'aureon-pro-studio')}
                  className="hover:text-white transition-colors"
                >
                  Pro Studio
                </button>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2 space-y-3">
            <div className="text-xs font-semibold tracking-[0.14em] uppercase text-[#DFBE74]">
              Atelier
            </div>
            <ul className="space-y-2.5 text-sm text-[#F7F6F0]/75">
              <li>
                <button
                  type="button"
                  onClick={() => navigate('technology')}
                  className="hover:text-white transition-colors"
                >
                  Technology
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('about')}
                  className="hover:text-white transition-colors"
                >
                  Philosophy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={openWishlist}
                  className="hover:text-white transition-colors"
                >
                  Saved Wishlist
                </button>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-3">
            <div className="text-xs font-semibold tracking-[0.14em] uppercase text-[#DFBE74]">
              Concierge
            </div>
            <ul className="space-y-2.5 text-sm text-[#F7F6F0]/75">
              <li>Rue du Rhône 42, 1204 Geneva</li>
              <li>concierge@aureon-audio.example</li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('contact')}
                  className="text-[#DFBE74] hover:text-white transition-colors font-medium"
                >
                  Schedule Private Listening
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-8 text-xs text-[#F7F6F0]/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} AUREON Atelier SA. All rights reserved.</p>
          <p>Demo E-Commerce Showcase · No live payment cards are processed.</p>
        </div>
      </div>
    </footer>
  );
}

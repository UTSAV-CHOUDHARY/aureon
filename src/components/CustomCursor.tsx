import { useEffect, useRef, useState } from 'react';

export function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [hoveringInteractive, setHoveringInteractive] = useState(false);
  const [hoveringCanvas, setHoveringCanvas] = useState(false);

  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!finePointer || reducedMotion) return;

    setEnabled(true);
    document.body.classList.add('custom-cursor-active');

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let rafId = 0;

    const onMove = (e: PointerEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }

      const target = e.target as HTMLElement | null;
      if (target) {
        const isInteractive = Boolean(
          target.closest('button, a, input, select, textarea, [data-cursor="interactive"]')
        );
        const isCanvas = Boolean(target.closest('canvas, [data-cursor="3d"]'));
        setHoveringInteractive(isInteractive);
        setHoveringCanvas(isCanvas && !isInteractive);
      }
    };

    const animate = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      }
      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    rafId = requestAnimationFrame(animate);

    return () => {
      document.body.classList.remove('custom-cursor-active');
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999]" aria-hidden="true">
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 -ml-5 -mt-5 h-10 w-10 rounded-full border transition-[width,height,margin,border-color,background-color] duration-200 ease-out will-change-transform ${
          hoveringInteractive
            ? '-ml-7 -mt-7 h-14 w-14 border-[#C49B4B] bg-[#C49B4B]/12'
            : hoveringCanvas
              ? '-ml-6 -mt-6 h-12 w-12 border-[#DFBE74] bg-[#C49B4B]/8'
              : 'border-[#11291F]/35'
        }`}
      />
      <div
        ref={dotRef}
        className={`fixed top-0 left-0 -ml-1 -mt-1 h-2 w-2 rounded-full transition-colors duration-150 will-change-transform ${
          hoveringInteractive || hoveringCanvas ? 'bg-[#C49B4B]' : 'bg-[#11291F]'
        }`}
      />
    </div>
  );
}

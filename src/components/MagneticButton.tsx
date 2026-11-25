import React, { useRef, useState } from 'react';

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}

export function MagneticButton({
  children,
  strength = 0.28,
  className = '',
  onClick,
  type = 'button',
  ...rest
}: MagneticButtonProps) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.pointerType !== 'mouse') return;
    const el = btnRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    setOffset({ x: relX * strength, y: relY * strength });
  };

  const handlePointerLeave = () => {
    setOffset({ x: 0, y: 0 });
  };

  return (
    <button
      ref={btnRef}
      type={type}
      onClick={onClick}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{
        transform: `translate3d(${offset.x.toFixed(1)}px, ${offset.y.toFixed(1)}px, 0)`,
        transition:
          offset.x === 0 && offset.y === 0
            ? 'transform 380ms cubic-bezier(0.16, 1, 0.3, 1)'
            : 'transform 90ms linear',
      }}
      className={`whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C49B4B] ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

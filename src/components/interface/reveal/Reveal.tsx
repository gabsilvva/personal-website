'use client';

import { useEffect, useRef, useState, type ReactNode } from "react";

type Direction = 'up' | 'down' | 'left' | 'right' | 'none';

type Props = {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  duration?: number;
  distance?: number;
  className?: string;
  once?: boolean;
};

const TRANSLATE_MAP: Record<Direction, (distance: number) => string> = {
  up: (d) => `translateY(${d}px)`,
  down: (d) => `translateY(-${d}px)`,
  left: (d) => `translateX(${d}px)`,
  right: (d) => `translateX(-${d}px)`,
  none: () => 'none',
};

export default function Reveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 600,
  distance = 24,
  className = '',
  once = true,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      const timer = setTimeout(() => setVisible(true), 0);
      return () => clearTimeout(timer);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        // elementos mais altos que a viewport (ex.: lista de cards em 1 coluna
        // no mobile) nunca chegam a 15% visíveis — nesse caso basta ocupar
        // parte relevante da tela
        const rootHeight = entry.rootBounds?.height ?? window.innerHeight;
        const inView = entry.isIntersecting && (
          entry.intersectionRatio >= 0.15 ||
          entry.intersectionRect.height >= rootHeight * 0.25
        );

        if (inView) {
          setVisible(true);
          if (once) observer.disconnect();
        } else if (!once && !entry.isIntersecting) {
          setVisible(false);
        }
      },
      { threshold: [0, 0.01, 0.05, 0.1, 0.15], rootMargin: '0px 0px -10% 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [once]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : TRANSLATE_MAP[direction](distance),
        transition: `opacity ${duration}ms ease-out ${delay}ms, transform ${duration}ms ease-out ${delay}ms`,
        willChange: visible ? 'auto' : 'opacity, transform',
      }}
    >
      {children}
    </div>
  );
}
import React, { useMemo } from 'react';

interface FloatingFestiveConfettiProps {
  enabled: boolean;
}

interface Particle {
  id: number;
  left: number; // percentage 0-100
  top: number; // percentage 0-100
  size: number;
  color: string;
  shape: 'circle' | 'rect' | 'star' | 'crescent';
  duration: number;
  delay: number;
  opacity: number;
}

export const FloatingFestiveConfetti: React.FC<FloatingFestiveConfettiProps> = ({ enabled }) => {
  if (!enabled) return null;

  const particles: Particle[] = useMemo(() => {
    const colors = [
      '#006233', // Mauritanian Green
      '#FFD100', // Gold / Yellow
      '#D0103A', // Crimson Red
      '#FDFBF7', // Off-white
      '#10B981', // Emerald glow
      '#F59E0B', // Amber
    ];

    const shapes: ('circle' | 'rect' | 'star' | 'crescent')[] = ['circle', 'rect', 'star', 'crescent'];

    return Array.from({ length: 36 }).map((_, i) => ({
      id: i,
      left: Math.floor(Math.random() * 96) + 2,
      top: Math.floor(Math.random() * 95) + 2,
      size: Math.floor(Math.random() * 8) + 4,
      color: colors[i % colors.length],
      shape: shapes[i % shapes.length],
      duration: Math.floor(Math.random() * 8) + 6,
      delay: Math.floor(Math.random() * 5),
      opacity: Math.random() * 0.45 + 0.25,
    }));
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {particles.map((p) => {
        return (
          <div
            key={p.id}
            className="absolute animate-pulse transition-all"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              opacity: p.opacity,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
            }}
          >
            {p.shape === 'circle' && (
              <div
                className="w-full h-full rounded-full shadow-xs"
                style={{ backgroundColor: p.color }}
              />
            )}
            {p.shape === 'rect' && (
              <div
                className="w-full h-full rounded-xs rotate-45 transform"
                style={{ backgroundColor: p.color }}
              />
            )}
            {p.shape === 'star' && (
              <svg viewBox="0 0 24 24" className="w-full h-full" fill={p.color}>
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            )}
            {p.shape === 'crescent' && (
              <svg viewBox="0 0 24 24" className="w-full h-full" fill={p.color}>
                <path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-5.4-5.4c0-1.81.89-3.41 2.26-4.4A8.8 8.8 0 0 0 12 3z" />
              </svg>
            )}
          </div>
        );
      })}
    </div>
  );
};

'use client';

import { useEffect, useState } from 'react';

export default function DevDesignOverlay() {
  // Only show in development
  if (process.env.NODE_ENV === 'production') return null;

  const [visible, setVisible] = useState(false);
  const [opacity, setOpacity] = useState(0.4);
  const [imgSrc, setImgSrc] = useState('/design-overlays/Homepage.png');
  const [artboardWidth, setArtboardWidth] = useState(1920); // matches 1x export
  const [offsetY, setOffsetY] = useState(0); // vertical nudge in px

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Toggle with Ctrl/Cmd+O
      if ((e.key.toLowerCase() === 'o') && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setVisible(v => !v);
        return;
      }

      // Adjust opacity with [ and ]
      if (e.key === '[') {
        e.preventDefault();
        setOpacity(o => Math.max(0, +(o - 0.1).toFixed(2)));
      }
      if (e.key === ']') {
        e.preventDefault();
        setOpacity(o => Math.min(1, +(o + 0.1).toFixed(2)));
      }

      // Choose 1x (1920) or 2x (3840)
      if (e.key === '1') {
        setImgSrc('/design-overlays/Homepage.png');
        setArtboardWidth(1920);
      }
      if (e.key === '2') {
        setImgSrc('/design-overlays/Homepage-2x.png');
        setArtboardWidth(3840);
      }

      // Fine vertical nudging
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setOffsetY(y => y - 5);
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setOffsetY(y => y + 5);
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  if (!visible) return null;

  return (
    <img
      src={imgSrc}
      alt="Design overlay"
      style={{
        position: 'absolute',
        top: `${offsetY}px`,
        left: '50%',
        transform: 'translateX(-50%)',
        width: `${artboardWidth}px`,
        maxWidth: '100vw',
        height: 'auto',
        opacity,
        pointerEvents: 'none',
        zIndex: 2147483647,
      }}
    />
  );
}


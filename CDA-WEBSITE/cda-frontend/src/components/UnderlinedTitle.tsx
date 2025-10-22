'use client';
import { useRef, useEffect, useState } from 'react';

interface UnderlinedTitleProps {
  children: React.ReactNode;
  className?: string;
  size?: 'h1' | 'h2';
  underlineColor?: string;
  curveIntensity?: number;
  underlineOffset?: number;
}

export default function UnderlinedTitle({
  children,
  className = '',
  size = 'h1',
  underlineColor = '#FF60DF',
  curveIntensity = 0.01,
  underlineOffset = -40
}: UnderlinedTitleProps) {
  const textRef = useRef<HTMLSpanElement>(null);
  const [lines, setLines] = useState<Array<{ width: number; top: number; left: number }>>([]);

  // Responsive stroke widths based on size and screen
  const getStrokeWidth = () => {
    if (typeof window === 'undefined') return size === 'h1' ? 11 : 9;

    const isMobile = window.innerWidth < 1024;

    if (size === 'h1') {
      return isMobile ? 9 : 11;  // Desktop H1: 11px, Mobile H1: 9px
    } else {
      return isMobile ? 7 : 9;   // Desktop H2: 9px, Mobile H2: 7px
    }
  };

  const [strokeWidth, setStrokeWidth] = useState(getStrokeWidth());

  useEffect(() => {
    const calculateLines = () => {
      if (!textRef.current) return;

      const element = textRef.current;
      const range = document.createRange();
      const textNodes: Text[] = [];

      // Get all text nodes
      const walker = document.createTreeWalker(
        element,
        NodeFilter.SHOW_TEXT,
        null
      );

      let node;
      while ((node = walker.nextNode())) {
        if (node.textContent?.trim()) {
          textNodes.push(node as Text);
        }
      }

      if (textNodes.length === 0) return;

      // Group text into lines based on Y position
      const lineMap = new Map<number, { rects: DOMRect[], minLeft: number, maxRight: number }>();

      textNodes.forEach(textNode => {
        range.selectNodeContents(textNode);
        const rects = Array.from(range.getClientRects());

        rects.forEach(rect => {
          const roundedTop = Math.round(rect.top);

          if (!lineMap.has(roundedTop)) {
            lineMap.set(roundedTop, { rects: [], minLeft: rect.left, maxRight: rect.right });
          }

          const line = lineMap.get(roundedTop)!;
          line.rects.push(rect);
          line.minLeft = Math.min(line.minLeft, rect.left);
          line.maxRight = Math.max(line.maxRight, rect.right);
        });
      });

      // Convert to underline format
      const containerRect = element.getBoundingClientRect();
      const newLines = Array.from(lineMap.entries())
        .sort(([a], [b]) => a - b)
        .map(([top, data]) => ({
          width: data.maxRight - data.minLeft,
          top: top - containerRect.top,
          left: data.minLeft - containerRect.left
        }));

      setLines(newLines);
      setStrokeWidth(getStrokeWidth());
    };

    calculateLines();
    window.addEventListener('resize', calculateLines);

    return () => window.removeEventListener('resize', calculateLines);
  }, [children, size]);

  const generatePath = (width: number) => {
    const curveDepth = width * curveIntensity;
    const startY = curveDepth + strokeWidth;
    const controlY = strokeWidth;
    const endY = curveDepth + strokeWidth;
    return `M 0 ${startY} Q ${width / 2} ${controlY} ${width} ${endY}`;
  };

  return (
    <span className={`relative inline ${className}`} ref={textRef}>
      <span className="relative" style={{ zIndex: 10 }}>
        {children}
      </span>
      {lines.map((line, index) => {
        const svgHeight = Math.max(line.width * curveIntensity + strokeWidth * 2, strokeWidth * 2);

        return (
          <svg
            key={index}
            width={line.width}
            height={svgHeight}
            style={{
              position: 'absolute',
              left: `${line.left}px`,
              top: `${line.top}px`,
              transform: `translateY(${-underlineOffset}px)`,
              zIndex: 0
            }}
            preserveAspectRatio="none"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d={generatePath(line.width)}
              stroke={underlineColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        );
      })}
    </span>
  );
}

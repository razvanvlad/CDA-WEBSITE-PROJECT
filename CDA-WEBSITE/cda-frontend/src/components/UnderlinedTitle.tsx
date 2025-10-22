'use client';
import { useRef, useEffect, useState } from 'react';

interface UnderlinedTitleProps {
  children: React.ReactNode;
  className?: string;
  underlineColor?: string;
  size?: 'small' | 'medium' | 'large';
  strokeWidth?: number;
  curveIntensity?: number;
  underlineOffset?: number;
}

export default function UnderlinedTitle({
  children,
  className = '',
  underlineColor = '#FF60DF',
  size = 'large',
  strokeWidth,
  curveIntensity = 0.01,
  underlineOffset = -8
}: UnderlinedTitleProps) {
  const textRef = useRef<HTMLSpanElement>(null);
  const [textWidth, setTextWidth] = useState(0);

  // Stroke width presets based on text size
  const strokeSizes = {
    large: 11,   // for text-5xl (50px)
    medium: 9,   // for text-4xl (38px)
    small: 7     // for text-lg (18px)
  };
  const finalStrokeWidth = strokeWidth ?? strokeSizes[size];

  useEffect(() => {
    if (textRef.current) {
      setTextWidth(textRef.current.offsetWidth);
    }
  }, [children]);

  // Calculate curve path with proper dimensions
  const curveDepth = textWidth * curveIntensity;
  const svgHeight = Math.max(curveDepth + finalStrokeWidth * 2, finalStrokeWidth * 2);
  const startY = curveDepth + finalStrokeWidth;
  const controlY = finalStrokeWidth;
  const endY = curveDepth + finalStrokeWidth;
  const path = `M 0 ${startY} Q ${textWidth / 2} ${controlY} ${textWidth} ${endY}`;

  return (
    <span className={`relative inline-block ${className}`}>
      <span ref={textRef} className="relative z-10">
        {children}
      </span>
      {textWidth > 0 && (
        <svg
          width={textWidth}
          height={svgHeight}
          style={{
            position: 'absolute',
            bottom: `${underlineOffset}px`,
            left: 0
          }}
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d={path}
            stroke={underlineColor}
            strokeWidth={finalStrokeWidth}
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      )}
    </span>
  );
}

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
  centered?: boolean;
  as?: 'h0' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span' | 'div';
  compactUnderline?: boolean;
}

export default function UnderlinedTitle({
  children,
  className = '',
  underlineColor = '#FF5C8A',
  size = 'large',
  strokeWidth,
  curveIntensity = 0.005,
  underlineOffset = 48,
  centered = false,
  as: Component = 'h2',
  compactUnderline = false,
}: UnderlinedTitleProps) {
  // Convert h0 to div since h0 isn't a valid HTML element
  const ActualComponent = (Component === 'h0' ? 'div' : Component) as any;

  const containerRef = useRef<HTMLSpanElement>(null);
  const [words, setWords] = useState<{ text: string; width: number; left: number; top: number }[]>([]);

  const strokeSizes = {
    large: 11,
    medium: 9,
    small: 7
  };
  const finalStrokeWidth = strokeWidth ?? strokeSizes[size];

  useEffect(() => {
    if (!containerRef.current) return;

    const measureWords = () => {
      const container = containerRef.current;
      if (!container) return;

      // Get all word elements
      const wordElements = container.querySelectorAll('.word-measure');
      const wordsData: { text: string; width: number; left: number; top: number }[] = [];

      wordElements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        wordsData.push({
          text: element.textContent || '',
          width: rect.width,
          left: rect.left - containerRect.left,
          top: rect.top - containerRect.top,
        });
      });

      setWords(wordsData);
    };

    measureWords();

    const resizeObserver = new ResizeObserver(measureWords);
    resizeObserver.observe(containerRef.current);

    return () => resizeObserver.disconnect();
  }, [children]);

  // Group words by line (same top position)
  const lineGroups: { text: string; width: number; left: number; top: number }[][] = [];
  words.forEach((word) => {
    const existingLine = lineGroups.find(
      (line) => Math.abs(line[0].top - word.top) < 5
    );
    if (existingLine) {
      existingLine.push(word);
    } else {
      lineGroups.push([word]);
    }
  });

  // Calculate line dimensions (from first to last word in each line)
  const lines = lineGroups.map((lineWords) => {
    const firstWord = lineWords[0];
    const lastWord = lineWords[lineWords.length - 1];

    let width;
    if (compactUnderline) {
      // Compact mode: sum individual word widths with small gaps
      const totalWordWidth = lineWords.reduce((sum, word) => sum + word.width, 0);
      const gapWidth = 4; // Small gap between words in pixels
      const totalGaps = (lineWords.length - 1) * gapWidth;
      width = totalWordWidth + totalGaps;
    } else {
      // Default mode: full span from first to last word
      width = lastWord.left + lastWord.width - firstWord.left;
    }

    return {
      width,
      left: firstWord.left,
      top: firstWord.top,
    };
  });

  const renderUnderline = (lineWidth: number, lineLeft: number, lineTop: number, index: number) => {
    const curveDepth = lineWidth * curveIntensity;
    const svgHeight = Math.max(curveDepth + finalStrokeWidth * 2, finalStrokeWidth * 2);
    const startY = curveDepth + finalStrokeWidth;
    const controlY = finalStrokeWidth;
    const endY = curveDepth + finalStrokeWidth;
    const path = `M 0 ${startY} Q ${lineWidth / 2} ${controlY} ${lineWidth} ${endY}`;

    return (
      <svg
        key={index}
        width={lineWidth}
        height={svgHeight}
        style={{
          position: 'absolute',
          top: `${lineTop + underlineOffset}px`,
          left: centered ? '50%' : `${lineLeft}px`,
          transform: centered ? 'translateX(-50%)' : 'none',
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
    );
  };

  // Split text into words for measurement
  const renderText = () => {
    if (typeof children !== 'string') return children;

    const wordArray = children.split(' ');
    return wordArray.map((word, index) => (
      <span key={index}>
        <span className="word-measure">{word}</span>
        {index < wordArray.length - 1 && ' '}
      </span>
    ));
  };

  if (centered) {
    return (
      <ActualComponent className={`${className} flex justify-center text-center`}>
        <span ref={containerRef} className="relative inline-block">
          <span className="relative z-10">
            {renderText()}
          </span>
          {lines.map((line, index) =>
            renderUnderline(line.width, line.left, line.top, index)
          )}
        </span>
      </ActualComponent>
    );
  }

  return (
    <ActualComponent className={className}>
      <span ref={containerRef} className="relative inline-block">
        <span className="relative z-10">
          {renderText()}
        </span>
        {lines.map((line, index) =>
          renderUnderline(line.width, line.left, line.top, index)
        )}
      </span>
    </ActualComponent>
  );
}
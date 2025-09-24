'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';

const ApproachBlock = ({ globalData, pageData, useOverride = false }) => {
  const data = useOverride && pageData ? pageData : globalData;
  if (!data?.steps?.length) return null;

  const steps = useMemo(
    () => [...data.steps].sort((a, b) => (a.stepNumber || 0) - (b.stepNumber || 0)),
    [data]
  );

  const containerRef = useRef(null);
  const panelRefs = useRef([]);
  panelRefs.current = steps.map((_, i) => panelRefs.current[i] ?? React.createRef());

  const [pathD, setPathD] = useState('');
  const [svgBox, setSvgBox] = useState({ w: 0, h: 0 });

  // Build a smooth path through points
  const buildPath = (pts) => {
    if (pts.length < 2) return '';
    const tension = 0.35; // curve strength
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) {
      const p0 = pts[i - 1];
      const p1 = pts[i];
      const dx = p1.x - p0.x;
      // alternate vertical “wave” for a playful curve
      const wave = (i % 2 ? 120 : -120);
      const c1 = { x: p0.x + dx * tension, y: p0.y + wave };
      const c2 = { x: p1.x - dx * tension, y: p1.y + wave };
      d += ` C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${p1.x} ${p1.y}`;
    }
    return d;
  };

  // Measure panels and build path to *touch* them
  const measure = () => {
    const cont = containerRef.current;
    if (!cont) return;

    const cRect = cont.getBoundingClientRect();
    const points = panelRefs.current
      .map((r) => r.current?.getBoundingClientRect())
      .filter(Boolean)
      .map((rect, i) => {
        // anchor at bottom-center of the gray panel, a few px inside
        const x = rect.left + rect.width / 2 - cRect.left;
        const y = rect.bottom - cRect.top - 10; // 10px inside so it “touches” panel
        return { x, y };
      });

    setSvgBox({ w: cRect.width, h: cRect.height });
    setPathD(buildPath(points));
  };

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    // also re-measure on font/image load
    const t = setTimeout(measure, 100);
    window.addEventListener('resize', measure);
    return () => {
      window.removeEventListener('resize', measure);
      clearTimeout(t);
      ro.disconnect();
    };
  }, [steps.length]);

  // stagger on tablet to mimic reference
  const staggerClass = (i) => (i === 1 || i === 3 ? 'md:mt-20 lg:mt-24' : '');

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-12 md:mb-16">
          {data.subtitle && (
            <h2 className="cda-subtitle">
              {data.subtitle}
            </h2>
          )}
          {data.title && (
            <p className="cda-title">
              {data.title}
            </p>
          )}
          
        </div>

        {/* Canvas (path + cards) */}
        <div ref={containerRef} className="relative">
          {/* Dynamic dashed path (hidden on mobile for clarity) */}
          <svg
            className="pointer-events-none absolute inset-0 hidden md:block"
            width={svgBox.w}
            height={svgBox.h}
            viewBox={`0 0 ${svgBox.w} ${svgBox.h}`}
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d={pathD}
              fill="none"
              stroke="#59C3FF"
              strokeWidth="8"
              strokeDasharray="16 16"
              strokeLinecap="round"
            >
              <animate
                attributeName="stroke-dashoffset"
                from="64"
                to="0"
                dur="1.6s"
                repeatCount="indefinite"
              />
            </path>
          </svg>

          {/* Cards */}
          <ul className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-6">
            {steps.map((step, i) => (
              <li key={i} className={`flex flex-col ${staggerClass(i)} lg:mt-0`}>
                <div
                  ref={panelRefs.current[i]}
                  className="relative bg-gray-100 rounded-md w-full h-56 md:h-60 lg:h-64 flex items-end justify-center overflow-hidden"
                >
                  <div className="absolute top-3 left-3 text-gray-300 font-extrabold text-2xl select-none">
                    {String(step.stepNumber || i + 1).padStart(2, '0')}
                  </div>

                  {step?.image?.node?.sourceUrl && (
                    <Image
                      src={step.image.node.sourceUrl}
                      alt={step.image.node.altText || step.title || ''}
                      width={420}
                      height={320}
                      sizes="(min-width: 1024px) 260px, (min-width: 768px) 45vw, 90vw"
                      className="w-auto h-[78%] md:h-[82%] object-contain"
                      priority={i === 0}
                      onLoadingComplete={measure}
                    />
                  )}
                </div>

                {step.title && (
                  <h3 className="mt-4 text-lg md:text-xl font-extrabold text-gray-900">
                    {step.title}
                  </h3>
                )}
                {step.description && (
                  <p className="mt-1 text-gray-600 leading-relaxed hidden md:block">
                    {step.description}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Mobile vertical (no path) */}
        <div className="mt-10 md:hidden space-y-10">
          {steps.map((step, i) => (
            <div key={`m-${i}`} className="flex flex-col items-start">
              <div className="relative bg-gray-100 rounded-md w-full h-48 flex items-end justify-center">
                <div className="absolute top-3 left-3 text-gray-300 font-extrabold text-2xl">
                  {String(step.stepNumber || i + 1).padStart(2, '0')}
                </div>
                {step?.image?.node?.sourceUrl && (
                  <Image
                    src={step.image.node.sourceUrl}
                    alt={step.image.node.altText || step.title || ''}
                    width={360}
                    height={260}
                    sizes="90vw"
                    className="w-auto h-[76%] object-contain"
                  />
                )}
              </div>
              {step.title && (
                <h3 className="mt-3 text-xl font-extrabold text-gray-900">
                  {step.title}
                </h3>
              )}
              {step.description && (
                <p className="mt-1 text-gray-600">{step.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ApproachBlock;

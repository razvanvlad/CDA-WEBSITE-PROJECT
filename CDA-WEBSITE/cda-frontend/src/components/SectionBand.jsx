// src/components/SectionBand.jsx
import clsx from 'clsx';

function resolveStylePosition(position) {
  if (typeof position === 'number') return { top: position };
  if (typeof position === 'string') {
    if (position === 'top') return { top: 0 };
    if (position === 'bottom') return { bottom: 0 };
    if (position === 'center') return { top: '50%', transform: 'translateY(-50%)' };
    // e.g. '30%' or '120px'
    return { top: position };
  }
  return { top: 0 };
}

/**
 * Props
 * - color, height, position: defaults for all breakpoints
 * - padding: section padding (can be responsive Tailwind classes)
 * - mobile:  { color, height, position, className }    // overrides for < md
 * - desktop: { color, height, position, className }    // overrides for >= md
 */
export default function SectionBand({
  className = '',
  padding = 'py-20',
  color = 'bg-gray-100',
  height = 'h-[220px]',
  position = 'top',
  mobile,
  desktop,
  children,
}) {
  const m = mobile || {};
  const d = desktop || {};

  const baseMobileColor = m.color ?? color;
  const baseMobileHeight = m.height ?? height;
  const baseMobilePos = m.position ?? position;

  const baseDesktopColor = d.color ?? color;
  const baseDesktopHeight = d.height ?? height;
  const baseDesktopPos = d.position ?? position;

  return (
    <section className={clsx('relative overflow-visible', padding, className)}>
      {/* Mobile band */}
      <div
        className={clsx(
          'absolute left-0 right-0 md:hidden',
          baseMobileColor,
          baseMobileHeight,
          m.className
        )}
        style={resolveStylePosition(baseMobilePos)}
        aria-hidden="true"
      />
      {/* Desktop band */}
      <div
        className={clsx(
          'absolute left-0 right-0 hidden md:block',
          baseDesktopColor,
          baseDesktopHeight,
          d.className
        )}
        style={resolveStylePosition(baseDesktopPos)}
        aria-hidden="true"
      />
      {/* Content */}
      <div className="relative z-10">{children}</div>
    </section>
  );
}

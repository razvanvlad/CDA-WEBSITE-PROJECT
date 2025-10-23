'use client';

import Link from 'next/link';

/**
 * Reusable text-link button with icon and underline
 * @param {string} [href] - Link destination (omit for button element)
 * @param {React.ReactNode} children - Button text
 * @param {string} [className] - Additional CSS classes
 * @param {'default' | 'white'} [variant='default'] - Button style variant
 * @param {string} [target] - Link target (_self, _blank, etc.)
 * @param {boolean} [external] - Force use of <a> tag instead of Next Link
 * @param {Function} [onClick] - Click handler (for button elements)
 * @param {'button' | 'submit' | 'reset'} [type='button'] - Button type when using as button
 * @param {Object} props - Additional props passed to Link/a/button
 */
export default function TextLinkButton({
  href,
  children,
  className = '',
  variant = 'default',
  target,
  external = false,
  onClick,
  type = 'button',
  ...props
}) {
  const isWhite = variant === 'white';
  const baseClass = 'button-without-box';
  const variantClass = isWhite ? 'button-without-box-white' : '';
  const fullClass = `${baseClass} ${variantClass} ${className}`.trim();

  const content = (
    <>
      <span className="button-text">{children}</span>
      <img
        src="/images/arrow-icons/diagonal-right-arrow.svg"
        alt=""
        className="button-icon"
        aria-hidden="true"
      />
    </>
  );

  // If onClick is provided without href, render as button element
  if (onClick && !href) {
    return (
      <button onClick={onClick} className={fullClass} type={type} {...props}>
        {content}
      </button>
    );
  }

  // Use external link if target is _blank or external prop is true
  const isExternal = external || target === '_blank';

  if (isExternal) {
    return (
      <a href={href} className={fullClass} target={target} {...props}>
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={fullClass} {...props}>
      {content}
    </Link>
  );
}

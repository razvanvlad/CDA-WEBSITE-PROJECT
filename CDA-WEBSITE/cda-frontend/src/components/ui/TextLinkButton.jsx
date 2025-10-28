'use client';

import Link from 'next/link';

/**
 * @typedef {Object} TextLinkButtonProps
 * @property {string} [href] - Link destination (omit for button element)
 * @property {React.ReactNode} children - Button text
 * @property {string} [className] - Additional CSS classes
 * @property {'default' | 'white'} [variant='default'] - Button style variant
 * @property {string} [target] - Link target (_self, _blank, etc.)
 * @property {boolean} [external] - Force use of <a> tag instead of Next Link
 * @property {() => void} [onClick] - Click handler (for button elements)
 * @property {'button' | 'submit' | 'reset'} [type='button'] - Button type when using as button
 */

/**
 * Reusable text-link button with icon and underline
 * @param {TextLinkButtonProps} props
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

  // Determine icon paths based on variant
  const defaultIcon = isWhite
    ? '/images/arrow-icons/diagonal-right-arrow-white.svg'
    : '/images/arrow-icons/diagonal-right-arrow.svg';

  const hoverIcon = isWhite
    ? '/images/arrow-icons/right-arrow-white.svg'
    : '/images/arrow-icons/right-arrow.svg';

  const content = (
    <>
      <span className="button-text">{children}</span>
      <span className="button-icon-wrapper">
        <img
          src={defaultIcon}
          alt=""
          className="button-icon button-icon-default"
          aria-hidden="true"
        />
        <img
          src={hoverIcon}
          alt=""
          className="button-icon button-icon-hover"
          aria-hidden="true"
        />
      </span>
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
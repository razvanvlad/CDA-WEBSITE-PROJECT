import { isValidElement } from 'react'

const defaultContainerClassName = 'mx-auto w-full max-w-[1620px] px-[38px] md:px-6 lg:px-8'

const normalizeCtas = (ctas) => {
  if (!Array.isArray(ctas)) return []
  return ctas
    .map((cta, index) => {
      if (!cta) return null
      if (isValidElement(cta)) {
        return { key: `cta-node-${index}`, node: cta }
      }
      if (typeof cta === 'object') {
        const {
          href = '#',
          url,
          label,
          title,
          text,
          target,
          rel,
          className = 'button-l',
        } = cta
        const content = label || title || text
        if (!content) return null
        const finalTarget = target || '_self'
        const finalRel = rel || (finalTarget === '_blank' ? 'noopener noreferrer' : undefined)

        // Special handling for button-without-box: use real HTML elements
        if (className.includes('button-without-box')) {
          const isWhite = className.includes('white');
          const defaultIcon = '/images/arrow-icons/diagonal-right-arrow.svg';
          const hoverIcon = '/images/arrow-icons/right-arrow.svg';

          return {
            key: `cta-link-${index}`,
            node: (
              <a
                href={url || href}
                target={finalTarget}
                rel={finalRel}
                className={className}
              >
                <span className="button-text">{content}</span>
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
              </a>
            ),
          };
        }

        // Default button rendering
        return {
          key: `cta-link-${index}`,
          node: (
            <a
              href={url || href}
              target={finalTarget}
              rel={finalRel}
              className={className}
            >
              {content}
            </a>
          ),
        }
      }
      if (typeof cta === 'string') {
        return {
          key: `cta-string-${index}`,
          node: <span>{cta}</span>,
        }
      }
      return null
    })
    .filter(Boolean)
}

export default function HeroSection({
  sectionClassName = 'bg-white',
  containerClassName = defaultContainerClassName,
  eyebrow,
  eyebrowClassName = '',
  title,
  titleHtml,
  titleClassName = '',
  titleStyle,
  description,
  descriptionHtml,
  descriptionClassName = '',
  ctas = [],
  ctaWrapperClassName = '',
  image = null,
  imageWrapperClassName = '',
  id,
}) {
  const normalizedTitle = (() => {
    if (titleHtml) {
      return (
        <h1
          className={`cda-hero__title-text ${titleClassName}`.trim()}
          style={titleStyle}
          dangerouslySetInnerHTML={{ __html: titleHtml }}
        />
      )
    }
    if (isValidElement(title)) {
      return title
    }
    if (title) {
      return (
        <h1 className={`cda-hero__title-text ${titleClassName}`.trim()} style={titleStyle}>
          {title}
        </h1>
      )
    }
    return null
  })()

  const normalizedDescription = (() => {
    if (descriptionHtml) {
      return (
        <div
          className={`cda-hero__text-content ${descriptionClassName}`.trim()}
          dangerouslySetInnerHTML={{ __html: descriptionHtml }}
        />
      )
    }
    if (isValidElement(description)) {
      return (
        <div className={`cda-hero__text-content ${descriptionClassName}`.trim()}>
          {description}
        </div>
      )
    }
    if (description) {
      return (
        <p className={`cda-hero__text-content ${descriptionClassName}`.trim()}>
          {description}
        </p>
      )
    }
    return null
  })()

  const ctaItems = normalizeCtas(ctas)
  const imageNode = isValidElement(image) ? image : null

  return (
    <section className={`cda-hero ${sectionClassName}`.trim()} id={id}>
      <div className={`cda-hero__container ${containerClassName}`.trim()}>
        <div className="cda-hero__grid">
          {(eyebrow || normalizedTitle) && (
            <div className="cda-hero__title">
              {eyebrow && (
                <p className={`cda-hero__eyebrow ${eyebrowClassName}`.trim()}>{eyebrow}</p>
              )}
              {normalizedTitle}
            </div>
          )}

          {imageNode && (
            <div className={`cda-hero__image ${imageWrapperClassName}`.trim()}>
              {imageNode}
            </div>
          )}

          {normalizedDescription && (
            <div className="cda-hero__text">
              {normalizedDescription}
            </div>
          )}

          {ctaItems.length > 0 && (
            <div className={`cda-hero__cta ${ctaWrapperClassName}`.trim()}>
              {ctaItems.map((item) => (
                <span key={item.key} className="cda-hero__cta-item">
                  {item.node}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

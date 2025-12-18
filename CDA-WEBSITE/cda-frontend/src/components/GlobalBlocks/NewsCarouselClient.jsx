"use client";
import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";

// Badge component with SVG underline (matching Knowledge Hub)
function BadgeWithUnderline({ children, color }) {
  const textRef = useRef(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (textRef.current) {
      setWidth(textRef.current.offsetWidth);
    }
  }, [children]);

  const curveIntensity = 0.01;
  const strokeWidth = 5;
  const underlineOffset = 16;

  const curveDepth = width * curveIntensity;
  const svgHeight = Math.max(curveDepth + strokeWidth * 2, strokeWidth * 2);
  const startY = curveDepth + strokeWidth;
  const controlY = strokeWidth;
  const endY = curveDepth + strokeWidth;
  const path = `M 0 ${startY} Q ${width / 2} ${controlY} ${width} ${endY}`;

  return (
    <span className="news-card__badge-wrapper">
      <span ref={textRef} className="news-card__badge">
        {children}
      </span>
      {width > 0 && (
        <svg
          width={width}
          height={svgHeight}
          style={{
            position: 'absolute',
            top: `${underlineOffset}px`,
            left: 0,
          }}
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d={path}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      )}
    </span>
  );
}

export default function NewsCarouselClient({ title, subtitle, articles = [] }) {
  const listRef = useRef(null);

  const scroll = (dir) => {
    const el = listRef.current;
    if (!el) return;
    const firstCard = el.querySelector('.news-card');
    const cardWidth = firstCard ? firstCard.getBoundingClientRect().width : el.clientWidth * 0.86;
    const delta = dir === 'next' ? cardWidth + 16 : -(cardWidth + 16);
    el.scrollBy({ left: delta, behavior: 'smooth' });
  };

  const toHref = (uri) => {
    try {
      const parts = (uri || '').split('/').filter(Boolean);
      const slug = parts[parts.length - 1] || '';
      return slug ? `/news/${slug}` : (uri || '#');
    } catch {
      return uri || '#';
    }
  };

  // Rotating colors for underlines (matching Knowledge Hub)
  const colors = ['#3CBEEB', '#01E486', '#FD8721', '#FF60DF', '#AD80F9'];

  return (
    <section className="news-carousel-section">
      <div className="news-carousel-container">
        <div className="news-carousel-header">
          <div className="news-carousel-header-left">
            {subtitle && <p className="cda-subtitle">{subtitle}</p>}
            {title && <h2 className="cda-title">{title}</h2>}
          </div>
          <a href="/news" className="news-carousel-all">All News</a>
        </div>

        {(articles.length || 0) > 0 ? (
          <>
            <div ref={listRef} className="news-carousel-list">
              {articles.map((post, index) => {
                const imageUrl = post.imageUrl || '/images/placeholder.jpg';
                const underlineColor = colors[index % colors.length];

                return (
                  <a href={toHref(post.uri)} key={post.id || post.uri}>
                    <article className="news-card">
                      {/* Image wrapper with overlay */}
                      <div className="news-card__image-wrapper">
                        <Image
                          src={imageUrl}
                          alt={post.imageAlt || post.title}
                          fill
                          className="news-card__image"
                        />
                        <div className="news-card__overlay"></div>
                      </div>

                      {/* Top section: Badge and Date */}
                      <div className="news-card__top news-card__top--spread">
                        <BadgeWithUnderline color={underlineColor}>
                          News
                        </BadgeWithUnderline>
                        {post.date && (
                          <time className="news-card__date">
                            {new Date(post.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </time>
                        )}
                      </div>

                      {/* Bottom section: Title */}
                      <div className="news-card__bottom news-card__bottom--center">
                        <h3
                          className="news-card__title"
                          dangerouslySetInnerHTML={{ __html: post.title }}
                        />
                      </div>
                    </article>
                  </a>
                );
              })}
            </div>
            <div className="news-carousel-nav">
              <button type="button" className="news-carousel-nav-btn prev" onClick={() => scroll('prev')} aria-label="Previous">
                ←
              </button>
              <button type="button" className="news-carousel-nav-btn next" onClick={() => scroll('next')} aria-label="Next">
                →
              </button>
            </div>
          </>
        ) : (
          <div className="news-carousel-placeholder">
            <p>No articles found. Add posts in WordPress or adjust the News Carousel settings.</p>
          </div>
        )}
      </div>
    </section>
  );
}


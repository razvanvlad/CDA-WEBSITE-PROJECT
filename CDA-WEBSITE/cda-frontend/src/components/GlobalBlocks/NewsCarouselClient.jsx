"use client";
import React, { useRef } from "react";

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
      return slug ? `/news-article/${slug}` : (uri || '#');
    } catch {
      return uri || '#';
    }
  };

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
              {articles.map((post) => (
                <article key={post.id || post.uri} className="news-card">
                  {post.imageUrl ? (
                    <a href={toHref(post.uri)} className="news-card-image" aria-label={post.title}>
                      <img src={post.imageUrl} alt={post.imageAlt || post.title} />
                    </a>
                  ) : null}
                  <div className="news-card-content">
                    <h3 className="news-card-title" dangerouslySetInnerHTML={{ __html: post.title }} />
                    {post.excerpt && (
                      <div className="news-card-excerpt" dangerouslySetInnerHTML={{ __html: post.excerpt }} />
                    )}
                    <a href={toHref(post.uri)} className="news-card-link">Read more →</a>
                  </div>
                </article>
              ))}
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


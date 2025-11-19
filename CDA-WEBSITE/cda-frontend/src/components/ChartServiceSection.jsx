import Link from 'next/link';

export default function ChartServiceSection() {
  return (
    <section className="solutions-section">
      <div className="container mx-auto px-4" style={{ maxWidth: '1620px' }}>
        <div className="solutions-grid">
          {/* Left Column: List of Benefits */}
          <div className="solutions-grid__left">
            <ul className="solutions-list">
              <li className="solutions-item">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="solutions-icon">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="solutions-text">Fast, Flexible Builds</span>
              </li>
              <li className="solutions-item">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="solutions-icon">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="solutions-text">Built Around Your Business,<br />Not The Other Way Around</span>
              </li>
              <li className="solutions-item">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="solutions-icon">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="solutions-text">Designed To Grow With You</span>
              </li>
              <li className="solutions-item">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="solutions-icon">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="solutions-text">Human-First Design</span>
              </li>
            </ul>
          </div>

          {/* Right Column: White Content Card */}
          <div className="solutions-grid__right">
            <div className="solutions-card">
              <h2 className="solutions-card__title">
                Ecommerce Solutions That Drive Growth & Simplify Selling
              </h2>
              <p className="solutions-card__description">
                We're an expert eCommerce solutions provider with a proven track record in creating high-performing digital storefronts that turn users into loyal customers. We've been clients ourselves, working in senior eCommerce roles in the corporate world, so we know exactly what it takes to boost conversions, reduce bounce rates, and increase average order values. Our goal? To make your online store work smarter, not harder, so you can focus on growing your business.
              </p>
              <Link href="#contact-form" className="button-l">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

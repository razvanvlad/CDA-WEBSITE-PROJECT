import Image from 'next/image';
import Link from 'next/link';
import ResponsiveUnderlinedTitle from './ResponsiveUnderlinedTitle';

export default function ChartServiceSection() {
  return (
    <section className="stats-content-section py-16">
      <div className="cda-hero__container">
        <div className="stats-content-grid">
          {/* Left Column: Chart Image */}
          <div className="stats-content-grid__image">
            <Image
              src="/images/services/stats-chart-placeholder.svg"
              alt="Growing ecommerce statistics chart"
              width={600}
              height={500}
              className="stats-chart-image"
            />
          </div>

          {/* Right Column: Content */}
          <div className="stats-content-grid__content">
            <ResponsiveUnderlinedTitle
              as="h2"
              className="cda-title"
              underlineColor="#3CBEEB"
            >
              Seamless, Scalable, & Stress-Free Ecommerce
            </ResponsiveUnderlinedTitle>

            <p className="stats-content-description">
              Transform your online business with our comprehensive ecommerce solutions.
              We combine cutting-edge technology with proven strategies to deliver
              exceptional results for your digital storefront.
            </p>

            <Link href="#contact-form" className="button-l stats-content-cta">
              Get Started
            </Link>

            <div className="stats-content-platforms">
              <h3 className="stats-content-platforms__title">
                We're platform-agnostic. Our developers will introduce our eCommerce system—or work with yours when safeguarding value:
              </h3>

              <ul className="stats-content-platforms__list">
                <li className="stats-content-platforms__item">
                  <span className="stats-bullet"></span>
                  <span>Omni & full-store providers in respective operations</span>
                </li>
                <li className="stats-content-platforms__item">
                  <span className="stats-bullet"></span>
                  <span>Local specialists integrating ecosystem & brands for optimal performance</span>
                </li>
                <li className="stats-content-platforms__item">
                  <span className="stats-bullet"></span>
                  <span>Social media channels such as Meta and TikTok</span>
                </li>
                <li className="stats-content-platforms__item">
                  <span className="stats-bullet"></span>
                  <span>Select clean UIs and integrating tools</span>
                </li>
                <li className="stats-content-platforms__item">
                  <span className="stats-bullet"></span>
                  <span>Payment gateways and inventory management systems</span>
                </li>
                <li className="stats-content-platforms__item">
                  <span className="stats-bullet"></span>
                  <span>Marketing automation and customer relationship platforms</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Decorative curved line - desktop only */}
          <svg className="stats-content-decoration" viewBox="0 0 200 300" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M 200 0 Q 100 75, 150 150 T 200 300"
              stroke="#3CBEEB"
              strokeWidth="2"
              strokeDasharray="5,5"
              fill="none"
              opacity="0.25"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}

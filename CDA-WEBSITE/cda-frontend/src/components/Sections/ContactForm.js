import React from 'react';

export default function ContactForm({ onSubmit }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(new FormData(e.currentTarget));
  };

  return (
    <section className="contact-section">
      <div className="contact-container">
        {/* Left: Form */}
        <div className="contact-content">
          <div className="contact-header">
            <div className="contact-subtitle">Send us a</div>
            <h2 className="contact-title">Message</h2>
          </div>

          <form onSubmit={handleSubmit} className="contact-form" aria-label="Contact form">
            <div className="contact-grid">
              <div className="contact-input-wrap">
                <input
                  className="contact-input"
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  autoComplete="given-name"
                  required
                />
              </div>
              <div className="contact-input-wrap">
                <input
                  className="contact-input"
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  autoComplete="family-name"
                  required
                />
              </div>
              <div className="contact-input-wrap">
                <input
                  className="contact-input"
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  autoComplete="email"
                  required
                />
              </div>
              <div className="contact-input-wrap">
                <input
                  className="contact-input"
                  type="tel"
                  name="telephone"
                  placeholder="Telephone Number"
                  autoComplete="tel"
                />
              </div>
            </div>

            <div className="contact-input-wrap">
              <textarea
                className="contact-textarea"
                name="message"
                placeholder="Message"
                rows={6}
                required
              />
            </div>

            <div className="contact-input-wrap">
              <select className="contact-select" name="reason" defaultValue="">
                <option value="" disabled>
                  Reason
                </option>
                <option value="general">General Enquiry</option>
                <option value="quote">Request a Quote</option>
                <option value="support">Support</option>
                <option value="partnership">Partnership</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="contact-actions">
              <button type="submit" className="button-l">Submit</button>
            </div>
          </form>
        </div>

        {/* Right: Illustration */}
        <div className="contact-illustration">
          <img
            className="contact-illustration-img"
            src="/images/Component 119 – 1.svg"
            alt="Illustration"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}


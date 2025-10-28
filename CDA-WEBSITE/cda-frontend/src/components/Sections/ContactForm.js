'use client';
import React from 'react';
export default function ContactForm({ onSubmit }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(new FormData(e.currentTarget));
  };

  return (
    <form onSubmit={handleSubmit} className="contact-form" aria-label="Contact form">
      {/* Row 1: First Name, Last Name, Email Address */}
      <div className="contact-row-1">
        <div className="contact-input-wrap">
          <input
            className="contact-input contact-input-310"
            type="text"
            name="firstName"
            placeholder="First Name*"
            autoComplete="given-name"
            required
          />
        </div>
        <div className="contact-input-wrap">
          <input
            className="contact-input contact-input-310"
            type="text"
            name="lastName"
            placeholder="Last Name*"
            autoComplete="family-name"
            required
          />
        </div>
        <div className="contact-input-wrap">
          <input
            className="contact-input contact-input-310"
            type="email"
            name="email"
            placeholder="Email Address*"
            autoComplete="email"
            required
          />
        </div>
      </div>

      {/* Row 2: Telephone Number, Reason dropdown */}
      <div className="contact-row-2">
        <div className="contact-input-wrap">
          <input
            className="contact-input contact-input-475"
            type="tel"
            name="telephone"
            placeholder="Telephone Number*"
            autoComplete="tel"
            required
          />
        </div>
        <div className="contact-input-wrap">
          <select className="contact-select contact-input-475" name="reason" defaultValue="">
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
      </div>

      {/* Row 3: Message */}
      <div className="contact-message-row">
        <div className="contact-input-wrap">
          <textarea
            className="contact-textarea contact-input-full"
            name="message"
            placeholder="Message*"
            rows={6}
            required
          />
        </div>
      </div>

      {/* Combined Terms + Submit Row */}
      <div className="contact-terms-submit-row">
        <div className="contact-terms-left">
          <input type="checkbox" id="contact-terms" className="contact-checkbox" required />
          <label htmlFor="contact-terms" className="contact-label">
            I agree to the <span className="contact-terms-link">Terms and Conditions</span> and consent to receive email updates and newsletters
          </label>
        </div>
        <div className="contact-submit-right">
          <button type="submit" className="button-l">Submit</button>
        </div>
      </div>
    </form>
  );
}


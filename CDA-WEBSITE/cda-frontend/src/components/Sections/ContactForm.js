import React from 'react';

export default function ContactForm({ onSubmit }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(new FormData(e.currentTarget));
  };

  return (
    <form onSubmit={handleSubmit} className="contact-form" aria-label="Contact form">
      {/* 2nd row: First Name, Last Name, Email Address (310x50) */}
      <div className="contact-row-3">
        <div className="contact-input-wrap contact-input-310">
          <input
            className="contact-input"
            type="text"
            name="firstName"
            placeholder="First Name*"
            autoComplete="given-name"
            required
          />
        </div>
        <div className="contact-input-wrap contact-input-310">
          <input
            className="contact-input"
            type="text"
            name="lastName"
            placeholder="Last Name*"
            autoComplete="family-name"
            required
          />
        </div>
        <div className="contact-input-wrap contact-input-310">
          <input
            className="contact-input"
            type="email"
            name="email"
            placeholder="Email Address*"
            autoComplete="email"
            required
          />
        </div>
      </div>

      {/* 3rd row: Telephone Number, Reason dropdown (475.5x50) */}
      <div className="contact-row-2">
        <div className="contact-input-wrap contact-input-475">
          <input
            className="contact-input"
            type="tel"
            name="telephone"
            placeholder="Telephone Number*"
            autoComplete="tel"
            required
          />
        </div>
        <div className="contact-input-wrap contact-input-475">
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
      </div>

      {/* 4th row: Message (990x141.5) */}
      <div className="contact-input-wrap contact-input-full">
        <textarea
          className="contact-textarea"
          name="message"
          placeholder="Message*"
          rows={6}
          required
        />
      </div>

      {/* 5th row: Checkbox + Terms + Submit button */}
      <div className="contact-bottom-row">
        <div className="contact-terms">
          <input type="checkbox" id="contact-terms" className="contact-checkbox" required />
          <label htmlFor="contact-terms" className="contact-label">
            I agree to the <span className="contact-terms-link">Terms and Conditions</span> and consent to receive email<br />updates and newsletters
          </label>
        </div>
        <button type="submit" className="button-l contact-submit">Submit</button>
      </div>
    </form>
  );
}


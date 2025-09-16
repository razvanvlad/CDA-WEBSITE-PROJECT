'use client';

import React, { useState } from 'react';

/*
  NewsletterSignup (Global block)
  - Matches the visual design used on the Homepage newsletter block
  - Accepts globalData from globalContentBlocks.newsletterSignup
    { title, subtitle, hubspotScript, termsText }
  - Optional prop useHubspot: when true and hubspotScript exists, injects the HubSpot form
    inside the same visual container; otherwise renders the custom styled form UI.
*/
const NewsletterSignup = ({ globalData, useHubspot = false }) => {
  if (!globalData) return null;

  const [status, setStatus] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    setStatus('Thanks! This is a demo form — integrate your submission logic or HubSpot.');
  };

  return (
    <section className="newsletter-section">
      <div className="newsletter-container">
        <div className="newsletter-content">
          {/* Header */}
          <div className="newsletter-header">
            {globalData.subtitle && (
              <p className="cda-subtitle">{globalData.subtitle}</p>
            )}
            {globalData.title && (
              <h2 className="cda-title">{globalData.title}</h2>
            )}
          </div>

          {/* Form */}
          {useHubspot && globalData.hubspotScript ? (
            <div className="newsletter-form">
              <div
                className="newsletter-input-wrap"
                dangerouslySetInnerHTML={{ __html: globalData.hubspotScript }}
              />
            </div>
          ) : (
            <form className="newsletter-form" onSubmit={onSubmit}>
              {/* First Row - Name Fields */}
              <div className="newsletter-row">
                <div className="newsletter-input-wrap">
                  <input type="text" placeholder="First Name" className="newsletter-input" />
                </div>
                <div className="newsletter-input-wrap">
                  <input type="text" placeholder="Last Name" className="newsletter-input" />
                </div>
              </div>

              {/* Second Row - Email and Submit */}
              <div className="newsletter-row">
                <div className="newsletter-input-wrap">
                  <input type="email" placeholder="Email Address" className="newsletter-input" />
                </div>
                <div className="newsletter-input-wrap">
                  <button type="submit" className="button-l newsletter-submit">Sign Up</button>
                </div>
              </div>

              {/* Third Row - Terms and Conditions */}
              <div className="newsletter-terms">
                <input type="checkbox" id="terms" className="newsletter-checkbox" />
                <label htmlFor="terms" className="newsletter-label">
                  I agree to the <span className="newsletter-terms-link">Terms and Conditions</span> and consent to receive email updates and newsletters
                </label>
              </div>

              {status && <div className="newsletter-status">{status}</div>}
            </form>
          )}
        </div>

        {/* Illustration */}
        <div className="newsletter-illustration">
          <img
            src="/images/paper-plane.svg"
            alt="Paper plane illustration"
            className="newsletter-illustration-img"
          />
        </div>
      </div>
    </section>
  );
};

export default NewsletterSignup;
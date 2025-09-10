'use client';
import { useEffect } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Script from 'next/script';

export default function TestHubSpotPage() {
  const enhanceHubSpotForm = (rootEl) => {
    try {
      const root = rootEl || document.getElementById('hubspot-form-container');
      if (!root) return;
      const form = root.querySelector('form.hs-form') || root.querySelector('.hs-form');
      if (!form) return;

      // Prevent duplicate enhancements
      if (form.dataset.enhanced === 'true') return;
      form.dataset.enhanced = 'true';

      // Helper to find a field wrapper by input name
      const getFieldByName = (names) => {
        const arr = Array.isArray(names) ? names : [names];
        for (const n of arr) {
          const input = form.querySelector(`[name="${n}"]`);
          if (input) {
            const field = input.closest('.hs-form-field') || input.closest(`.hs_${n}`) || input.parentElement;
            if (field) return field;
          }
        }
        return null;
      };

      // Collect first row fields
      const firstName = getFieldByName('firstname');
      const lastName = getFieldByName('lastname');
      const email = getFieldByName('email');
      const phone = getFieldByName(['phone', 'phone_number', 'mobilephone']);

      if (firstName && lastName && email && phone) {
        let row1 = form.querySelector('.hs-grid-row.hs-grid-row--first');
        if (!row1) {
          row1 = document.createElement('div');
          row1.className = 'hs-grid-row hs-grid-row--first';
          form.insertBefore(row1, firstName);
        }
        row1.append(firstName, lastName, email, phone);
      }

      // Actions row: consent checkbox + submit
      const consent = form.querySelector('.legal-consent-container, .hs-form-booleancheckbox, .hs_consent_container');
      let submitWrap = form.querySelector('.hs-submit, .hs_submit');
      if (!submitWrap) {
        submitWrap = document.createElement('div');
        submitWrap.className = 'hs-submit';
      }

      let actionsRow = form.querySelector('.hs-actions-row');
      if (!actionsRow) {
        actionsRow = document.createElement('div');
        actionsRow.className = 'hs-actions-row';
        form.appendChild(actionsRow);
      }

      if (consent && consent.parentElement !== actionsRow) actionsRow.appendChild(consent);
      if (submitWrap && submitWrap.parentElement !== actionsRow) actionsRow.appendChild(submitWrap);

      // Replace input[type=submit] with a proxy button that uses .button-l styles
      const submitInput = submitWrap.querySelector('input[type="submit"], .hs-button[type="submit"]') || form.querySelector('input[type="submit"]');
      if (submitInput && !submitWrap.querySelector('.hs-custom-submit')) {
        // Keep original for HubSpot handling, but visually hide it
        submitInput.classList.add('hs-hidden');
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'button-l footer-cta-btn mt-6 hs-custom-submit';
        btn.textContent = submitInput.value || 'Submit';
        btn.addEventListener('click', () => submitInput.click());
        submitWrap.appendChild(btn);
      }
    } catch (e) {
      console.error('Failed to enhance HubSpot form:', e);
    }
  };
  const handleScriptLoad = () => {
    console.log('HubSpot script loaded successfully');
    
    // Create the form after script loads
    if (window.hbspt) {
      window.hbspt.forms.create({
        portalId: "143891025",
        formId: "80e897f8-198d-42e2-81b8-41f6732d4218",
        region: "eu1",
        target: '#hubspot-form-container',
        onFormReady: () => {
          console.log('HubSpot form is ready!');
          enhanceHubSpotForm(document.getElementById('hubspot-form-container'));
        },
        onFormSubmit: () => {
          console.log('HubSpot form submitted!');
        }
      });
    } else {
      console.error('HubSpot script not available');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Load HubSpot Script */}
      <Script
        src="//js-eu1.hsforms.net/forms/embed/v2.js"
        onLoad={handleScriptLoad}
        onError={() => console.error('Failed to load HubSpot script')}
      />
      
      {/* Contact Form Section - Same Design as Contact Page */}
      <section className="contact-section">
        <div className="contact-container">
          <div className="contact-content">
            <div className="contact-header">
              <div className="contact-subtitle">Test HubSpot</div>
              <h1 className="contact-title">Form</h1>
            </div>
            
            <div className="contact-form">
              <div id="hubspot-form-container" className="hubspot-form-wrapper">
                <div className="text-center py-8 text-gray-500">
                  Loading HubSpot form...
                </div>
              </div>
            </div>
          </div>

          <div className="contact-illustration">
            <img className="contact-illustration-img" src="/images/contact-birds.svg" alt="HubSpot form test illustration" />
          </div>
        </div>
      </section>
      
      {/* Testing Instructions Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-blue-900 mb-4">Testing Instructions</h2>
            <ol className="list-decimal list-inside space-y-2 text-blue-800">
              <li>Open browser Developer Tools (F12)</li>
              <li>Go to the Console tab</li>
              <li>Look for "HubSpot script loaded successfully"</li>
              <li>Check for "HubSpot form is ready!" message</li>
              <li>Verify the form appears above</li>
            </ol>
          </div>
          
          {/* Form Details */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Form Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <strong>Portal ID:</strong><br />
                143891025
              </div>
              <div>
                <strong>Form ID:</strong><br />
                80e897f8-198d-42e2-81b8-41f6732d4218
              </div>
              <div>
                <strong>Region:</strong><br />
                eu1
              </div>
            </div>
          </div>
          
          {/* Script Code Display */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Equivalent Script Code</h3>
            <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`<script charset="utf-8" type="text/javascript" src="//js-eu1.hsforms.net/forms/embed/v2.js"></script>
<script>
  hbspt.forms.create({
    portalId: "143891025",
    formId: "80e897f8-198d-42e2-81b8-41f6732d4218",
    region: "eu1"
  });
</script>`}
            </pre>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
"use client";
import { useEffect, useRef } from "react";
import '../styles/hubspot-service-form.css';

const FORM_MAP = {
  ecommerce: { portalId: "143891025", formId: "80e897f8-198d-42e2-81b8-41f6732d4218", region: "eu1" },
  b2b: { portalId: "143891025", formId: "80e897f8-198d-42e2-81b8-41f6732d4218", region: "eu1" },
  "b2b-lead-generation": { portalId: "143891025", formId: "80e897f8-198d-42e2-81b8-41f6732d4218", region: "eu1" },
  "software-development": { portalId: "143891025", formId: "074aaebe-afd8-4cd4-aed3-9121b4a6cc8f", region: "eu1" },
  "booking-systems": { portalId: "143891025", formId: "49fddd49-7309-4c02-9cd9-af6ac456a12e", region: "eu1" },
  "franchise-booking-systems": { portalId: "143891025", formId: "49fddd49-7309-4c02-9cd9-af6ac456a12e", region: "eu1" },
  "outsourced-cmo": { portalId: "143891025", formId: "2a38348b-7333-42c2-bc42-24d0cf303487", region: "eu1" },
  "digital-marketing": { portalId: "143891025", formId: "8a22cbe4-8abf-4e1f-8bac-7f40a4f1f866", region: "eu1" },
  ai: { portalId: "143891025", formId: "58c24def-6c60-45b4-be8c-bf699201624c", region: "eu1" },
};

function loadHubspot(region = "eu1") {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") return reject(new Error("no window"));
    if (window.hbspt) return resolve();
    let s = document.getElementById("hs-forms-script");
    if (!s) {
      s = document.createElement("script");
      s.id = "hs-forms-script";
      s.async = true;
      s.src = `https://js-${region}.hsforms.net/forms/embed/v2.js`;
      s.onload = () => resolve();
      s.onerror = (e) => reject(e);
      document.head.appendChild(s);
    } else {
      s.addEventListener("load", () => resolve(), { once: true });
    }
    // Poll in case 'load' fired earlier
    let tries = 0;
    (function check() {
      if (window.hbspt) return resolve();
      tries += 1;
      if (tries > 50) return; // give up silently, onLoad may still resolve
      setTimeout(check, 100);
    })();
  });
}

export default function HubspotFormEmbed({ slug, containerId }) {
  const id = containerId || `hubspot-form-${slug}`;
  const ref = useRef(null);

  useEffect(() => {
    let canceled = false;
    const cfg = FORM_MAP[slug];
    if (!cfg) return;

    (async () => {
      try {
        await loadHubspot(cfg.region);
        if (canceled) return;
        const el = ref.current;
        if (!el) return;
        el.innerHTML = ""; // clean if re-rendered
        window.hbspt.forms.create({
          portalId: cfg.portalId,
          formId: cfg.formId,
          region: cfg.region,
          target: `#${id}`,
          css: '', // Disable default Hubspot styles
          onFormReady: function ($form) {
            try {
              // Inject custom styles into the iframe
              const formEl = $form[0];
              const doc = formEl.ownerDocument;
              const styleId = 'custom-hubspot-styles';
              if (!doc.getElementById(styleId)) {
                const style = doc.createElement('style');
                style.id = styleId;
                style.textContent = `
                  .hs-form-field { margin-bottom: 1rem; }
                  .hs-form .hs-grid-row { display: grid; grid-template-columns: 1fr; gap: 1.5rem; margin-bottom: 1rem; }
                  @media (min-width: 768px) { .hs-form .hs-grid-row { grid-template-columns: repeat(2, 1fr); } .hs-form .hs-grid-row > .hs-form-field:only-child { grid-column: 1 / -1; } }
                  label { display: block; margin-bottom: 0.5rem; font-size: 0.875rem; color: #374151; font-weight: 500; font-family: 'Inter', sans-serif; }
                  input[type="text"], input[type="email"], input[type="tel"], input[type="number"], input[type="url"], textarea, select {
                    width: 100%; padding: 0.75rem 1rem; border: 1px solid #e5e7eb; background-color: #fff; font-size: 1rem; color: #1f2937; outline: none; border-radius: 0; box-sizing: border-box; font-family: 'Inter', sans-serif;
                  }
                  input:focus, textarea:focus, select:focus { border-color: #000; outline: 1px solid #000; }
                  select { appearance: none; background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23000' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e"); background-position: right 12px center; background-repeat: no-repeat; background-size: 16px; padding-right: 2.5rem; }
                  .hs-error-msg { color: #dc2626; font-size: 0.875rem; margin-top: 0.25rem; }
                  
                  /* Button L Styles for Proxy Button */
                  .hs-custom-submit {
                    --btn-l-line: 1px;
                    --btn-l-offset: 4px;
                    position: relative;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 235px;
                    height: 54px;
                    padding: 0;
                    font-family: 'Poppins', sans-serif;
                    font-weight: 700;
                    font-size: 18px;
                    color: white;
                    background-color: black;
                    border: none;
                    border-radius: 0;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    text-align: center;
                    white-space: nowrap;
                    margin-top: 1rem;
                  }
                  @media (max-width: 767px) {
                    .hs-custom-submit { width: 176px; height: 46px; font-size: 14px; }
                  }
                  .hs-custom-submit:hover {
                    background-color: white;
                    color: black;
                    box-shadow: inset 0 0 0 1px black;
                  }
                  .hs-custom-submit::before {
                    content: ''; position: absolute; left: 4px; bottom: -4px; width: 100%; height: 1px; background-color: black; z-index: 1;
                  }
                  .hs-custom-submit::after {
                    content: ''; position: absolute; top: 4px; right: -4px; width: 1px; bottom: -4px; background-color: black; z-index: 1;
                  }
                  
                  .hs-form-checkbox { display: flex; align-items: flex-start; gap: 0.5rem; }
                  .hs-form-checkbox input { width: 1.25rem; height: 1.25rem; margin-top: 0.125rem; }
                  
                  /* Utility to hide original submit safely */
                  .hs-hidden-submit { display: none !important; }
                `;
                doc.head.appendChild(style);
              }

              // 2. Create Proxy Button
              // Try multiple selectors to find the submit button
              let submitInput = formEl.querySelector('input[type="submit"]');
              if (!submitInput) submitInput = formEl.querySelector('.hs-button[type="submit"]');
              if (!submitInput) submitInput = formEl.querySelector('.hs_submit .hs-button');

              if (submitInput) {
                // Check if proxy already exists
                if (formEl.querySelector('.hs-custom-submit')) return;

                const proxy = doc.createElement('button');
                proxy.type = 'button';
                proxy.className = 'hs-custom-submit';
                proxy.textContent = submitInput.value || 'Submit';
                proxy.addEventListener('click', function (e) {
                  e.preventDefault();
                  submitInput.click();
                });

                // Insert proxy
                const container = submitInput.closest('.hs_submit') || submitInput.closest('.actions') || submitInput.parentElement;
                if (container) {
                  container.appendChild(proxy);
                } else {
                  // Fallback: append to the end of the form
                  formEl.appendChild(proxy);
                }

                // Hide the original submit button ONLY after proxy is added
                submitInput.classList.add('hs-hidden-submit');
              } else {
                console.warn("Hubspot submit button not found. Keeping original visible if present.");
              }

            } catch (e) {
              console.error("Error injecting styles or proxy button", e);
            }
          },
        });
      } catch (e) {
        console.error("HubSpot init failed", e);
      }
    })();

    return () => {
      canceled = true;
      if (ref.current) ref.current.innerHTML = "";
    };
  }, [slug, id]);

  return (
    <div className="service-hubspot-form">
      <div className="service-hubspot-form__container">
        <div className="service-hubspot-form__content">
          <h2 className="service-hubspot-form__title">Send Us A Message</h2>
          <div id={id} ref={ref} />
        </div>
        <div className="service-hubspot-form__bird">
          <img src="/images/contact-birds.svg" alt="Contact illustration with birds and envelopes" />
        </div>
      </div>
    </div>
  );
}

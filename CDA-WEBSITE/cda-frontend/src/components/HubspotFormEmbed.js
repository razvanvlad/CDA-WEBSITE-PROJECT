"use client";
import { useEffect, useRef } from "react";

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
          onFormReady: function () {
            try {
              const form = el.querySelector('form.hs-form') || el.querySelector('.hs-form');
              if (!form) return;
              // Find submit input/button
              let submitInput = form.querySelector('input[type="submit"], .hs-button[type="submit"]') || form.querySelector('.hs-button');
              // Fallback wrap
              let submitWrap = form.querySelector('.hs-submit, .hs_submit') || (submitInput && submitInput.parentElement);
              if (submitInput) {
                submitInput.classList.add('hs-hidden');
                // Add proxy styled button once
                if (!form.querySelector('.hs-custom-submit')) {
                  const proxy = document.createElement('button');
                  proxy.type = 'button';
                  proxy.className = 'button-l footer-cta-btn mt-6 hs-custom-submit';
                  proxy.textContent = submitInput.value || 'Submit';
                  proxy.addEventListener('click', () => submitInput.click());
                  (submitWrap || form).appendChild(proxy);
                }
              }
            } catch {}
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

  return <div id={id} ref={ref} />;
}


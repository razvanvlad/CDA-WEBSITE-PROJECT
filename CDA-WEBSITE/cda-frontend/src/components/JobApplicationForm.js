"use client";
import { useEffect, useRef } from "react";

const JOB_APPLICATION_FORM = {
  portalId: "143891025",
  formId: "6bbbcee8-3bee-4e8c-ac56-d2f2dd3bfac8",
  region: "eu1"
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

export default function JobApplicationForm({ jobTitle, containerId }) {
  const id = containerId || `job-application-form`;
  const ref = useRef(null);

  useEffect(() => {
    let canceled = false;

    (async () => {
      try {
        await loadHubspot(JOB_APPLICATION_FORM.region);
        if (canceled) return;
        const el = ref.current;
        if (!el) return;
        el.innerHTML = ""; // clean if re-rendered
        
        window.hbspt.forms.create({
          portalId: JOB_APPLICATION_FORM.portalId,
          formId: JOB_APPLICATION_FORM.formId,
          region: JOB_APPLICATION_FORM.region,
          target: `#${id}`,
          onFormReady: function (form) {
            try {
              // Pre-fill job title if provided
              if (jobTitle) {
                // Look for a field that might be for the job title
                const jobTitleField = form.querySelector('input[name*="job"], input[name*="position"], input[name*="role"]') || 
                                     form.querySelector('select[name*="job"], select[name*="position"], select[name*="role"]') ||
                                     form.querySelector('textarea[name*="job"], textarea[name*="position"], textarea[name*="role"]');
                
                if (jobTitleField) {
                  jobTitleField.value = jobTitle;
                  // Trigger change event to ensure HubSpot recognizes the value
                  const event = new Event('change', { bubbles: true });
                  jobTitleField.dispatchEvent(event);
                }
              }
              
              // Find submit input/button
              let submitInput = form.querySelector('input[type="submit"], .hs-button[type="submit"]') || 
                               form.querySelector('.hs-button');
              // Fallback wrap
              let submitWrap = form.querySelector('.hs-submit, .hs_submit') || 
                              (submitInput && submitInput.parentElement);
              
              if (submitInput) {
                submitInput.classList.add('hs-hidden');
                // Add proxy styled button once
                if (!form.querySelector('.hs-custom-submit')) {
                  const proxy = document.createElement('button');
                  proxy.type = 'button';
                  proxy.className = 'button-l hs-custom-submit';
                  proxy.textContent = 'Submit Application';
                  proxy.addEventListener('click', () => submitInput.click());
                  (submitWrap || form).appendChild(proxy);
                }
              }
            } catch (error) {
              console.error('Error customizing form:', error);
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
  }, [id, jobTitle]);

  return <div id={id} ref={ref} />;
}

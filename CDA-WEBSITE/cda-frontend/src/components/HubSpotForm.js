'use client';
import { useEffect, useRef } from 'react';

// Service-specific HubSpot form configurations
const HUBSPOT_FORMS = {
  'ecommerce': {
    portalId: '143891025',
    formId: '80e897f8-198d-42e2-81b8-41f6732d4218',
    region: 'eu1'
  },
  'b2b-lead-generation': {
    portalId: '143891025',
    formId: '80e897f8-198d-42e2-81b8-41f6732d4218',
    region: 'eu1'
  },
  'software-development': {
    portalId: '143891025',
    formId: '074aaebe-afd8-4cd4-aed3-9121b4a6cc8f',
    region: 'eu1'
  },
  'booking-systems': {
    portalId: '143891025',
    formId: '49fddd49-7309-4c02-9cd9-af6ac456a12e',
    region: 'eu1'
  },
  'franchise-booking-systems': {
    portalId: '143891025',
    formId: '49fddd49-7309-4c02-9cd9-af6ac456a12e',
    region: 'eu1'
  },
  'outsourced-cmo': {
    portalId: '143891025',
    formId: '2a38348b-7333-42c2-bc42-24d0cf303487',
    region: 'eu1'
  },
  'digital-marketing': {
    portalId: '143891025',
    formId: '8a22cbe4-8abf-4e1f-8bac-7f40a4f1f866',
    region: 'eu1'
  },
  'ai': {
    portalId: '143891025',
    formId: '58c24def-6c60-45b4-be8c-bf699201624c',
    region: 'eu1'
  }
};

const HubSpotForm = ({ serviceSlug, onFormReady }) => {
  const formRef = useRef(null);
  const scriptLoadedRef = useRef(false);

  useEffect(() => {
    const formConfig = HUBSPOT_FORMS[serviceSlug];
    
    if (!formConfig) {
      console.warn(`No HubSpot form configuration found for service: ${serviceSlug}`);
      return;
    }

    const loadHubSpotScript = () => {
      return new Promise((resolve, reject) => {
        // Check if script is already loaded
        if (window.hbspt) {
          resolve();
          return;
        }

        // Check if script is already being loaded
        if (document.querySelector('script[src*="hsforms.net"]')) {
          // Wait for it to load
          const checkHbspt = setInterval(() => {
            if (window.hbspt) {
              clearInterval(checkHbspt);
              resolve();
            }
          }, 100);
          return;
        }

        const script = document.createElement('script');
        script.src = '//js-eu1.hsforms.net/forms/embed/v2.js';
        script.charset = 'utf-8';
        script.type = 'text/javascript';
        script.async = true;
        
        script.onload = () => {
          scriptLoadedRef.current = true;
          resolve();
        };
        
        script.onerror = () => {
          reject(new Error('Failed to load HubSpot script'));
        };
        
        document.head.appendChild(script);
      });
    };

    const createForm = async () => {
      try {
        await loadHubSpotScript();
        
        if (window.hbspt && formRef.current) {
          // Clear any existing form
          formRef.current.innerHTML = '';
          
          window.hbspt.forms.create({
            portalId: formConfig.portalId,
            formId: formConfig.formId,
            region: formConfig.region,
            target: formRef.current,
            onFormReady: () => {
              if (onFormReady) onFormReady();
            },
            onFormSubmit: () => {
              console.log('HubSpot form submitted for service:', serviceSlug);
            }
          });
        }
      } catch (error) {
        console.error('Error loading HubSpot form:', error);
      }
    };

    createForm();

    // Cleanup function
    return () => {
      if (formRef.current) {
        formRef.current.innerHTML = '';
      }
    };
  }, [serviceSlug, onFormReady]);

  const formConfig = HUBSPOT_FORMS[serviceSlug];
  
  if (!formConfig) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-800">Contact form not available for this service.</p>
      </div>
    );
  }

  return (
    <div className="hubspot-form-container">
      <div ref={formRef} className="hubspot-form" />
    </div>
  );
};

export default HubSpotForm;
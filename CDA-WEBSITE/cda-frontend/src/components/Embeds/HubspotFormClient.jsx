"use client";
import React, { useEffect, useId, useState } from "react";

function loadScriptOnce(src) {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') return resolve(false);
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve(true));
      existing.addEventListener('error', () => reject(new Error('script error')));
      if (window.hbspt?.forms?.create) return resolve(true);
      return;
    }
    const s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.defer = true;
    s.onload = () => resolve(true);
    s.onerror = () => reject(new Error('script error'));
    document.head.appendChild(s);
  });
}

function parseHubspotEmbed(embedScript) {
  const clean = (embedScript || "").replace(/\s+js-\s*eu1/g, ' js-eu1');
  const portalId = (embedScript.match(/portalId\s*:\s*"([^"]+)"/) || [])[1] || '';
  const formId = (embedScript.match(/formId\s*:\s*"([^"]+)"/) || [])[1] || '';
  const region = (embedScript.match(/region\s*:\s*"([^"]+)"/) || [])[1] || '';
  let src = (clean.match(/src\s*=\s*"([^"]+)"/) || [])[1] || '';
  if (src && src.startsWith('//')) src = 'https:' + src.replace(/\s+/g, '');
  if (!src) src = 'https://js-eu1.hsforms.net/forms/embed/v2.js';
  return { portalId, formId, region, src };
}

export default function HubspotFormClient({ embedScript, className }) {
  const targetId = useId().replace(/:/g, '_');
  const [error, setError] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const { portalId, formId, region, src } = parseHubspotEmbed(embedScript);
    if (!portalId || !formId) {
      setError('Missing portalId or formId');
      return;
    }
    loadScriptOnce(src)
      .then(() => {
        if (cancelled) return;
        if (window.hbspt?.forms?.create) {
          try {
            window.hbspt.forms.create({ portalId, formId, region, target: `#${targetId}` });
            setReady(true);
          } catch (e) {
            setError(e.message || 'Hubspot create failed');
          }
        } else {
          setError('Hubspot not available');
        }
      })
      .catch((e) => setError(e.message || 'Script load error'));
    return () => { cancelled = true; };
  }, [embedScript, targetId]);

  return (
    <div className={className || ''}>
      <div id={targetId} />
      {!ready && !error && (
        <div className="text-xs text-gray-500">Loading form...</div>
      )}
      {error && (
        <div className="text-xs text-red-600">Form failed to load: {error}</div>
      )}
    </div>
  );
}

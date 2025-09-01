// components/SEO.js
import { useEffect } from 'react';

export default function SEO({ seoSettings, title }) {
  useEffect(() => {
    // Update document title
    document.title = seoSettings?.seoTitle || title || 'CDA';
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', seoSettings?.seoDescription || '');
    }
    
    // Update meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', seoSettings?.seoKeywords || '');
    }
    
    // Add noindex/nofollow if needed
    const metaRobots = document.querySelector('meta[name="robots"]');
    if (seoSettings?.noindex || seoSettings?.nofollow) {
      const robotsContent = [
        seoSettings.noindex ? 'noindex' : 'index',
        seoSettings.nofollow ? 'nofollow' : 'follow'
      ].join(', ');
      
      if (metaRobots) {
        metaRobots.setAttribute('content', robotsContent);
      } else {
        const robotsMeta = document.createElement('meta');
        robotsMeta.name = 'robots';
        robotsMeta.content = robotsContent;
        document.head.appendChild(robotsMeta);
      }
    }
    
    // Add canonical URL
    if (seoSettings?.canonicalUrl) {
      let canonicalLink = document.querySelector('link[rel="canonical"]');
      if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.rel = 'canonical';
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.href = seoSettings.canonicalUrl;
    }
  }, [seoSettings, title]);
  
  return null;
}
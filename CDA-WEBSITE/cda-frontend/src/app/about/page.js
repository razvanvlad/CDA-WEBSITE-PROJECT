// src/app/about/page.js
'use client';

import { useEffect, useState } from 'react';
import client from '../../lib/graphql/client';
import { GET_ABOUT_US_CONTENT } from '../../lib/graphql/queries';

export default function AboutPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await client.query({
          query: GET_ABOUT_US_CONTENT,
          variables: { uri: "about-us" },
          errorPolicy: 'all'
        });
        
        if (response.errors) {
            console.log("GraphQL errors:", response.errors);
          setError(response.errors[0]);
          return;
        }
        console.log("Full response:", response); // Add this line
        setData(response.data);
        console.log("Response data:", response.data); // Add this line
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  
  if (error) {
    return (
      <div style={{ padding: '20px', fontFamily: 'monospace' }}>
        <h1>GraphQL Error</h1>
        <div style={{ backgroundColor: '#f8f8f8', padding: '15px', marginBottom: '20px' }}>
          <strong>Error Details:</strong>
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: '12px' }}>
            {JSON.stringify(error, null, 2)}
          </pre>
        </div>
      </div>
    );
  }

  if (!data?.page) {
    return <div>Page not found</div>;
  }

  const page = data.page;
  const aboutContent = page.aboutUsContent;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      {/* Debug Data */}
      <details style={{ marginBottom: '30px', backgroundColor: '#f8f9fa', padding: '15px' }}>
        <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
          Debug Data (Click to expand)
        </summary>
        <pre style={{ 
          fontSize: '11px', 
          overflow: 'auto',
          backgroundColor: 'white',
          padding: '10px',
          borderRadius: '3px',
          marginTop: '10px'
        }}>
          {JSON.stringify(data, null, 2)}
        </pre>
      </details>

      {/* Content Page Header */}
      {aboutContent?.contentPageHeader && (
        <section style={{ marginBottom: '40px', textAlign: 'center' }}>
          <div 
            dangerouslySetInnerHTML={{ 
              __html: aboutContent.contentPageHeader.title 
            }} 
            style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '20px' }}
          />
          <div 
            dangerouslySetInnerHTML={{ 
              __html: aboutContent.contentPageHeader.text 
            }}
            style={{ fontSize: '1.2rem', marginBottom: '30px', color: '#666' }}
          />
          {aboutContent.contentPageHeader.cta && (
            <a 
              href={aboutContent.contentPageHeader.cta.url}
              style={{
                display: 'inline-block',
                backgroundColor: '#007cba',
                color: 'white',
                padding: '12px 24px',
                textDecoration: 'none',
                borderRadius: '5px'
              }}
            >
              {aboutContent.contentPageHeader.cta.title}
            </a>
          )}
        </section>
      )}

      {/* Who We Are Section */}
      {aboutContent?.whoWeAreSection && (aboutContent.whoWeAreSection.sectionTitle || aboutContent.whoWeAreSection.imageWithFrame) && (
        <section style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
            {aboutContent.whoWeAreSection.imageWithFrame?.node && (
              <div style={{ flex: '1' }}>
                <img 
                  src={aboutContent.whoWeAreSection.imageWithFrame.node.sourceUrl}
                  alt={aboutContent.whoWeAreSection.imageWithFrame.node.altText || 'Who We Are'}
                  style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }}
                />
              </div>
            )}
            <div style={{ flex: '1' }}>
              {aboutContent.whoWeAreSection.sectionTitle && (
                <div 
                  dangerouslySetInnerHTML={{ 
                    __html: aboutContent.whoWeAreSection.sectionTitle 
                  }}
                  style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '15px' }}
                />
              )}
              {aboutContent.whoWeAreSection.sectionText && (
                <div 
                  dangerouslySetInnerHTML={{ 
                    __html: aboutContent.whoWeAreSection.sectionText 
                  }}
                  style={{ marginBottom: '20px', lineHeight: '1.6' }}
                />
              )}
              {aboutContent.whoWeAreSection.cta && (
                <a 
                  href={aboutContent.whoWeAreSection.cta.url}
                  style={{ color: '#007cba', textDecoration: 'underline' }}
                >
                  {aboutContent.whoWeAreSection.cta.title}
                </a>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Why CDA Section */}
      {aboutContent?.whyCdaSection && aboutContent.whyCdaSection.length > 0 && (
        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Why Choose CDA</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
            {aboutContent.whyCdaSection.map((item, index) => (
              <div key={index} style={{ textAlign: 'center', padding: '20px' }}>
                {item.icon?.node && (
                  <div style={{ marginBottom: '15px' }}>
                    <img 
                      src={item.icon.node.sourceUrl}
                      alt={item.icon.node.altText || `Icon ${index + 1}`}
                      style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }}
                    />
                  </div>
                )}
                <div 
                  dangerouslySetInnerHTML={{ __html: item.title }}
                  style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '10px' }}
                />
                <div 
                  dangerouslySetInnerHTML={{ __html: item.description }}
                  style={{ color: '#666' }}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Services Section */}
      {aboutContent?.servicesSection?.servicesAccordion && (
        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Our Services</h2>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            {aboutContent.servicesSection.servicesAccordion.map((service, index) => (
              <div key={index} style={{ 
                border: '1px solid #ddd', 
                marginBottom: '10px', 
                borderRadius: '5px',
                padding: '20px'
              }}>
                <div 
                  dangerouslySetInnerHTML={{ __html: service.title }}
                  style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '10px' }}
                />
                <div 
                  dangerouslySetInnerHTML={{ __html: service.description }}
                  style={{ marginBottom: '15px' }}
                />
                {service.link && (
                  <a 
                    href={service.link.url}
                    style={{ color: '#007cba', textDecoration: 'underline' }}
                  >
                    {service.link.title}
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Approach Section */}
      {aboutContent?.approachSection && (
        <section style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
            {aboutContent.approachSection.image?.node && (
              <div style={{ flex: '1' }}>
                <img 
                  src={aboutContent.approachSection.image.node.sourceUrl}
                  alt={aboutContent.approachSection.image.node.altText || 'Our Approach'}
                  style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }}
                />
              </div>
            )}
            <div style={{ flex: '1' }}>
              {aboutContent.approachSection.title && (
                <div 
                  dangerouslySetInnerHTML={{ __html: aboutContent.approachSection.title }}
                  style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '15px' }}
                />
              )}
              {aboutContent.approachSection.text && (
                <div 
                  dangerouslySetInnerHTML={{ __html: aboutContent.approachSection.text }}
                  style={{ lineHeight: '1.6' }}
                />
              )}
            </div>
          </div>
        </section>
      )}

      {/* Stats Section */}
      {aboutContent?.statsSection && (aboutContent.statsSection.number || aboutContent.statsSection.label) && (
        <section style={{ marginBottom: '40px', textAlign: 'center' }}>
          {aboutContent.statsSection.image?.node && (
            <img 
              src={aboutContent.statsSection.image.node.sourceUrl}
              alt={aboutContent.statsSection.image.node.altText || 'Stats'}
              style={{ maxWidth: '200px', height: 'auto', marginBottom: '20px' }}
            />
          )}
          {aboutContent.statsSection.number && (
            <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#007cba', marginBottom: '10px' }}>
              {aboutContent.statsSection.number}
            </div>
          )}
          {aboutContent.statsSection.label && (
            <div 
              dangerouslySetInnerHTML={{ __html: aboutContent.statsSection.label }}
              style={{ fontSize: '1.2rem' }}
            />
          )}
        </section>
      )}

      {/* Video Section */}
      {aboutContent?.videoSection?.url && (
        <section style={{ marginBottom: '40px', textAlign: 'center' }}>
          {aboutContent.videoSection.title && (
            <div 
              dangerouslySetInnerHTML={{ __html: aboutContent.videoSection.title }}
              style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '20px' }}
            />
          )}
          <div>
            <a 
              href={aboutContent.videoSection.url}
              style={{ color: '#007cba', textDecoration: 'underline' }}
            >
              Watch Video: {aboutContent.videoSection.url}
            </a>
          </div>
        </section>
      )}

      {/* Leadership Section */}
      {aboutContent?.leadershipSection && (aboutContent.leadershipSection.name || aboutContent.leadershipSection.position) && (
        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Leadership Team</h2>
          <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
            {aboutContent.leadershipSection.image?.node && (
              <div style={{ marginBottom: '20px' }}>
                <img 
                  src={aboutContent.leadershipSection.image.node.sourceUrl}
                  alt={aboutContent.leadershipSection.image.node.altText || 'Leader'}
                  style={{ maxWidth: '200px', height: 'auto', borderRadius: '50%' }}
                />
              </div>
            )}
            {aboutContent.leadershipSection.name && (
              <h3 style={{ fontSize: '1.5rem', marginBottom: '5px' }}>
                {aboutContent.leadershipSection.name}
              </h3>
            )}
            {aboutContent.leadershipSection.position && (
              <p style={{ color: '#666', marginBottom: '15px' }}>
                {aboutContent.leadershipSection.position}
              </p>
            )}
            {aboutContent.leadershipSection.bio && (
              <div 
                dangerouslySetInnerHTML={{ __html: aboutContent.leadershipSection.bio }}
                style={{ textAlign: 'left', lineHeight: '1.6' }}
              />
            )}
          </div>
        </section>
      )}

      {/* Showreel Section */}
      {aboutContent?.showreelSection && (aboutContent.showreelSection.video || aboutContent.showreelSection.logos) && (
        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Our Work</h2>
          <div style={{ textAlign: 'center' }}>
            {aboutContent.showreelSection.video && (
              <div style={{ marginBottom: '30px' }}>
                <p>Video: {aboutContent.showreelSection.video}</p>
              </div>
            )}
            
            {aboutContent.showreelSection.logos && aboutContent.showreelSection.logos.length > 0 && (
              <div>
                <h3 style={{ marginBottom: '20px' }}>Our Clients</h3>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
                  gap: '20px',
                  maxWidth: '800px',
                  margin: '0 auto'
                }}>
                  {aboutContent.showreelSection.logos.map((logo, index) => (
                    <div key={index}>
                      {logo.image?.node && (
                        <img 
                          src={logo.image.node.sourceUrl}
                          alt={logo.image.node.altText || `Client Logo ${index + 1}`}
                          style={{ maxWidth: '100%', height: 'auto' }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
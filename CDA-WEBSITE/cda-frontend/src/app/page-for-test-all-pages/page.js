'use client';

import { useState } from 'react';

// WordPress GraphQL endpoint (same as other test page)
const GRAPHQL_URL = 'http://localhost/CDA-WEBSITE-PROJECT/CDA-WEBSITE/wordpress-backend/graphql';

function TestCard({ title, description, onRun, disabled, result }) {
  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 16, marginBottom: 12, background: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h4 style={{ margin: 0, fontSize: 15 }}>{title}</h4>
          {description && (
            <p style={{ margin: '6px 0 0', color: '#334155', fontSize: 12 }}>{description}</p>
          )}
        </div>
        <button
          onClick={onRun}
          disabled={disabled}
          style={{ padding: '6px 10px', background: '#2563eb', color: '#fff', border: 0, borderRadius: 6, cursor: disabled ? 'not-allowed' : 'pointer' }}
        >
          {disabled ? 'Running…' : 'Run'}
        </button>
      </div>
      {result && (
        <div style={{ marginTop: 10 }}>
          <div style={{ fontWeight: 700, color: result.success && !result.data?.errors ? '#059669' : '#dc2626', marginBottom: 8 }}>
            {result.success && !result.data?.errors ? '✅ SUCCESS' : '❌ FAILED'}
          </div>
          <pre style={{ background: '#f3f4f6', padding: 12, borderRadius: 6, overflow: 'auto', maxHeight: 360, fontSize: 12 }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

function PageSuite({ suite, runTest, running, results, runAllInSuite }) {
  return (
    <div style={{ border: '1px solid #cbd5e1', borderRadius: 10, padding: 16, background: '#ffffff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 18 }}>{suite.title}</h3>
          {suite.subtitle && (<p style={{ margin: '6px 0 0', color: '#475569', fontSize: 13 }}>{suite.subtitle}</p>)}
        </div>
        <button
          onClick={() => runAllInSuite(suite.key)}
          style={{ padding: '8px 12px', background: '#16a34a', color: '#fff', border: 0, borderRadius: 6, cursor: 'pointer' }}
        >
          Run All ({suite.tests.length})
        </button>
      </div>

      {suite.tests.map((t) => (
        <TestCard
          key={`${suite.key}:${t.key}`}
          title={t.title}
          description={t.description}
          onRun={() => runTest(suite.key, t.key, t.query)}
          disabled={!!running[`${suite.key}:${t.key}`]}
          result={results[`${suite.key}:${t.key}`]}
        />
      ))}
    </div>
  );
}

async function request(query) {
  try {
    const res = await fetch(GRAPHQL_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });
    const data = await res.json();
    return { success: res.ok, data };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export default function PageForTestAllPages() {
  const [running, setRunning] = useState({});
  const [results, setResults] = useState({});
  const [customQuery, setCustomQuery] = useState(`query {\n  page(id: \"289\", idType: DATABASE_ID) { id title }\n}`);

  const runTest = async (suiteKey, testKey, query) => {
    const k = `${suiteKey}:${testKey}`;
    setRunning((s) => ({ ...s, [k]: true }));
    const result = await request(query);
    setResults((r) => ({ ...r, [k]: result }));
    setRunning((s) => ({ ...s, [k]: false }));
  };

  const runAllInSuite = async (suiteKey) => {
    const suite = SUITES.find((s) => s.key === suiteKey);
    if (!suite) return;
    for (const t of suite.tests) {
      await runTest(suiteKey, t.key, t.query);
    }
  };

  const runAll = async () => {
    for (const suite of SUITES) {
      for (const t of suite.tests) {
        await runTest(suite.key, t.key, t.query);
      }
    }
  };

  const SUITES = [
    // Homepage
    {
      key: 'homepage',
      title: 'Homepage (ID: 289)',
      subtitle: 'Checks homepage clean content and required global blocks toggles',
      tests: [
        {
          key: 'exists',
          title: 'Page exists + title',
          description: 'Verify page can be fetched by Database ID',
          query: `query { page(id: "289", idType: DATABASE_ID) { id title slug uri } }`,
        },
        {
          key: 'cleanContent',
          title: 'homepageContentClean fields',
          description: 'Header + global content selection toggles',
          query: `
            query {
              page(id: "289", idType: DATABASE_ID) {
                id
                homepageContentClean {
                  headerSection { title text }
                  globalContentSelection {
                    enableImageFrame
                    enableServicesAccordion
                    enableTechnologiesSlider
                    enableValues
                    enableShowreel
                    enableStatsImage
                    enableLocationsImage
                    enableNewsCarousel
                    enableNewsletterSignup
                  }
                }
              }
            }
          `,
        },
        {
          key: 'globalBlocks',
          title: 'Global Content Blocks (safe)',
          description: 'Schema-aligned global blocks used across pages',
          query: `
            query {
              globalOptions {
                globalContentBlocks {
                  imageFrameBlock { title subtitle text button { url title target } }
                  servicesAccordion { title subtitle illustration { node { sourceUrl altText } } }
                  technologiesSlider { title subtitle logos { nodes { ... on Technology { id title uri } } } }
                  valuesBlock { title subtitle values { title text } }
                  showreel { title subtitle button { url title target } }
                  locationsImage { title subtitle countries { countryName offices { name } } }
                  newsCarousel { title subtitle }
                  newsletterSignup { title subtitle }
                }
              }
            }
          `,
        },
      ],
    },

    // About Us
    {
      key: 'about',
      title: 'About Us',
      subtitle: 'Check About page content presence by URI',
      tests: [
        {
          key: 'byUriAbout',
          title: 'Page by URI (about)',
          description: 'Fetch by URI "/about" and check content container',
          query: `
            query {
              page(id: "/about-us/", idType: URI) {
                id
                title
                slug
                uri
                aboutUsContent { __typename }
              }
            }
          `,
        },
        {
          key: 'aboutFields',
          title: 'About fields (sample)',
          description: 'Video + Who We Are + Why CDA subset',
          query: `
            query {
              page(id: "/about-us/", idType: URI) {
                id
                aboutUsContent {
                  contentPageHeader { title text cta { url title target } }
                  whoWeAreSection { sectionTitle sectionText cta { url title target } }
                  whyCdaSection { title description }
                }
              }
            }
          `,
        },
        {
          key: 'introspectStatsImage',
          title: 'Introspect: AboutUsContentStatsSectionImage',
          description: 'Lists fields on type used by Stats & Image',
          query: `
            query {
              __type(name: "AboutUsContentStatsSectionImage") {
                name
                fields { name type { name kind ofType { name kind } } }
              }
            }
          `,
        },
      ],
    },

    // Services
    {
      key: 'services',
      title: 'Services Pages',
      subtitle: 'AI, Booking Systems, Digital Marketing, Outsourced CMO, Software Development (flag)',
      tests: [
        {
          key: 'aiExists',
          title: 'AI (ID: 785) exists + field presence',
          description: 'aiContent presence via __typename',
          query: `query { page(id: "785", idType: DATABASE_ID) { id title slug uri aiContent { __typename } } }`,
        },
        {
          key: 'aiHeader',
          title: 'AI header fields',
          description: 'headerSection subset',
          query: `
            query { page(id: "785", idType: DATABASE_ID) { id aiContent { headerSection { title subtitle } } } }
          `,
        },
        {
          key: 'bookingExists',
          title: 'Booking Systems (ID: 779) exists + field presence',
          description: 'bookingSystemsContent presence',
          query: `query { page(id: "779", idType: DATABASE_ID) { id title slug uri bookingSystemsContent { __typename } } }`,
        },
        {
          key: 'bookingHeader',
          title: 'Booking Systems header fields',
          description: 'headerSection subset',
          query: `
            query { page(id: "779", idType: DATABASE_ID) { id bookingSystemsContent { headerSection { title subtitle } } } }
          `,
        },
        {
          key: 'digitalMarketingExists',
          title: 'Digital Marketing (ID: 781) exists + field presence',
          description: 'digitalMarketingContent presence',
          query: `query { page(id: "781", idType: DATABASE_ID) { id title slug uri digitalMarketingContent { __typename } } }`,
        },
        {
          key: 'digitalMarketingHeader',
          title: 'Digital Marketing header fields',
          description: 'headerSection subset',
          query: `
            query { page(id: "781", idType: DATABASE_ID) { id digitalMarketingContent { headerSection { title subtitle } } } }
          `,
        },
        {
          key: 'outsourcedCmoExists',
          title: 'Outsourced CMO (ID: 783) exists + field presence',
          description: 'outsourcedCmoContent presence',
          query: `query { page(id: "783", idType: DATABASE_ID) { id title slug uri outsourcedCmoContent { __typename } } }`,
        },
        {
          key: 'outsourcedCmoHeader',
          title: 'Outsourced CMO header fields',
          description: 'headerSection subset',
          query: `
            query { page(id: "783", idType: DATABASE_ID) { id outsourcedCmoContent { headerSection { title subtitle } } } }
          `,
        },
        {
          key: 'softwareDevExists',
          title: 'Software Development (ID: 777) exists (field pending)',
          description: 'ACF field not yet exposed in GraphQL',
          query: `query { page(id: "777", idType: DATABASE_ID) { id title slug uri } }`,
        },
      ],
    },

    // Knowledge Hub
    {
      key: 'knowledgeHub',
      title: 'Knowledge Hub (ID: 787)',
      subtitle: 'Verify page and header fields',
      tests: [
        {
          key: 'exists',
          title: 'Page exists + field presence',
          description: 'knowledgeHubContent presence via __typename',
          query: `query { page(id: "787", idType: DATABASE_ID) { id title slug uri knowledgeHubContent { __typename } } }`,
        },
        {
          key: 'header',
          title: 'Header fields',
          description: 'title + subtitle subset',
          query: `query { page(id: "787", idType: DATABASE_ID) { id knowledgeHubContent { headerSection { title subtitle } } } }`,
        },
      ],
    },

    // Case Study (Sample page)
    {
      key: 'caseStudy',
      title: 'Case Study (ID: 789)',
      subtitle: 'Verify page and header fields',
      tests: [
        {
          key: 'exists',
          title: 'Page exists + field presence',
          description: 'caseStudyOakleighContent presence via __typename',
          query: `query { page(id: "789", idType: DATABASE_ID) { id title slug uri caseStudyOakleighContent { __typename } } }`,
        },
        {
          key: 'header',
          title: 'Header fields',
          description: 'title + subtitle subset',
          query: `query { page(id: "789", idType: DATABASE_ID) { id caseStudyOakleighContent { headerSection { title subtitle } } } }`,
        },
      ],
    },

    // Contact
    {
      key: 'contact',
      title: 'Contact (ID: 791)',
      subtitle: 'Verify page and header fields',
      tests: [
        {
          key: 'exists',
          title: 'Page exists + field presence',
          description: 'contactContent presence via __typename',
          query: `query { page(id: "791", idType: DATABASE_ID) { id title slug uri contactContent { __typename } } }`,
        },
        {
          key: 'header',
          title: 'Header fields',
          description: 'title + subtitle subset',
          query: `query { page(id: "791", idType: DATABASE_ID) { id contactContent { headerSection { title subtitle } } } }`,
        },
      ],
    },

    // Terms & Conditions
    {
      key: 'terms',
      title: 'Terms & Conditions (ID: 793)',
      subtitle: 'Verify page and header fields',
      tests: [
        {
          key: 'exists',
          title: 'Page exists + field presence',
          description: 'termsConditionsContent presence via __typename',
          query: `query { page(id: "793", idType: DATABASE_ID) { id title slug uri termsConditionsContent { __typename } } }`,
        },
        {
          key: 'header',
          title: 'Header fields',
          description: 'title + lastUpdated subset',
          query: `query { page(id: "793", idType: DATABASE_ID) { id termsConditionsContent { headerSection { title lastUpdated } } } }`,
        },
      ],
    },

    // 404 Error page content (optional)
    {
      key: 'error404',
      title: 'Error 404 (ID: 795)',
      subtitle: 'Ensure 404 page content exists',
      tests: [
        {
          key: 'exists',
          title: 'Page exists + field presence',
          description: 'error404Content presence via __typename',
          query: `query { page(id: "795", idType: DATABASE_ID) { id title slug uri error404Content { __typename } } }`,
        },
      ],
    },
  ];

  return (
    <div style={{ padding: 24, background: '#f8fafc', minHeight: '100vh' }}>
      <h1 style={{ margin: 0, fontSize: 24 }}>Website Pages Content Test Harness</h1>
      <p style={{ color: '#475569', marginTop: 8 }}>
        Endpoint: <code>{GRAPHQL_URL}</code>
      </p>

      <div style={{ margin: '16px 0', padding: 12, background: '#ecfeff', border: '1px solid #67e8f9', borderRadius: 8, color: '#0e7490' }}>
        Use this page at /page-for-test-all-pages to validate each page's ACF content exposure in WPGraphQL. Tests are grouped per page.
      </div>

      <div style={{ marginBottom: 16 }}>
        <button
          onClick={runAll}
          style={{ padding: '10px 14px', background: '#16a34a', color: '#fff', border: 0, borderRadius: 6, cursor: 'pointer' }}
        >
          Run All Tests (Sequential)
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
        {SUITES.map((suite) => (
          <PageSuite
            key={suite.key}
            suite={suite}
            runTest={runTest}
            runAllInSuite={runAllInSuite}
            running={running}
            results={results}
          />
        ))}
      </div>

      <div style={{ border: '1px solid #fde68a', background: '#fffbeb', padding: 16, borderRadius: 8, marginTop: 16 }}>
        <h3 style={{ marginTop: 0 }}>Custom Query Runner</h3>
        <textarea
          value={customQuery}
          onChange={(e) => setCustomQuery(e.target.value)}
          rows={10}
          style={{ width: '100%', fontFamily: 'monospace', fontSize: 12, padding: 8, borderRadius: 6, border: '1px solid #e5e7eb', marginBottom: 8 }}
        />
        <button onClick={() => runTest('custom', 'custom', customQuery)} style={{ padding: '8px 12px', background: '#334155', color: '#fff', border: 0, borderRadius: 6, cursor: 'pointer' }}>
          Run Custom Query
        </button>
        {results['custom:custom'] && (
          <pre style={{ marginTop: 12, background: '#f3f4f6', padding: 12, borderRadius: 6, maxHeight: 420, overflow: 'auto', fontSize: 12 }}>
            {JSON.stringify(results['custom:custom'], null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}


'use client';

import { useState } from 'react';

// IMPORTANT: WordPress GraphQL endpoint (unchanged by Next.js port)
const GRAPHQL_URL = 'http://localhost/CDA-WEBSITE-PROJECT/CDA-WEBSITE/wordpress-backend/graphql';

function Section({ title, description, onRun, disabled, result }) {
  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 16, marginBottom: 16, background: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 16 }}>{title}</h3>
          {description && <p style={{ margin: '6px 0 0', color: '#6b7280', fontSize: 13 }}>{description}</p>}
        </div>
        <button onClick={onRun} disabled={disabled} style={{ padding: '8px 12px', background: '#2563eb', color: '#fff', border: 0, borderRadius: 6, cursor: disabled ? 'not-allowed' : 'pointer' }}>
          {disabled ? 'Running…' : 'Run Test'}
        </button>
      </div>
      {result && (
        <div>
          <div style={{ fontWeight: 700, color: result.success && !result.data?.errors ? '#059669' : '#dc2626', marginBottom: 8 }}>
            {result.success && !result.data?.errors ? '✅ SUCCESS' : '❌ FAILED'}
          </div>
          <pre style={{ background: '#f3f4f6', padding: 12, borderRadius: 6, overflow: 'auto', maxHeight: 420, fontSize: 12 }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
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

export default function PageForTestAllContent() {
  const [running, setRunning] = useState({});
  const [results, setResults] = useState({});

  const run = async (key, query) => {
    setRunning((s) => ({ ...s, [key]: true }));
    const result = await request(query);
    setResults((r) => ({ ...r, [key]: result }));
    setRunning((s) => ({ ...s, [key]: false }));
  };

  const tests = [
    {
      key: 'basic',
      title: '1) Basic GraphQL Connectivity',
      description: 'Ensures the endpoint is reachable.',
      query: `query { generalSettings { title description } }`,
    },
    {
      key: 'globalOptionsType',
      title: '2) GlobalOptions existence',
      description: 'Checks the root globalOptions node exists.',
      query: `query { globalOptions { __typename } }`,
    },
    {
      key: 'introspectGlobalOptions',
      title: '3) Introspection of GlobalOptions fields',
      description: 'Lists fields available on GlobalOptions type.',
      query: `
        query {
          __type(name: "GlobalOptions") {
            name
            fields { name type { name kind ofType { name kind } } }
          }
        }
      `,
    },
    {
      key: 'introspectGlobalBlocks',
      title: '3b) Introspection of GlobalContentBlocks fields',
      description: 'Lists fields available on GlobalContentBlocks type.',
      query: `
        query {
          __type(name: "GlobalContentBlocks") {
            name
            fields { name type { name kind ofType { name kind } } }
          }
        }
      `,
    },
    {
      key: 'allGlobalBlocks',
      title: '4) All Global Content Blocks (safe)',
      description: 'Schema-aligned query for all blocks (avoids invalid fields).',
      query: `
        query {
          globalOptions {
            globalContentBlocks {
              imageFrameBlock {
                title
                subtitle
                text
                button { url title target }
                contentImage { node { sourceUrl altText } }
                frameImage { node { sourceUrl altText } }
                arrowImage { node { sourceUrl altText } }
              }
              servicesAccordion {
                title
                subtitle
                illustration { node { sourceUrl altText } }
                services {
                  nodes { ... on Service { id title uri } }
                }
              }
              technologiesSlider {
                title
                subtitle
                logos {
                  nodes { ... on Technology { id title uri } }
                }
              }
              valuesBlock {
                title
                subtitle
                values { title text }
                illustration { node { sourceUrl altText } }
              }
              showreel {
                title
                subtitle
                button { url title target }
                largeImage { node { sourceUrl altText } }
                logos { logo { node { sourceUrl altText } } }
              }
              locationsImage {
                title
                subtitle
                countries { countryName offices { name address email phone } }
                illustration { node { sourceUrl altText } }
              }
              newsCarousel {
                title
                subtitle
                articleSelection
                category { nodes { name slug } }
                manualArticles {
                  nodes { ... on Post { id title uri excerpt featuredImage { node { sourceUrl altText } } } }
                }
              }
              newsletterSignup {
                title
                subtitle
                hubspotScript
                termsText
              }
            }
          }
        }
      `,
    },
    {
      key: 'homepageToggles',
      title: '5) Homepage toggles (page 289)',
      description: 'Confirms page-level toggle structure used by frontend.',
      query: `
        query {
          page(id: "289", idType: DATABASE_ID) {
            id
            title
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
      key: 'altFieldNames',
      title: '6) Alternate field names probe',
      description: 'Probes common alternative names if schema differs.',
      query: `
        query {
          globalOptions {
            globalContentBlocksComplete: globalContentBlocks {
              valuesBlock { title subtitle values { title text } }
              locationsImage { title subtitle countries { countryName offices { name } } }
            }
          }
        }
      `,
    },
    {
      key: 'introspectStatsImage',
      title: '7) Introspection of AboutUsContentStatsSectionImage',
      description: 'Check fields for the Stats & Image compatible object.',
      query: `
        query {
          __type(name: "AboutUsContentStatsSectionImage") {
            name
            fields { name type { name kind ofType { name kind } } }
          }
        }
      `,
    },
  ];

  const [customQuery, setCustomQuery] = useState(`query {\n  globalOptions {\n    globalContentBlocks {\n      valuesBlock { title subtitle values { title text } }\n    }\n  }\n}`);

  return (
    <div style={{ padding: 24, background: '#f8fafc', minHeight: '100vh' }}>
      <h1 style={{ margin: 0, fontSize: 24 }}>GraphQL End-to-End Test Harness</h1>
      <p style={{ color: '#475569', marginTop: 8 }}>
        Endpoint: <code>{GRAPHQL_URL}</code>
      </p>

      <div style={{ margin: '16px 0', padding: 12, background: '#ecfeff', border: '1px solid #67e8f9', borderRadius: 8, color: '#0e7490' }}>
        Use this page at /page-for-test-all-content to validate that ACF field names exposed via WPGraphQL match what our frontend queries expect.
      </div>

      <div style={{ marginBottom: 16 }}>
        <button
          onClick={async () => {
            for (let i = 0; i < tests.length; i++) {
              const t = tests[i];
              await run(t.key, t.query);
            }
          }}
          style={{ padding: '10px 14px', background: '#16a34a', color: '#fff', border: 0, borderRadius: 6, cursor: 'pointer' }}
        >
          Run All Tests (Sequential)
        </button>
      </div>

      {tests.map((t) => (
        <Section
          key={t.key}
          title={t.title}
          description={t.description}
          onRun={() => run(t.key, t.query)}
          disabled={!!running[t.key]}
          result={results[t.key]}
        />
      ))}

      <div style={{ border: '1px solid #fde68a', background: '#fffbeb', padding: 16, borderRadius: 8 }}>
        <h3 style={{ marginTop: 0 }}>Custom Query Runner</h3>
        <textarea
          value={customQuery}
          onChange={(e) => setCustomQuery(e.target.value)}
          rows={10}
          style={{ width: '100%', fontFamily: 'monospace', fontSize: 12, padding: 8, borderRadius: 6, border: '1px solid #e5e7eb', marginBottom: 8 }}
        />
        <button onClick={() => run('custom', customQuery)} style={{ padding: '8px 12px', background: '#334155', color: '#fff', border: 0, borderRadius: 6, cursor: 'pointer' }}>
          Run Custom Query
        </button>
        {results.custom && (
          <pre style={{ marginTop: 12, background: '#f3f4f6', padding: 12, borderRadius: 6, maxHeight: 420, overflow: 'auto', fontSize: 12 }}>
            {JSON.stringify(results.custom, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}


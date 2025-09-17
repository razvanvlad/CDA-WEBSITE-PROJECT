import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { executeGraphQLQuery, GET_ALL_GLOBAL_CONTENT_BLOCKS, GET_GLOBAL_IMAGE_FRAME_MIN } from '@/lib/graphql-queries'

export const revalidate = 0

function summarize(blocks) {
  const b = blocks || {}
  const report = []
  const push = (name, present, notes = []) => report.push({ name, present: !!present, notes })

  try {
    const a = b.approach
    const issues = []
    if (a) {
      if (!a.title) issues.push('missing title')
      if (!a.subtitle) issues.push('missing subtitle')
      const steps = a.steps || []
      if (!Array.isArray(steps) || steps.length === 0) issues.push('steps empty')
    }
    push('approach', !!a, issues)
  } catch (e) { push('approach', false, ['exception: ' + e.message]) }

  try {
    const c = b.cultureGallerySlider
    const issues = []
    if (c) {
      const edges = c.images?.edges || []
      if (edges.length === 0) issues.push('no images')
    }
    push('cultureGallerySlider', !!c, issues)
  } catch (e) { push('cultureGallerySlider', false, ['exception: ' + e.message]) }

  try {
    const f = b.imageFrameBlock
    const issues = []
    if (f) {
      if (!f.title) issues.push('missing title')
      if (!f.subtitle) issues.push('missing subtitle')
      if (!f.text) issues.push('missing text')
      if (!f.contentImage?.node?.sourceUrl) issues.push('missing contentImage')
      if (!f.frameImage?.node?.sourceUrl) issues.push('missing frameImage')
      if (!f.arrowImage?.node?.sourceUrl) issues.push('missing arrowImage')
    }
    push('imageFrameBlock', !!f, issues)
  } catch (e) { push('imageFrameBlock', false, ['exception: ' + e.message]) }

  try {
    const w = b.whyCda
    const issues = []
    if (w && (!w.usp || w.usp.length === 0)) issues.push('usp empty (optional)')
    push('whyCda', !!w, issues)
  } catch (e) { push('whyCda', false, ['exception: ' + e.message]) }

  try {
    const v = b.valuesBlock
    const issues = []
    if (v) {
      if (!v.title) issues.push('missing title')
      const vals = v.values || []
      if (vals.length === 0) issues.push('values empty')
    }
    push('valuesBlock', !!v, issues)
  } catch (e) { push('valuesBlock', false, ['exception: ' + e.message]) }

  try {
    const s = b.servicesAccordion
    const issues = []
    if (s) {
      const edges = s.services?.edges || []
      if (edges.length === 0) issues.push('services empty')
    }
    push('servicesAccordion', !!s, issues)
  } catch (e) { push('servicesAccordion', false, ['exception: ' + e.message]) }

  try {
    const t = b.technologiesSlider
    const issues = []
    if (t) {
      const edges = t.logos?.edges || []
      if (edges.length === 0) issues.push('logos empty')
    }
    push('technologiesSlider', !!t, issues)
  } catch (e) { push('technologiesSlider', false, ['exception: ' + e.message]) }

  try { push('showreel', !!b.showreel, []) } catch (e) { push('showreel', false, ['exception: ' + e.message]) }
  try { push('locationsImage', !!b.locationsImage, []) } catch (e) { push('locationsImage', false, ['exception: ' + e.message]) }

  try {
    const n = b.newsCarousel
    const issues = []
    if (n) {
      if (!n.articleSelection) issues.push('missing articleSelection')
    }
    push('newsCarousel', !!n, issues)
  } catch (e) { push('newsCarousel', false, ['exception: ' + e.message]) }

  try { push('newsletterSignup', !!b.newsletterSignup, []) } catch (e) { push('newsletterSignup', false, ['exception: ' + e.message]) }
  try { push('contactFormLeftImageRight', !!b.contactFormLeftImageRight, []) } catch (e) { push('contactFormLeftImageRight', false, ['exception: ' + e.message]) }
  try { push('joinOurTeam', !!b.joinOurTeam, []) } catch (e) { push('joinOurTeam', false, ['exception: ' + e.message]) }

  try {
    const c3 = b.threeColumnsWithIcons
    const issues = []
    if (c3) {
      const cols = c3.columns || []
      if (cols.length === 0) issues.push('columns empty')
    }
    push('threeColumnsWithIcons', !!c3, issues)
  } catch (e) { push('threeColumnsWithIcons', false, ['exception: ' + e.message]) }

  try {
    const fv = b.fullVideo
    const issues = []
    if (fv && !fv.url && !fv.file?.node?.sourceUrl) issues.push('no url or file')
    push('fullVideo', !!fv, issues)
  } catch (e) { push('fullVideo', false, ['exception: ' + e.message]) }

  try {
    const st = b.statsAndNumbers
    const issues = []
    if (st) {
      const arr = st.stats || []
      if (arr.length === 0) issues.push('stats empty')
    }
    push('statsAndNumbers', !!st, issues)
  } catch (e) { push('statsAndNumbers', false, ['exception: ' + e.message]) }

  return report
}

export default async function GlobalContentDebugPage() {
  const raw = await executeGraphQLQuery(GET_ALL_GLOBAL_CONTENT_BLOCKS)
  let blocks = raw?.data?.globalOptions?.globalContentBlocks || null
  const errors = raw?.errors || []

  // Fallback: fetch imageFrameBlock separately if missing
  try {
    if (!blocks?.imageFrameBlock) {
      const rawFrame = await executeGraphQLQuery(GET_GLOBAL_IMAGE_FRAME_MIN)
      const frame = rawFrame?.data?.globalOptions?.globalContentBlocks?.imageFrameBlock || null
      if (frame) blocks = { ...(blocks || {}), imageFrameBlock: frame }
    }
  } catch (_) {}

  const report = summarize(blocks)

  return (
    <>
      <Header />
      <main className="bg-white text-black py-10">
        <div className="mx-auto w-full max-w-[1200px] px-4">
          <h1 className="text-2xl font-bold mb-4">Global Content Blocks — Debug</h1>
          <p className="mb-6">This page fetches ALL global sections and validates basic fields. Use it to spot missing data or schema mismatches.</p>

          {errors.length > 0 && (
            <div className="mb-6 p-4 border border-red-300 bg-red-50 rounded">
              <h2 className="font-semibold mb-2">GraphQL Errors</h2>
              <pre className="whitespace-pre-wrap text-sm">{JSON.stringify(errors, null, 2)}</pre>
            </div>
          )}

          <div className="mb-8">
            <h2 className="font-semibold mb-3">Section Presence</h2>
            <ul className="space-y-2">
              {report.map((r) => (
                <li key={r.name} className="flex items-start gap-3">
                  <span className={`inline-block px-2 py-0.5 rounded text-xs ${r.present ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                    {r.present ? 'OK' : 'MISSING'}
                  </span>
                  <span className="font-mono text-sm min-w-[240px]">{r.name}</span>
                  {r.notes?.length > 0 && (
                    <span className="text-sm text-amber-700">{r.notes.join('; ')}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <details className="mb-8">
            <summary className="cursor-pointer font-semibold">Raw Blocks JSON</summary>
            <pre className="whitespace-pre-wrap text-xs mt-3 p-3 bg-gray-50 border rounded overflow-x-auto">{JSON.stringify(blocks, null, 2)}</pre>
          </details>

          <details>
            <summary className="cursor-pointer font-semibold">Full GraphQL Response</summary>
            <pre className="whitespace-pre-wrap text-xs mt-3 p-3 bg-gray-50 border rounded overflow-x-auto">{JSON.stringify(raw, null, 2)}</pre>
          </details>
        </div>
      </main>
      <Footer />
    </>
  )
}


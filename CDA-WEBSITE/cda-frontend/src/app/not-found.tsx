// Server-rendered Not Found page that uses the same content as /404
// Fetches the 404 content from WPGraphQL and renders it SSR so users see
// the real custom 404 immediately (no client fallback).

import React from 'react'
import { executeGraphQLQuery } from '@/lib/graphql-queries.js'

export const metadata = { title: '404 – Page Not Found' }

const GET_404_CONTENT_SSR = `
  query Get404ContentSSR {
    page(id: "/404", idType: URI) {
      id
      title
      error404Content {
        mainSection { title subtitle message image { node { sourceUrl altText } } }
        actionsSection { title homeButton { url title target } contactButton { url title target } }
        searchSection { title searchPlaceholder }
        suggestionsSection { title suggestionsItems { title description link { url title target } } }
      }
    }
  }
`

function stripHTML(html?: string) {
  if (!html) return ''
  return html.replace(/<[^>]*>/g, '').trim()
}

export default async function NotFound() {
  let errorContent: any = null
  try {
    const res = await executeGraphQLQuery(GET_404_CONTENT_SSR)
    errorContent = res?.data?.page?.error404Content || null
  } catch (_) {
    errorContent = null
  }

  if (!errorContent) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-9xl font-bold text-gray-200 mb-4">404</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Page Not Found</h1>
          <p className="text-xl text-gray-600 mb-8">The page you're looking for doesn't exist.</p>
          <a href="/" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-block">Go Home</a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {errorContent.mainSection && (
        <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <div className="text-8xl lg:text-9xl font-bold text-gray-200 mb-6">404</div>
            {errorContent.mainSection.title && (
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">{stripHTML(errorContent.mainSection.title)}</h1>
            )}
            {errorContent.mainSection.subtitle && (
              <p className="text-xl text-gray-600 mb-4">{errorContent.mainSection.subtitle}</p>
            )}
            {errorContent.mainSection.message && (
              <div className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto" dangerouslySetInnerHTML={{ __html: errorContent.mainSection.message }} />
            )}
            {errorContent.mainSection.image?.node?.sourceUrl && (
              <div className="mb-8">
                <img src={errorContent.mainSection.image.node.sourceUrl} alt={errorContent.mainSection.image.node.altText || ''} className="mx-auto h-64 w-auto" />
              </div>
            )}
          </div>
        </section>
      )}

      {errorContent.actionsSection && (errorContent.actionsSection.homeButton || errorContent.actionsSection.contactButton) && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-4xl">
            {errorContent.actionsSection.title && (
              <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">{stripHTML(errorContent.actionsSection.title)}</h2>
            )}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {errorContent.actionsSection.homeButton && (
                <a href={errorContent.actionsSection.homeButton.url || '/'} target={errorContent.actionsSection.homeButton.target || '_self'} className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center">{errorContent.actionsSection.homeButton.title || 'Go Home'}</a>
              )}
              {errorContent.actionsSection.contactButton && (
                <a href={errorContent.actionsSection.contactButton.url || '/contact'} target={errorContent.actionsSection.contactButton.target || '_self'} className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-colors text-center">{errorContent.actionsSection.contactButton.title || 'Contact Us'}</a>
              )}
            </div>
          </div>
        </section>
      )}

      {errorContent.searchSection && (errorContent.searchSection.title || errorContent.searchSection.searchPlaceholder) && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 max-w-2xl text-center">
            {errorContent.searchSection.title && (
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{stripHTML(errorContent.searchSection.title)}</h2>
            )}
            <form action="/" method="GET" className="flex gap-3">
              <input name="search" type="text" placeholder={errorContent.searchSection.searchPlaceholder || 'Search our site...'} className="flex-1 px-6 py-3 text-lg rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <button type="submit" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">Search</button>
            </form>
          </div>
        </section>
      )}

      {errorContent.suggestionsSection && (errorContent.suggestionsSection.title || errorContent.suggestionsSection.suggestionsItems?.length > 0) && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-4xl">
            {errorContent.suggestionsSection.title && (
              <h2 className="text-2xl font-bold text-center text-gray-900 mb-12">{stripHTML(errorContent.suggestionsSection.title)}</h2>
            )}
            {errorContent.suggestionsSection.suggestionsItems?.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {errorContent.suggestionsSection.suggestionsItems.map((s: any, i: number) => (
                  <div key={i} className="bg-gray-50 p-6 rounded-lg hover:bg-gray-100 transition-colors">
                    {s.title && (<h3 className="text-lg font-semibold text-gray-900 mb-3">{stripHTML(s.title)}</h3>)}
                    {s.description && (<p className="text-gray-600 mb-4">{s.description}</p>)}
                    {s.link && (<a href={s.link.url} target={s.link.target || '_self'} className="text-blue-600 font-medium hover:text-blue-800 hover:underline">{s.link.title} →</a>)}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Still can't find what you're looking for?</h2>
          <p className="text-gray-300 mb-8">Our team is here to help you find the information you need.</p>
          <a href="/contact" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-block">Get in Touch</a>
        </div>
      </section>
    </div>
  )
}

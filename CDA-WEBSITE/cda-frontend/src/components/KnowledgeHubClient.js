'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function KnowledgeHubClient({ caseStudies, posts, searchSection }) {
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Filter content based on active tab and search
  const filterContent = () => {
    let content = []
    
    if (activeTab === 'all' || activeTab === 'case-studies') {
      const filteredCaseStudies = caseStudies.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.excerpt?.toLowerCase().includes(searchQuery.toLowerCase())
      ).map(item => ({ ...item, type: 'case-study' }))
      content = [...content, ...filteredCaseStudies]
    }
    
    if (activeTab === 'all' || activeTab === 'news') {
      const filteredPosts = posts.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.excerpt?.toLowerCase().includes(searchQuery.toLowerCase())
      ).map(item => ({ ...item, type: 'news' }))
      content = [...content, ...filteredPosts]
    }
    
    // Sort by date (newest first)
    return content.sort((a, b) => new Date(b.date) - new Date(a.date))
  }

  const filteredContent = filterContent()

  return (
    <>
      {/* Search Section */}
      {searchSection && (
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder={searchSection.searchPlaceholder || "Search knowledge base..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          {searchSection.description && (
            <p className="text-gray-500 text-sm mt-2">
              {searchSection.description}
            </p>
          )}
        </div>
      )}

      {/* Content Filtering Tabs */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Browse Our Knowledge Base</h2>
            <p className="text-xl text-gray-600">Explore case studies, insights, and resources</p>
          </div>
          
          {/* Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              All Content ({filteredContent.length})
            </button>
            <button
              onClick={() => setActiveTab('case-studies')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'case-studies'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Case Studies ({caseStudies.length})
            </button>
            <button
              onClick={() => setActiveTab('news')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'news'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              News & Insights ({posts.length})
            </button>
          </div>
          
          {/* Content Grid */}
          {filteredContent.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredContent.map((item) => (
                <article key={`${item.type}-${item.id}`} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                  {item.featuredImage?.node?.sourceUrl && (
                    <div className="relative h-48">
                      <Image
                        src={item.featuredImage.node.sourceUrl}
                        alt={item.featuredImage.node.altText || item.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                        item.type === 'case-study' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {item.type === 'case-study' ? 'Case Study' : 'News'}
                      </span>
                      
                      {item.projectTypes?.nodes?.[0]?.name && (
                        <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                          {item.projectTypes.nodes[0].name}
                        </span>
                      )}
                      
                      {item.categories?.nodes?.[0]?.name && (
                        <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                          {item.categories.nodes[0].name}
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {item.title}
                    </h3>
                    
                    {item.excerpt && (
                      <div 
                        className="text-gray-600 mb-4 line-clamp-3"
                        dangerouslySetInnerHTML={{ __html: item.excerpt }}
                      />
                    )}
                    
                    {item.caseStudyFields?.projectOverview?.clientName && (
                      <p className="text-sm text-gray-500 mb-4">
                        Client: {item.caseStudyFields.projectOverview.clientName}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <Link
                        href={item.type === 'case-study' ? `/case-studies/${item.slug}` : `/news/${item.slug}`}
                        className="button-without-box"
                      >
                        Read More
                      </Link>
                      
                      <time className="text-sm text-gray-500">
                        {new Date(item.date).toLocaleDateString()}
                      </time>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No content found matching your search.</p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
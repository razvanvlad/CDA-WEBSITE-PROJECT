// src/app/knowledge-hub/page.js
'use client';

import { useEffect, useState } from 'react';
import client from '../../lib/graphql/client';
import { GET_KNOWLEDGE_HUB_CONTENT } from '../../lib/graphql/queries';

const stripHTML = (html) => {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').trim();
};

export default function KnowledgeHubPage() {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPageContent = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await client.query({
          query: GET_KNOWLEDGE_HUB_CONTENT,
          errorPolicy: 'all'
        });
        
        if (response.errors) {
          setError(response.errors[0]);
        } else {
          setPageData(response.data);
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPageContent();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-50">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl">
          <h2 className="text-red-600 text-lg font-semibold mb-4">Error Loading Page</h2>
          <pre className="text-xs text-red-600 overflow-auto">
            {JSON.stringify(error, null, 2)}
          </pre>
        </div>
      </div>
    );
  }

  if (!pageData?.page?.knowledgeHubContent) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl text-gray-600">Page Not Found</h1>
        </div>
      </div>
    );
  }

  const hubContent = pageData.page.knowledgeHubContent;

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      {hubContent.headerSection && (hubContent.headerSection.title || hubContent.headerSection.subtitle) && (
        <section className="hero-section bg-gradient-to-br from-indigo-50 to-purple-100 py-20">
          <div className="container mx-auto px-4 max-w-6xl text-center">
            {hubContent.headerSection.title && (
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
                {stripHTML(hubContent.headerSection.title)}
              </h1>
            )}
            
            {hubContent.headerSection.subtitle && (
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                {hubContent.headerSection.subtitle}
              </p>
            )}
            
            {hubContent.headerSection.searchPlaceholder && (
              <div className="max-w-md mx-auto">
                <input 
                  type="text" 
                  placeholder={hubContent.headerSection.searchPlaceholder}
                  className="w-full px-6 py-4 text-lg rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            )}
          </div>
        </section>
      )}

      {/* Featured Article Section */}
      {hubContent.featuredArticle && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-6xl">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Featured Article
            </h2>
            
            <div className="bg-gray-50 rounded-lg p-8 md:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  {hubContent.featuredArticle.title && (
                    <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                      {stripHTML(hubContent.featuredArticle.title)}
                    </h3>
                  )}
                  
                  {hubContent.featuredArticle.excerpt && (
                    <p className="text-lg text-gray-600 mb-6">
                      {hubContent.featuredArticle.excerpt}
                    </p>
                  )}
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-6">
                    {hubContent.featuredArticle.author && (
                      <span>By {hubContent.featuredArticle.author}</span>
                    )}
                    {hubContent.featuredArticle.publishDate && (
                      <span>{hubContent.featuredArticle.publishDate}</span>
                    )}
                    {hubContent.featuredArticle.readTime && (
                      <span>{hubContent.featuredArticle.readTime}</span>
                    )}
                  </div>
                  
                  {hubContent.featuredArticle.url && (
                    <a 
                      href={hubContent.featuredArticle.url}
                      className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors inline-block"
                    >
                      Read Article
                    </a>
                  )}
                </div>
                
                {hubContent.featuredArticle.featuredImage && (
                  <div>
                    <img 
                      src={hubContent.featuredArticle.featuredImage.node.sourceUrl}
                      alt={hubContent.featuredArticle.featuredImage.node.altText || ''}
                      className="w-full h-64 lg:h-80 object-cover rounded-lg shadow-lg"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Categories Section */}
      {hubContent.categoriesSection && (hubContent.categoriesSection.title || hubContent.categoriesSection.categories?.length > 0) && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 max-w-6xl">
            {hubContent.categoriesSection.title && (
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                {stripHTML(hubContent.categoriesSection.title)}
              </h2>
            )}
            
            {hubContent.categoriesSection.categories && hubContent.categoriesSection.categories.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {hubContent.categoriesSection.categories.map((category, index) => (
                  <a 
                    key={index}
                    href={category.url || '#'}
                    className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-center"
                  >
                    {category.name && (
                      <h3 className="font-semibold text-gray-900 mb-2" style={{ color: category.color || '#6366f1' }}>
                        {category.name}
                      </h3>
                    )}
                    {category.articleCount && (
                      <p className="text-sm text-gray-500">
                        {category.articleCount} articles
                      </p>
                    )}
                  </a>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Articles Section */}
      {hubContent.articlesSection && (hubContent.articlesSection.title || hubContent.articlesSection.articles?.length > 0) && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-6xl">
            {hubContent.articlesSection.title && (
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                {stripHTML(hubContent.articlesSection.title)}
              </h2>
            )}
            
            {hubContent.articlesSection.articles && hubContent.articlesSection.articles.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {hubContent.articlesSection.articles.map((article, index) => (
                  <article key={index} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    {article.featuredImage && (
                      <img 
                        src={article.featuredImage.node.sourceUrl}
                        alt={article.featuredImage.node.altText || ''}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    
                    <div className="p-6">
                      {article.category && (
                        <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">
                          {article.category}
                        </span>
                      )}
                      
                      {article.title && (
                        <h3 className="text-xl font-semibold text-gray-900 mt-2 mb-3">
                          {stripHTML(article.title)}
                        </h3>
                      )}
                      
                      {article.excerpt && (
                        <p className="text-gray-600 mb-4">
                          {article.excerpt}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-2">
                          {article.author && (
                            <span>{article.author}</span>
                          )}
                          {article.publishDate && (
                            <span>• {article.publishDate}</span>
                          )}
                        </div>
                        {article.readTime && (
                          <span>{article.readTime}</span>
                        )}
                      </div>
                      
                      {article.url && (
                        <a 
                          href={article.url}
                          className="inline-block mt-4 text-indigo-600 font-medium hover:text-indigo-800"
                        >
                          Read more →
                        </a>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
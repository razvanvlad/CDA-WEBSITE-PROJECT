// src/app/case-study/page.js
'use client';

import { useEffect, useState } from 'react';
import client from '../../lib/graphql/client';
import { GET_CASE_STUDY_CONTENT } from '../../lib/graphql/queries';

const stripHTML = (html) => {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').trim();
};

export default function CaseStudyPage() {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPageContent = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await client.query({
          query: GET_CASE_STUDY_CONTENT,
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
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mb-4"></div>
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

  if (!pageData?.page?.caseStudyOakleighContent) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl text-gray-600">Page Not Found</h1>
        </div>
      </div>
    );
  }

  const caseContent = pageData.page.caseStudyOakleighContent;

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      {caseContent.headerSection && (caseContent.headerSection.title || caseContent.headerSection.subtitle) && (
        <section className="hero-section bg-gradient-to-br from-emerald-50 to-teal-100 py-20">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                {caseContent.headerSection.title && (
                  <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                    {stripHTML(caseContent.headerSection.title)}
                  </h1>
                )}
                
                {caseContent.headerSection.subtitle && (
                  <p className="text-xl text-gray-600 mb-8">
                    {caseContent.headerSection.subtitle}
                  </p>
                )}
                
                {/* Project Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  {caseContent.headerSection.clientName && (
                    <div className="bg-white bg-opacity-80 p-4 rounded-lg">
                      <p className="font-semibold text-gray-700">Client</p>
                      <p className="text-gray-900">{caseContent.headerSection.clientName}</p>
                    </div>
                  )}
                  {caseContent.headerSection.projectType && (
                    <div className="bg-white bg-opacity-80 p-4 rounded-lg">
                      <p className="font-semibold text-gray-700">Project Type</p>
                      <p className="text-gray-900">{caseContent.headerSection.projectType}</p>
                    </div>
                  )}
                  {caseContent.headerSection.projectDuration && (
                    <div className="bg-white bg-opacity-80 p-4 rounded-lg">
                      <p className="font-semibold text-gray-700">Duration</p>
                      <p className="text-gray-900">{caseContent.headerSection.projectDuration}</p>
                    </div>
                  )}
                </div>
              </div>
              
              {caseContent.headerSection.featuredImage && (
                <div className="hidden lg:block">
                  <img 
                    src={caseContent.headerSection.featuredImage.node.sourceUrl}
                    alt={caseContent.headerSection.featuredImage.node.altText || ''}
                    className="w-full h-auto rounded-lg shadow-2xl"
                  />
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Challenge Section */}
      {caseContent.challengeSection && (caseContent.challengeSection.title || caseContent.challengeSection.content) && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="max-w-4xl mx-auto">
              {caseContent.challengeSection.title && (
                <h2 className="text-3xl font-bold text-gray-900 mb-8">
                  {stripHTML(caseContent.challengeSection.title)}
                </h2>
              )}
              
              {caseContent.challengeSection.content && (
                <div className="text-lg text-gray-600 mb-8">
                  <div dangerouslySetInnerHTML={{ __html: caseContent.challengeSection.content }} />
                </div>
              )}
              
              {caseContent.challengeSection.challenges && caseContent.challengeSection.challenges.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {caseContent.challengeSection.challenges.map((challenge, index) => (
                    <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-6">
                      {challenge.title && (
                        <h3 className="text-xl font-semibold text-red-800 mb-3">
                          {stripHTML(challenge.title)}
                        </h3>
                      )}
                      {challenge.description && (
                        <div className="text-red-700" dangerouslySetInnerHTML={{ __html: challenge.description }} />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Solution Section */}
      {caseContent.solutionSection && (caseContent.solutionSection.title || caseContent.solutionSection.content) && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="max-w-4xl mx-auto">
              {caseContent.solutionSection.title && (
                <h2 className="text-3xl font-bold text-gray-900 mb-8">
                  {stripHTML(caseContent.solutionSection.title)}
                </h2>
              )}
              
              {caseContent.solutionSection.content && (
                <div className="text-lg text-gray-600 mb-8">
                  <div dangerouslySetInnerHTML={{ __html: caseContent.solutionSection.content }} />
                </div>
              )}
              
              {caseContent.solutionSection.solutions && caseContent.solutionSection.solutions.length > 0 && (
                <div className="space-y-8">
                  {caseContent.solutionSection.solutions.map((solution, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center p-8">
                        <div>
                          {solution.title && (
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">
                              {stripHTML(solution.title)}
                            </h3>
                          )}
                          {solution.description && (
                            <div className="text-gray-600" dangerouslySetInnerHTML={{ __html: solution.description }} />
                          )}
                        </div>
                        {solution.image && (
                          <div>
                            <img 
                              src={solution.image.node.sourceUrl}
                              alt={solution.image.node.altText || ''}
                              className="w-full h-64 object-cover rounded-lg"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Results Section */}
      {caseContent.resultsSection && (caseContent.resultsSection.title || caseContent.resultsSection.results?.length > 0) && (
        <section className="py-16 bg-emerald-600">
          <div className="container mx-auto px-4 max-w-6xl">
            {caseContent.resultsSection.title && (
              <h2 className="text-3xl font-bold text-center text-white mb-6">
                {stripHTML(caseContent.resultsSection.title)}
              </h2>
            )}
            
            {caseContent.resultsSection.content && (
              <div className="text-center text-lg text-emerald-100 mb-12 max-w-3xl mx-auto">
                <div dangerouslySetInnerHTML={{ __html: caseContent.resultsSection.content }} />
              </div>
            )}
            
            {caseContent.resultsSection.results && caseContent.resultsSection.results.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {caseContent.resultsSection.results.map((result, index) => (
                  <div key={index} className="bg-white bg-opacity-20 backdrop-blur rounded-lg p-6 text-center">
                    {result.value && (
                      <div className="text-4xl font-bold text-white mb-2">
                        {result.value}
                      </div>
                    )}
                    {result.metric && (
                      <h3 className="text-xl font-semibold text-emerald-100 mb-2">
                        {result.metric}
                      </h3>
                    )}
                    {result.description && (
                      <p className="text-emerald-200 text-sm">
                        {result.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Technologies Section */}
      {caseContent.technologiesSection && (caseContent.technologiesSection.title || caseContent.technologiesSection.technologies?.length > 0) && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-6xl">
            {caseContent.technologiesSection.title && (
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                {stripHTML(caseContent.technologiesSection.title)}
              </h2>
            )}
            
            {caseContent.technologiesSection.technologies && caseContent.technologiesSection.technologies.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center">
                {caseContent.technologiesSection.technologies.map((tech, index) => (
                  <div key={index} className="text-center">
                    {tech.logo && (
                      <img 
                        src={tech.logo.node.sourceUrl}
                        alt={tech.logo.node.altText || tech.name || ''}
                        className="h-12 mx-auto mb-2 grayscale hover:grayscale-0 transition-all"
                      />
                    )}
                    {tech.name && (
                      <p className="text-sm text-gray-600">{tech.name}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* CTA Section */}
      {caseContent.ctaSection && (caseContent.ctaSection.title || caseContent.ctaSection.content) && (
        <section className="py-16 bg-gray-900">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            {caseContent.ctaSection.title && (
              <h2 className="text-3xl font-bold text-white mb-4">
                {stripHTML(caseContent.ctaSection.title)}
              </h2>
            )}
            {caseContent.ctaSection.content && (
              <div className="text-xl text-gray-300 mb-8">
                <div dangerouslySetInnerHTML={{ __html: caseContent.ctaSection.content }} />
              </div>
            )}
            
            {caseContent.ctaSection.button && (
              <a 
                href={caseContent.ctaSection.button.url}
                target={caseContent.ctaSection.button.target || '_self'}
                className="bg-emerald-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-emerald-700 transition-colors inline-block"
              >
                {caseContent.ctaSection.button.title}
              </a>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
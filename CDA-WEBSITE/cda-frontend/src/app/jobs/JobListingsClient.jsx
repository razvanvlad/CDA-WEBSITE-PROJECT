"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useMemo } from 'react';

function stripHTML(html) {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').trim();
}

function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function getStatusBadge(status) {
  switch (status) {
    case 'urgent':
      return { text: 'URGENT', className: 'bg-red-100 text-red-800 border-red-200' };
    case 'closing_soon':
      return { text: 'CLOSING SOON', className: 'bg-orange-100 text-orange-800 border-orange-200' };
    case 'filled':
      return { text: 'POSITION FILLED', className: 'bg-gray-100 text-gray-800 border-gray-200' };
    case 'on_hold':
      return { text: 'ON HOLD', className: 'bg-gray-100 text-gray-600 border-gray-200' };
    case 'open':
    default:
      return { text: 'OPEN', className: 'bg-green-100 text-green-800 border-green-200' };
  }
}

function getExperienceLevelDisplay(level) {
  const levels = {
    'entry': 'Entry Level',
    'junior': 'Junior',
    'mid': 'Mid Level',
    'senior': 'Senior',
    'lead': 'Lead/Principal',
    'director': 'Director'
  };
  return levels[level] || level;
}

export default function JobListingsClient({ initialItems = [] }) {
  // Debug logging
  console.log('JobListingsClient received items:', initialItems);
  
  // Read filters from URL on the client
  const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const searchQuery = params.get('search') || '';
  const selectedStatus = params.get('status') || '';
  const selectedLevel = params.get('experience_level') || '';

  const { openJobs, otherJobs, total } = useMemo(() => {
    let items = Array.isArray(initialItems) ? initialItems : [];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      items = items.filter((job) => {
        const title = (job.title || '').toLowerCase();
        const excerpt = stripHTML(job.excerpt || '').toLowerCase();
        const location = (job.jobListingFields?.jobDetails?.location || '').toLowerCase();
        return title.includes(q) || excerpt.includes(q) || location.includes(q);
      });
    }

    if (selectedStatus) {
      items = items.filter((job) => {
        const status = job.jobListingFields?.jobStatus;
        // Handle both array and string formats
        if (Array.isArray(status)) {
          return status.includes(selectedStatus);
        }
        return status === selectedStatus;
      });
    }

    if (selectedLevel) {
      items = items.filter((job) => {
        const level = job.jobListingFields?.jobDetails?.experienceLevel;
        // Handle both array and string formats
        if (Array.isArray(level)) {
          return level.includes(selectedLevel);
        }
        return level === selectedLevel;
      });
    }

    // Separate open jobs from others based on ACF fields
    const openPositions = items.filter((job) => {
      let status = job.jobListingFields?.jobStatus || 'open';
      // Handle array format from GraphQL
      if (Array.isArray(status)) {
        status = status[0] || 'open';
      }
      return ['open', 'urgent', 'closing_soon'].includes(status);
    });
    
    const otherPositions = items.filter((job) => {
      let status = job.jobListingFields?.jobStatus || 'open';
      // Handle array format from GraphQL
      if (Array.isArray(status)) {
        status = status[0] || 'open';
      }
      return !['open', 'urgent', 'closing_soon'].includes(status);
    });

    return {
      openJobs: openPositions,
      otherJobs: otherPositions,
      total: items.length,
    };
  }, [initialItems, searchQuery, selectedStatus, selectedLevel]);

  return (
    <div className="min-h-screen bg-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Career Opportunities</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join our innovative team and help build the future of digital marketing and web development. 
            We offer competitive salaries, flexible work arrangements, and opportunities to grow your career.
          </p>
        </div>

        {/* Summary */}
        <div className="mb-6">
          <p className="text-gray-600">
            {searchQuery || selectedStatus || selectedLevel ? (
              <>
                Showing {openJobs.length + otherJobs.length} of {total} positions
                {searchQuery && <span> matching "{searchQuery}"</span>}
                {selectedStatus && <span> with status "{selectedStatus}"</span>}
                {selectedLevel && <span> for "{getExperienceLevelDisplay(selectedLevel)}" level</span>}
              </>
            ) : (
              `Showing all ${total} positions`
            )}
          </p>
        </div>

        {/* Open Positions Section */}
        {openJobs.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Open Positions</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {openJobs.map((job) => {
                const jobDetails = job.jobListingFields?.jobDetails || {};
                let status = job.jobListingFields?.jobStatus || 'open';
                // Handle array format from GraphQL
                if (Array.isArray(status)) {
                  status = status[0] || 'open';
                }
                const statusBadge = getStatusBadge(status);

                return (
                  <Link 
                    key={job.id} 
                    href={`/jobs/${job.slug}`} 
                    className="group block bg-white border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                            {job.title}
                          </h3>
                        </div>
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${statusBadge.className}`}>
                          {statusBadge.text}
                        </span>
                      </div>

                      <div className="space-y-2 mb-4">
                        {jobDetails.location && (
                          <div className="flex items-center text-gray-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>{jobDetails.location}</span>
                          </div>
                        )}
                        
                        {jobDetails.salary && (
                          <div className="flex items-center text-gray-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                            <span>{jobDetails.salary}</span>
                          </div>
                        )}
                        
                        {jobDetails.experienceLevel && (
                          <div className="flex items-center text-gray-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                            </svg>
                            <span>{getExperienceLevelDisplay(Array.isArray(jobDetails.experienceLevel) ? jobDetails.experienceLevel[0] : jobDetails.experienceLevel)}</span>
                          </div>
                        )}
                      </div>

                      {job.excerpt && (
                        <p className="text-gray-600 mb-4 line-clamp-2">
                          {stripHTML(job.excerpt)}
                        </p>
                      )}

                      {jobDetails.publishDate && (
                        <p className="text-sm text-gray-500 mb-4">
                          Posted on {formatDate(jobDetails.publishDate)}
                        </p>
                      )}

                      <div className="flex items-center text-blue-600 font-semibold group-hover:text-blue-700">
                        View Position
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Other Positions (Filled, On Hold, etc.) */}
        {otherJobs.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Other Positions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherJobs.map((job) => {
                const jobDetails = job.jobListingFields?.jobDetails || {};
                let status = job.jobListingFields?.jobStatus || 'open';
                // Handle array format from GraphQL
                if (Array.isArray(status)) {
                  status = status[0] || 'open';
                }
                const statusBadge = getStatusBadge(status);

                return (
                  <Link 
                    key={job.id} 
                    href={`/jobs/${job.slug}`} 
                    className="group block bg-gray-50 border border-gray-200 rounded-lg hover:border-gray-300 transition-all duration-300 opacity-75"
                  >
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {job.title}
                        </h3>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${statusBadge.className}`}>
                          {statusBadge.text}
                        </span>
                      </div>
                      
                      {jobDetails.location && (
                        <p className="text-sm text-gray-600 mb-2">{jobDetails.location}</p>
                      )}
                      
                      {job.excerpt && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {stripHTML(job.excerpt)}
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {total === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No positions match your filters.</p>
          </div>
        )}

        {openJobs.length === 0 && otherJobs.length === 0 && total === 0 && (
          <div className="text-center py-12">
            <div className="mb-8">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Open Positions</h3>
              <p className="text-gray-600 max-w-md mx-auto mb-6">
                We don't have any open positions right now, but we're always looking for talented people. 
                Feel free to send us your resume and we'll keep it on file for future opportunities.
              </p>
              <Link
                href="/contact"
                className="button-l"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        )}

        {/* Call to Action */}
        {(openJobs.length > 0 || otherJobs.length > 0) && (
          <div className="text-center bg-gray-50 rounded-lg p-8 mt-16">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Join Our Team?</h3>
            <p className="text-gray-600 max-w-2xl mx-auto mb-6">
              Can't find the right position? We're always interested in connecting with talented individuals. 
              Send us your resume and let us know how you can contribute to our team.
            </p>
            <Link
              href="/contact"
              className="button-l"
            >
              Contact Us
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

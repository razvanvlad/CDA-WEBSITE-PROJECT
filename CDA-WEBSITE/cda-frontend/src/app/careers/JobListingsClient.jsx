"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useMemo } from 'react';
import NewsletterSignup from '../../components/GlobalBlocks/NewsletterSignup';
import CultureGallerySlider from '../../components/GlobalBlocks/CultureGallerySlider';
import UnderlinedTitle from '@/components/UnderlinedTitle';

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

export default function JobListingsClient({ initialItems = [], globalBlocks = null }) {
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
  {/* 2-col layout on md+; single column on mobile */}
  <div className="grid md:grid-cols-12 gap-x-10 gap-y-10 relative">

    {/* LEFT COL — 3/12 */}
    <aside className="md:col-span-3 relative">
      <p className="cda-subtitle">Careers</p>
      <h1 className="cda-title">Open Positions</h1>

      {/* Left bee */}
      <img
        src="/images/bee-left.svg"
        alt=""
        className="hidden md:block pointer-events-none select-none absolute -left-2 bottom-[240px] w-[220px] h-auto"
        aria-hidden="true"
        draggable="false"
      />
    </aside>

    {/* RIGHT COL — 9/12 */}
    <main className="md:col-span-9 relative overflow-visible">
      {/* Summary */}
      <div className="mb-6">
        <p className="text-sm text-gray-600">
          {searchQuery || selectedStatus || selectedLevel ? (
            <>
              Showing {openJobs.length + otherJobs.length} of {total} positions
              {searchQuery && <span> matching "{searchQuery}"</span>}
              {selectedStatus && <span> with status "{selectedStatus}"</span>}
              {selectedLevel && <span> for "{getExperienceLevelDisplay(selectedLevel)}" level</span>}
            </>
          ) : (
            <>Showing all {total} positions</>
          )}
        </p>
      </div>

      {/* Open Positions (keep your card markup; no extra H2 here) */}
      {openJobs.length > 0 && (
        <div className="mb-14">
          <div className="grid grid-cols-1 gap-6">
            {openJobs.map((job) => {
              const jobDetails = job.jobListingFields?.jobDetails || {};
              let status = job.jobListingFields?.jobStatus || 'open';
              if (Array.isArray(status)) status = status[0] || 'open';
              const statusBadge = getStatusBadge(status);

              return (
                <Link
                  key={job.id}
                  href={`/careers/${job.slug}`}
                  className="group block bg-white border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-lg transition-all duration-300"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#FF5C8A] transition-colors">
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
                    </div>

                    <div className="button-l-transparent">
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

      {/* Other Positions */}
      {otherJobs.length > 0 && (
        <div className="mb-16">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Other Positions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {otherJobs.map((job) => {
              const jobDetails = job.jobListingFields?.jobDetails || {};
              let status = job.jobListingFields?.jobStatus || 'open';
              if (Array.isArray(status)) status = status[0] || 'open';
              const statusBadge = getStatusBadge(status);

              return (
                <Link
                  key={job.id}
                  href={`/careers/${job.slug}`}
                  className="group block bg-gray-50 border border-gray-200 rounded-lg hover:border-gray-300 transition-all duration-300 opacity-75"
                >
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{job.title}</h3>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${statusBadge.className}`}>
                        {statusBadge.text}
                      </span>
                    </div>
                    {jobDetails.location && (
                      <p className="text-sm text-gray-600 mb-2">{jobDetails.location}</p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* CTA card (right column only) + right bee */}
        {(openJobs.length > 0 || otherJobs.length > 0) && (
    <div className="relative mt-12 md:mt-16 overflow-visible">
      {/* Right bee: sits on top of the card and overflows the edge */}
      <img
        src="/images/bee-right.svg"
        alt=""
        className="hidden md:block pointer-events-none select-none absolute -top-[-170px] -right-8 w-[220px] h-auto z-[2]"
        aria-hidden="true"
        draggable="false"
      />

      {/* Card takes the full width of the jobs column */}
      <div className="w-full">
        <div className="relative rounded-xl bg-[#F7F8FA] border border-black/[0.06] shadow-[0_8px_24px_rgba(0,0,0,0.05)] px-6 py-10 md:px-10 md:py-14 text-center z-[1]">
          <h3 className="cda-hero__title-text service-hero-title text-2xl lg:text-3xl pb-10 font-bold mb-6">
            <UnderlinedTitle size="h2" underlineColor="#FF5FA0">
              Looking For Another Role?
            </UnderlinedTitle>
          </h3>
          <p className="text-[#4B5563] text-[15px] md:text-[16px] leading-relaxed max-w-[720px] mx-auto mb-6 md:mb-8">
            Can't find the right position? We're always interested in connecting with talented individuals.
            Send us your resume and let us know how you can contribute to our team.
          </p>
          <Link href="/contact" className="button-l-transparent">Send Us Your CV</Link>
        </div>
      </div>
    </div>
  )}

      {/* Empty/fallback states remain the same below this point if you use them */}
    </main>
  </div>


</div>


      {/* Culture Gallery Slider (Global) */}
      {globalBlocks?.cultureGallerySlider && (
        <CultureGallerySlider globalData={globalBlocks.cultureGallerySlider} />
      )}

      {/* Newsletter Signup (Global) */}
      {globalBlocks?.newsletterSignup && (
        <NewsletterSignup globalData={globalBlocks.newsletterSignup} />
      )}
    </div>
  );
}

"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useMemo } from 'react';
import NewsletterSignup from '../../components/GlobalBlocks/NewsletterSignup';
import CultureGallerySlider from '../../components/GlobalBlocks/CultureGallerySlider';
import ResponsiveUnderlinedTitle from '@/components/ResponsiveUnderlinedTitle';

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

function getWorkingDisplay(working) {
  const workingTypes = {
    'hybrid': 'Hybrid',
    'onsite': 'On Site',
    'remote': 'Remote'
  };
  return workingTypes[working] || working;
}

function getHoursDisplay(hours) {
  const hoursTypes = {
    'fulltime': 'Full-Time',
    'parttime': 'Part-Time'
  };
  return hoursTypes[hours] || hours;
}

export default function JobListingsClient({ initialItems = [], globalBlocks = null }) {
  // Debug logging
  console.log('JobListingsClient received items:', initialItems);

  // Read filters from URL on the client
  const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const searchQuery = params.get('search') || '';
  const selectedStatus = params.get('status') || '';
  const selectedWorking = params.get('working') || '';
  const selectedHours = params.get('hours') || '';

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

    if (selectedWorking) {
      items = items.filter((job) => {
        const working = job.jobListingFields?.jobDetails?.working;
        // Handle both array and string formats
        if (Array.isArray(working)) {
          return working.includes(selectedWorking);
        }
        return working === selectedWorking;
      });
    }

    if (selectedHours) {
      items = items.filter((job) => {
        const hours = job.jobListingFields?.jobDetails?.hours;
        // Handle both array and string formats
        if (Array.isArray(hours)) {
          return hours.includes(selectedHours);
        }
        return hours === selectedHours;
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
  }, [initialItems, searchQuery, selectedStatus, selectedWorking, selectedHours]);

  return (
    <div className="min-h-screen bg-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* 2-col layout on md+; single column on mobile */}
        <div className="grid md:grid-cols-12 gap-x-10 gap-y-10 relative">

          {/* LEFT COL — 4/12 (1/3) */}
          <aside className="md:col-span-4 relative">
            <p className="cda-subtitle">Careers</p>
            <h1 className="cda-title">Open Positions</h1>

            {/* Left bee - positioned below text (desktop only) */}
            <div className="hidden md:block mt-12">
              <img
                src="/images/bee-left.svg"
                alt=""
                className="w-[220px] h-auto"
                aria-hidden="true"
                draggable="false"
              />
            </div>
          </aside>

          {/* RIGHT COL — 8/12 (2/3) */}
          <main className="md:col-span-8 relative overflow-visible">
            {/* Open Positions */}
            {openJobs.length > 0 && (
              <div className="mb-14">
                {/* 🔥 Container: top border + divide-y for shared middle lines */}
                <div className="divide-y divide-gray-200 border-t border-gray-200">
                  {openJobs.map((job, index) => {
                    const jobDetails = job.jobListingFields?.jobDetails || {};
                    let status = job.jobListingFields?.jobStatus || 'open';
                    if (Array.isArray(status)) status = status[0] || 'open';
                    const statusBadge = getStatusBadge(status);

                    // Determine if this is the last item
                    const isLast = index === openJobs.length - 1;

                    return (
                      <Link
                        key={job.id}
                        href={`/careers/${job.slug}`}
                        // Add border-b only to last item to ensure bottom line
                        className={`group block bg-white ${isLast ? 'border-b border-gray-200' : ''} hover:border-gray-300 hover:shadow-lg transition-all duration-300`}
                      >
                        <div className="p-8">
                          {/* Row 1: Title on left, Button on right (desktop) / Title only (mobile) */}
                          <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#FF5C8A] transition-colors mb-4 md:mb-0">
                                {job.title}
                              </h3>
                            </div>
                            <div className="hidden md:block ml-4 flex-shrink-0">
                              <div className="button-l-transparent">Find Out More</div>
                            </div>
                          </div>

                          {/* Row 2: Labels */}
                          <div className="flex flex-wrap gap-4 mb-4 md:mb-0">
                            {jobDetails.hours && (
                              <span className="px-3 py-1 text-sm bg-gray-100 text-gray-700 force-rounded">
                                {getHoursDisplay(jobDetails.hours)}
                              </span>
                            )}
                            {jobDetails.working && (
                              <span className="px-3 py-1 text-sm bg-gray-100 text-gray-700 force-rounded">
                                {getWorkingDisplay(jobDetails.working)}
                              </span>
                            )}
                          </div>

                          {/* Row 3: Button (mobile only) */}
                          <div className="block md:hidden">
                            <div className="button-l-transparent">Find Out More</div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* CTA card (unchanged) */}
            {(openJobs.length > 0 || otherJobs.length > 0) && (
              <div className="relative my-12 md:mt-16 overflow-visible">
                <img
                  src="/images/bee-right.svg"
                  alt=""
                  className="pointer-events-none select-none absolute z-[2] w-[180px] md:w-[220px] h-auto
          -bottom-[85px] left-1/2 -translate-x-1/2
          md:bottom-auto md:-top-[-170px] md:left-auto md:-right-8 md:translate-x-0"
                  aria-hidden="true"
                  draggable="false"
                />
                <div className="w-full">
                  <div className="relative rounded-xl bg-[#F4F4F4]  px-6 py-12 md:px-10 md:py-14 text-center z-[1]">
                    <h3 className="cda-hero__title-text service-hero-title text-2xl lg:text-3xl pb-10 font-bold mb-6">
                      <ResponsiveUnderlinedTitle as="h2" underlineColor="#FF5FA0">
                        Looking For Another Role?
                      </ResponsiveUnderlinedTitle>
                    </h3>
                    <Link href="/contact" className="button-l-transparent">Send Us Your CV</Link>
                  </div>
                </div>
              </div>
            )}
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

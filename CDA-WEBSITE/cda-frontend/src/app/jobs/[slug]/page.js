import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { notFound } from 'next/navigation';
import { getJobListingBySlug, getJobListingSlugs, getJobListingsSimple } from '../../../lib/graphql-queries';
import Image from 'next/image';
import Link from 'next/link';
import JobApplicationForm from '../../../components/JobApplicationForm';

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  let job;
  
  try {
    job = await getJobListingBySlug(params.slug);
  } catch (error) {
    const allJobs = await getJobListingsSimple();
    job = allJobs.find(j => j.slug === params.slug);
  }
  
  if (!job) {
    return {
      title: 'Job Not Found',
      description: 'The requested job listing could not be found.'
    };
  }

  return {
    title: `${job.title} - Career at CDA`,
    description: job.excerpt || `Join CDA as a ${job.title}. Discover this exciting career opportunity and apply today.`,
    openGraph: {
      title: job.title,
      description: job.excerpt,
      images: job.featuredImage?.node?.sourceUrl ? [job.featuredImage.node.sourceUrl] : [],
    },
  };
}

// Generate static params for all job slugs
export async function generateStaticParams() {
  try {
    // Try ACF query first, fallback to simple
    let jobs;
    try {
      const result = await getJobListingsWithPagination({ first: 100 });
      jobs = result.nodes;
    } catch (acfError) {
      jobs = await getJobListingsSimple();
    }
    return jobs.map((job) => ({ slug: job.slug }));
  } catch (error) {
    console.error('Error generating static params for jobs:', error);
    return [];
  }
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

function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Background color rotation for sections
function useBgRotation() {
  let currentIndex = 0;
  const backgrounds = ['bg-white', 'bg-gray-50'];
  return () => backgrounds[currentIndex++ % backgrounds.length];
}

export default async function JobDetailPage({ params }) {
  let job;
  
  try {
    job = await getJobListingBySlug(params.slug);
  } catch (error) {
    console.log('ACF query failed, using simple query:', error.message);
    const allJobs = await getJobListingsSimple();
    job = allJobs.find(j => j.slug === params.slug);
  }

  if (!job) {
    notFound();
  }

  // Debug: Log the complete job data structure
  console.log('🔍 Complete job data:', JSON.stringify(job, null, 2));
  console.log('🔍 jobListingFields:', job.jobListingFields);
  
  const { jobDetails, requirements, jobStatus } = job.jobListingFields || {};
  
  // Debug: Log individual field sections
  console.log('🔍 jobDetails:', jobDetails);
  console.log('🔍 requirements:', requirements);
  console.log('🔍 jobStatus:', jobStatus);
  
  const statusBadge = getStatusBadge(jobStatus || 'open');
  const nextBg = useBgRotation();

  return (
    <>
      <Header />
      
      <main className="job-detail-page">
        {/* Hero Section */}
        <section className={`relative ${nextBg()} text-black`}>
          <div className="max-w-7xl mx-auto px-4 py-24">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2">
                <div className="flex items-center gap-4 mb-6">
                  <Link
                    href="/jobs"
                    className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Back to Careers
                  </Link>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${statusBadge.className}`}>
                    {statusBadge.text}
                  </span>
                </div>

                <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-black">
                  {job.title}
                </h1>

                {job.excerpt && (
                  <div 
                    className="text-lg text-gray-600 mb-8"
                    dangerouslySetInnerHTML={{ __html: job.excerpt }}
                  />
                )}

                <div className="flex flex-wrap gap-4">
                  <Link
                    href="#apply"
                    className="button-l"
                  >
                    Apply Now
                  </Link>
                  <Link
                    href="/jobs"
                    className="button-without-box"
                  >
                    View All Positions
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Position Details</h3>
                  
                  <div className="mb-4">
                    <dt className="text-sm font-medium text-gray-500 flex items-center mb-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4M5 21V10a1 1 0 011-1h12a1 1 0 011 1v11a1 1 0 01-1 1H6a1 1 0 01-1-1z" />
                      </svg>
                      Posted
                    </dt>
                    <dd className="text-lg text-gray-900">{formatDate(job.date)}</dd>
                  </div>

                  <div className="mb-4">
                    <dt className="text-sm font-medium text-gray-500">Status</dt>
                    <dd>
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${statusBadge.className}`}>
                        {statusBadge.text}
                      </span>
                    </dd>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Placeholder sections for when ACF fields are available */}

        {/* Main Content */}
        {job.content && (
          <section className={`py-16 ${nextBg()}`}>
            <div className="max-w-4xl mx-auto px-4">
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: job.content }}
              />
            </div>
          </section>
        )}

        {/* Job Application Form Section */}
        <section id="apply" className={`py-16 ${nextBg()}`}>
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Apply for {job.title}
              </h2>
              <p className="text-lg text-gray-600">
                Ready to join our team? Fill out the form below and we'll get back to you within 24 hours.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-8 hubspot-form-wrapper">
              <JobApplicationForm jobTitle={job.title} />
            </div>

            {/* Force form colors: text black, fields white; override submit button colors */}
            <style>{`
              .hubspot-form-wrapper, .hubspot-form-wrapper * { color: #000; }
              .hubspot-form-wrapper label { color: #000 !important; }
              .hubspot-form-wrapper input[type="text"],
              .hubspot-form-wrapper input[type="email"],
              .hubspot-form-wrapper input[type="tel"],
              .hubspot-form-wrapper input[type="number"],
              .hubspot-form-wrapper input[type="url"],
              .hubspot-form-wrapper input[type="password"],
              .hubspot-form-wrapper input[type="file"],
              .hubspot-form-wrapper select,
              .hubspot-form-wrapper textarea {
                background-color: #fff !important;
                color: #000 !important;
                border: 1px solid #e5e7eb !important;
                border-radius: 0 !important;
                padding: 0.75rem 1rem !important;
              }
              .hubspot-form-wrapper .hs-error-msg, .hubspot-form-wrapper .hs-form-required {
                color: #b91c1c !important;
              }
              /* Submit button (proxy and native) — white text on black; invert on hover */
              .hubspot-form-wrapper .hs-custom-submit.button-l,
              .hubspot-form-wrapper .hs-submit .hs-button {
                background-color: #000 !important;
                color: #fff !important;
                box-shadow: none !important;
              }
              .hubspot-form-wrapper .hs-custom-submit.button-l:hover,
              .hubspot-form-wrapper .hs-submit .hs-button:hover {
                background-color: #fff !important;
                color: #000 !important;
                box-shadow: inset 0 0 0 1px #000 !important;
              }
              .hubspot-form-wrapper .button-l,
              .hubspot-form-wrapper .hs-button.button-l {
                /* Ensure our styled submit stands out if HubSpot overwrites */
                background-image: none !important;
              }
              .hubspot-form-wrapper .hs-hidden { display: none !important; }
            `}</style>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gray-900 text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Questions About This Role?</h2>
            <p className="text-xl text-gray-300 mb-8">
              We're here to help! Get in touch if you have any questions about this position or our company.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/contact"
                className="button-l"
              >
                Contact Us
              </Link>
              <Link
                href="/jobs"
                className="button-without-box text-white"
              >
                View All Positions
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
}


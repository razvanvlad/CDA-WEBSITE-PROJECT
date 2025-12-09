import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import ResponsiveUnderlinedTitle from '../../../components/ResponsiveUnderlinedTitle';
import TextLinkButton from '../../../components/ui/TextLinkButton';
import { notFound } from 'next/navigation';
import { getJobListingBySlug, getJobListingSlugs, getJobListingsSimple, getJobListingsWithPagination } from '../../../lib/graphql-queries';
import Image from 'next/image';
import Link from 'next/link';
import JobApplicationForm from '../../../components/JobApplicationForm';
import shieldSvg from '../../../../public/images/shield.svg';
import targetSvg from '../../../../public/images/target.svg';
import wilburySvg from '../../../../public/images/wilbury-way.svg';


// Generate metadata for SEO
export async function generateMetadata({ params }) {
  // Await params in Next.js 15
  const resolvedParams = await params;
  let job;

  try {
    job = await getJobListingBySlug(resolvedParams.slug);
  } catch (error) {
    const allJobs = await getJobListingsSimple();
    job = allJobs.find(j => j.slug === resolvedParams.slug);
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
    console.error('Error generating static params for careers:', error);
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

export default async function CareerDetailPage({ params }) {
  // Await params in Next.js 15
  const resolvedParams = await params;
  let job;

  try {
    job = await getJobListingBySlug(resolvedParams.slug);
  } catch (error) {
    console.log('ACF query failed, using simple query:', error.message);
    const allJobs = await getJobListingsSimple();
    job = allJobs.find(j => j.slug === resolvedParams.slug);
  }

  if (!job) {
    notFound();
  }

  // Extract ACF fields if they exist
  const { jobDetails, requirements, jobStatus } = job.jobListingFields || {};

  const statusBadge = getStatusBadge(jobStatus || 'open');
  const nextBg = useBgRotation();

  return (
    <>
      <Header backButton={{ href: '/careers', label: 'Back To Careers' }} />

      <main className="job-detail-page">
        {/* Hero Section */}
        <section className="relative bg-white text-black">
          <div className="cda-container py-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between md:gap-8 mb-6">
              <ResponsiveUnderlinedTitle
                as="h1"
                className="cda-title mb-4 md:mb-0"
                underlineColor="#3CBEEB"
              >
                {job.title}
              </ResponsiveUnderlinedTitle>

              <Link
                href="#apply"
                className="button-l flex-shrink-0"
              >
                Apply
              </Link>
            </div>
          </div>
        </section>

        {/* Position Details - Full Width Gray Background */}
        <section className="bg-gray-50 py-8">
          <div className="cda-container">
            {/* Desktop: Single Row */}
            <div className="hidden md:flex md:flex-wrap md:gap-x-8 md:gap-y-2 text-sm">
              <div>
                <span className="font-bold text-black">Publish Date: </span>
                <span className="text-black">{formatDate(jobDetails?.publishDate || job.date)}</span>
              </div>
              {jobDetails?.location && (
                <div>
                  <span className="font-bold text-black">Location: </span>
                  <span className="text-black">{jobDetails.location}</span>
                </div>
              )}
              {jobDetails?.working && (
                <div>
                  <span className="font-bold text-black">Working: </span>
                  <span className="text-black">{getWorkingDisplay(jobDetails.working)}</span>
                </div>
              )}
              {jobDetails?.hours && (
                <div>
                  <span className="font-bold text-black">Hours: </span>
                  <span className="text-black">{getHoursDisplay(jobDetails.hours)}</span>
                </div>
              )}
              {jobDetails?.salary && (
                <div>
                  <span className="font-bold text-black">Salary: </span>
                  <span className="text-black">{jobDetails.salary}</span>
                </div>
              )}
            </div>

            {/* Mobile: Single Column with Aligned Values */}
            <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 md:hidden text-sm">
              <span className="font-bold text-black">Publish Date:</span>
              <span className="text-black">{formatDate(jobDetails?.publishDate || job.date)}</span>

              {jobDetails?.location && (
                <>
                  <span className="font-bold text-black">Location:</span>
                  <span className="text-black">{jobDetails.location}</span>
                </>
              )}
              {jobDetails?.working && (
                <>
                  <span className="font-bold text-black">Working:</span>
                  <span className="text-black">{getWorkingDisplay(jobDetails.working)}</span>
                </>
              )}
              {jobDetails?.hours && (
                <>
                  <span className="font-bold text-black">Hours:</span>
                  <span className="text-black">{getHoursDisplay(jobDetails.hours)}</span>
                </>
              )}
              {jobDetails?.salary && (
                <>
                  <span className="font-bold text-black">Salary:</span>
                  <span className="text-black">{jobDetails.salary}</span>
                </>
              )}
            </div>
          </div>
        </section>

        {/* === ROW 1: About the Position (8/12) + Shield (4/12) === */}
        {requirements?.aboutThePosition && (
          <section className={`py-16 ${nextBg()}`}>
            <div className="cda-container">
              <div className="grid grid-cols-12 gap-6 md:gap-10 items-start">
                <div className="col-span-12 md:col-span-8">
                  <h2 className="text-3xl font-bold text-black mb-6">About The Position</h2>
                  <div
                    className="prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: requirements.aboutThePosition }}
                  />
                </div>

                <div className="col-span-12 md:col-span-4">
                  <div className="relative w-full">
                    <Image
                      src={shieldSvg}
                      alt="Shield"
                      className="w-full h-auto max-h-[300px]"
                      priority={false}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}


        {/* === ROW 2: Our Dream Candidate (8/12) + Target (4/12) === */}
        {requirements?.ourDreamCandidate && (
          <section className={`py-16 ${nextBg()}`}>
            <div className="cda-container">
              <div className="grid grid-cols-12 gap-6 md:gap-10 items-start">
                <div className="col-span-12 md:col-span-4">
                  <div className="relative w-full">
                    <Image
                      src={targetSvg}
                      alt="Target"
                      className="w-full h-auto max-h-[300px]"
                      priority={false}
                    />
                  </div>
                </div>
                <div className="col-span-12 md:col-span-8">
                  <h2 className="text-3xl font-bold text-black mb-6">Our Dream Candidate</h2>
                  <div
                    className="prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: requirements.ourDreamCandidate }}
                  />
                </div>
              </div>
            </div>
          </section>
        )}



        {/* === ROW 3: Responsibilities (6/12) + Qualifications (6/12) === */}
        {(requirements?.requiredSkills?.length || requirements?.requiredQualifications?.length) ? (
          <section className={`py-16 ${nextBg()}`}>
            <div className="cda-container">
              <div className="grid grid-cols-12 gap-6 md:gap-10">
                {/* Key Responsibilities */}
                {requirements?.requiredSkills?.length > 0 && (
                  <div className="col-span-12 md:col-span-6">
                    <h2 className="text-3xl font-bold text-black mb-6">Key Responsibilities</h2>
                    <ul className="space-y-3">
                      {requirements.requiredSkills.map((item, i) => (
                        <li key={i} className="flex items-start">
                          <svg className="h-6 w-6 text-blue-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-black">{item?.responsability || item?.text || ''}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Qualifications and Experience */}
                {requirements?.requiredQualifications?.length > 0 && (
                  <div className="col-span-12 md:col-span-6">
                    <h2 className="text-3xl font-bold text-black mb-6">Qualifications and Experience</h2>
                    <ul className="space-y-3">
                      {requirements.requiredQualifications.map((item, i) => (
                        <li key={i} className="flex items-start">
                          <svg className="h-6 w-6 text-green-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                          </svg>
                          <span className="text-black">{item?.qualification || item?.text || ''}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </section>
        ) : null}



        {/* === ROW 5: Apply Form — left image 4/12, form 8/12 === */}
        <section id="apply" className={`py-16 ${nextBg()}`}>
          <div className="cda-container">


            <div className="grid grid-cols-12 gap-6 md:gap-10 items-start">
              {/* Left image (4/12) */}
              <div className="col-span-12 md:col-span-4">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-black mb-4">Apply for {job.title}</h2>
                  <p className="text-lg text-black">
                    Ready to join our team? Fill out the form below and we'll get back to you within 24 hours.
                  </p>
                </div>
                <Image
                  src={wilburySvg}
                  alt="Wilbury Way"
                  className="w-full h-auto"
                  priority={false}
                />
              </div>

              {/* Form (8/12) */}
              <div className="col-span-12 md:col-span-8">
                <div className="bg-white rounded-lg shadow-lg p-8 hubspot-form-wrapper">
                  <JobApplicationForm jobTitle={job.title} />
                </div>
              </div>
            </div>

            {/* Keep your form style overrides */}
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
      .hubspot-form-wrapper .hs-hidden { display: none !important; }
    `}</style>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

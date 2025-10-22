import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ApproachBlock from '../../components/GlobalBlocks/ApproachBlock';
import CaseStudies from '../../components/GlobalBlocks/CaseStudies';
import Image from 'next/image'
import UnderlinedTitle from '@/components/UnderlinedTitle';
import { getTechnologiesWithPagination, getGlobalContent } from '@/lib/graphql-queries.js';
import GlobalTailSections from '@/components/GlobalBlocks/GlobalTailSections.jsx';
import ServicesSlider from '@/components/GlobalBlocks/ServicesSlider.jsx';

export const revalidate = 300

export const metadata = {
  title: 'Technologies - CDA Systems',
  description: 'Technologies and platforms we use.',
  alternates: { canonical: '/technologies' },
}

export default async function TechnologiesPage() {
  const { nodes: technologies } = await getTechnologiesWithPagination({ first: 100 })
  const globalData = await getGlobalContent()

  const stripHtml = (html) => html?.replace(/<[^>]*>/g, '') || ''
  const truncateText = (text, maxLength = 120) => {
    if (!text) return ''
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
  }
  return (
    <>
      <Header />

      {/* Standard Hero Section */}
      <section className="bg-white py-16">
        <div className="mx-auto w-full max-w-[1620px] px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Left: Title + Copy */}
            <div>
              <UnderlinedTitle
                as="h1"
                className="cda-page-title mb-6"
                underlineColor="#AD80F9"
                size="large"
              >
                The Technologies We Use
              </UnderlinedTitle>
              <p className="text-lg text-[#4B5563] leading-relaxed max-w-2xl">
                Discover the cutting-edge technologies and frameworks we use to build exceptional digital solutions for our clients.
              </p>
            </div>
            {/* Right: Illustration */}
            <div className="flex justify-center lg:justify-end">
              <img src="/images/drone.svg" alt="Technologies illustration" className="w-full max-w-[600px] h-auto object-contain" />
            </div>
          </div>
        </div>
      </section>

      {/* Technologies Cards Section */}
      <section className="bg-white py-16">
        <div className="mx-auto w-full max-w-[1620px] px-4 md:px-6 lg:px-8">
          {technologies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {technologies.map((tech) => (
                <div key={tech.id} className="tech-card bg-white border border-gray-200 p-10 hover:shadow-md transition-shadow duration-300">
                  {/* Top: Brand/Technology Logo */}
                  <div className="mb-8">
                    {tech.featuredImage?.node?.sourceUrl ? (
                      <img
                        src={tech.featuredImage.node.sourceUrl}
                        alt={tech.featuredImage.node.altText || tech.title}
                        className="h-16 w-auto object-contain"
                        loading="lazy"
                      />
                    ) : (
                      <div className="h-16 w-40 bg-gray-100" />
                    )}
                  </div>

                  {/* Body copy */}
                  <div className="text-black text-2xl leading-relaxed mb-10">
                    {stripHtml(tech.excerpt || tech.content) || 'Discover how we use this technology to deliver reliable, scalable experiences.'}
                  </div>

                  {/* CTA */}
                  <div>
                    <a href="/contact" className="button-l-transparent">Find Out More</a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* No Technologies Placeholder */
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Technologies Found</h3>
                <p className="text-gray-600">
                  We're currently updating our technology showcase. Check back soon to see our full tech stack.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Approach Global Block right after technologies */}
      {globalData?.approach && (
        <ApproachBlock
          globalData={globalData.approach}
          pageData={null}
          useOverride={false}
        />
      )}

      {/* Services Slider (static component fed by Services CPT) */}
      <ServicesSlider />

      {/* Global tail sections (Case Studies, Approach) */}
      <GlobalTailSections globalData={globalData} enableStats={false} />

      <Footer />
    </>
  );
}


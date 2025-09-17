import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ApproachBlock from '../../components/GlobalBlocks/ApproachBlock';
import CaseStudies from '../../components/GlobalBlocks/CaseStudies';
import Image from 'next/image'
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
      
      {/* Page Header */}
      <section className="bg-white py-16">
        <div className="mx-auto w-full max-w-[1620px] px-4 md:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-medium text-[#FF6B35] uppercase tracking-wide mb-4">Technologies</p>
            <h1 className="text-4xl md:text-5xl font-bold text-black mb-6">
              Technologies We Use
            </h1>
            <p className="text-lg text-[#4B5563] max-w-3xl mx-auto leading-relaxed">
              Discover the cutting-edge technologies and frameworks we use to build exceptional digital solutions for our clients.
            </p>
          </div>
        </div>
      </section>

      {/* Technologies Cards Section */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto w-full max-w-[1620px] px-4 md:px-6 lg:px-8">
          {technologies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {technologies.map((tech) => (
                <div key={tech.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-200">
                  {/* Featured Image */}
                  {tech.featuredImage?.node?.sourceUrl && (
                    <div className="aspect-video relative overflow-hidden">
<Image
                        src={tech.featuredImage.node.sourceUrl}
                        alt={tech.featuredImage.node.altText || tech.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  
                  {/* Card Content */}
                  <div className="p-6">
                    {/* Title */}
                    <h3 className="text-xl font-bold text-black mb-3 leading-tight">
                      {tech.title}
                    </h3>
                    
                    {/* Text/Excerpt */}
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {truncateText(stripHtml(tech.excerpt || tech.content))}
                    </p>
                    
                    {/* Button */}
                    <a
                      href={tech.uri}
                      className="inline-flex items-center px-6 py-3 bg-[#FF6B35] text-white font-medium rounded-lg hover:bg-[#e55a2b] transition-colors duration-300 group"
                    >
                      Learn More
                      <svg 
                        className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
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


      {/* Services Slider (static component fed by Services CPT) */}
      <ServicesSlider />

      {/* Global tail sections (Case Studies, Approach) */}
      <GlobalTailSections globalData={globalData} />
      
      <Footer />
    </>
  );
}


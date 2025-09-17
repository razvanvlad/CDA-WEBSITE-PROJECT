import Header from '../../components/Header';
import Footer from '../../components/Footer';
import PhotoFrame from '../../components/GlobalBlocks/PhotoFrame';
import WhyCdaBlock from '../../components/GlobalBlocks/WhyCdaBlock';
import ServicesAccordion from '../../components/GlobalBlocks/ServicesAccordion';
import Showreel from '../../components/GlobalBlocks/Showreel';
import ApproachBlock from '../../components/GlobalBlocks/ApproachBlock';
import TechnologiesSlider from '../../components/GlobalBlocks/TechnologiesSlider';
import ValuesBlock from '../../components/GlobalBlocks/ValuesBlock';
import LocationsImage from '../../components/GlobalBlocks/LocationsImage';
import CultureGallerySlider from '../../components/GlobalBlocks/CultureGallerySlider';
import StatsBlock from '../../components/GlobalBlocks/StatsBlock';
import { sanitizeTitleHtml } from '../../lib/sanitizeTitleHtml';
import { executeGraphQLQuery, getGlobalContent } from '../../lib/graphql-queries';

export const revalidate = 300;

export default async function AboutPage() {

  const ABOUT_ID = parseInt(process.env.NEXT_PUBLIC_ABOUT_PAGE_ID || '317', 10);

  // Fetch global blocks (approach, values, statsAndNumbers, etc.)
  const globalBlocks = await getGlobalContent();

  // Fetch About page content
  const aboutQuery = `{
    page(id: ${ABOUT_ID}, idType: DATABASE_ID) {
      id
      title
      aboutUsContent {
        contentPageHeader { title text image { node { sourceUrl altText } } cta { url title target } }
        globalContentSelection {
          enableImageFrame
          enableServicesAccordion
          enableWhyCda
          enableShowreel
          enableApproach
          enableTechnologiesSlider
          enableValues
          enableStatsImage
          enableLocationsImage
          enableNewsCarousel
          enableNewsletterSignup
          enableCultureGallerySlider
        }
      }
    }
  }`;
  const aboutRes = await executeGraphQLQuery(aboutQuery);
  const aboutData = aboutRes?.data?.page?.aboutUsContent || {};

  // Normalize technologies logos list in globalBlocks
  const technologiesSlider = globalBlocks?.technologiesSlider
    ? {
        ...globalBlocks.technologiesSlider,
        logos: (globalBlocks.technologiesSlider.logos?.nodes || [])
          .map((node) => ({
            url: node?.featuredImage?.node?.sourceUrl,
            alt: node?.featuredImage?.node?.altText || node?.title || 'Tech logo',
            title: node?.title || 'Technology'
          })),
      }
    : undefined;

  const globalContentBlocks = { ...(globalBlocks || {}), ...(technologiesSlider ? { technologiesSlider } : {}) };
  const globalSelection = aboutData?.globalContentSelection || {};
  const aboutContent = aboutData;

  return (
    <>
      <Header />
      
      {/* About Page Header */}
      {aboutContent?.contentPageHeader && (
        <section className="about-hero-section">
          <div className="mx-auto w-full max-w-[1620px] px-4 md:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="text-center md:text-left">
                <h1 
                  className="title-large-pink mb-6"
                  dangerouslySetInnerHTML={{
                    __html: sanitizeTitleHtml(
                      aboutContent.contentPageHeader.title || 'About Us'
                    )
                  }}
                />
                <div 
                  className="about-hero-subtitle text-lg mb-6"
                  dangerouslySetInnerHTML={{
                    __html: aboutContent.contentPageHeader.text || 'Learn more about our company.'
                  }}
                />
                {aboutContent.contentPageHeader.cta && (
                  <a 
                    href={aboutContent.contentPageHeader.cta.url || '#'} 
                    className="button-l"
                    target={aboutContent.contentPageHeader.cta.target || '_self'}
                  >
                    {aboutContent.contentPageHeader.cta.title || 'Get Started'}
                  </a>
                )}
              </div>
              <div className="flex justify-center">
                {aboutContent.contentPageHeader.image?.node?.sourceUrl ? (
                  <img 
                    src={aboutContent.contentPageHeader.image.node.sourceUrl}
                    alt={aboutContent.contentPageHeader.image.node.altText || 'About Us'}
                    className="w-full h-auto max-w-md rounded-lg"
                  />
                ) : (
                  <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">No header image set in WordPress</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}
      
      {/* Global Content Blocks - Only show if toggles are enabled and data exists */}
      
      {/* Image Frame Block */}
      {globalSelection?.enableImageFrame && globalContentBlocks?.imageFrameBlock && (
        <PhotoFrame globalData={globalContentBlocks.imageFrameBlock} />
      )}

      {/* Services Accordion Block */}
      {globalSelection?.enableServicesAccordion && globalContentBlocks?.servicesAccordion && (
        <ServicesAccordion globalData={globalContentBlocks.servicesAccordion} />
      )}
      
      {/* Why CDA Block */}
      {globalSelection?.enableWhyCda && globalContentBlocks?.whyCda && (
        <WhyCdaBlock globalData={globalContentBlocks.whyCda} />
      )}
      
      {/* Showreel Block */}
      {globalSelection?.enableShowreel && globalContentBlocks?.showreel && (
        <Showreel globalData={globalContentBlocks.showreel} />
      )}
      
      {/* Culture Gallery Slider Block */}
      {globalSelection?.enableCultureGallerySlider && globalContentBlocks?.cultureGallerySlider && (
        <CultureGallerySlider globalData={globalContentBlocks.cultureGallerySlider} />
      )}
      
      {/* Approach Block */}
      {globalSelection?.enableApproach && globalContentBlocks?.approach && (
        <ApproachBlock globalData={globalContentBlocks.approach} />
      )}
      
      {/* Technologies Slider Block */}
      {globalSelection?.enableTechnologiesSlider && globalContentBlocks?.technologiesSlider && (
        <TechnologiesSlider 
          title={globalContentBlocks.technologiesSlider.title}
          subtitle={globalContentBlocks.technologiesSlider.subtitle}
          logos={globalContentBlocks.technologiesSlider.logos}
        />
      )}
      
      {/* Values Block */}
      {globalSelection?.enableValues && globalContentBlocks?.valuesBlock && (
        <ValuesBlock globalData={globalContentBlocks.valuesBlock} />
      )}

      {/* Stats & Numbers Block */}
      {globalSelection?.enableStatsImage && globalContentBlocks?.statsAndNumbers && (
        <StatsBlock data={globalContentBlocks.statsAndNumbers} />
      )}
      
      {/* Locations Block */}
      {globalSelection?.enableLocationsImage && globalContentBlocks?.locationsImage && (
        <LocationsImage globalData={globalContentBlocks.locationsImage} />
      )}
      
      <Footer />
    </>
  );
}

import { getJobListingsWithPagination, getJobListingsSimple, executeGraphQLQuery } from '@/lib/graphql-queries.js'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import JobListingsClient from './JobListingsClient'

// GraphQL query for global content blocks
const GET_GLOBAL_BLOCKS = `
  {
    globalOptions {
      globalContentBlocks {
        cultureGallerySlider {
          title
          subtitle
          useGlobalSocialLinks
          images {
            nodes {
              sourceUrl
              altText
              caption
              id
            }
          }
        }
        newsletterSignup {
          title
          subtitle
          hubspotScript
          termsText
        }
      }
    }
  }
`;

export const metadata = {
  title: 'Career Opportunities - Join CDA Team',
  description: 'Discover exciting career opportunities at CDA. Join our innovative team and help build the future of digital marketing and web development. Find open positions across design, development, marketing, and more.',
  keywords: ['careers', 'job opportunities', 'CDA careers', 'web development jobs', 'digital marketing jobs', 'design jobs', 'remote work'],
  openGraph: {
    title: 'Career Opportunities - Join CDA Team',
    description: 'Discover exciting career opportunities at CDA and join our innovative team of digital professionals.',
    type: 'website',
    images: [
      { url: '/images/careers-og.jpg', width: 1200, height: 630, alt: 'CDA Career Opportunities' },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Career Opportunities - Join CDA Team',
    description: 'Discover exciting career opportunities at CDA and join our innovative team.',
    images: ['/images/careers-twitter.jpg'],
  },
  alternates: { canonical: '/jobs' },
}

export const revalidate = 300

export default async function JobsPage() {
  try {
    // Try ACF query first, fallback to simple query
    let jobListings;
    try {
      const result = await getJobListingsWithPagination({ first: 100 });
      jobListings = result.nodes;
      console.log('ACF query successful, got:', jobListings.length, 'jobs');
    } catch (acfError) {
      console.log('ACF query failed, using simple query:', acfError.message);
      jobListings = await getJobListingsSimple();
      console.log('Simple query successful, got:', jobListings.length, 'jobs');
    }

    // Fetch global blocks for newsletter signup
    let globalBlocks = null;
    try {
      const globalResult = await executeGraphQLQuery(GET_GLOBAL_BLOCKS);
      globalBlocks = globalResult.data?.globalOptions?.globalContentBlocks || null;
    } catch (globalError) {
      console.log('Failed to fetch global blocks:', globalError.message);
    }
    
    return (
      <>
        <Header />
        <JobListingsClient initialItems={jobListings} globalBlocks={globalBlocks} />
        <Footer />
      </>
    )
  } catch (error) {
    console.error('All queries failed:', error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Failed to load job listings. Error: {error.message}</p>
      </div>
    )
  }
}


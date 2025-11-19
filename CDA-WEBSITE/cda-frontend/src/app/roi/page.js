import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CaseStudies from '@/components/GlobalBlocks/CaseStudies';
import Showreel from '@/components/GlobalBlocks/Showreel';
import RoiCalculatorForm from './RoiCalculatorForm';
import { getAllGlobalContentBlocks, getCaseStudiesWithPagination } from '@/lib/graphql-queries';

export const revalidate = 300;

export default async function RoiPage() {
  // Fetch global content blocks for Showreel and Case Studies
  let globalData = null;
  let csData = null;

  try {
    globalData = await getAllGlobalContentBlocks();
  } catch (error) {
    console.error('Error fetching global content blocks:', error);
  }

  // Prepare Case Studies (Global with fallback)
  try {
    csData = globalData?.caseStudiesSection || null;
    if (!csData) {
      const { nodes } = await getCaseStudiesWithPagination({ first: 3 });
      if (nodes && nodes.length > 0) {
        csData = {
          title: 'Some Of Our Case Studies',
          subtitle: 'Our Work',
          knowledgeHubLink: { url: '/case-studies', title: 'See All Case Studies', target: '_self' },
          selectedStudies: {
            nodes: nodes.map(n => ({
              id: n.id,
              title: n.title,
              uri: `/case-studies/${n.slug}`,
              excerpt: n.excerpt,
              featuredImage: n.featuredImage,
            }))
          }
        };
      }
    }
  } catch (error) {
    console.error('Error fetching case studies:', error);
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* ROI Calculator Form Section */}
      <RoiCalculatorForm />

      {/* Case Studies Section */}
      {csData && (
        <CaseStudies globalData={csData} />
      )}

      {/* Showreel Section */}
      {globalData?.showreel && (
        <Showreel globalData={globalData.showreel} />
      )}

      <Footer />
    </div>
  );
}

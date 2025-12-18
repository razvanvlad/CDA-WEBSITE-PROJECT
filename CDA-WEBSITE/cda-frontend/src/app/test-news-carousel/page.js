'use client';

import NewsCarousel from '../../components/GlobalBlocks/NewsCarousel';

export default function TestNewsCarouselPage() {
  // Mock data to test the carousel logic without fetching
  const mockNewsCarousel = {
    title: 'News & Insights (Test)',
    subtitle: 'Latest Updates',
    manualArticles: {
      nodes: [
        {
          id: '1',
          title: 'Big News Article One',
          uri: '/news/article-one',
          date: '2025-01-01T12:00:00',
          excerpt: '<p>This is a short excerpt for the first article.</p>',
          featuredImage: {
            node: {
              sourceUrl: 'https://placehold.co/600x400/3CBEEB/white?text=Article+1',
              altText: 'Article 1',
            },
          },
        },
        {
          id: '2',
          title: 'Secondary Article Two',
          uri: '/news/article-two',
          date: '2025-01-02T12:00:00',
          excerpt: '<p>This is a short excerpt for the second article.</p>',
          featuredImage: {
            node: {
              sourceUrl: 'https://placehold.co/600x400/01E486/white?text=Article+2',
              altText: 'Article 2',
            },
          },
        },
        {
          id: '3',
          title: 'Third Article Three',
          uri: '/news/article-three',
          date: '2025-01-03T12:00:00',
          excerpt: '<p>This is a short excerpt for the third article.</p>',
          featuredImage: {
            node: {
              sourceUrl: 'https://placehold.co/600x400/FD8721/white?text=Article+3',
              altText: 'Article 3',
            },
          },
        },
        {
          id: '4',
          title: 'Fourth Article Four',
          uri: '/news/article-four',
          date: '2025-01-04T12:00:00',
          excerpt: '<p>This is a short excerpt for the fourth article.</p>',
          featuredImage: {
            node: {
              sourceUrl: 'https://placehold.co/600x400/FF60DF/white?text=Article+4',
              altText: 'Article 4',
            },
          },
        },
        {
          id: '5',
          title: 'Fifth Article Five',
          uri: '/news/article-five',
          date: '2025-01-05T12:00:00',
          excerpt: '<p>This is a short excerpt for the fifth article.</p>',
          featuredImage: {
            node: {
              sourceUrl: 'https://placehold.co/600x400/AD80F9/white?text=Article+5',
              altText: 'Article 5',
            },
          },
        },
      ],
    },
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="py-20">
        <h1 className="text-center text-2xl font-bold mb-10">News Carousel Isolation Test</h1>
        <NewsCarousel newsCarousel={mockNewsCarousel} />
      </div>
    </div>
  );
}

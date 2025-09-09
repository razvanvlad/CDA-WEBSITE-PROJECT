export default function NewsArticlePage({ params }) {
  const { slug } = params || {};
  return (
    <div className="min-h-screen bg-white py-16">
      <div className="mx-auto w-full max-w-[900px] px-4 md:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-black mb-4">Article: {slug}</h1>
        <p className="text-[#4B5563]">News article content will appear here.</p>
      </div>
    </div>
  );
}


export default function TechnologiesPage() {
  return (
    <div className="min-h-screen bg-white py-16">
      <div className="mx-auto w-full max-w-[1620px] px-4 md:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-black mb-4">Technologies</h1>
          <p className="text-[#4B5563] max-w-3xl mx-auto">This page will showcase technologies we use. Coming soon.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-gray-50 h-24 rounded-lg shadow-sm flex items-center justify-center text-gray-400">Logo</div>
          ))}
        </div>
      </div>
    </div>
  );
}


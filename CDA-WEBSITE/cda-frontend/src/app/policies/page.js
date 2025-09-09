export default function PoliciesLandingPage() {
  return (
    <div className="min-h-screen bg-white py-16">
      <div className="mx-auto w-full max-w-[1620px] px-4 md:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-black mb-6">Policies</h1>
        <p className="text-[#4B5563] mb-8 max-w-3xl">Browse our policies and guidelines. This index will be populated soon.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => (
            <a key={i} href={`/policies/sample-${i}`} className="bg-gray-50 p-6 rounded-lg shadow-sm block">
              <div className="text-lg font-semibold text-black">Sample Policy {i}</div>
              <div className="text-[#4B5563]">Short description</div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}


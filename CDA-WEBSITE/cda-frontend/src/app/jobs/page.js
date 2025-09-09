export default function JobsPage() {
  return (
    <div className="min-h-screen bg-white py-16">
      <div className="mx-auto w-full max-w-[1620px] px-4 md:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-black mb-4">Job Openings</h1>
          <p className="text-[16px] leading-[1.7] text-[#4B5563] max-w-3xl mx-auto">Our careers section is coming soon. Check back for open roles!</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <div className="text-sm font-semibold text-black">Role Title</div>
              <div className="text-[#4B5563]">Short role summary</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


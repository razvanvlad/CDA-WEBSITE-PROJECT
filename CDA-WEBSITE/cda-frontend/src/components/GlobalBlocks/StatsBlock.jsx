import Image from 'next/image'

export default function StatsBlock({ data }) {
  if (!data) return null
  const { image, stats = [], description } = data
  const cta = data?.cta || data?.button

  return (
    <section className="stats-block py-16 bg-[#F7F7F8]">
      <div className="mx-auto w-full max-w-[1620px] px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left: Stats and description */}
          <div className="lg:col-span-7">
            {/* Four stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
              {(stats || []).slice(0,4).map((s, i) => (
                <div key={i}>
                  <div className="text-5xl font-extrabold text-black leading-none mb-2">{s?.number}</div>
                  <div className="text-gray-700 text-lg">{s?.text}</div>
                </div>
              ))}
            </div>

            {description && (
              <p className="text-gray-700 text-base md:text-lg leading-relaxed max-w-2xl mb-6">{description}</p>
            )}

            {cta?.url && (
              <a href={cta.url} target={cta.target || '_self'} className="inline-flex items-center px-6 py-3 border border-black text-black hover:bg-black hover:text-white transition">
                {cta.title || 'Learn More'}
              </a>
            )}
          </div>

          {/* Right: Illustration */}
          <div className="lg:col-span-5">
            {image?.node?.sourceUrl && (
              <div className="relative w-full pb-[80%]">
                <Image src={image.node.sourceUrl} alt={image.node.altText || 'Stats Illustration'} fill className="object-contain" />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}


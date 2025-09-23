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
              {(stats || []).slice(0,4).map((s, i) => {
                const underlineClasses = ['underline-pink', 'underline-purple', 'underline-light-blue', 'underline-orange']
                const uClass = underlineClasses[i % underlineClasses.length]
                return (
                  <div key={i}>
                    <div className="text-black" style={{ fontFamily: 'Poppins, sans-serif', fontSize: 70, fontWeight: 700, lineHeight: 1 }}>
                      <span className={`underline-thick ${uClass}`}>{s?.number}</span>
                    </div>
                    <div className="mt-3 text-gray-700 text-lg">{s?.text}</div>
                  </div>
                )
              })}
            </div>

            {(description || cta?.url) && (
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                {description && (
                  <p className="text-gray-700 text-base md:text-lg leading-relaxed max-w-2xl m-0">{description}</p>
                )}
                {cta?.url && (
                  <a href={cta.url} target={cta.target || '_self'} className="button-l md:ml-6 shrink-0">Our Careers</a>
                )}
              </div>
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


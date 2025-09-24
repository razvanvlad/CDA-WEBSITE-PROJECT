import Image from 'next/image'
import SectionBand from '@/components/SectionBand'

/**
 * StatsBlock with adjustable gray band.
 * Props:
 * - bandPosition: 'top' | 'center' | 'bottom' | number (px) | '30%' (default: 'center')
 * - bandHeight: Tailwind height classes, e.g. "h-[240px] md:h-[300px]" (default below)
 * - bandColor: Tailwind bg color class (default: "bg-gray-100")
 * - className: extra classes for the outer SectionBand
 */
export default function StatsBlock({
  data,
  bandPosition = 'center',
  bandHeight = 'h-[340px] md:h-[400px]',
  bandColor = 'bg-gray-100',
  className = '',
}) {
  if (!data) return null
  const { image, stats = [], description } = data
  const cta = data?.cta || data?.button

  return (
    <SectionBand
      className={`bg-white ${className}`}
      color={bandColor}
      position={bandPosition}
      height={bandHeight}
    >
      <section className="stats-block py-16">
        <div className="mx-auto w-full max-w-[1620px] px-4 md:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left: Stats and description */}
            <div className="lg:col-span-7">
              {/* Four stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
                {(stats || []).slice(0, 4).map((s, i) => {
                  const underlineClasses = [
                    'underline-pink',
                    'underline-purple',
                    'underline-light-blue',
                    'underline-orange',
                  ]
                  const uClass = underlineClasses[i % underlineClasses.length]
                  return (
                    <div key={i}>
                      <div
                        className="text-black"
                        style={{
                          fontFamily: 'Poppins, sans-serif',
                          fontSize: 70,
                          fontWeight: 700,
                          lineHeight: 1,
                        }}
                      >
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
                    <p className="text-gray-700 text-base md:text-lg leading-relaxed max-w-2xl m-0">
                      {description}
                    </p>
                  )}
                  {cta?.url && (
                    <a
                      href={cta.url}
                      target={cta.target || '_self'}
                      className="button-l-transparent md:ml-6 shrink-0"
                    >
                      {cta.title || 'Our Careers'}
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Right: Illustration */}
            <div className="lg:col-span-5">
              {image?.node?.sourceUrl && (
                <div className="relative w-full pb-[80%]">
                  <Image
                    src={image.node.sourceUrl}
                    alt={image.node.altText || 'Stats Illustration'}
                    fill
                    className="object-contain"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </SectionBand>
  )
}

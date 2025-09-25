import React from 'react'

export default function ThreeColumnsWithIcons({ globalData }) {
  if (!globalData) return null
  const title = globalData.sectionTitle || globalData.title || null
  const subtitle = globalData.subtitle || null
  const columns = Array.isArray(globalData.columns) ? globalData.columns : []

  if (!title && !subtitle && columns.length === 0) return null

  return (
    <section className="py-16 md:py-20 lg:py-24 bg-white">
      <div className="mx-auto w-full max-w-[1620px] px-4 md:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          {subtitle && (
            <p className="text-xs tracking-[0.18em] font-semibold uppercase text-black mb-3">{subtitle}</p>
          )}
          {title && (
            <h2 className="text-[32px] md:text-[40px] font-bold text-black">{title}</h2>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {columns.map((col, idx) => {
            const iconUrl = col?.icon?.node?.sourceUrl || null
            return (
              <div key={idx} className="p-6 rounded-xl border border-gray-200 bg-white shadow-sm">
                {iconUrl ? (
                  <img src={iconUrl} alt={col?.icon?.node?.altText || col.title || 'Icon'} className="w-10 h-10 mb-4" />
                ) : col.iconClass ? (
                  <div className="text-3xl mb-4"><i className={col.iconClass} aria-hidden="true" /></div>
                ) : null}
                {col.title && (
                  <h3 className="text-xl font-bold text-black mb-2">{col.title}</h3>
                )}
                {(col.text || col.description) && (
                  <p className="text-[16px] leading-[1.7] text-black">{col.text || col.description}</p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}


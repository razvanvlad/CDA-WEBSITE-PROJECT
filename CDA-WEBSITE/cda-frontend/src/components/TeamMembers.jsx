import React from 'react'
import ResponsiveUnderlinedTitle from './ResponsiveUnderlinedTitle'
import TeamSlider from './TeamSlider'

export default function TeamMembers({ subtitle, title, teamMembers = [] }) {
  if (!teamMembers || teamMembers.length === 0) {
    return (
      <section className="py-16 bg-white">
        <div className="mx-auto w-full max-w-[1620px] px-[38px] md:px-6 lg:px-8">
          <div className="bg-gray-50 p-8 rounded-lg text-center">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No team members found</h3>
            <p className="text-gray-600">Add team members in WP → Team Members.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-white">
      <div className="mx-auto w-full max-w-[1620px] px-[38px] md:px-6 lg:px-8">
        <div className="mb-8">
          {subtitle && <p className="cda-subtitle">{subtitle}</p>}
          {title && (
            <ResponsiveUnderlinedTitle
              as="h2"
              className="section-title"
              underlineColor="#FF5C8A"
            >
              {title}
            </ResponsiveUnderlinedTitle>
          )}
        </div>
        <TeamSlider teamMembers={teamMembers} />
      </div>
    </section>
  )
}

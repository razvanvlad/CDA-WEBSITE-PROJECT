import React from 'react';

export default function JoinOurTeamCTA({ title = 'Join Our Team', description = 'We are always looking for passionate people to join our mission.', primary = { title: 'Open Positions', url: '/jobs' } }) {
  return (
    <section className="py-16 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white">
      <div className="mx-auto w-full max-w-[1620px] px-4 md:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">{description}</p>
        <div className="flex flex-wrap gap-4 justify-center">
          <a href={primary?.url || '#'} className="inline-block bg-white text-blue-900 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
            {primary?.title || 'Open Positions'}
          </a>
          <a href="/contact" className="inline-block border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-900 transition-colors">
            Contact Us
          </a>
        </div>
      </div>
    </section>
  );
}


import React from 'react'
import Image from 'next/image'
import ResponsiveUnderlinedTitle from '../ResponsiveUnderlinedTitle'

export default function ResultsCards({ results }) {
    if (!results) return null

    const { title, first, second, third } = results

    const metrics = [first, second, third].filter(m => m && m.number)

    if (metrics.length === 0) return null

    // Colors matching the design/StatSection
    const colors = ['#FF5C8A', '#AD80F9', '#FF5C8A']

    return (
        <div className="w-full">
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">
                {/* Left Content */}
                <div className="w-full lg:w-2/3">
                    {title && (
                        <h2 className="text-4xl font-bold text-gray-900 mb-12">The Results</h2>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                        {metrics.map((item, index) => (
                            <div key={index} className="flex flex-col items-start">
                                {/* Label */}
                                {item.metric && (
                                    <span className="text-lg font-bold text-gray-900 mb-4 block">
                                        {item.metric}
                                    </span>
                                )}

                                {/* Number with Underline */}
                                {item.number && (
                                    <div className="mb-4">
                                        <ResponsiveUnderlinedTitle
                                            as="h3"
                                            underlineColor={colors[index % colors.length]}
                                            underlineOffset={8}
                                            className="inline-block"
                                        >
                                            <span className="text-5xl font-bold text-gray-900 block pb-2">
                                                {item.number}
                                            </span>
                                        </ResponsiveUnderlinedTitle>
                                    </div>
                                )}

                                {/* Description */}
                                {item.text && (
                                    <p className="text-gray-600 leading-relaxed text-sm">
                                        {item.text}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Image (Frog) */}
                <div className="w-full lg:w-1/3 flex justify-center lg:justify-end">
                    <div className="relative w-full max-w-[400px] aspect-square">
                        {/* Using standard img tag for external localhost URL to avoid Next.js config complexity for now, or assume standard Image if configured. 
                            Given the user provided a full URL, and it's SVG, simple img is often safest for immediate rendering without config changes. */}
                        <img
                            src="http://localhost/CDA-WEBSITE-PROJECT/CDA-WEBSITE/wordpress-backend/wp-content/uploads/2025/09/Group-283.svg"
                            alt="Results Illustration"
                            className="w-full h-auto object-contain"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

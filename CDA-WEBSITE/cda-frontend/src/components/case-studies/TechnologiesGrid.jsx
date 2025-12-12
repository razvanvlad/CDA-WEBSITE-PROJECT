import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function TechnologiesGrid({ technologies }) {
    if (!technologies || !technologies.nodes || technologies.nodes.length === 0) {
        return null
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {technologies.nodes.map((tech) => (
                <Link
                    key={tech.id}
                    href={tech.uri || `/technologies/${tech.slug}`}
                    className="group flex flex-col items-center justify-center p-6 bg-white border border-gray-100 rounded-xl hover:shadow-lg hover:border-purple-100 transition-all duration-300"
                >
                    {tech.featuredImage?.node?.sourceUrl && (
                        <div className="relative w-12 h-12 mb-3 grayscale group-hover:grayscale-0 transition-all duration-300">
                            <Image
                                src={tech.featuredImage.node.sourceUrl}
                                alt={tech.featuredImage.node.altText || tech.title}
                                fill
                                className="object-contain"
                            />
                        </div>
                    )}
                    <span className="text-sm font-semibold text-gray-500 group-hover:text-purple-600 transition-colors">
                        {tech.title}
                    </span>
                </Link>
            ))}
        </div>
    )
}

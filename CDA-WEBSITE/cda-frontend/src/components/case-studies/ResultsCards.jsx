import React from 'react'

export default function ResultsCards({ results }) {
    if (!results) return null

    const { title, first, second, third } = results

    const metrics = [first, second, third].filter(m => m && m.number)

    if (metrics.length === 0) return null

    return (
        <div className="w-full">
            {title && (
                <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">{title}</h2>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {metrics.map((item, index) => (
                    <div
                        key={index}
                        className="bg-white p-8 rounded-2xl shadow-sm border-2 border-transparent hover:border-purple-100 hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center"
                    >
                        {item.metric && (
                            <span className="text-lg font-semibold text-gray-500 mb-2 uppercase tracking-wide">
                                {item.metric}
                            </span>
                        )}

                        {item.number && (
                            <div className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500 mb-4 font-outfit">
                                {item.number}
                            </div>
                        )}

                        {item.text && (
                            <p className="text-gray-600 leading-relaxed">
                                {item.text}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

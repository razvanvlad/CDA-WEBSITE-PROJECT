'use client';

import React, { useState } from 'react';
import Image from 'next/image';

const FullVideoBlock = ({ data }) => {
    const [isPlaying, setIsPlaying] = useState(false);

    const raw = data?.file?.node?.sourceUrl || data?.url;
    if (!raw) return null;

    const isVimeo = /vimeo\.com/.test(raw);
    const isYouTube = /youtube\.com|youtu\.be/.test(raw);

    let embedUrl = raw;
    if (isVimeo) {
        const m = raw.match(/vimeo\.com\/(?:video\/)?(?:.+\/)?(\d+)/);
        const id = m && m[1];
        if (id) embedUrl = `https://player.vimeo.com/video/${id}?autoplay=1&title=0&byline=0&portrait=0`;
    } else if (isYouTube) {
        // Handle youtube autoplay if needed
    }

    const handlePlay = () => {
        setIsPlaying(true);
    };

    return (
        <section className="py-16 bg-white">
            {/* 1616px max width container */}
            <div className="mx-auto w-full max-w-[1616px] px-4">
                <div
                    className="relative aspect-video w-full rounded-2xl overflow-hidden bg-gray-100"
                    style={{
                        // Explicitly rounding corners
                    }}
                >
                    {isPlaying ? (
                        isVimeo || isYouTube ? (
                            <iframe
                                src={embedUrl}
                                className="w-full h-full"
                                allow="autoplay; fullscreen; picture-in-picture"
                                allowFullScreen
                            />
                        ) : (
                            <video className="w-full h-full object-cover" controls autoPlay>
                                <source src={raw} />
                            </video>
                        )
                    ) : (
                        <div
                            className="absolute inset-0 z-10 cursor-pointer group"
                            onClick={handlePlay}
                            style={{
                                cursor: 'url(/images/play-cursor.svg) 40 40, auto' // Adjust hot spot if needed
                            }}
                        >
                            {/* Thumbnail Image */}
                            <Image
                                src="/images/thumbnail-video.png"
                                alt="Video Thumbnail"
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />

                            {/* Overlay gradient/tint if requested? User didn't ask, but good practice. Keeping it clean for now. */}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default FullVideoBlock;

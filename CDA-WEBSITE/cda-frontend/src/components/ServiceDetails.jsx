import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const ServiceDetails = ({ serviceDetailsFields }) => {
    if (!serviceDetailsFields) return null;

    const { title, text, cta, checkmark } = serviceDetailsFields;

    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4" style={{ maxWidth: '1620px' }}>
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

                    {/* Left Side: Bullet Points from ACF checkmark array */}
                    {checkmark && checkmark.length > 0 && (
                        <div className="w-full lg:w-1/2 order-2 lg:order-1">
                            <ul className="space-y-8">
                                {checkmark.map((item, index) => (
                                    <li key={index} className="flex items-center gap-6">
                                        <div className="flex-shrink-0">
                                            <Image
                                                src="/images/services/bullet-services.svg"
                                                alt="Check"
                                                width={40}
                                                height={41}
                                                className="w-[27px] h-[28px] lg:w-[40px] lg:h-[41px]"
                                            />
                                        </div>
                                        <span className="text-lg lg:text-xl font-bold text-black">
                                            {item.title}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Right Side: Content Card from ACF */}
                    <div className="w-full lg:w-1/2 order-1 lg:order-2">
                        <div className="bg-white p-8 lg:p-12 shadow-sm">
                            {title && (
                                <h2 className="text-3xl lg:text-4xl font-bold text-black mb-6 leading-tight">
                                    {title}
                                </h2>
                            )}
                            {text && (
                                <p className="text-gray-600 text-lg leading-relaxed mb-8">
                                    {text}
                                </p>
                            )}
                            {cta?.url && cta?.title && (
                                <Link
                                    href={cta.url}
                                    className="button-l"
                                    target={cta.target || '_self'}
                                >
                                    {cta.title}
                                </Link>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default ServiceDetails;

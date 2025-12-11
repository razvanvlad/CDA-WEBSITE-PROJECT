import ResponsiveUnderlinedTitle from './ResponsiveUnderlinedTitle';
import Image from 'next/image';
import COLORS from '../constants/colors';

export default function ServiceStatsSection({ numbersFields }) {
    if (!numbersFields) return null;

    const { leftTitle, leftText, rightTitle, rightText, stats } = numbersFields;

    // Don't render if there's no meaningful content
    if ((!stats || stats.length === 0) && !leftTitle && !rightTitle) return null;

    // Hardcoded underline colors in order (exactly 4 stats expected)
    const underlineColors = [COLORS.REDISH_PINK, COLORS.PURPLE, COLORS.BLUE, COLORS.ORANGE];

    return (
        <section className="stats-section bg-white py-16 lg:py-24 relative">
            <div className="container mx-auto px-4" style={{ maxWidth: '1620px' }}>
                {/* Stats Grid from ACF */}
                {stats && stats.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-20 lg:mb-24">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <ResponsiveUnderlinedTitle
                                    as="span"
                                    className="text-4xl lg:text-5xl font-bold"
                                    underlineOffset={42}
                                    underlineColor={underlineColors[index % underlineColors.length]}
                                >
                                    {stat.number}
                                </ResponsiveUnderlinedTitle>
                                <p className="text-base text-gray-700 leading-relaxed mt-4">
                                    {stat.text}
                                </p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Content Sections from ACF */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 relative">
                    {/* Left Section */}
                    {leftTitle && leftText && (
                        <div>
                            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
                                {leftTitle}
                            </h3>
                            <p className="text-base lg:text-lg text-gray-700 leading-relaxed">
                                {leftText}
                            </p>
                        </div>
                    )}

                    {/* Right Section */}
                    {rightTitle && rightText && (
                        <div>
                            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
                                {rightTitle}
                            </h3>
                            <p className="text-base lg:text-lg text-gray-700 leading-relaxed">
                                {rightText}
                            </p>
                        </div>
                    )}

                    {/* Dog Illustration - Bottom Right (Desktop only) */}
                    <div className="hidden lg:block absolute bottom-0 right-0 pointer-events-none" style={{ width: '200px', height: '120px' }}>
                        {/* Placeholder for dog illustration if you have one */}
                        {/* <Image src="/images/dog-illustration.svg" alt="" width={200} height={120} /> */}
                    </div>
                </div>
            </div>
        </section>
    );
}

import ResponsiveUnderlinedTitle from './ResponsiveUnderlinedTitle';
import Image from 'next/image';

export default function StatsSection() {
    const stats = [
        {
            value: '£265.2',
            suffix: 'BN',
            description: 'Total value of the UK e-commerce market in 2024',
            underlineColor: '#FF5C8A', // Pink/Red
        },
        {
            value: '30.4%',
            suffix: '',
            description: 'Percentage of total UK retail sales online in 2024',
            underlineColor: '#AD80F9', // Purple
        },
        {
            value: '£2,137',
            suffix: '',
            description: 'Average annual spend per UK online shopper',
            underlineColor: '#3CBEEB', // Cyan/Blue
        },
        {
            value: '7.32%',
            suffix: '',
            description: 'Year-on-year growth rate of the UK ecommerce market in 2024',
            underlineColor: '#FD8721', // Orange
        },
    ];

    return (
        <section className="stats-section bg-white py-16 lg:py-24 relative">
            <div className="container mx-auto px-4" style={{ maxWidth: '1620px' }}>
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-20 lg:mb-24">
                    {stats.map((stat, index) => (
                        <div key={index} className="text-center">
                            <div className="mb-6">
                                <ResponsiveUnderlinedTitle
                                    as="h2"
                                    underlineColor={stat.underlineColor}
                                    underlineOffset={8}
                                >
                                    <span className="text-4xl lg:text-5xl font-bold">
                                        {stat.value}{stat.suffix && <span className="text-2xl lg:text-3xl font-normal ml-1">{stat.suffix}</span>}
                                    </span>
                                </ResponsiveUnderlinedTitle>
                            </div>
                            <p className="text-base text-gray-700 leading-relaxed">
                                {stat.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Content Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 relative">
                    {/* Left: Ecommerce For Every Business */}
                    <div>
                        <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
                            Ecommerce For Every Business
                        </h3>
                        <p className="text-base lg:text-lg text-gray-700 leading-relaxed">
                            Selling direct-to-consumer, running a B2B eCommerce operation, or expanding
                            internationally? Our human approach to digital puts the customer at the centre and
                            creates seamless digital experiences around them. No matter who or where your
                            customer is, we'll craft scalable solutions that help you sell to them successfully —
                            no clunky jargon, just real results.
                        </p>
                    </div>

                    {/* Right: Designed For Mobile-First Shoppers */}
                    <div>
                        <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
                            Designed For Mobile-First Shoppers
                        </h3>
                        <p className="text-base lg:text-lg text-gray-700 leading-relaxed">
                            With <strong>58%</strong> of global online traffic coming from mobile users, we put mobile at the heart
                            of every eCommerce site we build. We create fully responsive stores that look and
                            perform flawlessly on any screen.
                        </p>
                    </div>

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

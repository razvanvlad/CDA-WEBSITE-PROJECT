import React from 'react';
import ResponsiveUnderlinedTitle from '../ResponsiveUnderlinedTitle';

const StatsAndContentSection = ({
  stats = [
    {
      number: "£265.2BN",
      description: "Total value of the UK ecommerce market in 2024",
      underlineColor: "#3CBEEB" // Brand blue
    },
    {
      number: "30.4%",
      description: "Percentage of total UK sales made online in 2024",
      underlineColor: "#01E486" // Brand green
    },
    {
      number: "£2,137",
      description: "Average annual spend per UK online shopper",
      underlineColor: "#FF60DF" // Brand pink
    },
    {
      number: "7.32%",
      description: "Year-on-year growth rate of the UK ecommerce market",
      underlineColor: "#FD8721" // Brand orange
    }
  ],
  columns = [
    {
      title: "Ecommerce For Every Business",
      content: [
        "Whether you're a startup finding your feet or an established enterprise scaling to new heights, our ecommerce solutions are built to grow with you. We understand that no two businesses are alike, which is why our platform is designed to be flexible and adaptable to your unique needs.",
        "From small boutiques to large-scale retailers, we provide the tools and support needed to succeed in the competitive online marketplace. Our scalable infrastructure ensures your site performs flawlessly whether you're processing 10 orders or 10,000 orders per day.",
        "Every business deserves access to enterprise-level features without enterprise-level complexity. Our intuitive platform puts powerful ecommerce capabilities at your fingertips, allowing you to focus on what you do best—running your business."
      ]
    },
    {
      title: "Designed For Mobile-First Shoppers",
      content: [
        "Today's shoppers are increasingly mobile, with the majority of ecommerce traffic now coming from smartphones and tablets. Our platforms are built mobile-first, ensuring your customers enjoy a seamless shopping experience regardless of the device they're using.",
        "Fast loading times, intuitive navigation, and streamlined checkout processes are optimized for touchscreens and smaller displays. Every interaction is designed to reduce friction and increase conversion rates on mobile devices.",
        "With responsive design at the core of everything we build, your store will look stunning and perform flawlessly across all screen sizes. From product browsing to secure payment, we've perfected the mobile shopping journey."
      ]
    }
  ],
  className = ""
}) => {
  return (
    <section className={`stats-and-content-section py-16 md:py-20 lg:py-24 ${className}`}>
      <div className="cda-container">

        {/* PART 1 - STATISTICS ROW */}
        <div className="stats-row mb-16 md:mb-20 lg:mb-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 lg:gap-12">
            {stats.map((stat, index) => (
              <div key={index} className="stat-item text-center lg:text-left">
                <ResponsiveUnderlinedTitle
                  as="div"
                  className="stat-number text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
                  underlineColor={stat.underlineColor}
                >
                  {stat.number}
                </ResponsiveUnderlinedTitle>
                <p className="stat-description text-sm md:text-base text-gray-600 leading-relaxed">
                  {stat.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* PART 2 - TWO COLUMN CONTENT */}
        <div className="two-column-content">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-12 lg:gap-16">
            {columns.map((column, index) => (
              <div key={index} className="content-column">
                <h3 className="text-2xl md:text-3xl font-bold mb-6 font-poppins">
                  {column.title}
                </h3>
                <div className="space-y-4">
                  {column.content.map((paragraph, pIndex) => (
                    <p key={pIndex} className="text-base md:text-lg text-gray-700 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default StatsAndContentSection;

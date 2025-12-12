'use client';
import Image from 'next/image';

interface TestimonialCardProps {
  title?: string;
  text?: string;
  logo?: string;
  profile?: string;
  name?: string;
  job?: string;
  className?: string;
}

export default function TestimonialCard({
  title = "What The Client Had To Say",
  text = "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.",
  logo = "/images/testimonial/oakleigh-testimonial-desktop.png",
  profile = "/images/testimonial/user-profile-testimonial-desktop.png",
  name = "Client Name",
  job = "Job Position",
  className = ""
}: TestimonialCardProps) {
  return (
    <section className={`w-full py-16 lg:py-24 overflow-x-hidden ${className}`}>
      <div className="max-w-[1400px] mx-auto px-4 lg:px-20">
        {/* Title */}
        <h2 className="text-[38px] font-bold font-['Poppins'] text-center mb-12 lg:mb-16">
          {title}
        </h2>

        {/* Card container with quotes */}
        <div className="relative w-full flex justify-center mb-8">
          {/* Top-left quotes OUTSIDE card - adjusted positioning */}
          <div className="absolute left-[-20px] top-[-20px] lg:left-[-60px] lg:top-[-60px] z-10 pointer-events-none">
            {/* Desktop quote */}
            <div className="hidden lg:block w-[120px] h-[180px]">
              <Image
                src="/images/testimonial/top-quote.svg"
                alt=""
                width={120}
                height={180}
              />
            </div>
            {/* Mobile quote */}
            <div className="lg:hidden w-[80px] h-[120px]">
              <Image
                src="/images/testimonial/top-quote-mobile.svg"
                alt=""
                width={80}
                height={120}
              />
            </div>
          </div>

          {/* Main gray card - NO FIXED HEIGHT */}
          <div className="relative bg-gray-100 w-[calc(100%-3rem)] max-w-[353px] lg:max-w-none lg:w-[1144px] mx-auto py-8 lg:py-12 px-6 lg:px-16">
            {/* Quote text with adjusted margin */}
            <div
              className="text-black text-base lg:text-lg leading-relaxed lg:leading-9 mb-6 lg:mb-12"
              dangerouslySetInnerHTML={{ __html: text }} // Use dangerouslySetInnerHTML to support formatted text if needed
            />

            {/* DESKTOP CLIENT INFO */}
            <div className="hidden lg:flex items-center gap-6">
              {/* Company logo container - NO BORDER */}
              {logo && (
                <div className="bg-white px-6 py-4 flex items-center justify-center min-w-[200px]">
                  <Image
                    src={logo}
                    alt="Company logo"
                    width={180}
                    height={60}
                    className="hidden lg:block object-contain"
                  />
                </div>
              )}

              {/* Client photo - NO BORDER */}
              {profile && (
                <Image
                  src={profile}
                  alt="Client photo"
                  width={80}
                  height={80}
                  className="rounded-full object-cover w-[80px] h-[80px]"
                />
              )}

              {/* Client details */}
              <div>
                <p className="text-black text-xl font-bold font-['Poppins'] capitalize">
                  {name}
                </p>
                <p className="text-black text-xl font-normal font-['Inter']">
                  {job}
                </p>
              </div>
            </div>

            {/* MOBILE CLIENT INFO */}
            <div className="lg:hidden flex flex-col items-center gap-6">
              {/* Company logo container - NO BORDER */}
              {logo && (
                <div className="bg-white px-6 py-4 flex items-center justify-center w-full max-w-[280px]">
                  <Image
                    src={logo} // Use same logo, assuming responsive handling or generic support
                    alt="Company logo"
                    width={200}
                    height={60}
                    className="lg:hidden object-contain"
                  />
                </div>
              )}

              {/* Client photo and details */}
              <div className="flex flex-col items-center gap-3">
                {/* Client photo - NO BORDER */}
                {profile && (
                  <Image
                    src={profile}
                    alt="Client photo"
                    width={100}
                    height={100}
                    className="rounded-full object-cover w-[100px] h-[100px]"
                  />
                )}
                <div className="text-center">
                  <p className="text-black text-xl font-bold font-['Poppins'] capitalize">
                    {name}
                  </p>
                  <p className="text-black text-lg font-normal font-['Inter']">
                    {job}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom-right quotes OUTSIDE card - adjusted positioning */}
          <div className="absolute right-[-20px] bottom-[-20px] lg:right-[-60px] lg:bottom-[-60px] z-10 pointer-events-none">
            {/* Desktop quote */}
            <div className="hidden lg:block w-[160px] h-[160px]">
              <Image
                src="/images/testimonial/bottom-quote.svg"
                alt=""
                width={160}
                height={160}
              />
            </div>
            {/* Mobile quote */}
            <div className="lg:hidden w-[100px] h-[100px]">
              <Image
                src="/images/testimonial/bottom-quote-mobile.svg"
                alt=""
                width={100}
                height={100}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

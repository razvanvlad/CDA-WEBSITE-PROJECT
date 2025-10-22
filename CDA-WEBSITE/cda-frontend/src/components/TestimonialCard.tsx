'use client';
import Image from 'next/image';

export default function TestimonialCard() {
  return (
    <section className="w-full py-16 lg:py-24 overflow-x-hidden">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-20">
        {/* Title */}
        <h2 className="text-[38px] font-bold font-['Poppins'] text-center mb-12 lg:mb-16">
          What The Client Had To Say
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
            <p className="text-black text-base lg:text-lg leading-relaxed lg:leading-9 mb-6 lg:mb-12">
              Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.
            </p>

            {/* DESKTOP CLIENT INFO */}
            <div className="hidden lg:flex items-center gap-6">
              {/* Company logo container - NO BORDER */}
              <div className="bg-white px-6 py-4 flex items-center justify-center min-w-[200px]">
                <Image
                  src="/images/testimonial/oakleigh-testimonial-desktop.png"
                  alt="Company logo"
                  width={180}
                  height={60}
                  className="hidden lg:block"
                />
              </div>

              {/* Client photo - NO BORDER */}
              <Image
                src="/images/testimonial/user-profile-testimonial-desktop.png"
                alt="Client photo"
                width={80}
                height={80}
                className="rounded-full object-cover"
              />

              {/* Client details */}
              <div>
                <p className="text-black text-xl font-bold font-['Poppins'] capitalize">
                  Client Name
                </p>
                <p className="text-black text-xl font-normal font-['Inter']">
                  Job Position
                </p>
              </div>
            </div>

            {/* MOBILE CLIENT INFO */}
            <div className="lg:hidden flex flex-col items-center gap-6">
              {/* Company logo container - NO BORDER */}
              <div className="bg-white px-6 py-4 flex items-center justify-center w-full max-w-[280px]">
                <Image
                  src="/images/testimonial/oakleigh-testimonial-mobile.png"
                  alt="Company logo"
                  width={200}
                  height={60}
                  className="lg:hidden"
                />
              </div>

              {/* Client photo and details */}
              <div className="flex flex-col items-center gap-3">
                {/* Client photo - NO BORDER */}
                <Image
                  src="/images/testimonial/user-profile-testimonial-mobile.png"
                  alt="Client photo"
                  width={100}
                  height={100}
                  className="rounded-full object-cover"
                />
                <div className="text-center">
                  <p className="text-black text-xl font-bold font-['Poppins'] capitalize">
                    Client Name
                  </p>
                  <p className="text-black text-lg font-normal font-['Inter']">
                    Job Position
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

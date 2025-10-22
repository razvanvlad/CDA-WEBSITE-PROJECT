'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function SellOnline() {
  return (
    <section className="w-full bg-gray-100 my-32">
      <div className="max-w-[1920px] mx-auto h-[490px] lg:h-[254px] flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 px-4 lg:px-8 pt-[30px] lg:pt-0 pb-0 lg:pb-0 relative">

        {/* Title */}
        <h2 className="text-[32px] lg:text-[50px] font-bold font-['Poppins'] text-center lg:text-left">
          Want To Sell Online?
        </h2>

        {/* Button */}
        <Link
          href="/contact"
          className="button-l !w-[218px] lg:!w-[280.5px] !h-[46px] lg:!h-[53.5px]"
        >
          Speak With An Expert
        </Link>

        {/* Dog Image - Desktop */}
        <Image
          src="/images/sellonline/dog-image-destop.svg"
          alt="Dog with phone"
          width={366}
          height={420}
          className="hidden lg:block"
        />

        {/* Dog Image - Mobile (extends 60px outside container) */}
        <Image
          src="/images/sellonline/dog-image-mobile.svg"
          alt="Dog with phone"
          width={226}
          height={260}
          className="lg:hidden translate-y-[60px]"
        />

      </div>
    </section>
  );
}

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { safeImageUrl } from '@/lib/imageUtils';

interface MediaNode {
  sourceUrl: string;
  altText?: string | null;
}

interface ACFImage {
  node: MediaNode;
}

interface ACFLink {
  url: string;
  title: string;
  target?: string | null;
}

interface SellOnlineFields {
  title?: string | null;
  cta?: ACFLink | null;
  image?: ACFImage | null;
}

interface SellOnlineProps {
  sellOnlineFields: SellOnlineFields | null;
}

export default function SellOnline({ sellOnlineFields }: SellOnlineProps) {
  if (!sellOnlineFields) return null;

  const { title, cta, image } = sellOnlineFields;

  // Don't render if there's no meaningful content
  if (!title && !cta && !image) return null;

  return (
    <section className="w-full bg-gray-100 my-32">
      <div className="max-w-[1920px] mx-auto h-[490px] lg:h-[254px] flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 px-4 lg:px-8 pt-[30px] lg:pt-0 pb-0 lg:pb-0 relative">

        {/* Title from ACF */}
        {title && (
          <h2 className="text-[32px] lg:text-[50px] font-bold font-['Poppins'] text-center lg:text-left">
            {title}
          </h2>
        )}

        {/* Button from ACF */}
        {cta?.url && cta?.title && (
          <Link
            href={cta.url}
            target={cta.target || '_self'}
            className="button-l !w-[218px] lg:!w-[280.5px] !h-[46px] lg:!h-[53.5px]"
          >
            {cta.title}
          </Link>
        )}

        {/* Image from ACF - Desktop */}
        {image?.node?.sourceUrl && (
          <>
            <Image
              src={safeImageUrl ? safeImageUrl(image.node.sourceUrl) : image.node.sourceUrl}
              alt={image.node.altText || 'Illustration'}
              width={366}
              height={420}
              className="hidden lg:block"
            />

            {/* Image from ACF - Mobile (extends 60px outside container) */}
            <Image
              src={safeImageUrl ? safeImageUrl(image.node.sourceUrl) : image.node.sourceUrl}
              alt={image.node.altText || 'Illustration'}
              width={226}
              height={260}
              className="lg:hidden translate-y-[60px]"
            />
          </>
        )}

      </div>
    </section>
  );
}

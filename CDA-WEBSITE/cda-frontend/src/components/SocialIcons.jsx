'use client';

import Image from 'next/image';

/**
 * SocialIcons - Reusable social media icons component
 * @param {string} variant - 'black' or 'white' (default: 'black')
 * @param {string} className - Additional CSS classes for the container
 * @param {string} iconClassName - Additional CSS classes for individual icon links
 */
const SocialIcons = ({
  variant = 'black',
  className = '',
  iconClassName = 'side-menu-social'
}) => {
  const iconPath = variant === 'white' ? '/images/social-icons' : '/images/social-icons/black';

  const socialLinks = [
    {
      name: 'Facebook',
      href: 'https://www.facebook.com/cdagroupUK/',
      icon: 'facebook.svg',
      width: 9,
      height: 20
    },
    {
      name: 'TikTok',
      href: 'https://www.tiktok.com/@cdagroupuk',
      icon: 'tiktok.svg',
      width: 17,
      height: 20
    },
    {
      name: 'Instagram',
      href: 'https://www.instagram.com/cdagroupUK/',
      icon: 'instagram.svg',
      width: 18,
      height: 20
    },
    {
      name: 'LinkedIn',
      href: 'https://www.linkedin.com/company/cdagroup/',
      icon: 'linkedin.svg',
      width: 18,
      height: 20
    },
    {
      name: 'YouTube',
      href: 'https://www.youtube.com/@CDAGroupUK',
      icon: 'youtube.svg',
      width: 26,
      height: 20
    },
  ];

  return (
    <div className={`flex items-center gap-5 ${className}`}>
      {socialLinks.map((social) => (
        <a
          key={social.name}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={social.name}
          className={iconClassName}
        >
          <Image
            src={`${iconPath}/${social.icon}`}
            alt=""
            width={social.width}
            height={social.height}
            aria-hidden="true"
          />
        </a>
      ))}
    </div>
  );
};

export default SocialIcons;

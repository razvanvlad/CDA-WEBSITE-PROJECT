// components/Footer.js
export default function Footer({ globalOptions }) {
  const footerContent = globalOptions?.footerContent;

  return (
    <footer className="bg-gray-800 text-white py-8">
<div className="mx-auto max-w-[1620px] px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Logo and Text */}
          <div className="mb-4 md:mb-0 text-center md:text-left">
            {footerContent?.footerLogo?.node?.sourceUrl ? (
              <img 
                src={footerContent.footerLogo.node.sourceUrl} 
                alt={footerContent.footerLogo.node.altText || 'Logo'}
                className="h-8 w-auto mx-auto md:mx-0 mb-2"
              />
            ) : (
              <h3 className="text-2xl font-bold">CDA</h3>
            )}
            {footerContent?.footerText && (
              <div 
                className="text-gray-400 mt-2"
                dangerouslySetInnerHTML={{ __html: footerContent.footerText }}
              />
            )}
          </div>

          {/* Social Links */}
          {footerContent?.footerSocialLinks?.length > 0 && (
            <div className="flex space-x-6">
              {footerContent.footerSocialLinks.map((social, index) => (
                <a 
                  key={index} 
                  href={social.url} 
                  className="text-gray-400 hover:text-white transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {social.platform}
                </a>
              ))}
            </div>
          )}
        </div>
        
        {/* Copyright */}
        <div className="mt-8 text-center text-gray-400">
          <p>{footerContent?.footerCopyright || `© ${new Date().getFullYear()} All rights reserved.`}</p>
        </div>
      </div>
    </footer>
  );
}
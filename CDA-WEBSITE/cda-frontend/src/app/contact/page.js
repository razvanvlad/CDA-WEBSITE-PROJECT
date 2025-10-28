import Header from '../../components/Header';
import Footer from '../../components/Footer';
import LocationsImage from '../../components/GlobalBlocks/LocationsImage';
import ContactForm from '@/components/Sections/ContactForm';
import NewsletterSignup from '../../components/GlobalBlocks/NewsletterSignup';
import ResponsiveUnderlinedTitle from '@/components/ResponsiveUnderlinedTitle';
import { executeGraphQLQuery } from '@/lib/graphql-queries.js'
import Image from 'next/image';

export const revalidate = 300

export default async function ContactPage() {
  const CONTACT_ID = parseInt(process.env.NEXT_PUBLIC_CONTACT_PAGE_ID || '791', 10)

  const globalQuery = `{
    globalOptions { globalContentBlocks {
      locationsImage { title subtitle countries { countryName offices { name address email phone } } illustration { node { sourceUrl altText } } }
      newsletterSignup { title subtitle hubspotScript termsText }
    } }
  }`

  const contactQuery = `query GetContact($id: ID!) {
    page(id: $id, idType: DATABASE_ID) {
      id
      title
      contactContent { formSection { title description formShortcode } }
    }
  }`

  const [globalRes, contactRes] = await Promise.all([
    executeGraphQLQuery(globalQuery),
    executeGraphQLQuery(contactQuery, { id: String(CONTACT_ID) })
  ])

  const globalBlocks = globalRes?.data?.globalOptions?.globalContentBlocks || {}
  const formSection = contactRes?.data?.page?.contactContent?.formSection || null
  const formEmbed = formSection?.formShortcode && /<\/?(form|script|div|iframe)/i.test(String(formSection.formShortcode))

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Contact Form Section */}
      <section className="contact-section">
        <div className="contact-container">
          <div className="contact-content">
            <div className="contact-header">
              <ResponsiveUnderlinedTitle
                as="h1"
                className="cda-title"
                underlineColor="#FD8721"
              >
                Send Us A Message
              </ResponsiveUnderlinedTitle>
            </div>

            <div className="contact-form-wrapper">
              {formEmbed ? (
                <div dangerouslySetInnerHTML={{ __html: formSection.formShortcode }} />
              ) : (
                <ContactForm />
              )}

              {/* Contact Information */}
              <div className="contact-info">
                <div className="contact">
                  <strong>Telephone:</strong> <a href="tel:02037800808">0203 780 0808</a>
                </div>
                <div className="contact-social">
                  <strong>Social Media:</strong>
                  <div className="social-links">
                    <a href="https://www.facebook.com/cdagroupUK/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="side-menu-social">
                      <Image src="/images/social-icons/black/facebook.svg" alt="" width={9} height={20} aria-hidden="true" />
                    </a>
                    <a href="https://www.tiktok.com/@cdagroupuk" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="side-menu-social">
                      <Image src="/images/social-icons/black/tiktok.svg" alt="" width={17} height={20} aria-hidden="true" />
                    </a>
                    <a href="https://www.instagram.com/cdagroupUK/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="side-menu-social">
                      <Image src="/images/social-icons/black/instagram.svg" alt="" width={18} height={20} aria-hidden="true" />
                    </a>
                    <a href="https://www.linkedin.com/company/cdagroup/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="side-menu-social">
                      <Image src="/images/social-icons/black/linkedin.svg" alt="" width={18} height={20} aria-hidden="true" />
                    </a>
                    <a href="https://www.youtube.com/@CDAGroupUK" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="side-menu-social">
                      <Image src="/images/social-icons/black/youtube.svg" alt="" width={26} height={20} aria-hidden="true" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-illustration">
            <img className="contact-illustration-img" src="/images/contact-birds.svg" alt="Contact illustration with birds and envelopes" />
          </div>
        </div>

        {/* Mobile Bird Image - Positioned after the form container */}
        <div className="contact-illustration-mobile">
          <img className="contact-illustration-img-mobile" src="/images/contact-birds.svg" alt="Contact illustration with birds and envelopes" />
        </div>
      </section>

      {/* Locations (Global Content) */}
      {globalBlocks?.locationsImage && (
        <LocationsImage globalData={globalBlocks.locationsImage} />
      )}

      {/* Newsletter (Global) */}
      {globalBlocks?.newsletterSignup && (
        <NewsletterSignup globalData={globalBlocks.newsletterSignup} />
      )}

      <Footer />
    </div>
  );
}

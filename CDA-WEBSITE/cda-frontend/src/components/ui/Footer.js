// CDA-WEBSITE-PROJECT/CDA-WEBSITE/cda-frontend/src/components/ui/Footer.js
export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">CDA</h3>
            <p className="text-gray-300 text-sm">
              Delivering innovative digital solutions for businesses worldwide.
            </p>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="/services/e-commerce" className="hover:text-white">eCommerce</a></li>
              <li><a href="/services/b2b-lead-generation" className="hover:text-white">B2B Lead Generation</a></li>
              <li><a href="/services/software-development" className="hover:text-white">Software Development</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="/about" className="hover:text-white">About Us</a></li>
              <li><a href="/case-studies" className="hover:text-white">Case Studies</a></li>
              <li><a href="/careers" className="hover:text-white">Careers</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-4">Connect</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="/contact" className="hover:text-white">Contact Us</a></li>
              <li><a href="/privacy-policy" className="hover:text-white">Privacy Policy</a></li>
              <li><a href="/terms" className="hover:text-white">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} CDA Systems Limited. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
import Link from 'next/link'
import Image from 'next/image'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-4xl w-full text-center">
        <div className="mb-8">
          <div className="text-8xl font-bold text-blue-600 mb-4">404</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Page Not Found</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Sorry, we couldn't find the page you're looking for. The content may have been moved, deleted, or the URL might be incorrect.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">What can you do?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4l2 2 4-4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">View Our Services</h3>
              <p className="text-gray-600 text-sm mb-3">
                Explore our comprehensive range of digital services and solutions.
              </p>
              <Link 
                href="/services"
                className="text-blue-600 hover:text-blue-800 font-medium text-sm"
              >
                Browse Services →
              </Link>
            </div>

            <div className="text-center p-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Case Studies</h3>
              <p className="text-gray-600 text-sm mb-3">
                See how we've helped other businesses succeed with our solutions.
              </p>
              <Link 
                href="/case-studies"
                className="text-blue-600 hover:text-blue-800 font-medium text-sm"
              >
                View Case Studies →
              </Link>
            </div>

            <div className="text-center p-4">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Meet Our Team</h3>
              <p className="text-gray-600 text-sm mb-3">
                Get to know the talented experts behind our success.
              </p>
              <Link 
                href="/team"
                className="text-blue-600 hover:text-blue-800 font-medium text-sm"
              >
                Meet the Team →
              </Link>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Back to Homepage
          </Link>
          <Link
            href="/contact"
            className="inline-block border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-colors"
          >
            Contact Us
          </Link>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            If you believe this is an error, please{' '}
            <Link href="/contact" className="text-blue-600 hover:text-blue-800">
              contact our support team
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
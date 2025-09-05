'use client'

import React from 'react'
import Link from 'next/link'
import { useEffect } from 'react'

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Log the error to error monitoring service
    console.group('🚨 Global Error Page')
    console.error('Error:', error)
    console.log('Digest:', error.digest)
    console.log('Stack:', error.stack)
    console.groupEnd()

    // In production, send to error monitoring service
    if (process.env.NODE_ENV === 'production') {
      // Example: Send to error monitoring service
      // reportError({
      //   message: error.message,
      //   stack: error.stack,
      //   digest: error.digest,
      //   timestamp: new Date().toISOString(),
      //   url: window.location.href
      // })
    }
  }, [error])

  const getErrorTitle = () => {
    if (error.message.toLowerCase().includes('network')) {
      return 'Network Connection Error'
    }
    if (error.message.toLowerCase().includes('timeout')) {
      return 'Request Timeout'
    }
    if (error.message.toLowerCase().includes('not found')) {
      return 'Content Not Found'
    }
    return 'Something Went Wrong'
  }

  const getErrorDescription = () => {
    if (error.message.toLowerCase().includes('network')) {
      return 'We are having trouble connecting to our servers. This might be a temporary network issue.'
    }
    if (error.message.toLowerCase().includes('timeout')) {
      return 'The request is taking longer than expected. Our servers might be temporarily busy.'
    }
    if (error.message.toLowerCase().includes('not found')) {
      return 'The content you are looking for could not be found. It may have been moved or deleted.'
    }
    return 'We encountered an unexpected error while loading this page. Our team has been notified and is working to resolve the issue.'
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-4xl w-full">
        {/* Main Error Content */}
        <div className="text-center mb-8">
          <div className="mb-6">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{getErrorTitle()}</h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              {getErrorDescription()}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">What would you like to do?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Try Again */}
            <div className="text-center p-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Try Again</h3>
              <p className="text-gray-600 text-sm mb-3">
                Retry loading this page
              </p>
              <button
                onClick={reset}
                className="text-blue-600 hover:text-blue-800 font-medium text-sm"
              >
                Refresh Page →
              </button>
            </div>

            {/* Go Home */}
            <div className="text-center p-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Go Home</h3>
              <p className="text-gray-600 text-sm mb-3">
                Return to our homepage
              </p>
              <Link 
                href="/"
                className="text-blue-600 hover:text-blue-800 font-medium text-sm"
              >
                Homepage →
              </Link>
            </div>

            {/* View Services */}
            <div className="text-center p-4">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Our Services</h3>
              <p className="text-gray-600 text-sm mb-3">
                Explore what we offer
              </p>
              <Link 
                href="/services"
                className="text-blue-600 hover:text-blue-800 font-medium text-sm"
              >
                View Services →
              </Link>
            </div>

            {/* Contact Support */}
            <div className="text-center p-4">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Contact Us</h3>
              <p className="text-gray-600 text-sm mb-3">
                Get help from our team
              </p>
              <Link 
                href="/contact"
                className="text-blue-600 hover:text-blue-800 font-medium text-sm"
              >
                Contact Support →
              </Link>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={reset}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
            <Link
              href="/"
              className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Go to Homepage
            </Link>
          </div>
        </div>

        {/* Error Details (Development Only) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <details>
              <summary className="cursor-pointer text-lg font-medium text-gray-900 hover:text-gray-700 mb-4">
                🔧 Developer Information
              </summary>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Error Message:</h4>
                  <pre className="text-sm text-red-600 bg-red-50 p-3 rounded border overflow-auto">
                    {error.message}
                  </pre>
                </div>
                
                {error.digest && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Error Digest:</h4>
                    <code className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                      {error.digest}
                    </code>
                  </div>
                )}
                
                {error.stack && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Stack Trace:</h4>
                    <pre className="text-xs text-gray-600 bg-gray-50 p-3 rounded border overflow-auto max-h-60">
                      {error.stack}
                    </pre>
                  </div>
                )}
              </div>
            </details>
          </div>
        )}

        {/* Footer Message */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            If this problem persists, please{' '}
            <Link href="/contact" className="text-blue-600 hover:text-blue-800">
              contact our support team
            </Link>
            {error.digest && (
              <span>
                {' '}and include this error code: <code className="font-mono text-xs bg-gray-200 px-1 rounded">{error.digest}</code>
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}
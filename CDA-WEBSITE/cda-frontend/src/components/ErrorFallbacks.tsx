'use client'

import React from 'react'
import Link from 'next/link'

// Loading States
export const LoadingSpinner = ({ message = "Loading..." }: { message?: string }) => (
  <div className="flex items-center justify-center min-h-[200px] bg-gray-50 rounded-lg">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
      <p className="text-gray-600">{message}</p>
    </div>
  </div>
)

export const PageLoadingFallback = ({ message = "Loading page content..." }: { message?: string }) => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-6"></div>
      <p className="text-xl text-gray-600 mb-2">{message}</p>
      <p className="text-gray-500">This may take a moment</p>
    </div>
  </div>
)

// GraphQL Error Fallbacks
interface GraphQLErrorFallbackProps {
  error?: any
  onRetry?: () => void
  showDetails?: boolean
  errorType?: 'network' | 'graphql' | 'timeout' | 'unknown'
}

export const GraphQLErrorFallback = ({ 
  error, 
  onRetry, 
  showDetails = false,
  errorType = 'unknown'
}: GraphQLErrorFallbackProps) => {
  const getErrorMessage = () => {
    switch (errorType) {
      case 'network':
        return {
          title: 'Network Connection Error',
          message: 'Unable to connect to our servers. Please check your internet connection.',
          suggestion: 'Try refreshing the page or check your network connection.'
        }
      case 'graphql':
        return {
          title: 'Data Loading Error', 
          message: 'We encountered an issue while loading the content from our database.',
          suggestion: 'Our team has been notified. Please try again in a moment.'
        }
      case 'timeout':
        return {
          title: 'Request Timeout',
          message: 'The request is taking longer than expected.',
          suggestion: 'Please try again. The server might be temporarily busy.'
        }
      default:
        return {
          title: 'Content Loading Error',
          message: 'We encountered an unexpected error while loading this content.',
          suggestion: 'Please try refreshing the page.'
        }
    }
  }

  const errorInfo = getErrorMessage()

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center max-w-2xl mx-auto">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      
      <h3 className="text-lg font-semibold text-red-800 mb-2">{errorInfo.title}</h3>
      <p className="text-red-700 mb-4">{errorInfo.message}</p>
      <p className="text-red-600 text-sm mb-6">{errorInfo.suggestion}</p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        {onRetry && (
          <button
            onClick={onRetry}
            className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        )}
        <Link
          href="/"
          className="border-2 border-red-300 text-red-700 px-6 py-2 rounded-lg font-semibold hover:bg-red-50 transition-colors"
        >
          Go to Homepage
        </Link>
      </div>

      {showDetails && error && (
        <details className="mt-6 text-left">
          <summary className="cursor-pointer text-sm font-medium text-red-700 hover:text-red-900">
            Technical Details
          </summary>
          <div className="mt-4 p-4 bg-red-100 rounded-lg">
            <pre className="text-xs text-red-800 whitespace-pre-wrap overflow-auto max-h-40">
              {JSON.stringify(error, null, 2)}
            </pre>
          </div>
        </details>
      )}
    </div>
  )
}

// Content-specific error fallbacks
export const ServiceErrorFallback = ({ onRetry }: { onRetry?: () => void }) => (
  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
      <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
    <h3 className="text-lg font-semibold text-yellow-800 mb-2">Service Information Unavailable</h3>
    <p className="text-yellow-700 mb-4">
      We're having trouble loading the service details right now.
    </p>
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-yellow-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-yellow-700 transition-colors"
        >
          Try Again
        </button>
      )}
      <Link
        href="/services"
        className="border-2 border-yellow-300 text-yellow-700 px-6 py-2 rounded-lg font-semibold hover:bg-yellow-50 transition-colors"
      >
        View All Services
      </Link>
    </div>
  </div>
)

export const CaseStudyErrorFallback = ({ onRetry }: { onRetry?: () => void }) => (
  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    </div>
    <h3 className="text-lg font-semibold text-blue-800 mb-2">Case Study Unavailable</h3>
    <p className="text-blue-700 mb-4">
      This case study content could not be loaded at the moment.
    </p>
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      )}
      <Link
        href="/case-studies"
        className="border-2 border-blue-300 text-blue-700 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
      >
        View All Case Studies
      </Link>
    </div>
  </div>
)

export const TeamMemberErrorFallback = ({ onRetry }: { onRetry?: () => void }) => (
  <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 text-center">
    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
      <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    </div>
    <h3 className="text-lg font-semibold text-purple-800 mb-2">Team Member Profile Unavailable</h3>
    <p className="text-purple-700 mb-4">
      We're having trouble loading this team member's information.
    </p>
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
        >
          Try Again
        </button>
      )}
      <Link
        href="/team"
        className="border-2 border-purple-300 text-purple-700 px-6 py-2 rounded-lg font-semibold hover:bg-purple-50 transition-colors"
      >
        View All Team Members
      </Link>
    </div>
  </div>
)

// Empty state fallbacks
export const EmptyServicesState = () => (
  <div className="text-center py-12">
    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Services Available</h3>
    <p className="text-gray-600 mb-6">
      We don't have any services to display at the moment. Please check back later.
    </p>
    <Link
      href="/contact"
      className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
    >
      Contact Us for Information
    </Link>
  </div>
)

export const EmptyCaseStudiesState = () => (
  <div className="text-center py-12">
    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Case Studies Available</h3>
    <p className="text-gray-600 mb-6">
      We're working on adding case studies to showcase our work. Please check back soon.
    </p>
    <Link
      href="/services"
      className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
    >
      View Our Services
    </Link>
  </div>
)

// Network offline fallback
export const OfflineFallback = () => (
  <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 text-center">
    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
      <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 00-9.75 9.75c0 1.372.284 2.683.797 3.87.514 1.187 1.27 2.253 2.207 3.11a9.75 9.75 0 0012.946 0c.937-.857 1.693-1.923 2.207-3.11.513-1.187.797-2.498.797-3.87A9.75 9.75 0 0012 2.25z" />
      </svg>
    </div>
    <h3 className="text-lg font-semibold text-orange-800 mb-2">You're Offline</h3>
    <p className="text-orange-700 mb-4">
      Please check your internet connection and try again.
    </p>
    <button
      onClick={() => window.location.reload()}
      className="bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
    >
      Retry
    </button>
  </div>
)
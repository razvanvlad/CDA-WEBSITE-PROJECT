'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import Link from 'next/link'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  showDetails?: boolean
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
  errorId: string
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: ''
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Generate unique error ID for tracking
    const errorId = `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    return {
      hasError: true,
      error,
      errorId
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    })

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.group('🚨 React Error Boundary Caught Error')
      console.error('Error:', error)
      console.error('Component Stack:', errorInfo.componentStack)
      console.error('Error ID:', this.state.errorId)
      console.groupEnd()
    }

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    // In production, you could send error to monitoring service
    if (process.env.NODE_ENV === 'production') {
      this.reportErrorToService(error, errorInfo)
    }
  }

  reportErrorToService = (error: Error, errorInfo: ErrorInfo) => {
    // Example error reporting - integrate with your monitoring service
    const errorReport = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      errorId: this.state.errorId
    }

    // Send to error monitoring service (e.g., Sentry, LogRocket, etc.)
    console.log('Error report ready for monitoring service:', errorReport)
    
    // Example: fetch('/api/errors', { method: 'POST', body: JSON.stringify(errorReport) })
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: ''
    })
  }

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="max-w-2xl w-full">
            <div className="bg-white rounded-lg shadow-lg p-8">
              {/* Error Icon */}
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Oops! Something went wrong
                </h1>
                <p className="text-gray-600 mb-6">
                  We encountered an unexpected error while rendering this component. Our team has been notified.
                </p>
              </div>

              {/* Error Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                <button
                  onClick={this.handleRetry}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
                <Link
                  href="/"
                  className="border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-center"
                >
                  Go to Homepage
                </Link>
              </div>

              {/* Error Details (Development/Debug Mode) */}
              {(this.props.showDetails || process.env.NODE_ENV === 'development') && this.state.error && (
                <details className="mt-6">
                  <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
                    Technical Details (Error ID: {this.state.errorId})
                  </summary>
                  <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">Error Message:</h4>
                      <pre className="text-sm text-red-600 whitespace-pre-wrap">
                        {this.state.error.message}
                      </pre>
                    </div>
                    
                    {this.state.error.stack && (
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 mb-2">Stack Trace:</h4>
                        <pre className="text-xs text-gray-600 whitespace-pre-wrap max-h-40 overflow-auto">
                          {this.state.error.stack}
                        </pre>
                      </div>
                    )}
                    
                    {this.state.errorInfo?.componentStack && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Component Stack:</h4>
                        <pre className="text-xs text-gray-600 whitespace-pre-wrap max-h-40 overflow-auto">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                  </div>
                </details>
              )}

              {/* Support Information */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">
                  If this problem persists, please{' '}
                  <Link href="/contact" className="text-blue-600 hover:text-blue-800">
                    contact our support team
                  </Link>
                  {this.state.errorId && (
                    <span>
                      {' '}and include this error ID: <code className="font-mono text-xs bg-gray-200 px-1 rounded">{this.state.errorId}</code>
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary

// Convenient wrapper components for different error scenarios
export const PageErrorBoundary = ({ children }: { children: ReactNode }) => (
  <ErrorBoundary showDetails={false}>
    {children}
  </ErrorBoundary>
)

export const ComponentErrorBoundary = ({ children, fallback }: { children: ReactNode, fallback?: ReactNode }) => (
  <ErrorBoundary 
    fallback={fallback || (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <p className="text-red-800 text-sm">
          This component failed to load. Please refresh the page.
        </p>
      </div>
    )}
  >
    {children}
  </ErrorBoundary>
)
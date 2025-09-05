'use client'

import React from 'react'
import ErrorBoundary, { ComponentErrorBoundary } from '../../components/ErrorBoundary'
import { GraphQLErrorFallback, LoadingSpinner } from '../../components/ErrorFallbacks'
import { useErrorHandler } from '../../hooks/useErrorHandler'
import { ErrorTest, GraphQLErrorTest, NetworkErrorTest } from '../../components/ErrorTest'

export default function ErrorTestPage() {
  const { errorState, setError, clearError, retry } = useErrorHandler()

  const triggerHookError = () => {
    setError(new Error('Error triggered via useErrorHandler hook'), 'validation')
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Error Handling Test Suite</h1>
        
        {/* Error Hook Test */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Error Hook Test</h2>
          <div className="bg-white p-6 rounded-lg shadow">
            {errorState.hasError ? (
              <div className="text-center">
                <div className="text-red-600 mb-4">
                  <p className="font-semibold">Error Type: {errorState.errorType}</p>
                  <p>{errorState.errorMessage}</p>
                </div>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={clearError}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Clear Error
                  </button>
                  <button
                    onClick={() => retry(() => console.log('Retry completed'))}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    Retry ({errorState.retryCount}/3)
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <p className="mb-4">Test the error handling hook:</p>
                <button
                  onClick={triggerHookError}
                  className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                >
                  Trigger Hook Error
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Error Boundary Tests */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Error Boundary Tests</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Component Error */}
            <ComponentErrorBoundary>
              <ErrorTest />
            </ComponentErrorBoundary>

            {/* GraphQL Error */}
            <ComponentErrorBoundary>
              <GraphQLErrorTest />
            </ComponentErrorBoundary>

            {/* Network Error */}
            <ComponentErrorBoundary>
              <NetworkErrorTest />
            </ComponentErrorBoundary>
          </div>
        </section>

        {/* Fallback UI Tests */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Fallback UI Components</h2>
          <div className="space-y-6">
            
            {/* Loading Spinner */}
            <div>
              <h3 className="text-lg font-medium mb-2">Loading State</h3>
              <LoadingSpinner message="Testing loading spinner..." />
            </div>

            {/* GraphQL Error Fallback */}
            <div>
              <h3 className="text-lg font-medium mb-2">GraphQL Error Fallback</h3>
              <GraphQLErrorFallback 
                error={{ message: 'Field "testField" is not defined' }}
                onRetry={() => alert('Retry clicked!')}
                showDetails={true}
                errorType="graphql"
              />
            </div>

            {/* Network Error Fallback */}
            <div>
              <h3 className="text-lg font-medium mb-2">Network Error Fallback</h3>
              <GraphQLErrorFallback 
                error={{ message: 'Network connection failed' }}
                onRetry={() => alert('Network retry clicked!')}
                errorType="network"
              />
            </div>
          </div>
        </section>

        {/* Navigation Tests */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Navigation Error Tests</h2>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="mb-4">Test invalid routes (these should show 404 pages):</p>
            <div className="flex flex-wrap gap-4">
              <a
                href="/invalid-route"
                target="_blank"
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                Test 404 Page
              </a>
              <a
                href="/services/invalid-service"
                target="_blank"
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                Test Service 404
              </a>
              <a
                href="/case-studies/invalid-case"
                target="_blank"
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                Test Case Study 404
              </a>
            </div>
          </div>
        </section>

        <div className="text-center text-gray-600">
          <p>Open browser DevTools to see error logging in action</p>
        </div>
      </div>
    </div>
  )
}
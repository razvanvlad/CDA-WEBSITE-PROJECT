'use client'

import { useState, useEffect } from 'react'
import { runGraphQLTests, GraphQLTester } from '@/lib/graphql-test'

interface TestSuite {
  name: string;
  results: Array<{
    query: string;
    success: boolean;
    data?: any;
    error?: string;
    duration: number;
    timestamp: string;
  }>;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  totalDuration: number;
}

export default function GraphQLTestPage() {
  const [isRunning, setIsRunning] = useState(false)
  const [results, setResults] = useState<TestSuite[]>([])
  const [summary, setSummary] = useState<{
    totalTests: number;
    totalPassed: number;
    totalFailed: number;
    totalDuration: number;
    successRate: number;
  } | null>(null)

  const runTests = async () => {
    setIsRunning(true)
    setResults([])
    setSummary(null)

    try {
      const tester = new GraphQLTester()
      
      // Run all tests
      const servicesResults = await tester.testServices()
      const caseStudiesResults = await tester.testCaseStudies()
      const teamMembersResults = await tester.testTeamMembers()
      const globalContentResults = await tester.testGlobalContent()
      const taxonomiesResults = await tester.testTaxonomies()

      const allResults = [
        servicesResults,
        caseStudiesResults,
        teamMembersResults,
        globalContentResults,
        taxonomiesResults
      ]

      setResults(allResults)

      // Calculate summary
      const totalTests = allResults.reduce((sum, suite) => sum + suite.totalTests, 0)
      const totalPassed = allResults.reduce((sum, suite) => sum + suite.passedTests, 0)
      const totalFailed = allResults.reduce((sum, suite) => sum + suite.failedTests, 0)
      const totalDuration = allResults.reduce((sum, suite) => sum + suite.totalDuration, 0)

      setSummary({
        totalTests,
        totalPassed,
        totalFailed,
        totalDuration,
        successRate: Math.round((totalPassed / totalTests) * 100)
      })

    } catch (error) {
      console.error('Test execution failed:', error)
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              CDA Website GraphQL Test Suite
            </h1>
            <p className="text-gray-600 mb-6">
              Comprehensive testing of all GraphQL endpoints for Services, Case Studies, Team Members, and Global Content
            </p>
            
            <button
              onClick={runTests}
              disabled={isRunning}
              className={`px-8 py-3 rounded-lg font-semibold text-white transition-colors ${
                isRunning
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isRunning ? 'Running Tests...' : 'Run All Tests'}
            </button>
          </div>

          {/* Loading State */}
          {isRunning && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Testing GraphQL endpoints...</p>
            </div>
          )}

          {/* Summary */}
          {summary && (
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">Test Summary</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {summary.totalTests}
                  </div>
                  <div className="text-sm text-gray-600">Total Tests</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {summary.totalPassed}
                  </div>
                  <div className="text-sm text-gray-600">Passed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {summary.totalFailed}
                  </div>
                  <div className="text-sm text-gray-600">Failed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {summary.successRate}%
                  </div>
                  <div className="text-sm text-gray-600">Success Rate</div>
                </div>
              </div>
              <div className="mt-4 text-center text-sm text-gray-500">
                Total Duration: {summary.totalDuration}ms
              </div>
            </div>
          )}

          {/* Test Results */}
          {results.length > 0 && (
            <div className="space-y-6">
              {results.map((suite) => (
                <div key={suite.name} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold flex items-center">
                      {suite.failedTests === 0 ? (
                        <span className="text-green-500 mr-2">✅</span>
                      ) : (
                        <span className="text-red-500 mr-2">❌</span>
                      )}
                      {suite.name}
                    </h3>
                    <div className="text-sm text-gray-600">
                      {suite.passedTests}/{suite.totalTests} passed ({Math.round(suite.totalDuration)}ms)
                    </div>
                  </div>

                  <div className="space-y-2">
                    {suite.results.map((test, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded border-l-4 ${
                          test.success
                            ? 'bg-green-50 border-green-500'
                            : 'bg-red-50 border-red-500'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="font-medium">
                            {test.success ? '✅' : '❌'} {test.query}
                          </div>
                          <div className="text-sm text-gray-500">
                            {test.duration}ms
                          </div>
                        </div>
                        
                        {!test.success && test.error && (
                          <div className="mt-2 text-sm text-red-600">
                            Error: {test.error}
                          </div>
                        )}
                        
                        {test.success && test.data && (
                          <details className="mt-2">
                            <summary className="text-sm text-gray-600 cursor-pointer">
                              View Response Data
                            </summary>
                            <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto max-h-40">
                              {JSON.stringify(test.data, null, 2)}
                            </pre>
                          </details>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Export Results */}
          {results.length > 0 && (
            <div className="mt-8 text-center">
              <button
                onClick={() => {
                  const resultsJson = JSON.stringify({
                    timestamp: new Date().toISOString(),
                    summary,
                    results
                  }, null, 2)
                  
                  const blob = new Blob([resultsJson], { type: 'application/json' })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = `graphql-test-results-${new Date().toISOString().split('T')[0]}.json`
                  document.body.appendChild(a)
                  a.click()
                  document.body.removeChild(a)
                  URL.revokeObjectURL(url)
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
              >
                Export Results as JSON
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
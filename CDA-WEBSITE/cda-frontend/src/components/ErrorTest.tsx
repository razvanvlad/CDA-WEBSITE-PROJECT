'use client'

import React, { useState } from 'react'

export const ErrorTest = () => {
  const [shouldThrow, setShouldThrow] = useState(false)

  if (shouldThrow) {
    throw new Error('Test error thrown by ErrorTest component')
  }

  return (
    <div className="p-4 border border-gray-300 rounded">
      <h3 className="font-semibold mb-2">Error Boundary Test</h3>
      <button
        onClick={() => setShouldThrow(true)}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Trigger Component Error
      </button>
    </div>
  )
}

export const GraphQLErrorTest = () => {
  const [showError, setShowError] = useState(false)

  const simulateGraphQLError = () => {
    setShowError(true)
    console.error('Simulated GraphQL Error:', {
      message: 'Field "testField" is not defined',
      locations: [{ line: 1, column: 10 }]
    })
  }

  if (showError) {
    throw new Error('GraphQL simulation: Field "testField" is not defined by type "Test"')
  }

  return (
    <div className="p-4 border border-blue-300 rounded">
      <h3 className="font-semibold mb-2">GraphQL Error Test</h3>
      <button
        onClick={simulateGraphQLError}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Simulate GraphQL Error
      </button>
    </div>
  )
}

export const NetworkErrorTest = () => {
  const [showError, setShowError] = useState(false)

  const simulateNetworkError = () => {
    setShowError(true)
  }

  if (showError) {
    throw new Error('Network error: Failed to fetch data from server')
  }

  return (
    <div className="p-4 border border-orange-300 rounded">
      <h3 className="font-semibold mb-2">Network Error Test</h3>
      <button
        onClick={simulateNetworkError}
        className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
      >
        Simulate Network Error
      </button>
    </div>
  )
}
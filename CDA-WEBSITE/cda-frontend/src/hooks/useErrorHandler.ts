'use client'

import { useState, useCallback } from 'react'
import { ApolloError } from '@apollo/client'

export interface ErrorState {
  hasError: boolean
  error: Error | ApolloError | null
  errorType: 'network' | 'graphql' | 'timeout' | 'validation' | 'unknown'
  errorMessage: string
  timestamp: Date | null
  retryCount: number
}

export interface UseErrorHandlerReturn {
  errorState: ErrorState
  setError: (error: Error | ApolloError | string, type?: ErrorState['errorType']) => void
  clearError: () => void
  retry: (retryFn: () => Promise<void> | void) => Promise<void>
  getErrorMessage: () => string
  isNetworkError: boolean
  isGraphQLError: boolean
  canRetry: boolean
}

const initialErrorState: ErrorState = {
  hasError: false,
  error: null,
  errorType: 'unknown',
  errorMessage: '',
  timestamp: null,
  retryCount: 0
}

const MAX_RETRY_COUNT = 3
const RETRY_DELAY = 1000 // 1 second

export const useErrorHandler = (): UseErrorHandlerReturn => {
  const [errorState, setErrorState] = useState<ErrorState>(initialErrorState)

  const determineErrorType = (error: Error | ApolloError): ErrorState['errorType'] => {
    if (error instanceof ApolloError) {
      if (error.networkError) {
        // Check for specific network error types
        if (error.networkError.message?.includes('timeout')) {
          return 'timeout'
        }
        return 'network'
      }
      if (error.graphQLErrors && error.graphQLErrors.length > 0) {
        return 'graphql'
      }
    }

    // Check error message for specific patterns
    const errorMessage = error.message.toLowerCase()
    if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
      return 'network'
    }
    if (errorMessage.includes('timeout')) {
      return 'timeout'
    }
    if (errorMessage.includes('validation') || errorMessage.includes('invalid')) {
      return 'validation'
    }

    return 'unknown'
  }

  const getHumanReadableMessage = (error: Error | ApolloError, type: ErrorState['errorType']): string => {
    switch (type) {
      case 'network':
        return 'Unable to connect to the server. Please check your internet connection.'
      case 'graphql':
        if (error instanceof ApolloError && error.graphQLErrors.length > 0) {
          const graphQLError = error.graphQLErrors[0]
          // Return a user-friendly version of GraphQL errors
          if (graphQLError.message.includes('not found')) {
            return 'The requested content was not found.'
          }
          if (graphQLError.message.includes('unauthorized')) {
            return 'You do not have permission to access this content.'
          }
          return 'There was an error loading the content from our database.'
        }
        return 'There was an error processing your request.'
      case 'timeout':
        return 'The request is taking too long. Please try again.'
      case 'validation':
        return 'Please check your input and try again.'
      default:
        return 'An unexpected error occurred. Please try again.'
    }
  }

  const setError = useCallback((
    error: Error | ApolloError | string, 
    type?: ErrorState['errorType']
  ) => {
    const errorObj = typeof error === 'string' ? new Error(error) : error
    const errorType = type || determineErrorType(errorObj)
    const errorMessage = getHumanReadableMessage(errorObj, errorType)

    setErrorState(prev => ({
      hasError: true,
      error: errorObj,
      errorType,
      errorMessage,
      timestamp: new Date(),
      retryCount: prev.retryCount
    }))

    // Log error in development
    if (process.env.NODE_ENV === 'development') {
      console.group('🚨 Error Handler')
      console.error('Error:', errorObj)
      console.log('Type:', errorType)
      console.log('User Message:', errorMessage)
      console.groupEnd()
    }
  }, [])

  const clearError = useCallback(() => {
    setErrorState(initialErrorState)
  }, [])

  const retry = useCallback(async (retryFn: () => Promise<void> | void) => {
    if (errorState.retryCount >= MAX_RETRY_COUNT) {
      setError('Maximum retry attempts exceeded. Please refresh the page.', 'unknown')
      return
    }

    setErrorState(prev => ({
      ...prev,
      retryCount: prev.retryCount + 1
    }))

    // Clear error temporarily
    setErrorState(prev => ({ ...prev, hasError: false }))

    try {
      // Add delay between retries
      if (errorState.retryCount > 0) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * errorState.retryCount))
      }

      await retryFn()
      
      // If successful, reset error state completely
      setErrorState(initialErrorState)
    } catch (error) {
      setError(error instanceof Error ? error : new Error(String(error)))
    }
  }, [errorState.retryCount, setError])

  const getErrorMessage = useCallback((): string => {
    return errorState.errorMessage || 'An unknown error occurred'
  }, [errorState.errorMessage])

  return {
    errorState,
    setError,
    clearError,
    retry,
    getErrorMessage,
    isNetworkError: errorState.errorType === 'network',
    isGraphQLError: errorState.errorType === 'graphql',
    canRetry: errorState.retryCount < MAX_RETRY_COUNT
  }
}

// Specialized hooks for common scenarios
export const useGraphQLErrorHandler = () => {
  const errorHandler = useErrorHandler()
  
  const handleGraphQLError = useCallback((error: ApolloError) => {
    errorHandler.setError(error, 'graphql')
  }, [errorHandler])

  const executeWithErrorHandling = useCallback(async <T>(
    operation: () => Promise<T>,
    fallbackValue?: T
  ): Promise<T | undefined> => {
    try {
      errorHandler.clearError()
      return await operation()
    } catch (error) {
      if (error instanceof ApolloError) {
        handleGraphQLError(error)
      } else {
        errorHandler.setError(error instanceof Error ? error : new Error(String(error)))
      }
      return fallbackValue
    }
  }, [errorHandler, handleGraphQLError])

  return {
    ...errorHandler,
    handleGraphQLError,
    executeWithErrorHandling
  }
}

// Form validation error handler
export const useFormErrorHandler = () => {
  const errorHandler = useErrorHandler()
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const setFieldError = useCallback((field: string, message: string) => {
    setFieldErrors(prev => ({ ...prev, [field]: message }))
  }, [])

  const clearFieldError = useCallback((field: string) => {
    setFieldErrors(prev => {
      const { [field]: _, ...rest } = prev
      return rest
    })
  }, [])

  const clearAllFieldErrors = useCallback(() => {
    setFieldErrors({})
  }, [])

  const hasFieldErrors = Object.keys(fieldErrors).length > 0

  return {
    ...errorHandler,
    fieldErrors,
    setFieldError,
    clearFieldError,
    clearAllFieldErrors,
    hasFieldErrors
  }
}
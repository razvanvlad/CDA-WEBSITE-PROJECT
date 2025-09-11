'use client'

import { useState, useCallback } from 'react'

// Apollo Client v4 no longer exports ApolloError from '@apollo/client'.
// Define a minimal "Apollo-like" error shape and type guards so our code
// can work regardless of the exact error class.
export type ApolloErrorLike = {
  graphQLErrors?: Array<{ message?: string }>
  networkError?: { message?: string } | Error
  message?: string
}

function hasGraphQLErrors(e: unknown): e is { graphQLErrors: Array<{ message?: string }> } {
  return !!(e as any)?.graphQLErrors && Array.isArray((e as any).graphQLErrors)
}

function hasNetworkError(e: unknown): e is { networkError: { message?: string } | Error } {
  return !!(e as any)?.networkError
}

export interface ErrorState {
  hasError: boolean
  error: Error | ApolloErrorLike | null
  errorType: 'network' | 'graphql' | 'timeout' | 'validation' | 'unknown'
  errorMessage: string
  timestamp: Date | null
  retryCount: number
}

export interface UseErrorHandlerReturn {
  errorState: ErrorState
  setError: (error: Error | ApolloErrorLike | string, type?: ErrorState['errorType']) => void
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

  const determineErrorType = (error: Error | ApolloErrorLike): ErrorState['errorType'] => {
    if (hasNetworkError(error)) {
      if ((error as any).networkError?.message?.includes?.('timeout')) return 'timeout'
      return 'network'
    }
    if (hasGraphQLErrors(error)) {
      return 'graphql'
    }

    const msg = (error?.message || '').toLowerCase()
    if (msg.includes('network') || msg.includes('fetch')) return 'network'
    if (msg.includes('timeout')) return 'timeout'
    if (msg.includes('validation') || msg.includes('invalid')) return 'validation'
    return 'unknown'
  }

  const getHumanReadableMessage = (error: Error | ApolloErrorLike, type: ErrorState['errorType']): string => {
    switch (type) {
      case 'network':
        return 'Unable to connect to the server. Please check your internet connection.'
      case 'graphql':
        if (hasGraphQLErrors(error) && error.graphQLErrors.length > 0) {
          const graphQLError = error.graphQLErrors[0]
          if (graphQLError?.message?.includes?.('not found')) return 'The requested content was not found.'
          if (graphQLError?.message?.includes?.('unauthorized')) return 'You do not have permission to access this content.'
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
    error: Error | ApolloErrorLike | string, 
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

    setErrorState(prev => ({ ...prev, hasError: false }))

    try {
      if (errorState.retryCount > 0) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * errorState.retryCount))
      }

      await retryFn()
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
  
  const handleGraphQLError = useCallback((error: ApolloErrorLike) => {
    errorHandler.setError(error, 'graphql')
  }, [errorHandler])

  const executeWithErrorHandling = useCallback(async <T>(
    operation: () => Promise<T>,
    fallbackValue?: T
  ): Promise<T | undefined> => {
    try {
      errorHandler.clearError()
      return await operation()
    } catch (error: unknown) {
      if (hasGraphQLErrors(error)) {
        handleGraphQLError(error as ApolloErrorLike)
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

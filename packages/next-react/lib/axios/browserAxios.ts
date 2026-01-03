import type { AxiosError } from 'axios';
import originalAxios from 'axios'
import { toast } from 'sonner'
/**
 * Axios client for browser environment.
 * Some code is borrowed from this library: https://github.com/infinitered/apisauce
 * Creating an Axios instance
 */
export const browserAxios = originalAxios.create({
  // NEXT_PUBLIC_BACKEND_BASE_URL environment variable is only available in browser environment
  baseURL: process.env.NEXT_PUBLIC_API_ENDPOINT_URL as string,
  timeout: 1000 * 10, // 10 seconds
  // Sets whether credentials (cookies, authentication headers, etc.) are included in Axios requests.
  withCredentials: true,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

/**
 * Determines if a value is within the specified minimum and maximum range.
 *
 * @sig Number a -> a -> a -> b
 * @param {Number} min - the minimum number
 * @param {Number} max - maximum number
 * @param {Number} value - value to test
 * @return {Boolean} is the value in the range?
 * @example
 * isWithin(1, 5, 3) //=> true
 * isWithin(1, 5, 1) //=> true
 * isWithin(1, 5, 5) //=> true
 * isWithin(1, 5, 5.1) //=> false
 */
const isWithin = (min: number, max: number, value: number): boolean =>
  value >= min && value <= max

const NETWORK_ERROR = 'NETWORK_ERROR'
const TIMEOUT_ERROR = 'TIMEOUT_ERROR'
const SERVER_ERROR = 'SERVER_ERROR'
const UNKNOWN_ERROR = 'UNKNOWN_ERROR'

export const in200s = (n: number): boolean => isWithin(200, 299, n)
export const in400s = (n: number): boolean => isWithin(400, 499, n)
export const in500s = (n: number): boolean => isWithin(500, 599, n)

/**
 * Request interceptor
 * Defines processing executed before sending a request
 *
 * @param config - Axios request configuration object
 * @returns Updated request configuration
 */
browserAxios.interceptors.request.use(
  async (config) => {
    return config
  },
  async (error) => {
    return Promise.reject(error)
  },
)

/**
 * Response interceptor
 * Defines processing executed after receiving an API response
 *
 * @param response - Returns successful responses (2xx) as-is
 * @param error - Performs error handling for error responses (4xx/5xx)
 * @returns Processed response or error
 */
browserAxios.interceptors.response.use(
  (response) => {
    // 2xx status response
    return response
  },
  // Error handling
  async (error: AxiosError) => {
    // Type definition for errors data retrieval
    // Other error handling
    switch (getProblemFromError(error)) {
      // Network error when offline or connectivity issues
      case NETWORK_ERROR:
        toast.error(
          'Network error occurred. Please try again in a location with good connectivity.',
        )
        break
      // Timeout when API server does not respond for more than 10 seconds
      case TIMEOUT_ERROR:
        toast.error(
          'Connection timed out. Please try again in a location with good connectivity.',
        )
        break
      // 500 server error
      case SERVER_ERROR:
        toast.error('Server error occurred. Please try again after some time.')
        break
      case UNKNOWN_ERROR:
      default:
        toast.error(
          'Network error occurred. Please try again in a location with good connectivity.',
        )
        // TODO Error Report service submission
        // Sentry.captureException(error)
        break
    }
    // Return error
    return Promise.reject(error)
  },
)

function getProblemFromError(error: AxiosError) {
  if (error.message === 'Network Error') return NETWORK_ERROR
  if (error.message.startsWith('timeout')) return TIMEOUT_ERROR

  const status = error.response?.status
  if (status === undefined) return UNKNOWN_ERROR
  if (in500s(status)) return SERVER_ERROR
  return UNKNOWN_ERROR
}

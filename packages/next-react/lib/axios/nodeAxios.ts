import type { AxiosError } from 'axios';
import axios from 'axios'

export const nodeAxios = axios.create({
  baseURL: process.env.ENDPOINT_URL as string,
  timeout: 1000 * 10, // 10 seconds
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

// Request interceptor - common processing for requests
nodeAxios.interceptors.request.use(
  async (config) => {
    return config
  },
  async (error: AxiosError) => {
    throw error
  },
)

// Response interceptor - common processing for responses
nodeAxios.interceptors.response.use(
  (response) => {
    return response
  },
  (error: AxiosError) => {
    throw error
  },
)

'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { login } from '@/lib/api'

interface LoginFormProps {
  onSuccess?: (user: { id: number; email: string }) => void
}

interface FormData {
  email: string
  password: string
}

interface FormErrors {
  email?: string
  password?: string
  general?: string
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const [formData, setFormData] = React.useState<FormData>({
    email: '',
    password: '',
  })
  const [errors, setErrors] = React.useState<FormErrors>({})
  const [isLoading, setIsLoading] = React.useState(false)
  const [isSuccess, setIsSuccess] = React.useState(false)

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {}

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    return newErrors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const validationErrors = validateForm()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      const result = await login(formData)
      setIsSuccess(true)
      if (onSuccess && result.user) {
        onSuccess(result.user)
      }
    } catch (error) {
      setErrors({
        general: error instanceof Error ? error.message : 'An error occurred',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
    // Clear field-specific error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  if (isSuccess) {
    return (
      <div role="alert" className="text-green-600">
        Welcome back! You have successfully signed in.
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} aria-label="Login form" className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange('email')}
          autoComplete="email"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        />
        {errors.email && (
          <div id="email-error" role="alert" className="mt-1 text-sm text-red-600">
            {errors.email}
          </div>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={formData.password}
          onChange={handleInputChange('password')}
          autoComplete="current-password"
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? 'password-error' : undefined}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        />
        {errors.password && (
          <div id="password-error" role="alert" className="mt-1 text-sm text-red-600">
            {errors.password}
          </div>
        )}
      </div>

      {errors.general && (
        <div role="alert" className="text-sm text-red-600">
          {errors.general}
        </div>
      )}

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? (
          <>
            <div
              role="status"
              aria-label="Loading"
              className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
            />
            Signing in...
          </>
        ) : (
          'Sign In'
        )}
      </Button>
    </form>
  )
} 
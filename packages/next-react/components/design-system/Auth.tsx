'use client'

import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Check,
  X,
  ArrowLeft,
} from 'lucide-react'
import React, { useState } from 'react'

import { radius } from '@/lib/design-system/spacing'
import { themes } from '@/lib/design-system/themes'
import { typography } from '@/lib/design-system/typography'
import { cn } from '@/lib/utils'

import { Button } from './Button'
import { Card } from './Card'

// Input Component
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  icon?: React.ReactNode
  theme?: keyof typeof themes
  variant?: 'default' | 'glass' | 'minimal' | 'bold'
  showPasswordToggle?: boolean
}

export const Input = ({
  ref,
  className,
  label,
  error,
  hint,
  icon,
  theme = 'glass-clear',
  variant = 'default',
  type = 'text',
  showPasswordToggle = false,
  disabled,
  id,
  ...props
}: InputProps & { ref?: React.RefObject<HTMLInputElement | null> }) => {
  const [showPassword, setShowPassword] = useState(false)
  const selectedTheme = themes[theme]
  const generatedId = React.useId()
  const inputId = id || generatedId

  const variantClasses = {
    default: cn(
      'bg-background/50',
      'border border-border',
      'focus:border-primary',
    ),
    glass: cn(
      selectedTheme?.card,
      selectedTheme?.blur,
      'border border-white/10',
      'focus:border-primary/50',
    ),
    minimal: cn(
      'bg-transparent',
      'border-b border-border',
      'rounded-none',
      'focus:border-primary',
    ),
    bold: cn('bg-background', 'border-2 border-border', 'focus:border-primary'),
  }

  const inputType =
    showPasswordToggle && type === 'password'
      ? showPassword
        ? 'text'
        : 'password'
      : type

  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className={cn(
            typography.subheadline.className,
            'text-foreground/70 block',
          )}
        >
          {label}
        </label>
      )}

      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/50">
            {icon}
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          type={inputType}
          disabled={disabled}
          className={cn(
            'w-full px-3 py-2.5',
            'text-foreground placeholder:text-foreground/40',
            'transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-primary/20',
            radius.lg,
            variantClasses[variant],
            icon && 'pl-10',
            showPasswordToggle && type === 'password' && 'pr-10',
            error && 'border-destructive focus:border-destructive',
            disabled && 'opacity-50 cursor-not-allowed',
            className,
          )}
          {...props}
        />

        {showPasswordToggle && type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/50 hover:text-foreground transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {hint && !error && (
        <p className={cn(typography.caption1.className, 'text-foreground/50')}>
          {hint}
        </p>
      )}

      {error && (
        <p
          className={cn(
            typography.caption1.className,
            'text-destructive flex items-center gap-1',
          )}
        >
          <X size={12} />
          {error}
        </p>
      )}
    </div>
  )
}

Input.displayName = 'Input'

// Login Form Component
export interface LoginFormProps {
  onSubmit?: (data: { email: string; password: string }) => void
  onForgotPassword?: () => void
  onSignUp?: () => void
  theme?: keyof typeof themes
  loading?: boolean
  error?: string
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  onForgotPassword,
  onSignUp,
  theme = 'glass-aurora',
  loading = false,
  error,
}) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.({ email, password })
  }

  return (
    <Card variant="glass" theme={theme} className="w-full max-w-md mx-auto p-8">
      <div className="text-center mb-8">
        <h1 className={cn(typography.title2.className, 'mb-2')}>
          Welcome Back
        </h1>
        <p className={cn(typography.body.className, 'text-foreground/60')}>
          Sign in to continue to your account
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <Input
          label="Email"
          type="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={<Mail size={18} />}
          theme={theme}
          variant="glass"
          required
        />

        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={<Lock size={18} />}
          theme={theme}
          variant="glass"
          showPasswordToggle
          required
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded" />
            <span className="text-sm text-foreground/70">Remember me</span>
          </label>

          <button
            type="button"
            onClick={onForgotPassword}
            className="text-sm text-primary hover:underline"
          >
            Forgot password?
          </button>
        </div>

        <Button
          type="submit"
          fullWidth
          variant="gradient"
          theme={theme}
          loading={loading}
          size="lg"
        >
          Sign In
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border/50" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-background/50 px-2 text-foreground/50">
              Or continue with
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Button variant="outline" theme={theme}>
            Google
          </Button>
          <Button variant="outline" theme={theme}>
            GitHub
          </Button>
          <Button variant="outline" theme={theme}>
            Apple
          </Button>
        </div>
      </form>

      <p className="text-center mt-8 text-sm text-foreground/60">
        Don&apos;t have an account?{' '}
        <button
          type="button"
          onClick={onSignUp}
          className="text-primary hover:underline font-medium"
        >
          Sign up
        </button>
      </p>
    </Card>
  )
}

// Sign Up Form Component
export interface SignUpFormProps {
  onSubmit?: (data: { name: string; email: string; password: string }) => void
  onLogin?: () => void
  theme?: keyof typeof themes
  loading?: boolean
  error?: string
}

export const SignUpForm: React.FC<SignUpFormProps> = ({
  onSubmit,
  onLogin,
  theme = 'gradient-sunset',
  loading = false,
  error,
}) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match')
      return
    }
    setPasswordError('')
    onSubmit?.({ name, email, password })
  }

  const passwordStrength = () => {
    if (!password) return 0
    let strength = 0
    if (password.length >= 8) strength++
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
    if (/\d/.test(password)) strength++
    if (/[^a-zA-Z\d]/.test(password)) strength++
    return strength
  }

  const strength = passwordStrength()
  const strengthColors = [
    'bg-red-500',
    'bg-orange-500',
    'bg-yellow-500',
    'bg-green-500',
  ]
  const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong']

  return (
    <Card
      variant="gradient"
      theme={theme}
      className="w-full max-w-md mx-auto p-8"
    >
      <div className="text-center mb-8">
        <h1 className={cn(typography.title2.className, 'mb-2')}>
          Create Account
        </h1>
        <p className={cn(typography.body.className, 'text-foreground/60')}>
          Get started with your free account
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <Input
          label="Full Name"
          type="text"
          placeholder="John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          icon={<User size={18} />}
          theme={theme}
          variant="glass"
          required
        />

        <Input
          label="Email"
          type="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={<Mail size={18} />}
          theme={theme}
          variant="glass"
          required
        />

        <div>
          <Input
            label="Password"
            type="password"
            placeholder="Create a strong password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<Lock size={18} />}
            theme={theme}
            variant="glass"
            showPasswordToggle
            required
          />

          {password && (
            <div className="mt-2 space-y-1">
              <div className="flex gap-1">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      'h-1 flex-1 rounded-full',
                      i < strength
                        ? strengthColors[strength - 1]
                        : 'bg-gray-300',
                    )}
                  />
                ))}
              </div>
              <p className="text-xs text-foreground/60">
                Password strength: {strengthLabels[strength - 1] || 'Very Weak'}
              </p>
            </div>
          )}
        </div>

        <Input
          label="Confirm Password"
          type="password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          icon={<Lock size={18} />}
          theme={theme}
          variant="glass"
          showPasswordToggle
          error={passwordError}
          required
        />

        <div className="space-y-3">
          <label className="flex items-start gap-2">
            <input type="checkbox" className="mt-0.5 rounded" required />
            <span className="text-sm text-foreground/70">
              I agree to the Terms of Service and Privacy Policy
            </span>
          </label>

          <label className="flex items-start gap-2">
            <input type="checkbox" className="mt-0.5 rounded" />
            <span className="text-sm text-foreground/70">
              I want to receive product updates and marketing emails
            </span>
          </label>
        </div>

        <Button
          type="submit"
          fullWidth
          variant="gradient"
          theme={theme}
          loading={loading}
          size="lg"
        >
          Create Account
        </Button>
      </form>

      <p className="text-center mt-8 text-sm text-foreground/60">
        Already have an account?{' '}
        <button
          type="button"
          onClick={onLogin}
          className="text-primary hover:underline font-medium"
        >
          Sign in
        </button>
      </p>
    </Card>
  )
}

// Password Reset Form
export interface PasswordResetFormProps {
  onSubmit?: (email: string) => void
  onBack?: () => void
  theme?: keyof typeof themes
  loading?: boolean
  success?: boolean
}

export const PasswordResetForm: React.FC<PasswordResetFormProps> = ({
  onSubmit,
  onBack,
  theme = 'glass-ocean',
  loading = false,
  success = false,
}) => {
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.(email)
  }

  return (
    <Card variant="glass" theme={theme} className="w-full max-w-md mx-auto p-8">
      {!success ? (
        <>
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 text-foreground/60 hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft size={18} />
            <span className="text-sm">Back to login</span>
          </button>

          <div className="text-center mb-8">
            <h1 className={cn(typography.title2.className, 'mb-2')}>
              Reset Password
            </h1>
            <p className={cn(typography.body.className, 'text-foreground/60')}>
              Enter your email and we&apos;ll send you instructions to reset
              your password
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail size={18} />}
              theme={theme}
              variant="glass"
              required
            />

            <Button
              type="submit"
              fullWidth
              variant="primary"
              theme={theme}
              loading={loading}
              size="lg"
            >
              Send Reset Instructions
            </Button>
          </form>
        </>
      ) : (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="text-green-500" size={32} />
          </div>
          <h2 className={cn(typography.title3.className, 'mb-2')}>
            Check your email
          </h2>
          <p
            className={cn(typography.body.className, 'text-foreground/60 mb-6')}
          >
            We&apos;ve sent password reset instructions to {email}
          </p>
          <Button onClick={onBack} variant="glass" theme={theme} fullWidth>
            Back to Login
          </Button>
        </div>
      )}
    </Card>
  )
}

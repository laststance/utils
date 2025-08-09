import type { Meta, StoryObj } from '@storybook/react'
import React, { useState } from 'react'
import { 
  Input,
  LoginForm,
  SignUpForm,
  PasswordResetForm
} from '@/components/design-system/Auth'
import { Mail, Lock, User, Phone, CreditCard, Search } from 'lucide-react'

const meta = {
  title: 'Components/Authentication',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Authentication components for user login, signup, and password reset flows.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta

export default meta

// Input Stories
export const InputVariants: StoryObj = {
  render: () => (
    <div className="w-full max-w-md space-y-6">
      <Input
        label="Default Input"
        placeholder="Enter text..."
        hint="This is a helpful hint"
      />
      
      <Input
        label="Glass Input"
        variant="glass"
        theme="glass-aurora"
        placeholder="Glass style input"
        icon={<User size={18} />}
      />
      
      <Input
        label="Minimal Input"
        variant="minimal"
        placeholder="Minimal style"
      />
      
      <Input
        label="Bold Input"
        variant="bold"
        placeholder="Bold border style"
      />
      
      <Input
        label="With Error"
        placeholder="Invalid input"
        error="This field is required"
        value="Invalid data"
      />
      
      <Input
        label="Disabled Input"
        placeholder="Cannot edit"
        disabled
        value="Disabled value"
      />
    </div>
  ),
}

export const InputTypes: StoryObj = {
  render: () => (
    <div className="w-full max-w-md space-y-6">
      <Input
        label="Email Input"
        type="email"
        placeholder="name@example.com"
        icon={<Mail size={18} />}
        variant="glass"
      />
      
      <Input
        label="Password Input"
        type="password"
        placeholder="Enter password"
        icon={<Lock size={18} />}
        showPasswordToggle
        variant="glass"
      />
      
      <Input
        label="Phone Number"
        type="tel"
        placeholder="+1 (555) 000-0000"
        icon={<Phone size={18} />}
      />
      
      <Input
        label="Search"
        type="search"
        placeholder="Search..."
        icon={<Search size={18} />}
      />
      
      <Input
        label="Credit Card"
        placeholder="0000 0000 0000 0000"
        icon={<CreditCard size={18} />}
      />
    </div>
  ),
}

// Login Form Story
export const LoginFormDefault: StoryObj = {
  render: () => {
    const [loading, setLoading] = useState(false)
    
    const handleSubmit = (data: { email: string; password: string }) => {
      setLoading(true)
      console.log('Login data:', data)
      setTimeout(() => setLoading(false), 2000)
    }
    
    return (
      <LoginForm
        onSubmit={handleSubmit}
        onForgotPassword={() => console.log('Forgot password')}
        onSignUp={() => console.log('Sign up')}
        loading={loading}
      />
    )
  },
}

export const LoginFormWithError: StoryObj = {
  render: () => (
    <LoginForm
      error="Invalid email or password. Please try again."
      onSubmit={(data) => console.log('Login:', data)}
      onForgotPassword={() => console.log('Forgot password')}
      onSignUp={() => console.log('Sign up')}
    />
  ),
}

export const LoginFormThemes: StoryObj = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <LoginForm
        theme="glass-aurora"
        onSubmit={(data) => console.log('Login:', data)}
      />
      
      <LoginForm
        theme="gradient-sunset"
        onSubmit={(data) => console.log('Login:', data)}
      />
      
      <LoginForm
        theme="glass-metallic-gold"
        onSubmit={(data) => console.log('Login:', data)}
      />
      
      <LoginForm
        theme="aurora-borealis"
        onSubmit={(data) => console.log('Login:', data)}
      />
    </div>
  ),
}

// Sign Up Form Story
export const SignUpFormDefault: StoryObj = {
  render: () => {
    const [loading, setLoading] = useState(false)
    
    const handleSubmit = (data: { name: string; email: string; password: string }) => {
      setLoading(true)
      console.log('Sign up data:', data)
      setTimeout(() => setLoading(false), 2000)
    }
    
    return (
      <SignUpForm
        onSubmit={handleSubmit}
        onLogin={() => console.log('Go to login')}
        loading={loading}
      />
    )
  },
}

export const SignUpFormWithError: StoryObj = {
  render: () => (
    <SignUpForm
      error="An account with this email already exists."
      onSubmit={(data) => console.log('Sign up:', data)}
      onLogin={() => console.log('Go to login')}
    />
  ),
}

// Password Reset Form Story
export const PasswordResetDefault: StoryObj = {
  render: () => {
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    
    const handleSubmit = (email: string) => {
      setLoading(true)
      console.log('Reset password for:', email)
      setTimeout(() => {
        setLoading(false)
        setSuccess(true)
      }, 2000)
    }
    
    return (
      <PasswordResetForm
        onSubmit={handleSubmit}
        onBack={() => {
          setSuccess(false)
          console.log('Back to login')
        }}
        loading={loading}
        success={success}
      />
    )
  },
}

// Complete Auth Flow
export const CompleteAuthFlow: StoryObj = {
  render: () => {
    const [view, setView] = useState<'login' | 'signup' | 'reset'>('login')
    
    return (
      <div className="min-h-[600px] flex items-center justify-center">
        {view === 'login' && (
          <LoginForm
            onSubmit={(data) => console.log('Login:', data)}
            onForgotPassword={() => setView('reset')}
            onSignUp={() => setView('signup')}
          />
        )}
        
        {view === 'signup' && (
          <SignUpForm
            onSubmit={(data) => console.log('Sign up:', data)}
            onLogin={() => setView('login')}
          />
        )}
        
        {view === 'reset' && (
          <PasswordResetForm
            onSubmit={(email) => console.log('Reset:', email)}
            onBack={() => setView('login')}
          />
        )}
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive authentication flow with transitions between login, signup, and password reset.',
      },
    },
  },
}
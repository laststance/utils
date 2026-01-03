'use client'

import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { LoginForm } from '@/components/blocks/login-form'
import { SignupForm } from '@/components/blocks/signup-form'
import { OTPForm } from '@/components/blocks/otp-form'

const meta = {
  title: 'Blocks/Authentication',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Authentication blocks from shadcn/ui registry. Includes login, signup, and OTP verification forms.',
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Login: Story = {
  name: 'Login Form',
  render: () => (
    <div className="w-[400px]">
      <LoginForm />
    </div>
  ),
}

export const Signup: Story = {
  name: 'Signup Form',
  render: () => (
    <div className="w-[400px]">
      <SignupForm />
    </div>
  ),
}

export const OTP: Story = {
  name: 'OTP Verification',
  render: () => (
    <div className="w-[400px]">
      <OTPForm />
    </div>
  ),
}

export const AllAuthForms: Story = {
  name: 'All Authentication Forms',
  render: () => (
    <div className="flex gap-8 p-4">
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium">Login Form</span>
        <div className="w-[400px] rounded-lg border p-4">
          <LoginForm />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium">Signup Form</span>
        <div className="w-[400px] rounded-lg border p-4">
          <SignupForm />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium">OTP Verification</span>
        <div className="w-[400px] rounded-lg border p-4">
          <OTPForm />
        </div>
      </div>
    </div>
  ),
}

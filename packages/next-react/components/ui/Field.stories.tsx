import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { Checkbox } from '@/components/ui/checkbox'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'

const meta = {
  title: 'UI/Field',
  component: Field,
  parameters: {
    layout: 'centered',
    docs: {
      codePanel: true,
      description: {
        component:
          'Field component for building accessible form fields with labels, descriptions, and error states.',
      },
    },
  },
  argTypes: {
    orientation: {
      control: { type: 'select' },
      options: ['vertical', 'horizontal', 'responsive'],
      description: 'Layout orientation of the field',
    },
    className: {
      control: { type: 'text' },
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof Field>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Field className="w-[400px]">
      <FieldLabel htmlFor="email">Email</FieldLabel>
      <Input id="email" type="email" placeholder="Enter your email" />
    </Field>
  ),
}

export const WithDescription: Story = {
  render: () => (
    <Field className="w-[400px]">
      <FieldLabel htmlFor="username">Username</FieldLabel>
      <Input id="username" placeholder="Enter username" />
      <FieldDescription>
        This will be your public display name.
      </FieldDescription>
    </Field>
  ),
}

export const WithError: Story = {
  render: () => (
    <Field className="w-[400px]" data-invalid="true">
      <FieldLabel htmlFor="password">Password</FieldLabel>
      <Input id="password" type="password" aria-invalid="true" />
      <FieldError
        errors={[{ message: 'Password must be at least 8 characters' }]}
      />
    </Field>
  ),
}

export const Horizontal: Story = {
  render: () => (
    <Field orientation="horizontal" className="w-[500px]">
      <FieldLabel htmlFor="name">Full Name</FieldLabel>
      <Input id="name" placeholder="John Doe" />
    </Field>
  ),
}

export const WithCheckbox: Story = {
  render: () => (
    <Field orientation="horizontal">
      <Checkbox id="terms" />
      <FieldContent>
        <FieldTitle>Accept terms and conditions</FieldTitle>
        <FieldDescription>
          You agree to our Terms of Service and Privacy Policy.
        </FieldDescription>
      </FieldContent>
    </Field>
  ),
}

export const FieldSetExample: Story = {
  render: () => (
    <FieldSet className="w-[400px]">
      <FieldLegend>Account Information</FieldLegend>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="first">First Name</FieldLabel>
          <Input id="first" placeholder="First name" />
        </Field>
        <FieldSeparator />
        <Field>
          <FieldLabel htmlFor="last">Last Name</FieldLabel>
          <Input id="last" placeholder="Last name" />
        </Field>
      </FieldGroup>
    </FieldSet>
  ),
}

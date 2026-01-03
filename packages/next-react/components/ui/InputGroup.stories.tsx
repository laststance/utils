import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Copy, Eye, Mail, Search } from 'lucide-react'

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from '@/components/ui/input-group'
import { Kbd } from '@/components/ui/kbd'

const meta = {
  title: 'UI/InputGroup',
  component: InputGroup,
  parameters: {
    layout: 'centered',
    docs: {
      codePanel: true,
      description: {
        component:
          'InputGroup component for combining inputs with addons, buttons, and icons.',
      },
    },
  },
  argTypes: {
    className: {
      control: { type: 'text' },
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof InputGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <InputGroup className="w-[300px]">
      <InputGroupInput placeholder="Enter text..." />
    </InputGroup>
  ),
}

export const WithIconStart: Story = {
  render: () => (
    <InputGroup className="w-[300px]">
      <InputGroupAddon align="inline-start">
        <Search className="size-4" />
      </InputGroupAddon>
      <InputGroupInput placeholder="Search..." />
    </InputGroup>
  ),
}

export const WithIconEnd: Story = {
  render: () => (
    <InputGroup className="w-[300px]">
      <InputGroupInput type="email" placeholder="Email address" />
      <InputGroupAddon align="inline-end">
        <Mail className="size-4" />
      </InputGroupAddon>
    </InputGroup>
  ),
}

export const WithButton: Story = {
  render: () => (
    <InputGroup className="w-[300px]">
      <InputGroupInput type="password" placeholder="Password" />
      <InputGroupAddon align="inline-end">
        <InputGroupButton variant="ghost" size="icon-xs">
          <Eye className="size-4" />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  ),
}

export const WithText: Story = {
  render: () => (
    <InputGroup className="w-[300px]">
      <InputGroupAddon align="inline-start">
        <InputGroupText>https://</InputGroupText>
      </InputGroupAddon>
      <InputGroupInput placeholder="example.com" />
    </InputGroup>
  ),
}

export const WithKbd: Story = {
  render: () => (
    <InputGroup className="w-[300px]">
      <InputGroupAddon align="inline-start">
        <Search className="size-4" />
      </InputGroupAddon>
      <InputGroupInput placeholder="Search..." />
      <InputGroupAddon align="inline-end">
        <Kbd>⌘K</Kbd>
      </InputGroupAddon>
    </InputGroup>
  ),
}

export const WithTextarea: Story = {
  render: () => (
    <InputGroup className="w-[400px]">
      <InputGroupTextarea placeholder="Enter your message..." rows={3} />
      <InputGroupAddon align="inline-end">
        <InputGroupButton variant="ghost" size="icon-sm">
          <Copy className="size-4" />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  ),
}

export const BlockLayout: Story = {
  render: () => (
    <InputGroup className="w-[400px]">
      <InputGroupAddon align="block-start">
        <InputGroupText>Description</InputGroupText>
      </InputGroupAddon>
      <InputGroupInput placeholder="Enter text..." />
    </InputGroup>
  ),
}

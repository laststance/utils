import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { RadioGroup } from '@/components/ui/radio-group'

const meta = {
  title: 'UI/RadioGroup',
  component: RadioGroup,
  parameters: {
    layout: 'centered',
    docs: {
      codePanel: true,
      description: {
        component: 'Radio Group component for building user interfaces.',
      },
    },
  },

  argTypes: {
    className: {
      control: { type: 'text' },
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof RadioGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <RadioGroup>
      {/* Add your component content here */}
      Default RadioGroup
    </RadioGroup>
  ),
}

export const Example: Story = {
  render: () => (
    <RadioGroup className="example-class">
      {/* Add example usage here */}
      Example RadioGroup
    </RadioGroup>
  ),
}

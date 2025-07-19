import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { Collapsible } from '@/components/ui/collapsible'

const meta = {
  title: 'UI/Collapsible',
  component: Collapsible,
  parameters: {
    layout: 'centered',
    docs: {
      codePanel: true,
      description: {
        component: 'Collapsible component for building user interfaces.',
      },
    },
  },

  argTypes: {
    className: {
      control: { type: 'text' },
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof Collapsible>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Collapsible>
      {/* Add your component content here */}
      Default Collapsible
    </Collapsible>
  ),
}

export const Example: Story = {
  render: () => (
    <Collapsible className="example-class">
      {/* Add example usage here */}
      Example Collapsible
    </Collapsible>
  ),
}

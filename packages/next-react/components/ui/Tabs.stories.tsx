import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { Tabs } from '@/components/ui/tabs'

const meta = {
  title: 'UI/Tabs',
  component: Tabs,
  parameters: {
    layout: 'centered',
    docs: {
      codePanel: true,
      description: {
        component: 'Tabs component for building user interfaces.',
      },
    },
  },

  argTypes: {
    className: {
      control: { type: 'text' },
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Tabs>
      {/* Add your component content here */}
      Default Tabs
    </Tabs>
  ),
}

export const Example: Story = {
  render: () => (
    <Tabs className="example-class">
      {/* Add example usage here */}
      Example Tabs
    </Tabs>
  ),
}

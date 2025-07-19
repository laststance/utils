import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { Skeleton } from '@/components/ui/skeleton'

const meta = {
  title: 'UI/Skeleton',
  component: Skeleton,
  parameters: {
    layout: 'centered',
    docs: {
      codePanel: true,
      description: {
        component: 'Skeleton component for building user interfaces.',
      },
    },
  },

  argTypes: {
    className: {
      control: { type: 'text' },
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof Skeleton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Skeleton>
      {/* Add your component content here */}
      Default Skeleton
    </Skeleton>
  ),
}

export const Example: Story = {
  render: () => (
    <Skeleton className="example-class">
      {/* Add example usage here */}
      Example Skeleton
    </Skeleton>
  ),
}

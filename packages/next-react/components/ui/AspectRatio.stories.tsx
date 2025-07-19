import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { AspectRatio } from '@/components/ui/aspect-ratio'

const meta = {
  title: 'UI/AspectRatio',
  component: AspectRatio,
  parameters: {
    layout: 'centered',
    docs: {
      codePanel: true,
      description: {
        component: 'Aspect Ratio component for building user interfaces.',
      },
    },
  },

  argTypes: {
    className: {
      control: { type: 'text' },
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof AspectRatio>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <AspectRatio>
      {/* Add your component content here */}
      Default AspectRatio
    </AspectRatio>
  ),
}

export const Example: Story = {
  render: () => (
    <AspectRatio className="example-class">
      {/* Add example usage here */}
      Example AspectRatio
    </AspectRatio>
  ),
}

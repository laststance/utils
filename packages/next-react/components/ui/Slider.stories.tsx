import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { Slider } from '@/components/ui/slider'

const meta = {
  title: 'UI/Slider',
  component: Slider,
  parameters: {
    layout: 'centered',
    docs: {
      codePanel: true,
      description: {
        component: 'Slider component for building user interfaces.',
      },
    },
  },

  argTypes: {
    className: {
      control: { type: 'text' },
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof Slider>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Slider>
      {/* Add your component content here */}
      Default Slider
    </Slider>
  ),
}

export const Example: Story = {
  render: () => (
    <Slider className="example-class">
      {/* Add example usage here */}
      Example Slider
    </Slider>
  ),
}

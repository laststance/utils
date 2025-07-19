import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { Breadcrumb } from '@/components/ui/breadcrumb'

const meta = {
  title: 'UI/Breadcrumb',
  component: Breadcrumb,
  parameters: {
    layout: 'centered',
    docs: {
      codePanel: true,
      description: {
        component: 'Breadcrumb component for building user interfaces.',
      },
    },
  },

  argTypes: {
    className: {
      control: { type: 'text' },
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof Breadcrumb>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Breadcrumb>
      {/* Add your component content here */}
      Default Breadcrumb
    </Breadcrumb>
  ),
}

export const Example: Story = {
  render: () => (
    <Breadcrumb className="example-class">
      {/* Add example usage here */}
      Example Breadcrumb
    </Breadcrumb>
  ),
}

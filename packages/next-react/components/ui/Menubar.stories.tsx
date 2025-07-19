import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { Menubar } from '@/components/ui/menubar'

const meta = {
  title: 'UI/Menubar',
  component: Menubar,
  parameters: {
    layout: 'centered',
    docs: {
      codePanel: true,
      description: {
        component: 'Menubar component for building user interfaces.',
      },
    },
  },

  argTypes: {
    className: {
      control: { type: 'text' },
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof Menubar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Menubar>
      {/* Add your component content here */}
      Default Menubar
    </Menubar>
  ),
}

export const Example: Story = {
  render: () => (
    <Menubar className="example-class">
      {/* Add example usage here */}
      Example Menubar
    </Menubar>
  ),
}

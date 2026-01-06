import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { toast } from 'sonner'

import { Toaster } from '@/components/ui/sonner'

const meta = {
  title: 'UI/Sonner',
  component: Toaster,
  parameters: {
    layout: 'centered',
    docs: {
      codePanel: true,
      description: {
        component: 'Toast notification system powered by Sonner.',
      },
    },
  },

  argTypes: {
    position: {
      control: { type: 'select' },
      options: [
        'top-left',
        'top-center',
        'top-right',
        'bottom-left',
        'bottom-center',
        'bottom-right',
      ],
      description: 'Position of the toast',
    },
    theme: {
      control: { type: 'select' },
      options: ['light', 'dark', 'system'],
      description: 'Theme of the toast',
    },
  },
} satisfies Meta<typeof Toaster>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <div>
      <Toaster {...args} />
      <button
        type="button"
        onClick={() => toast('Hello world!')}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Show Toast
      </button>
    </div>
  ),
}

export const WithActions: Story = {
  render: (args) => (
    <div className="space-y-2">
      <Toaster {...args} />
      <button
        type="button"
        onClick={() => toast.success('Successfully saved!')}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Success Toast
      </button>
      <button
        type="button"
        onClick={() => toast.error('Something went wrong!')}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Error Toast
      </button>
      <button
        type="button"
        onClick={() =>
          toast('Event has been created', {
            description: 'Sunday, December 03, 2023 at 9:00 AM',
            action: {
              label: 'Undo',
              onClick: () => console.log('Undo'),
            },
          })
        }
        className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
      >
        Toast with Action
      </button>
    </div>
  ),
}

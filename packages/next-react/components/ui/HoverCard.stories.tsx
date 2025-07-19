import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from '@/components/ui/hover-card'

const meta = {
  title: 'UI/HoverCard',
  component: HoverCard,
  parameters: {
    layout: 'centered',
    docs: {
      codePanel: true,
      description: {
        component:
          'A hover card component built on top of Radix UI Hover Card.',
      },
    },
  },

  argTypes: {
    open: {
      control: { type: 'boolean' },
      description: 'Controls whether the hover card is open',
    },
    openDelay: {
      control: { type: 'number' },
      description: 'Delay before opening (in ms)',
    },
  },
} satisfies Meta<typeof HoverCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <HoverCard {...args}>
      <HoverCardTrigger asChild>
        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          @nextjs
        </button>
      </HoverCardTrigger>
      <HoverCardContent>
        <div className="space-y-1">
          <h4 className="text-sm font-semibold">@nextjs</h4>
          <p className="text-sm">
            The React Framework – created and maintained by @vercel.
          </p>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
}

export const Simple: Story = {
  render: (args) => (
    <HoverCard {...args}>
      <HoverCardTrigger asChild>
        <span className="cursor-pointer text-blue-500 hover:underline">
          Hover me
        </span>
      </HoverCardTrigger>
      <HoverCardContent>
        <p className="text-sm">This is a simple hover card.</p>
      </HoverCardContent>
    </HoverCard>
  ),
}

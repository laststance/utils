'use client'

import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import Calendar17 from '@/components/blocks/calendar-17'
import Calendar18 from '@/components/blocks/calendar-18'
import Calendar19 from '@/components/blocks/calendar-19'
import Calendar20 from '@/components/blocks/calendar-20'
import Calendar21 from '@/components/blocks/calendar-21'
import Calendar22 from '@/components/blocks/calendar-22'
import Calendar23 from '@/components/blocks/calendar-23'
import Calendar24 from '@/components/blocks/calendar-24'
import Calendar25 from '@/components/blocks/calendar-25'
import Calendar26 from '@/components/blocks/calendar-26'
import Calendar27 from '@/components/blocks/calendar-27'
import Calendar28 from '@/components/blocks/calendar-28'
import Calendar29 from '@/components/blocks/calendar-29'
import Calendar30 from '@/components/blocks/calendar-30'
import Calendar31 from '@/components/blocks/calendar-31'
import Calendar32 from '@/components/blocks/calendar-32'

const meta = {
  title: 'Blocks/Calendar Advanced',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Advanced calendar blocks from shadcn/ui registry. Features custom styling, slots, and interactions.',
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Calendar17Story: Story = {
  name: 'Calendar 17 - Custom Day Content',
  render: () => <Calendar17 />,
}

export const Calendar18Story: Story = {
  name: 'Calendar 18 - With Events',
  render: () => <Calendar18 />,
}

export const Calendar19Story: Story = {
  name: 'Calendar 19 - Event Indicators',
  render: () => <Calendar19 />,
}

export const Calendar20Story: Story = {
  name: 'Calendar 20 - Custom Modifiers',
  render: () => <Calendar20 />,
}

export const Calendar21Story: Story = {
  name: 'Calendar 21 - Price Display',
  render: () => <Calendar21 />,
}

export const Calendar22Story: Story = {
  name: 'Calendar 22 - Selection Mode',
  render: () => <Calendar22 />,
}

export const Calendar23Story: Story = {
  name: 'Calendar 23 - Dark Theme',
  render: () => <Calendar23 />,
}

export const Calendar24Story: Story = {
  name: 'Calendar 24 - Compact',
  render: () => <Calendar24 />,
}

export const Calendar25Story: Story = {
  name: 'Calendar 25 - With Time',
  render: () => <Calendar25 />,
}

export const Calendar26Story: Story = {
  name: 'Calendar 26 - Preset Ranges',
  render: () => <Calendar26 />,
}

export const Calendar27Story: Story = {
  name: 'Calendar 27 - Natural Language',
  render: () => <Calendar27 />,
}

export const Calendar28Story: Story = {
  name: 'Calendar 28 - Multiple Selection',
  render: () => <Calendar28 />,
}

export const Calendar29Story: Story = {
  name: 'Calendar 29 - Date Range Presets',
  render: () => <Calendar29 />,
}

export const Calendar30Story: Story = {
  name: 'Calendar 30 - With Description',
  render: () => <Calendar30 />,
}

export const Calendar31Story: Story = {
  name: 'Calendar 31 - Timeline View',
  render: () => <Calendar31 />,
}

export const Calendar32Story: Story = {
  name: 'Calendar 32 - Full Featured',
  render: () => <Calendar32 />,
}

export const GalleryAdvanced: Story = {
  name: 'All Calendar Variants (17-32)',
  render: () => (
    <div className="grid gap-8 p-4">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">17 - Custom Day Content</span>
          <Calendar17 />
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">18 - With Events</span>
          <Calendar18 />
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">19 - Event Indicators</span>
          <Calendar19 />
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">20 - Custom Modifiers</span>
          <Calendar20 />
        </div>
      </div>
    </div>
  ),
}

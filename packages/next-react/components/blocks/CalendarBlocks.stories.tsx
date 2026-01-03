'use client'

import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import Calendar01 from '@/components/blocks/calendar-01'
import Calendar02 from '@/components/blocks/calendar-02'
import Calendar03 from '@/components/blocks/calendar-03'
import Calendar04 from '@/components/blocks/calendar-04'
import Calendar05 from '@/components/blocks/calendar-05'
import Calendar06 from '@/components/blocks/calendar-06'
import Calendar07 from '@/components/blocks/calendar-07'
import Calendar08 from '@/components/blocks/calendar-08'
import Calendar09 from '@/components/blocks/calendar-09'
import Calendar10 from '@/components/blocks/calendar-10'
import Calendar11 from '@/components/blocks/calendar-11'
import Calendar12 from '@/components/blocks/calendar-12'
import Calendar13 from '@/components/blocks/calendar-13'
import Calendar14 from '@/components/blocks/calendar-14'
import Calendar15 from '@/components/blocks/calendar-15'
import Calendar16 from '@/components/blocks/calendar-16'

const meta = {
  title: 'Blocks/Calendar',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Calendar blocks from shadcn/ui registry. Showcases various calendar layouts and configurations.',
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Single: Story = {
  name: 'Calendar 01 - Single Selection',
  render: () => <Calendar01 />,
}

export const Range: Story = {
  name: 'Calendar 02 - Range Selection',
  render: () => <Calendar02 />,
}

export const WithInput: Story = {
  name: 'Calendar 03 - With Input',
  render: () => <Calendar03 />,
}

export const TwoMonths: Story = {
  name: 'Calendar 04 - Two Months',
  render: () => <Calendar04 />,
}

export const ThreeMonths: Story = {
  name: 'Calendar 05 - Three Months',
  render: () => <Calendar05 />,
}

export const SixMonths: Story = {
  name: 'Calendar 06 - Six Months',
  render: () => <Calendar06 />,
}

export const MonthPicker: Story = {
  name: 'Calendar 07 - Month Picker',
  render: () => <Calendar07 />,
}

export const YearPicker: Story = {
  name: 'Calendar 08 - Year Picker',
  render: () => <Calendar08 />,
}

export const WeekNumbers: Story = {
  name: 'Calendar 09 - Week Numbers',
  render: () => <Calendar09 />,
}

export const DisabledDates: Story = {
  name: 'Calendar 10 - Disabled Dates',
  render: () => <Calendar10 />,
}

export const HiddenNavigation: Story = {
  name: 'Calendar 11 - Hidden Navigation',
  render: () => <Calendar11 />,
}

export const DropdownNavigation: Story = {
  name: 'Calendar 12 - Dropdown Navigation',
  render: () => <Calendar12 />,
}

export const CustomStartWeek: Story = {
  name: 'Calendar 13 - Custom Start Week',
  render: () => <Calendar13 />,
}

export const FixedWeeks: Story = {
  name: 'Calendar 14 - Fixed Weeks',
  render: () => <Calendar14 />,
}

export const ShowOutsideDays: Story = {
  name: 'Calendar 15 - Show Outside Days',
  render: () => <Calendar15 />,
}

export const MultipleMonths: Story = {
  name: 'Calendar 16 - Multiple Months',
  render: () => <Calendar16 />,
}

export const Gallery: Story = {
  name: 'All Calendar Variants (1-16)',
  render: () => (
    <div className="grid gap-8 p-4">
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">01 - Single Selection</span>
          <Calendar01 />
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">02 - Range Selection</span>
          <Calendar02 />
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">03 - With Input</span>
          <Calendar03 />
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">04 - Two Months</span>
          <Calendar04 />
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">05 - Three Months</span>
          <Calendar05 />
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">06 - Six Months</span>
          <Calendar06 />
        </div>
      </div>
    </div>
  ),
}

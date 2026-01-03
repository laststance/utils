'use client'

import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { DataTable } from '@/components/blocks/data-table'
import { DatePicker } from '@/components/blocks/date-picker'
import { Calendars } from '@/components/blocks/calendars'
import { SettingsDialog } from '@/components/blocks/settings-dialog'
import { SectionCards } from '@/components/blocks/section-cards'

const meta = {
  title: 'Blocks/Miscellaneous',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Miscellaneous blocks from shadcn/ui registry. Includes data tables, date pickers, and settings dialogs.',
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const sampleCalendars = [
  {
    name: 'My Calendars',
    items: ['Personal', 'Work', 'Family'],
  },
  {
    name: 'Favorites',
    items: ['Holidays', 'Birthdays'],
  },
]

export const DatePickerStory: Story = {
  name: 'Date Picker',
  render: () => <DatePicker />,
}

export const CalendarsStory: Story = {
  name: 'Calendars List',
  render: () => <Calendars calendars={sampleCalendars} />,
}

export const SettingsDialogStory: Story = {
  name: 'Settings Dialog',
  render: () => <SettingsDialog />,
}

export const SectionCardsStory: Story = {
  name: 'Section Cards',
  parameters: {
    layout: 'padded',
  },
  render: () => <SectionCards />,
}

export const DataTableStory: Story = {
  name: 'Data Table',
  parameters: {
    layout: 'padded',
  },
  render: () => <DataTable data={[]} />,
}

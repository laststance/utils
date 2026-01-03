import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { FileX, Inbox, Search } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'

const meta = {
  title: 'UI/Empty',
  component: Empty,
  parameters: {
    layout: 'centered',
    docs: {
      codePanel: true,
      description: {
        component:
          'Empty component for displaying empty states with icons, titles, descriptions, and actions.',
      },
    },
  },
  argTypes: {
    className: {
      control: { type: 'text' },
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof Empty>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Empty className="w-[400px]">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Inbox />
        </EmptyMedia>
        <EmptyTitle>No items</EmptyTitle>
        <EmptyDescription>
          There are no items to display. Create a new item to get started.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  ),
}

export const WithAction: Story = {
  render: () => (
    <Empty className="w-[400px]">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FileX />
        </EmptyMedia>
        <EmptyTitle>No documents</EmptyTitle>
        <EmptyDescription>
          You haven&apos;t created any documents yet.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button>Create document</Button>
      </EmptyContent>
    </Empty>
  ),
}

export const SearchNoResults: Story = {
  render: () => (
    <Empty className="w-[400px]">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Search />
        </EmptyMedia>
        <EmptyTitle>No results found</EmptyTitle>
        <EmptyDescription>
          Try adjusting your search or filter to find what you&apos;re looking
          for.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline">Clear filters</Button>
      </EmptyContent>
    </Empty>
  ),
}

export const MediaVariants: Story = {
  render: () => (
    <div className="flex gap-8">
      <Empty className="w-[300px]">
        <EmptyHeader>
          <EmptyMedia variant="default">
            <Inbox className="size-12 text-muted-foreground" />
          </EmptyMedia>
          <EmptyTitle>Default variant</EmptyTitle>
        </EmptyHeader>
      </Empty>
      <Empty className="w-[300px]">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Inbox />
          </EmptyMedia>
          <EmptyTitle>Icon variant</EmptyTitle>
        </EmptyHeader>
      </Empty>
    </div>
  ),
}

import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { File, MoreHorizontal, User } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from '@/components/ui/item'

const meta = {
  title: 'UI/Item',
  component: Item,
  parameters: {
    layout: 'centered',
    docs: {
      codePanel: true,
      description: {
        component:
          'Item component for building list items with media, content, and actions.',
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'outline', 'muted'],
      description: 'Visual variant of the item',
    },
    size: {
      control: { type: 'select' },
      options: ['default', 'sm'],
      description: 'Size of the item',
    },
    className: {
      control: { type: 'text' },
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof Item>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Item className="w-[400px]">
      <ItemContent>
        <ItemTitle>Item Title</ItemTitle>
        <ItemDescription>This is a description of the item.</ItemDescription>
      </ItemContent>
    </Item>
  ),
}

export const WithIcon: Story = {
  render: () => (
    <Item className="w-[400px]">
      <ItemMedia variant="icon">
        <File />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Document.pdf</ItemTitle>
        <ItemDescription>Uploaded 2 hours ago</ItemDescription>
      </ItemContent>
    </Item>
  ),
}

export const WithImage: Story = {
  render: () => (
    <Item className="w-[400px]">
      <ItemMedia variant="image">
        <img src="https://via.placeholder.com/40" alt="Avatar" />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>John Doe</ItemTitle>
        <ItemDescription>Software Engineer</ItemDescription>
      </ItemContent>
    </Item>
  ),
}

export const WithActions: Story = {
  render: () => (
    <Item className="w-[400px]">
      <ItemMedia variant="icon">
        <User />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>User Account</ItemTitle>
        <ItemDescription>Manage your account settings</ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="size-4" />
        </Button>
      </ItemActions>
    </Item>
  ),
}

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-[400px]">
      <Item variant="default">
        <ItemContent>
          <ItemTitle>Default variant</ItemTitle>
        </ItemContent>
      </Item>
      <Item variant="outline">
        <ItemContent>
          <ItemTitle>Outline variant</ItemTitle>
        </ItemContent>
      </Item>
      <Item variant="muted">
        <ItemContent>
          <ItemTitle>Muted variant</ItemTitle>
        </ItemContent>
      </Item>
    </div>
  ),
}

export const ItemGroupExample: Story = {
  render: () => (
    <ItemGroup className="w-[400px] border rounded-md">
      <Item>
        <ItemMedia variant="icon">
          <File />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Report.pdf</ItemTitle>
          <ItemDescription>2.4 MB</ItemDescription>
        </ItemContent>
      </Item>
      <ItemSeparator />
      <Item>
        <ItemMedia variant="icon">
          <File />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Invoice.pdf</ItemTitle>
          <ItemDescription>1.2 MB</ItemDescription>
        </ItemContent>
      </Item>
      <ItemSeparator />
      <Item>
        <ItemMedia variant="icon">
          <File />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Contract.pdf</ItemTitle>
          <ItemDescription>3.8 MB</ItemDescription>
        </ItemContent>
      </Item>
    </ItemGroup>
  ),
}

export const WithHeaderFooter: Story = {
  render: () => (
    <Item className="w-[400px]" variant="outline">
      <ItemHeader>
        <ItemTitle>Project Update</ItemTitle>
        <span className="text-xs text-muted-foreground">2h ago</span>
      </ItemHeader>
      <ItemContent>
        <ItemDescription>
          The latest project milestone has been completed successfully.
        </ItemDescription>
      </ItemContent>
      <ItemFooter>
        <Button variant="outline" size="sm">
          View Details
        </Button>
      </ItemFooter>
    </Item>
  ),
}

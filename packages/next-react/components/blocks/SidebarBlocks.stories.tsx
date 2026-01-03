'use client'

import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { AppSidebar } from '@/components/blocks/app-sidebar'
import { SidebarLeft } from '@/components/blocks/sidebar-left'
import { SidebarRight } from '@/components/blocks/sidebar-right'
import { SidebarOptInForm } from '@/components/blocks/sidebar-opt-in-form'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'

const meta: Meta = {
  title: 'Blocks/Sidebar',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Sidebar blocks from shadcn/ui registry. Responsive sidebar layouts with navigation and content areas.',
      },
    },
  },
  decorators: [
    (Story) => (
      <SidebarProvider>
        <Story />
      </SidebarProvider>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof meta>

export const AppSidebarStory: Story = {
  name: 'App Sidebar',
  render: () => (
    <div className="flex h-[600px] w-full">
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="h-32 rounded-xl bg-muted/50" />
          <div className="h-32 rounded-xl bg-muted/50" />
        </div>
      </SidebarInset>
    </div>
  ),
}

export const LeftSidebar: Story = {
  name: 'Left Sidebar',
  render: () => (
    <div className="flex h-[600px] w-full">
      <SidebarLeft />
      <SidebarInset>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="h-32 rounded-xl bg-muted/50" />
          <div className="h-32 rounded-xl bg-muted/50" />
        </div>
      </SidebarInset>
    </div>
  ),
}

export const RightSidebar: Story = {
  name: 'Right Sidebar',
  render: () => (
    <div className="flex h-[600px] w-full">
      <SidebarInset>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="h-32 rounded-xl bg-muted/50" />
          <div className="h-32 rounded-xl bg-muted/50" />
        </div>
      </SidebarInset>
      <SidebarRight />
    </div>
  ),
}

export const OptInForm: Story = {
  name: 'Opt-in Form',
  parameters: {
    layout: 'centered',
  },
  render: () => <SidebarOptInForm />,
}

export const DualSidebar: Story = {
  name: 'Dual Sidebar Layout',
  render: () => (
    <div className="flex h-[600px] w-full">
      <SidebarLeft />
      <SidebarInset>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="h-32 rounded-xl bg-muted/50" />
          <div className="h-32 rounded-xl bg-muted/50" />
        </div>
      </SidebarInset>
      <SidebarRight />
    </div>
  ),
}

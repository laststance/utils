'use client'

import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import {
  Calendar,
  FileText,
  Home,
  LifeBuoy,
  Send,
  Settings,
  Users,
  type LucideIcon,
} from 'lucide-react'

import { NavFavorites } from '@/components/blocks/nav-favorites'
import { NavMain } from '@/components/blocks/nav-main'
import { NavProjects } from '@/components/blocks/nav-projects'
import { NavSecondary } from '@/components/blocks/nav-secondary'
import { NavUser } from '@/components/blocks/nav-user'
import { SearchForm } from '@/components/blocks/search-form'
import { SiteHeader } from '@/components/blocks/site-header'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarProvider,
} from '@/components/ui/sidebar'

const meta = {
  title: 'Blocks/Navigation',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Navigation blocks from shadcn/ui registry. Sidebar navigation components for various use cases.',
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const sampleNavItems = [
  { title: 'Home', url: '#', icon: Home, isActive: true },
  { title: 'Users', url: '#', icon: Users },
  { title: 'Documents', url: '#', icon: FileText },
  { title: 'Calendar', url: '#', icon: Calendar },
  { title: 'Settings', url: '#', icon: Settings },
]

const sampleSecondaryItems = [
  { title: 'Support', url: '#', icon: LifeBuoy },
  { title: 'Feedback', url: '#', icon: Send },
]

const sampleUser = {
  name: 'John Doe',
  email: 'john@example.com',
  avatar: '/avatars/john.jpg',
}

const sampleProjects: { name: string; url: string; icon: LucideIcon }[] = [
  { name: 'Project Alpha', url: '#', icon: Home },
  { name: 'Project Beta', url: '#', icon: FileText },
]

const sampleFavorites = [
  { name: 'Dashboard', url: '#', emoji: '📊' },
  { name: 'Reports', url: '#', emoji: '📈' },
]

export const MainNav: Story = {
  name: 'Main Navigation',
  render: () => (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent>
          <NavMain items={sampleNavItems} />
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  ),
}

export const SecondaryNav: Story = {
  name: 'Secondary Navigation',
  render: () => (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent>
          <NavSecondary items={sampleSecondaryItems} />
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  ),
}

export const UserNav: Story = {
  name: 'User Navigation',
  render: () => (
    <SidebarProvider>
      <Sidebar>
        <SidebarFooter>
          <NavUser user={sampleUser} />
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  ),
}

export const ProjectsNav: Story = {
  name: 'Projects Navigation',
  render: () => (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent>
          <NavProjects projects={sampleProjects} />
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  ),
}

export const FavoritesNav: Story = {
  name: 'Favorites Navigation',
  render: () => (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent>
          <NavFavorites favorites={sampleFavorites} />
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  ),
}

export const Search: Story = {
  name: 'Search Form',
  render: () => (
    <div className="w-[300px]">
      <SearchForm />
    </div>
  ),
}

export const Header: Story = {
  name: 'Site Header',
  parameters: {
    layout: 'fullscreen',
  },
  render: () => <SiteHeader />,
}

export const FullSidebar: Story = {
  name: 'Complete Sidebar',
  render: () => (
    <SidebarProvider>
      <Sidebar className="h-[600px]">
        <SidebarHeader>
          <SearchForm />
        </SidebarHeader>
        <SidebarContent>
          <NavMain items={sampleNavItems} />
          <NavProjects projects={sampleProjects} />
          <NavSecondary items={sampleSecondaryItems} />
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={sampleUser} />
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  ),
}

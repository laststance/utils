import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Command } from 'lucide-react'

import { Kbd, KbdGroup } from '@/components/ui/kbd'

const meta = {
  title: 'UI/Kbd',
  component: Kbd,
  parameters: {
    layout: 'centered',
    docs: {
      codePanel: true,
      description: {
        component:
          'Kbd component for displaying keyboard shortcuts and key combinations.',
      },
    },
  },
  argTypes: {
    className: {
      control: { type: 'text' },
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof Kbd>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <Kbd>K</Kbd>,
}

export const SingleKeys: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Kbd>Esc</Kbd>
      <Kbd>Tab</Kbd>
      <Kbd>Enter</Kbd>
      <Kbd>Space</Kbd>
    </div>
  ),
}

export const KeyCombination: Story = {
  render: () => (
    <KbdGroup>
      <Kbd>
        <Command className="size-3" />
      </Kbd>
      <Kbd>K</Kbd>
    </KbdGroup>
  ),
}

export const CommonShortcuts: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm">Save</span>
        <KbdGroup>
          <Kbd>
            <Command className="size-3" />
          </Kbd>
          <Kbd>S</Kbd>
        </KbdGroup>
      </div>
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm">Copy</span>
        <KbdGroup>
          <Kbd>
            <Command className="size-3" />
          </Kbd>
          <Kbd>C</Kbd>
        </KbdGroup>
      </div>
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm">Paste</span>
        <KbdGroup>
          <Kbd>
            <Command className="size-3" />
          </Kbd>
          <Kbd>V</Kbd>
        </KbdGroup>
      </div>
    </div>
  ),
}

export const ArrowKeys: Story = {
  render: () => (
    <div className="flex flex-col items-center gap-1">
      <Kbd>↑</Kbd>
      <div className="flex gap-1">
        <Kbd>←</Kbd>
        <Kbd>↓</Kbd>
        <Kbd>→</Kbd>
      </div>
    </div>
  ),
}

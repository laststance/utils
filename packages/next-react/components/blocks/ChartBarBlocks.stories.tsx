'use client'

import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { ChartBarActive } from '@/components/blocks/chart-bar-active'
import { ChartBarDefault } from '@/components/blocks/chart-bar-default'
import { ChartBarHorizontal } from '@/components/blocks/chart-bar-horizontal'
import { ChartBarInteractive } from '@/components/blocks/chart-bar-interactive'
import { ChartBarLabel } from '@/components/blocks/chart-bar-label'
import { ChartBarLabelCustom } from '@/components/blocks/chart-bar-label-custom'
import { ChartBarMixed } from '@/components/blocks/chart-bar-mixed'
import { ChartBarMultiple } from '@/components/blocks/chart-bar-multiple'
import { ChartBarNegative } from '@/components/blocks/chart-bar-negative'
import { ChartBarStacked } from '@/components/blocks/chart-bar-stacked'

const meta = {
  title: 'Blocks/Charts/Bar',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Bar chart blocks from shadcn/ui registry. Vertical and horizontal layouts with various configurations.',
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  name: 'Default',
  render: () => <ChartBarDefault />,
}

export const Active: Story = {
  name: 'Active State',
  render: () => <ChartBarActive />,
}

export const Horizontal: Story = {
  name: 'Horizontal',
  render: () => <ChartBarHorizontal />,
}

export const Interactive: Story = {
  name: 'Interactive',
  render: () => <ChartBarInteractive />,
}

export const Label: Story = {
  name: 'With Label',
  render: () => <ChartBarLabel />,
}

export const LabelCustom: Story = {
  name: 'Custom Label',
  render: () => <ChartBarLabelCustom />,
}

export const Mixed: Story = {
  name: 'Mixed',
  render: () => <ChartBarMixed />,
}

export const Multiple: Story = {
  name: 'Multiple Series',
  render: () => <ChartBarMultiple />,
}

export const Negative: Story = {
  name: 'Negative Values',
  render: () => <ChartBarNegative />,
}

export const Stacked: Story = {
  name: 'Stacked',
  render: () => <ChartBarStacked />,
}

export const Gallery: Story = {
  name: 'All Bar Charts',
  render: () => (
    <div className="grid gap-8 p-4 md:grid-cols-2">
      <ChartBarDefault />
      <ChartBarHorizontal />
      <ChartBarMultiple />
      <ChartBarStacked />
      <ChartBarNegative />
      <ChartBarMixed />
    </div>
  ),
}

'use client'

import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { ChartAreaAxes } from '@/components/blocks/chart-area-axes'
import { ChartAreaDefault } from '@/components/blocks/chart-area-default'
import { ChartAreaGradient } from '@/components/blocks/chart-area-gradient'
import { ChartAreaIcons } from '@/components/blocks/chart-area-icons'
import { ChartAreaInteractive } from '@/components/blocks/chart-area-interactive'
import { ChartAreaLegend } from '@/components/blocks/chart-area-legend'
import { ChartAreaLinear } from '@/components/blocks/chart-area-linear'
import { ChartAreaStackedExpand } from '@/components/blocks/chart-area-stacked-expand'
import { ChartAreaStacked } from '@/components/blocks/chart-area-stacked'
import { ChartAreaStep } from '@/components/blocks/chart-area-step'

const meta = {
  title: 'Blocks/Charts/Area',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Area chart blocks from shadcn/ui registry. Built with Recharts and styled with Tailwind CSS.',
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  name: 'Default',
  render: () => <ChartAreaDefault />,
}

export const Axes: Story = {
  name: 'With Axes',
  render: () => <ChartAreaAxes />,
}

export const Gradient: Story = {
  name: 'Gradient Fill',
  render: () => <ChartAreaGradient />,
}

export const Icons: Story = {
  name: 'With Icons',
  render: () => <ChartAreaIcons />,
}

export const Interactive: Story = {
  name: 'Interactive',
  render: () => <ChartAreaInteractive />,
}

export const Legend: Story = {
  name: 'With Legend',
  render: () => <ChartAreaLegend />,
}

export const Linear: Story = {
  name: 'Linear Curve',
  render: () => <ChartAreaLinear />,
}

export const Stacked: Story = {
  name: 'Stacked',
  render: () => <ChartAreaStacked />,
}

export const StackedExpand: Story = {
  name: 'Stacked Expand',
  render: () => <ChartAreaStackedExpand />,
}

export const Step: Story = {
  name: 'Step Curve',
  render: () => <ChartAreaStep />,
}

export const Gallery: Story = {
  name: 'All Area Charts',
  render: () => (
    <div className="grid gap-8 p-4 md:grid-cols-2">
      <ChartAreaDefault />
      <ChartAreaAxes />
      <ChartAreaGradient />
      <ChartAreaLegend />
      <ChartAreaStacked />
      <ChartAreaStackedExpand />
    </div>
  ),
}

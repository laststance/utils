'use client'

import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { ChartRadialGrid } from '@/components/blocks/chart-radial-grid'
import { ChartRadialLabel } from '@/components/blocks/chart-radial-label'
import { ChartRadialShape } from '@/components/blocks/chart-radial-shape'
import { ChartRadialSimple } from '@/components/blocks/chart-radial-simple'
import { ChartRadialStacked } from '@/components/blocks/chart-radial-stacked'
import { ChartRadialText } from '@/components/blocks/chart-radial-text'

const meta = {
  title: 'Blocks/Charts/Radial',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Radial chart blocks from shadcn/ui registry. Circular progress and gauge-style visualizations.',
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Simple: Story = {
  name: 'Simple',
  render: () => <ChartRadialSimple />,
}

export const Grid: Story = {
  name: 'With Grid',
  render: () => <ChartRadialGrid />,
}

export const Label: Story = {
  name: 'With Label',
  render: () => <ChartRadialLabel />,
}

export const Shape: Story = {
  name: 'Custom Shape',
  render: () => <ChartRadialShape />,
}

export const Stacked: Story = {
  name: 'Stacked',
  render: () => <ChartRadialStacked />,
}

export const Text: Story = {
  name: 'With Text',
  render: () => <ChartRadialText />,
}

export const Gallery: Story = {
  name: 'All Radial Charts',
  render: () => (
    <div className="grid gap-8 p-4 md:grid-cols-2 lg:grid-cols-3">
      <ChartRadialSimple />
      <ChartRadialGrid />
      <ChartRadialLabel />
      <ChartRadialShape />
      <ChartRadialStacked />
      <ChartRadialText />
    </div>
  ),
}

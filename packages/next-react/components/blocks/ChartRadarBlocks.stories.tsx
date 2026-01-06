'use client'

import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { ChartRadarDefault } from '@/components/blocks/chart-radar-default'
import { ChartRadarDots } from '@/components/blocks/chart-radar-dots'
import { ChartRadarGridCircle } from '@/components/blocks/chart-radar-grid-circle'
import { ChartRadarGridCircleFill } from '@/components/blocks/chart-radar-grid-circle-fill'
import { ChartRadarGridCircleNoLines } from '@/components/blocks/chart-radar-grid-circle-no-lines'
import { ChartRadarGridCustom } from '@/components/blocks/chart-radar-grid-custom'
import { ChartRadarGridFill } from '@/components/blocks/chart-radar-grid-fill'
import { ChartRadarGridNone } from '@/components/blocks/chart-radar-grid-none'
import { ChartRadarIcons } from '@/components/blocks/chart-radar-icons'
import { ChartRadarLabelCustom } from '@/components/blocks/chart-radar-label-custom'
import { ChartRadarLegend } from '@/components/blocks/chart-radar-legend'
import { ChartRadarLinesOnly } from '@/components/blocks/chart-radar-lines-only'
import { ChartRadarMultiple } from '@/components/blocks/chart-radar-multiple'
import { ChartRadarRadius } from '@/components/blocks/chart-radar-radius'

const meta = {
  title: 'Blocks/Charts/Radar',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Radar chart blocks from shadcn/ui registry. Various grid and data visualization configurations.',
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  name: 'Default',
  render: () => <ChartRadarDefault />,
}

export const Dots: Story = {
  name: 'With Dots',
  render: () => <ChartRadarDots />,
}

export const GridCircle: Story = {
  name: 'Circle Grid',
  render: () => <ChartRadarGridCircle />,
}

export const GridCircleFill: Story = {
  name: 'Circle Grid Fill',
  render: () => <ChartRadarGridCircleFill />,
}

export const GridCircleNoLines: Story = {
  name: 'Circle Grid No Lines',
  render: () => <ChartRadarGridCircleNoLines />,
}

export const GridCustom: Story = {
  name: 'Custom Grid',
  render: () => <ChartRadarGridCustom />,
}

export const GridFill: Story = {
  name: 'Grid Fill',
  render: () => <ChartRadarGridFill />,
}

export const GridNone: Story = {
  name: 'No Grid',
  render: () => <ChartRadarGridNone />,
}

export const Icons: Story = {
  name: 'With Icons',
  render: () => <ChartRadarIcons />,
}

export const LabelCustom: Story = {
  name: 'Custom Label',
  render: () => <ChartRadarLabelCustom />,
}

export const Legend: Story = {
  name: 'With Legend',
  render: () => <ChartRadarLegend />,
}

export const LinesOnly: Story = {
  name: 'Lines Only',
  render: () => <ChartRadarLinesOnly />,
}

export const Multiple: Story = {
  name: 'Multiple Series',
  render: () => <ChartRadarMultiple />,
}

export const Radius: Story = {
  name: 'With Radius Axis',
  render: () => <ChartRadarRadius />,
}

export const Gallery: Story = {
  name: 'All Radar Charts',
  render: () => (
    <div className="grid gap-8 p-4 md:grid-cols-2 lg:grid-cols-3">
      <ChartRadarDefault />
      <ChartRadarDots />
      <ChartRadarGridCircle />
      <ChartRadarGridFill />
      <ChartRadarMultiple />
      <ChartRadarLegend />
    </div>
  ),
}

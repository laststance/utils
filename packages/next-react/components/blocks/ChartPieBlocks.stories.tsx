'use client'

import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { ChartPieDonutActive } from '@/components/blocks/chart-pie-donut-active'
import { ChartPieDonutText } from '@/components/blocks/chart-pie-donut-text'
import { ChartPieDonut } from '@/components/blocks/chart-pie-donut'
import { ChartPieInteractive } from '@/components/blocks/chart-pie-interactive'
import { ChartPieLabelCustom } from '@/components/blocks/chart-pie-label-custom'
import { ChartPieLabelList } from '@/components/blocks/chart-pie-label-list'
import { ChartPieLabel } from '@/components/blocks/chart-pie-label'
import { ChartPieLegend } from '@/components/blocks/chart-pie-legend'
import { ChartPieSeparatorNone } from '@/components/blocks/chart-pie-separator-none'
import { ChartPieSimple } from '@/components/blocks/chart-pie-simple'
import { ChartPieStacked } from '@/components/blocks/chart-pie-stacked'

const meta = {
  title: 'Blocks/Charts/Pie',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Pie and donut chart blocks from shadcn/ui registry. Various label and legend configurations.',
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Simple: Story = {
  name: 'Simple',
  render: () => <ChartPieSimple />,
}

export const Donut: Story = {
  name: 'Donut',
  render: () => <ChartPieDonut />,
}

export const DonutActive: Story = {
  name: 'Donut Active',
  render: () => <ChartPieDonutActive />,
}

export const DonutText: Story = {
  name: 'Donut with Text',
  render: () => <ChartPieDonutText />,
}

export const Interactive: Story = {
  name: 'Interactive',
  render: () => <ChartPieInteractive />,
}

export const Label: Story = {
  name: 'With Label',
  render: () => <ChartPieLabel />,
}

export const LabelCustom: Story = {
  name: 'Custom Label',
  render: () => <ChartPieLabelCustom />,
}

export const LabelList: Story = {
  name: 'Label List',
  render: () => <ChartPieLabelList />,
}

export const Legend: Story = {
  name: 'With Legend',
  render: () => <ChartPieLegend />,
}

export const SeparatorNone: Story = {
  name: 'No Separator',
  render: () => <ChartPieSeparatorNone />,
}

export const Stacked: Story = {
  name: 'Stacked',
  render: () => <ChartPieStacked />,
}

export const Gallery: Story = {
  name: 'All Pie Charts',
  render: () => (
    <div className="grid gap-8 p-4 md:grid-cols-2 lg:grid-cols-3">
      <ChartPieSimple />
      <ChartPieDonut />
      <ChartPieDonutActive />
      <ChartPieDonutText />
      <ChartPieLegend />
      <ChartPieStacked />
    </div>
  ),
}

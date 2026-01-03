'use client'

import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { ChartTooltipAdvanced } from '@/components/blocks/chart-tooltip-advanced'
import { ChartTooltipDefault } from '@/components/blocks/chart-tooltip-default'
import { ChartTooltipFormatter } from '@/components/blocks/chart-tooltip-formatter'
import { ChartTooltipIcons } from '@/components/blocks/chart-tooltip-icons'
import { ChartTooltipIndicatorLine } from '@/components/blocks/chart-tooltip-indicator-line'
import { ChartTooltipIndicatorNone } from '@/components/blocks/chart-tooltip-indicator-none'
import { ChartTooltipLabelCustom } from '@/components/blocks/chart-tooltip-label-custom'
import { ChartTooltipLabelFormatter } from '@/components/blocks/chart-tooltip-label-formatter'
import { ChartTooltipLabelNone } from '@/components/blocks/chart-tooltip-label-none'

const meta = {
  title: 'Blocks/Charts/Tooltip',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Chart tooltip blocks from shadcn/ui registry. Various tooltip styles and configurations.',
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  name: 'Default',
  render: () => <ChartTooltipDefault />,
}

export const Advanced: Story = {
  name: 'Advanced',
  render: () => <ChartTooltipAdvanced />,
}

export const Formatter: Story = {
  name: 'With Formatter',
  render: () => <ChartTooltipFormatter />,
}

export const Icons: Story = {
  name: 'With Icons',
  render: () => <ChartTooltipIcons />,
}

export const IndicatorLine: Story = {
  name: 'Line Indicator',
  render: () => <ChartTooltipIndicatorLine />,
}

export const IndicatorNone: Story = {
  name: 'No Indicator',
  render: () => <ChartTooltipIndicatorNone />,
}

export const LabelCustom: Story = {
  name: 'Custom Label',
  render: () => <ChartTooltipLabelCustom />,
}

export const LabelFormatter: Story = {
  name: 'Label Formatter',
  render: () => <ChartTooltipLabelFormatter />,
}

export const LabelNone: Story = {
  name: 'No Label',
  render: () => <ChartTooltipLabelNone />,
}

export const Gallery: Story = {
  name: 'All Tooltip Variants',
  render: () => (
    <div className="grid gap-8 p-4 md:grid-cols-2 lg:grid-cols-3">
      <ChartTooltipDefault />
      <ChartTooltipAdvanced />
      <ChartTooltipFormatter />
      <ChartTooltipIcons />
      <ChartTooltipIndicatorLine />
      <ChartTooltipLabelCustom />
    </div>
  ),
}

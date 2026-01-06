'use client'

import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { ChartLineDefault } from '@/components/blocks/chart-line-default'
import { ChartLineDots } from '@/components/blocks/chart-line-dots'
import { ChartLineDotsColors } from '@/components/blocks/chart-line-dots-colors'
import { ChartLineDotsCustom } from '@/components/blocks/chart-line-dots-custom'
import { ChartLineInteractive } from '@/components/blocks/chart-line-interactive'
import { ChartLineLabel } from '@/components/blocks/chart-line-label'
import { ChartLineLabelCustom } from '@/components/blocks/chart-line-label-custom'
import { ChartLineLinear } from '@/components/blocks/chart-line-linear'
import { ChartLineMultiple } from '@/components/blocks/chart-line-multiple'
import { ChartLineStep } from '@/components/blocks/chart-line-step'

const meta = {
  title: 'Blocks/Charts/Line',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Line chart blocks from shadcn/ui registry. Various curve types and data point configurations.',
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  name: 'Default',
  render: () => <ChartLineDefault />,
}

export const Dots: Story = {
  name: 'With Dots',
  render: () => <ChartLineDots />,
}

export const DotsColors: Story = {
  name: 'Colored Dots',
  render: () => <ChartLineDotsColors />,
}

export const DotsCustom: Story = {
  name: 'Custom Dots',
  render: () => <ChartLineDotsCustom />,
}

export const Interactive: Story = {
  name: 'Interactive',
  render: () => <ChartLineInteractive />,
}

export const Label: Story = {
  name: 'With Label',
  render: () => <ChartLineLabel />,
}

export const LabelCustom: Story = {
  name: 'Custom Label',
  render: () => <ChartLineLabelCustom />,
}

export const Linear: Story = {
  name: 'Linear Curve',
  render: () => <ChartLineLinear />,
}

export const Multiple: Story = {
  name: 'Multiple Series',
  render: () => <ChartLineMultiple />,
}

export const Step: Story = {
  name: 'Step Curve',
  render: () => <ChartLineStep />,
}

export const Gallery: Story = {
  name: 'All Line Charts',
  render: () => (
    <div className="grid gap-8 p-4 md:grid-cols-2">
      <ChartLineDefault />
      <ChartLineDots />
      <ChartLineMultiple />
      <ChartLineLinear />
      <ChartLineStep />
      <ChartLineInteractive />
    </div>
  ),
}

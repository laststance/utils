import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart, Line, LineChart, XAxis, YAxis } from "recharts";

const meta = {
  title: "UI/Chart",
  component: ChartContainer,
  parameters: {
    layout: "centered",
    docs: {
      codePanel: true,
      description: {
        component: "Chart components built on top of Recharts for data visualization.",
      },
    },
  },

  argTypes: {
    config: {
      control: { type: "object" },
      description: "Chart configuration object",
    },
  },
} satisfies Meta<typeof ChartContainer>;

export default meta;
type ChartStory = Omit<StoryObj<typeof meta>, 'args'> & {
  render: () => React.ReactElement;
};

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#2563eb",
  },
  mobile: {
    label: "Mobile",
    color: "#60a5fa",
  },
} satisfies ChartConfig;

export const BarChartExample: ChartStory = {
  render: () => (
    <ChartContainer config={chartConfig} className="min-h-[200px]">
      <BarChart data={chartData}>
        <XAxis dataKey="month" />
        <YAxis />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="desktop" fill="var(--color-desktop)" />
        <Bar dataKey="mobile" fill="var(--color-mobile)" />
      </BarChart>
    </ChartContainer>
  ),
};

export const LineChartExample: ChartStory = {
  render: () => (
    <ChartContainer config={chartConfig} className="min-h-[200px]">
      <LineChart data={chartData}>
        <XAxis dataKey="month" />
        <YAxis />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Line
          type="monotone"
          dataKey="desktop"
          stroke="var(--color-desktop)"
          strokeWidth={2}
        />
        <Line
          type="monotone"
          dataKey="mobile"
          stroke="var(--color-mobile)"
          strokeWidth={2}
        />
      </LineChart>
    </ChartContainer>
  ),
};

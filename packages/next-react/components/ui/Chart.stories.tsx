import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Chart } from "@/components/ui/chart";

const meta = {
  title: "UI/Chart",
  component: Chart,
  parameters: {
    layout: "centered",
    docs: {
      codePanel: true,
      description: {
        component: "Chart component for building user interfaces.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    className: {
      control: { type: "text" },
      description: "Additional CSS classes",
    },
  },
} satisfies Meta<typeof Chart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Chart>
      {/* Add your component content here */}
      Default Chart
    </Chart>
  ),
};

export const Example: Story = {
  render: () => (
    <Chart className="example-class">
      {/* Add example usage here */}
      Example Chart
    </Chart>
  ),
};

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Progress } from "@/components/ui/progress";

const meta = {
  title: "UI/Progress",
  component: Progress,
  parameters: {
    layout: "centered",
    docs: {
      codePanel: true,
      description: {
        component: "Progress component for building user interfaces.",
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
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Progress>
      {/* Add your component content here */}
      Default Progress
    </Progress>
  ),
};

export const Example: Story = {
  render: () => (
    <Progress className="example-class">
      {/* Add example usage here */}
      Example Progress
    </Progress>
  ),
};

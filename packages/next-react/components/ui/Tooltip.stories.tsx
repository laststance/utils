import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Tooltip } from "@/components/ui/tooltip";

const meta = {
  title: "UI/Tooltip",
  component: Tooltip,
  parameters: {
    layout: "centered",
    docs: {
      codePanel: true,
      description: {
        component: "Tooltip component for building user interfaces.",
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
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tooltip>
      {/* Add your component content here */}
      Default Tooltip
    </Tooltip>
  ),
};

export const Example: Story = {
  render: () => (
    <Tooltip className="example-class">
      {/* Add example usage here */}
      Example Tooltip
    </Tooltip>
  ),
};

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Popover } from "@/components/ui/popover";

const meta = {
  title: "UI/Popover",
  component: Popover,
  parameters: {
    layout: "centered",
    docs: {
      codePanel: true,
      description: {
        component: "Popover component for building user interfaces.",
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
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Popover>
      {/* Add your component content here */}
      Default Popover
    </Popover>
  ),
};

export const Example: Story = {
  render: () => (
    <Popover className="example-class">
      {/* Add example usage here */}
      Example Popover
    </Popover>
  ),
};

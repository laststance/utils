import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Select } from "@/components/ui/select";

const meta = {
  title: "UI/Select",
  component: Select,
  parameters: {
    layout: "centered",
    docs: {
      codePanel: true,
      description: {
        component: "Select component for building user interfaces.",
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
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Select>
      {/* Add your component content here */}
      Default Select
    </Select>
  ),
};

export const Example: Story = {
  render: () => (
    <Select className="example-class">
      {/* Add example usage here */}
      Example Select
    </Select>
  ),
};

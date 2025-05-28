import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Toggle } from "@/components/ui/toggle";

const meta = {
  title: "UI/Toggle",
  component: Toggle,
  parameters: {
    layout: "centered",
    docs: {
      codePanel: true,
      description: {
        component: "Toggle component for building user interfaces.",
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
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Toggle>
      {/* Add your component content here */}
      Default Toggle
    </Toggle>
  ),
};

export const Example: Story = {
  render: () => (
    <Toggle className="example-class">
      {/* Add example usage here */}
      Example Toggle
    </Toggle>
  ),
};

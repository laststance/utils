import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Command } from "@/components/ui/command";

const meta = {
  title: "UI/Command",
  component: Command,
  parameters: {
    layout: "centered",
    docs: {
      codePanel: true,
      description: {
        component: "Command component for building user interfaces.",
      },
    },
  },

  argTypes: {
    className: {
      control: { type: "text" },
      description: "Additional CSS classes",
    },
  },
} satisfies Meta<typeof Command>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Command>
      {/* Add your component content here */}
      Default Command
    </Command>
  ),
};

export const Example: Story = {
  render: () => (
    <Command className="example-class">
      {/* Add example usage here */}
      Example Command
    </Command>
  ),
};

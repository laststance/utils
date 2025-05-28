import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ContextMenu } from "@/components/ui/context-menu";

const meta = {
  title: "UI/ContextMenu",
  component: ContextMenu,
  parameters: {
    layout: "centered",
    docs: {
      codePanel: true,
      description: {
        component: "Context Menu component for building user interfaces.",
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
} satisfies Meta<typeof ContextMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <ContextMenu>
      {/* Add your component content here */}
      Default ContextMenu
    </ContextMenu>
  ),
};

export const Example: Story = {
  render: () => (
    <ContextMenu className="example-class">
      {/* Add example usage here */}
      Example ContextMenu
    </ContextMenu>
  ),
};

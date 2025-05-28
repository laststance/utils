import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Drawer } from "@/components/ui/drawer";

const meta = {
  title: "UI/Drawer",
  component: Drawer,
  parameters: {
    layout: "centered",
    docs: {
      codePanel: true,
      description: {
        component: "Drawer component for building user interfaces.",
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
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Drawer>
      {/* Add your component content here */}
      Default Drawer
    </Drawer>
  ),
};

export const Example: Story = {
  render: () => (
    <Drawer className="example-class">
      {/* Add example usage here */}
      Example Drawer
    </Drawer>
  ),
};

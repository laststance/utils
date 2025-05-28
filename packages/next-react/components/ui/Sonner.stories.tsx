import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Toaster } from "@/components/ui/sonner";

const meta = {
  title: "UI/Sonner",
  component: Toaster,
  parameters: {
    layout: "centered",
    docs: {
      codePanel: true,
      description: {
        component: "Sonner component for building user interfaces.",
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
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Toaster>
      {/* Add your component content here */}
      Default Sonner
    </Toaster>
  ),
};

export const Example: Story = {
  render: () => (
    <Toaster className="example-class">
      {/* Add example usage here */}
      Example Sonner
    </Toaster>
  ),
};

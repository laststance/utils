import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Dialog } from "@/components/ui/dialog";

const meta = {
  title: "UI/Dialog",
  component: Dialog,
  parameters: {
    layout: "centered",
    docs: {
      codePanel: true,
      description: {
        component: "Dialog component for building user interfaces.",
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
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Dialog>
      {/* Add your component content here */}
      Default Dialog
    </Dialog>
  ),
};

export const Example: Story = {
  render: () => (
    <Dialog className="example-class">
      {/* Add example usage here */}
      Example Dialog
    </Dialog>
  ),
};

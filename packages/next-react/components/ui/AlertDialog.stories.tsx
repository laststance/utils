import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AlertDialog } from "@/components/ui/alert-dialog";

const meta = {
  title: "UI/AlertDialog",
  component: AlertDialog,
  parameters: {
    layout: "centered",
    docs: {
      codePanel: true,
      description: {
        component: "Alert Dialog component for building user interfaces.",
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
} satisfies Meta<typeof AlertDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <AlertDialog>
      {/* Add your component content here */}
      Default AlertDialog
    </AlertDialog>
  ),
};

export const Example: Story = {
  render: () => (
    <AlertDialog className="example-class">
      {/* Add example usage here */}
      Example AlertDialog
    </AlertDialog>
  ),
};

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Alert } from "@/components/ui/alert";

const meta = {
  title: "UI/Alert",
  component: Alert,
  parameters: {
    layout: "centered",
    docs: {
      codePanel: true,
      description: {
        component: "Alert component for building user interfaces.",
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
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Alert>
      {/* Add your component content here */}
      Default Alert
    </Alert>
  ),
};

export const Example: Story = {
  render: () => (
    <Alert className="example-class">
      {/* Add example usage here */}
      Example Alert
    </Alert>
  ),
};

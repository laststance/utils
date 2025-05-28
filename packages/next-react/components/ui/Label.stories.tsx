import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Label } from "@/components/ui/label";

const meta = {
  title: "UI/Label",
  component: Label,
  parameters: {
    layout: "centered",
    docs: {
      codePanel: true,
      description: {
        component: "Label component for building user interfaces.",
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
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Label>
      {/* Add your component content here */}
      Default Label
    </Label>
  ),
};

export const Example: Story = {
  render: () => (
    <Label className="example-class">
      {/* Add example usage here */}
      Example Label
    </Label>
  ),
};

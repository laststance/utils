import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Sheet } from "@/components/ui/sheet";

const meta = {
  title: "UI/Sheet",
  component: Sheet,
  parameters: {
    layout: "centered",
    docs: {
      codePanel: true,
      description: {
        component: "Sheet component for building user interfaces.",
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
} satisfies Meta<typeof Sheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Sheet>
      {/* Add your component content here */}
      Default Sheet
    </Sheet>
  ),
};

export const Example: Story = {
  render: () => (
    <Sheet className="example-class">
      {/* Add example usage here */}
      Example Sheet
    </Sheet>
  ),
};

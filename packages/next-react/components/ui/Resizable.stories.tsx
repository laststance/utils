import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Resizable } from "@/components/ui/resizable";

const meta = {
  title: "UI/Resizable",
  component: Resizable,
  parameters: {
    layout: "centered",
    docs: {
      codePanel: true,
      description: {
        component: "Resizable component for building user interfaces.",
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
} satisfies Meta<typeof Resizable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Resizable>
      {/* Add your component content here */}
      Default Resizable
    </Resizable>
  ),
};

export const Example: Story = {
  render: () => (
    <Resizable className="example-class">
      {/* Add example usage here */}
      Example Resizable
    </Resizable>
  ),
};

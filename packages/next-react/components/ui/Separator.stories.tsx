import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Separator } from "@/components/ui/separator";

const meta = {
  title: "UI/Separator",
  component: Separator,
  parameters: {
    layout: "centered",
    docs: {
      codePanel: true,
      description: {
        component: "Separator component for building user interfaces.",
      },
    },
  },

  argTypes: {
    className: {
      control: { type: "text" },
      description: "Additional CSS classes",
    },
  },
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Separator>
      {/* Add your component content here */}
      Default Separator
    </Separator>
  ),
};

export const Example: Story = {
  render: () => (
    <Separator className="example-class">
      {/* Add example usage here */}
      Example Separator
    </Separator>
  ),
};

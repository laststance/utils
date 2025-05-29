import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Badge } from "@/components/ui/badge";

const meta = {
  title: "UI/Badge",
  component: Badge,
  parameters: {
    layout: "centered",
    docs: {
      codePanel: true,
      description: {
        component: "Badge component for building user interfaces.",
      },
    },
  },

  argTypes: {
    className: {
      control: { type: "text" },
      description: "Additional CSS classes",
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Badge>
      {/* Add your component content here */}
      Default Badge
    </Badge>
  ),
};

export const Example: Story = {
  render: () => (
    <Badge className="example-class">
      {/* Add example usage here */}
      Example Badge
    </Badge>
  ),
};

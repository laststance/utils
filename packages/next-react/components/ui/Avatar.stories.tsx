import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Avatar } from "@/components/ui/avatar";

const meta = {
  title: "UI/Avatar",
  component: Avatar,
  parameters: {
    layout: "centered",
    docs: {
      codePanel: true,
      description: {
        component: "Avatar component for building user interfaces.",
      },
    },
  },

  argTypes: {
    className: {
      control: { type: "text" },
      description: "Additional CSS classes",
    },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Avatar>
      {/* Add your component content here */}
      Default Avatar
    </Avatar>
  ),
};

export const Example: Story = {
  render: () => (
    <Avatar className="example-class">
      {/* Add example usage here */}
      Example Avatar
    </Avatar>
  ),
};

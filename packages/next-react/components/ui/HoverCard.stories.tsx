import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { HoverCard } from "@/components/ui/hover-card";

const meta = {
  title: "UI/HoverCard",
  component: HoverCard,
  parameters: {
    layout: "centered",
    docs: {
      codePanel: true,
      description: {
        component: "Hover Card component for building user interfaces.",
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
} satisfies Meta<typeof HoverCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <HoverCard>
      {/* Add your component content here */}
      Default HoverCard
    </HoverCard>
  ),
};

export const Example: Story = {
  render: () => (
    <HoverCard className="example-class">
      {/* Add example usage here */}
      Example HoverCard
    </HoverCard>
  ),
};

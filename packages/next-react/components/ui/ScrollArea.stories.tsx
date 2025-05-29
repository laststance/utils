import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ScrollArea } from "@/components/ui/scroll-area";

const meta = {
  title: "UI/ScrollArea",
  component: ScrollArea,
  parameters: {
    layout: "centered",
    docs: {
      codePanel: true,
      description: {
        component: "Scroll Area component for building user interfaces.",
      },
    },
  },

  argTypes: {
    className: {
      control: { type: "text" },
      description: "Additional CSS classes",
    },
  },
} satisfies Meta<typeof ScrollArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <ScrollArea>
      {/* Add your component content here */}
      Default ScrollArea
    </ScrollArea>
  ),
};

export const Example: Story = {
  render: () => (
    <ScrollArea className="example-class">
      {/* Add example usage here */}
      Example ScrollArea
    </ScrollArea>
  ),
};

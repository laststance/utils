import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Calendar } from "@/components/ui/calendar";

const meta = {
  title: "UI/Calendar",
  component: Calendar,
  parameters: {
    layout: "centered",
    docs: {
      codePanel: true,
      description: {
        component: "Calendar component for building user interfaces.",
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
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Calendar>
      {/* Add your component content here */}
      Default Calendar
    </Calendar>
  ),
};

export const Example: Story = {
  render: () => (
    <Calendar className="example-class">
      {/* Add example usage here */}
      Example Calendar
    </Calendar>
  ),
};

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Sidebar } from "@/components/ui/sidebar";

const meta = {
  title: "UI/Sidebar",
  component: Sidebar,
  parameters: {
    layout: "centered",
    docs: {
      codePanel: true,
      description: {
        component: "Sidebar component for building user interfaces.",
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
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Sidebar>
      {/* Add your component content here */}
      Default Sidebar
    </Sidebar>
  ),
};

export const Example: Story = {
  render: () => (
    <Sidebar className="example-class">
      {/* Add example usage here */}
      Example Sidebar
    </Sidebar>
  ),
};

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Pagination } from "@/components/ui/pagination";

const meta = {
  title: "UI/Pagination",
  component: Pagination,
  parameters: {
    layout: "centered",
    docs: {
      codePanel: true,
      description: {
        component: "Pagination component for building user interfaces.",
      },
    },
  },

  argTypes: {
    className: {
      control: { type: "text" },
      description: "Additional CSS classes",
    },
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Pagination>
      {/* Add your component content here */}
      Default Pagination
    </Pagination>
  ),
};

export const Example: Story = {
  render: () => (
    <Pagination className="example-class">
      {/* Add example usage here */}
      Example Pagination
    </Pagination>
  ),
};

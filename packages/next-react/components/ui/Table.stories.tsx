import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Table } from "@/components/ui/table";

const meta = {
  title: "UI/Table",
  component: Table,
  parameters: {
    layout: "centered",
    docs: {
      codePanel: true,
      description: {
        component: "Table component for building user interfaces.",
      },
    },
  },

  argTypes: {
    className: {
      control: { type: "text" },
      description: "Additional CSS classes",
    },
  },
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Table>
      {/* Add your component content here */}
      Default Table
    </Table>
  ),
};

export const Example: Story = {
  render: () => (
    <Table className="example-class">
      {/* Add example usage here */}
      Example Table
    </Table>
  ),
};

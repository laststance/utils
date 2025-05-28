import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { DropdownMenu } from "@/components/ui/dropdown-menu";

const meta = {
  title: "UI/DropdownMenu",
  component: DropdownMenu,
  parameters: {
    layout: "centered",
    docs: {
      codePanel: true,
      description: {
        component: "Dropdown Menu component for building user interfaces.",
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
} satisfies Meta<typeof DropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <DropdownMenu>
      {/* Add your component content here */}
      Default DropdownMenu
    </DropdownMenu>
  ),
};

export const Example: Story = {
  render: () => (
    <DropdownMenu className="example-class">
      {/* Add example usage here */}
      Example DropdownMenu
    </DropdownMenu>
  ),
};

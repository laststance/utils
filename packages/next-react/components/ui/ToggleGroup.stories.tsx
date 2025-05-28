import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ToggleGroup } from "@/components/ui/toggle-group";

const meta = {
  title: "UI/ToggleGroup",
  component: ToggleGroup,
  parameters: {
    layout: "centered",
    docs: {
      codePanel: true,
      description: {
        component: "Toggle Group component for building user interfaces.",
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
} satisfies Meta<typeof ToggleGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <ToggleGroup>
      {/* Add your component content here */}
      Default ToggleGroup
    </ToggleGroup>
  ),
};

export const Example: Story = {
  render: () => (
    <ToggleGroup className="example-class">
      {/* Add example usage here */}
      Example ToggleGroup
    </ToggleGroup>
  ),
};

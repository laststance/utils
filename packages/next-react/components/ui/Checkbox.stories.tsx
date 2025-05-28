import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Checkbox } from "@/components/ui/checkbox";

const meta = {
  title: "UI/Checkbox",
  component: Checkbox,
  parameters: {
    layout: "centered",
    docs: {
      codePanel: true,
      description: {
        component: "Checkbox component for building user interfaces.",
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
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Checkbox>
      {/* Add your component content here */}
      Default Checkbox
    </Checkbox>
  ),
};

export const Example: Story = {
  render: () => (
    <Checkbox className="example-class">
      {/* Add example usage here */}
      Example Checkbox
    </Checkbox>
  ),
};

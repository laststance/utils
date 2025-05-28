import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Switch } from "@/components/ui/switch";

const meta = {
  title: "UI/Switch",
  component: Switch,
  parameters: {
    layout: "centered",
    docs: {
      codePanel: true,
      description: {
        component: "Switch component for building user interfaces.",
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
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Switch>
      {/* Add your component content here */}
      Default Switch
    </Switch>
  ),
};

export const Example: Story = {
  render: () => (
    <Switch className="example-class">
      {/* Add example usage here */}
      Example Switch
    </Switch>
  ),
};

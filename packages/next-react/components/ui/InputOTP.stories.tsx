import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { InputOTP } from "@/components/ui/-input-o-t-p";

const meta = {
  title: "UI/InputOTP",
  component: InputOTP,
  parameters: {
    layout: "centered",
    docs: {
      codePanel: true,
      description: {
        component: "Input O T P component for building user interfaces.",
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
} satisfies Meta<typeof InputOTP>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <InputOTP>
      {/* Add your component content here */}
      Default InputOTP
    </InputOTP>
  ),
};

export const Example: Story = {
  render: () => (
    <InputOTP className="example-class">
      {/* Add example usage here */}
      Example InputOTP
    </InputOTP>
  ),
};

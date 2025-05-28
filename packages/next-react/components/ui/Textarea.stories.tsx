import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Textarea } from "@/components/ui/textarea";

const meta = {
  title: "UI/Textarea",
  component: Textarea,
  parameters: {
    layout: "centered",
    docs: {
      codePanel: true,
      description: {
        component: "Textarea component for building user interfaces.",
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
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Textarea>
      {/* Add your component content here */}
      Default Textarea
    </Textarea>
  ),
};

export const Example: Story = {
  render: () => (
    <Textarea className="example-class">
      {/* Add example usage here */}
      Example Textarea
    </Textarea>
  ),
};

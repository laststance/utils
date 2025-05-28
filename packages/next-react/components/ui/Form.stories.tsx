import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Form } from "@/components/ui/form";

const meta = {
  title: "UI/Form",
  component: Form,
  parameters: {
    layout: "centered",
    docs: {
      codePanel: true,
      description: {
        component: "Form component for building user interfaces.",
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
} satisfies Meta<typeof Form>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Form>
      {/* Add your component content here */}
      Default Form
    </Form>
  ),
};

export const Example: Story = {
  render: () => (
    <Form className="example-class">
      {/* Add example usage here */}
      Example Form
    </Form>
  ),
};

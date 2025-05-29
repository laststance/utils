import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Carousel } from "@/components/ui/carousel";

const meta = {
  title: "UI/Carousel",
  component: Carousel,
  parameters: {
    layout: "centered",
    docs: {
      codePanel: true,
      description: {
        component: "Carousel component for building user interfaces.",
      },
    },
  },

  argTypes: {
    className: {
      control: { type: "text" },
      description: "Additional CSS classes",
    },
  },
} satisfies Meta<typeof Carousel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Carousel>
      {/* Add your component content here */}
      Default Carousel
    </Carousel>
  ),
};

export const Example: Story = {
  render: () => (
    <Carousel className="example-class">
      {/* Add example usage here */}
      Example Carousel
    </Carousel>
  ),
};

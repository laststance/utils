import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { NavigationMenu } from "@/components/ui/navigation-menu";

const meta = {
  title: "UI/NavigationMenu",
  component: NavigationMenu,
  parameters: {
    layout: "centered",
    docs: {
      codePanel: true,
      description: {
        component: "Navigation Menu component for building user interfaces.",
      },
    },
  },

  argTypes: {
    className: {
      control: { type: "text" },
      description: "Additional CSS classes",
    },
  },
} satisfies Meta<typeof NavigationMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <NavigationMenu>
      {/* Add your component content here */}
      Default NavigationMenu
    </NavigationMenu>
  ),
};

export const Example: Story = {
  render: () => (
    <NavigationMenu className="example-class">
      {/* Add example usage here */}
      Example NavigationMenu
    </NavigationMenu>
  ),
};

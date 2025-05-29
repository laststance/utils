import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

const meta = {
  title: "UI/Drawer",
  component: Drawer,
  parameters: {
    layout: "centered",
    docs: {
      codePanel: true,
      description: {
        component: "A drawer component built on top of Vaul.",
      },
    },
  },

  argTypes: {
    open: {
      control: { type: "boolean" },
      description: "Controls whether the drawer is open",
    },
    direction: {
      control: { type: "select" },
      options: ["top", "bottom", "left", "right"],
      description: "Direction from which the drawer slides",
    },
  },
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Drawer {...args}>
      <DrawerTrigger asChild>
        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Open Drawer
        </button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Are you absolutely sure?</DrawerTitle>
          <DrawerDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
            Submit
          </button>
          <DrawerClose asChild>
            <button className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
              Cancel
            </button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};

export const Simple: Story = {
  render: (args) => (
    <Drawer {...args}>
      <DrawerTrigger asChild>
        <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
          Open Simple Drawer
        </button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Move Goal</DrawerTitle>
            <DrawerDescription>Set your daily activity goal.</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <div className="flex items-center justify-center space-x-2">
              <button className="px-3 py-1 bg-gray-200 rounded">-</button>
              <div className="text-2xl font-bold">350</div>
              <button className="px-3 py-1 bg-gray-200 rounded">+</button>
            </div>
          </div>
          <DrawerFooter>
            <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Submit
            </button>
            <DrawerClose asChild>
              <button className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
                Cancel
              </button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  ),
};

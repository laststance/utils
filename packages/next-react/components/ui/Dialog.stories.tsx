import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

const meta = {
  title: 'UI/Dialog',
  component: Dialog,
  parameters: {
    layout: 'centered',
    docs: {
      codePanel: true,
      description: {
        component: 'A dialog component built on top of Radix UI Dialog.',
      },
    },
  },

  argTypes: {
    open: {
      control: { type: 'boolean' },
      description: 'Controls whether the dialog is open',
    },
    modal: {
      control: { type: 'boolean' },
      description: 'Whether the dialog should be modal',
    },
  },
} satisfies Meta<typeof Dialog>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Dialog {...args}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Edit Profile
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="name" className="text-right">
              Name
            </label>
            <input
              id="name"
              defaultValue="Pedro Duarte"
              className="col-span-3 px-3 py-2 border rounded"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="username" className="text-right">
              Username
            </label>
            <input
              id="username"
              defaultValue="@peduarte"
              className="col-span-3 px-3 py-2 border rounded"
            />
          </div>
        </div>
        <DialogFooter>
          <button
            type="button"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Save changes
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

export const Confirmation: Story = {
  render: (args) => (
    <Dialog {...args}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Delete Account
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <button
            type="button"
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Continue
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

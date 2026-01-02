import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { LoadingOverlay } from './LoadingOverlay.js'
import { Button } from '@/components/ui/button'
export default {
  title: 'loading/LoadingOverlay',
  component: LoadingOverlay,
  tags: ['autodocs'],
} as Meta<typeof LoadingOverlay>

type Story = StoryObj<typeof LoadingOverlay>

export const Default: Story = {
  args: {},
  render: () => {
    const [isLoading, setIsLoading] = useState(false)

    const startLoading = () => {
      setIsLoading(true)
      // Simulating an operation that takes time
      setTimeout(() => {
        setIsLoading(false)
      }, 2000)
    }

    return (
      <div className="container mx-auto flex flex-col items-center space-y-8 p-4">
        <h1 className="text-3xl font-bold">Loading Overlay Demo</h1>

        <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
          <Button onClick={startLoading}>
            Show loading overlay (will disappear automatically)
          </Button>
        </div>

        <div className="rounded-lg border p-6">
          <h2 className="mb-4 text-xl font-semibold">
            Content behind the overlay
          </h2>
          <p>
            While the loading overlay is displayed, you cannot access this content.
          </p>
          <p className="mt-2">
            Due to the backdrop in the background, you cannot interact with any elements below.
          </p>
        </div>

        <LoadingOverlay isLoading={isLoading} />
      </div>
    )
  },
}

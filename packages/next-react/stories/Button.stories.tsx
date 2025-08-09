import type { Meta, StoryObj } from '@storybook/react'
import { Button, ButtonGroup, IconButton, FAB } from '@/components/design-system/Button'
import { themes } from '@/lib/design-system/themes'
import { 
  ChevronRight, 
  Download, 
  Heart, 
  Plus, 
  Search, 
  Settings,
  Share,
  Trash,
  User
} from 'lucide-react'

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Apple-inspired button component with glassmorphism effects and multiple variants.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'primary', 'secondary', 'ghost', 'glass', 'gradient', 'destructive', 'outline'],
      description: 'Visual style variant',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Button size',
    },
    theme: {
      control: 'select',
      options: Object.keys(themes),
      description: 'Theme for glass effects',
    },
    loading: {
      control: 'boolean',
      description: 'Loading state',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Full width button',
    },
    glow: {
      control: 'boolean',
      description: 'Glow effect',
    },
    haptic: {
      control: 'boolean',
      description: 'Haptic feedback on click',
    },
    rounded: {
      control: 'boolean',
      description: 'Fully rounded corners',
    },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

// Default button
export const Default: Story = {
  args: {
    children: 'Click me',
    variant: 'default',
    size: 'md',
  },
}

// All variants
export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4 flex-wrap">
        <Button variant="default">Default</Button>
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
      </div>
      <div className="flex gap-4 flex-wrap">
        <Button variant="glass">Glass</Button>
        <Button variant="gradient">Gradient</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="outline">Outline</Button>
      </div>
    </div>
  ),
}

// All sizes
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4 flex-wrap">
      <Button size="xs">Extra Small</Button>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
      <Button size="xl">Extra Large</Button>
    </div>
  ),
}

// With icons
export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4 flex-wrap">
        <Button icon={<Download size={16} />}>Download</Button>
        <Button icon={<ChevronRight size={16} />} iconPosition="right">
          Continue
        </Button>
        <Button variant="primary" icon={<Heart size={16} />}>
          Like
        </Button>
      </div>
      <div className="flex gap-4 flex-wrap">
        <Button variant="glass" icon={<Search size={16} />}>
          Search
        </Button>
        <Button variant="gradient" icon={<Share size={16} />}>
          Share
        </Button>
        <Button variant="destructive" icon={<Trash size={16} />}>
          Delete
        </Button>
      </div>
    </div>
  ),
}

// Loading states
export const LoadingStates: Story = {
  render: () => (
    <div className="flex gap-4 flex-wrap">
      <Button loading>Default Loading</Button>
      <Button variant="primary" loading>Primary Loading</Button>
      <Button variant="glass" loading>Glass Loading</Button>
      <Button variant="gradient" loading>Gradient Loading</Button>
    </div>
  ),
}

// Glass themes
export const GlassThemes: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-4">
      <Button variant="glass" theme="glass-clear">Clear Glass</Button>
      <Button variant="glass" theme="glass-frost">Frost Glass</Button>
      <Button variant="glass" theme="glass-smoke">Smoke Glass</Button>
      <Button variant="glass" theme="glass-ice">Ice Glass</Button>
      <Button variant="glass" theme="glass-ocean">Ocean Glass</Button>
      <Button variant="glass" theme="glass-lavender">Lavender Glass</Button>
    </div>
  ),
}

// Gradient themes
export const GradientThemes: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-4">
      <Button variant="gradient" theme="aurora-borealis">Aurora</Button>
      <Button variant="gradient" theme="gradient-sunset">Sunset</Button>
      <Button variant="gradient" theme="gradient-ocean">Ocean</Button>
      <Button variant="gradient" theme="gradient-forest">Forest</Button>
      <Button variant="gradient" theme="gradient-lavender">Lavender</Button>
      <Button variant="gradient" theme="gradient-rose">Rose</Button>
    </div>
  ),
}

// Special effects
export const SpecialEffects: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4 flex-wrap">
        <Button variant="primary" glow>Glow Effect</Button>
        <Button variant="gradient" glow>Gradient Glow</Button>
        <Button variant="glass" glow>Glass Glow</Button>
      </div>
      <div className="flex gap-4 flex-wrap">
        <Button rounded>Rounded</Button>
        <Button variant="primary" rounded>Rounded Primary</Button>
        <Button variant="glass" rounded>Rounded Glass</Button>
      </div>
      <div className="flex gap-4 flex-wrap">
        <Button haptic>Haptic Feedback</Button>
        <Button variant="primary" haptic>Haptic Primary</Button>
        <Button variant="glass" haptic>Haptic Glass</Button>
      </div>
    </div>
  ),
}

// Button Group
export const GroupExample: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <ButtonGroup orientation="horizontal">
        <Button variant="outline">Left</Button>
        <Button variant="outline">Center</Button>
        <Button variant="outline">Right</Button>
      </ButtonGroup>
      
      <ButtonGroup orientation="vertical">
        <Button variant="glass" fullWidth>Option 1</Button>
        <Button variant="glass" fullWidth>Option 2</Button>
        <Button variant="glass" fullWidth>Option 3</Button>
      </ButtonGroup>
    </div>
  ),
}

// Icon Buttons
export const IconButtons: Story = {
  render: () => (
    <div className="flex gap-4 flex-wrap">
      <IconButton icon={<Settings size={20} />} label="Settings" />
      <IconButton icon={<User size={20} />} label="Profile" variant="primary" />
      <IconButton icon={<Heart size={20} />} label="Like" variant="glass" />
      <IconButton icon={<Plus size={20} />} label="Add" variant="gradient" />
      <IconButton icon={<Trash size={20} />} label="Delete" variant="destructive" />
    </div>
  ),
}

// Floating Action Button
export const FloatingActionButton: Story = {
  render: () => (
    <div className="relative h-[300px] w-full border rounded-lg">
      <FAB
        icon={<Plus size={24} />}
        variant="gradient"
        position="bottom-right"
        glow
      >
        Add Item
      </FAB>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Floating action button for primary actions',
      },
    },
  },
}

// Interactive playground
export const Playground: Story = {
  args: {
    children: 'Interactive Button',
    variant: 'glass',
    size: 'md',
    theme: 'glass-aurora',
    loading: false,
    disabled: false,
    fullWidth: false,
    glow: true,
    haptic: true,
    rounded: false,
  },
}
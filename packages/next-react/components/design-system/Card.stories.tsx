import type { Meta, StoryObj } from '@storybook/react'
import { 
  Card, 
  CardHeader, 
  CardBody, 
  CardFooter, 
  CardImage,
  CardGrid 
} from '@/components/design-system/Card'
import { Button } from '@/components/design-system/Button'
import { themes } from '@/lib/design-system/themes'
import { Heart, MessageCircle, Share2, Star, TrendingUp, User } from 'lucide-react'

const meta = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Versatile card component with glassmorphism effects for content presentation.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'glass', 'elevated', 'outlined', 'gradient', 'interactive'],
      description: 'Visual style variant',
    },
    theme: {
      control: 'select',
      options: Object.keys(themes),
      description: 'Theme for glass effects',
    },
    padding: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'xl'],
      description: 'Padding size',
    },
    rounded: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'xl', 'full'],
      description: 'Border radius',
    },
    shadow: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'xl', 'glass', 'elevated'],
      description: 'Shadow style',
    },
    hoverable: {
      control: 'boolean',
      description: 'Hover effect',
    },
    clickable: {
      control: 'boolean',
      description: 'Clickable card',
    },
    selected: {
      control: 'boolean',
      description: 'Selected state',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
    glassIntensity: {
      control: 'select',
      options: ['light', 'medium', 'strong'],
      description: 'Glass effect intensity',
    },
  },
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

// Default card
export const Default: Story = {
  args: {
    children: (
      <div>
        <h3 className="text-lg font-semibold mb-2">Default Card</h3>
        <p className="text-foreground/70">
          This is a basic card with default styling. It provides a clean container for your content.
        </p>
      </div>
    ),
  },
}

// All variants
export const Variants: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-6 max-w-4xl">
      <Card variant="default">
        <h3 className="font-semibold mb-2">Default</h3>
        <p className="text-sm text-foreground/70">Standard card appearance</p>
      </Card>
      
      <Card variant="glass" theme="glass-clear">
        <h3 className="font-semibold mb-2">Glass</h3>
        <p className="text-sm text-foreground/70">Glassmorphism effect</p>
      </Card>
      
      <Card variant="elevated">
        <h3 className="font-semibold mb-2">Elevated</h3>
        <p className="text-sm text-foreground/70">Raised with shadow</p>
      </Card>
      
      <Card variant="outlined">
        <h3 className="font-semibold mb-2">Outlined</h3>
        <p className="text-sm text-foreground/70">Border only style</p>
      </Card>
      
      <Card variant="gradient" theme="aurora-borealis">
        <h3 className="font-semibold mb-2">Gradient</h3>
        <p className="text-sm text-foreground/70">Gradient background</p>
      </Card>
      
      <Card variant="interactive">
        <h3 className="font-semibold mb-2">Interactive</h3>
        <p className="text-sm text-foreground/70">Hover and click effects</p>
      </Card>
    </div>
  ),
}

// Card with structured content
export const StructuredContent: Story = {
  render: () => (
    <Card variant="glass" theme="glass-frost" className="w-[400px]">
      <CardHeader
        title="Project Analytics"
        subtitle="Performance metrics for the last 30 days"
        icon={<TrendingUp className="text-primary" />}
        action={
          <Button size="sm" variant="ghost">
            View All
          </Button>
        }
        separator
      />
      <CardBody>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-foreground/70">Total Views</span>
            <span className="text-lg font-semibold">24.5K</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-foreground/70">Engagement Rate</span>
            <span className="text-lg font-semibold">87.3%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-foreground/70">Conversion</span>
            <span className="text-lg font-semibold">12.8%</span>
          </div>
        </div>
      </CardBody>
      <CardFooter separator>
        <Button variant="primary" size="sm">Generate Report</Button>
        <Button variant="ghost" size="sm">Export Data</Button>
      </CardFooter>
    </Card>
  ),
}

// Card with image
export const WithImage: Story = {
  render: () => (
    <Card variant="glass" theme="glass-clear" padding="none" className="w-[400px]">
      <CardImage
        src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=300&fit=crop"
        alt="Abstract design"
        aspectRatio="video"
        overlay
        overlayGradient="bottom"
      />
      <div className="p-6">
        <CardHeader
          title="Beautiful Design"
          subtitle="Explore the world of creative interfaces"
        />
        <CardBody>
          <p className="text-foreground/70">
            Discover how modern design principles can transform your user experience
            with stunning visuals and intuitive interactions.
          </p>
        </CardBody>
        <CardFooter>
          <div className="flex gap-4 text-foreground/60">
            <button className="flex items-center gap-1 hover:text-foreground transition-colors">
              <Heart size={16} />
              <span className="text-sm">234</span>
            </button>
            <button className="flex items-center gap-1 hover:text-foreground transition-colors">
              <MessageCircle size={16} />
              <span className="text-sm">45</span>
            </button>
            <button className="flex items-center gap-1 hover:text-foreground transition-colors">
              <Share2 size={16} />
            </button>
          </div>
        </CardFooter>
      </div>
    </Card>
  ),
}

// Glass intensity variations
export const GlassIntensity: Story = {
  render: () => (
    <div className="flex gap-6">
      <Card variant="glass" glassIntensity="light" theme="glass-ocean" className="w-48">
        <h3 className="font-semibold mb-2">Light Glass</h3>
        <p className="text-sm text-foreground/70">30% opacity</p>
      </Card>
      
      <Card variant="glass" glassIntensity="medium" theme="glass-ocean" className="w-48">
        <h3 className="font-semibold mb-2">Medium Glass</h3>
        <p className="text-sm text-foreground/70">50% opacity</p>
      </Card>
      
      <Card variant="glass" glassIntensity="strong" theme="glass-ocean" className="w-48">
        <h3 className="font-semibold mb-2">Strong Glass</h3>
        <p className="text-sm text-foreground/70">70% opacity</p>
      </Card>
    </div>
  ),
}

// Interactive cards
export const InteractiveCards: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-6">
      <Card hoverable variant="glass" theme="glass-clear">
        <div className="text-center py-4">
          <Star className="w-12 h-12 mx-auto mb-3 text-yellow-500" />
          <h3 className="font-semibold">Hoverable</h3>
          <p className="text-sm text-foreground/70 mt-1">Lifts on hover</p>
        </div>
      </Card>
      
      <Card clickable variant="glass" theme="glass-frost" onClick={() => alert('Card clicked!')}>
        <div className="text-center py-4">
          <User className="w-12 h-12 mx-auto mb-3 text-blue-500" />
          <h3 className="font-semibold">Clickable</h3>
          <p className="text-sm text-foreground/70 mt-1">Click to interact</p>
        </div>
      </Card>
      
      <Card selected variant="glass" theme="glass-lavender">
        <div className="text-center py-4">
          <Heart className="w-12 h-12 mx-auto mb-3 text-pink-500" />
          <h3 className="font-semibold">Selected</h3>
          <p className="text-sm text-foreground/70 mt-1">Shows selection</p>
        </div>
      </Card>
    </div>
  ),
}

// Card grid
export const GridLayout: Story = {
  render: () => (
    <CardGrid columns={3} gap="md" className="max-w-6xl">
      {Array.from({ length: 6 }, (_, i) => (
        <Card key={i} variant="glass" theme="glass-clear" hoverable>
          <CardHeader
            title={`Card ${i + 1}`}
            subtitle="Subtitle text"
            icon={<Star className="text-yellow-500" size={20} />}
          />
          <CardBody>
            <p className="text-sm text-foreground/70">
              This is example content for a card in a grid layout.
            </p>
          </CardBody>
          <CardFooter>
            <Button size="sm" variant="ghost">Learn More</Button>
          </CardFooter>
        </Card>
      ))}
    </CardGrid>
  ),
}

// Themed cards
export const ThemedCards: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-6 max-w-5xl">
      <Card variant="gradient" theme="aurora-borealis">
        <h3 className="font-semibold mb-2">Aurora</h3>
        <p className="text-sm">Northern lights inspired theme</p>
      </Card>
      
      <Card variant="gradient" theme="gradient-sunset">
        <h3 className="font-semibold mb-2">Sunset</h3>
        <p className="text-sm">Warm sunset gradients</p>
      </Card>
      
      <Card variant="gradient" theme="gradient-ocean">
        <h3 className="font-semibold mb-2">Ocean</h3>
        <p className="text-sm">Deep ocean blues</p>
      </Card>
      
      <Card variant="glass" theme="glass-metallic-silver">
        <h3 className="font-semibold mb-2">Silver</h3>
        <p className="text-sm">Metallic silver finish</p>
      </Card>
      
      <Card variant="glass" theme="glass-metallic-gold">
        <h3 className="font-semibold mb-2">Gold</h3>
        <p className="text-sm">Premium gold appearance</p>
      </Card>
      
      <Card variant="glass" theme="glass-metallic-bronze">
        <h3 className="font-semibold mb-2">Bronze</h3>
        <p className="text-sm">Classic bronze style</p>
      </Card>
    </div>
  ),
}

// Playground
export const Playground: Story = {
  args: {
    variant: 'glass',
    theme: 'glass-aurora',
    padding: 'md',
    rounded: 'lg',
    shadow: 'glass',
    hoverable: true,
    clickable: false,
    selected: false,
    disabled: false,
    glassIntensity: 'medium',
    children: (
      <div>
        <h3 className="text-lg font-semibold mb-2">Interactive Playground</h3>
        <p className="text-foreground/70">
          Use the controls to customize this card&apos;s appearance and behavior.
        </p>
      </div>
    ),
  },
}
import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { Card } from '@/components/design-system/Card'
import { Button } from '@/components/design-system/Button'
import { themes } from '@/lib/design-system/themes'
import { Palette } from 'lucide-react'

const meta = {
  title: 'Design System/Themes',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Comprehensive showcase of 100+ glassmorphism and gradient themes.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

// Helper component to showcase a theme
const ThemeCard = ({ themeName }: { themeName: keyof typeof themes }) => {
  const theme = themes[themeName]
  if (!theme) return null
  
  return (
    <Card 
      variant="glass" 
      theme={themeName}
      hoverable
      className="h-full"
    >
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Palette size={16} className="text-primary" />
          <h3 className="font-semibold text-sm">{theme.name}</h3>
        </div>
        <div className="flex gap-2">
          <Button size="xs" variant="glass" theme={themeName}>
            Glass
          </Button>
          <Button size="xs" variant="primary" theme={themeName}>
            Primary
          </Button>
        </div>
        <div className="text-xs text-foreground/60">
          {theme.category}
        </div>
      </div>
    </Card>
  )
}

// Glass themes showcase
export const GlassThemes: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Glass Themes</h2>
        <p className="text-foreground/70 mb-6">
          Crystal-clear glassmorphism effects with varying opacity and blur levels.
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {Object.entries(themes)
          .filter(([_, theme]) => theme.category === 'glass')
          .map(([key]) => (
            <ThemeCard key={key} themeName={key as keyof typeof themes} />
          ))}
      </div>
    </div>
  ),
}

// Aurora themes showcase
export const AuroraThemes: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Aurora Themes</h2>
        <p className="text-foreground/70 mb-6">
          Vibrant, animated gradient backgrounds inspired by the aurora borealis.
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {Object.entries(themes)
          .filter(([_, theme]) => theme.category === 'aurora')
          .map(([key]) => (
            <ThemeCard key={key} themeName={key as keyof typeof themes} />
          ))}
      </div>
    </div>
  ),
}

// Gradient themes showcase
export const GradientThemes: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Gradient Themes</h2>
        <p className="text-foreground/70 mb-6">
          Smooth color transitions creating modern, dynamic interfaces.
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {Object.entries(themes)
          .filter(([_, theme]) => theme.category === 'gradient')
          .map(([key]) => (
            <ThemeCard key={key} themeName={key as keyof typeof themes} />
          ))}
      </div>
    </div>
  ),
}

// Metallic themes showcase
export const MetallicThemes: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Metallic Themes</h2>
        <p className="text-foreground/70 mb-6">
          Premium finishes inspired by Apple's hardware design language.
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {Object.entries(themes)
          .filter(([_, theme]) => theme.category === 'metallic')
          .map(([key]) => (
            <ThemeCard key={key} themeName={key as keyof typeof themes} />
          ))}
      </div>
    </div>
  ),
}

// All themes grid
export const AllThemes: Story = {
  render: () => {
    const categorizedThemes = Object.entries(themes).reduce((acc, [key, theme]) => {
      const category = theme.category
      if (!acc[category]) {
        acc[category] = []
      }
      const categoryArray = acc[category]
      if (categoryArray) {
        categoryArray.push(key as keyof typeof themes)
      }
      return acc
    }, {} as Record<string, (keyof typeof themes)[]>)
    
    return (
      <div className="space-y-12">
        <div>
          <h1 className="text-3xl font-bold mb-4">100+ Design Themes</h1>
          <p className="text-foreground/70 text-lg">
            A comprehensive collection of carefully crafted themes for every design need.
          </p>
        </div>
        
        {Object.entries(categorizedThemes).map(([category, themeKeys]) => (
          <div key={category} className="space-y-4">
            <h2 className="text-xl font-semibold capitalize">
              {category} ({themeKeys.length} themes)
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
              {themeKeys.map(key => (
                <ThemeCard key={key} themeName={key} />
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  },
}

// Theme comparison
export const ThemeComparison: Story = {
  render: () => {
    const comparisonThemes: (keyof typeof themes)[] = [
      'glass-clear',
      'glass-aurora',
      'aurora-borealis',
      'gradient-sunset',
      'glass-metallic-gold',
    ]
    
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Theme Comparison</h2>
          <p className="text-foreground/70 mb-6">
            Compare different themes side by side to find the perfect match for your design.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {comparisonThemes.map(themeName => {
            const theme = themes[themeName]
            if (!theme) return null
            return (
              <div key={themeName} className="space-y-4">
                <Card variant="glass" theme={themeName}>
                  <h3 className="font-semibold mb-2">{theme.name}</h3>
                  <p className="text-sm text-foreground/70">
                    Category: {theme.category}
                  </p>
                </Card>
              
              <div className="space-y-2">
                <Button fullWidth size="sm" variant="primary" theme={themeName}>
                  Primary
                </Button>
                <Button fullWidth size="sm" variant="glass" theme={themeName}>
                  Glass
                </Button>
                <Button fullWidth size="sm" variant="outline" theme={themeName}>
                  Outline
                </Button>
              </div>
            </div>
            )
          })}
        </div>
      </div>
    )
  },
}

// Interactive theme selector
export const InteractiveSelector: Story = {
  render: () => {
    const [selectedTheme, setSelectedTheme] = React.useState<keyof typeof themes>('glass-clear')
    
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Interactive Theme Explorer</h2>
          <p className="text-foreground/70 mb-6">
            Select a theme to see it applied to various components.
          </p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <h3 className="font-semibold mb-4">Select Theme</h3>
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {Object.keys(themes).map(key => {
                const theme = themes[key as keyof typeof themes]
                if (!theme) return null
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedTheme(key as keyof typeof themes)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedTheme === key
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-foreground/5'
                    }`}
                  >
                    <div className="text-sm font-medium">{theme.name}</div>
                    <div className="text-xs opacity-70">{theme.category}</div>
                  </button>
                )
              })}
            </div>
          </div>
          
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h3 className="font-semibold mb-4">Preview: {themes[selectedTheme]?.name || selectedTheme}</h3>
              
              <div className="space-y-6">
                <Card variant="glass" theme={selectedTheme}>
                  <h4 className="font-semibold mb-2">Glass Card</h4>
                  <p className="text-sm text-foreground/70 mb-4">
                    This card demonstrates the glass morphism effect with the selected theme.
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="primary" theme={selectedTheme}>
                      Primary
                    </Button>
                    <Button size="sm" variant="glass" theme={selectedTheme}>
                      Glass
                    </Button>
                    <Button size="sm" variant="ghost" theme={selectedTheme}>
                      Ghost
                    </Button>
                  </div>
                </Card>
                
                <Card variant="gradient" theme={selectedTheme}>
                  <h4 className="font-semibold mb-2">Gradient Card</h4>
                  <p className="text-sm text-foreground/70">
                    Gradient variant with theme colors.
                  </p>
                </Card>
                
                <div className="flex flex-wrap gap-2">
                  <Button variant="primary" theme={selectedTheme}>Primary Button</Button>
                  <Button variant="secondary" theme={selectedTheme}>Secondary</Button>
                  <Button variant="glass" theme={selectedTheme}>Glass</Button>
                  <Button variant="gradient" theme={selectedTheme}>Gradient</Button>
                  <Button variant="outline" theme={selectedTheme}>Outline</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  },
}
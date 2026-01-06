import type { Meta, StoryObj } from '@storybook/react'
import {
  Home,
  BarChart3,
  Users,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Package,
  Github,
  Twitter,
  Linkedin,
  Mail,
  Heart,
  Star,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'
import { useState } from 'react'

import {
  Container,
  Header,
  NavItem,
  Sidebar,
  SidebarItem,
  SidebarSection,
  Footer,
  FooterLink,
  FooterSection,
  SocialIcon,
  Button,
  Card,
  CardHeader,
  CardBody,
  CardGrid,
} from '@/components/design-system'

const meta = {
  title: 'Examples/Complete App Layout',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Complete application layout showcasing all design system components working together.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

// Dashboard Demo
export const Dashboard: Story = {
  render: () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <Header
          theme="glass-clear"
          variant="default"
          sticky
          logo={
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg" />
              <span className="font-semibold text-lg">AppName</span>
            </div>
          }
          navigation={
            <>
              <NavItem href="#" active>
                Dashboard
              </NavItem>
              <NavItem href="#">Analytics</NavItem>
              <NavItem href="#">Projects</NavItem>
              <NavItem href="#">Team</NavItem>
            </>
          }
          actions={
            <>
              <Button variant="ghost" size="sm" icon={<Search size={18} />}>
                Search
              </Button>
              <Button variant="ghost" size="sm" icon={<Bell size={18} />} />
              <Button variant="primary" size="sm">
                New Project
              </Button>
              <button
                type="button"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </>
          }
        />

        <div className="flex">
          {/* Sidebar */}
          <Sidebar
            theme="glass-frost"
            variant="default"
            position="left"
            collapsible
            collapsed={sidebarCollapsed}
            onCollapsedChange={setSidebarCollapsed}
            overlay={mobileMenuOpen}
            header={
              !sidebarCollapsed && (
                <div className="text-sm font-medium text-foreground/60">
                  Main Menu
                </div>
              )
            }
          >
            <SidebarSection>
              <SidebarItem
                icon={<Home size={20} />}
                label="Dashboard"
                active
                collapsed={sidebarCollapsed}
              />
              <SidebarItem
                icon={<BarChart3 size={20} />}
                label="Analytics"
                collapsed={sidebarCollapsed}
                badge={
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                    New
                  </span>
                }
              />
              <SidebarItem
                icon={<Users size={20} />}
                label="Customers"
                collapsed={sidebarCollapsed}
              />
              <SidebarItem
                icon={<Package size={20} />}
                label="Products"
                collapsed={sidebarCollapsed}
              />
            </SidebarSection>

            <SidebarSection title={!sidebarCollapsed ? 'Settings' : ''}>
              <SidebarItem
                icon={<Settings size={20} />}
                label="Settings"
                collapsed={sidebarCollapsed}
              />
            </SidebarSection>
          </Sidebar>

          {/* Main Content */}
          <main className="flex-1 p-6 md:p-8">
            <Container theme="glass-clear" glass={false} maxWidth="full">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card variant="glass" theme="glass-clear" hoverable>
                  <CardBody>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-foreground/60 mb-1">
                          Total Revenue
                        </p>
                        <p className="text-2xl font-bold">$45,231</p>
                        <div className="flex items-center gap-1 mt-2">
                          <ArrowUpRight className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-green-500">+12.5%</span>
                        </div>
                      </div>
                      <div className="p-3 bg-blue-500/10 rounded-lg">
                        <DollarSign className="w-6 h-6 text-blue-500" />
                      </div>
                    </div>
                  </CardBody>
                </Card>

                <Card variant="glass" theme="glass-frost" hoverable>
                  <CardBody>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-foreground/60 mb-1">
                          New Orders
                        </p>
                        <p className="text-2xl font-bold">1,245</p>
                        <div className="flex items-center gap-1 mt-2">
                          <ArrowUpRight className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-green-500">+8.2%</span>
                        </div>
                      </div>
                      <div className="p-3 bg-purple-500/10 rounded-lg">
                        <ShoppingCart className="w-6 h-6 text-purple-500" />
                      </div>
                    </div>
                  </CardBody>
                </Card>

                <Card variant="glass" theme="glass-smoke" hoverable>
                  <CardBody>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-foreground/60 mb-1">
                          Active Users
                        </p>
                        <p className="text-2xl font-bold">8,423</p>
                        <div className="flex items-center gap-1 mt-2">
                          <ArrowDownRight className="w-4 h-4 text-red-500" />
                          <span className="text-sm text-red-500">-2.1%</span>
                        </div>
                      </div>
                      <div className="p-3 bg-green-500/10 rounded-lg">
                        <Users className="w-6 h-6 text-green-500" />
                      </div>
                    </div>
                  </CardBody>
                </Card>

                <Card variant="glass" theme="glass-ice" hoverable>
                  <CardBody>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-foreground/60 mb-1">
                          Growth Rate
                        </p>
                        <p className="text-2xl font-bold">24.8%</p>
                        <div className="flex items-center gap-1 mt-2">
                          <ArrowUpRight className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-green-500">+4.3%</span>
                        </div>
                      </div>
                      <div className="p-3 bg-orange-500/10 rounded-lg">
                        <TrendingUp className="w-6 h-6 text-orange-500" />
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>

              {/* Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card variant="glass" theme="glass-aurora">
                    <CardHeader
                      title="Recent Activity"
                      subtitle="Your latest transactions and events"
                      action={
                        <Button size="sm" variant="ghost">
                          View All
                        </Button>
                      }
                      separator
                    />
                    <CardBody>
                      <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between py-2"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full" />
                              <div>
                                <p className="font-medium">
                                  Transaction #{1000 + i}
                                </p>
                                <p className="text-sm text-foreground/60">
                                  2 hours ago
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">$1,234</p>
                              <p className="text-sm text-green-500">
                                Completed
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardBody>
                  </Card>
                </div>

                <div>
                  <Card variant="gradient" theme="gradient-sunset">
                    <CardHeader title="Quick Actions" separator />
                    <CardBody>
                      <div className="space-y-3">
                        <Button
                          fullWidth
                          variant="glass"
                          theme="gradient-sunset"
                        >
                          Create Invoice
                        </Button>
                        <Button
                          fullWidth
                          variant="glass"
                          theme="gradient-sunset"
                        >
                          Add Customer
                        </Button>
                        <Button
                          fullWidth
                          variant="glass"
                          theme="gradient-sunset"
                        >
                          Generate Report
                        </Button>
                        <Button
                          fullWidth
                          variant="glass"
                          theme="gradient-sunset"
                        >
                          Export Data
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                </div>
              </div>
            </Container>
          </main>
        </div>

        {/* Footer */}
        <Footer
          theme="glass-clear"
          variant="minimal"
          copyright="Your Company. All rights reserved."
          legal={
            <>
              <FooterLink variant="legal">Privacy Policy</FooterLink>
              <FooterLink variant="legal">Terms of Service</FooterLink>
              <FooterLink variant="legal">Cookie Policy</FooterLink>
            </>
          }
        />
      </div>
    )
  },
}

// Landing Page Demo
export const LandingPage: Story = {
  render: () => {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20">
        {/* Header */}
        <Header
          theme="glass-clear"
          variant="floating"
          sticky
          transparent
          logo={
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg" />
              <span className="font-bold text-lg">DesignSystem</span>
            </div>
          }
          navigation={
            <>
              <NavItem href="#">Features</NavItem>
              <NavItem href="#">Pricing</NavItem>
              <NavItem href="#">Docs</NavItem>
              <NavItem href="#">Blog</NavItem>
            </>
          }
          actions={
            <>
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
              <Button variant="gradient" theme="aurora-borealis" size="sm">
                Get Started
              </Button>
            </>
          }
        />

        {/* Hero Section */}
        <Container maxWidth="7xl" padding="xl" glass={false}>
          <div className="py-20 md:py-32 text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Beautiful Design System
            </h1>
            <p className="text-xl md:text-2xl text-foreground/70 mb-8 max-w-3xl mx-auto">
              Build stunning applications with our Apple-inspired design system
              featuring 100+ glassmorphism themes
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" variant="gradient" theme="aurora-borealis" glow>
                Start Building
              </Button>
              <Button size="lg" variant="glass" theme="glass-clear">
                View Examples
              </Button>
            </div>
          </div>
        </Container>

        {/* Features Section */}
        <Container maxWidth="7xl" padding="xl" glass={false}>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Why Choose Our Design System?
          </h2>
          <CardGrid columns={3} gap="lg">
            {[
              {
                icon: <Star className="w-8 h-8 text-yellow-500" />,
                title: '100+ Themes',
                description:
                  'Choose from a vast collection of carefully crafted themes',
              },
              {
                icon: <Heart className="w-8 h-8 text-pink-500" />,
                title: 'Apple Inspired',
                description: "Following Apple's Human Interface Guidelines",
              },
              {
                icon: <TrendingUp className="w-8 h-8 text-green-500" />,
                title: 'Performance First',
                description: 'Optimized for smooth 60fps animations',
              },
            ].map((feature, i) => (
              <Card key={i} variant="glass" theme="glass-aurora" hoverable>
                <CardBody>
                  <div className="text-center">
                    <div className="inline-flex p-3 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-foreground/70">
                      {feature.description}
                    </p>
                  </div>
                </CardBody>
              </Card>
            ))}
          </CardGrid>
        </Container>

        {/* CTA Section */}
        <Container maxWidth="7xl" padding="xl" glass={false}>
          <Card
            variant="gradient"
            theme="aurora-borealis"
            className="text-center py-16"
          >
            <CardBody>
              <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-lg text-foreground/80 mb-8">
                Join thousands of developers building beautiful apps
              </p>
              <Button size="lg" variant="glass" theme="aurora-borealis" glow>
                Start Free Trial
              </Button>
            </CardBody>
          </Card>
        </Container>

        {/* Footer */}
        <Footer
          theme="glass-clear"
          variant="default"
          logo={
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg" />
              <span className="font-bold text-lg">DesignSystem</span>
            </div>
          }
          navigation={
            <>
              <FooterSection title="Product">
                <FooterLink>Features</FooterLink>
                <FooterLink>Pricing</FooterLink>
                <FooterLink>Changelog</FooterLink>
              </FooterSection>
              <FooterSection title="Resources">
                <FooterLink>Documentation</FooterLink>
                <FooterLink>Tutorials</FooterLink>
                <FooterLink>Blog</FooterLink>
              </FooterSection>
              <FooterSection title="Company">
                <FooterLink>About</FooterLink>
                <FooterLink>Careers</FooterLink>
                <FooterLink>Contact</FooterLink>
              </FooterSection>
            </>
          }
          social={
            <>
              <SocialIcon icon={<Github size={18} />} label="GitHub" />
              <SocialIcon icon={<Twitter size={18} />} label="Twitter" />
              <SocialIcon icon={<Linkedin size={18} />} label="LinkedIn" />
              <SocialIcon icon={<Mail size={18} />} label="Email" />
            </>
          }
          copyright="DesignSystem Inc."
          legal={
            <>
              <FooterLink variant="legal">Privacy</FooterLink>
              <FooterLink variant="legal">Terms</FooterLink>
              <FooterLink variant="legal">Cookies</FooterLink>
            </>
          }
        />
      </div>
    )
  },
}

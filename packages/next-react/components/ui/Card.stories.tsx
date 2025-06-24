import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle, 
  CardAction 
} from "@/components/ui/card";
import { Settings, ShoppingCart, BookOpen } from "lucide-react";

const meta = {
  title: "UI/Card",
  component: Card,
  parameters: {
    layout: "centered",
    docs: {
      codePanel: true,
      description: {
        component: "A card component for displaying content in a contained, organized manner.",
      },
    },
  },
  argTypes: {
    className: {
      control: { type: "text" },
      description: "Additional CSS classes",
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description goes here to provide context.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This is the main content area of the card.</p>
      </CardContent>
      <CardFooter>
        <Button>Action</Button>
      </CardFooter>
    </Card>
  ),
};

export const WithAction: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Settings</CardTitle>
        <CardDescription>Manage your account preferences</CardDescription>
        <CardAction>
          <Button variant="ghost" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p>Configure your settings and preferences here.</p>
      </CardContent>
    </Card>
  ),
};

export const ProductCard: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Premium Plan</CardTitle>
        <CardDescription>Perfect for growing businesses</CardDescription>
        <CardAction>
          <Badge variant="secondary">Popular</Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-3xl font-bold">$29<span className="text-sm font-normal">/month</span></div>
          <ul className="space-y-1 text-sm">
            <li>✓ 10 team members</li>
            <li>✓ 100GB storage</li>
            <li>✓ Priority support</li>
            <li>✓ Advanced analytics</li>
          </ul>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">
          <ShoppingCart className="mr-2 h-4 w-4" />
          Get Started
        </Button>
      </CardFooter>
    </Card>
  ),
};

export const ArticleCard: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Getting Started with React</CardTitle>
        <CardDescription>Published on March 15, 2024</CardDescription>
        <CardAction>
          <Badge>React</Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p>Learn the fundamentals of React development with this comprehensive guide. We'll cover components, state management, and best practices.</p>
      </CardContent>
      <CardFooter>
        <Button variant="outline">
          <BookOpen className="mr-2 h-4 w-4" />
          Read Article
        </Button>
      </CardFooter>
    </Card>
  ),
};

export const MinimalCard: Story = {
  render: () => (
    <Card className="w-80">
      <CardContent>
        <h3 className="font-semibold mb-2">Simple Content</h3>
        <p>This is a minimal card with just content, no header or footer.</p>
      </CardContent>
    </Card>
  ),
};

export const HeaderOnly: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>System Notification</CardTitle>
        <CardDescription>Your backup was completed successfully at 2:30 AM</CardDescription>
      </CardHeader>
    </Card>
  ),
};

export const ContentOnly: Story = {
  render: () => (
    <Card className="w-80">
      <CardContent>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Clean Content Display</h3>
          <p>This card focuses on content without header or footer decorations. Perfect for simple content blocks.</p>
          <div className="flex gap-2">
            <Badge variant="outline">Tag 1</Badge>
            <Badge variant="outline">Tag 2</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  ),
};
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings, Star, Calendar } from "lucide-react";

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
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>
          This is a description of the card content. It provides context about what the card contains.
        </CardDescription>
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
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Settings</CardTitle>
        <CardDescription>
          Manage your account preferences and settings.
        </CardDescription>
        <CardAction>
          <Button variant="ghost" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p>Your account settings help you customize your experience.</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Save Changes</Button>
      </CardFooter>
    </Card>
  ),
};

export const ProductCard: Story = {
  render: () => (
    <Card className="w-[300px]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Premium Plan</CardTitle>
          <Badge variant="secondary">Popular</Badge>
        </div>
        <CardDescription>
          Perfect for growing teams and businesses.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-baseline">
            <span className="text-3xl font-bold">$29</span>
            <span className="text-muted-foreground">/month</span>
          </div>
          <ul className="space-y-1 text-sm">
            <li>• Up to 50 team members</li>
            <li>• Advanced analytics</li>
            <li>• Priority support</li>
            <li>• Custom integrations</li>
          </ul>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Get Started</Button>
      </CardFooter>
    </Card>
  ),
};

export const ArticleCard: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>March 15, 2024</span>
        </div>
        <CardTitle>Understanding React Hooks</CardTitle>
        <CardDescription>
          A comprehensive guide to using React Hooks in modern applications.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          React Hooks have revolutionized how we write React components. In this article, 
          we'll explore the most commonly used hooks and their practical applications...
        </p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex items-center space-x-1">
          <Star className="h-4 w-4 fill-current text-yellow-500" />
          <span className="text-sm">4.8</span>
        </div>
        <Button variant="ghost">Read More</Button>
      </CardFooter>
    </Card>
  ),
};

export const MinimalCard: Story = {
  render: () => (
    <Card className="w-[200px]">
      <CardContent className="pt-6">
        <div className="text-center">
          <h3 className="font-semibold">Simple Card</h3>
          <p className="text-sm text-muted-foreground mt-2">
            A minimal card without header or footer.
          </p>
        </div>
      </CardContent>
    </Card>
  ),
};

export const HeaderOnly: Story = {
  render: () => (
    <Card className="w-[300px]">
      <CardHeader>
        <CardTitle>Header Only Card</CardTitle>
        <CardDescription>
          This card only has a header section for simple use cases.
        </CardDescription>
      </CardHeader>
    </Card>
  ),
};

export const ContentOnly: Story = {
  render: () => (
    <Card className="w-[300px]">
      <CardContent className="pt-6">
        <h3 className="font-semibold mb-2">Content Only</h3>
        <p className="text-sm text-muted-foreground">
          This card contains only content without a header or footer.
        </p>
      </CardContent>
    </Card>
  ),
}; 
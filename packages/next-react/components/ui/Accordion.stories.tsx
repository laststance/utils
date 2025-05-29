import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const meta = {
  title: "UI/Accordion",
  component: Accordion,
  parameters: {
    layout: "centered",
    docs: {
      codePanel: true,
      description: {
        component: "A vertically stacked set of interactive headings that each reveal a section of content.",
      },
    },
  },
  argTypes: {
    type: {
      control: { type: "radio" },
      options: ["single", "multiple"],
      description: "Whether multiple items can be opened at once",
    },
    collapsible: {
      control: { type: "boolean" },
      description: "Whether items can be collapsed",
    },
  },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Accordion className="w-full max-w-md" {...args}>
      <AccordionItem value="item-1">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>
          Yes. It adheres to the WAI-ARIA design pattern.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Is it styled?</AccordionTrigger>
        <AccordionContent>
          Yes. It comes with default styles that matches the other components&apos; aesthetic.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Is it animated?</AccordionTrigger>
        <AccordionContent>
          Yes. It&apos;s animated by default, but you can disable it if you prefer.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
  args: {
    type: "single",
    collapsible: true,
  },
};

export const Multiple: Story = {
  render: (args) => (
    <Accordion className="w-full max-w-md" {...args}>
      <AccordionItem value="item-1">
        <AccordionTrigger>What is React?</AccordionTrigger>
        <AccordionContent>
          React is a JavaScript library for building user interfaces.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>What is TypeScript?</AccordionTrigger>
        <AccordionContent>
          TypeScript is a typed superset of JavaScript that compiles to plain JavaScript.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>What is Tailwind CSS?</AccordionTrigger>
        <AccordionContent>
          Tailwind CSS is a utility-first CSS framework for rapidly building modern websites.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
  args: {
    type: "multiple",
  },
};

export const SingleItem: Story = {
  render: (args) => (
    <Accordion className="w-full max-w-md" {...args}>
      <AccordionItem value="item-1">
        <AccordionTrigger>Single accordion item</AccordionTrigger>
        <AccordionContent>
          This accordion has only one item for demonstration purposes.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
  args: {
    type: "single",
    collapsible: true,
  },
}; 
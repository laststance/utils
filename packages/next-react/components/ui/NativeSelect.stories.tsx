import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
} from '@/components/ui/native-select'

const meta = {
  title: 'UI/NativeSelect',
  component: NativeSelect,
  parameters: {
    layout: 'centered',
    docs: {
      codePanel: true,
      description: {
        component:
          'NativeSelect component providing a styled native HTML select element.',
      },
    },
  },
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['default', 'sm'],
      description: 'Size of the select',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether the select is disabled',
    },
    className: {
      control: { type: 'text' },
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof NativeSelect>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <NativeSelect className="w-[200px]">
      <NativeSelectOption value="">Select an option</NativeSelectOption>
      <NativeSelectOption value="option1">Option 1</NativeSelectOption>
      <NativeSelectOption value="option2">Option 2</NativeSelectOption>
      <NativeSelectOption value="option3">Option 3</NativeSelectOption>
    </NativeSelect>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <NativeSelect size="default" className="w-[200px]">
        <NativeSelectOption value="">Default size</NativeSelectOption>
        <NativeSelectOption value="1">Option 1</NativeSelectOption>
      </NativeSelect>
      <NativeSelect size="sm" className="w-[200px]">
        <NativeSelectOption value="">Small size</NativeSelectOption>
        <NativeSelectOption value="1">Option 1</NativeSelectOption>
      </NativeSelect>
    </div>
  ),
}

export const WithOptGroup: Story = {
  render: () => (
    <NativeSelect className="w-[200px]">
      <NativeSelectOption value="">Select a fruit</NativeSelectOption>
      <NativeSelectOptGroup label="Citrus">
        <NativeSelectOption value="orange">Orange</NativeSelectOption>
        <NativeSelectOption value="lemon">Lemon</NativeSelectOption>
        <NativeSelectOption value="lime">Lime</NativeSelectOption>
      </NativeSelectOptGroup>
      <NativeSelectOptGroup label="Berries">
        <NativeSelectOption value="strawberry">Strawberry</NativeSelectOption>
        <NativeSelectOption value="blueberry">Blueberry</NativeSelectOption>
        <NativeSelectOption value="raspberry">Raspberry</NativeSelectOption>
      </NativeSelectOptGroup>
    </NativeSelect>
  ),
}

export const Disabled: Story = {
  render: () => (
    <NativeSelect disabled className="w-[200px]">
      <NativeSelectOption value="">Disabled select</NativeSelectOption>
      <NativeSelectOption value="1">Option 1</NativeSelectOption>
    </NativeSelect>
  ),
}

export const WithPreselected: Story = {
  render: () => (
    <NativeSelect defaultValue="option2" className="w-[200px]">
      <NativeSelectOption value="option1">Option 1</NativeSelectOption>
      <NativeSelectOption value="option2">Option 2</NativeSelectOption>
      <NativeSelectOption value="option3">Option 3</NativeSelectOption>
    </NativeSelect>
  ),
}

export const CountrySelector: Story = {
  render: () => (
    <NativeSelect className="w-[250px]">
      <NativeSelectOption value="">Select a country</NativeSelectOption>
      <NativeSelectOptGroup label="North America">
        <NativeSelectOption value="us">United States</NativeSelectOption>
        <NativeSelectOption value="ca">Canada</NativeSelectOption>
        <NativeSelectOption value="mx">Mexico</NativeSelectOption>
      </NativeSelectOptGroup>
      <NativeSelectOptGroup label="Europe">
        <NativeSelectOption value="uk">United Kingdom</NativeSelectOption>
        <NativeSelectOption value="de">Germany</NativeSelectOption>
        <NativeSelectOption value="fr">France</NativeSelectOption>
      </NativeSelectOptGroup>
      <NativeSelectOptGroup label="Asia">
        <NativeSelectOption value="jp">Japan</NativeSelectOption>
        <NativeSelectOption value="kr">South Korea</NativeSelectOption>
        <NativeSelectOption value="cn">China</NativeSelectOption>
      </NativeSelectOptGroup>
    </NativeSelect>
  ),
}

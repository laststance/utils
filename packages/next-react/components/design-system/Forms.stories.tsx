import type { Meta, StoryObj } from '@storybook/react'
import { User, Mail, Phone, Home, Briefcase } from 'lucide-react'
import { useState } from 'react'

import {
  Select,
  Checkbox,
  RadioGroup,
  Switch,
  Textarea,
  FileUpload,
  Slider,
  NumberInput,
  type SelectOption,
  type RadioOption,
} from '@/components/design-system/Forms'

const meta = {
  title: 'Components/Forms',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Comprehensive form components including inputs, selects, checkboxes, and more.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta

export default meta

// Select Stories
export const SelectDefault: StoryObj = {
  render: () => {
    const [value, setValue] = useState('')
    
    const options: SelectOption[] = [
      { value: 'apple', label: 'Apple' },
      { value: 'google', label: 'Google' },
      { value: 'microsoft', label: 'Microsoft' },
      { value: 'amazon', label: 'Amazon' },
      { value: 'meta', label: 'Meta', disabled: true },
    ]
    
    return (
      <div className="w-80">
        <Select
          label="Select Company"
          options={options}
          value={value}
          onChange={setValue}
          placeholder="Choose a company"
          hint="Select your favorite tech company"
        />
      </div>
    )
  },
}

export const SelectWithIcons: StoryObj = {
  render: () => {
    const [value, setValue] = useState('')
    
    const options: SelectOption[] = [
      { value: 'user', label: 'User Profile', icon: <User size={16} /> },
      { value: 'mail', label: 'Email Settings', icon: <Mail size={16} /> },
      { value: 'phone', label: 'Phone Settings', icon: <Phone size={16} /> },
      { value: 'home', label: 'Home Address', icon: <Home size={16} /> },
      { value: 'work', label: 'Work Settings', icon: <Briefcase size={16} /> },
    ]
    
    return (
      <div className="w-80">
        <Select
          label="Settings Category"
          options={options}
          value={value}
          onChange={setValue}
          variant="glass"
          theme="glass-aurora"
          searchable
        />
      </div>
    )
  },
}

// Checkbox Stories
export const CheckboxVariants: StoryObj = {
  render: () => {
    const [checked1, setChecked1] = useState(false)
    const [checked2, setChecked2] = useState(true)
    const [checked3, setChecked3] = useState(false)
    
    return (
      <div className="space-y-4">
        <Checkbox
          label="Default Checkbox"
          checked={checked1}
          onChange={setChecked1}
        />
        
        <Checkbox
          label="Glass Checkbox"
          checked={checked2}
          onChange={setChecked2}
          variant="glass"
          theme="glass-aurora"
        />
        
        <Checkbox
          label="Rounded Checkbox"
          checked={checked3}
          onChange={setChecked3}
          variant="rounded"
        />
        
        <Checkbox
          label="Small Size"
          size="sm"
        />
        
        <Checkbox
          label="Large Size"
          size="lg"
        />
        
        <Checkbox
          label="Disabled Checkbox"
          disabled
          checked
        />
        
        <Checkbox
          label="With Error State"
          error="This field is required"
        />
      </div>
    )
  },
}

// Radio Group Stories
export const RadioGroupDefault: StoryObj = {
  render: () => {
    const [value, setValue] = useState('option1')
    
    const options: RadioOption[] = [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
      { value: 'option3', label: 'Option 3' },
      { value: 'option4', label: 'Option 4', disabled: true },
    ]
    
    return (
      <div className="w-80">
        <RadioGroup
          label="Select an Option"
          name="radio-default"
          options={options}
          value={value}
          onChange={setValue}
        />
      </div>
    )
  },
}

export const RadioGroupCards: StoryObj = {
  render: () => {
    const [value, setValue] = useState('basic')
    
    const options: RadioOption[] = [
      { 
        value: 'basic', 
        label: 'Basic Plan',
        description: '$9/month - Perfect for individuals'
      },
      { 
        value: 'pro', 
        label: 'Pro Plan',
        description: '$29/month - For professionals'
      },
      { 
        value: 'enterprise', 
        label: 'Enterprise Plan',
        description: 'Custom pricing - For large teams'
      },
    ]
    
    return (
      <div className="w-96">
        <RadioGroup
          label="Choose Your Plan"
          name="radio-cards"
          options={options}
          value={value}
          onChange={setValue}
          variant="cards"
          theme="glass-aurora"
        />
      </div>
    )
  },
}

// Switch Stories
export const SwitchVariants: StoryObj = {
  render: () => {
    const [checked1, setChecked1] = useState(false)
    const [checked2, setChecked2] = useState(true)
    const [checked3, setChecked3] = useState(false)
    
    return (
      <div className="space-y-4">
        <Switch
          label="Default Switch"
          checked={checked1}
          onChange={setChecked1}
        />
        
        <Switch
          label="Small Switch"
          checked={checked2}
          onChange={setChecked2}
          size="sm"
        />
        
        <Switch
          label="Large Switch"
          checked={checked3}
          onChange={setChecked3}
          size="lg"
        />
        
        <Switch
          label="Disabled Switch"
          disabled
          checked
        />
      </div>
    )
  },
}

// Textarea Stories
export const TextareaVariants: StoryObj = {
  render: () => (
    <div className="w-96 space-y-6">
      <Textarea
        label="Default Textarea"
        placeholder="Enter your message..."
        hint="Maximum 500 characters"
      />
      
      <Textarea
        label="Glass Textarea"
        variant="glass"
        theme="glass-aurora"
        placeholder="Glass style textarea..."
      />
      
      <Textarea
        label="Minimal Textarea"
        variant="minimal"
        placeholder="Minimal style..."
      />
      
      <Textarea
        label="With Error"
        error="This field is required"
        placeholder="Invalid content..."
      />
      
      <Textarea
        label="Non-resizable"
        resize="none"
        placeholder="Cannot resize this textarea..."
      />
    </div>
  ),
}

// File Upload Stories
export const FileUploadDefault: StoryObj = {
  render: () => {
    const handleFileSelect = (files: FileList) => {
      console.log('Selected files:', Array.from(files).map(f => f.name))
    }
    
    return (
      <div className="w-96 space-y-6">
        <FileUpload
          onFileSelect={handleFileSelect}
          accept="image/*"
          theme="glass-aurora"
        />
        
        <FileUpload
          variant="default"
          label="Choose File"
          accept=".pdf,.doc,.docx"
          theme="glass-clear"
        />
      </div>
    )
  },
}

export const FileUploadMultiple: StoryObj = {
  render: () => (
    <div className="w-96">
      <FileUpload
        multiple
        accept="image/*,video/*"
        label="Upload multiple files"
        hint="Drop your files here"
        maxSize={50}
        theme="gradient-sunset"
      />
    </div>
  ),
}

// Slider Stories
export const SliderVariants: StoryObj = {
  render: () => {
    const [value1, setValue1] = useState(50)
    const [value2, setValue2] = useState(75)
    const [value3, setValue3] = useState(30)
    
    return (
      <div className="w-96 space-y-8">
        <Slider
          label="Volume"
          value={value1}
          onChange={setValue1}
          min={0}
          max={100}
        />
        
        <Slider
          label="Brightness"
          value={value2}
          onChange={setValue2}
          min={0}
          max={100}
        />
        
        <Slider
          label="Progress"
          value={value3}
          onChange={setValue3}
          min={0}
          max={100}
          showValue={false}
        />
        
        <Slider
          label="Disabled Slider"
          value={50}
          disabled
        />
      </div>
    )
  },
}

// Number Input Stories
export const NumberInputVariants: StoryObj = {
  render: () => {
    const [value1, setValue1] = useState(0)
    const [value2, setValue2] = useState(5)
    const [value3, setValue3] = useState(10)
    
    return (
      <div className="space-y-6">
        <NumberInput
          label="Quantity"
          value={value1}
          onChange={setValue1}
          min={0}
          max={100}
        />
        
        <NumberInput
          label="Rating"
          value={value2}
          onChange={setValue2}
          min={1}
          max={5}
          theme="glass-aurora"
        />
        
        <NumberInput
          label="Without Controls"
          value={value3}
          onChange={setValue3}
          showControls={false}
        />
        
        <NumberInput
          label="With Error"
          value={150}
          error="Value must be less than 100"
          max={100}
        />
      </div>
    )
  },
}

// Complete Form Example
export const CompleteForm: StoryObj = {
  render: () => {
    const [formData, setFormData] = useState({
      company: '',
      plan: 'basic',
      features: {
        analytics: true,
        support: false,
        api: false,
      },
      description: '',
      quantity: 1,
      satisfaction: 50,
    })
    
    const companyOptions: SelectOption[] = [
      { value: 'startup', label: 'Startup (1-10 employees)' },
      { value: 'small', label: 'Small (11-50 employees)' },
      { value: 'medium', label: 'Medium (51-200 employees)' },
      { value: 'large', label: 'Large (200+ employees)' },
    ]
    
    const planOptions: RadioOption[] = [
      { 
        value: 'basic', 
        label: 'Basic',
        description: 'Essential features for small teams'
      },
      { 
        value: 'pro', 
        label: 'Professional',
        description: 'Advanced features and priority support'
      },
      { 
        value: 'enterprise', 
        label: 'Enterprise',
        description: 'Custom solutions for large organizations'
      },
    ]
    
    return (
      <div className="max-w-2xl mx-auto p-8 space-y-8">
        <h2 className="text-2xl font-bold">Complete Form Example</h2>
        
        <Select
          label="Company Size"
          options={companyOptions}
          value={formData.company}
          onChange={(value) => setFormData({ ...formData, company: value })}
          variant="glass"
          theme="glass-aurora"
        />
        
        <RadioGroup
          label="Select Plan"
          name="plan"
          options={planOptions}
          value={formData.plan}
          onChange={(value) => setFormData({ ...formData, plan: value })}
          variant="cards"
        />
        
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground/70">
            Additional Features
          </label>
          <Checkbox
            label="Advanced Analytics"
            checked={formData.features.analytics}
            onChange={(checked) => 
              setFormData({ 
                ...formData, 
                features: { ...formData.features, analytics: checked }
              })
            }
          />
          <Checkbox
            label="24/7 Support"
            checked={formData.features.support}
            onChange={(checked) => 
              setFormData({ 
                ...formData, 
                features: { ...formData.features, support: checked }
              })
            }
          />
          <Checkbox
            label="API Access"
            checked={formData.features.api}
            onChange={(checked) => 
              setFormData({ 
                ...formData, 
                features: { ...formData.features, api: checked }
              })
            }
          />
        </div>
        
        <Textarea
          label="Additional Requirements"
          placeholder="Tell us about your specific needs..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          variant="glass"
        />
        
        <NumberInput
          label="Number of Licenses"
          value={formData.quantity}
          onChange={(value) => setFormData({ ...formData, quantity: value })}
          min={1}
          max={100}
        />
        
        <Slider
          label="How satisfied are you with our service?"
          value={formData.satisfaction}
          onChange={(value) => setFormData({ ...formData, satisfaction: value })}
          min={0}
          max={100}
        />
        
        <div className="pt-4 border-t">
          <h3 className="font-medium mb-2">Form Data:</h3>
          <pre className="text-sm bg-foreground/5 p-4 rounded-lg overflow-auto">
            {JSON.stringify(formData, null, 2)}
          </pre>
        </div>
      </div>
    )
  },
  parameters: {
    layout: 'fullscreen',
  },
}
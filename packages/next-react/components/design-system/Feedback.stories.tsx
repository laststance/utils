import type { Meta, StoryObj } from '@storybook/react'
import React, { useState } from 'react'
import {
  Alert,
  Toast,
  Modal,
  ProgressBar,
  Spinner,
  Skeleton,
  Badge,
  Tooltip,
} from '@/components/design-system/Feedback'
import { Button } from '@/components/design-system/Button'
import { Input } from '@/components/design-system/Auth'
import { Textarea } from '@/components/design-system/Forms'

const meta = {
  title: 'Components/Feedback',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Feedback components for user notifications, loading states, and progress indicators.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta

export default meta

// Alert Stories
export const AlertVariants: StoryObj = {
  render: () => (
    <div className="w-full max-w-2xl space-y-4">
      <Alert
        variant="default"
        title="Default Alert"
        description="This is a default alert message with neutral styling."
      />
      
      <Alert
        variant="info"
        title="Information"
        description="This alert provides helpful information to the user."
      />
      
      <Alert
        variant="success"
        title="Success!"
        description="Your action was completed successfully."
      />
      
      <Alert
        variant="warning"
        title="Warning"
        description="Please review this important information."
      />
      
      <Alert
        variant="error"
        title="Error"
        description="An error occurred while processing your request."
      />
    </div>
  ),
}

export const AlertDismissible: StoryObj = {
  render: () => {
    const [alerts, setAlerts] = useState([
      { id: 1, variant: 'info' as const, title: 'New Update Available' },
      { id: 2, variant: 'success' as const, title: 'File Uploaded Successfully' },
      { id: 3, variant: 'warning' as const, title: 'Storage Almost Full' },
    ])
    
    const dismissAlert = (id: number) => {
      setAlerts(alerts.filter(alert => alert.id !== id))
    }
    
    return (
      <div className="w-full max-w-2xl space-y-4">
        {alerts.map(alert => (
          <Alert
            key={alert.id}
            variant={alert.variant}
            title={alert.title}
            dismissible
            onDismiss={() => dismissAlert(alert.id)}
          />
        ))}
        
        {alerts.length === 0 && (
          <div className="text-center py-8 text-foreground/50">
            All alerts dismissed
            <Button
              onClick={() => window.location.reload()}
              variant="ghost"
              size="sm"
              className="ml-4"
            >
              Refresh
            </Button>
          </div>
        )}
      </div>
    )
  },
}

export const AlertWithActions: StoryObj = {
  render: () => (
    <div className="w-full max-w-2xl space-y-4">
      <Alert
        variant="info"
        title="Update Available"
        description="A new version of the application is available."
        action={
          <div className="flex gap-2">
            <Button size="sm" variant="primary">Update Now</Button>
            <Button size="sm" variant="ghost">Later</Button>
          </div>
        }
      />
      
      <Alert
        variant="warning"
        title="Subscription Expiring"
        description="Your subscription will expire in 3 days."
        action={
          <Button size="sm" variant="gradient" theme="gradient-sunset">
            Renew Subscription
          </Button>
        }
        dismissible
      />
    </div>
  ),
}

// Toast Stories
export const ToastDemo: StoryObj = {
  render: () => {
    const [toasts, setToasts] = useState<any[]>([])
    
    const showToast = (variant: any) => {
      const id = Date.now()
      const newToast = {
        id,
        variant,
        title: `${variant.charAt(0).toUpperCase() + variant.slice(1)} Toast`,
        description: 'This is a toast notification message.',
      }
      setToasts([...toasts, newToast])
    }
    
    const removeToast = (id: number) => {
      setToasts(toasts.filter(t => t.id !== id))
    }
    
    return (
      <div>
        <div className="flex flex-wrap gap-2 mb-8">
          <Button onClick={() => showToast('default')} variant="outline">
            Default Toast
          </Button>
          <Button onClick={() => showToast('info')} variant="outline">
            Info Toast
          </Button>
          <Button onClick={() => showToast('success')} variant="outline">
            Success Toast
          </Button>
          <Button onClick={() => showToast('warning')} variant="outline">
            Warning Toast
          </Button>
          <Button onClick={() => showToast('error')} variant="outline">
            Error Toast
          </Button>
        </div>
        
        <div className="fixed top-4 right-4 space-y-2 z-50">
          {toasts.map(toast => (
            <Toast
              key={toast.id}
              {...toast}
              onClose={() => removeToast(toast.id)}
            />
          ))}
        </div>
      </div>
    )
  },
}

export const ToastWithAction: StoryObj = {
  render: () => {
    const [showToast, setShowToast] = useState(true)
    
    return (
      <div>
        <Button onClick={() => setShowToast(true)} variant="primary">
          Show Toast with Action
        </Button>
        
        {showToast && (
          <div className="fixed top-4 right-4 z-50">
            <Toast
              variant="info"
              title="File Uploaded"
              description="Your file has been uploaded successfully."
              action={{
                label: 'View File',
                onClick: () => console.log('View file clicked'),
              }}
              onClose={() => setShowToast(false)}
            />
          </div>
        )}
      </div>
    )
  },
}

// Modal Stories
export const ModalSizes: StoryObj = {
  render: () => {
    const [modalSize, setModalSize] = useState<'sm' | 'md' | 'lg' | 'xl' | null>(null)
    
    return (
      <div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => setModalSize('sm')} variant="outline">
            Small Modal
          </Button>
          <Button onClick={() => setModalSize('md')} variant="outline">
            Medium Modal
          </Button>
          <Button onClick={() => setModalSize('lg')} variant="outline">
            Large Modal
          </Button>
          <Button onClick={() => setModalSize('xl')} variant="outline">
            Extra Large Modal
          </Button>
        </div>
        
        {modalSize && (
          <Modal
            isOpen={true}
            onClose={() => setModalSize(null)}
            title={`${modalSize.toUpperCase()} Modal`}
            description="This modal demonstrates different size options."
            size={modalSize}
            footer={
              <>
                <Button variant="ghost" onClick={() => setModalSize(null)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={() => setModalSize(null)}>
                  Confirm
                </Button>
              </>
            }
          >
            <p>Modal content goes here. The size of the modal adjusts based on the size prop.</p>
          </Modal>
        )}
      </div>
    )
  },
}

export const ModalWithForm: StoryObj = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false)
    const [formData, setFormData] = useState({ name: '', email: '', message: '' })
    
    return (
      <div>
        <Button onClick={() => setIsOpen(true)} variant="gradient" theme="aurora-borealis">
          Open Contact Form
        </Button>
        
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Contact Us"
          description="Send us a message and we'll get back to you soon."
          size="lg"
          theme="glass-aurora"
          footer={
            <>
              <Button variant="ghost" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button 
                variant="primary" 
                onClick={() => {
                  console.log('Form submitted:', formData)
                  setIsOpen(false)
                }}
              >
                Send Message
              </Button>
            </>
          }
        >
          <div className="space-y-4">
            <Input
              label="Name"
              placeholder="Your name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <Input
              label="Email"
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <Textarea
              label="Message"
              placeholder="Your message..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            />
          </div>
        </Modal>
      </div>
    )
  },
}

// Progress Bar Stories
export const ProgressBarVariants: StoryObj = {
  render: () => (
    <div className="w-96 space-y-6">
      <ProgressBar
        value={25}
        label="Default Progress"
        showValue
      />
      
      <ProgressBar
        value={50}
        variant="gradient"
        label="Gradient Progress"
        showValue
      />
      
      <ProgressBar
        value={75}
        variant="striped"
        label="Striped Progress"
        showValue
        animated
      />
      
      <ProgressBar
        value={30}
        size="sm"
        label="Small"
      />
      
      <ProgressBar
        value={60}
        size="lg"
        label="Large"
        showValue
      />
    </div>
  ),
}

// Spinner Stories
export const SpinnerVariants: StoryObj = {
  render: () => (
    <div className="flex flex-wrap gap-8">
      <Spinner size="sm" label="Small" />
      <Spinner size="md" label="Medium" />
      <Spinner size="lg" label="Large" />
      <Spinner size="xl" label="Extra Large" />
      
      <div className="w-full" />
      
      <Spinner variant="default" label="Default" />
      <Spinner variant="primary" label="Primary" />
      <div className="bg-gray-800 p-4 rounded">
        <Spinner variant="white" label="White" />
      </div>
    </div>
  ),
}

// Skeleton Stories
export const SkeletonLoader: StoryObj = {
  render: () => (
    <div className="w-96 space-y-4">
      <div className="space-y-2">
        <Skeleton variant="text" />
        <Skeleton variant="text" />
        <Skeleton variant="text" width="60%" />
      </div>
      
      <div className="flex gap-4">
        <Skeleton variant="circular" width={60} height={60} />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" />
          <Skeleton variant="text" width="80%" />
        </div>
      </div>
      
      <Skeleton variant="rectangular" height={200} />
      
      <div className="grid grid-cols-3 gap-4">
        <Skeleton variant="rounded" height={100} />
        <Skeleton variant="rounded" height={100} />
        <Skeleton variant="rounded" height={100} />
      </div>
    </div>
  ),
}

// Badge Stories
export const BadgeVariants: StoryObj = {
  render: () => (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Badge>Default</Badge>
        <Badge variant="primary">Primary</Badge>
        <Badge variant="success">Success</Badge>
        <Badge variant="warning">Warning</Badge>
        <Badge variant="error">Error</Badge>
        <Badge variant="info">Info</Badge>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Badge size="sm">Small</Badge>
        <Badge size="md">Medium</Badge>
        <Badge size="lg">Large</Badge>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Badge dot>With Dot</Badge>
        <Badge variant="success" dot>Active</Badge>
        <Badge variant="warning" dot>Pending</Badge>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Badge removable onRemove={() => console.log('Removed')}>
          Removable
        </Badge>
        <Badge variant="primary" removable>
          Tag 1
        </Badge>
        <Badge variant="info" removable>
          Tag 2
        </Badge>
      </div>
    </div>
  ),
}

// Tooltip Stories
export const TooltipPositions: StoryObj = {
  render: () => (
    <div className="grid grid-cols-2 gap-8 p-20">
      <Tooltip content="Top tooltip" position="top">
        <Button variant="outline">Hover (Top)</Button>
      </Tooltip>
      
      <Tooltip content="Bottom tooltip" position="bottom">
        <Button variant="outline">Hover (Bottom)</Button>
      </Tooltip>
      
      <Tooltip content="Left tooltip" position="left">
        <Button variant="outline">Hover (Left)</Button>
      </Tooltip>
      
      <Tooltip content="Right tooltip" position="right">
        <Button variant="outline">Hover (Right)</Button>
      </Tooltip>
    </div>
  ),
}

// Complete Notification System
export const NotificationSystem: StoryObj = {
  render: () => {
    const [notifications, setNotifications] = useState<any[]>([])
    const [modalOpen, setModalOpen] = useState(false)
    
    const addNotification = (type: string) => {
      const id = Date.now()
      setNotifications([...notifications, { id, type, message: `${type} notification` }])
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id))
      }, 5000)
    }
    
    return (
      <div className="min-h-[400px]">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Notification System Demo</h3>
          
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => addNotification('success')} variant="gradient" theme="gradient-forest">
              Success Notification
            </Button>
            <Button onClick={() => addNotification('error')} variant="gradient" theme="gradient-rose">
              Error Notification
            </Button>
            <Button onClick={() => setModalOpen(true)} variant="gradient" theme="aurora-borealis">
              Open Modal
            </Button>
          </div>
          
          <Alert
            variant="info"
            title="System Status"
            description="All systems are operational"
            dismissible
          />
          
          <ProgressBar value={65} label="Upload Progress" showValue animated variant="striped" />
        </div>
        
        {/* Toast Container */}
        <div className="fixed top-4 right-4 space-y-2 z-50">
          {notifications.map(notif => (
            <Toast
              key={notif.id}
              variant={notif.type}
              title={notif.message}
              onClose={() => setNotifications(prev => prev.filter(n => n.id !== notif.id))}
            />
          ))}
        </div>
        
        {/* Modal */}
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Important Message"
          description="This is a critical system notification"
          footer={
            <Button variant="primary" onClick={() => setModalOpen(false)}>
              Acknowledge
            </Button>
          }
        >
          <Alert variant="warning" title="Action Required">
            Please review and confirm your settings.
          </Alert>
        </Modal>
      </div>
    )
  },
  parameters: {
    layout: 'fullscreen',
  },
}
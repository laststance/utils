import type { Meta, StoryFn } from '@storybook/nextjs-vite'
import {
  BellIcon,
  CreditCardIcon,
  KeyIcon,
  LinkIcon,
  MonitorIcon,
  SettingsIcon,
  SparklesIcon,
  UserIcon,
} from 'lucide-react'
import { useState } from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'

import {
  SettingsModal,
  SettingsModalContent,
  SettingsModalContentDescription,
  SettingsModalContentDivider,
  SettingsModalContentHeader,
  SettingsModalContentTitle,
  SettingsModalRow,
  type SettingsMenuItem,
} from './index'

const meta: Meta<typeof SettingsModal> = {
  title: 'UI/SettingsModal',
  component: SettingsModal,
  parameters: {
    layout: 'centered',
    docs: {
      codePanel: true,
      description: {
        component:
          'A Mapify-inspired settings modal with scrollable side menu and content panels. Responsive: Dialog on desktop, Drawer with accordion on mobile.',
      },
    },
  },
}

export default meta

/**
 * Mapify-style menu items configuration.
 */
const mapifyMenuItems: SettingsMenuItem[] = [
  { id: 'account', label: 'Account', icon: UserIcon },
  { id: 'general', label: 'General', icon: SettingsIcon },
  { id: 'ai', label: 'AI Features', icon: SparklesIcon, badge: 'New' },
  { id: 'billing', label: 'Billing', icon: CreditCardIcon },
  { id: 'integrations', label: 'Integrations', icon: LinkIcon },
  { id: 'connections', label: 'Connections', icon: KeyIcon },
  { id: 'devices', label: 'Devices', icon: MonitorIcon, badge: 2 },
  { id: 'notifications', label: 'Notifications', icon: BellIcon },
]

/**
 * Demo account panel content.
 */
function AccountPanel() {
  return (
    <>
      <SettingsModalContentHeader>
        <SettingsModalContentTitle>Account</SettingsModalContentTitle>
        <SettingsModalContentDescription>
          Manage your profile and account preferences
        </SettingsModalContentDescription>
      </SettingsModalContentHeader>

      {/* Profile Section */}
      <div className="flex items-center gap-4">
        <Avatar className="size-16">
          <AvatarImage src="https://github.com/shadcn.png" alt="User avatar" />
          <AvatarFallback>RM</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="font-medium">Raphtalia</div>
          <div className="text-sm text-muted-foreground">@raphtalia</div>
        </div>
        <Button variant="outline" size="sm">
          Edit
        </Button>
      </div>

      <SettingsModalContentDivider />

      <SettingsModalRow label="Email" description="Primary email address">
        <span className="text-sm text-muted-foreground">
          raphtalia@example.com
        </span>
      </SettingsModalRow>

      <SettingsModalRow label="Plan" description="Current subscription">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">Basic</Badge>
          <Button variant="outline" size="sm">
            Upgrade
          </Button>
        </div>
      </SettingsModalRow>

      <SettingsModalContentDivider />

      <SettingsModalRow
        label="Two-Factor Authentication"
        description="Add extra security to your account"
      >
        <Button variant="outline" size="sm">
          Enable
        </Button>
      </SettingsModalRow>

      <div className="mt-8">
        <Button variant="destructive" size="sm">
          Delete Account
        </Button>
      </div>
    </>
  )
}

/**
 * Demo general settings panel.
 */
function GeneralPanel() {
  const [darkMode, setDarkMode] = useState(false)
  const [compactMode, setCompactMode] = useState(true)

  return (
    <>
      <SettingsModalContentHeader>
        <SettingsModalContentTitle>General</SettingsModalContentTitle>
        <SettingsModalContentDescription>
          Customize your app experience
        </SettingsModalContentDescription>
      </SettingsModalContentHeader>

      <SettingsModalRow label="Dark Mode" description="Use dark theme">
        <Switch checked={darkMode} onCheckedChange={setDarkMode} />
      </SettingsModalRow>

      <SettingsModalRow
        label="Compact Mode"
        description="Reduce spacing for more content"
      >
        <Switch checked={compactMode} onCheckedChange={setCompactMode} />
      </SettingsModalRow>

      <SettingsModalContentDivider />

      <SettingsModalRow label="Language" description="Display language">
        <Button variant="outline" size="sm">
          English
        </Button>
      </SettingsModalRow>

      <SettingsModalRow label="Timezone" description="Your local timezone">
        <Button variant="outline" size="sm">
          Asia/Tokyo (UTC+9)
        </Button>
      </SettingsModalRow>
    </>
  )
}

/**
 * Demo AI features panel.
 */
function AIPanel() {
  const [autoSuggestions, setAutoSuggestions] = useState(true)
  const [smartCompletion, setSmartCompletion] = useState(true)

  return (
    <>
      <SettingsModalContentHeader>
        <SettingsModalContentTitle>AI Features</SettingsModalContentTitle>
        <SettingsModalContentDescription>
          Configure AI-powered assistance
        </SettingsModalContentDescription>
      </SettingsModalContentHeader>

      <SettingsModalRow
        label="Auto Suggestions"
        description="Get intelligent suggestions as you type"
      >
        <Switch
          checked={autoSuggestions}
          onCheckedChange={setAutoSuggestions}
        />
      </SettingsModalRow>

      <SettingsModalRow
        label="Smart Completion"
        description="AI-powered text completion"
      >
        <Switch
          checked={smartCompletion}
          onCheckedChange={setSmartCompletion}
        />
      </SettingsModalRow>

      <SettingsModalContentDivider />

      <SettingsModalRow label="AI Model" description="Select preferred model">
        <Button variant="outline" size="sm">
          Claude 3.5 Sonnet
        </Button>
      </SettingsModalRow>

      <div className="mt-4 rounded-lg bg-muted/50 p-4">
        <div className="flex items-center gap-2 text-sm font-medium">
          <SparklesIcon className="size-4 text-primary" />
          AI Credits Remaining
        </div>
        <div className="mt-2 text-2xl font-bold">847 / 1,000</div>
        <div className="mt-1 text-xs text-muted-foreground">
          Resets on Feb 1, 2026
        </div>
      </div>
    </>
  )
}

/**
 * Demo billing panel.
 */
function BillingPanel() {
  return (
    <>
      <SettingsModalContentHeader>
        <SettingsModalContentTitle>Billing</SettingsModalContentTitle>
        <SettingsModalContentDescription>
          Manage your subscription and payment methods
        </SettingsModalContentDescription>
      </SettingsModalContentHeader>

      <div className="rounded-lg border p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium">Basic Plan</div>
            <div className="text-sm text-muted-foreground">$9.99/month</div>
          </div>
          <Badge>Active</Badge>
        </div>
        <div className="mt-4 flex gap-2">
          <Button size="sm">Upgrade to Pro</Button>
          <Button variant="outline" size="sm">
            Cancel
          </Button>
        </div>
      </div>

      <SettingsModalContentDivider />

      <SettingsModalRow
        label="Payment Method"
        description="Visa ending in 4242"
      >
        <Button variant="outline" size="sm">
          Update
        </Button>
      </SettingsModalRow>

      <SettingsModalRow
        label="Billing History"
        description="View past invoices"
      >
        <Button variant="outline" size="sm">
          View All
        </Button>
      </SettingsModalRow>
    </>
  )
}

/**
 * Demo integrations panel.
 */
function IntegrationsPanel() {
  return (
    <>
      <SettingsModalContentHeader>
        <SettingsModalContentTitle>Integrations</SettingsModalContentTitle>
        <SettingsModalContentDescription>
          Connect with your favorite apps and services
        </SettingsModalContentDescription>
      </SettingsModalContentHeader>

      <SettingsModalRow label="GitHub" description="Connected as @raphtalia">
        <Button variant="outline" size="sm">
          Disconnect
        </Button>
      </SettingsModalRow>

      <SettingsModalRow label="Slack" description="Not connected">
        <Button size="sm">Connect</Button>
      </SettingsModalRow>

      <SettingsModalRow label="Notion" description="Not connected">
        <Button size="sm">Connect</Button>
      </SettingsModalRow>

      <SettingsModalRow label="Linear" description="Not connected">
        <Button size="sm">Connect</Button>
      </SettingsModalRow>
    </>
  )
}

/**
 * Demo connections panel.
 */
function ConnectionsPanel() {
  return (
    <>
      <SettingsModalContentHeader>
        <SettingsModalContentTitle>Connections</SettingsModalContentTitle>
        <SettingsModalContentDescription>
          Manage API keys and access tokens
        </SettingsModalContentDescription>
      </SettingsModalContentHeader>

      <SettingsModalRow label="API Key" description="For external integrations">
        <Button variant="outline" size="sm">
          Generate New
        </Button>
      </SettingsModalRow>

      <div className="mt-2 rounded-md bg-muted p-3 font-mono text-xs">
        sk-••••••••••••••••••••••••••••••4x7f
      </div>

      <SettingsModalContentDivider />

      <SettingsModalRow
        label="Webhooks"
        description="Configure event notifications"
      >
        <Button variant="outline" size="sm">
          Manage
        </Button>
      </SettingsModalRow>
    </>
  )
}

/**
 * Demo devices panel.
 */
function DevicesPanel() {
  return (
    <>
      <SettingsModalContentHeader>
        <SettingsModalContentTitle>Devices</SettingsModalContentTitle>
        <SettingsModalContentDescription>
          Manage your logged-in devices
        </SettingsModalContentDescription>
      </SettingsModalContentHeader>

      <div className="space-y-3">
        <div className="flex items-center justify-between rounded-lg border p-3">
          <div className="flex items-center gap-3">
            <MonitorIcon className="size-5 text-muted-foreground" />
            <div>
              <div className="text-sm font-medium">MacBook Pro</div>
              <div className="text-xs text-muted-foreground">
                Tokyo, Japan - Active now
              </div>
            </div>
          </div>
          <Badge variant="outline">Current</Badge>
        </div>

        <div className="flex items-center justify-between rounded-lg border p-3">
          <div className="flex items-center gap-3">
            <MonitorIcon className="size-5 text-muted-foreground" />
            <div>
              <div className="text-sm font-medium">iPhone 15 Pro</div>
              <div className="text-xs text-muted-foreground">
                Tokyo, Japan - 2 hours ago
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            Sign Out
          </Button>
        </div>
      </div>

      <div className="mt-6">
        <Button variant="outline" className="w-full">
          Sign Out All Devices
        </Button>
      </div>
    </>
  )
}

/**
 * Demo notifications panel.
 */
function NotificationsPanel() {
  const [emailNotifs, setEmailNotifs] = useState(true)
  const [pushNotifs, setPushNotifs] = useState(false)
  const [weeklyDigest, setWeeklyDigest] = useState(true)

  return (
    <>
      <SettingsModalContentHeader>
        <SettingsModalContentTitle>Notifications</SettingsModalContentTitle>
        <SettingsModalContentDescription>
          Choose how you want to be notified
        </SettingsModalContentDescription>
      </SettingsModalContentHeader>

      <SettingsModalRow
        label="Email Notifications"
        description="Receive updates via email"
      >
        <Switch checked={emailNotifs} onCheckedChange={setEmailNotifs} />
      </SettingsModalRow>

      <SettingsModalRow
        label="Push Notifications"
        description="Browser push notifications"
      >
        <Switch checked={pushNotifs} onCheckedChange={setPushNotifs} />
      </SettingsModalRow>

      <SettingsModalRow
        label="Weekly Digest"
        description="Summary of your activity"
      >
        <Switch checked={weeklyDigest} onCheckedChange={setWeeklyDigest} />
      </SettingsModalRow>
    </>
  )
}

/**
 * Default story with all Mapify-style menu items and demo content.
 */
export const Default: StoryFn<typeof SettingsModal> = () => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Settings</Button>
      <SettingsModal
        open={open}
        onOpenChange={setOpen}
        items={mapifyMenuItems}
        defaultItem="account"
        title="Settings"
      >
        <SettingsModalContent id="account">
          <AccountPanel />
        </SettingsModalContent>
        <SettingsModalContent id="general">
          <GeneralPanel />
        </SettingsModalContent>
        <SettingsModalContent id="ai">
          <AIPanel />
        </SettingsModalContent>
        <SettingsModalContent id="billing">
          <BillingPanel />
        </SettingsModalContent>
        <SettingsModalContent id="integrations">
          <IntegrationsPanel />
        </SettingsModalContent>
        <SettingsModalContent id="connections">
          <ConnectionsPanel />
        </SettingsModalContent>
        <SettingsModalContent id="devices">
          <DevicesPanel />
        </SettingsModalContent>
        <SettingsModalContent id="notifications">
          <NotificationsPanel />
        </SettingsModalContent>
      </SettingsModal>
    </>
  )
}

/**
 * Story showing the modal in open state.
 */
export const Open: StoryFn<typeof SettingsModal> = () => {
  const [open, setOpen] = useState(true)

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Settings</Button>
      <SettingsModal
        open={open}
        onOpenChange={setOpen}
        items={mapifyMenuItems}
        defaultItem="account"
        title="Settings"
      >
        <SettingsModalContent id="account">
          <AccountPanel />
        </SettingsModalContent>
        <SettingsModalContent id="general">
          <GeneralPanel />
        </SettingsModalContent>
        <SettingsModalContent id="ai">
          <AIPanel />
        </SettingsModalContent>
        <SettingsModalContent id="billing">
          <BillingPanel />
        </SettingsModalContent>
        <SettingsModalContent id="integrations">
          <IntegrationsPanel />
        </SettingsModalContent>
        <SettingsModalContent id="connections">
          <ConnectionsPanel />
        </SettingsModalContent>
        <SettingsModalContent id="devices">
          <DevicesPanel />
        </SettingsModalContent>
        <SettingsModalContent id="notifications">
          <NotificationsPanel />
        </SettingsModalContent>
      </SettingsModal>
    </>
  )
}

/**
 * Minimal example with fewer menu items.
 */
export const Minimal: StoryFn<typeof SettingsModal> = () => {
  const [open, setOpen] = useState(false)

  const minimalItems: SettingsMenuItem[] = [
    { id: 'profile', label: 'Profile', icon: UserIcon },
    { id: 'preferences', label: 'Preferences', icon: SettingsIcon },
  ]

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Settings</Button>
      <SettingsModal
        open={open}
        onOpenChange={setOpen}
        items={minimalItems}
        defaultItem="profile"
        title="Account Settings"
      >
        <SettingsModalContent id="profile">
          <SettingsModalContentHeader>
            <SettingsModalContentTitle>Profile</SettingsModalContentTitle>
            <SettingsModalContentDescription>
              Your public profile information
            </SettingsModalContentDescription>
          </SettingsModalContentHeader>
          <SettingsModalRow label="Display Name">
            <Button variant="outline" size="sm">
              Edit
            </Button>
          </SettingsModalRow>
        </SettingsModalContent>
        <SettingsModalContent id="preferences">
          <SettingsModalContentHeader>
            <SettingsModalContentTitle>Preferences</SettingsModalContentTitle>
            <SettingsModalContentDescription>
              Customize your experience
            </SettingsModalContentDescription>
          </SettingsModalContentHeader>
          <SettingsModalRow label="Theme">
            <Button variant="outline" size="sm">
              System
            </Button>
          </SettingsModalRow>
        </SettingsModalContent>
      </SettingsModal>
    </>
  )
}

/**
 * Japanese localization example.
 */
export const Japanese: StoryFn<typeof SettingsModal> = () => {
  const [open, setOpen] = useState(false)

  const japaneseItems: SettingsMenuItem[] = [
    { id: 'account', label: 'Account', icon: UserIcon },
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'ai', label: 'AI Features', icon: SparklesIcon, badge: 'New' },
    { id: 'billing', label: 'Billing', icon: CreditCardIcon },
    { id: 'integrations', label: 'Integration', icon: LinkIcon },
    { id: 'connections', label: 'Connection', icon: KeyIcon },
    { id: 'devices', label: 'Device', icon: MonitorIcon, badge: 2 },
  ]

  return (
    <>
      <Button onClick={() => setOpen(true)}>Settings</Button>
      <SettingsModal
        open={open}
        onOpenChange={setOpen}
        items={japaneseItems}
        defaultItem="account"
        title="Settings"
      >
        <SettingsModalContent id="account">
          <SettingsModalContentHeader>
            <SettingsModalContentTitle>Account</SettingsModalContentTitle>
            <SettingsModalContentDescription>
              Manage your profile and account information
            </SettingsModalContentDescription>
          </SettingsModalContentHeader>

          <div className="flex items-center gap-4">
            <Avatar className="size-16">
              <AvatarFallback>RM</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="font-medium">Raphtalia</div>
              <div className="text-sm text-muted-foreground">
                raphtalia@example.com
              </div>
            </div>
            <Button variant="outline" size="sm">
              Edit
            </Button>
          </div>
        </SettingsModalContent>
        <SettingsModalContent id="general">
          <SettingsModalContentHeader>
            <SettingsModalContentTitle>General</SettingsModalContentTitle>
          </SettingsModalContentHeader>
          <SettingsModalRow label="Theme">
            <Button variant="outline" size="sm">
              System
            </Button>
          </SettingsModalRow>
        </SettingsModalContent>
        <SettingsModalContent id="ai">
          <SettingsModalContentHeader>
            <SettingsModalContentTitle>AI Features</SettingsModalContentTitle>
          </SettingsModalContentHeader>
          <SettingsModalRow label="Auto-complete">
            <Switch defaultChecked />
          </SettingsModalRow>
        </SettingsModalContent>
        <SettingsModalContent id="billing">
          <SettingsModalContentHeader>
            <SettingsModalContentTitle>Billing</SettingsModalContentTitle>
          </SettingsModalContentHeader>
          <SettingsModalRow label="Current Plan">
            <Badge>Basic</Badge>
          </SettingsModalRow>
        </SettingsModalContent>
        <SettingsModalContent id="integrations">
          <SettingsModalContentHeader>
            <SettingsModalContentTitle>Integration</SettingsModalContentTitle>
          </SettingsModalContentHeader>
        </SettingsModalContent>
        <SettingsModalContent id="connections">
          <SettingsModalContentHeader>
            <SettingsModalContentTitle>Connection</SettingsModalContentTitle>
          </SettingsModalContentHeader>
        </SettingsModalContent>
        <SettingsModalContent id="devices">
          <SettingsModalContentHeader>
            <SettingsModalContentTitle>Device</SettingsModalContentTitle>
          </SettingsModalContentHeader>
        </SettingsModalContent>
      </SettingsModal>
    </>
  )
}

'use client'

import { createContext, use } from 'react'

/**
 * Menu item configuration for the settings modal.
 */
export type SettingsMenuItem = {
  /** Unique identifier for the menu item */
  id: string
  /** Display label */
  label: string
  /** Optional icon component */
  icon?: React.ComponentType<{ className?: string }>
  /** Optional badge (e.g., notification count) */
  badge?: string | number
  /** Disable this menu item */
  disabled?: boolean
}

/**
 * Context value for the settings modal state.
 */
export type SettingsModalContextValue = {
  /** Currently selected menu item ID */
  activeId: string
  /** Set the active menu item */
  setActiveId: (id: string) => void
  /** List of menu items */
  items: SettingsMenuItem[]
  /** Whether the modal is in mobile mode */
  isMobile: boolean
}

/**
 * Context for sharing settings modal state between components.
 * @example
 * const { activeId, setActiveId } = use(SettingsModalContext)
 */
export const SettingsModalContext =
  createContext<SettingsModalContextValue | null>(null)

/**
 * Hook to access settings modal state and controls.
 * @returns The settings modal context value.
 * @throws Error if used outside of SettingsModalProvider.
 * @example
 * function MenuButton() {
 *   const { activeId, setActiveId } = useSettingsModal()
 *   return <button onClick={() => setActiveId('general')}>...</button>
 * }
 */
export function useSettingsModal(): SettingsModalContextValue {
  const context = use(SettingsModalContext)
  if (!context) {
    throw new Error('useSettingsModal must be used within a SettingsModal')
  }
  return context
}

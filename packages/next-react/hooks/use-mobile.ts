import * as React from 'react'

const MOBILE_BREAKPOINT = 768

/**
 * React hook to detect if the current viewport is considered mobile.
 * Uses a breakpoint of 768px to determine mobile vs desktop.
 *
 * Features:
 * - Server-safe (starts with undefined, then updates on client)
 * - Listens to window resize events
 * - Cleanup on unmount
 * - Returns boolean for easy conditionals
 *
 * @returns Boolean indicating if viewport width is below mobile breakpoint (768px)
 *
 * @example
 * ```tsx
 * function ResponsiveComponent() {
 *   const isMobile = useIsMobile()
 *
 *   return (
 *     <div>
 *       {isMobile ? (
 *         <MobileNavigation />
 *       ) : (
 *         <DesktopNavigation />
 *       )}
 *     </div>
 *   )
 * }
 *
 * // Conditional rendering for mobile-specific features
 * function App() {
 *   const isMobile = useIsMobile()
 *
 *   return (
 *     <div>
 *       <Header />
 *       {isMobile && <MobileOnlyFeature />}
 *       <MainContent />
 *     </div>
 *   )
 * }
 * ```
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener('change', onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  return !!isMobile
}

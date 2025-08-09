/**
 * Apple-inspired Spacing & Layout System
 * Based on 8pt grid system and Apple HIG principles
 * Consistent spacing for harmonious layouts
 */

// Base unit: 4px (0.25rem)
export const spacing = {
  0: '0',
  px: '1px',
  0.5: '0.125rem', // 2px
  1: '0.25rem',    // 4px
  1.5: '0.375rem', // 6px
  2: '0.5rem',     // 8px
  2.5: '0.625rem', // 10px
  3: '0.75rem',    // 12px
  3.5: '0.875rem', // 14px
  4: '1rem',       // 16px
  5: '1.25rem',    // 20px
  6: '1.5rem',     // 24px
  7: '1.75rem',    // 28px
  8: '2rem',       // 32px
  9: '2.25rem',    // 36px
  10: '2.5rem',    // 40px
  11: '2.75rem',   // 44px
  12: '3rem',      // 48px
  14: '3.5rem',    // 56px
  16: '4rem',      // 64px
  20: '5rem',      // 80px
  24: '6rem',      // 96px
  28: '7rem',      // 112px
  32: '8rem',      // 128px
  36: '9rem',      // 144px
  40: '10rem',     // 160px
  44: '11rem',     // 176px
  48: '12rem',     // 192px
  52: '13rem',     // 208px
  56: '14rem',     // 224px
  60: '15rem',     // 240px
  64: '16rem',     // 256px
  72: '18rem',     // 288px
  80: '20rem',     // 320px
  96: '24rem',     // 384px
} as const

// Padding presets
export const padding = {
  // Component padding
  button: {
    sm: 'px-3 py-1.5',
    md: 'px-4 py-2',
    lg: 'px-6 py-3',
    xl: 'px-8 py-4',
  },
  card: {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  },
  section: {
    sm: 'py-8 px-4',
    md: 'py-12 px-6',
    lg: 'py-16 px-8',
    xl: 'py-20 px-10',
  },
  container: {
    sm: 'px-4',
    md: 'px-6',
    lg: 'px-8',
    xl: 'px-12',
  },
}

// Margin presets
export const margin = {
  // Stack spacing (vertical rhythm)
  stack: {
    xs: 'mb-2',
    sm: 'mb-4',
    md: 'mb-6',
    lg: 'mb-8',
    xl: 'mb-12',
    '2xl': 'mb-16',
  },
  // Inline spacing (horizontal rhythm)
  inline: {
    xs: 'mr-2',
    sm: 'mr-4',
    md: 'mr-6',
    lg: 'mr-8',
    xl: 'mr-12',
  },
  // Section spacing
  section: {
    sm: 'my-8',
    md: 'my-12',
    lg: 'my-16',
    xl: 'my-20',
    '2xl': 'my-24',
  },
}

// Gap utilities for flexbox and grid
export const gap = {
  0: 'gap-0',
  px: 'gap-px',
  0.5: 'gap-0.5',
  1: 'gap-1',
  1.5: 'gap-1.5',
  2: 'gap-2',
  2.5: 'gap-2.5',
  3: 'gap-3',
  3.5: 'gap-3.5',
  4: 'gap-4',
  5: 'gap-5',
  6: 'gap-6',
  7: 'gap-7',
  8: 'gap-8',
  9: 'gap-9',
  10: 'gap-10',
  11: 'gap-11',
  12: 'gap-12',
  14: 'gap-14',
  16: 'gap-16',
  20: 'gap-20',
  24: 'gap-24',
  28: 'gap-28',
  32: 'gap-32',
}

// Container widths
export const containers = {
  xs: 'max-w-xs',     // 320px
  sm: 'max-w-sm',     // 384px
  md: 'max-w-md',     // 448px
  lg: 'max-w-lg',     // 512px
  xl: 'max-w-xl',     // 576px
  '2xl': 'max-w-2xl', // 672px
  '3xl': 'max-w-3xl', // 768px
  '4xl': 'max-w-4xl', // 896px
  '5xl': 'max-w-5xl', // 1024px
  '6xl': 'max-w-6xl', // 1152px
  '7xl': 'max-w-7xl', // 1280px
  full: 'max-w-full',
  prose: 'max-w-prose', // 65ch
  screen: 'max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl',
}

// Border radius (following Apple's rounded corners)
export const radius = {
  none: 'rounded-none',
  sm: 'rounded-sm',     // 2px
  DEFAULT: 'rounded',   // 4px
  md: 'rounded-md',     // 6px
  lg: 'rounded-lg',     // 8px
  xl: 'rounded-xl',     // 12px
  '2xl': 'rounded-2xl', // 16px
  '3xl': 'rounded-3xl', // 24px
  full: 'rounded-full',
  // Apple-specific radius
  button: 'rounded-[10px]',
  card: 'rounded-[12px]',
  modal: 'rounded-[16px]',
  sheet: 'rounded-t-[20px]',
}

// Shadow system (elevation)
export const shadows = {
  none: 'shadow-none',
  xs: 'shadow-xs',
  sm: 'shadow-sm',
  DEFAULT: 'shadow',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
  '2xl': 'shadow-2xl',
  inner: 'shadow-inner',
  // Apple-style shadows
  card: 'shadow-[0_2px_8px_rgba(0,0,0,0.04),0_0_1px_rgba(0,0,0,0.06)]',
  hover: 'shadow-[0_4px_12px_rgba(0,0,0,0.08),0_0_1px_rgba(0,0,0,0.06)]',
  modal: 'shadow-[0_10px_40px_rgba(0,0,0,0.2)]',
  dropdown: 'shadow-[0_4px_24px_rgba(0,0,0,0.12)]',
  // Glassmorphism shadows
  glass: 'shadow-[0_8px_32px_rgba(0,0,0,0.08)]',
  'glass-elevated': 'shadow-[0_12px_48px_rgba(0,0,0,0.12)]',
  'glass-floating': 'shadow-[0_24px_64px_rgba(0,0,0,0.16)]',
  // Colored shadows
  'blue-glow': 'shadow-[0_0_40px_rgba(59,130,246,0.3)]',
  'purple-glow': 'shadow-[0_0_40px_rgba(147,51,234,0.3)]',
  'pink-glow': 'shadow-[0_0_40px_rgba(236,72,153,0.3)]',
  'green-glow': 'shadow-[0_0_40px_rgba(34,197,94,0.3)]',
}

// Layout utilities
export const layout = {
  // Display
  display: {
    block: 'block',
    'inline-block': 'inline-block',
    inline: 'inline',
    flex: 'flex',
    'inline-flex': 'inline-flex',
    grid: 'grid',
    'inline-grid': 'inline-grid',
    hidden: 'hidden',
  },
  
  // Flexbox
  flex: {
    row: 'flex-row',
    'row-reverse': 'flex-row-reverse',
    col: 'flex-col',
    'col-reverse': 'flex-col-reverse',
  },
  
  flexWrap: {
    wrap: 'flex-wrap',
    'wrap-reverse': 'flex-wrap-reverse',
    nowrap: 'flex-nowrap',
  },
  
  // Alignment
  justify: {
    start: 'justify-start',
    end: 'justify-end',
    center: 'justify-center',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly',
  },
  
  items: {
    start: 'items-start',
    end: 'items-end',
    center: 'items-center',
    baseline: 'items-baseline',
    stretch: 'items-stretch',
  },
  
  // Grid
  grid: {
    cols: {
      1: 'grid-cols-1',
      2: 'grid-cols-2',
      3: 'grid-cols-3',
      4: 'grid-cols-4',
      5: 'grid-cols-5',
      6: 'grid-cols-6',
      7: 'grid-cols-7',
      8: 'grid-cols-8',
      9: 'grid-cols-9',
      10: 'grid-cols-10',
      11: 'grid-cols-11',
      12: 'grid-cols-12',
    },
    rows: {
      1: 'grid-rows-1',
      2: 'grid-rows-2',
      3: 'grid-rows-3',
      4: 'grid-rows-4',
      5: 'grid-rows-5',
      6: 'grid-rows-6',
    },
  },
  
  // Position
  position: {
    static: 'static',
    fixed: 'fixed',
    absolute: 'absolute',
    relative: 'relative',
    sticky: 'sticky',
  },
  
  // Z-index
  zIndex: {
    0: 'z-0',
    10: 'z-10',
    20: 'z-20',
    30: 'z-30',
    40: 'z-40',
    50: 'z-50',
    auto: 'z-auto',
    dropdown: 'z-[100]',
    modal: 'z-[200]',
    popover: 'z-[300]',
    tooltip: 'z-[400]',
    notification: 'z-[500]',
  },
}

// Responsive breakpoints (Apple-inspired)
export const breakpoints = {
  sm: '640px',   // Small devices
  md: '768px',   // iPad Portrait
  lg: '1024px',  // iPad Landscape
  xl: '1280px',  // Desktop
  '2xl': '1536px', // Large desktop
}

// Touch targets (minimum 44x44 points as per Apple HIG)
export const touchTargets = {
  min: 'min-h-[44px] min-w-[44px]',
  sm: 'h-[44px] w-[44px]',
  md: 'h-[48px] w-[48px]',
  lg: 'h-[56px] w-[56px]',
  xl: 'h-[64px] w-[64px]',
}

// Aspect ratios
export const aspectRatios = {
  square: 'aspect-square',
  video: 'aspect-video',
  '4/3': 'aspect-[4/3]',
  '3/2': 'aspect-[3/2]',
  '16/10': 'aspect-[16/10]',
  '21/9': 'aspect-[21/9]',
  // Device specific
  iphone: 'aspect-[9/19.5]',
  ipad: 'aspect-[3/4]',
  macbook: 'aspect-[16/10]',
}

// Helper function to create responsive spacing
export function responsiveSpacing(
  mobile: string,
  tablet?: string,
  desktop?: string
): string {
  const classes = [mobile]
  if (tablet) classes.push(`md:${tablet}`)
  if (desktop) classes.push(`lg:${desktop}`)
  return classes.join(' ')
}

// Spacing scale generator
export function spacingScale(base: number = 4, scale: number[] = [1, 2, 3, 4, 6, 8, 12, 16, 20, 24]): Record<string, string> {
  return scale.reduce((acc, multiplier) => {
    const value = base * multiplier
    const rem = value / 16
    acc[multiplier.toString()] = `${rem}rem`
    return acc
  }, {} as Record<string, string>)
}

// Export complete spacing system
export const spacingSystem = {
  spacing,
  padding,
  margin,
  gap,
  containers,
  radius,
  shadows,
  layout,
  breakpoints,
  touchTargets,
  aspectRatios,
}
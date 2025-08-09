/**
 * Apple-inspired Typography System
 * Based on San Francisco font principles and Apple HIG
 * Optimized for readability and hierarchy
 */

export interface TypographyConfig {
  fontSize: string
  lineHeight: string
  letterSpacing: string
  fontWeight: string
  className: string
}

export interface TypographyScale {
  largeTitle: TypographyConfig
  title1: TypographyConfig
  title2: TypographyConfig
  title3: TypographyConfig
  headline: TypographyConfig
  body: TypographyConfig
  callout: TypographyConfig
  subheadline: TypographyConfig
  footnote: TypographyConfig
  caption1: TypographyConfig
  caption2: TypographyConfig
}

// Apple-inspired type scale
export const typography: TypographyScale = {
  largeTitle: {
    fontSize: 'text-[34px] md:text-[48px] lg:text-[64px]',
    lineHeight: 'leading-[1.1]',
    letterSpacing: 'tracking-[-0.02em]',
    fontWeight: 'font-bold',
    className: 'text-[34px] md:text-[48px] lg:text-[64px] leading-[1.1] tracking-[-0.02em] font-bold',
  },
  title1: {
    fontSize: 'text-[28px] md:text-[36px] lg:text-[48px]',
    lineHeight: 'leading-[1.15]',
    letterSpacing: 'tracking-[-0.015em]',
    fontWeight: 'font-semibold',
    className: 'text-[28px] md:text-[36px] lg:text-[48px] leading-[1.15] tracking-[-0.015em] font-semibold',
  },
  title2: {
    fontSize: 'text-[22px] md:text-[28px] lg:text-[36px]',
    lineHeight: 'leading-[1.2]',
    letterSpacing: 'tracking-[-0.01em]',
    fontWeight: 'font-semibold',
    className: 'text-[22px] md:text-[28px] lg:text-[36px] leading-[1.2] tracking-[-0.01em] font-semibold',
  },
  title3: {
    fontSize: 'text-[20px] md:text-[24px] lg:text-[28px]',
    lineHeight: 'leading-[1.25]',
    letterSpacing: 'tracking-[-0.005em]',
    fontWeight: 'font-medium',
    className: 'text-[20px] md:text-[24px] lg:text-[28px] leading-[1.25] tracking-[-0.005em] font-medium',
  },
  headline: {
    fontSize: 'text-[17px] md:text-[19px] lg:text-[21px]',
    lineHeight: 'leading-[1.3]',
    letterSpacing: 'tracking-[-0.003em]',
    fontWeight: 'font-semibold',
    className: 'text-[17px] md:text-[19px] lg:text-[21px] leading-[1.3] tracking-[-0.003em] font-semibold',
  },
  body: {
    fontSize: 'text-[17px]',
    lineHeight: 'leading-[1.5]',
    letterSpacing: 'tracking-[-0.001em]',
    fontWeight: 'font-normal',
    className: 'text-[17px] leading-[1.5] tracking-[-0.001em] font-normal',
  },
  callout: {
    fontSize: 'text-[16px]',
    lineHeight: 'leading-[1.45]',
    letterSpacing: 'tracking-normal',
    fontWeight: 'font-normal',
    className: 'text-[16px] leading-[1.45] tracking-normal font-normal',
  },
  subheadline: {
    fontSize: 'text-[15px]',
    lineHeight: 'leading-[1.4]',
    letterSpacing: 'tracking-normal',
    fontWeight: 'font-normal',
    className: 'text-[15px] leading-[1.4] tracking-normal font-normal',
  },
  footnote: {
    fontSize: 'text-[13px]',
    lineHeight: 'leading-[1.35]',
    letterSpacing: 'tracking-normal',
    fontWeight: 'font-normal',
    className: 'text-[13px] leading-[1.35] tracking-normal font-normal',
  },
  caption1: {
    fontSize: 'text-[12px]',
    lineHeight: 'leading-[1.33]',
    letterSpacing: 'tracking-normal',
    fontWeight: 'font-normal',
    className: 'text-[12px] leading-[1.33] tracking-normal font-normal',
  },
  caption2: {
    fontSize: 'text-[11px]',
    lineHeight: 'leading-[1.3]',
    letterSpacing: 'tracking-[0.01em]',
    fontWeight: 'font-normal',
    className: 'text-[11px] leading-[1.3] tracking-[0.01em] font-normal',
  },
}

// Font weight utilities
export const fontWeights = {
  thin: 'font-thin',           // 100
  extralight: 'font-extralight', // 200
  light: 'font-light',         // 300
  normal: 'font-normal',       // 400
  medium: 'font-medium',       // 500
  semibold: 'font-semibold',   // 600
  bold: 'font-bold',           // 700
  extrabold: 'font-extrabold', // 800
  black: 'font-black',         // 900
}

// Text color utilities for different contexts
export const textColors = {
  primary: 'text-foreground',
  secondary: 'text-foreground/70',
  tertiary: 'text-foreground/50',
  disabled: 'text-foreground/30',
  link: 'text-blue-600 dark:text-blue-400',
  error: 'text-red-600 dark:text-red-400',
  success: 'text-green-600 dark:text-green-400',
  warning: 'text-amber-600 dark:text-amber-400',
  info: 'text-blue-600 dark:text-blue-400',
}

// Text alignment utilities
export const textAlign = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
  justify: 'text-justify',
}

// Text decoration utilities
export const textDecoration = {
  underline: 'underline',
  'line-through': 'line-through',
  'no-underline': 'no-underline',
}

// Text transform utilities
export const textTransform = {
  uppercase: 'uppercase',
  lowercase: 'lowercase',
  capitalize: 'capitalize',
  'normal-case': 'normal-case',
}

// Truncation utilities
export const textTruncate = {
  truncate: 'truncate',
  'line-clamp-1': 'line-clamp-1',
  'line-clamp-2': 'line-clamp-2',
  'line-clamp-3': 'line-clamp-3',
  'line-clamp-4': 'line-clamp-4',
  'line-clamp-5': 'line-clamp-5',
  'line-clamp-6': 'line-clamp-6',
}

// Helper function to create responsive text
export function responsiveText(
  mobile: string,
  tablet?: string,
  desktop?: string
): string {
  const classes = [mobile]
  if (tablet) classes.push(`md:${tablet}`)
  if (desktop) classes.push(`lg:${desktop}`)
  return classes.join(' ')
}

// Typography presets for common use cases
export const typographyPresets = {
  // Page headers
  pageTitle: 'text-[32px] md:text-[48px] lg:text-[64px] font-bold tracking-[-0.02em] leading-[1.1]',
  sectionTitle: 'text-[24px] md:text-[32px] lg:text-[40px] font-semibold tracking-[-0.015em] leading-[1.15]',
  
  // Content
  articleBody: 'text-[17px] leading-[1.6] tracking-[-0.001em] font-normal text-foreground/90',
  quote: 'text-[19px] md:text-[21px] leading-[1.4] tracking-[-0.003em] font-light italic text-foreground/80',
  
  // UI Elements
  buttonText: 'text-[15px] font-medium tracking-[-0.001em]',
  labelText: 'text-[13px] font-medium tracking-normal',
  helperText: 'text-[12px] font-normal tracking-normal text-foreground/60',
  errorText: 'text-[12px] font-normal tracking-normal text-red-600 dark:text-red-400',
  
  // Navigation
  navLink: 'text-[15px] font-medium tracking-[-0.001em] hover:text-primary transition-colors',
  navLinkActive: 'text-[15px] font-semibold tracking-[-0.001em] text-primary',
  
  // Cards and lists
  cardTitle: 'text-[19px] font-semibold tracking-[-0.003em]',
  cardDescription: 'text-[15px] font-normal tracking-normal text-foreground/70',
  listItem: 'text-[15px] font-normal tracking-normal leading-[1.5]',
  
  // Badges and tags
  badge: 'text-[11px] font-medium tracking-[0.01em] uppercase',
  tag: 'text-[12px] font-normal tracking-normal',
  
  // Tables
  tableHeader: 'text-[13px] font-semibold tracking-[0.01em] uppercase',
  tableCell: 'text-[14px] font-normal tracking-normal',
  
  // Code
  code: 'text-[14px] font-mono tracking-normal',
  codeBlock: 'text-[13px] font-mono leading-[1.5] tracking-normal',
}

// Dynamic font size generator based on viewport
export function dynamicFontSize(
  basePx: number,
  scaleRatio: number = 1.125
): string {
  const mobile = basePx
  const tablet = Math.round(basePx * scaleRatio)
  const desktop = Math.round(basePx * scaleRatio * scaleRatio)
  
  return `text-[${mobile}px] md:text-[${tablet}px] lg:text-[${desktop}px]`
}

// Accessibility font size adjustments
export const a11yFontSizes = {
  default: '',
  large: 'text-[110%]',
  xlarge: 'text-[120%]',
  xxlarge: 'text-[130%]',
}

// High contrast mode support
export const highContrast = {
  enable: 'contrast-more:font-medium contrast-more:tracking-wide',
  text: 'contrast-more:text-foreground contrast-more:font-medium',
  link: 'contrast-more:underline contrast-more:text-blue-700 dark:contrast-more:text-blue-300',
}

// Export complete typography system
export const typographySystem = {
  scale: typography,
  weights: fontWeights,
  colors: textColors,
  align: textAlign,
  decoration: textDecoration,
  transform: textTransform,
  truncate: textTruncate,
  presets: typographyPresets,
  a11y: a11yFontSizes,
  contrast: highContrast,
}
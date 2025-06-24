import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import Home from './page'

// Mock Next.js Image component
interface MockImageProps {
  src: string
  alt: string
  width: string | number
  height: string | number
  priority?: boolean
  className?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

vi.mock('next/image', () => ({
  default: ({ src, alt, width, height, priority, className, ...props }: MockImageProps) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      data-priority={priority}
      {...props}
    />
  ),
}))

describe('Home Page', () => {
  it('should render the main heading structure', () => {
    const { container } = render(<Home />)
    
    // Check for main grid layout
    const gridContainer = container.querySelector('.grid.grid-rows-\\[20px_1fr_20px\\]')
    expect(gridContainer).toBeInTheDocument()
  })

  it('should render Next.js logo', () => {
    const { getByAltText } = render(<Home />)
    
    const logo = getByAltText('Next.js logo')
    expect(logo).toBeInTheDocument()
    expect(logo).toHaveAttribute('src', '/next.svg')
    expect(logo).toHaveAttribute('width', '180')
    expect(logo).toHaveAttribute('height', '38')
    expect(logo).toHaveAttribute('data-priority', 'true')
  })

  it('should render instructions list', () => {
    const { getByText } = render(<Home />)
    
    expect(getByText(/Get started by editing/)).toBeInTheDocument()
    expect(getByText('app/page.tsx')).toBeInTheDocument()
    expect(getByText('Save and see your changes instantly.')).toBeInTheDocument()
  })

  it('should render code element with correct styling', () => {
    const { getByText } = render(<Home />)
    
    const codeElement = getByText('app/page.tsx')
    expect(codeElement.tagName).toBe('CODE')
    expect(codeElement).toHaveClass('bg-black/[.05]')
    expect(codeElement).toHaveClass('dark:bg-white/[.06]')
    expect(codeElement).toHaveClass('px-1')
    expect(codeElement).toHaveClass('py-0.5')
    expect(codeElement).toHaveClass('rounded')
  })

  it('should render Deploy button with correct attributes', () => {
    const { getByText } = render(<Home />)
    
    const deployButton = getByText('Deploy now').closest('a')
    expect(deployButton).toBeInTheDocument()
    expect(deployButton).toHaveAttribute('href', 'https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app')
    expect(deployButton).toHaveAttribute('target', '_blank')
    expect(deployButton).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('should render Read docs button with correct attributes', () => {
    const { getByText } = render(<Home />)
    
    const docsButton = getByText('Read our docs').closest('a')
    expect(docsButton).toBeInTheDocument()
    expect(docsButton).toHaveAttribute('href', 'https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app')
    expect(docsButton).toHaveAttribute('target', '_blank')
    expect(docsButton).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('should render Vercel logo in deploy button', () => {
    const { getByAltText } = render(<Home />)
    
    const vercelLogo = getByAltText('Vercel logomark')
    expect(vercelLogo).toBeInTheDocument()
    expect(vercelLogo).toHaveAttribute('src', '/vercel.svg')
    expect(vercelLogo).toHaveAttribute('width', '20')
    expect(vercelLogo).toHaveAttribute('height', '20')
  })

  it('should render footer links', () => {
    const { getByText } = render(<Home />)
    
    const learnLink = getByText('Learn').closest('a')
    const examplesLink = getByText('Examples').closest('a')
    const nextjsLink = getByText('Go to nextjs.org →').closest('a')
    
    expect(learnLink).toHaveAttribute('href', 'https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app')
    expect(examplesLink).toHaveAttribute('href', 'https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app')
    expect(nextjsLink).toHaveAttribute('href', 'https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app')
  })

  it('should render footer icons', () => {
    const { getByAltText } = render(<Home />)
    
    const fileIcon = getByAltText('File icon')
    const windowIcon = getByAltText('Window icon')
    const globeIcon = getByAltText('Globe icon')
    
    expect(fileIcon).toHaveAttribute('src', '/file.svg')
    expect(windowIcon).toHaveAttribute('src', '/window.svg')
    expect(globeIcon).toHaveAttribute('src', '/globe.svg')
    
    // All footer icons should be 16x16
    expect(fileIcon).toHaveAttribute('width', '16')
    expect(fileIcon).toHaveAttribute('height', '16')
    expect(windowIcon).toHaveAttribute('width', '16')
    expect(windowIcon).toHaveAttribute('height', '16')
    expect(globeIcon).toHaveAttribute('width', '16')
    expect(globeIcon).toHaveAttribute('height', '16')
  })

  it('should have proper semantic structure', () => {
    const { getByRole, container } = render(<Home />)
    
    // Should have main content area
    const main = getByRole('main')
    expect(main).toBeInTheDocument()
    expect(main).toHaveClass('flex', 'flex-col', 'gap-[32px]')
    
    // Should have content info (footer)
    const footer = container.querySelector('footer')
    expect(footer).toBeInTheDocument()
  })

  it('should have responsive design classes', () => {
    const { container } = render(<Home />)
    
    const mainContainer = container.firstChild as HTMLElement
    expect(mainContainer).toHaveClass('min-h-screen')
    expect(mainContainer).toHaveClass('p-8')
    expect(mainContainer).toHaveClass('sm:p-20')
    
    const main = container.querySelector('main')
    expect(main).toHaveClass('sm:items-start')
  })

  it('should have proper button styling', () => {
    const { getByText } = render(<Home />)
    
    const deployButton = getByText('Deploy now').closest('a')
    const docsButton = getByText('Read our docs').closest('a')
    
    // Both buttons should have rounded-full class
    expect(deployButton).toHaveClass('rounded-full')
    expect(docsButton).toHaveClass('rounded-full')
    
    // Deploy button should have primary styling
    expect(deployButton).toHaveClass('bg-foreground', 'text-background')
    
    // Docs button should have secondary styling  
    expect(docsButton).toHaveClass('border-black/[.08]')
  })

  it('should have proper accessibility attributes', () => {
    const { getAllByRole } = render(<Home />)
    
    // All links should be accessible
    const links = getAllByRole('link')
    expect(links.length).toBeGreaterThan(0)
    
    links.forEach(link => {
      expect(link).toHaveAttribute('href')
    })
    
    // External links should have proper rel attribute
    const externalLinks = links.filter(link => 
      link.getAttribute('href')?.startsWith('http')
    )
    
    externalLinks.forEach(link => {
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
      expect(link).toHaveAttribute('target', '_blank')
    })
  })

  it('should render ordered list correctly', () => {
    const { container } = render(<Home />)
    
    const orderedList = container.querySelector('ol')
    expect(orderedList).toBeInTheDocument()
    expect(orderedList).toHaveClass('list-inside', 'list-decimal')
    
    const listItems = orderedList?.querySelectorAll('li')
    expect(listItems).toHaveLength(2)
  })

  it('should have dark mode classes', () => {
    const { getByAltText, container } = render(<Home />)
    
    // Next.js logo should have dark:invert
    const nextLogo = getByAltText('Next.js logo')
    expect(nextLogo).toHaveClass('dark:invert')
    
    // Vercel logo should have dark:invert
    const vercelLogo = getByAltText('Vercel logomark')
    expect(vercelLogo).toHaveClass('dark:invert')
    
    // Code element should have dark mode background
    const codeElement = container.querySelector('code')
    expect(codeElement).toHaveClass('dark:bg-white/[.06]')
  })
})
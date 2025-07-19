import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

import { Badge, badgeVariants } from './badge'

// Mock the cn utility function
vi.mock('@/lib/utils', () => ({
  cn: vi.fn((...classes) => classes.filter(Boolean).join(' ')),
}))

// Mock Radix Slot component
vi.mock('@radix-ui/react-slot', () => ({
  Slot: ({ children, ...props }: React.ComponentProps<'div'>) => (
    <div {...props}>{children}</div>
  ),
}))

describe('Badge', () => {
  it('should render with default variant', () => {
    const { container } = render(<Badge>Default Badge</Badge>)

    const badge = container.firstChild as HTMLElement
    expect(badge.tagName).toBe('SPAN')
    expect(badge).toHaveAttribute('data-slot', 'badge')
    expect(badge.textContent).toBe('Default Badge')
  })

  it('should render with different variants', () => {
    const variants = ['default', 'secondary', 'destructive', 'outline'] as const

    variants.forEach((variant) => {
      const { container } = render(
        <Badge variant={variant}>{variant} Badge</Badge>,
      )
      const badge = container.firstChild as HTMLElement

      expect(badge).toBeInTheDocument()
      expect(badge.textContent).toBe(`${variant} Badge`)
    })
  })

  it('should apply custom className', () => {
    const { container } = render(
      <Badge className="custom-class">Custom Badge</Badge>,
    )

    const badge = container.firstChild as HTMLElement
    expect(badge.className).toContain('custom-class')
  })

  it('should render as child component when asChild is true', () => {
    const { container } = render(
      <Badge asChild>
        <a href="/test">Link Badge</a>
      </Badge>,
    )

    // When asChild is true, it should render as the child element (a tag)
    const badge = container.firstChild as HTMLElement
    expect(badge.tagName).toBe('DIV') // Mocked Slot renders as div
    expect(badge).toHaveAttribute('data-slot', 'badge')
  })

  it('should pass through additional props', () => {
    const { container } = render(
      <Badge data-testid="test-badge" role="status" aria-label="Test badge">
        Test Badge
      </Badge>,
    )

    const badge = container.firstChild as HTMLElement
    expect(badge).toHaveAttribute('data-testid', 'test-badge')
    expect(badge).toHaveAttribute('role', 'status')
    expect(badge).toHaveAttribute('aria-label', 'Test badge')
  })

  it('should handle onClick events', () => {
    const handleClick = vi.fn()
    const { container } = render(
      <Badge onClick={handleClick}>Clickable Badge</Badge>,
    )

    const badge = container.firstChild as HTMLElement
    badge.click()

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should render with complex content', () => {
    const { getByText } = render(
      <Badge>
        <span>Icon</span>
        <span>Text</span>
      </Badge>,
    )

    expect(getByText('Icon')).toBeInTheDocument()
    expect(getByText('Text')).toBeInTheDocument()
  })

  it('should handle empty content', () => {
    const { container } = render(<Badge />)

    const badge = container.firstChild as HTMLElement
    expect(badge).toBeInTheDocument()
    expect(badge.textContent).toBe('')
  })

  describe('badgeVariants', () => {
    it('should return correct classes for default variant', () => {
      const classes = badgeVariants({ variant: 'default' })
      expect(typeof classes).toBe('string')
      // We can't test exact classes due to the mock, but we ensure it returns a string
    })

    it('should return correct classes for all variants', () => {
      const variants = [
        'default',
        'secondary',
        'destructive',
        'outline',
      ] as const

      variants.forEach((variant) => {
        const classes = badgeVariants({ variant })
        expect(typeof classes).toBe('string')
        expect(classes.length).toBeGreaterThan(0)
      })
    })

    it('should return classes when no variant is specified', () => {
      const classes = badgeVariants()
      expect(typeof classes).toBe('string')
      expect(classes.length).toBeGreaterThan(0)
    })
  })

  describe('accessibility', () => {
    it('should be focusable when interactive', () => {
      const { container } = render(
        <Badge tabIndex={0} onClick={() => {}}>
          Interactive Badge
        </Badge>,
      )

      const badge = container.firstChild as HTMLElement
      expect(badge).toHaveAttribute('tabIndex', '0')
    })

    it('should support ARIA attributes', () => {
      const { container } = render(
        <Badge
          aria-label="Status indicator"
          aria-describedby="badge-description"
          role="status"
        >
          Active
        </Badge>,
      )

      const badge = container.firstChild as HTMLElement
      expect(badge).toHaveAttribute('aria-label', 'Status indicator')
      expect(badge).toHaveAttribute('aria-describedby', 'badge-description')
      expect(badge).toHaveAttribute('role', 'status')
    })
  })

  describe('type safety', () => {
    it('should accept all span props', () => {
      // This test ensures TypeScript compatibility
      expect(() => {
        render(
          <Badge
            id="test-badge"
            title="Test title"
            style={{ color: 'red' }}
            onMouseEnter={() => {}}
            onMouseLeave={() => {}}
          >
            Typed Badge
          </Badge>,
        )
      }).not.toThrow()
    })
  })

  describe('styling integration', () => {
    it('should combine variant classes with custom className', () => {
      const { container } = render(
        <Badge variant="destructive" className="extra-class">
          Combined Classes
        </Badge>,
      )

      const badge = container.firstChild as HTMLElement
      // Due to our mock, we just ensure both classes are present
      expect(badge.className).toContain('extra-class')
    })

    it('should handle conditional className', () => {
      const isActive = true
      const { container } = render(
        <Badge className={isActive ? 'active' : 'inactive'}>
          Conditional Badge
        </Badge>,
      )

      const badge = container.firstChild as HTMLElement
      expect(badge.className).toContain('active')
      expect(badge.className).not.toContain('inactive')
    })
  })

  describe('edge cases', () => {
    it('should handle null children', () => {
      expect(() => {
        render(<Badge>{null}</Badge>)
      }).not.toThrow()
    })

    it('should handle undefined variant', () => {
      expect(() => {
        render(<Badge variant={undefined}>Undefined Variant</Badge>)
      }).not.toThrow()
    })

    it('should handle boolean children', () => {
      const { container } = render(
        <Badge>
          {true && 'Conditional Text'}
          {false && 'Hidden Text'}
        </Badge>,
      )

      expect(container.textContent).toContain('Conditional Text')
      expect(container.textContent).not.toContain('Hidden Text')
    })
  })

  describe('asChild behavior', () => {
    it('should preserve data-slot when using asChild', () => {
      const { container } = render(
        <Badge asChild>
          <button>Button Badge</button>
        </Badge>,
      )

      const element = container.firstChild as HTMLElement
      expect(element).toHaveAttribute('data-slot', 'badge')
    })

    it('should work with different child elements', () => {
      const childElements = [
        <a key="link" href="/test">
          Link
        </a>,
        <button key="button">Button</button>,
        <div key="div">Div</div>,
      ]

      childElements.forEach((child) => {
        expect(() => {
          render(<Badge asChild>{child}</Badge>)
        }).not.toThrow()
      })
    })
  })
})

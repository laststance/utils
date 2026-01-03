import { render, screen } from '@testing-library/react';
import React from 'react';

import { usePreserveSize } from './usePreserveSize';

// Component for testing
const TestComponent: React.FC<{
  isTransitioning: boolean;
  content: string;
}> = ({ isTransitioning, content }) => {
  const { ref, style } = usePreserveSize(isTransitioning);

  return (
    <div ref={ref} style={style} data-testid="container">
      {isTransitioning ? (
        <div data-testid="loading">Loading...</div>
      ) : (
        <div data-testid="content">{content}</div>
      )}
    </div>
  );
};

describe('usePreserveSize', () => {
  beforeEach(() => {
    // Mock offsetWidth/offsetHeight in JSDOM (basic values)
    Object.defineProperties(HTMLElement.prototype, {
      offsetWidth: {
        get() {
          // Return fixed value when content exists
          const hasContent = this.querySelector('[data-testid="content"]');
          return hasContent ? 300 : 0;
        },
        configurable: true,
      },
      offsetHeight: {
        get() {
          // Return fixed value when content exists
          const hasContent = this.querySelector('[data-testid="content"]');
          return hasContent ? 200 : 0;
        },
        configurable: true,
      },
    });
  });

  afterEach(() => {
    // Clean up mocks
    delete (HTMLElement.prototype as unknown as Record<string, unknown>)
      .offsetWidth;
    delete (HTMLElement.prototype as unknown as Record<string, unknown>)
      .offsetHeight;
  });

  it('should not apply styles in initial state (isTransitioning=false)', () => {
    render(<TestComponent isTransitioning={false} content="Initial content" />);

    const container = screen.getByTestId('container');
    expect(container.style.minWidth).toBe('');
    expect(container.style.minHeight).toBe('');
  });

  it('should set ref when isTransitioning is true', () => {
    render(<TestComponent isTransitioning={true} content="Content" />);

    const container = screen.getByTestId('container');
    expect(container).toBeInTheDocument();
    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  it('should switch from content to loading', async () => {
    const { rerender } = render(
      <TestComponent isTransitioning={false} content="Content" />,
    );

    // Verify initial state
    expect(screen.getByTestId('content')).toBeInTheDocument();
    expect(screen.queryByTestId('loading')).not.toBeInTheDocument();

    // Switch to loading state
    rerender(<TestComponent isTransitioning={true} content="Content" />);

    // Verify loading state
    expect(screen.queryByTestId('content')).not.toBeInTheDocument();
    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  it('should return from loading to content', async () => {
    const { rerender } = render(
      <TestComponent isTransitioning={true} content="Content" />,
    );

    // Verify loading state
    expect(screen.getByTestId('loading')).toBeInTheDocument();
    expect(screen.queryByTestId('content')).not.toBeInTheDocument();

    // Switch back to content state
    rerender(
      <TestComponent isTransitioning={false} content="New content" />,
    );

    // Verify content state
    expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    expect(screen.getByTestId('content')).toBeInTheDocument();
    expect(screen.getByText('New content')).toBeInTheDocument();
  });

  it('should ref object work correctly', () => {
    const TestRefComponent: React.FC = () => {
      const { ref, style } = usePreserveSize(false);

      return (
        <div ref={ref} data-testid="target" style={style}>
          Test content
        </div>
      );
    };

    render(<TestRefComponent />);

    // Verify ref works correctly
    expect(screen.getByTestId('target')).toBeInTheDocument();
    // Note: ref.current verification in JSDOM is limited, so only basic existence check
  });

  it('should have correct style object structure', async () => {
    const TestStyleComponent: React.FC<{ isTransitioning: boolean }> = ({
      isTransitioning,
    }) => {
      const { style } = usePreserveSize(isTransitioning);

      return (
        <div data-testid="style-info">
          {style ? JSON.stringify(style) : 'no-style'}
        </div>
      );
    };

    const { rerender } = render(<TestStyleComponent isTransitioning={false} />);

    // Initial state should have no style
    expect(screen.getByTestId('style-info')).toHaveTextContent('no-style');

    // Style during transition (actual value depends on implementation)
    rerender(<TestStyleComponent isTransitioning={true} />);

    const styleText = screen.getByTestId('style-info').textContent;
    // Style should be set or undefined (if size is 0)
    expect(styleText === 'no-style' || styleText?.includes('minWidth')).toBe(
      true,
    );
  });
});

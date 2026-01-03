import { useRef, useLayoutEffect, useState } from 'react';

interface PreservedSize {
  width?: number;
  height?: number;
}

/**
 * Hook that preserves the previous size when content changes and prevents layout shift.
 *
 * @param isTransitioning - Whether data is transitioning (e.g., isFetching)
 * @returns
 * - ref: ref to attach to the element to measure
 * - style: styles to apply during transition (minWidth, minHeight)
 *
 * @example
 * ```tsx
 * const { data, isFetching } = useQuery();
 * const { ref, style } = usePreserveSize(isFetching);
 *
 * return (
 *   <div ref={ref} style={style}>
 *     {isFetching ? <Spinner /> : <Content data={data} />}
 *   </div>
 * );
 * ```
 */
export function usePreserveSize(isTransitioning: boolean) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [minSize, setMinSize] = useState<PreservedSize>({});

  // Use useLayoutEffect to measure size before browser repaints.
  // Follows React official documentation recommendation for layout measurements.
  useLayoutEffect(() => {
    if (!containerRef.current) return;

    // Measure size when not transitioning (when content is stable).
    if (!isTransitioning) {
      const { offsetWidth, offsetHeight } = containerRef.current;
      if (offsetWidth > 0 || offsetHeight > 0) {
        setMinSize({
          width: offsetWidth,
          height: offsetHeight,
        });
      }
    }
  }, [isTransitioning]);

  return {
    ref: containerRef,
    style:
      isTransitioning && (minSize.width || minSize.height)
        ? {
            minWidth: minSize.width,
            minHeight: minSize.height,
          }
        : undefined,
  };
}

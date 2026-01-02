import { useRef, useLayoutEffect, useState } from 'react';

interface PreservedSize {
  width?: number;
  height?: number;
}

/**
 * コンテンツが変更される際に前のサイズを保持し、レイアウトシフトを防ぐフック
 *
 * @param isTransitioning - データの遷移中かどうか（例：isFetching）
 * @returns
 * - ref: 測定対象の要素に設定するref
 * - style: 遷移中に適用するスタイル（minWidth, minHeight）
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

  // useLayoutEffectを使用して、ブラウザが再描画する前にサイズを測定
  // React公式ドキュメントの推奨パターンに従い、レイアウト測定に特化
  useLayoutEffect(() => {
    if (!containerRef.current) return;

    // 遷移中でない場合（コンテンツが安定している時）にサイズを測定
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

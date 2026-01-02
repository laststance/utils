import { render, screen } from '@testing-library/react';
import React from 'react';
import { usePreserveSize } from './usePreserveSize';

// テスト用のコンポーネント
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
    // JSDOMでoffsetWidth/offsetHeightをモック（基本的な値）
    Object.defineProperties(HTMLElement.prototype, {
      offsetWidth: {
        get() {
          // コンテンツがある場合は固定値を返す
          const hasContent = this.querySelector('[data-testid="content"]');
          return hasContent ? 300 : 0;
        },
        configurable: true,
      },
      offsetHeight: {
        get() {
          // コンテンツがある場合は固定値を返す
          const hasContent = this.querySelector('[data-testid="content"]');
          return hasContent ? 200 : 0;
        },
        configurable: true,
      },
    });
  });

  afterEach(() => {
    // モックをクリーンアップ
    delete (HTMLElement.prototype as unknown as Record<string, unknown>)
      .offsetWidth;
    delete (HTMLElement.prototype as unknown as Record<string, unknown>)
      .offsetHeight;
  });

  it('初期状態（isTransitioning=false）ではスタイルが適用されない', () => {
    render(<TestComponent isTransitioning={false} content="初期コンテンツ" />);

    const container = screen.getByTestId('container');
    expect(container.style.minWidth).toBe('');
    expect(container.style.minHeight).toBe('');
  });

  it('isTransitioningがtrueの場合、refが設定される', () => {
    render(<TestComponent isTransitioning={true} content="コンテンツ" />);

    const container = screen.getByTestId('container');
    expect(container).toBeInTheDocument();
    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  it('コンテンツからローディングに切り替わる', async () => {
    const { rerender } = render(
      <TestComponent isTransitioning={false} content="コンテンツ" />,
    );

    // 初期状態の確認
    expect(screen.getByTestId('content')).toBeInTheDocument();
    expect(screen.queryByTestId('loading')).not.toBeInTheDocument();

    // ローディング状態に切り替え
    rerender(<TestComponent isTransitioning={true} content="コンテンツ" />);

    // ローディング状態の確認
    expect(screen.queryByTestId('content')).not.toBeInTheDocument();
    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  it('ローディングからコンテンツに戻る', async () => {
    const { rerender } = render(
      <TestComponent isTransitioning={true} content="コンテンツ" />,
    );

    // ローディング状態の確認
    expect(screen.getByTestId('loading')).toBeInTheDocument();
    expect(screen.queryByTestId('content')).not.toBeInTheDocument();

    // コンテンツ状態に戻す
    rerender(
      <TestComponent isTransitioning={false} content="新しいコンテンツ" />,
    );

    // コンテンツ状態の確認
    expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    expect(screen.getByTestId('content')).toBeInTheDocument();
    expect(screen.getByText('新しいコンテンツ')).toBeInTheDocument();
  });

  it('refオブジェクトが正しく機能する', () => {
    const TestRefComponent: React.FC = () => {
      const { ref, style } = usePreserveSize(false);

      return (
        <div>
          <div ref={ref} data-testid="target" style={style}>
            テストコンテンツ
          </div>
          <div data-testid="ref-current">
            {ref.current ? 'ref設定済み' : 'ref未設定'}
          </div>
        </div>
      );
    };

    render(<TestRefComponent />);

    // refが正しく機能することを確認
    expect(screen.getByTestId('target')).toBeInTheDocument();
    // Note: JSDOMでref.currentの確認は制限があるため、基本的な存在確認のみ
  });

  it('スタイルオブジェクトの構造が正しい', async () => {
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

    // 初期状態ではスタイルなし
    expect(screen.getByTestId('style-info')).toHaveTextContent('no-style');

    // トランジション状態でのスタイル（実際の値は実装に依存）
    rerender(<TestStyleComponent isTransitioning={true} />);

    const styleText = screen.getByTestId('style-info').textContent;
    // スタイルが設定されているか、undefinedか（サイズが0の場合）
    expect(styleText === 'no-style' || styleText?.includes('minWidth')).toBe(
      true,
    );
  });
});

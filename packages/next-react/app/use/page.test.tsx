import { render } from '@testing-library/react'

import UseStudyPage from './page'

vi.mock('./use-study-demo', () => ({
  UseStudyDemo: () => <div>Mock use study demo</div>,
}))

describe('Use Study Page', () => {
  it('should render the learning page heading and summary', () => {
    const { getByText } = render(<UseStudyPage />)

    expect(getByText('Learn React `use()`')).toBeInTheDocument()
    expect(
      getByText(/This page focuses on two practical uses of React `use\(\)`/),
    ).toBeInTheDocument()
  })

  it('should render official docs and home links', () => {
    const { getByText } = render(<UseStudyPage />)

    const homeLink = getByText('Back to home').closest('a')
    const docsLink = getByText('Open official docs').closest('a')

    expect(homeLink).toHaveAttribute('href', '/')
    expect(docsLink).toHaveAttribute(
      'href',
      'https://react.dev/reference/react/use',
    )
    expect(docsLink).toHaveAttribute('target', '_blank')
    expect(docsLink).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('should render study sections and demo placeholder', () => {
    const { getByText } = render(<UseStudyPage />)

    expect(getByText('Interactive demo')).toBeInTheDocument()
    expect(getByText('Promise pattern')).toBeInTheDocument()
    expect(getByText('Conditional context pattern')).toBeInTheDocument()
    expect(getByText('Practice ideas')).toBeInTheDocument()
    expect(getByText('Mock use study demo')).toBeInTheDocument()
  })
})

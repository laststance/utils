import '@testing-library/jest-dom'
import { render } from '@testing-library/react'

import { LoadingOverlay } from './LoadingOverlay.js'

test('renders', () => {
  const { getByRole } = render(<LoadingOverlay isLoading={true} />)

  const loadingElement = getByRole('status', { name: 'Loading content' })
  expect(loadingElement).toBeInTheDocument()
})

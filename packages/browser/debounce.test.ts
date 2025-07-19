import { debounce } from './debounce.js'

test('debounce', () => {
  vi.useFakeTimers()
  const mockFn = vi.fn()
  const event = new Event('event')

  const debouncedFn = debounce(300, mockFn)

  debouncedFn(event)
  // before advance timer 300ms
  expect(mockFn).not.toBeCalled()

  vi.advanceTimersByTime(300)
  expect(mockFn).toBeCalledWith(event)
  vi.resetAllMocks()

  debouncedFn(event)
  debouncedFn(event)
  debouncedFn(event)
  expect(mockFn).not.toBeCalled()

  vi.advanceTimersByTime(300)
  expect(mockFn).toBeCalledWith(event)
})

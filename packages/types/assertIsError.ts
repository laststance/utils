class AssertionError extends Error {
  override name = 'AssertionError'
}

/**
 * Asserts that a given value is an instance of {@link Error}.
 *
 * @param error - The value to check.
 * @throws {AssertionError} If {@link error} is not an instance of {@link Error}.
 */
export function assertIsError<T extends Error>(
  error: unknown,
): asserts error is T {
  if (error instanceof Error === false) {
    throw new AssertionError(
      `Expected 'error' to be Error, but received ${error}`,
    )
  }
}

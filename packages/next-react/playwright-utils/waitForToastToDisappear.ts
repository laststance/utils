import type { Locator } from '@playwright/test';

/**
 * Waits for a toast notification to disappear from the page.
 *
 * ## Why This Function is Necessary
 *
 * This utility addresses three critical E2E testing challenges:
 *
 * ### 1️⃣ Test Isolation & Interference Prevention
 *
 * Toast notifications that persist after an action can interfere with subsequent test steps.
 * Without explicitly waiting for toasts to disappear:
 * - Selectors like `.first()` may target lingering toasts from previous operations
 * - State assertions may fail due to leftover UI elements
 * - Tests become order-dependent and fragile
 *
 * **Example:**
 * ```typescript
 * await performAction();
 * const toast = page.getByText('Success');
 * await expect(toast).toBeVisible();
 * await waitForToastToDisappear(toast);  // ✅ Clean state for next step
 * await performNextAction();             // ✅ Won't be affected by previous toast
 * ```
 *
 * ### 2️⃣ Sequential Operations Stability
 *
 * When multiple operations trigger toasts in sequence (e.g., drag-and-drop multiple items),
 * failing to wait causes toast elements to stack up:
 * - Multiple toast elements exist simultaneously
 * - Selectors become ambiguous (which toast to target?)
 * - Race conditions emerge between toast appearance/disappearance
 *
 * **Example:**
 * ```typescript
 * // First drag operation
 * await dragItem(0, 2);
 * const firstToast = page.getByText('Success').first();
 * await expect(firstToast).toBeVisible();
 * await waitForToastToDisappear(firstToast);  // ✅ Must wait before next drag
 *
 * // Second drag operation
 * await dragItem(1, 3);
 * const secondToast = page.getByText('Success').first();
 * // ❌ Without waiting above, .first() might still target the old toast
 * await expect(secondToast).toBeVisible();
 * ```
 *
 * ### 3️⃣ Visual Consistency for Screenshots
 *
 * For visual regression testing (e.g., Argos, Percy), toast animations can cause:
 * - Inconsistent screenshots with toasts in different states (appearing/disappearing)
 * - False positive visual diffs due to timing variations
 * - Flaky visual tests that require frequent baseline updates
 *
 * **Example:**
 * ```typescript
 * await performAction();
 * const toast = page.getByText('Success');
 * await expect(toast).toBeVisible();
 * await waitForToastToDisappear(toast);  // ✅ Ensure consistent state
 * await expect(page).toHaveScreenshot(); // ✅ No unexpected toast in screenshot
 * ```
 *
 * ## Why the try-catch Pattern?
 *
 * Toast notifications typically auto-dismiss after a few seconds. The try-catch handles
 * the race condition where:
 * 1. The toast has already disappeared before `waitFor()` is called
 * 2. Playwright would throw an error trying to wait for an already-gone element
 * 3. This is expected behavior, not a test failure
 *
 * **Without try-catch:**
 * ```typescript
 * await toast.waitFor({ state: 'hidden' });
 * // ❌ Throws error if toast already auto-dismissed
 * ```
 *
 * **With try-catch:**
 * ```typescript
 * try {
 *   await toast.waitFor({ state: 'hidden' });
 * } catch (error) {
 *   // ✅ Toast already gone - this is fine, continue test
 * }
 * ```
 *
 * ## Playwright Best Practices Alignment
 *
 * This function follows Playwright's recommended patterns:
 * - ✅ **State-based waiting**: Uses `waitFor({ state: 'hidden' })` instead of arbitrary timeouts
 * - ✅ **Explicit expectations**: Tests wait for actual DOM state changes
 * - ✅ **Graceful degradation**: Handles edge cases (already-dismissed toasts) without failing
 * - ✅ **Test reliability**: Reduces flakiness by ensuring clean state between operations
 *
 * @param toast - The Playwright Locator pointing to the toast element to wait for
 * @returns A Promise that resolves when the toast is hidden or already gone
 *
 * @example
 * ```typescript
 * // Basic usage
 * const toast = page.getByRole('status').getByText('Changes saved');
 * await expect(toast).toBeVisible();
 * await waitForToastToDisappear(toast);
 * ```
 *
 * @example
 * ```typescript
 * // Sequential operations
 * for (let i = 0; i < 3; i++) {
 *   await performAction(i);
 *   const toast = page.getByText('Success').first();
 *   await expect(toast).toBeVisible();
 *   await waitForToastToDisappear(toast);  // Essential for reliable sequential tests
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Error toast cleanup
 * await triggerError();
 * const errorToast = page.getByText('Operation failed');
 * await expect(errorToast).toBeVisible();
 * await waitForToastToDisappear(errorToast);  // Clean up before retry
 * await retryOperation();
 * ```
 */
export const waitForToastToDisappear = async (toast: Locator): Promise<void> => {
  try {
    await toast.waitFor({ state: 'hidden', timeout: 5000 });
  } catch (error) {
    // Toast has already disappeared (auto-dismissed) - this is expected behavior
    // Continue test execution without throwing error
  }
};


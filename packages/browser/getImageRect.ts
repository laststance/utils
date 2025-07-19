/**
 * Gets the natural dimensions (width and height) of an image from a URL.
 * Loads the image and returns its original dimensions before any scaling.
 *
 * @param url - The URL of the image to measure
 * @returns Promise that resolves with the image dimensions
 *
 * @example
 * ```typescript
 * const dimensions = await getImageRect('https://example.com/image.jpg')
 * console.log(dimensions) // { height: 600, width: 800 }
 *
 * try {
 *   const { width, height } = await getImageRect('/assets/photo.png')
 *   console.log(`Image is ${width}x${height} pixels`)
 * } catch (error) {
 *   console.error('Failed to load image:', error)
 * }
 * ```
 */
export async function getImageRect(
  url: string,
): Promise<{ height: number; width: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image()

    img.addEventListener('load', () => {
      resolve({ height: img.naturalHeight, width: img.naturalWidth })
    })

    img.addEventListener('error', reject)

    img.src = url
  })
}

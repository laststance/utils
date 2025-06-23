/**
 * Fetches an image from a URL and returns it as a blob.
 * Uses fetch with no-cors mode to handle cross-origin images.
 * 
 * @param {string} url - The URL of the image to fetch
 * @returns {Promise<Blob>} Promise that resolves with the image blob
 */
const getImageBlob = async function (url) {
  const response = await fetch(url, { mode: 'no-cors' })
  return response.blob()
}

/**
 * Converts a blob to a base64-encoded data URL.
 * Uses FileReader to read the blob as a data URL.
 * 
 * @param {Blob} blob - The blob to convert
 * @returns {Promise<string>} Promise that resolves with the base64 data URL
 */
const blobToBase64 = async function (blob) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = function () {
      const dataUrl = reader.result
      resolve(dataUrl)
    }
    reader.readAsDataURL(blob)
  })
}

/**
 * Fetches an image from a URL and converts it to a base64-encoded data URL.
 * Combines fetching and base64 conversion in a single function.
 * 
 * @param {string} url - The URL of the image to convert
 * @returns {Promise<string>} Promise that resolves with the base64 data URL
 * 
 * @example
 * ```javascript
 * // Convert an image to base64
 * getBase64Image('http://placekitten.com/g/200/300')
 *   .then(base64Image => console.log(base64Image))
 *   .catch(error => console.error('Failed to convert image:', error))
 * 
 * // Use with async/await
 * async function convertImage() {
 *   try {
 *     const base64 = await getBase64Image('/assets/logo.png')
 *     // base64 is a string like: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA..."
 *     document.getElementById('img').src = base64
 *   } catch (error) {
 *     console.error('Error:', error)
 *   }
 * }
 * ```
 */
export const getBase64Image = async function (url) {
  if (url === null || url === undefined) {
    throw new Error('URL cannot be null or undefined')
  }
  
  const blob = await getImageBlob(url)
  const base64 = await blobToBase64(blob)
  return base64
}

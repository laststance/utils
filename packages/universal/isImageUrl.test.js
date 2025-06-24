import { describe, it, expect } from 'vitest'
import { isImgUrl } from './isImageUrl.js'

describe('isImgUrl', () => {
  it('should return true for valid image URLs with jpg extension', () => {
    expect(isImgUrl('photo.jpg')).toBe(true)
    expect(isImgUrl('image.jpeg')).toBe(true)
    expect(isImgUrl('https://example.com/photo.jpg')).toBe(true)
    expect(isImgUrl('/assets/image.jpeg')).toBe(true)
  })

  it('should return true for valid image URLs with png extension', () => {
    expect(isImgUrl('screenshot.png')).toBe(true)
    expect(isImgUrl('https://cdn.example.com/logo.png')).toBe(true)
    expect(isImgUrl('./images/icon.png')).toBe(true)
  })

  it('should return true for valid image URLs with webp extension', () => {
    expect(isImgUrl('modern-image.webp')).toBe(true)
    expect(isImgUrl('https://example.com/optimized.webp')).toBe(true)
  })

  it('should return true for valid image URLs with avif extension', () => {
    expect(isImgUrl('next-gen.avif')).toBe(true)
    expect(isImgUrl('https://cdn.example.com/compressed.avif')).toBe(true)
  })

  it('should return true for valid image URLs with gif extension', () => {
    expect(isImgUrl('animation.gif')).toBe(true)
    expect(isImgUrl('https://media.example.com/funny.gif')).toBe(true)
  })

  it('should return false for non-image URLs', () => {
    expect(isImgUrl('document.pdf')).toBe(false)
    expect(isImgUrl('video.mp4')).toBe(false)
    expect(isImgUrl('audio.mp3')).toBe(false)
    expect(isImgUrl('script.js')).toBe(false)
    expect(isImgUrl('styles.css')).toBe(false)
    expect(isImgUrl('data.json')).toBe(false)
    expect(isImgUrl('page.html')).toBe(false)
  })

  it('should return false for URLs without extensions', () => {
    expect(isImgUrl('filename')).toBe(false)
    expect(isImgUrl('https://example.com')).toBe(false)
    expect(isImgUrl('https://example.com/path')).toBe(false)
  })

  it('should return false for empty or invalid inputs', () => {
    expect(isImgUrl('')).toBe(false)
    expect(isImgUrl('.')).toBe(false)
    expect(isImgUrl('.jpg')).toBe(false)
  })

  it('should be case sensitive (only lowercase extensions)', () => {
    expect(isImgUrl('image.JPG')).toBe(false)
    expect(isImgUrl('image.PNG')).toBe(false)
    expect(isImgUrl('image.JPEG')).toBe(false)
    expect(isImgUrl('image.GIF')).toBe(false)
  })

  it('should not match extensions in the middle of the URL', () => {
    expect(isImgUrl('image.jpg.backup')).toBe(false)
    expect(isImgUrl('file.png.old')).toBe(false)
    expect(isImgUrl('photo.gif/metadata')).toBe(false)
  })

  it('should handle complex URLs with query parameters and fragments', () => {
    expect(isImgUrl('image.jpg?size=large')).toBe(false) // query params break the regex
    expect(isImgUrl('photo.png#preview')).toBe(false) // fragments break the regex
    expect(isImgUrl('https://example.com/image.webp?v=1')).toBe(false)
  })
})
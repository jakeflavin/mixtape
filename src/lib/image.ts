/*
 * Turns a picked file into a data URL small enough to live inside the link.
 *
 * The link is the document, so artwork has to fit in a URL. The image is
 * drawn onto a canvas at a size no larger than it is ever shown, then
 * encoded as JPEG at descending quality/size steps until it fits the budget
 * codec.ts accepts. JPEG rather than WebP because Safari's canvas cannot
 * encode WebP and silently hands back a PNG many times the size.
 *
 * Browser-only (canvas, createImageBitmap) — exercised by browser checks,
 * not unit tests, since jsdom has neither.
 */

/** Keep comfortably under codec.ts's MAX_DATA_IMAGE so sanitize never drops it. */
const BUDGET = 150_000

const STEPS: { edge: number; quality: number }[] = [
  { edge: 640, quality: 0.72 },
  { edge: 560, quality: 0.62 },
  { edge: 480, quality: 0.55 },
  { edge: 380, quality: 0.5 },
]

export async function shrinkImage(file: File, maxEdge = 640): Promise<string> {
  // from-image applies the EXIF rotation phones bake into portrait shots.
  const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
  try {
    let last = ''
    for (const step of STEPS) {
      const edge = Math.min(step.edge, maxEdge)
      const scale = Math.min(1, edge / Math.max(bitmap.width, bitmap.height))
      const canvas = document.createElement('canvas')
      canvas.width = Math.max(1, Math.round(bitmap.width * scale))
      canvas.height = Math.max(1, Math.round(bitmap.height * scale))
      const context = canvas.getContext('2d')
      if (!context) throw new Error('Canvas is unavailable')
      context.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
      last = canvas.toDataURL('image/jpeg', step.quality)
      if (last.length <= BUDGET) return last
    }
    return last
  } finally {
    bitmap.close()
  }
}

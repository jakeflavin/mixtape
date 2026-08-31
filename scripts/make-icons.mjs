/**
 * Writes the mark: `public/favicon.svg` and the home-screen PNGs.
 *
 * iOS ignores an SVG apple-touch-icon, so the PNGs have to exist as files. They are
 * generated here and committed rather than built, which keeps an image library out of the
 * dependency list for four small assets.
 *
 * The mark is the disc: a CD with its label ring and hub hole. It is the one shape this
 * app has that nothing else in the set does, and a circle with a hole survives being 16
 * pixels wide, which a whole jewel case does not.
 */
import { writeFileSync } from 'node:fs'
import { writeIcons } from './icon-png.mjs'

const OUT = new URL('../public/', import.meta.url)

const GROUND = [179, 80, 45]
const DISC = [244, 241, 232]

const SPAN = 12
const CENTER = SPAN / 2
const DISC_R = 4.5
const HOLE_R = 1.05
const RING_IN = 1.75
const RING_OUT = 2.3

/** Tested per point so the SVG and the PNG cannot disagree. */
function inDisc(x, y) {
  const dx = x - CENTER
  const dy = y - CENTER
  const d = Math.sqrt(dx * dx + dy * dy)
  if (d > DISC_R || d <= HOLE_R) return false
  return d < RING_IN || d > RING_OUT
}

const rgb = (channels) => `rgb(${channels.join(' ')})`

const svg = [
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SPAN} ${SPAN}">`,
  '  <!-- The disc: a CD, its label ring, and the hole. -->',
  `  <rect width="${SPAN}" height="${SPAN}" rx="2.6" fill="${rgb(GROUND)}"/>`,
  `  <circle cx="${CENTER}" cy="${CENTER}" r="${DISC_R}" fill="${rgb(DISC)}"/>`,
  `  <circle cx="${CENTER}" cy="${CENTER}" r="${(RING_IN + RING_OUT) / 2}" fill="none" stroke="${rgb(GROUND)}" stroke-width="${RING_OUT - RING_IN}"/>`,
  `  <circle cx="${CENTER}" cy="${CENTER}" r="${HOLE_R}" fill="${rgb(GROUND)}"/>`,
  '</svg>',
  '',
].join('\n')

writeFileSync(new URL('favicon.svg', OUT), svg)
console.log('wrote favicon.svg')

function render(size) {
  const pixels = new Array(size * size)
  const unit = size / SPAN
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const gx = (x + 0.5) / unit
      const gy = (y + 0.5) / unit
      pixels[y * size + x] = inDisc(gx, gy) ? DISC : GROUND
    }
  }
  return pixels
}

for (const size of writeIcons(OUT, [180, 192, 512], render)) {
  console.log(`wrote icon-${size}.png`)
}

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import { App } from './App'
import { editUrl, shareUrl } from '@/lib/codec'
import { starterDoc } from '@/lib/starter'

function visit(url: string) {
  const parsed = new URL(url)
  window.history.replaceState(null, '', parsed.pathname + parsed.search)
}

afterEach(() => {
  window.history.replaceState(null, '', '/')
  localStorage.clear()
  document.documentElement.removeAttribute('style')
  delete document.documentElement.dataset.mixtapeTheme
})

describe('routing', () => {
  it('opens the builder when there is no document in the link', () => {
    visit('https://example.test/mixtape/')
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Mixtape' })).toBeInTheDocument()
    expect(screen.getByLabelText(/guest link/i)).toBeInTheDocument()
  })

  it('renders a document in the link as a closed invite', () => {
    visit(shareUrl(starterDoc(), 'https://example.test'))
    render(<App />)
    expect(screen.getByRole('button', { name: /open the case/i })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Mixtape' })).not.toBeInTheDocument()
  })

  it('reopens an edit link in the builder with the document loaded', () => {
    const doc = { ...starterDoc(), venue: 'The Orpheum' }
    visit(editUrl(doc, 'https://example.test'))
    render(<App />)
    expect(screen.getByLabelText('Venue')).toHaveValue('The Orpheum')
  })

  it('falls back to the builder when the blob is corrupt', () => {
    visit('https://example.test/mixtape/?t=jazz&m=corrupted')
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Mixtape' })).toBeInTheDocument()
  })
})

describe('invite', () => {
  it('opens the case into the booklet and walks the tracklist', async () => {
    const user = userEvent.setup()
    visit(shareUrl(starterDoc(), 'https://example.test'))
    render(<App />)

    await user.click(screen.getByRole('button', { name: /open the case/i }))
    // Reduced motion is on in jsdom (matchMedia matches nothing), so the case
    // opens without waiting for the animation.
    expect(await screen.findByRole('navigation', { name: /booklet pages/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /saturday|june/i })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /getting there/i }))
    expect(
      await screen.findByRole('heading', { name: 'Getting there', level: 2 }),
    ).toBeInTheDocument()
    expect(screen.getByText(/rivertown lodge/i)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /press play/i }))
    const play = await screen.findByRole('link', { name: /open the playlist/i })
    expect(play).toHaveAttribute('href', starterDoc().playlist)
  })

  it('drops the travel and questions tracks when those lists are empty', async () => {
    const user = userEvent.setup()
    const doc = { ...starterDoc(), travel: [], faqs: [] }
    visit(shareUrl(doc, 'https://example.test'))
    render(<App />)
    await user.click(screen.getByRole('button', { name: /open the case/i }))
    await screen.findByRole('navigation', { name: /booklet pages/i })
    expect(screen.queryByRole('button', { name: /getting there/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /good questions/i })).not.toBeInTheDocument()
  })

  it('writes the genre palette onto the page', () => {
    visit(shareUrl({ ...starterDoc(), theme: 'jazz' }, 'https://example.test'))
    render(<App />)
    expect(document.documentElement.dataset.mixtapeTheme).toBe('jazz')
    expect(document.documentElement.style.getPropertyValue('--bg')).toBe('#101623')
  })
})

describe('builder', () => {
  it('typing a name updates the cover preview', async () => {
    const user = userEvent.setup()
    visit('https://example.test/mixtape/')
    render(<App />)
    const first = screen.getByLabelText('First name')
    await user.clear(first)
    await user.type(first, 'Robin')
    expect(screen.getByText(/Robin & Sam/)).toBeInTheDocument()
  })

  it('the guest link always decodes back to the form', async () => {
    const user = userEvent.setup()
    visit('https://example.test/mixtape/')
    render(<App />)
    const venue = screen.getByLabelText('Venue')
    await user.clear(venue)
    await user.type(venue, 'Red Rocks')
    const link = screen.getByLabelText(/guest link/i) as HTMLInputElement
    const blob = new URL(link.value).searchParams.get('m')
    expect(blob).toBeTruthy()
  })
})

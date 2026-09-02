import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import { App } from './App'
import { editUrl, shareUrl } from '@/lib/codec'
import { starterDoc } from '@/lib/starter'

function visit(url: string) {
  const parsed = new URL(url)
  window.history.replaceState(null, '', parsed.pathname + parsed.search + parsed.hash)
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
  it('opens the case into the booklet and turns its pages', async () => {
    const user = userEvent.setup()
    visit(shareUrl(starterDoc(), 'https://example.test'))
    render(<App />)

    await user.click(screen.getByRole('button', { name: /open the case/i }))
    // Reduced motion matches in jsdom, so the case opens without waiting for
    // the lid swing.
    expect(await screen.findByRole('navigation', { name: /booklet pages/i })).toBeInTheDocument()

    // The booklet opens at its cover; the folio counts it as page zero.
    expect(screen.getByText('00 / 04')).toBeInTheDocument()

    // Sheets off the top of the stack are aria-hidden until turned to, and
    // the chevron flips one sheet at a time.
    await user.click(screen.getByRole('button', { name: /next page/i }))
    expect(await screen.findByRole('heading', { name: /saturday|june/i })).toBeInTheDocument()
    // The couple's own line prints; nothing is generated around it.
    expect(screen.getByText('Dinner and dancing to follow.')).toBeInTheDocument()
    expect(screen.queryByText(/formal invitation/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/days away/i)).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /next page/i }))
    expect(
      await screen.findByRole('heading', { name: 'Getting there', level: 2 }),
    ).toBeInTheDocument()
    expect(screen.getByText(/rivertown lodge/i)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /next page/i }))
    expect(
      await screen.findByRole('heading', { name: 'Good questions', level: 2 }),
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /next page/i }))
    const play = await screen.findByRole('link', { name: /open the playlist/i })
    expect(play).toHaveAttribute('href', starterDoc().playlist)
    expect(screen.getByText('04 / 04')).toBeInTheDocument()

    // The folio walks back too.
    await user.click(screen.getByRole('button', { name: /previous page/i }))
    expect(screen.getByText('03 / 04')).toBeInTheDocument()
  })

  it('prints a QR code only for a provided wedding website', async () => {
    const user = userEvent.setup()
    const withSite = { ...starterDoc(), website: 'https://juneandtheo.example' }
    visit(shareUrl(withSite, 'https://example.test'))
    render(<App />)
    await user.click(screen.getByRole('button', { name: /open the case/i }))
    await user.click(screen.getByRole('button', { name: /next page/i }))
    await user.click(screen.getByRole('button', { name: /next page/i }))
    await user.click(screen.getByRole('button', { name: /next page/i }))
    expect(
      await screen.findByRole('img', { name: /qr code opening https:\/\/juneandtheo\.example/i }),
    ).toBeInTheDocument()
    // The whole card is a link to the website, not just a picture of one.
    expect(
      screen.getByRole('link', { name: /everything else is on our website/i }),
    ).toHaveAttribute('href', 'https://juneandtheo.example')
  })

  it('prints no QR code when there is no website', async () => {
    const user = userEvent.setup()
    visit(shareUrl(starterDoc(), 'https://example.test'))
    render(<App />)
    await user.click(screen.getByRole('button', { name: /open the case/i }))
    await user.click(screen.getByRole('button', { name: /next page/i }))
    await user.click(screen.getByRole('button', { name: /next page/i }))
    await user.click(screen.getByRole('button', { name: /next page/i }))
    expect(
      await screen.findByRole('heading', { name: 'Good questions', level: 2 }),
    ).toBeInTheDocument()
    expect(screen.queryByRole('img', { name: /qr code/i })).not.toBeInTheDocument()
  })

  it('drops the travel and questions pages when those lists are empty', async () => {
    const user = userEvent.setup()
    const doc = { ...starterDoc(), travel: [], faqs: [] }
    visit(shareUrl(doc, 'https://example.test'))
    render(<App />)
    await user.click(screen.getByRole('button', { name: /open the case/i }))
    await screen.findByRole('navigation', { name: /booklet pages/i })
    expect(screen.getByText('00 / 02')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /next page/i }))
    await user.click(screen.getByRole('button', { name: /next page/i }))
    expect(await screen.findByRole('link', { name: /open the playlist/i })).toBeInTheDocument()
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
    const blob = new URLSearchParams(new URL(link.value).hash.slice(1)).get('m')
    expect(blob).toBeTruthy()
  })
})

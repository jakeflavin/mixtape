import { useState } from 'react'
import { RotateCcw } from 'lucide-react'
import { useDraft } from '@/hooks/useDraft'
import { useGenreTheme } from '@/hooks/useGenreTheme'
import { useSystemTheme } from '@/hooks/useSystemTheme'
import { CoverArt } from '@/components/Invite/CoverArt'
import { ItemsEditor } from './ItemsEditor'
import { ThemePicker } from './ThemePicker'
import { SharePanel } from './SharePanel'
import { Page, Header, Layout, Form, Section, Field, Preview } from './Builder.styled'
import type { EditorItem } from './ItemsEditor'
import type { SaveTheDate } from '@/lib/types'

export interface BuilderProps {
  /** A document reopened from an edit link, or null for a fresh one. */
  initial: SaveTheDate | null
}

export function Builder({ initial }: BuilderProps) {
  const { doc, update, reset } = useDraft(initial)
  const [previewEl, setPreviewEl] = useState<HTMLElement | null>(null)

  useSystemTheme(true)
  useGenreTheme(doc.theme, previewEl)

  const setName = (index: 0 | 1, value: string) => {
    const names: [string, string] = index === 0 ? [value, doc.names[1]] : [doc.names[0], value]
    update({ names })
  }

  const travelItems: EditorItem[] = doc.travel.map((t) => ({
    id: t.id,
    title: t.heading,
    body: t.body,
  }))
  const faqItems: EditorItem[] = doc.faqs.map((f) => ({ id: f.id, title: f.q, body: f.a }))

  return (
    <Page>
      <Header>
        <div>
          <h1>Mixtape</h1>
          <p>A wedding save-the-date you press like an album. The link is the whole invite.</p>
        </div>
        <button
          type="button"
          className="header-reset"
          onClick={() => {
            if (window.confirm('Start over? This clears everything in the form.')) reset()
          }}
        >
          <RotateCcw size={15} aria-hidden="true" />
          <span>Start over</span>
        </button>
      </Header>
      <Layout>
        <Form onSubmit={(event) => event.preventDefault()}>
          <Section>
            <h2>The couple</h2>
            <div className="section-grid">
              <Field>
                <label htmlFor="name-a">First name</label>
                <input
                  id="name-a"
                  type="text"
                  value={doc.names[0]}
                  onChange={(e) => setName(0, e.target.value)}
                />
              </Field>
              <Field>
                <label htmlFor="name-b">Second name</label>
                <input
                  id="name-b"
                  type="text"
                  value={doc.names[1]}
                  onChange={(e) => setName(1, e.target.value)}
                />
              </Field>
              <Field className="is-wide">
                <label htmlFor="album">Album title</label>
                <input
                  id="album"
                  type="text"
                  value={doc.album}
                  placeholder="Save the date"
                  onChange={(e) => update({ album: e.target.value })}
                />
              </Field>
            </div>
          </Section>
          <Section>
            <h2>The day</h2>
            <div className="section-grid">
              <Field>
                <label htmlFor="date">Date</label>
                <input
                  id="date"
                  type="date"
                  value={doc.date}
                  onChange={(e) => update({ date: e.target.value })}
                />
              </Field>
              <Field>
                <label htmlFor="time">Time</label>
                <input
                  id="time"
                  type="time"
                  value={doc.time}
                  onChange={(e) => update({ time: e.target.value })}
                />
              </Field>
              <Field>
                <label htmlFor="venue">Venue</label>
                <input
                  id="venue"
                  type="text"
                  value={doc.venue}
                  onChange={(e) => update({ venue: e.target.value })}
                />
              </Field>
              <Field>
                <label htmlFor="city">Town or city</label>
                <input
                  id="city"
                  type="text"
                  value={doc.city}
                  onChange={(e) => update({ city: e.target.value })}
                />
              </Field>
            </div>
          </Section>
          <Section>
            <h2>Travel</h2>
            <p className="section-hint">
              How to get there and where to stay. Leave it empty to drop the page.
            </p>
            <ItemsEditor
              label="Travel note"
              addLabel="Add a travel note"
              titlePlaceholder="Getting there"
              bodyPlaceholder="Fly into…"
              items={travelItems}
              onChange={(items) =>
                update({
                  travel: items.map((i) => ({ id: i.id, heading: i.title, body: i.body })),
                })
              }
            />
          </Section>
          <Section>
            <h2>Questions</h2>
            <p className="section-hint">
              The ones people will ask anyway. The page also carries a QR code of the invite.
            </p>
            <ItemsEditor
              label="Question"
              addLabel="Add a question"
              titlePlaceholder="Can we bring the kids?"
              bodyPlaceholder="The answer"
              items={faqItems}
              onChange={(items) =>
                update({ faqs: items.map((i) => ({ id: i.id, q: i.title, a: i.body })) })
              }
            />
          </Section>
          <Section>
            <h2>The playlist</h2>
            <div className="section-grid">
              <Field className="is-wide">
                <label htmlFor="playlist">Playlist link</label>
                <input
                  id="playlist"
                  type="url"
                  placeholder="https://open.spotify.com/playlist/…"
                  value={doc.playlist}
                  onChange={(e) => update({ playlist: e.target.value })}
                />
              </Field>
              <Field className="is-wide">
                <label htmlFor="note">A line to go with it</label>
                <input
                  id="note"
                  type="text"
                  placeholder="Add the song you want to dance to."
                  value={doc.note}
                  onChange={(e) => update({ note: e.target.value })}
                />
              </Field>
            </div>
          </Section>
          <Section>
            <h2>The look</h2>
            <ThemePicker value={doc.theme} onPick={(theme) => update({ theme })} />
          </Section>
          <SharePanel doc={doc} />
        </Form>
        <Preview ref={setPreviewEl} aria-label="Preview">
          <div className="preview-case">
            <span className="preview-spine" aria-hidden="true" />
            <span className="preview-face">
              <CoverArt doc={doc} />
              <span className="preview-gloss" aria-hidden="true" />
            </span>
          </div>
          <p className="preview-note">The cover, as guests first see it.</p>
        </Preview>
      </Layout>
    </Page>
  )
}

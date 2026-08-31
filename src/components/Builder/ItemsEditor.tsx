import { Plus, Trash2 } from 'lucide-react'
import { Rows } from './ItemsEditor.styled'

export interface EditorItem {
  id: string
  title: string
  body: string
}

export interface ItemsEditorProps {
  label: string
  addLabel: string
  titlePlaceholder: string
  bodyPlaceholder: string
  items: EditorItem[]
  onChange: (items: EditorItem[]) => void
}

/*
 * One editor for both lists: travel items and FAQs are the same shape — a
 * short line and a paragraph — so the mapping to their real field names lives
 * with the caller.
 */
export function ItemsEditor({
  label,
  addLabel,
  titlePlaceholder,
  bodyPlaceholder,
  items,
  onChange,
}: ItemsEditorProps) {
  const patch = (id: string, change: Partial<EditorItem>) =>
    onChange(items.map((item) => (item.id === id ? { ...item, ...change } : item)))

  return (
    <Rows>
      {items.map((item, index) => (
        <li key={item.id} className="row">
          <div className="row-fields">
            <input
              type="text"
              aria-label={`${label} ${index + 1} title`}
              placeholder={titlePlaceholder}
              value={item.title}
              onChange={(event) => patch(item.id, { title: event.target.value })}
            />
            <textarea
              aria-label={`${label} ${index + 1} text`}
              placeholder={bodyPlaceholder}
              rows={3}
              value={item.body}
              onChange={(event) => patch(item.id, { body: event.target.value })}
            />
          </div>
          <button
            type="button"
            className="row-remove"
            aria-label={`Remove ${label.toLowerCase()} ${index + 1}`}
            onClick={() => onChange(items.filter((other) => other.id !== item.id))}
          >
            <Trash2 size={16} aria-hidden="true" />
          </button>
        </li>
      ))}
      <li>
        <button
          type="button"
          className="row-add"
          onClick={() => onChange([...items, { id: crypto.randomUUID(), title: '', body: '' }])}
        >
          <Plus size={16} aria-hidden="true" />
          <span>{addLabel}</span>
        </button>
      </li>
    </Rows>
  )
}

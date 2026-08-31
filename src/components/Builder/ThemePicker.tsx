import { THEMES } from '@/lib/themes'
import { Swatches } from './ThemePicker.styled'
import type { ThemeId } from '@/lib/types'

export interface ThemePickerProps {
  value: ThemeId
  onPick: (theme: ThemeId) => void
}

/*
 * Ten records in a crate. Each swatch paints its own cover gradient inline —
 * the one place theme colours appear outside :root, because every swatch shows
 * a palette that is by definition not the active one.
 */
export function ThemePicker({ value, onPick }: ThemePickerProps) {
  return (
    <Swatches role="radiogroup" aria-label="Theme">
      {THEMES.map((theme) => (
        <button
          key={theme.id}
          type="button"
          role="radio"
          aria-checked={theme.id === value}
          className={theme.id === value ? 'swatch is-active' : 'swatch'}
          onClick={() => onPick(theme.id)}
        >
          <span
            className="swatch-cover"
            style={{
              background: `linear-gradient(160deg, ${theme.tokens.coverA}, ${theme.tokens.coverB})`,
              color: theme.tokens.coverText,
            }}
            aria-hidden="true"
          >
            <span className="swatch-dot" style={{ background: theme.tokens.accent }} />
          </span>
          <span className="swatch-name">{theme.label}</span>
          <span className="swatch-vibe">{theme.vibe}</span>
        </button>
      ))}
    </Swatches>
  )
}

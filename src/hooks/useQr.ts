import { useEffect, useState } from 'react'
import { qrDataUrl } from '@/lib/qr'

interface QrState {
  url: string
  /** The rendered code, or null when this url could not be encoded. */
  dataUrl: string | null
}

export interface QrResult {
  /** The image: null while it renders, and null if it cannot be made. */
  src: string | null
  /** The encoder refused this url — more data than any code can hold. */
  failed: boolean
}

/**
 * The QR image for a url. Loading and refused have to be different answers: a
 * caller that cannot tell them apart either flashes an apology before the code
 * arrives, or says nothing at all when there is never going to be one.
 */
export function useQr(url: string): QrResult {
  const [state, setState] = useState<QrState | null>(null)

  useEffect(() => {
    let stale = false
    qrDataUrl(url).then(
      (dataUrl) => {
        if (!stale) setState({ url, dataUrl })
      },
      () => {
        // Too long to encode. Recorded, so the caller can say so out loud.
        if (!stale) setState({ url, dataUrl: null })
      },
    )
    return () => {
      stale = true
    }
  }, [url])

  // A result for an older url is still-loading, not a stale answer.
  if (!state || state.url !== url) return { src: null, failed: false }
  return { src: state.dataUrl, failed: state.dataUrl === null }
}

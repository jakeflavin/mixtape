import { useEffect, useState } from 'react'
import { qrDataUrl } from '@/lib/qr'

interface QrResult {
  url: string
  dataUrl: string
}

/** The QR image for a url, or null while it renders (or if it cannot). */
export function useQr(url: string): string | null {
  const [result, setResult] = useState<QrResult | null>(null)

  useEffect(() => {
    let stale = false
    qrDataUrl(url).then(
      (dataUrl) => {
        if (!stale) setResult({ url, dataUrl })
      },
      () => {
        // A url too long to encode leaves the block hidden rather than broken.
      },
    )
    return () => {
      stale = true
    }
  }, [url])

  // A result for an older url is treated as still-loading, not shown stale.
  return result && result.url === url ? result.dataUrl : null
}

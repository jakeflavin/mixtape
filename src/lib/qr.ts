import QRCode from 'qrcode'

/*
 * QR modules are a machine format: the two colours are contrast for a camera,
 * not part of the palette, so they stay fixed no matter the theme. The code is
 * drawn on its own white card for the same reason.
 */
export function qrDataUrl(url: string): Promise<string> {
  return QRCode.toDataURL(url, {
    margin: 1,
    width: 480,
    errorCorrectionLevel: 'M',
    color: { dark: '#141414', light: '#ffffff' },
  })
}

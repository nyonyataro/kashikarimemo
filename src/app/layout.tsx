import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'かしカリメモ - 貸し借り記録サービス',
  description: 'お金・モノの貸し借りを記録する軽量Webサービス',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body suppressHydrationWarning={true}>{children}</body>
    </html>
  )
}
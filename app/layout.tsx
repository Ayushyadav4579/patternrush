import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Fredoka, Nunito } from 'next/font/google'
import './globals.css'

const fredoka = Fredoka({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-fredoka',
})

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-nunito',
})

export const metadata: Metadata = {
  title: 'PatternRush — Neon Sequence Challenge',
  description:
    'PatternRush is a free online pattern puzzle game with number, color, shape, letter, campaign, endless, and time attack challenges. Play instantly with no login required.',
  keywords: [
    'PatternRush',
    'pattern puzzle game',
    'sequence game online',
    'brain training game',
    'number pattern game',
    'pattern recognition game',
    'free puzzle game',
  ],
  applicationName: 'PatternRush',
  category: 'games',
  creator: 'PatternRush',
  publisher: 'PatternRush',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  generator: 'PatternRush',
}

export const viewport: Viewport = {
  themeColor: '#2a1a4a',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`light bg-background ${fredoka.variable} ${nunito.variable}`}>
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}

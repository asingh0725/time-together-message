import type { Metadata, Viewport } from 'next'
import { Outfit, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/Providers'

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://plantomeet.app'),
  title: 'PlanToMeet - Find the Perfect Time to Meet',
  description: 'The simplest way to schedule group meetings. Create polls, share with friends, and find the time that works for everyone.',
  keywords: ['scheduling', 'meeting', 'poll', 'calendar', 'group planning', 'when2meet'],
  authors: [{ name: 'PlanToMeet' }],
  creator: 'PlanToMeet',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://plantomeet.app',
    siteName: 'PlanToMeet',
    title: 'PlanToMeet - Find the Perfect Time to Meet',
    description: 'The simplest way to schedule group meetings. Create polls, share with friends, and find the time that works for everyone.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'PlanToMeet - Group Scheduling Made Simple',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PlanToMeet - Find the Perfect Time to Meet',
    description: 'The simplest way to schedule group meetings.',
    images: ['/og-image.png'],
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon-192.png', type: 'image/png', sizes: '192x192' },
      { url: '/icon-512.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: '/apple-touch-icon.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'PlanToMeet',
  },
}

export const viewport: Viewport = {
  themeColor: '#09090b',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${outfit.variable} ${jakarta.variable}`}>
      <body className="min-h-screen bg-background text-text-primary font-body antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}

import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import { BottomNav } from '@/components/bottom-nav';
import { ServiceWorkerRegistration } from '@/components/service-worker-registration';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'FinFree - Financial Freedom Journey',
  description: 'Track your path to financial freedom with personalized goals and insights',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'FinFree',
  },
  applicationName: 'FinFree',
  keywords: ['finance', 'savings', 'FIRE', 'financial freedom', 'budget', 'goals'],
  authors: [{ name: 'FinFree' }],
  creator: 'FinFree',
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/apple-icon-180.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="apple-touch-icon" href="/icons/apple-icon-180.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased min-h-screen bg-background`}
      >
        <main className="pb-20 min-h-screen">
          {children}
        </main>
        <BottomNav />
        <Toaster position="top-center" richColors />
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}

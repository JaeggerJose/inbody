import type { Metadata } from 'next'
import { Syne, JetBrains_Mono, Inter } from 'next/font/google'
import './globals.css'
import { NavBar } from '@/components/layout/NavBar'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--loaded-inter',
})

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  display: 'swap',
  variable: '--loaded-syne',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--loaded-jbmono',
})

export const metadata: Metadata = {
  title: 'InBody Tracker — Mike',
  description: '身體組成量測紀錄與分析',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="zh-TW"
      className={`${inter.variable} ${syne.variable} ${jetbrainsMono.variable}`}
    >
      <body className="antialiased">
        <NavBar />
        <main className="min-h-screen pt-16">{children}</main>
      </body>
    </html>
  )
}

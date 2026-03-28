import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import FirebaseProvider from './FirebaseProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AmkyawDev Coder AI',
  description: 'AI-powered coding platform with OpenHands integration',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Firebase SDK */}
        <script src="https://www.gstatic.com/firebasejs/10.8.1/firebase-app-compat.js" />
        <script src="https://www.gstatic.com/firebasejs/10.8.1/firebase-auth-compat.js" />
      </head>
      <body className={inter.className}>
        <FirebaseProvider>
          {children}
        </FirebaseProvider>
      </body>
    </html>
  )
}
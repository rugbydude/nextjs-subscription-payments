"use client"

import { Inter } from "next/font/google"
import { Toaster } from "react-hot-toast"
import type { ReactNode } from "react"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

interface RootLayoutProps {
  children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#363636",
              color: "#fff",
            },
            success: {
              duration: 3000,
              style: {
                background: "#4aed88",
                color: "#fff"
              }
            },
            error: {
              duration: 4000,
              style: {
                background: "#ff4b4b",
                color: "#fff"
              }
            }
          }}
        />
      </body>
    </html>
  )
}

import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import WalletContextProvider from "../components/wallet/wallet-context-provider"
import { ListingsProvider } from "@/components/listing/ListingsContext"
import { CartProvider } from "@/components/cart/CartContext" // Import CartProvider
import "./globals.css"
import "./wallet.css"
import { Suspense } from "react"

export const metadata = {
  title: "Campus Market - P2P Marketplace for Students",
  description: "Buy and sell textbooks, electronics, and campus essentials with crypto payments",
  generator: "v0.app",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>
          <WalletContextProvider>
            <ListingsProvider>
              <CartProvider> {/* Wrap children with CartProvider */}
                {children}
              </CartProvider>
            </ListingsProvider>
          </WalletContextProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
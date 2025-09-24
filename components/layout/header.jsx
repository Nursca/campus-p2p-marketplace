"use client"

import { WalletButton } from "@/components/wallet/wallet-button"
import { CreateListingModal } from "@/components/listing/create-listing-modal"
import MessageNotifications from "@/components/chat/message-notifications"
import { Search, Plus } from "lucide-react"
import { Button } from "@/components/payment/ui/button"
import { Input } from "@/components/payment/ui/input"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function Header() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/browse?search=${encodeURIComponent(searchQuery.trim())}`)
    } else {
      router.push("/browse")
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">CM</span>
          </div>
          <span className="font-bold text-lg hidden sm:inline">Campus Market</span>
        </Link>

        {/* Search Bar - Hidden on mobile */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <form onSubmit={handleSearch} className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search textbooks, electronics..."
              className="pl-10 bg-muted/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <CreateListingModal>
            <Button variant="outline" size="sm" className="hidden sm:flex bg-transparent">
              <Plus className="w-4 h-4 mr-2" />
              Sell Item
            </Button>
          </CreateListingModal>
          <MessageNotifications />
          <WalletButton />
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden px-4 pb-3">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search textbooks, electronics..."
            className="pl-10 bg-muted/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      </div>
    </header>
  )
}

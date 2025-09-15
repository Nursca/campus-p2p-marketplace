"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useWallet } from "./wallet-provider"
import { Wallet, LogOut, Copy, Check } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { WalletSelectionModal } from "./wallet-selection-modal"

export function WalletButton() {
  const { connected, connecting, publicKey, connectWallet, disconnectWallet, getBalance } = useWallet()
  const [balance, setBalance] = useState(0)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (connected && publicKey) {
      getBalance().then(setBalance)
    }
  }, [connected, publicKey, getBalance])

  const copyAddress = async () => {
    if (publicKey) {
      await navigator.clipboard.writeText(publicKey.toString())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const formatAddress = (address) => {
    if (!address) return ""
    const str = address.toString()
    return `${str.slice(0, 4)}...${str.slice(-4)}`
  }

  return (
    <>
      {!connected ? (
        <Button
          onClick={connectWallet}
          disabled={connecting}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Wallet className="w-4 h-4 mr-2" />
          {connecting ? "Connecting..." : "Connect Wallet"}
        </Button>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <Wallet className="w-4 h-4" />
              <span className="hidden sm:inline">{formatAddress(publicKey)}</span>
              <span className="text-xs text-muted-foreground">{balance.toFixed(2)} SOL</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium">Wallet Connected</p>
              <p className="text-xs text-muted-foreground">{formatAddress(publicKey)}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={copyAddress} className="cursor-pointer">
              {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
              {copied ? "Copied!" : "Copy Address"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={disconnectWallet} className="cursor-pointer text-destructive">
              <LogOut className="w-4 h-4 mr-2" />
              Disconnect
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      <WalletSelectionModal />
    </>
  )
}

"use client"

<<<<<<< HEAD
import { useState, useEffect } from "react"
import { Button } from "@/components/payment/ui/button"
import { useWallet, useConnection } from "@solana/wallet-adapter-react"
import { Wallet, LogOut, Copy, Check } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/payment/ui/dropdown-menu"
import { WalletModal } from "@solana/wallet-adapter-react-ui"
import { LAMPORTS_PER_SOL } from "@solana/web3.js"
=======
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
>>>>>>> 684eb42136f9b7e4466b08530f7f33c027f708eb

export function WalletButton() {
  return <WalletMultiButton />
}

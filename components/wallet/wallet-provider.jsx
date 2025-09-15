"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { Connection, clusterApiUrl } from "@solana/web3.js"

const WalletContext = createContext({})

export const useWallet = () => {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
}

export function WalletProvider({ children }) {
  const [wallet, setWallet] = useState(null)
  const [connected, setConnected] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const [publicKey, setPublicKey] = useState(null)
  const [availableWallets, setAvailableWallets] = useState([])
  const [showWalletModal, setShowWalletModal] = useState(false)
  const [connection] = useState(() => new Connection(clusterApiUrl("mainnet-beta")))

  const detectWallets = () => {
    const wallets = []

    // Check for Phantom
    if (window.phantom?.solana?.isPhantom) {
      wallets.push({
        name: "Phantom",
        icon: "https://phantom.app/img/phantom-logo.svg",
        adapter: window.phantom.solana,
      })
    }

    // Check for Solflare
    if (window.solflare?.isSolflare) {
      wallets.push({
        name: "Solflare",
        icon: "https://solflare.com/assets/logo.svg",
        adapter: window.solflare,
      })
    }

    // Check for Backpack
    if (window.backpack?.isBackpack) {
      wallets.push({
        name: "Backpack",
        icon: "https://backpack.app/icon.png",
        adapter: window.backpack,
      })
    }

    // Check for Sollet
    if (window.sollet) {
      wallets.push({
        name: "Sollet",
        icon: "https://www.sollet.io/logo.svg",
        adapter: window.sollet,
      })
    }

    setAvailableWallets(wallets)
    return wallets
  }

  // Check if wallet is already connected on mount
  useEffect(() => {
    const checkWalletConnection = async () => {
      try {
        const wallets = detectWallets()

        // Try to connect to previously connected wallet
        for (const walletInfo of wallets) {
          try {
            const response = await walletInfo.adapter.connect({ onlyIfTrusted: true })
            if (response.publicKey) {
              setWallet(walletInfo.adapter)
              setPublicKey(response.publicKey)
              setConnected(true)
              break
            }
          } catch (error) {
            // Continue to next wallet
            continue
          }
        }
      } catch (error) {
        console.log("No wallet auto-connected:", error)
      }
    }

    checkWalletConnection()
  }, [])

  const connectWallet = async (selectedWallet = null) => {
    if (connecting) return

    setConnecting(true)
    try {
      const wallets = detectWallets()

      if (wallets.length === 0) {
        // No wallets detected, show installation options
        setShowWalletModal(true)
        setConnecting(false)
        return
      }

      if (wallets.length === 1 && !selectedWallet) {
        // Only one wallet available, connect directly
        selectedWallet = wallets[0]
      } else if (!selectedWallet) {
        // Multiple wallets available, show selection modal
        setShowWalletModal(true)
        setConnecting(false)
        return
      }

      const response = await selectedWallet.adapter.connect()
      setWallet(selectedWallet.adapter)
      setPublicKey(response.publicKey)
      setConnected(true)
      setShowWalletModal(false)
    } catch (error) {
      console.error("Error connecting wallet:", error)
    } finally {
      setConnecting(false)
    }
  }

  const disconnectWallet = async () => {
    try {
      if (wallet) {
        await wallet.disconnect()
      }
      setWallet(null)
      setPublicKey(null)
      setConnected(false)
    } catch (error) {
      console.error("Error disconnecting wallet:", error)
    }
  }

  const getBalance = async () => {
    if (!publicKey || !connection) return 0
    try {
      const balance = await connection.getBalance(publicKey)
      return balance / 1e9 // Convert lamports to SOL
    } catch (error) {
      console.error("Error getting balance:", error)
      return 0
    }
  }

  const value = {
    wallet,
    connected,
    connecting,
    publicKey,
    connection,
    connectWallet,
    disconnectWallet,
    getBalance,
    availableWallets,
    showWalletModal,
    setShowWalletModal,
  }

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
}

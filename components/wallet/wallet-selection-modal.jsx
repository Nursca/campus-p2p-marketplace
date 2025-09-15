"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useWallet } from "./wallet-provider"
import { ExternalLink, Download } from "lucide-react"

export function WalletSelectionModal() {
  const { showWalletModal, setShowWalletModal, availableWallets, connectWallet, connecting } = useWallet()

  const walletInstallLinks = {
    Phantom: "https://phantom.app/download",
    Solflare: "https://solflare.com/download",
    Backpack: "https://backpack.app/download",
    Sollet: "https://www.sollet.io",
  }

  const handleWalletConnect = async (walletInfo) => {
    await connectWallet(walletInfo)
  }

  const handleInstallWallet = (walletName) => {
    window.open(walletInstallLinks[walletName], "_blank")
  }

  return (
    <Dialog open={showWalletModal} onOpenChange={setShowWalletModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Connect Your Wallet</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {availableWallets.length > 0 ? (
            <>
              <p className="text-sm text-muted-foreground">Choose a wallet to connect to the campus marketplace:</p>
              <div className="space-y-2">
                {availableWallets.map((walletInfo) => (
                  <Button
                    key={walletInfo.name}
                    variant="outline"
                    className="w-full justify-start h-12 bg-transparent"
                    onClick={() => handleWalletConnect(walletInfo)}
                    disabled={connecting}
                  >
                    <img
                      src={walletInfo.icon || "/placeholder.svg"}
                      alt={walletInfo.name}
                      className="w-6 h-6 mr-3"
                      onError={(e) => {
                        e.target.style.display = "none"
                      }}
                    />
                    <span className="flex-1 text-left">{walletInfo.name}</span>
                    <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">Detected</span>
                  </Button>
                ))}
              </div>
            </>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                No Solana wallets detected. Install a wallet to get started:
              </p>
              <div className="space-y-2">
                {Object.entries(walletInstallLinks).map(([name, link]) => (
                  <Button
                    key={name}
                    variant="outline"
                    className="w-full justify-start h-12 bg-transparent"
                    onClick={() => handleInstallWallet(name)}
                  >
                    <Download className="w-4 h-4 mr-3" />
                    <span className="flex-1 text-left">Install {name}</span>
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground text-center">After installing, refresh the page to connect</p>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

"use client"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/payment/ui/dialog"
import { Button } from "@/components/payment/ui/button"
import { Card, CardContent } from "@/components/payment/ui/card"
import { Badge } from "@/components/payment/ui/badge"
import { Separator } from "@/components/payment/ui/separator"
import { useWallet } from "@solana/wallet-adapter-react"
import { QRCodeSVG } from "qrcode.react"
import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js"
import { CheckCircle, Clock, AlertCircle, Copy, Check, Smartphone, Monitor } from "lucide-react"

const USDC_MINT = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v" // USDC mint address

export function SolanaPayModal({ item, open, onOpenChange, onPaymentComplete }) {
  const { connected, publicKey, connection, wallet } = useWallet()
  const [paymentStatus, setPaymentStatus] = useState("pending") // pending, processing, completed, failed
  const [qrCodeUrl, setQrCodeUrl] = useState("")
  const [transactionSignature, setTransactionSignature] = useState("")
  const [copied, setCopied] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("mobile") // mobile or desktop
  const [countdown, setCountdown] = useState(300) // 5 minutes
  const intervalRef = useRef(null)

  useEffect(() => {
    if (open && item) {
      generatePaymentRequest()
      startCountdown()
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [open, item])

  const startCountdown = () => {
    setCountdown(300)
    intervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current)
          setPaymentStatus("failed")
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const generatePaymentRequest = () => {
    if (!item) return

    // Encode the URL for the API endpoint
    const apiUrl = `${window.location.origin}/api/solanapay?item=${encodeURIComponent(JSON.stringify(item))}`
    
    // Create the Solana Pay URL
    const solanaPayUrl = new URL(`solana:${apiUrl}`)
    setQrCodeUrl(solanaPayUrl.toString())
  }

  const processDesktopPayment = async () => {
    if (!connected || !wallet || !item) return

    setPaymentStatus("processing")

    try {
      // Create transaction
      const transaction = new Transaction()
      const recipientPubkey = new PublicKey(item.seller.address)

      if (item.currency === "SOL") {
        // SOL transfer
        const transferInstruction = SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: recipientPubkey,
          lamports: item.price * LAMPORTS_PER_SOL,
        })
        transaction.add(transferInstruction)
      } else {
        // For USDC, we'd need to use Token Program
        // This is a simplified version - in production you'd use @solana/spl-token
        console.log("USDC transfers require SPL Token Program implementation")
        throw new Error("USDC transfers not implemented in this demo")
      }

      // Get recent blockhash
      const { blockhash } = await connection.getLatestBlockhash()
      transaction.recentBlockhash = blockhash
      transaction.feePayer = publicKey

      // Sign and send transaction
      const signedTransaction = await wallet.signTransaction(transaction)
      const signature = await connection.sendRawTransaction(signedTransaction.serialize())

      // Confirm transaction
      await connection.confirmTransaction(signature)

      setTransactionSignature(signature)
      setPaymentStatus("completed")

      // Notify parent component
      if (onPaymentComplete) {
        onPaymentComplete({
          signature,
          item,
          amount: item.price,
          currency: item.currency,
        })
      }
    } catch (error) {
      console.error("Payment failed:", error)
      setPaymentStatus("failed")
    }
  }

  const copyQRCode = async () => {
    await navigator.clipboard.writeText(qrCodeUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getStatusIcon = () => {
    switch (paymentStatus) {
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-500" />
      case "processing":
        return <Clock className="w-5 h-5 text-blue-500 animate-spin" />
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "failed":
        return <AlertCircle className="w-5 h-5 text-red-500" />
      default:
        return null
    }
  }

  const getStatusText = () => {
    switch (paymentStatus) {
      case "pending":
        return "Waiting for payment..."
      case "processing":
        return "Processing payment..."
      case "completed":
        return "Payment completed!"
      case "failed":
        return "Payment failed or expired"
      default:
        return ""
    }
  }

  if (!item) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getStatusIcon()}
            Complete Purchase
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Item Summary */}
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-3">
                <img
                  src={item.images[0] || "/placeholder.svg?height=60&width=60&query=product"}
                  alt={item.title}
                  className="w-15 h-15 object-cover rounded"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm line-clamp-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">Sold by {item.seller.name}</p>
                  <div className="flex items-center justify-between mt-2">
                    <Badge className="text-xs">{item.condition.replace("-", " ")}</Badge>
                    <span className="font-bold text-primary">
                      ${item.price} {item.currency}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Status */}
          <div className="text-center">
            <div className="text-sm text-muted-foreground mb-2">{getStatusText()}</div>
            {paymentStatus === "pending" && (
              <div className="text-sm font-medium">Time remaining: {formatTime(countdown)}</div>
            )}
            {paymentStatus === "completed" && transactionSignature && (
              <div className="text-xs text-muted-foreground">
                Transaction: {transactionSignature.slice(0, 8)}...{transactionSignature.slice(-8)}
              </div>
            )}
          </div>

          {/* Payment Method Selection */}
          {paymentStatus === "pending" && (
            <>
              <div className="flex gap-2">
                <Button
                  variant={paymentMethod === "mobile" ? "default" : "outline"}
                  onClick={() => setPaymentMethod("mobile")}
                  className="flex-1"
                  size="sm"
                >
                  <Smartphone className="w-4 h-4 mr-2" />
                  Mobile
                </Button>
                <Button
                  variant={paymentMethod === "desktop" ? "default" : "outline"}
                  onClick={() => setPaymentMethod("desktop")}
                  className="flex-1"
                  size="sm"
                >
                  <Monitor className="w-4 h-4 mr-2" />
                  Desktop
                </Button>
              </div>

              <Separator />

              {/* Mobile Payment - QR Code */}
              {paymentMethod === "mobile" && (
                <div className="text-center space-y-4">
                  <div className="bg-white p-4 rounded-lg inline-block">
                    <QRCodeSVG value={qrCodeUrl} size={200} />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Scan with your Solana wallet app</p>
                    <Button variant="outline" size="sm" onClick={copyQRCode}>
                      {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                      {copied ? "Copied!" : "Copy Payment Link"}
                    </Button>
                  </div>
                </div>
              )}

              {/* Desktop Payment - Direct Transaction */}
              {paymentMethod === "desktop" && (
                <div className="text-center space-y-4">
                  <div className="p-6 border-2 border-dashed border-muted rounded-lg">
                    <Monitor className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-4">Pay directly from your connected wallet</p>
                    <Button
                      onClick={processDesktopPayment}
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                      disabled={!connected}
                    >
                      Pay ${item.price} {item.currency}
                    </Button>
                  </div>
                  {!connected && (
                    <p className="text-xs text-muted-foreground">Please connect your wallet to use desktop payment</p>
                  )}
                </div>
              )}
            </>
          )}

          {/* Processing State */}
          {paymentStatus === "processing" && (
            <div className="text-center py-8">
              <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-sm text-muted-foreground">Confirming transaction on the blockchain...</p>
            </div>
          )}

          {/* Success State */}
          {paymentStatus === "completed" && (
            <div className="text-center py-6 space-y-4">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
              <div>
                <h3 className="font-semibold text-lg mb-2">Payment Successful!</h3>
                <p className="text-sm text-muted-foreground">
                  The seller has been notified. You can now coordinate pickup details.
                </p>
              </div>
              <Button
                onClick={() => onOpenChange(false)}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Continue
              </Button>
            </div>
          )}

          {/* Failed State */}
          {paymentStatus === "failed" && (
            <div className="text-center py-6 space-y-4">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
              <div>
                <h3 className="font-semibold text-lg mb-2">Payment Failed</h3>
                <p className="text-sm text-muted-foreground">
                  The payment could not be processed or has expired. Please try again.
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    setPaymentStatus("pending")
                    generatePaymentRequest()
                    startCountdown()
                  }}
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Try Again
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
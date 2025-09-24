"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/payment/ui/dialog"
import { Button } from "@/components/payment/ui/button"
import { Badge } from "@/components/payment/ui/badge"
import { Avatar, AvatarFallback } from "@/components/payment/ui/avatar"
import { Card, CardContent } from "@/components/payment/ui/card"
import { Separator } from "@/components/payment/ui/separator"
import { SolanaPayModal } from "@/components/payment/solana-pay-modal"
import ChatModal from "@/components/chat/chat-modal"
import { MapPin, Clock, Heart, MessageCircle, Star, ChevronLeft, ChevronRight } from "lucide-react"

export function ItemDetailModal({ item, open, onOpenChange }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFavorited, setIsFavorited] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [showChat, setShowChat] = useState(false)

  if (!item) return null

  const formatTimeAgo = (date) => {
    const now = new Date()
    const posted = new Date(date)
    const diffInHours = Math.floor((now - posted) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    return `${Math.floor(diffInHours / 24)}d ago`
  }

  const getConditionColor = (condition) => {
    const colors = {
      new: "bg-green-100 text-green-800",
      "like-new": "bg-blue-100 text-blue-800",
      good: "bg-yellow-100 text-yellow-800",
      fair: "bg-orange-100 text-orange-800",
      poor: "bg-red-100 text-red-800",
    }
    return colors[condition] || "bg-gray-100 text-gray-800"
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % item.images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + item.images.length) % item.images.length)
  }

  const handlePaymentComplete = (paymentData) => {
    console.log("Payment completed:", paymentData)
    setShowPayment(false)
    alert("Payment successful! The seller has been notified.")
  }

  const similarItems = [
    {
      id: 101,
      title: "Physics Textbook",
      price: 75,
      currency: "USDC",
      image: "/physics-textbook.jpg",
    },
    {
      id: 102,
      title: "iPad Air 4th Gen",
      price: 450,
      currency: "USDC",
      image: "/ipad-air.jpg",
    },
  ]

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Image Section */}
            <div className="relative">
              <div className="aspect-square relative bg-muted">
                <img
                  src={item.images[currentImageIndex] || "/placeholder.svg?height=400&width=400&query=product"}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />

                {/* Image Navigation */}
                {item.images.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 text-white"
                      onClick={prevImage}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 text-white"
                      onClick={nextImage}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>

                    {/* Image Indicators */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                      {item.images.map((_, index) => (
                        <button
                          key={index}
                          className={`w-2 h-2 rounded-full ${index === currentImageIndex ? "bg-white" : "bg-white/50"}`}
                          onClick={() => setCurrentImageIndex(index)}
                        />
                      ))}
                    </div>
                  </>
                )}

                {/* Favorite Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className={`absolute top-4 right-4 w-8 h-8 rounded-full p-0 ${
                    isFavorited ? "text-red-500" : "text-white hover:text-red-500"
                  } bg-black/20 hover:bg-black/40`}
                  onClick={() => setIsFavorited(!isFavorited)}
                >
                  <Heart className={`w-4 h-4 ${isFavorited ? "fill-current" : ""}`} />
                </Button>
              </div>
            </div>

            {/* Details Section */}
            <div className="p-6 space-y-6">
              <DialogHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <DialogTitle className="text-2xl font-bold text-balance">{item.title}</DialogTitle>
                    <div className="flex items-center gap-2">
                      <Badge className={getConditionColor(item.condition)}>{item.condition.replace("-", " ")}</Badge>
                      <Badge variant="outline">{item.category}</Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-primary">
                      ${item.price} {item.currency}
                    </div>
                  </div>
                </div>
              </DialogHeader>

              {/* Description */}
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>

              {/* Item Details */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{item.location}</span>
                  <span className="text-muted-foreground">• {item.distance} miles away</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>Posted {formatTimeAgo(item.createdAt)}</span>
                </div>
              </div>

              <Separator />

              {/* Seller Info */}
              <div className="space-y-4">
                <h3 className="font-semibold">Seller Information</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{item.seller.name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">
                        {item.seller.name || `${item.seller.address.slice(0, 4)}...${item.seller.address.slice(-4)}`}
                      </div>
                      {item.seller.reputation && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span>{item.seller.reputation} rating</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  size="lg"
                  onClick={() => setShowPayment(true)}
                >
                  Buy Now - ${item.price} {item.currency}
                </Button>
                <Button variant="outline" className="w-full bg-transparent" size="lg" onClick={() => setShowChat(true)}>
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Message Seller
                </Button>
              </div>

              {/* Similar Items */}
              <div className="space-y-3">
                <h3 className="font-semibold">Similar Items</h3>
                <div className="grid grid-cols-2 gap-3">
                  {similarItems.map((similar) => (
                    <Card key={similar.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-3">
                        <img
                          src={similar.image || "/placeholder.svg?height=80&width=80&query=product"}
                          alt={similar.title}
                          className="w-full h-16 object-cover rounded mb-2"
                        />
                        <div className="text-sm font-medium line-clamp-2 mb-1">{similar.title}</div>
                        <div className="text-sm font-bold text-primary">
                          ${similar.price} {similar.currency}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <SolanaPayModal
        item={item}
        open={showPayment}
        onOpenChange={setShowPayment}
        onPaymentComplete={handlePaymentComplete}
      />

      <ChatModal isOpen={showChat} onClose={() => setShowChat(false)} item={item} otherUser={item.seller} />
    </>
  )
}

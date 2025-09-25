"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MapPin, Clock, Heart } from "lucide-react"
import { useState } from "react"

export function ListingCard({ listing }) {
  const [isFavorited, setIsFavorited] = useState(false)

  const formatPrice = (price, currency) => {
    return `${price} ${currency}`
  }

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

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer">
      <div className="relative">
        <img
          src={listing.images[0] || "/placeholder.svg?height=200&width=300&query=textbook"}
          alt={listing.title}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        <Button
          variant="ghost"
          size="sm"
          className={`absolute top-2 right-2 w-8 h-8 rounded-full p-0 ${
            isFavorited ? "text-red-500" : "text-white hover:text-red-500"
          } bg-black/20 hover:bg-black/40`}
          onClick={(e) => {
            e.stopPropagation()
            setIsFavorited(!isFavorited)
          }}
        >
          <Heart className={`w-4 h-4 ${isFavorited ? "fill-current" : ""}`} />
        </Button>
        <div className="absolute top-2 left-2">
          <Badge className={getConditionColor(listing.condition)}>{listing.condition.replace("-", " ")}</Badge>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Price */}
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-primary">${formatPrice(listing.price, listing.currency)}</span>
            <Badge variant="outline">{listing.category}</Badge>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
            {listing.title}
          </h3>

          {/* Location & Time */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span>{listing.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{formatTimeAgo(listing.createdAt)}</span>
            </div>
          </div>

          {/* Seller Info */}
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center gap-2">
              <Avatar className="w-6 h-6">
                <AvatarFallback className="text-xs">{listing.seller.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground">
                {listing.seller.name || `${listing.seller.address.slice(0, 4)}...${listing.seller.address.slice(-4)}`}
              </span>
              {listing.seller.reputation && (
                <Badge variant="secondary" className="text-xs">
                  ⭐ {listing.seller.reputation}
                </Badge>
              )}
            </div>
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
              View
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

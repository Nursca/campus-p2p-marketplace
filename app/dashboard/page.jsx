"use client"

import { useState } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/payment/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/payment/ui/card"
import { Button } from "@/components/payment/ui/button"
import { Badge } from "@/components/payment/ui/badge"
import { Avatar, AvatarFallback } from "@/components/payment/ui/avatar"
import TransactionHistory from "@/components/payment/transaction-history"
import { ShoppingBag, DollarSign, Eye, Edit, Trash2, Heart, Star, Wallet, ExternalLink, Copy, Plus } from "lucide-react"

// Mock data
const mockUserStats = {
  totalEarned: 1250,
  itemsSold: 8,
  activeListings: 3,
  totalPurchases: 5,
  totalSpent: 890,
  savedItems: 12,
  reputation: 4.8,
  joinDate: "2024-01-01",
}

const mockActiveListings = [
  {
    id: 1,
    title: "Calculus Textbook",
    price: 85,
    currency: "USDC",
    image: "/calculus-textbook.png",
    views: 24,
    likes: 3,
    status: "active",
    createdAt: "2024-01-15T10:30:00Z",
  },
  {
    id: 2,
    title: "MacBook Air M2",
    price: 950,
    currency: "USDC",
    image: "/macbook-air-on-desk.png",
    views: 67,
    likes: 8,
    status: "active",
    createdAt: "2024-01-14T14:20:00Z",
  },
  {
    id: 3,
    title: "iPhone 13 Pro",
    price: 650,
    currency: "SOL",
    image: "/iphone-13-pro.png",
    views: 45,
    likes: 5,
    status: "sold",
    createdAt: "2024-01-13T09:15:00Z",
  },
]

const mockPurchases = [
  {
    id: 1,
    title: "Organic Chemistry Book",
    price: 75,
    currency: "USDC",
    image: "/organic-chemistry-book.jpg",
    seller: "Emma K.",
    purchaseDate: "2024-01-12T16:45:00Z",
    status: "completed",
  },
  {
    id: 2,
    title: "Gaming Chair",
    price: 180,
    currency: "USDC",
    image: "/gaming-chair.jpg",
    seller: "Alex R.",
    purchaseDate: "2024-01-10T11:20:00Z",
    status: "completed",
  },
]

const mockSavedItems = [
  {
    id: 1,
    title: "AirPods Pro",
    price: 180,
    currency: "USDC",
    image: "/airpods-pro.jpg",
    seller: "Mike T.",
    distance: "0.5 miles",
  },
  {
    id: 2,
    title: "Physics Textbook",
    price: 65,
    currency: "USDC",
    image: "/physics-textbook.jpg",
    seller: "Sarah L.",
    distance: "1.2 miles",
  },
]

export default function Dashboard() {
  const { publicKey, connected } = useWallet()
  const [activeTab, setActiveTab] = useState("overview")

  if (!connected) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <Wallet className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Connect Your Wallet</h2>
          <p className="text-gray-600 mb-6">Please connect your Solana wallet to access your dashboard.</p>
        </div>
      </div>
    )
  }

  const formatAddress = (address) => {
    if (!address) return ""
    return `${address.slice(0, 4)}...${address.slice(-4)}`
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="w-16 h-16">
              <AvatarFallback className="text-xl">{publicKey?.toString().charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
              <p className="text-gray-600">{formatAddress(publicKey?.toString())}</p>
              <div className="flex items-center space-x-2 mt-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{mockUserStats.reputation} rating</span>
                <span className="text-sm text-gray-500">• Member since {formatDate(mockUserStats.joinDate)}</span>
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigator.clipboard.writeText(publicKey?.toString() || "")}
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy Address
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="selling">Selling</TabsTrigger>
          <TabsTrigger value="buying">Buying</TabsTrigger>
          <TabsTrigger value="wallet">Wallet</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${mockUserStats.totalEarned}</div>
                <p className="text-xs text-muted-foreground">From {mockUserStats.itemsSold} sales</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockUserStats.activeListings}</div>
                <p className="text-xs text-muted-foreground">Currently for sale</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Purchases</CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockUserStats.totalPurchases}</div>
                <p className="text-xs text-muted-foreground">${mockUserStats.totalSpent} spent</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Saved Items</CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockUserStats.savedItems}</div>
                <p className="text-xs text-muted-foreground">In watchlist</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest transactions and listings</CardDescription>
            </CardHeader>
            <CardContent>
              <TransactionHistory />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Selling Tab */}
        <TabsContent value="selling" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">My Listings</h2>
              <p className="text-gray-600">Manage your active and sold items</p>
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Listing
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockActiveListings.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="aspect-square relative">
                  <img src={item.image || "/placeholder.svg"} alt={item.title} className="w-full h-full object-cover" />
                  <Badge
                    className={`absolute top-2 right-2 ${item.status === "active" ? "bg-green-500" : "bg-gray-500"}`}
                  >
                    {item.status}
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-2xl font-bold text-cyan-600 mb-3">
                    ${item.price} {item.currency}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>{item.views} views</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Heart className="w-4 h-4" />
                      <span>{item.likes} likes</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Buying Tab */}
        <TabsContent value="buying" className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">My Purchases</h2>
            <p className="text-gray-600">Items you've bought on Campus Market</p>
          </div>

          <div className="space-y-4">
            {mockPurchases.map((purchase) => (
              <Card key={purchase.id}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <img
                      src={purchase.image || "/placeholder.svg"}
                      alt={purchase.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{purchase.title}</h3>
                      <p className="text-gray-600">Sold by {purchase.seller}</p>
                      <p className="text-sm text-gray-500">Purchased on {formatDate(purchase.purchaseDate)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-gray-900">
                        ${purchase.price} {purchase.currency}
                      </p>
                      <Badge className="bg-green-100 text-green-800">{purchase.status}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">Saved Items</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockSavedItems.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <div className="aspect-square relative">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-1">{item.title}</h3>
                    <p className="text-lg font-bold text-cyan-600 mb-2">
                      ${item.price} {item.currency}
                    </p>
                    <p className="text-sm text-gray-600 mb-3">
                      {item.seller} • {item.distance}
                    </p>
                    <Button className="w-full" size="sm">
                      View Item
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Wallet Tab */}
        <TabsContent value="wallet" className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Wallet Overview</h2>
            <p className="text-gray-600">Manage your crypto balances and transactions</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                  <span>SOL Balance</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">2.45 SOL</div>
                <p className="text-gray-600">≈ $245.00 USD</p>
                <Button className="w-full mt-4 bg-transparent" variant="outline">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Buy More SOL
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
                  <span>USDC Balance</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">156.78 USDC</div>
                <p className="text-gray-600">≈ $156.78 USD</p>
                <Button className="w-full mt-4 bg-transparent" variant="outline">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Buy More USDC
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>All your blockchain transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <TransactionHistory />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

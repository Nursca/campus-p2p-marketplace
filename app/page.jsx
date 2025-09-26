"use client"

import { Header } from "@/components/layout/header"
import { CreateListingModal } from "@/components/listing/create-listing-modal"
import { ListingCard } from "@/components/listing/listing-card"
import { useWallet } from "@solana/wallet-adapter-react";
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Smartphone, Laptop, ShoppingBag, TrendingUp, Users, Shield, Plus } from "lucide-react"
import Link from "next/link"

import { mockListings} from"@/lib/items"
import { useListings } from "@/components/listing/ListingsContext"

function HomePageContent() {
  const { connected } = useWallet()
  const { listings } = useListings()

  const categories = [
    { icon: BookOpen, name: "Textbooks", count: "2.3k" },
    { icon: Laptop, name: "Electronics", count: "890" },
    { icon: Smartphone, name: "Phones", count: "456" },
    { icon: ShoppingBag, name: "Misc", count: "1.2k" },
  ]

  const features = [
    {
      icon: TrendingUp,
      title: "Fair Pricing",
      description: "AI-powered price suggestions based on market data",
    },
    {
      icon: Users,
      title: "Campus Community",
      description: "Buy and sell within your trusted campus network",
    },
    {
      icon: Shield,
      title: "Secure Payments",
      description: "Crypto payments with Solana Pay integration",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-balance">
            Campus Marketplace
            <span className="text-primary block">Made Simple</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
            Buy and sell textbooks, electronics, and campus essentials with your fellow students. Fast, secure, and
            powered by crypto.
          </p>

          {!connected ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Get Started
              </Button>
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/browse">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Browse Items
                </Button>
              </Link>
              <CreateListingModal>
                <Button variant="outline" size="lg">
                  <Plus className="w-4 h-4 mr-2" />
                  Sell Something
                </Button>
              </CreateListingModal>
            </div>
          )}
        </div>

        {/* Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Popular Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Link key={category.name} href="/browse">
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <category.icon className="w-8 h-8 mx-auto mb-3 text-primary" />
                    <h3 className="font-semibold mb-1">{category.name}</h3>
                    <Badge variant="secondary">{category.count} items</Badge>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Listings */}
        {connected && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Recent Listings</h2>
              <Link href="/browse">
                <Button variant="outline">View All</Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(listings.length ? listings : mockListings).slice(0, 6).map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          </div>
        )}

        {/* Features */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Why Choose Campus Market?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card key={feature.title}>
                <CardContent className="p-6 text-center">
                  <feature.icon className="w-12 h-12 mx-auto mb-4 text-primary" />
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-card rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4">Ready to Start Trading?</h2>
          <p className="text-muted-foreground mb-6">Join thousands of students already using Campus Market</p>
          {!connected ? (
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Connect Your Wallet
            </Button>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/browse">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Start Browsing
                </Button>
              </Link>
              <CreateListingModal>
                <Button variant="outline" size="lg">
                  <Plus className="w-4 h-4 mr-2" />
                  List Your First Item
                </Button>
              </CreateListingModal>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default function HomePage() {  
  return <HomePageContent />
}
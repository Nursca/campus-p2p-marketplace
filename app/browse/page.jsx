"use client"

import { useState, useEffect } from "react"
import { useListings } from "@/components/listing/ListingsContext"
import { Header } from "@/components/layout/header"
import { ListingCard } from "@/components/listing/listing-card"
import { ItemDetailModal } from "@/components/listing/item-detail-modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, SlidersHorizontal, Grid, List } from "lucide-react"

// Extended mock data (fallback for distances, categories meta)
const mockListings = [
  {
    id: 1,
    title: "Calculus: Early Transcendentals 8th Edition",
    description: "Excellent condition textbook, barely used. All pages intact. Perfect for MATH 151/152.",
    price: 85,
    currency: "USDC",
    category: "Textbooks",
    condition: "like-new",
    location: "Main Library",
    images: ["/calculus-textbook.png"],
    seller: {
      address: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
      name: "Sarah M.",
      reputation: 4.8,
    },
    createdAt: "2024-06-01T10:00:00Z",
    distance: 0.2,
  },
  {
    id: 2,
    title: "MacBook Air M1 13-inch",
    description: "2020 MacBook Air in great condition. Includes charger and original box. Perfect for students.",
    price: 750,
    currency: "USDC",
    category: "Electronics",
    condition: "good",
    location: "Student Union",
    images: ["/macbook-air-on-desk.png"],
    seller: {
      address: "9yKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
      name: "Mike R.",
      reputation: 4.9,
    },
    createdAt: "2024-06-01T07:00:00Z",
    distance: 0.5,
  },
  {
    id: 3,
    title: "iPhone 13 Pro 128GB",
    description: "Unlocked iPhone in excellent condition. Screen protector applied since day one.",
    price: 650,
    currency: "USDC",
    category: "Electronics",
    condition: "like-new",
    location: "North Campus",
    images: ["/iphone-13-pro.png"],
    seller: {
      address: "5xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
      name: "Alex K.",
      reputation: 4.7,
    },
    createdAt: "2024-05-31T12:00:00Z",
    distance: 0.8,
  },
  {
    id: 4,
    title: "Organic Chemistry Textbook",
    description: "Used for CHEM 201/202. Some highlighting but all pages present.",
    price: 120,
    currency: "USDC",
    category: "Textbooks",
    condition: "good",
    location: "Science Building",
    images: ["/organic-chemistry-book.jpg"],
    seller: {
      address: "3xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
      name: "Emma L.",
      reputation: 4.6,
    },
    createdAt: "2024-05-31T15:00:00Z",
    distance: 1.2,
  },
  {
    id: 5,
    title: "Gaming Chair - Ergonomic",
    description: "Comfortable gaming chair, barely used. Perfect for long study sessions.",
    price: 180,
    currency: "USDC",
    category: "Furniture",
    condition: "like-new",
    location: "Dormitory Area",
    images: ["/gaming-chair.jpg"],
    seller: {
      address: "1xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
      name: "David P.",
      reputation: 4.5,
    },
    createdAt: "2024-05-30T09:00:00Z",
    distance: 0.3,
  },
  {
    id: 6,
    title: "AirPods Pro 2nd Generation",
    description: "Like new AirPods Pro with all original accessories and box.",
    price: 180,
    currency: "USDC",
    category: "Electronics",
    condition: "like-new",
    location: "Student Union",
    images: ["/airpods-pro.jpg"],
    seller: {
      address: "8xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
      name: "Lisa W.",
      reputation: 4.9,
    },
    createdAt: "2024-05-29T18:00:00Z",
    distance: 0.4,
  },
]

const categories = ["All", "Textbooks", "Electronics", "Furniture", "Clothing", "Miscellaneous"]
const conditions = ["All", "New", "Like New", "Good", "Fair", "Poor"]
const locations = [
  "All",
  "Main Library",
  "Student Union",
  "North Campus",
  "South Campus",
  "Engineering Building",
  "Business School",
  "Dormitory Area",
]
const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "distance", label: "Distance" },
]

export default function BrowsePage() {
  const { listings: listingsFromCtx } = useListings()
  const base = listingsFromCtx.length ? listingsFromCtx : mockListings
  const [listings, setListings] = useState(base)
  const [filteredListings, setFilteredListings] = useState(base)
  const [selectedItem, setSelectedItem] = useState(null)
  const [viewMode, setViewMode] = useState("grid")

  // Filter states
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedCondition, setSelectedCondition] = useState("All")
  const [selectedLocation, setSelectedLocation] = useState("All")
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [sortBy, setSortBy] = useState("newest")
  const [showFilters, setShowFilters] = useState(false)

  // Keep local lists in sync with context listings
  useEffect(() => {
    const next = listingsFromCtx.length ? listingsFromCtx : mockListings
    setListings(next)
  }, [listingsFromCtx])

  // Apply filters
  useEffect(() => {
    let filtered = [...listings]

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Category filter
    if (selectedCategory !== "All") {
      filtered = filtered.filter((item) => item.category === selectedCategory)
    }

    // Condition filter
    if (selectedCondition !== "All") {
      filtered = filtered.filter((item) => item.condition.replace("-", " ") === selectedCondition.toLowerCase())
    }

    // Location filter
    if (selectedLocation !== "All") {
      filtered = filtered.filter((item) => item.location === selectedLocation)
    }

    // Price range filter
    filtered = filtered.filter((item) => item.price >= priceRange[0] && item.price <= priceRange[1])

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt)
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt)
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "distance":
          return a.distance - b.distance
        default:
          return 0
      }
    })

    setFilteredListings(filtered)
  }, [listings, searchQuery, selectedCategory, selectedCondition, selectedLocation, priceRange, sortBy])

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedCategory("All")
    setSelectedCondition("All")
    setSelectedLocation("All")
    setPriceRange([0, 1000])
    setSortBy("newest")
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-6">
        {/* Search and View Toggle */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search for textbooks, electronics, and more..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="bg-transparent">
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filters
            </Button>
            <div className="flex border rounded-md">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-r-none"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-l-none"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <div className={`${showFilters ? "block" : "hidden"} md:block w-full md:w-80 space-y-6`}>
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Filters</CardTitle>
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear All
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Category Filter */}
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range */}
                <div className="space-y-3">
                  <Label>Price Range</Label>
                  <div className="px-2">
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={1000}
                      min={0}
                      step={10}
                      className="w-full"
                    />
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>

                {/* Condition Filter */}
                <div className="space-y-2">
                  <Label>Condition</Label>
                  <Select value={selectedCondition} onValueChange={setSelectedCondition}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {conditions.map((condition) => (
                        <SelectItem key={condition} value={condition}>
                          {condition}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Location Filter */}
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Sort By */}
                <div className="space-y-2">
                  <Label>Sort By</Label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {sortOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold">Browse Items</h1>
                <p className="text-muted-foreground">
                  {(filteredListings?.length ?? 0)} {(filteredListings?.length === 1 ? "item" : "items")} found
                </p>
              </div>
            </div>

            {/* Active Filters */}
            {(searchQuery ||
              selectedCategory !== "All" ||
              selectedCondition !== "All" ||
              selectedLocation !== "All" ||
              priceRange[0] > 0 ||
              priceRange[1] < 1000) && (
              <div className="flex flex-wrap gap-2 mb-4">
                {searchQuery && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Search: "{searchQuery}"
                    <button onClick={() => setSearchQuery("")} className="ml-1 hover:text-destructive">
                      ×
                    </button>
                  </Badge>
                )}
                {selectedCategory !== "All" && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {selectedCategory}
                    <button onClick={() => setSelectedCategory("All")} className="ml-1 hover:text-destructive">
                      ×
                    </button>
                  </Badge>
                )}
                {selectedCondition !== "All" && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {selectedCondition}
                    <button onClick={() => setSelectedCondition("All")} className="ml-1 hover:text-destructive">
                      ×
                    </button>
                  </Badge>
                )}
                {selectedLocation !== "All" && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {selectedLocation}
                    <button onClick={() => setSelectedLocation("All")} className="ml-1 hover:text-destructive">
                      ×
                    </button>
                  </Badge>
                )}
                {(priceRange[0] > 0 || priceRange[1] < 1000) && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    ${priceRange[0]} - ${priceRange[1]}
                    <button onClick={() => setPriceRange([0, 1000])} className="ml-1 hover:text-destructive">
                      ×
                    </button>
                  </Badge>
                )}
              </div>
            )}

            {/* Listings Grid/List */}
            {((filteredListings?.length ?? 0) === 0) ? (
              <div className="text-center py-12">
                <div className="text-muted-foreground mb-4">
                  <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">No items found</h3>
                  <p>Try adjusting your filters or search terms</p>
                </div>
                <Button onClick={clearFilters} variant="outline">
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div
                className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}
              >
                {(filteredListings ?? []).map((listing) => (
                  <div key={listing.id} onClick={() => setSelectedItem(listing)}>
                    <ListingCard listing={listing} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Item Detail Modal */}
      {selectedItem && (
        <ItemDetailModal
          item={selectedItem}
          open={!!selectedItem}
          onOpenChange={(open) => !open && setSelectedItem(null)}
        />
      )}
    </div>
  )
}

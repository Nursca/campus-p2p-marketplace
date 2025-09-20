"use client"

import { useState, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Camera, Upload, X, Sparkles } from "lucide-react"
import { useWallet } from "@solana/wallet-adapter-react"

const categories = ["Textbooks", "Electronics", "Furniture", "Clothing", "Miscellaneous"]

const conditions = [
  { value: "new", label: "New", description: "Never used, in original packaging" },
  { value: "like-new", label: "Like New", description: "Barely used, excellent condition" },
  { value: "good", label: "Good", description: "Used but well maintained" },
  { value: "fair", label: "Fair", description: "Shows wear but fully functional" },
  { value: "poor", label: "Poor", description: "Heavy wear, may need repairs" },
]

const campusLocations = [
  "Main Library",
  "Student Union",
  "North Campus",
  "South Campus",
  "Engineering Building",
  "Business School",
  "Dormitory Area",
  "Other",
]

export function CreateListingModal({ children }) {
  const { connected, publicKey } = useWallet()
  const [open, setOpen] = useState(false)
  const [images, setImages] = useState([])
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    condition: "",
    price: "",
    currency: "USDC",
    location: "",
    isbn: "",
  })
  const [suggestedPrice, setSuggestedPrice] = useState(null)
  const [isGeneratingPrice, setIsGeneratingPrice] = useState(false)
  const fileInputRef = useRef(null)
  const cameraInputRef = useRef(null)

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files)
    if (images.length + files.length > 5) {
      alert("Maximum 5 images allowed")
      return
    }

    files.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImages((prev) => [
          ...prev,
          {
            id: Date.now() + Math.random(),
            url: e.target.result,
            file,
          },
        ])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (id) => {
    setImages((prev) => prev.filter((img) => img.id !== id))
  }

  const generatePriceSuggestion = async () => {
    if (!formData.title || !formData.category || !formData.condition) {
      alert("Please fill in title, category, and condition first")
      return
    }

    setIsGeneratingPrice(true)

    // Simulate AI price suggestion
    setTimeout(() => {
      const basePrice =
        formData.category === "Textbooks"
          ? 45
          : formData.category === "Electronics"
            ? 120
            : formData.category === "Furniture"
              ? 80
              : 35

      const conditionMultiplier =
        {
          new: 1.0,
          "like-new": 0.85,
          good: 0.7,
          fair: 0.5,
          poor: 0.3,
        }[formData.condition] || 0.7

      const suggested = Math.round(basePrice * conditionMultiplier)
      const range = {
        min: Math.round(suggested * 0.8),
        max: Math.round(suggested * 1.2),
      }

      setSuggestedPrice({
        suggested,
        range,
        reasoning: `Similar ${formData.category.toLowerCase()} in ${formData.condition} condition typically sell for $${range.min}-$${range.max}`,
      })
      setIsGeneratingPrice(false)
    }, 2000)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!connected) {
      alert("Please connect your wallet first")
      return
    }

    // Here you would typically submit to your backend
    console.log("Listing data:", { formData, images, seller: publicKey.toString() })
    alert("Listing created successfully!")
    setOpen(false)

    // Reset form
    setFormData({
      title: "",
      description: "",
      category: "",
      condition: "",
      price: "",
      currency: "USDC",
      location: "",
      isbn: "",
    })
    setImages([])
    setSuggestedPrice(null)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>List an Item</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload Section */}
          <div className="space-y-4">
            <Label>Photos (up to 5)</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {images.map((image) => (
                <div key={image.id} className="relative group">
                  <img
                    src={image.url || "/placeholder.svg"}
                    alt="Upload preview"
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeImage(image.id)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ))}

              {images.length < 5 && (
                <div className="flex flex-col gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-24 border-dashed bg-transparent"
                    onClick={() => cameraInputRef.current?.click()}
                  >
                    <Camera className="w-6 h-6" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-24 border-dashed bg-transparent"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-6 h-6" />
                  </Button>
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImageUpload}
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Calculus Textbook 8th Edition"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
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
          </div>

          {/* Textbook ISBN */}
          {formData.category === "Textbooks" && (
            <div className="space-y-2">
              <Label htmlFor="isbn">ISBN (optional)</Label>
              <Input
                id="isbn"
                placeholder="978-0123456789"
                value={formData.isbn}
                onChange={(e) => setFormData((prev) => ({ ...prev, isbn: e.target.value }))}
              />
            </div>
          )}

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the item's condition, any included accessories, etc."
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          {/* Condition */}
          <div className="space-y-2">
            <Label>Condition *</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {conditions.map((condition) => (
                <Card
                  key={condition.value}
                  className={`cursor-pointer transition-colors ${
                    formData.condition === condition.value ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => setFormData((prev) => ({ ...prev, condition: condition.value }))}
                >
                  <CardContent className="p-3">
                    <div className="font-medium">{condition.label}</div>
                    <div className="text-xs text-muted-foreground">{condition.description}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Price Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Price *</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={generatePriceSuggestion}
                disabled={isGeneratingPrice}
                className="text-xs bg-transparent"
              >
                <Sparkles className="w-3 h-3 mr-1" />
                {isGeneratingPrice ? "Analyzing..." : "Get AI Suggestion"}
              </Button>
            </div>

            {suggestedPrice && (
              <Card className="bg-accent/50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span className="font-medium">Suggested Price: ${suggestedPrice.suggested}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{suggestedPrice.reasoning}</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2 bg-transparent"
                    onClick={() => setFormData((prev) => ({ ...prev, price: suggestedPrice.suggested.toString() }))}
                  >
                    Use This Price
                  </Button>
                </CardContent>
              </Card>
            )}

            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  placeholder="0.00"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                  required
                />
              </div>
              <Select
                value={formData.currency}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, currency: value }))}
              >
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USDC">USDC</SelectItem>
                  <SelectItem value="SOL">SOL</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Pickup Location *</Label>
            <Select
              value={formData.location}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, location: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select pickup location" />
              </SelectTrigger>
              <SelectContent>
                {campusLocations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Submit Button */}
          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
              List Item
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

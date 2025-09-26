// app/cart/page.jsx
"use client"

import { Button } from "@/components/ui/button"
import { ShoppingCart, Trash2, Plus, Minus } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { SolanaPayModal } from "@/components/payment/solana-pay-modal"

export default function CartPage() {
  // State for cart items
  const [cartItems, setCartItems] = useState([
    { 
      id: 1, 
      name: "Calculus Textbook", 
      title: "Calculus Textbook",
      price: 45, 
      quantity: 1, 
      currency: "SOL",
      condition: "like-new",
      seller: {
        address: "SellerWalletAddress123",
        name: "John Doe"
      },
      images: ["/placeholder.svg?height=60&width=60&query=textbook"]
    },
    { 
      id: 2, 
      name: "Macbook Pro", 
      title: "Macbook Pro",
      price: 1200, 
      quantity: 1, 
      currency: "USDC",
      condition: "excellent",
      seller: {
        address: "SellerWalletAddress456",
        name: "Jane Smith"
      },
      images: ["/placeholder.svg?height=60&width=60&query=laptop"]
    }
  ])

  // State for payment modal
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [checkoutType, setCheckoutType] = useState("single") // "single" or "all"

  // Function to increase quantity
  const increaseQuantity = (id) => {
    setCartItems(cartItems.map(item => 
      item.id === id 
        ? { ...item, quantity: item.quantity + 1 }
        : item
    ))
  }

  // Function to decrease quantity
  const decreaseQuantity = (id) => {
    setCartItems(cartItems.map(item => 
      item.id === id && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    ))
  }

  // Function to remove item from cart
  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id))
  }

  // Function to handle checkout for individual item
  const handleCheckoutItem = (item) => {
    setSelectedItem(item)
    setCheckoutType("single")
    setIsPaymentModalOpen(true)
  }

  // Function to handle checkout for entire cart
  const handleCheckoutAll = () => {
    if (cartItems.length > 0) {
      // Create a combined item representing the entire cart
      const combinedItem = {
        id: 'cart-total', // Special ID for cart total
        name: `Cart with ${cartItems.length} items`,
        title: `Cart Purchase (${cartItems.length} items)`,
        price: subtotal,
        quantity: 1,
        currency: determineCartCurrency(cartItems),
        condition: "mixed",
        seller: {
          address: getPrimarySeller(cartItems).address,
          name: getPrimarySeller(cartItems).name
        },
        images: cartItems[0]?.images || ["/placeholder.svg"],
        // Include all items for reference
        allItems: [...cartItems]
      }
      setSelectedItem(combinedItem)
      setCheckoutType("all")
      setIsPaymentModalOpen(true)
    }
  }

  // Helper function to determine cart currency (prioritize SOL if mixed)
  const determineCartCurrency = (items) => {
    const currencies = items.map(item => item.currency)
    return currencies.includes("SOL") ? "SOL" : currencies[0] || "SOL"
  }

  // Helper function to get primary seller (for simplicity, use the first seller)
  const getPrimarySeller = (items) => {
    return items[0]?.seller || { address: "Unknown", name: "Unknown Seller" }
  }

  // Function to handle payment completion
  const handlePaymentComplete = (paymentData) => {
    console.log("Payment completed:", paymentData)
    
    if (paymentData.item) {
      if (paymentData.item.id === 'cart-total') {
        // If it was a cart total purchase, clear the entire cart
        setCartItems([])
      } else {
        // If it was a single item purchase, remove that specific item
        setCartItems(cartItems.filter(item => item.id !== paymentData.item.id))
      }
    }
  }

  // Calculate subtotal
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0)

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
        
        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart className="w-24 h-24 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">Start shopping to add items to your cart</p>
            <Link href="/browse">
              <Button>Browse Items</Button>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="md:col-span-2">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between border-b py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                      <ShoppingCart className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-primary font-medium">${item.price} {item.currency}</p>
                      <p className="text-sm text-muted-foreground">Total: ${(item.price * item.quantity).toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">Condition: {item.condition.replace("-", " ")}</p>
                      <p className="text-xs text-muted-foreground">Seller: {item.seller.name}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => decreaseQuantity(item.id)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="px-3 min-w-[2rem] text-center font-medium">{item.quantity}</span>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => increaseQuantity(item.id)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <Button 
                      onClick={() => handleCheckoutItem(item)}
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                      size="sm"
                    >
                      Checkout
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Order Summary */}
            <div className="bg-muted/50 p-6 rounded-lg h-fit sticky top-4">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Items ({totalItems})</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between font-semibold text-lg border-t pt-2">
                  <span>Total</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
              </div>
              
              {/* Checkout All Button */}
              <Button 
                onClick={handleCheckoutAll}
                className="w-full" 
                size="lg"
                disabled={cartItems.length === 0}
              >
                Proceed to Checkout All ({cartItems.length} items)
              </Button>
              
              {/* Clear cart button */}
              <Button 
                variant="outline" 
                className="w-full mt-3" 
                onClick={() => setCartItems([])}
                disabled={cartItems.length === 0}
              >
                Clear Cart
              </Button>
              
              {/* Individual item checkout note */}
              <p className="text-xs text-muted-foreground mt-3 text-center">
                You can checkout individual items using the buttons next to each item.
              </p>

              {/* Cart summary */}
              <div className="mt-4 p-3 bg-background rounded-lg">
                <h4 className="font-semibold text-sm mb-2">Cart Contains:</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  {cartItems.map((item, index) => (
                    <li key={index} className="flex justify-between">
                      <span>{item.name}</span>
                      <span>${item.price} {item.currency}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Solana Pay Modal */}
      <SolanaPayModal
        item={selectedItem}
        open={isPaymentModalOpen}
        onOpenChange={setIsPaymentModalOpen}
        onPaymentComplete={handlePaymentComplete}
        checkoutType={checkoutType}
      />
    </>
  )
}
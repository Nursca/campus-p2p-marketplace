"use client"

import { useState } from "react"
import { useCart } from "@/components/cart/CartContext"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Trash2, Plus, Minus, ShoppingCart, ArrowRight, CreditCard } from "lucide-react"

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getCartTotal, getCartItemsCount } = useCart()
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId)
    } else {
      updateQuantity(itemId, newQuantity)
    }
  }

  const handleCheckout = () => {
    setIsCheckingOut(true)
    // Simulate checkout process
    setTimeout(() => {
      clearCart()
      setIsCheckingOut(false)
    }, 2000)
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <ShoppingCart className="w-24 h-24 mx-auto mb-6 text-muted-foreground/50" />
            <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Looks like you haven't added any items to your cart yet. Start shopping to find great deals!
            </p>
            <Button size="lg" onClick={() => window.location.href = '/browse'}>
              Start Shopping
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="lg:flex-1">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold">Shopping Cart</h1>
                <p className="text-muted-foreground">
                  {getCartItemsCount()} {getCartItemsCount() === 1 ? 'item' : 'items'} in your cart
                </p>
              </div>
              <Button variant="outline" onClick={clearCart} className="text-destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                Clear Cart
              </Button>
            </div>

            <div className="space-y-4">
              {cartItems.map((item) => (
                <Card key={item.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      {/* Item Image */}
                      <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                        {item.images?.[0] ? (
                          <img 
                            src={item.images[0]} 
                            alt={item.title}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <ShoppingCart className="w-8 h-8 text-muted-foreground" />
                        )}
                      </div>

                      {/* Item Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg truncate">{item.title}</h3>
                        <p className="text-muted-foreground text-sm line-clamp-2">{item.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary">{item.category}</Badge>
                          <Badge variant="outline">{item.condition}</Badge>
                        </div>
                      </div>

                      {/* Price and Quantity */}
                      <div className="flex flex-col items-end gap-3">
                        <div className="text-right">
                          <p className="text-2xl font-bold">${item.price}</p>
                          <p className="text-sm text-muted-foreground">{item.currency}</p>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                            className="w-16 text-center"
                            min="1"
                          />
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCart(item.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-80">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal ({getCartItemsCount()} items)</span>
                    <span>${getCartTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Taxes</span>
                    <span>Calculated at checkout</span>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${getCartTotal().toFixed(2)}</span>
                  </div>
                </div>

                <Button 
                  size="lg" 
                  className="w-full" 
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                >
                  {isCheckingOut ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Checkout with USDC
                    </>
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  You won't be charged until you complete the purchase
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
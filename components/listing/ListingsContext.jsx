"use client"

import { createContext, useContext, useMemo, useState } from "react"
import { mockListings as initialMock } from "@/lib/items"

const ListingsContext = createContext(null)

export function ListingsProvider({ children }) {
  const [listings, setListings] = useState(initialMock)

  const addListing = (newListing) => {
    setListings((prev) => {
      const id = newListing.id ?? (prev.length ? Math.max(...prev.map((l) => l.id)) + 1 : 1)
      const createdAt = newListing.createdAt ?? new Date().toISOString()
      return [{ ...newListing, id, createdAt }, ...prev]
    })
  }

  const value = useMemo(() => ({ listings, addListing }), [listings])
  return <ListingsContext.Provider value={value}>{children}</ListingsContext.Provider>
}

export function useListings() {
  const ctx = useContext(ListingsContext)
  if (!ctx) throw new Error("useListings must be used within ListingsProvider")
  return ctx
}



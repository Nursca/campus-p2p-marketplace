export const mockListings = [
  {
    id: 1,
    title: "Calculus: Early Transcendentals 8th Edition",
    description: "Excellent condition textbook, barely used. All pages intact.",
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
    createdAt: "2024-06-01T10:00:00Z", // 2 hours ago
  },
  {
    id: 2,
    title: "MacBook Air M1 13-inch",
    description: "2020 MacBook Air in great condition. Includes charger and original box.",
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
    createdAt: "2024-06-01T07:00:00Z", // 5 hours ago
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
    createdAt: "2024-05-31T12:00:00Z", // 1 day ago
  },
]

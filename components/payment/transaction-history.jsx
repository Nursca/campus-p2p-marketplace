"use client"

// Mock transaction data
const mockTransactions = [
  {
    id: 1,
    type: "purchase",
    item: {
      title: "Calculus Textbook",
      image: "/calculus-textbook.png",
    },
    amount: 85,
    currency: "USDC",
    seller: {
      name: "Sarah M.",
      address: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
    },
    signature:
      "5j7K8L9M0N1O2P3Q4R5S6T7U8V9W0X1Y2Z3A4B5C6D7E8F9G0H1I2J3K4L5M6N7O8P9Q0R1S2T3U4V5W6X7Y8Z9A0B1C2D3E4F5G6H7I8J9K0L1M2N3O4P5Q6R7S8T9U0V1W2X3Y4Z5A6B7C8D9E0F1G2H3I4J5K6L7M8N9O0P1Q2R3S4T5U6V7W8X9Y0Z1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0T1U2V3W4X5Y6Z7A8B9C0D1E2F3G4H5I6J7K8L9M0N1O2P",
    timestamp: "2024-01-15T10:30:00Z",
    status: "completed",
  },
  {
    id: 2,
    type: "sale",
    item: {
      title: "MacBook Air M2",
      image: "/macbook-air-on-desk.png",
    },
    amount: 950,
    currency: "USDC",
    buyer: {
      name: "Mike R.",
      address: "9xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
    },
    signature:
      "3j7K8L9M0N1O2P3Q4R5S6T7U8V9W0X1Y2Z3A4B5C6D7E8F9G0H1I2J3K4L5M6N7O8P9Q0R1S2T3U4V5W6X7Y8Z9A0B1C2D3E4F5G6H7I8J9K0L1M2N3O4P5Q6R7S8T9U0V1W2X3Y4Z5A6B7C8D9E0F1G2H3I4J5K6L7M8N9O0P1Q2R3S4T5U6V7W8X9Y0Z1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0T1U2V3W4X5Y6Z7A8B9C0D1E2F3G4H5I6J7K8L9M0N1O2P",
    timestamp: "2024-01-14T14:20:00Z",
    status: "completed",
  },
  {
    id: 3,
    type: "purchase",
    item: {
      title: "iPhone 13 Pro",
      image: "/iphone-13-pro.png",
    },
    amount: 650,
    currency: "SOL",
    seller: {
      name: "Emma K.",
      address: "8xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
    },
    signature:
      "2j7K8L9M0N1O2P3Q4R5S6T7U8V9W0X1Y2Z3A4B5C6D7E8F9G0H1I2J3K4L5M6N7O8P9Q0R1S2T3U4V5W6X7Y8Z9A0B1C2D3E4F5G6H7I8J9K0L1M2N3O4P5Q6R7S8T9U0V1W2X3Y4Z5A6B7C8D9E0F1G2H3I4J5K6L7M8N9O0P1Q2R3S4T5U6V7W8X9Y0Z1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0T1U2V3W4X5Y6Z7A8B9C0D1E2F3G4H5I6J7K8L9M0N1O2P",
    timestamp: "2024-01-13T09:15:00Z",
    status: "completed",
  },
]

export default function TransactionHistory() {
  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatAddress = (address) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Transaction History</h3>

      <div className="space-y-3">
        {mockTransactions.map((transaction) => (
          <div
            key={transaction.id}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <img
                  src={transaction.item.image || "/placeholder.svg"}
                  alt={transaction.item.title}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{transaction.item.title}</h4>
                  <p className="text-sm text-gray-600">
                    {transaction.type === "purchase" ? "Purchased from" : "Sold to"}{" "}
                    {transaction.type === "purchase" ? transaction.seller.name : transaction.buyer.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatAddress(
                      transaction.type === "purchase" ? transaction.seller.address : transaction.buyer.address,
                    )}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <div className="flex items-center space-x-1">
                  <span
                    className={`text-lg font-semibold ${
                      transaction.type === "purchase" ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {transaction.type === "purchase" ? "-" : "+"}
                    {transaction.amount} {transaction.currency}
                  </span>
                </div>
                <p className="text-xs text-gray-500">{formatDate(transaction.timestamp)}</p>
                <div className="flex items-center space-x-1 mt-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-green-600 capitalize">{transaction.status}</span>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Transaction ID: {transaction.id}</span>
                <button className="text-cyan-600 hover:text-cyan-700 font-medium">View on Explorer</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {mockTransactions.length === 0 && (
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions yet</h3>
          <p className="text-gray-600">
            Your transaction history will appear here once you start buying or selling items.
          </p>
        </div>
      )}
    </div>
  )
}

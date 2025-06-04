"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Plus, Minus, X, ShoppingCart } from "lucide-react"
import PaymentModal from "./payment-modal"
import { useRouter } from "next/navigation"

interface DonationItem {
  id: string
  title: string
  amount: number
  quantity: number
}

interface DonationSidebarProps {
  selectedItems: DonationItem[]
  onUpdateQuantity: (id: string, quantity: number) => void
  onRemoveItem: (id: string) => void
  onAddMoreItems: () => void
  onDonate: () => void
}

export default function DonationSidebar({
  selectedItems,
  onUpdateQuantity,
  onRemoveItem,
  onAddMoreItems,
  onDonate,
}: DonationSidebarProps) {
  const router = useRouter()
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  const totalAmount = selectedItems.reduce((sum, item) => sum + item.amount * item.quantity, 0)
  const hasItems = selectedItems.length > 0

  const handleDonateClick = () => {
    setShowPaymentModal(true)
  }

  const handlePaymentSuccess = () => {
    clearCart()
    router.refresh()
  }

  const clearCart = () => {
    selectedItems.forEach(item => onRemoveItem(item.id))
  }

  return (
    <div className="sticky top-24 h-[calc(100vh-8rem)]">
      <Card className="w-full bg-white border-green-200 shadow-lg h-full flex flex-col">
        <CardContent className="p-4 flex flex-col h-full">
          {/* Selected Items */}
          {hasItems && (
            <div className="flex-1 flex flex-col min-h-0">
              <h3 className="font-semibold text-gray-900 text-lg mb-3">Your Donations</h3>
              <div className="flex-1 overflow-y-auto pr-2 min-h-0 mb-3" style={{ maxHeight: "calc(100vh - 24rem)" }}>
                <div className="space-y-3">
                  {selectedItems.map((item) => (
                    <div key={item.id} className="bg-gray-50 rounded-lg p-3 border border-green-100">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-medium text-gray-900">{item.title}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onRemoveItem(item.id)}
                          className="h-6 w-6 p-0 text-gray-400 hover:text-red-500 hover:bg-red-50"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="h-7 w-7 p-0 border-green-300 hover:bg-green-50"
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="text-sm font-medium w-8 text-center bg-white py-1 px-2 rounded border border-green-200">
                            {item.quantity}
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="h-7 w-7 p-0 border-green-300 hover:bg-green-50"
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                        <span className="text-sm font-bold text-green-600">₹{item.amount * item.quantity}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sticky Bottom Section */}
              <div className="sticky bottom-0 bg-white pt-2">
                <Separator className="bg-green-200 mb-3" />
                <div className="flex justify-between items-center font-bold text-lg bg-gray-50 p-3 rounded-lg border border-green-200 mb-3">
                  <span className="text-gray-900">Total:</span>
                  <span className="text-green-600">₹{totalAmount}</span>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    onClick={onAddMoreItems}
                    className="w-full border-green-600 text-green-600 hover:bg-green-50 font-medium"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add More
                  </Button>

                  <Button
                    onClick={handleDonateClick}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-6 text-lg"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Proceed to Payment
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!hasItems && (
            <div className="flex-1 flex items-center justify-center">
              <Button
                onClick={onAddMoreItems}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-6 text-lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Your Donation
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        amount={totalAmount}
        onSuccess={handlePaymentSuccess}
        clearCart={clearCart}
      />
    </div>
  )
}

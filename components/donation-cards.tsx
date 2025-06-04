"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Stethoscope, Home, Utensils, Shirt, CircleDollarSign, Check } from "lucide-react"
import { Input } from "@/components/ui/input"
import DonationSidebar from "./donation-sidebar"

interface DonationItem {
  id: string
  title: string
  amount: number
  quantity: number
}

const QUICK_AMOUNTS = [50, 500, 1000, 5000]
const MIN_AMOUNT = 50

const donationCategories = [
  {
    id: "food",
    title: "Food & Nutrition",
    description: "Provide nutritious meals and clean water for hungry dogs. Help us ensure no dog goes to bed hungry.",
    icon: Utensils,
    color: "bg-orange-100 text-orange-600",
    amount: 500,
    impact: "Feeds 5 dogs for a week",
  },
  {
    id: "medical",
    title: "Medical Care",
    description: "Emergency treatments, vaccinations, and regular health checkups for injured and sick dogs.",
    icon: Stethoscope,
    color: "bg-red-100 text-red-600",
    amount: 1500,
    impact: "Covers medical care for 1 dog",
  },
  {
    id: "shelter",
    title: "Shelter & Housing",
    description: "Safe and comfortable shelter with proper bedding and protection from harsh weather.",
    icon: Home,
    color: "bg-blue-100 text-blue-600",
    amount: 2000,
    impact: "Provides shelter for 1 month",
  },
  {
    id: "clothing",
    title: "Winter Care",
    description: "Warm clothing and blankets to protect our furry friends during cold winter months.",
    icon: Shirt,
    color: "bg-purple-100 text-purple-600",
    amount: 800,
    impact: "Winter care for 3 dogs",
  },
  {
    id: "custom",
    title: "Any Amount",
    description: `Choose your own amount to donate (minimum ₹${MIN_AMOUNT}). Every contribution makes a difference in the lives of our furry friends.`,
    icon: CircleDollarSign,
    color: "bg-green-100 text-green-600",
    amount: 0,
    impact: "Your choice of impact",
    isCustom: true
  },
  {
    id: "emergency",
    title: "Emergency Fund",
    description: "Critical care fund for dogs in life-threatening situations that need immediate medical attention.",
    icon: Heart,
    color: "bg-pink-100 text-pink-600",
    amount: 5000,
    impact: "Saves a life in emergency",
  },
]

export default function DonationCards() {
  const [selectedItems, setSelectedItems] = useState<DonationItem[]>([])
  const [customAmount, setCustomAmount] = useState<string>("")
  const [selectedQuickAmount, setSelectedQuickAmount] = useState<number | null>(null)

  const addItem = (category: (typeof donationCategories)[0], amount?: number) => {
    const itemId = amount ? `${category.id}-${amount}` : category.id
    
    // Remove any previous custom amounts
    setSelectedItems(items => items.filter(item => !item.id.startsWith('custom-')))
    
    const existingItem = selectedItems.find((item) => item.id === itemId)
    
    if (existingItem) {
      setSelectedItems((items) =>
        items.map((item) => 
          item.id === itemId
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        ),
      )
    } else {
      setSelectedItems((items) => [
        ...items,
        {
          id: itemId,
          title: amount ? `${category.title} (₹${amount})` : category.title,
          amount: amount || category.amount,
          quantity: 1,
        },
      ])
    }
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
    } else {
      setSelectedItems((items) => items.map((item) => (item.id === id ? { ...item, quantity } : item)))
    }
  }

  const removeItem = (id: string) => {
    setSelectedItems((items) => items.filter((item) => item.id !== id))
    // If removing a custom amount, also clear the selected quick amount
    if (id.startsWith('custom-')) {
      setSelectedQuickAmount(null)
      setCustomAmount("")
    }
  }

  const handleAddMoreItems = () => {
    document.getElementById("donate")?.scrollIntoView({ behavior: "smooth" })
  }

  const handleDonate = () => {
    // Handle donation process
    alert("Proceeding to payment...")
  }

  const isItemSelected = (id: string, amount?: number) => {
    const itemId = amount ? `${id}-${amount}` : id
    return selectedItems.some((item) => item.id === itemId)
  }

  const handleCustomAmountSubmit = (category: (typeof donationCategories)[0]) => {
    const numAmount = parseInt(customAmount)
    if (numAmount >= MIN_AMOUNT) {
      addItem(category, numAmount)
      // Clear the quick amount selection after adding to cart
      setSelectedQuickAmount(null)
    }
  }

  const handleQuickAmountSelect = (category: (typeof donationCategories)[0], amount: number) => {
    // If this amount is already selected, deselect it
    if (selectedQuickAmount === amount) {
      setSelectedQuickAmount(null)
      setCustomAmount("")
    } else {
      setSelectedQuickAmount(amount)
      setCustomAmount(amount.toString())
    }
  }

  return (
    <section id="donate" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Way to Help</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Every contribution makes a difference. Select the cause that touches your heart and help us provide the best
            care for our furry friends.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
              {donationCategories.map((category) => {
                const IconComponent = category.icon
                const isSelected = isItemSelected(category.id)
                return (
                  <Card
                    key={category.id}
                    className={`group hover:shadow-xl transition-all duration-300 border-2 flex flex-col ${
                      isSelected ? "border-green-500 bg-green-50" : "hover:border-green-200"
                    }`}
                  >
                    <CardHeader className="text-center pb-4">
                      <div
                        className={`w-16 h-16 rounded-full ${category.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform relative`}
                      >
                        <IconComponent className="w-8 h-8" />
                        {isSelected && (
                          <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                            <Check className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                      <CardTitle className="text-xl font-bold text-gray-900">{category.title}</CardTitle>
                      <CardDescription className="text-gray-600 min-h-[80px]">{category.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center space-y-4 flex-grow flex flex-col justify-end">
                      {category.isCustom ? (
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-2 mb-3">
                            {QUICK_AMOUNTS.map((amount) => {
                              const isAmountSelected = selectedQuickAmount === amount
                              return (
                                <Button
                                  key={amount}
                                  variant={isAmountSelected ? "default" : "outline"}
                                  onClick={() => handleQuickAmountSelect(category, amount)}
                                  className={`w-full ${
                                    isAmountSelected 
                                      ? "bg-green-600 hover:bg-green-700 text-white"
                                      : "border-green-200 hover:bg-green-50 hover:border-green-300"
                                  }`}
                                >
                                  ₹{amount}
                                </Button>
                              )
                            })}
                          </div>
                          <div className="relative">
                            <Input
                              type="number"
                              min={MIN_AMOUNT}
                              placeholder={`Enter amount (min ₹${MIN_AMOUNT})`}
                              value={customAmount}
                              onChange={(e) => {
                                setCustomAmount(e.target.value)
                                // Clear quick amount selection when manually typing
                                if (selectedQuickAmount !== null) {
                                  setSelectedQuickAmount(null)
                                }
                              }}
                              className="pl-8"
                            />
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                          </div>
                          {customAmount && parseInt(customAmount) < MIN_AMOUNT && (
                            <p className="text-red-500 text-sm">Minimum amount is ₹{MIN_AMOUNT}</p>
                          )}
                          <Button
                            onClick={() => handleCustomAmountSubmit(category)}
                            disabled={!customAmount || parseInt(customAmount) < MIN_AMOUNT}
                            className="w-full bg-green-600 hover:bg-green-700 text-white"
                          >
                            <Heart className="w-4 h-4 mr-2" />
                            Add Custom Amount
                          </Button>
                        </div>
                      ) : (
                        <>
                          <div className="bg-gray-50 rounded-lg p-4">
                            <div className="text-3xl font-bold text-green-600">₹{category.amount}</div>
                            <div className="text-sm text-gray-600">{category.impact}</div>
                          </div>
                          <Button
                            onClick={() => addItem(category)}
                            className={`w-full ${
                              isSelected ? "bg-green-600 hover:bg-green-700" : "bg-green-600 hover:bg-green-700"
                            } text-white mt-auto`}
                          >
                            <Heart className="w-4 h-4 mr-2" />
                            {isSelected ? "Add More" : "Add to Donation"}
                          </Button>
                        </>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          <div className="lg:col-span-2">
            <DonationSidebar
              selectedItems={selectedItems}
              onUpdateQuantity={updateQuantity}
              onRemoveItem={removeItem}
              onAddMoreItems={handleAddMoreItems}
              onDonate={handleDonate}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

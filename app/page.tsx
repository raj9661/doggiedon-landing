"use client"

import Header from "@/components/header"
import Hero from "@/components/hero"
import Testimonials from "@/components/testimonials"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import Footer from "@/components/footer"
import { useState, useEffect } from "react"
import { NavigationItem } from "@/lib/navigation"

export default function Home() {
  const [donateLink, setDonateLink] = useState('')

  useEffect(() => {
    const fetchNavigationItems = async () => {
      try {
        const response = await fetch('/api/admin/navigation')
        if (!response.ok) {
          throw new Error('Failed to fetch navigation items')
        }
        const data = await response.json()
        const donateItem = data.items.find((item: NavigationItem) => item.label.toLowerCase() === 'donate')
        if (donateItem) {
          setDonateLink(donateItem.href)
        }
      } catch (err) {
        console.error('Error fetching navigation items:', err)
      }
    }

    fetchNavigationItems()
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      
      {/* Donation CTA Section */}
      <section className="py-20 bg-gradient-to-b from-white to-green-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Ready to Make a Difference?</h2>
            <p className="text-xl text-gray-600 mb-8">
              Your support can help provide food, shelter, medical care, and love to dogs in need. Every donation, big or small, makes a real impact.
            </p>
            {donateLink && (
              <a
                href={donateLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 rounded-lg text-lg">
                  <Heart className="w-6 h-6 mr-2" />
                  Donate Now
                </Button>
              </a>
            )}
          </div>
        </div>
      </section>

      <Testimonials />
      <Footer />
    </div>
  )
}

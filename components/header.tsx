"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, Heart, ExternalLink } from "lucide-react"
import { useState, useEffect } from "react"
import { NavigationItem, defaultNavigationItems } from "@/lib/navigation"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [navigationItems, setNavigationItems] = useState<NavigationItem[]>([])
  const [loading, setLoading] = useState(true)
  const [donateLink, setDonateLink] = useState('')

  useEffect(() => {
    const fetchNavigationItems = async () => {
      try {
        console.log('Fetching navigation items...')
        const response = await fetch('/api/admin/navigation', {
          // Add cache control headers
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache'
          }
        })
        console.log('Navigation API response status:', response.status)
        
        if (!response.ok) {
          const errorText = await response.text()
          console.error('Navigation API error:', {
            status: response.status,
            statusText: response.statusText,
            body: errorText
          })
          // Use default items on error
          console.log('Using default navigation items due to API error')
          setNavigationItems(defaultNavigationItems)
          return
        }
        
        const data = await response.json()
        console.log('Navigation items received:', data)
        
        if (!data.items || !Array.isArray(data.items)) {
          console.error('Invalid navigation items data:', data)
          // Use default items if data is invalid
          console.log('Using default navigation items due to invalid data')
          setNavigationItems(defaultNavigationItems)
          return
        }
        
        const items = data.items.filter((item: NavigationItem) => item.isActive)
        console.log('Filtered active navigation items:', items)
        
        // If no active items, use defaults
        if (items.length === 0) {
          console.log('No active items found, using default navigation items')
          setNavigationItems(defaultNavigationItems)
          return
        }
        
        setNavigationItems(items)
        // Find the donate link
        const donateItem = items.find((item: NavigationItem) => item.label.toLowerCase() === 'donate')
        if (donateItem) {
          setDonateLink(donateItem.href)
        }
      } catch (err) {
        console.error('Error fetching navigation items:', err)
        // Use default items on any error
        console.log('Using default navigation items due to fetch error')
        setNavigationItems(defaultNavigationItems)
      } finally {
        setLoading(false)
      }
    }

    fetchNavigationItems()
  }, [])

  const isExternalLink = (href: string) => {
    return href.startsWith('http://') || href.startsWith('https://')
  }

  const renderNavLink = (item: NavigationItem, className: string) => {
    if (isExternalLink(item.href)) {
      return (
        <a
          key={item.id}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`${className} flex items-center gap-1`}
        >
          {item.label}
          <ExternalLink className="w-3 h-3" />
        </a>
      )
    }
    return (
      <Link
        key={item.id}
        href={item.href}
        className={className}
      >
        {item.label}
      </Link>
    )
  }

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <Image src="/logo.png" alt="DoggieDon Logo" width={50} height={50} className="rounded-full" />
            <div>
              <h1 className="text-2xl font-bold text-green-700">DoggieDon</h1>
              <p className="text-sm text-gray-600">Caring for Every Paw</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => 
              renderNavLink(item, "text-gray-700 hover:text-green-600 transition-colors")
            )}
          </nav>

          {/* Donate Button */}
          <div className="hidden md:flex items-center">
            {donateLink && (
              <a
                href={donateLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  <Heart className="w-4 h-4 mr-2" />
                  Donate Now
                </Button>
              </a>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t">
            <nav className="flex flex-col space-y-4 mt-4">
              {navigationItems.map((item) => 
                renderNavLink(
                  item,
                  "text-gray-700 hover:text-green-600 flex items-center gap-1"
                )
              )}
              {donateLink && (
                <a
                  href={donateLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full"
                >
                  <Button className="bg-green-600 hover:bg-green-700 text-white w-full">
                    <Heart className="w-4 h-4 mr-2" />
                    Donate Now
                  </Button>
                </a>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

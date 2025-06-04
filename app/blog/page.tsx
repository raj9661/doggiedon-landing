"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Download, ExternalLink, BookOpen } from "lucide-react"
import { useState, useEffect } from "react"
import { NavigationItem } from "@/lib/navigation"

export default function BlogPage() {
  const [apkLink, setApkLink] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNavigationItems = async () => {
      try {
        const response = await fetch('/api/admin/navigation')
        if (!response.ok) {
          throw new Error('Failed to fetch navigation items')
        }
        const data = await response.json()
        const apkItem = data.items.find((item: NavigationItem) => 
          item.label.toLowerCase() === 'download app' || 
          item.label.toLowerCase() === 'get app'
        )
        if (apkItem) {
          setApkLink(apkItem.href)
        }
      } catch (err) {
        console.error('Error fetching navigation items:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchNavigationItems()
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        {/* Blog Access Message Section */}
        <section className="max-w-4xl mx-auto bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-12 mb-12">
          <div className="text-center">
            <div className="inline-block p-4 bg-white rounded-full mb-6 shadow-sm">
              <BookOpen className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              Exclusive Content Available on Our Mobile App
            </h1>
            <div className="max-w-2xl mx-auto">
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                To provide you with the best reading experience and keep you updated with our latest stories, 
                we've moved our blog content exclusively to our mobile app. Download now to access:
              </p>
              <ul className="text-lg text-gray-600 space-y-3 mb-10 text-left max-w-md mx-auto">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Heartwarming rescue stories
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Updates on our furry friends
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Behind-the-scenes content
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Exclusive photo galleries
                </li>
              </ul>
            </div>
            {loading ? (
              <div className="animate-pulse h-14 w-56 bg-gray-200 rounded-lg mx-auto"></div>
            ) : apkLink ? (
              <a
                href={apkLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
              >
                <Button className="bg-green-600 hover:bg-green-700 text-white px-10 py-7 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
                  <Download className="w-6 h-6 mr-3" />
                  Download App
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </a>
            ) : (
              <p className="text-gray-500 italic">
                Download link will be available soon
              </p>
            )}
            <p className="mt-6 text-sm text-gray-500">
              Available for Android devices. iOS version coming soon.
            </p>
          </div>
        </section>

        {/* Coming Soon Section */}
        <section className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Stay Connected
          </h2>
          <p className="text-gray-600">
            Follow us on social media for updates and announcements about new blog posts and app features.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  )
} 
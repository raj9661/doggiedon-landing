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
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    
    // Initial check
    checkMobile()
    
    // Add resize listener
    window.addEventListener('resize', checkMobile)
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const fetchNavigationItems = async () => {
      try {
        const response = await fetch('/api/admin/navigation')
        if (!response.ok) {
          throw new Error('Failed to fetch navigation items')
        }
        const data = await response.json()

        // Try to find a valid download link from navigation
        const apkItem = data.items.find((item: NavigationItem) =>
          item.label.toLowerCase() === 'download app' ||
          item.label.toLowerCase() === 'get app'
        )

        // If not found, fallback to hardcoded Firebase link
        if (apkItem?.href) {
          setApkLink(apkItem.href)
        } else {
          setApkLink("https://f005.backblazeb2.com/file/Doggie-apk/DoggieDon.apk")
        }

      } catch (err) {
        console.error('Error fetching navigation items:', err)
        // fallback if fetch fails
        setApkLink("https://f005.backblazeb2.com/file/Doggie-apk/DoggieDon.apk")
      } finally {
        setLoading(false)
      }
    }

    fetchNavigationItems()
  }, [])

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Video Container */}
      <div className="fixed inset-0 w-full h-full z-0">
        <div className="absolute inset-0 bg-black/20 z-10"></div>
        <video
          autoPlay
          loop
          muted
          playsInline
          className={`object-cover w-full h-full ${isMobile ? 'object-center' : ''}`}
          poster="/placeholder.jpg"
          style={{
            position: 'absolute',
            right: '0',
            bottom: '0',
            minWidth: '100%',
            minHeight: '100%',
            width: 'auto',
            height: 'auto',
          }}
        >
          <source 
            src="/blog_bg.mp4" 
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
      </div>

      <div className="relative z-10">
        <Header />

        <main className="container mx-auto px-4 py-12">
          {/* Blog Access Message Section */}
          <section className="max-w-4xl mx-auto glassmorphism rounded-2xl p-8 md:p-12 mb-8 md:mb-12">
            <div className="text-center">
              <div className="inline-block p-4 bg-white/80 backdrop-blur rounded-full mb-6 shadow-sm">
                <BookOpen className="w-8 h-8 md:w-12 md:h-12 text-green-600" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Exclusive Content Available on Our Mobile App
              </h1>
              <div className="max-w-2xl mx-auto">
                <p className="text-lg md:text-xl text-gray-800 mb-8 leading-relaxed">
                  To provide you with the best reading experience and keep you updated with our latest stories, 
                  we've moved our blog content exclusively to our mobile app. Download now to access:
                </p>
                <ul className="text-base md:text-lg text-gray-800 space-y-3 mb-10 text-left max-w-md mx-auto">
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
                <div className="animate-pulse h-12 md:h-14 w-48 md:w-56 bg-gray-200 rounded-lg mx-auto"></div>
              ) : apkLink ? (
                <a
                  href={apkLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block"
                >
                  <Button className="bg-green-600 hover:bg-green-700 text-white px-6 md:px-10 py-6 md:py-7 text-base md:text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
                    <Download className="w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3" />
                    Download App
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </a>
              ) : (
                <p className="text-gray-500 italic">
                  Download link will be available soon
                </p>
              )}

              <p className="mt-6 text-sm text-gray-700">
                Available for Android devices. iOS version coming soon.
              </p>
            </div>
          </section>

          {/* Coming Soon Section */}
          <section className="max-w-4xl mx-auto text-center glassmorphism rounded-xl p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">
              Stay Connected
            </h2>
            <p className="text-gray-800">
              Follow us on social media for updates and announcements about new blog posts and app features.
            </p>
          </section>
        </main>

        <Footer />
      </div>
    </div>
  )
}

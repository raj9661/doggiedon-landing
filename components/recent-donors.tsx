"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, Clock, Loader2 } from "lucide-react"

interface Donor {
  id: number
  name: string
  amount: string
  cause: string
  time: string
  avatar: string
  message: string
}

export default function RecentDonors() {
  const [donors, setDonors] = useState<Donor[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  const fetchDonors = async () => {
    if (loading) return

    try {
      setLoading(true)
      const response = await fetch(`/api/donors?page=${page}&limit=6`)
      const data = await response.json()
      
      if (data.donors.length > 0) {
        setDonors(prev => [...prev, ...data.donors])
        setHasMore(data.hasMore)
      } else {
        setHasMore(false)
      }
    } catch (error) {
      console.error("Error fetching donors:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDonors()
  }, [page])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0]
        if (first.isIntersecting && hasMore && !loading) {
          setPage((prev) => prev + 1)
        }
      },
      {
        threshold: 1.0,
        rootMargin: '100px'
      }
    )

    const currentRef = loadMoreRef.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [hasMore, loading])

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Recent Donors</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join our amazing community of dog lovers who are making a real difference. See the latest contributions from
            our generous supporters.
          </p>
        </div>

        <div className="relative">
          <div className="h-[600px] overflow-auto rounded-lg border bg-white p-4 scroll-smooth">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {donors.map((donor) => (
                <Card key={donor.id} className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={donor.avatar || "/placeholder.svg"} alt={donor.name} />
                          <AvatarFallback className="bg-green-100 text-green-600">
                            {donor.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-gray-900">{donor.name}</h3>
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="w-3 h-3 mr-1" />
                            {donor.time}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">{donor.amount}</div>
                        <div className="text-xs text-gray-500">{donor.cause}</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm text-gray-700 italic">"{donor.message}"</p>
                    </div>
                    <div className="flex items-center mt-3 text-sm text-gray-500">
                      <Heart className="w-4 h-4 mr-1 text-red-500" />
                      Thank you for your kindness!
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Loading indicator and observer target */}
            <div 
              ref={loadMoreRef} 
              className="mt-4 text-center"
              style={{ visibility: hasMore ? 'visible' : 'hidden' }}
            >
              {loading && (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
                  <span className="text-gray-500">Loading more donors...</span>
                </div>
              )}
            </div>

            {/* End of content message */}
            {!hasMore && donors.length > 0 && (
              <div className="mt-8 text-center text-gray-500">
                You've reached the end of the donors list
              </div>
            )}
          </div>
        </div>

        <div className="text-center mt-12">
          <div className="bg-white rounded-lg p-8 shadow-lg max-w-md mx-auto">
            <Heart className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Join Our Community</h3>
            <p className="text-gray-600 mb-4">
              Be part of our mission to help dogs in need. Your donation will be featured here!
            </p>
            <div className="text-3xl font-bold text-green-600">₹45,600</div>
            <div className="text-sm text-gray-500">raised this month</div>
          </div>
        </div>
      </div>
    </section>
  )
}

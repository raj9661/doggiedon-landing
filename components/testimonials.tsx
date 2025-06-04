"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react"
import { useRef } from "react"

const testimonials = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    role: "Veterinarian",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
    text: "DoggieDon has been instrumental in helping us provide emergency medical care to stray dogs. Their quick response and generous donors have saved countless lives. The transparency in their operations gives me complete confidence in recommending them.",
  },
  {
    id: 2,
    name: "Ravi Mehta",
    role: "Dog Adopter",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
    text: "I adopted my dog Bruno through DoggieDon two years ago. The care and rehabilitation he received was exceptional. Now he's a healthy, happy member of our family. This organization truly transforms lives - both for dogs and families.",
  },
  {
    id: 3,
    name: "Kavya Nair",
    role: "Regular Donor",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
    text: "I've been donating to DoggieDon for over a year now. What I love most is how they keep me updated on the impact of my donations. Seeing the before and after photos of rescued dogs brings tears of joy to my eyes.",
  },
  {
    id: 4,
    name: "Animal Welfare Society",
    role: "Partner Organization",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
    text: "Working with DoggieDon has been a game-changer for our rescue operations. Their systematic approach to dog care, from rescue to rehabilitation to adoption, sets the gold standard in animal welfare.",
  },
  {
    id: 5,
    name: "Amit Gupta",
    role: "Volunteer",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
    text: "Volunteering with DoggieDon has been the most rewarding experience of my life. The team is passionate, organized, and truly cares about each dog's wellbeing. Every weekend spent here fills my heart with purpose.",
  },
  {
    id: 6,
    name: "Neha Sharma",
    role: "Foster Parent",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
    text: "DoggieDon supported me throughout my journey as a foster parent. From providing medical care to training guidance, they ensured both the puppy and I had everything we needed. Now little Max has found his forever home!",
  },
]

export default function Testimonials() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Stories of Hope & Love</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hear from our community of donors, adopters, volunteers, and partners who have experienced the joy of making
            a difference in a dog's life.
          </p>
        </div>

        <div className="relative">
          {/* Scroll buttons */}
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors"
          >
            <ChevronRight className="w-6 h-6 text-gray-600" />
          </button>

          {/* Scrollable container */}
          <div 
            ref={scrollContainerRef}
            className="overflow-x-auto flex gap-6 pb-4 scrollbar-hide scroll-smooth"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {testimonials.map((testimonial) => (
              <Card
                key={testimonial.id}
                className="flex-none w-[400px] hover:shadow-xl transition-all duration-300 border-2 hover:border-green-100"
              >
                <CardContent className="p-6">
                  <Quote className="w-8 h-8 text-green-200 mb-4" />

                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>

                  <p className="text-gray-700 mb-6 leading-relaxed">"{testimonial.text}"</p>

                  <div className="flex items-center">
                    <Avatar className="w-12 h-12 mr-4">
                      <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} />
                      <AvatarFallback className="bg-green-100 text-green-600">
                        {testimonial.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="text-center mt-16">
          <div className="bg-green-50 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Want to Share Your Story?</h3>
            <p className="text-gray-600 mb-6">
              If DoggieDon has touched your life or if you've witnessed our impact, we'd love to hear from you. Your
              story could inspire others to join our mission.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                Share Your Story
              </button>
              <button className="border border-green-600 text-green-600 hover:bg-green-50 px-6 py-3 rounded-lg font-medium transition-colors">
                Become a Volunteer
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

"use client"

import { Button } from "@/components/ui/button"
import { Heart, Shield, Home } from "lucide-react"
import Image from "next/image"

export default function Hero() {
  return (
    <section id="home" className="bg-gradient-to-br from-green-50 to-blue-50 py-20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                Every Dog Deserves a<span className="text-green-600 block">Loving Home</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Join us in our mission to provide food, medical care, and shelter to dogs in need. Your donation can
                transform a life and bring hope to our four-legged friends.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              {/* <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg">
                <Heart className="w-5 h-5 mr-2" />
                Donate Now
              </Button> */}
              <Button
                size="lg"
                variant="outline"
                className="border-green-600 text-green-600 hover:bg-green-50 px-8 py-4 text-lg"
              >
                Learn More
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Heart className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900">500+</h3>
                <p className="text-sm text-gray-600">Dogs Helped</p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900">24/7</h3>
                <p className="text-sm text-gray-600">Care Available</p>
              </div>
              <div className="text-center">
                <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Home className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900">200+</h3>
                <p className="text-sm text-gray-600">Homes Found</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative z-10">
              <Image
                src="/logo.png?height=600&width=500"
                alt="Happy dogs in shelter"
                width={500}
                height={600}
                className="rounded-2xl shadow-2xl"
              />
            </div>
            <div className="absolute -top-4 -right-4 w-full h-full bg-green-200 rounded-2xl -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  )
}

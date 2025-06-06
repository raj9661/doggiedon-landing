"use client"

import Image from "next/image"
import Link from "next/link"
import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row justify-center gap-16 text-center md:text-left">
          {/* Logo and Description */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center justify-center md:justify-start space-x-3 mb-6">
              <Image src="/logo.png" alt="DoggieDon Logo" width={50} height={50} className="rounded-full" />
              <div>
                <h3 className="text-2xl font-bold text-white">DoggieDon</h3>
                <p className="text-sm text-gray-400">Caring for Every Paw</p>
              </div>
            </Link>
            <p className="text-gray-400 mb-6 leading-relaxed break-words w-full max-w-sm mx-auto md:mx-0">
              Dedicated to providing love, care, and shelter to dogs in need. Together, we can make a difference in
              their lives.
            </p>
          
            <div className="flex space-x-4 justify-center md:justify-start">
              <Link href="#" className="bg-gray-800 hover:bg-green-600 p-2 rounded-full transition-colors">
                <Facebook className="w-5 h-5" />
              </Link>
              <Link href="#" className="bg-gray-800 hover:bg-green-600 p-2 rounded-full transition-colors">
                <Twitter className="w-5 h-5" />
              </Link>
              <Link href="#" className="bg-gray-800 hover:bg-green-600 p-2 rounded-full transition-colors">
                <Instagram className="w-5 h-5" />
              </Link>
              <Link href="#" className="bg-gray-800 hover:bg-green-600 p-2 rounded-full transition-colors">
                <Youtube className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links 
          <div>
            <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link href="#home" className="text-gray-400 hover:text-green-400 transition-colors">
                  Home
                </Link>
              </li>
              {/*<li>
                <Link href="#donate" className="text-gray-400 hover:text-green-400 transition-colors">
                  Donate Now
                </Link>
              </li>
              <li>
                <Link href="#about" className="text-gray-400 hover:text-green-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#adopt" className="text-gray-400 hover:text-green-400 transition-colors">
                  Adopt a Dog
                </Link>
              </li>
              <li>
                <Link href="#volunteer" className="text-gray-400 hover:text-green-400 transition-colors">
                  Volunteer
                </Link>
              </li>
              <li>
                <Link href="#success-stories" className="text-gray-400 hover:text-green-400 transition-colors">
                  Success Stories
                </Link>
              </li>
            </ul>
          </div>*/}

          {/* Donation Categories 
          <div>
            <h4 className="text-lg font-semibold mb-6">Ways to Help</h4>
            <ul className="space-y-3">
              <li>
                <Link href="#food" className="text-gray-400 hover:text-green-400 transition-colors">
                  Food & Nutrition
                </Link>
              </li>
              <li>
                <Link href="#medical" className="text-gray-400 hover:text-green-400 transition-colors">
                  Medical Care
                </Link>
              </li>
              <li>
                <Link href="#shelter" className="text-gray-400 hover:text-green-400 transition-colors">
                  Shelter & Housing
                </Link>
              </li>
              <li>
                <Link href="#emergency" className="text-gray-400 hover:text-green-400 transition-colors">
                  Emergency Fund
                </Link>
              </li>
              <li>
                <Link href="#sponsor" className="text-gray-400 hover:text-green-400 transition-colors">
                  Sponsor a Dog
                </Link>
              </li>
              <li>
                <Link href="#monthly" className="text-gray-400 hover:text-green-400 transition-colors">
                  Monthly Giving
                </Link>
              </li>
            </ul>
          </div>
          */}

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Contact Us</h4>
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row items-center md:items-start space-y-1 md:space-y-0 md:space-x-3">
                <MapPin className="w-5 h-5 text-green-400 flex-shrink-0" />
                <div className="text-center md:text-left">
                  <p className="text-gray-400">
                    123 Dog Care Street,
                    <br />
                    Bistupur District,
                    <br />
                    East Singhbhum, JHARKHAND 831013
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-center md:justify-start space-x-3">
                <Phone className="w-5 h-5 text-green-400 flex-shrink-0" />
                <p className="text-gray-400">+91 74889 99999</p>
              </div>
              <div className="flex items-center justify-center md:justify-start space-x-3">
                <Mail className="w-5 h-5 text-green-400 flex-shrink-0" />
                <p className="text-gray-400">help@doggiedon.org</p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-800 rounded-lg">
              <h5 className="font-semibold mb-2 text-green-400">Emergency Helpline</h5>
              <p className="text-2xl font-bold text-white">1800-DOG-HELP</p>
              <p className="text-sm text-gray-400">Available 24/7 for urgent cases</p>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="bg-gray-800 rounded-2xl p-8 text-center">
            <Heart className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
              Subscribe to our newsletter to receive updates about our rescued dogs, success stories, and upcoming
              events.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:border-green-400 focus:outline-none"
              />
              <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2025 DoggieDon. All rights reserved. | Registered Charity No: 12345678
            </div>
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-green-400 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-green-400 transition-colors">
                Terms of Service
              </Link>
              <Link href="/transparency" className="text-gray-400 hover:text-green-400 transition-colors">
                Financial Transparency
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

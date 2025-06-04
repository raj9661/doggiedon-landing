"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CreditCard, Check, Loader2, AlertCircle, Smartphone, ArrowRight } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useRouter } from "next/navigation"
import Image from 'next/image'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  amount: number
  onSuccess: () => void
  clearCart: () => void
}

type Currency = 'INR' | 'USD' | 'EUR';
type Country = 'India' | 'United States' | 'Canada' | 'Germany' | 'France' | 'Italy' | 'Spain';

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  INR: '₹',
  USD: '$',
  EUR: '€'
};

const CURRENCY_COUNTRIES: Record<Currency, Country[]> = {
  INR: ['India'],
  USD: ['United States', 'Canada'],
  EUR: ['Germany', 'France', 'Italy', 'Spain']
};

interface PersonalDetails {
  email: string
  phone: string
  fullName: string
  pan: string
  address: string
  pincode: string
  amount: string
  country: Country
  currency: Currency
}

interface CardDetails {
  cardNumber: string
  expiry: string
  cvv: string
}

interface Errors {
  email?: string
  phone?: string
  fullName?: string
  pan?: string
  pincode?: string
  amount?: string
  cardNumber?: string
  expiry?: string
  cvv?: string
}

type CardType = 'visa' | 'mastercard' | 'amex' | 'rupay' | 'discover' | 'invalid' | null;

export default function PaymentModal({ isOpen, onClose, amount, onSuccess, clearCart }: PaymentModalProps) {
  const router = useRouter()
  const [step, setStep] = useState<'details' | 'payment' | 'processing' | 'success'>('details')
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi'>('card')
  const [personalDetails, setPersonalDetails] = useState<PersonalDetails>({
    email: '',
    phone: '',
    fullName: '',
    pan: '',
    address: '',
    pincode: '',
    amount: amount.toString(),
    country: 'India',
    currency: 'INR'
  })
  const [cardDetails, setCardDetails] = useState<CardDetails>({
    cardNumber: '',
    expiry: '',
    cvv: ''
  })
  const [errors, setErrors] = useState<Errors>({})
  const [upiId, setUpiId] = useState('')
  const [cardType, setCardType] = useState<CardType>(null);

  const validateCardNumber = (number: string): boolean => {
    const cleanNumber = number.replace(/\s+/g, '');
    
    // Check if the number contains only digits
    if (!/^\d+$/.test(cleanNumber)) return false;
    
    // Check length (13-19 digits)
    if (cleanNumber.length < 13 || cleanNumber.length > 19) return false;

    // Luhn algorithm
    let sum = 0;
    let isEven = false;

    for (let i = cleanNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cleanNumber[i]);

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  };

  const validateExpiry = (expiry: string) => {
    const [month, year] = expiry.split('/')
    if (!month || !year) return false

    const currentYear = new Date().getFullYear() % 100
    const currentMonth = new Date().getMonth() + 1

    const expiryMonth = parseInt(month)
    const expiryYear = parseInt(year)

    if (expiryMonth < 1 || expiryMonth > 12) return false
    if (expiryYear < currentYear) return false
    if (expiryYear === currentYear && expiryMonth < currentMonth) return false

    return true
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ''
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(' ')
    } else {
      return value
    }
  }

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      return v.slice(0, 2) + '/' + v.slice(2, 4)
    }
    return v
  }

  const detectCardType = (cardNumber: string) => {
    const firstDigit = cardNumber.charAt(0);
    
    if (!firstDigit) {
      setCardType(null);
      return;
    }

    switch (firstDigit) {
      case '4':
        setCardType('visa');
        break;
      case '5':
        setCardType('mastercard');
        break;
      case '3':
        setCardType('amex');
        break;
      case '6':
        // For India, show RuPay. For USA, show Discover
        setCardType(personalDetails.country === 'India' ? 'rupay' : 'discover');
        break;
      default:
        setCardType('invalid');
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCardNumber(e.target.value);
    setCardDetails(prev => ({ ...prev, cardNumber: formattedValue }));
    
    // Only show error if user has entered at least 13 digits
    const cleanNumber = formattedValue.replace(/\s+/g, '');
    if (cleanNumber.length >= 13) {
      setErrors(prev => ({ 
        ...prev, 
        cardNumber: validateCardNumber(formattedValue) ? undefined : 'Invalid card number'
      }));
    } else {
      setErrors(prev => ({ ...prev, cardNumber: undefined }));
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatExpiry(e.target.value)
    setCardDetails(prev => ({ ...prev, expiry: formattedValue }))
    setErrors(prev => ({ ...prev, expiry: undefined }))
  }

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 3)
    setCardDetails(prev => ({ ...prev, cvv: value }))
    setErrors(prev => ({ ...prev, cvv: undefined }))
  }

  const validateForm = () => {
    const newErrors: Errors = {}

    if (!validateCardNumber(cardDetails.cardNumber)) {
      newErrors.cardNumber = 'Invalid card number'
    }

    if (!validateExpiry(cardDetails.expiry)) {
      newErrors.expiry = 'Invalid expiry date'
    }

    if (cardDetails.cvv.length !== 3) {
      newErrors.cvv = 'Invalid CVV'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validatePersonalDetails = () => {
    const newErrors: Errors = {}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const phoneRegex = /^[0-9]{10}$/
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/
    const pincodeRegex = /^[0-9]{6}$/

    if (!emailRegex.test(personalDetails.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    if (personalDetails.phone && !phoneRegex.test(personalDetails.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number'
    }
    if (!personalDetails.fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    }
    if (personalDetails.pan && !panRegex.test(personalDetails.pan)) {
      newErrors.pan = 'Please enter a valid PAN number'
    }
    if (!pincodeRegex.test(personalDetails.pincode)) {
      newErrors.pincode = 'Please enter a valid 6-digit pincode'
    }
    if (!personalDetails.amount || parseFloat(personalDetails.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handlePersonalDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validatePersonalDetails()) {
      setStep('payment')
    }
  }

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (paymentMethod === 'card' && !validateForm()) {
      return
    }

    setStep('processing')

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    setStep('success')

    // Simulate success and close
    setTimeout(() => {
      onSuccess()
      clearCart()
      onClose()
      setStep('details')
      // Reset all forms
      setPersonalDetails({
        email: '',
        phone: '',
        fullName: '',
        pan: '',
        address: '',
        pincode: '',
        amount: '',
        country: 'India',
        currency: 'INR'
      })
      setCardDetails({
        cardNumber: '',
        expiry: '',
        cvv: ''
      })
      setUpiId('')
      setErrors({})
      router.refresh()
    }, 2000)
  }

  const getCardLogo = () => {
    switch (cardType) {
      case 'visa':
        return '/visa.png';
      case 'mastercard':
        return '/mastercard.png';
      case 'amex':
        return '/amex.png';
      case 'rupay':
        return '/rupay.png';
      case 'discover':
        return '/discover.png';
      default:
        return null;
    }
  };

  const handleCurrencyChange = (value: Currency) => {
    setPersonalDetails(prev => ({ 
      ...prev, 
      currency: value,
      country: CURRENCY_COUNTRIES[value].includes(prev.country as Country) 
        ? prev.country as Country
        : CURRENCY_COUNTRIES[value][0]
    }));
  };

  const formatAmount = (amount: string, currency: string) => {
    const symbol = CURRENCY_SYMBOLS[currency as keyof typeof CURRENCY_SYMBOLS];
    return `${symbol}${amount}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] md:max-w-[800px] lg:max-w-[1000px] w-11/12 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Complete Your Donation</DialogTitle>
          <DialogDescription className="text-center text-lg">
            Thank you for your generosity! Please provide your details to proceed.
          </DialogDescription>
        </DialogHeader>

        {step === 'details' && (
          <form onSubmit={handlePersonalDetailsSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                <h3 className="font-semibold text-gray-900 text-xl">Choose Currency & Amount</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium block mb-1">Currency *</label>
                    <Select 
                      value={personalDetails.currency}
                      onValueChange={(value: Currency) => handleCurrencyChange(value)}
                    >
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="INR">Indian Rupee (INR)</SelectItem>
                        <SelectItem value="USD">US Dollar (USD)</SelectItem>
                        <SelectItem value="EUR">Euro (EUR)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1">Country *</label>
                    <Select 
                      value={personalDetails.country}
                      onValueChange={(value: Country) => setPersonalDetails(prev => ({ ...prev, country: value }))}
                    >
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        {CURRENCY_COUNTRIES[personalDetails.currency].map((country) => (
                          <SelectItem key={country} value={country}>{country}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1">Amount *</label>
                    <div className="relative">
                      <Input
                        type="text"
                        value={formatAmount(personalDetails.amount, personalDetails.currency)}
                        disabled
                        className="bg-white text-lg font-medium text-gray-700"
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Amount selected from donation cart</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                <h3 className="font-semibold text-gray-900 text-xl">Contact Information</h3>
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className="text-sm font-medium block mb-1">Email Address *</label>
                    <Input
                      type="email"
                      value={personalDetails.email}
                      onChange={(e) => setPersonalDetails(prev => ({ ...prev, email: e.target.value }))}
                      className="bg-white"
                    />
                    {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1">Phone Number</label>
                    <Input
                      type="tel"
                      value={personalDetails.phone}
                      onChange={(e) => setPersonalDetails(prev => ({ ...prev, phone: e.target.value }))}
                      className="bg-white"
                    />
                    {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg space-y-4 md:col-span-2">
                <h3 className="font-semibold text-gray-900 text-xl">Personal Details</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium block mb-1">Full Name *</label>
                    <Input
                      value={personalDetails.fullName}
                      onChange={(e) => setPersonalDetails(prev => ({ ...prev, fullName: e.target.value }))}
                      className="bg-white"
                    />
                    {errors.fullName && <p className="text-sm text-red-500 mt-1">{errors.fullName}</p>}
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1">PAN (Required for 80G Receipt)</label>
                    <Input
                      value={personalDetails.pan}
                      onChange={(e) => setPersonalDetails(prev => ({ ...prev, pan: e.target.value.toUpperCase() }))}
                      className="bg-white"
                    />
                    {errors.pan && <p className="text-sm text-red-500 mt-1">{errors.pan}</p>}
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1">Country</label>
                    <Input value="India" disabled className="bg-white" />
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1">Pincode *</label>
                    <Input
                      value={personalDetails.pincode}
                      onChange={(e) => setPersonalDetails(prev => ({ ...prev, pincode: e.target.value }))}
                      className="bg-white"
                    />
                    {errors.pincode && <p className="text-sm text-red-500 mt-1">{errors.pincode}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium block mb-1">Complete Address</label>
                    <textarea
                      value={personalDetails.address}
                      onChange={(e) => setPersonalDetails(prev => ({ ...prev, address: e.target.value }))}
                      className="w-full min-h-[100px] rounded-md border border-input bg-white px-3 py-2 text-sm"
                      placeholder="Enter complete address for postal communication"
                    />
                  </div>
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 py-6 text-lg">
              Continue to Payment <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </form>
        )}

        {step === 'payment' && (
          <form onSubmit={handlePaymentSubmit} className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-900 text-xl mb-4">Select Payment Method</h3>
              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                <Button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`flex items-center justify-center space-x-2 py-8 ${
                    paymentMethod === 'card' ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <CreditCard className="w-6 h-6" />
                  <span className="text-lg">Card</span>
                </Button>
                <Button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`flex items-center justify-center space-x-2 py-8 ${
                    paymentMethod === 'upi' ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <Smartphone className="w-6 h-6" />
                  <span className="text-lg">UPI</span>
                </Button>
              </div>
            </div>

            {paymentMethod === 'card' ? (
              <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                <h3 className="font-semibold text-gray-900 text-xl mb-4">Card Details</h3>
                <div className="max-w-md mx-auto space-y-4">
                  <div>
                    <label className="text-sm font-medium block mb-1">Card Number</label>
                    <Input
                      placeholder="1234 5678 9012 3456"
                      value={cardDetails.cardNumber}
                      onChange={handleCardNumberChange}
                      maxLength={19}
                      className="text-lg"
                    />
                    {errors.cardNumber && <p className="text-sm text-red-500 mt-1">{errors.cardNumber}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium block mb-1">Expiry Date</label>
                      <Input
                        placeholder="MM/YY"
                        value={cardDetails.expiry}
                        onChange={handleExpiryChange}
                        maxLength={5}
                        className="text-lg"
                      />
                      {errors.expiry && <p className="text-sm text-red-500 mt-1">{errors.expiry}</p>}
                    </div>

                    <div>
                      <label className="text-sm font-medium block mb-1">CVV</label>
                      <Input
                        type="password"
                        placeholder="123"
                        value={cardDetails.cvv}
                        onChange={handleCvvChange}
                        maxLength={3}
                        className="text-lg"
                      />
                      {errors.cvv && <p className="text-sm text-red-500 mt-1">{errors.cvv}</p>}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                <h3 className="font-semibold text-gray-900 text-xl mb-4">UPI Payment</h3>
                <div className="max-w-md mx-auto">
                  <label className="text-sm font-medium block mb-1">UPI ID</label>
                  <Input
                    placeholder="username@upi"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="text-lg"
                  />
                </div>
              </div>
            )}

            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 py-6 text-lg">
              Pay {formatAmount(personalDetails.amount, personalDetails.currency)}
            </Button>
          </form>
        )}

        {step === 'processing' && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-green-600" />
            <p className="mt-6 text-xl font-medium">Processing your donation...</p>
            <p className="text-sm text-gray-500 mt-2">Please don't close this window.</p>
          </div>
        )}

        {step === 'success' && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-green-100 p-4">
              <Check className="h-12 w-12 text-green-600" />
            </div>
            <p className="mt-6 text-xl font-medium text-green-600">Thank you for your donation!</p>
            <p className="text-center text-gray-500 mt-2 max-w-md">
              Your generous contribution of {formatAmount(personalDetails.amount, personalDetails.currency)} will help make a difference in the lives of dogs in need.
            </p>
            <p className="text-center text-gray-400 mt-4">
              Redirecting you back to donations...
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
} 
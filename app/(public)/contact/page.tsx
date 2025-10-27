'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { useState } from "react"
import { toast } from 'sonner'

export default function ContactPage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess(false)

    const form = e.currentTarget
    // Collect all form fields into a data object
    const data = {
      firstName: (form.firstName as HTMLInputElement).value,
      lastName: (form.lastName as HTMLInputElement).value,
      email: (form.email as HTMLInputElement).value,
      phone: (form.phone as HTMLInputElement).value,
      service: (form.service as HTMLInputElement).value,
      message: (form.message as HTMLInputElement).value,
    }

    // Universal form payload
    const payload = {
      formName: "contact",
      data,
      email: data.email,
      phone: data.phone,
      source: "contact"
    }

    try {
      console.log('Submitting contact form:', payload)
      
      const res = await fetch("/api/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
      
      console.log('Form submission response status:', res.status)
      const result = await res.json()
      console.log('Form submission result:', result)
      
      if (result.success) {
        setSuccess(true)
        form.reset()
        toast.success('Thank you! Your message has been sent successfully.')
      } else {
        const errorMsg = result.error || "Failed to send message"
        setError(errorMsg)
        toast.error(`Failed to send message: ${errorMsg}`)
      }
    } catch (err) {
      console.error('Form submission error:', err)
      setError("Failed to send message")
      toast.error("Failed to send message. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main>
      {/* Hero Section */}
      <section className="py-20 pt-28 bg-gradient-to-br from-scio-blue via-scio-blue-light to-scio-orange relative overflow-hidden">
        <div className="absolute inset-0 bg-black/60"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center text-white">
            <h1 className="font-heading heading-primary text-4xl md:text-5xl mb-6">
              Get In <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">Touch</span>
            </h1>
            <p className="font-body text-body text-lg md:text-xl text-gray-100 max-w-3xl mx-auto leading-relaxed">
              Ready to transform your educational journey? We&apos;re here to help you take the next step 
              towards excellence and success.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-6">
              <div className="mb-8">
                <h2 className="font-heading heading-primary text-3xl text-scio-blue mb-4">
                  Let&apos;s Connect
                </h2>
                <p className="font-body text-body text-gray-600 leading-relaxed">
                  We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.
                </p>
              </div>

              <div className="space-y-4">
                <Card className="group bg-white border-0 shadow-md hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-scio-blue rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                        <MapPin className="text-white w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-heading text-lg font-semibold text-gray-800 mb-1">Our Address</h4>
                        <p className="font-body text-gray-600 text-sm">
                          N-304, Ashiyana Sector – N<br />
                          Lucknow – 226012, India
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="group bg-white border-0 shadow-md hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-scio-orange rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                        <Phone className="text-white w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-heading text-lg font-semibold text-gray-800 mb-1">Phone Number</h4>
                        <p className="font-body text-gray-600 text-sm">+91 9495212484</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="group bg-white border-0 shadow-md hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-scio-blue rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                        <Mail className="text-white w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-heading text-lg font-semibold text-gray-800 mb-1">Email Address</h4>
                        <p className="font-body text-gray-600 text-sm">info@sciolabs.in</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="group bg-white border-0 shadow-md hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-scio-orange rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                        <Clock className="text-white w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-heading text-lg font-semibold text-gray-800 mb-1">Office Hours</h4>
                        <p className="font-body text-gray-600 text-sm">
                          Monday - Friday: 9:00 AM - 6:00 PM<br />
                          Saturday: 9:00 AM - 2:00 PM
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Contact Form */}
            <Card className="bg-white border-0 shadow-xl">
              <CardContent className="p-8">
                <h3 className="font-heading heading-primary text-2xl text-scio-blue mb-6">
                  Send us a Message
                </h3>
                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="font-heading text-sm font-medium text-gray-700">
                        First Name
                      </Label>
                      <Input 
                        id="firstName"
                        name="firstName"
                        type="text" 
                        placeholder="Your first name"
                        className="h-11 rounded-lg border-gray-300 focus:border-scio-blue focus:ring-scio-blue"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="font-heading text-sm font-medium text-gray-700">
                        Last Name
                      </Label>
                      <Input 
                        id="lastName"
                        name="lastName"
                        type="text" 
                        placeholder="Your last name"
                        className="h-11 rounded-lg border-gray-300 focus:border-scio-blue focus:ring-scio-blue"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email" className="font-heading text-sm font-medium text-gray-700">
                      Email Address
                    </Label>
                    <Input 
                      id="email"
                      name="email"
                      type="email" 
                      placeholder="your.email@example.com"
                      className="h-11 rounded-lg border-gray-300 focus:border-scio-blue focus:ring-scio-blue"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="font-heading text-sm font-medium text-gray-700">
                      Phone Number
                    </Label>
                    <Input 
                      id="phone"
                      name="phone"
                      type="tel" 
                      placeholder="+91 9876543210"
                      className="h-11 rounded-lg border-gray-300 focus:border-scio-blue focus:ring-scio-blue"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="service" className="font-heading text-sm font-medium text-gray-700">
                      Service Interested In
                    </Label>
                    <Select name="service">
                      <SelectTrigger className="w-full h-11 rounded-lg border-gray-300 focus:border-scio-blue focus:ring-scio-blue">
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                      <SelectContent 
                        className="z-50"
                        side="bottom"
                        sideOffset={4}
                        avoidCollisions={false}
                        position="popper"
                      >
                        <SelectItem value="guidance">ScioGuidance</SelectItem>
                        <SelectItem value="thrive">ScioThrive</SelectItem>
                        <SelectItem value="care">ScioCare</SelectItem>
                        <SelectItem value="lingua">ScioLingua</SelectItem>
                        <SelectItem value="sprints">ScioSprints</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message" className="font-heading text-sm font-medium text-gray-700">
                      Message
                    </Label>
                    <Textarea 
                      id="message"
                      name="message"
                      rows={4} 
                      placeholder="Tell us about your requirements..."
                      className="rounded-lg border-gray-300 focus:border-scio-blue focus:ring-scio-blue resize-none"
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    size="lg"
                    className="w-full bg-scio-blue hover:bg-scio-blue-dark text-white h-12 rounded-lg font-heading font-semibold text-base transition-all duration-300"
                    disabled={loading}
                  >
                    <Send className="w-5 h-5 mr-2" />
                    {loading ? "Sending..." : "Send Message"}
                  </Button>
                  {success && (
                    <div className="mt-4 text-green-600 font-medium">
                      Thank you! Your message has been sent.
                    </div>
                  )}
                  {error && (
                    <div className="mt-4 text-red-600 font-medium">
                      {error}
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
'use client';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function TestimonialsSection() {
  const [activeTab, setActiveTab] = useState('schools');
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = {
    schools: [
      {
        id: 1,
        quote: "Children have millions of choices and they find it very difficult to decide what they want to do and thats where career counselling comes in.",
        name: "Mr. Vikram Aditya",
        title: "HONY. Secretary, MSMSV, Jaipur",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        logo: "/placeholder-logo.png"
      },
      {
        id: 2,
        quote: "The comprehensive guidance program has transformed how our students approach career decisions.",
        name: "Dr. Priya Sharma",
        title: "Principal, Delhi Public School",
        image: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        logo: "/placeholder-logo.png"
      }
    ],
    csr: [
      {
        id: 1,
        quote: "Our partnership with Scio Labs has enabled us to reach thousands of students with quality career guidance.",
        name: "Mr. Rajesh Kumar",
        title: "CSR Head, Tech Mahindra",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        logo: "/placeholder-logo.png"
      }
    ],
    counselors: [
      {
        id: 1,
        quote: "The training program equipped me with modern tools and techniques to better guide students.",
        name: "Ms. Anita Reddy",
        title: "Career Counselor, Bangalore",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        logo: "/placeholder-logo.png"
      }
    ]
  };

  const tabs = [
    { id: 'schools', label: 'Schools' },
    { id: 'csr', label: 'CSR-Government' },
    { id: 'counselors', label: 'Counselors' }
  ];

  const currentTestimonials = testimonials[activeTab as keyof typeof testimonials];
  const currentTestimonial = currentTestimonials[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % currentTestimonials.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + currentTestimonials.length) % currentTestimonials.length);
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setCurrentIndex(0);
  };

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50/30 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="font-heading heading-primary text-4xl md:text-5xl mb-6 text-scio-blue">
            Testimonials
          </h2>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="flex space-x-2 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-lg">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "ghost"}
                className={`px-8 py-3 rounded-full font-medium transition-all duration-300 ${
                  activeTab === tab.id 
                    ? 'bg-scio-blue text-white shadow-md' 
                    : 'text-gray-600 hover:text-scio-blue hover:bg-blue-50'
                }`}
                onClick={() => handleTabChange(tab.id)}
              >
                {tab.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Testimonial Content */}
        <div className="relative max-w-5xl mx-auto">
          {/* Navigation Arrows */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-12 z-10 w-12 h-12 rounded-full bg-white shadow-lg hover:shadow-xl border-2 border-gray-200 hover:border-scio-blue transition-all duration-300"
            onClick={handlePrev}
            disabled={currentTestimonials.length <= 1}
          >
            <i className="fas fa-chevron-left text-scio-blue"></i>
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-12 z-10 w-12 h-12 rounded-full bg-white shadow-lg hover:shadow-xl border-2 border-gray-200 hover:border-scio-blue transition-all duration-300"
            onClick={handleNext}
            disabled={currentTestimonials.length <= 1}
          >
            <i className="fas fa-chevron-right text-scio-blue"></i>
          </Button>

          {/* Single Testimonial Card */}
          <Card className="bg-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-8">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Quote Section */}
                <div className="flex-1">
                  {/* Quote Icon */}
                  <div className="text-scio-orange mb-6">
                    <svg width="48" height="36" viewBox="0 0 48 36" fill="currentColor">
                      <path d="M12 0C5.4 0 0 5.4 0 12v12c0 6.6 5.4 12 12 12s12-5.4 12-12c0-6.6-5.4-12-12-12zm0 18c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6zm24-18c-6.6 0-12 5.4-12 12v12c0 6.6 5.4 12 12 12s12-5.4 12-12c0-6.6-5.4-12-12-12zm0 18c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6z"/>
                    </svg>
                  </div>
                  
                  {/* Quote Text */}
                  <blockquote className="font-body text-xl text-gray-700 mb-8 leading-relaxed">
                    &ldquo;{currentTestimonial.quote}&rdquo;
                  </blockquote>
                  
                  {/* Author Info */}
                  <div className="space-y-3">
                    <h4 className="font-heading text-2xl font-semibold text-scio-blue">
                      {currentTestimonial.name}
                    </h4>
                    <p className="font-body text-lg text-gray-600">
                      {currentTestimonial.title}
                    </p>
                  </div>
                  
                  {/* Organization Logo */}
                  <div className="mt-8">
                    <div className="w-20 h-10 bg-gradient-to-r from-scio-blue/10 to-scio-orange/10 rounded-lg flex items-center justify-center border border-gray-200">
                      <div className="w-16 h-8 bg-gradient-to-r from-scio-blue to-scio-orange rounded flex items-center justify-center">
                        <span className="text-white text-xs font-bold">LOGO</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Image Section */}
                <div className="lg:w-80">
                  <div className="relative h-80 lg:h-96 rounded-2xl overflow-hidden shadow-lg">
                    <Image
                      src={currentTestimonial.image}
                      alt={currentTestimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Dots */}
        <div className="flex justify-center mt-12 space-x-3">
          {currentTestimonials.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'bg-scio-blue' : 'bg-gray-300 hover:bg-gray-400'
              }`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

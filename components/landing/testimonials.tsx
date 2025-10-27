'use client';
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const autoScrollRef = useRef<NodeJS.Timeout | null>(null);

  const testimonials = [
    {
      id: 1,
      service: "ScioThrive",
      quote: "Davis Abraham led an engaging and interactive online session for mid to senior-level officers, using technology effectively. A truly memorable experience.",
      name: "Smt. Aditi Mishra",
      title: "National Productivity Council",
      serviceColor: "text-scio-blue"
    },
    {
      id: 2,
      service: "ScioLingua",
      quote: "ScioLabs' BeGin curriculum is research-backed, teacher-friendly, and child-centered—making classroom implementation smooth and impactful.",
      name: "Annie Samuel",
      title: "EmpowerED",
      serviceColor: "text-scio-blue"
    },
    {
      id: 3,
      service: "ScioCare",
      quote: "The English for Nurses curriculum is structured, relevant, and engaging—boosting student confidence and communication skills in real healthcare contexts.",
      name: "Amy Tephilla A",
      title: "CBH College of Nursing",
      serviceColor: "text-scio-blue"
    },
    {
      id: 4,
      service: "ScioGuidance",
      quote: "The career counseling session was insightful, friendly, and tailored—providing clear direction and practical next steps.",
      name: "Dr. S. Sharma",
      title: "Parent from Lucknow",
      serviceColor: "text-scio-blue"
    }
  ];

  const currentTestimonial = testimonials[currentIndex];

  // Auto-scroll functionality
  useEffect(() => {
    autoScrollRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000); // Change testimonial every 5 seconds

    return () => {
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current);
      }
    };
  }, [testimonials.length]);

  // Reset auto-scroll on manual navigation
  const resetAutoScroll = () => {
    if (autoScrollRef.current) {
      clearInterval(autoScrollRef.current);
    }
    autoScrollRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    resetAutoScroll();
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    resetAutoScroll();
  };

  // Touch handlers for swipe functionality
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      handleNext();
    }
    if (isRightSwipe) {
      handlePrev();
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-br from-gray-50 to-blue-50/30 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="font-heading heading-primary text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-4 sm:mb-6 text-scio-blue">
            What Our Clients Say
          </h2>
          <p className="font-body text-body text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Hear from our partners and clients about their experience with ScioLabs
          </p>
        </div>

        {/* Testimonial Content */}
        <div 
          className="relative max-w-4xl mx-auto"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Navigation Arrows - Hidden on mobile */}
          <Button
            variant="outline"
            size="icon"
            className="hidden lg:flex absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-12 z-10 w-12 h-12 rounded-full bg-white shadow-lg hover:shadow-xl border-2 border-gray-200 hover:border-scio-blue transition-all duration-300"
            onClick={handlePrev}
          >
            <i className="fas fa-chevron-left text-scio-blue"></i>
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="hidden lg:flex absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-12 z-10 w-12 h-12 rounded-full bg-white shadow-lg hover:shadow-xl border-2 border-gray-200 hover:border-scio-blue transition-all duration-300"
            onClick={handleNext}
          >
            <i className="fas fa-chevron-right text-scio-blue"></i>
          </Button>

          {/* Single Testimonial Card */}
          <Card className="bg-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6 sm:p-8 md:p-10 text-center">
              {/* Service Badge */}
              <Badge variant="outline" className="bg-scio-blue/10 text-scio-blue border-scio-blue mb-6 sm:mb-8 text-xs sm:text-sm">
                {currentTestimonial.service}
              </Badge>

              {/* Quote Icon */}
              <div className="text-scio-orange mb-6 sm:mb-8">
                <i className="fas fa-quote-left text-3xl sm:text-4xl md:text-5xl lg:text-6xl"></i>
              </div>
              
              {/* Quote Text */}
              <blockquote className="font-body text-base sm:text-lg md:text-xl lg:text-2xl text-gray-700 mb-6 sm:mb-8 lg:mb-10 leading-relaxed max-w-3xl mx-auto px-2">
                &ldquo;{currentTestimonial.quote}&rdquo;
              </blockquote>
              
              {/* Author Info */}
              <div className="space-y-1 sm:space-y-2">
                <h4 className="font-heading text-lg sm:text-xl md:text-2xl font-semibold text-scio-blue">
                  {currentTestimonial.name}
                </h4>
                <p className="font-body text-sm sm:text-base md:text-lg text-gray-600">
                  {currentTestimonial.title}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Dots */}
        <div className="flex justify-center mt-8 sm:mt-10 lg:mt-12 space-x-2 sm:space-x-3">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'bg-scio-blue w-6 sm:w-8' : 'bg-gray-300 hover:bg-gray-400'
              }`}
              onClick={() => {
                setCurrentIndex(index);
                resetAutoScroll();
              }}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
               
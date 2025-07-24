'use client';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      id: 1,
      service: "ScioThrive",
      quote: "Davis Abraham led an engaging and interactive online session for mid to senior-level officers, using technology effectively. A truly memorable experience.",
      name: "Smt. Aditi Mishra",
      title: "National Productivity Council",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      serviceColor: "text-scio-blue"
    },
    {
      id: 2,
      service: "ScioLingua",
      quote: "ScioLabs' BeGin curriculum is research-backed, teacher-friendly, and child-centered—making classroom implementation smooth and impactful.",
      name: "Annie Samuel",
      title: "EmpowerED",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      serviceColor: "text-scio-blue"
    },
    {
      id: 3,
      service: "ScioCare",
      quote: "The English for Nurses curriculum is structured, relevant, and engaging—boosting student confidence and communication skills in real healthcare contexts.",
      name: "Amy Tephilla A",
      title: "CBH College of Nursing",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      serviceColor: "text-scio-blue"
    },
    {
      id: 4,
      service: "ScioGuidance",
      quote: "The career counseling session was insightful, friendly, and tailored—providing clear direction and practical next steps.",
      name: "Dr. S. Sharma",
      title: "Parent from Lucknow",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      serviceColor: "text-scio-blue"
    }
  ];

  const currentTestimonial = testimonials[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50/30 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="font-heading heading-primary text-4xl md:text-5xl mb-6 text-scio-blue">
            What Our Clients Say
          </h2>
          <p className="font-body text-body text-lg text-gray-600 max-w-2xl mx-auto">
            Hear from our partners and clients about their experience with ScioLabs
          </p>
        </div>

        {/* Testimonial Content */}
        <div className="relative max-w-5xl mx-auto">
          {/* Navigation Arrows */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-12 z-10 w-12 h-12 rounded-full bg-white shadow-lg hover:shadow-xl border-2 border-gray-200 hover:border-scio-blue transition-all duration-300"
            onClick={handlePrev}
          >
            <i className="fas fa-chevron-left text-scio-blue"></i>
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-12 z-10 w-12 h-12 rounded-full bg-white shadow-lg hover:shadow-xl border-2 border-gray-200 hover:border-scio-blue transition-all duration-300"
            onClick={handleNext}
          >
            <i className="fas fa-chevron-right text-scio-blue"></i>
          </Button>

          {/* Single Testimonial Card */}
          <Card className="bg-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-8">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Quote Section */}
                <div className="flex-1">
                  {/* Service Badge */}
                  <Badge variant="outline" className="bg-scio-blue/10 text-scio-blue border-scio-blue mb-6">
                    {currentTestimonial.service}
                  </Badge>

                  {/* Quote Icon */}
                  <div className="text-scio-orange mb-6">
                    <i className="fas fa-quote-left text-5xl"></i>
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
          {testimonials.map((_, index) => (
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


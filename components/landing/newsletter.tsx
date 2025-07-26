'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '../ui/badge';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // Handle newsletter subscription logic here
      setIsSubscribed(true);
      setEmail('');
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setIsSubscribed(false);
      }, 3000);
    }
  };

  return (
    <section className="py-24 bg-gray-50 relative overflow-hidden">
      {/* Simple background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-64 h-64 bg-scio-blue/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-scio-orange/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <Card className="bg-white border-0 shadow-xl rounded-2xl overflow-hidden">
          <CardContent className="p-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* Left content section */}
              <div className="p-8 md:p-12 lg:p-16">
                <div className="space-y-8">
                  {/* Badge */}
                  <Badge className="" variant={"outline"}>
                    <span className="font-heading text-sm font-semibold text-scio-blue">Stay Updated</span>
                  </Badge>

                  {/* Heading */}
                  <div className="space-y-4">
                    <h2 className="font-heading heading-primary text-3xl md:text-4xl text-gray-800 leading-tight">
                      Stay Informed.{' '}<br></br>
                      <span className="text-scio-orange">
                        Stay Equipped.
                      </span>
                    </h2>
                    
                    <p className="font-body text-lg text-gray-600 leading-relaxed max-w-md">
                      Subscribe to get expert insights, trends, and practical resources from ScioLabs—straight to your inbox.
                    </p>
                  </div>

                  {/* Simple benefits list */}
                  <div className="space-y-3">
                    {[
                      'Exclusive educational resources',
                      'Early access to new programs',
                      'Success stories and case studies'
                    ].map((benefit, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="w-5 h-5 bg-scio-blue rounded-full flex items-center justify-center">
                          <i className="fas fa-check text-white text-xs"></i>
                        </div>
                        <span className="font-body text-gray-700">{benefit}</span>
                      </div>
                    ))}
                  </div>

                  {/* Social proof */}
                  {/* <div className="flex items-center space-x-4 pt-4">
                    <div className="flex -space-x-2">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="w-8 h-8 bg-scio-blue rounded-full border-2 border-white flex items-center justify-center">
                          <i className="fas fa-user text-white text-xs"></i>
                        </div>
                      ))}
                    </div>
                    <div>
                      <p className="font-heading text-gray-800 font-semibold">10,000+</p>
                      <p className="font-body text-gray-500 text-sm">Happy subscribers</p>
                    </div>
                  </div> */}
                </div>
              </div>

              {/* Right form section */}
              <div className="bg-scio-blue p-8 md:p-12">
                <div className="h-full flex flex-col justify-center space-y-8">
                  {/* Form header */}
                  <div className="text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-xl mx-auto mb-6 flex items-center justify-center">
                      <i className="fas fa-paper-plane text-white text-xl"></i>
                    </div>
                    <h3 className="font-heading text-2xl font-bold text-white mb-2">
                      Subscribe to Newsletter
                    </h3>
                    <p className="text-blue-100 text-sm">
                      Get weekly insights delivered to your inbox
                    </p>
                  </div>
                  
                  {/* Simple form */}
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <Input
                        id="newsletter-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        className="h-12 rounded-lg border-0 bg-white text-gray-800 placeholder:text-gray-500 focus:ring-2 focus:ring-white/50"
                        required
                      />
                    </div>
                    
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full h-12 rounded-lg bg-scio-orange hover:bg-scio-orange-dark text-white font-heading font-semibold transition-all duration-300 border-0"
                      disabled={isSubscribed}
                    >
                      {isSubscribed ? (
                        <span className="flex items-center justify-center space-x-2">
                          <i className="fas fa-check"></i>
                          <span>Successfully Subscribed!</span>
                        </span>
                      ) : (
                        <span className="flex items-center justify-center space-x-2">
                          <span>Subscribe Now</span>
                          <i className="fas fa-arrow-right"></i>
                        </span>
                      )}
                    </Button>
                  </form>
                  
                  <div className="text-center">
                    <p className="text-xs text-blue-200">
                      <i className="fas fa-shield-alt mr-1"></i>
                      We respect your privacy. Unsubscribe anytime.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
                  
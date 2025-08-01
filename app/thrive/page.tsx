import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Image from 'next/image';
import Link from 'next/link';
import { servicesData } from '@/lib/services-data';
import { CheckCircle, Users, Award, Play } from 'lucide-react';

export default function ThrivePage() {
  const service = servicesData.find((s) => s.id === 'thrive')!;

  // Sample stats data
  const stats = [
    { number: "2000+", label: "Professionals Trained", icon: "fas fa-users" },
    { number: "100+", label: "Organizations", icon: "fas fa-building" },
    { number: "97%", label: "Satisfaction Rate", icon: "fas fa-chart-line" },
    { number: "50+", label: "Corporate Clients", icon: "fas fa-handshake" }
  ];

  // Sample clients data
  const clients = [
    "/ScioThrive/client1.png",
    "/ScioThrive/client2.png", 
    "/ScioThrive/client3.png",
    "/ScioThrive/client4.png",
    "/ScioThrive/client5.png"
  ];

  // Sample testimonials
  const testimonials = [
    {
      quote: "The educator training program revolutionized our teaching approach. Our teachers are now more confident and effective.",
      author: "Dr. Sarah Wilson",
      role: "Superintendent, Metro School District",
      rating: 5
    },
    {
      quote: "Outstanding corporate training! Our team's communication and productivity improved dramatically after the sessions.",
      author: "James Rodriguez",
      role: "CEO, Innovation Tech",
      rating: 5
    },
    {
      quote: "The GenZ training program was exactly what our young adults needed. They're now more confident and career-ready.",
      author: "Maria Chen",
      role: "Youth Development Director",
      rating: 5
    }
  ];

  return (
    <main>
      {/* Hero Section */}
      <section className="py-24 pt-32 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden flex items-center">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-64 h-64 bg-scio-blue rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-scio-orange rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="text-white space-y-8">
              <div className="inline-flex items-center space-x-4 px-6 py-3 bg-gradient-to-r from-scio-blue to-scio-blue-light rounded-full text-white">
                <i className="fas fa-rocket text-xl"></i>
                <span className="font-heading heading-secondary text-lg font-semibold">ScioThrive</span>
              </div>
              
              <h1 className="font-heading heading-primary text-5xl md:text-7xl text-white mb-6">
                ScioThrive
              </h1>
              
              <p className="font-body text-body text-xl md:text-2xl text-gray-300 leading-relaxed">
                Skill-building programs to accelerate growth and unlock potential in academic and professional settings
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/contact">
                  <Button size="lg" className="bg-scio-blue hover:opacity-90 text-white px-8 py-4 rounded-xl font-heading font-semibold text-lg">
                    Get Started
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" size="lg" className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-gray-800 px-8 py-4 rounded-xl font-heading font-semibold text-lg">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative h-96 lg:h-[350px] overflow-hidden rounded-3xl shadow-2xl group">
                <Image
                  src="/1.jpg"
                  alt="Professional training and education"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-scio-blue/20 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Overview */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-heading heading-primary text-4xl text-gray-800 mb-6">
              About ScioThrive
            </h2>
            <p className="font-body text-body text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
              Designed to accelerate professional growth through modern teaching strategies, corporate training, and specialized programs for educators, professionals, and teenagers.
            </p>
          </div>

          {/* Service Categories Accordion */}
          <div className="mb-20">
            <h3 className="font-heading heading-secondary text-3xl text-gray-800 mb-8 text-center">
              Our Training Programs
            </h3>
            <Accordion type="single" collapsible className="max-w-4xl mx-auto">
              {service.features.map((feature, index) => (
                <AccordionItem key={feature.id} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-scio-blue to-scio-blue-light rounded-xl flex items-center justify-center">
                        <i className={`${feature.icon} text-white text-lg`}></i>
                      </div>
                      <div>
                        <h4 className="font-heading text-xl font-semibold text-gray-800">
                          {feature.title}
                        </h4>
                        <p className="font-body text-gray-600 text-sm">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pt-6 pl-16">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h5 className="font-heading font-semibold text-gray-800 mb-3">Training Focus:</h5>
                          <ul className="space-y-2">
                            {feature.title === 'Educator Training' ? [
                              'Modern teaching methodologies',
                              'Ed-tech tool integration',
                              'Student engagement strategies'
                            ] : feature.title === 'Corporate Training' ? [
                              'Team productivity enhancement',
                              'Communication skills',
                              'Leadership development'
                            ] : [
                              'Life skills development',
                              'Communication mastery',
                              'Career readiness'
                            ].map((detail, idx) => (
                              <li key={idx} className="flex items-center space-x-2">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span className="text-gray-600">{detail}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-heading font-semibold text-gray-800 mb-3">Key Outcomes:</h5>
                          <ul className="space-y-2">
                            {feature.title === 'Educator Training' ? [
                              'Enhanced teaching effectiveness',
                              'Improved student outcomes',
                              'Technology integration confidence'
                            ] : feature.title === 'Corporate Training' ? [
                              'Increased team productivity',
                              'Better workplace communication',
                              'Stronger leadership skills'
                            ] : [
                              'Future-ready mindset',
                              'Confidence in communication',
                              'Essential life skills mastery'
                            ].map((benefit, idx) => (
                              <li key={idx} className="flex items-center space-x-2">
                                <Award className="w-4 h-4 text-blue-500" />
                                <span className="text-gray-600">{benefit}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      {feature.link && (
                        <div className="mt-6">
                          <Link href={feature.link}>
                            <Button className="bg-scio-blue hover:opacity-90">
                              Learn More About {feature.title}
                            </Button>
                          </Link>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-white bg-opacity-30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className={`${stat.icon} text-2xl text-white`}></i>
                </div>
                <div className="text-4xl font-bold mb-2 text-white">{stat.number}</div>
                <div className="text-lg font-medium text-white">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-heading heading-primary text-4xl text-gray-800 mb-6">
              See ScioThrive in Action
            </h2>
            <p className="font-body text-lg text-gray-600 max-w-2xl mx-auto">
              Watch how our skill-building programs are accelerating professional growth and unlocking potential across organizations.
            </p>
          </div>
          
          <div className="relative max-w-4xl mx-auto">
            <div className="relative aspect-video bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/1.jpg"
                alt="Video thumbnail"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <button className="w-20 h-20 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Play className="w-8 h-8 text-gray-800 ml-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Clients Carousel */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-heading heading-primary text-3xl text-gray-800 mb-4">
              Trusted by Leading Organizations
            </h2>
            <p className="font-body text-gray-600">
              From schools to corporations, organizations worldwide trust ScioThrive for professional development
            </p>
          </div>
          
          <div className="relative overflow-hidden">
            <div 
              className="flex gap-8 opacity-70 hover:opacity-100 transition-opacity duration-300"
              style={{
                animation: `scroll ${clients.length * 3}s linear infinite`,
                width: `${clients.length * 200}px`
              }}
            >
              {[...clients, ...clients].map((client, index) => (
                <div key={index} className="flex-shrink-0 h-20 w-40 bg-gray-100 rounded-lg flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300 hover:scale-110">
                  <div className="text-gray-400 text-sm font-medium">Client Logo</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-heading heading-primary text-4xl text-gray-800 mb-6">
              What Our Clients Say
            </h2>
            <p className="font-body text-lg text-gray-600 max-w-2xl mx-auto">
              Hear from organizations and professionals who have experienced growth and transformation through ScioThrive.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <i key={i} className="fas fa-star text-yellow-400"></i>
                    ))}
                  </div>
                  <blockquote className="text-gray-700 mb-6 italic">
                    &quot;{testimonial.quote}&quot;
                  </blockquote>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-scio-blue to-scio-orange rounded-full flex items-center justify-center mr-4">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">{testimonial.author}</div>
                      <div className="text-sm text-gray-600">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export async function generateMetadata() {
  return {
    title: 'ScioThrive - Professional Development & Training Programs | ScioLabs',
    description: 'Skill-building programs to accelerate growth and unlock potential in academic and professional settings. Educator training, corporate development, and GenZ programs.',
  }
}
  
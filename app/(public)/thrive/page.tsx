import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { servicesData } from '@/lib/services-data';
import { Users, Award, Play, Download } from 'lucide-react';

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
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 pt-24 sm:pt-28 md:pt-32 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden flex items-center min-h-[600px] sm:min-h-[700px]">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 sm:top-20 left-10 sm:left-20 w-32 sm:w-64 h-32 sm:h-64 bg-scio-blue rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 sm:bottom-20 right-10 sm:right-20 w-48 sm:w-96 h-48 sm:h-96 bg-scio-orange rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            <div className="text-white space-y-4 sm:space-y-6 lg:space-y-8">
              <div className="inline-flex items-center space-x-3 sm:space-x-4 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-scio-blue to-scio-blue-light rounded-full text-white text-sm sm:text-base">
                <i className="fas fa-rocket text-lg sm:text-xl"></i>
                <span className="font-heading heading-secondary font-semibold">ScioThrive</span>
              </div>
              
              <h1 className="font-heading heading-primary text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white leading-tight">
                ScioThrive
              </h1>
              
              <p className="font-body text-body text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 leading-relaxed">
                Skill-building programs to accelerate growth and unlock potential in academic and professional settings
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link href="/contact" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto bg-scio-blue hover:opacity-90 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-heading font-semibold text-base sm:text-lg">
                    Get Started
                  </Button>
                </Link>
                <Link href="/contact" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto border-2 border-white text-white bg-transparent hover:bg-white hover:text-gray-800 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-heading font-semibold text-base sm:text-lg">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="relative mt-8 lg:mt-0">
              <div className="relative h-64 sm:h-80 md:h-96 lg:h-[350px] overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl group">
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
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Service Categories Sections */}
          <div className="mb-12 sm:mb-16 lg:mb-20">
            <div className="text-center mb-8 sm:mb-12 lg:mb-16">
              <h2 className="font-heading heading-primary text-2xl sm:text-3xl md:text-4xl lg:text-4xl text-gray-800 mb-4 sm:mb-6">
                Our Training Programs
              </h2>
              <p className="font-body text-base sm:text-lg text-gray-600 max-w-3xl mx-auto px-4">
                Comprehensive skill-building programs designed to accelerate growth and unlock potential
              </p>
            </div>

            <div className="flex flex-col space-y-12 sm:space-y-16 lg:space-y-24">
              {service.features.map((feature, index) => (
                <div key={feature.id} className="">
                  {/* Content Column */}
                    <div className="bg-gradient-to-br from-blue-50 to-slate-50 p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl border border-blue-100 shadow-sm grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
                      {/* Image Column - First on mobile, alternates on desktop */}
                      <div className={`relative order-1 ${index % 2 === 1 ? 'lg:order-2' : 'lg:order-1'}`} id={feature.title.toLowerCase().replace(/\s+/g, '-')}
>
                        <div className="relative h-48 sm:h-64 md:h-72 lg:h-80 overflow-hidden rounded-xl sm:rounded-2xl shadow-xl group">
                          <Image
                            src={
                              feature.title === 'Educator Training'
                                ? 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80'
                                : feature.title === 'Corporate Training'
                                ? 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80'
                                : 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80'
                            }
                            alt={`${feature.title} program`}
                            fill
                            className="object-cover aspect-video group-hover:scale-105 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-scio-blue/30 to-transparent"></div>
                        </div>
                        {/* Floating elements */}
                        <div className={`absolute -top-2 sm:-top-4 ${index % 2 === 1 ? '-left-2 sm:-left-4' : '-right-2 sm:-right-4'} w-12 sm:w-16 h-12 sm:h-16 bg-scio-blue rounded-lg sm:rounded-xl opacity-80 animate-pulse`}></div>
                        <div className={`absolute -bottom-2 sm:-bottom-4 ${index % 2 === 1 ? '-right-2 sm:-right-4' : '-left-2 sm:-left-4'} w-16 sm:w-20 h-16 sm:h-20 bg-scio-orange rounded-xl sm:rounded-2xl opacity-60 animate-pulse delay-1000`}></div>
                      </div>

                      {/* Content - Second on mobile, alternates on desktop */}
                      <div className={`order-2 ${index % 2 === 1 ? 'lg:order-1' : 'lg:order-2'}`}>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 mb-4 sm:mb-6">
                          <div 
                            className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{
                              background: 'linear-gradient(to right, var(--scio-blue), var(--scio-blue-light))'
                            }}
                          >
                            <i className={`${feature.icon} text-white text-xl sm:text-2xl`}></i>
                          </div>
                          <div>
                            <h3 className="font-heading heading-secondary text-xl sm:text-2xl lg:text-3xl text-gray-800 mb-1 sm:mb-2">
                              {feature.title}
                            </h3>
                            <p className="font-body text-gray-600 text-sm sm:text-base lg:text-lg">
                              {feature.description}
                            </p>
                          </div>
                        </div>

                        <div className="gap-6">
                          <div>
                            <h5 className="font-heading font-semibold text-gray-800 mb-3 sm:mb-4 text-base sm:text-lg">Key Features:</h5>
                            <ul className="space-y-2 sm:space-y-3">
                              {(feature.title === 'Educator Training' ? [
                                'Practical & actionable strategies for classrooms.',
                                'Covers pedagogy, tools, and mindset.',
                                'Emphasis on digital tools and AI use.',
                                'Focus on teacher well-being and growth.',
                                'Reflective, interactive, & collaborative sessions.'
                              ] : feature.title === 'Corporate Training' ? [
                                'Fast-paced, power-packed sessions.',
                                'Builds leadership, productivity & EQ.',
                                'Customised for specific team needs.',
                                'Combines personal and team growth.',
                                'Ready-to-use tools and templates.'
                              ] : [
                                'Teen-friendly, interactive delivery.',
                                'Real-life skills for real-world problems.',
                                'Mix of self-discovery and group work.',
                                'Builds confidence and communication.',
                                'Perfect for schools & youth groups.'
                              ]).map((benefit, idx) => (
                                <li key={idx} className="flex items-start sm:items-center space-x-2 sm:space-x-3">
                                  <Award className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 flex-shrink-0 mt-0.5 sm:mt-0" />
                                  <span className="text-gray-700 text-sm sm:text-base">{benefit}</span>
                                </li>
                              ))}
                            </ul>
                            
                            {/* Download Brochure Button */}
                            <div className="mt-4 sm:mt-6">
                              <a 
                                href={
                                  feature.title === 'Educator Training' 
                                    ? '/ScioThrive/brochure/School_Teachers_Training.pdf'
                                    : feature.title === 'Corporate Training'
                                    ? '/ScioThrive/brochure/ScioLabs_Corporate_Training_Topics.pdf'
                                    : '/ScioThrive/brochure/ScioLabs_Teens_Workshops.pdf'
                                }
                                download
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block w-full sm:w-auto"
                              >
                                <Button 
                                  className="w-full sm:w-auto bg-scio-blue hover:opacity-90 text-white rounded-lg font-heading font-semibold text-sm sm:text-base"
                                >
                                  <Download className="w-4 h-4 mr-2" />
                                  Download Brochure
                                </Button>
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-opacity-30 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 lg:mb-4">
                  <i className={`${stat.icon} text-lg sm:text-xl lg:text-2xl text-white`}></i>
                </div>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2 text-white">{stat.number}</div>
                <div className="text-xs sm:text-sm lg:text-base xl:text-lg font-medium text-white px-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Section */}
      {/* <section className="py-24 bg-gray-50">
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
      </section> */}

      {/* Clients Carousel */}
      {/* <section className="py-20 bg-white">
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
      </section> */}

      {/* Testimonials */}
      {/* <section className="py-24 bg-gradient-to-br from-blue-50 to-indigo-50">
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
      </section> */}
    </main>
  );
}

export async function generateMetadata() {
  return {
    title: 'ScioThrive - Professional Development & Training Programs | ScioLabs',
    description: 'Skill-building programs to accelerate growth and unlock potential in academic and professional settings. Educator training, corporate development, and GenZ programs.',
  }
}




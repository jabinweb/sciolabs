import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { servicesData } from '@/lib/services-data';
import { Users, Award, Play } from 'lucide-react';

export default function LinguaPage() {
  const service = servicesData.find((s) => s.id === 'lingua')!;

  // Sample stats data
  const stats = [
    { number: "1500+", label: "Students Served", icon: "fas fa-user-graduate" },
    { number: "50+", label: "Institutions", icon: "fas fa-university" },
    { number: "95%", label: "Success Rate", icon: "fas fa-star" },
    { number: "30+", label: "Educational Partners", icon: "fas fa-hands-helping" }
  ];

  // Sample clients data
  const clients = [
    "/ScioLingua/client1.png",
    "/ScioLingua/client2.png", 
    "/ScioLingua/client3.png",
    "/ScioLingua/client4.png",
    "/ScioLingua/client5.png"
  ];

  // Sample testimonials
  const testimonials = [
    {
      quote: "TheoLingua has transformed how our students engage with theological texts. Their confidence in English has grown tremendously.",
      author: "Rev. Dr. Michael Thompson",
      role: "Dean, Seminary College",
      rating: 5
    },
    {
      quote: "rootED provided exactly what our young learners needed. The foundational English skills program is exceptional.",
      author: "Sister Mary Catherine",
      role: "Principal, St. Joseph's School",
      rating: 5
    },
    {
      quote: "The integration of faith and language learning is beautifully done. Our students are more engaged than ever.",
      author: "Pastor David Lee",
      role: "Educational Director",
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
                <i className="fas fa-book text-xl"></i>
                <span className="font-heading heading-secondary text-lg font-semibold">ScioLingua</span>
              </div>
              
              <h1 className="font-heading heading-primary text-5xl md:text-7xl text-white mb-6">
                ScioLingua
              </h1>
              
              <p className="font-body text-body text-xl md:text-2xl text-gray-300 leading-relaxed">
                Custom English programs designed to build confidence and communication in diverse learning contexts
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
                  src="/5.jpg"
                  alt="Language learning and education"
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

          {/* Service Categories Sections */}
          <div className="mb-20">
            <div className="text-center mb-16">
              <h2 className="font-heading heading-primary text-4xl text-gray-800 mb-6">
                Our Language Programs
              </h2>
              <p className="font-body text-lg text-gray-600 max-w-3xl mx-auto">
                Innovative language programs that integrate faith-based learning with foundational English education
              </p>
            </div>

            <div className="flex flex-col space-y-24">
              {service.features.map((feature, index) => (
                <div key={feature.id} className="">
                  {/* Content Column */}
                    <div className="bg-gradient-to-br from-blue-50 to-slate-50 p-8 rounded-2xl border border-blue-100 shadow-sm grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                      {/* Image Column - First on mobile, alternates on desktop */}
                      <div className={`relative order-1 ${index % 2 === 1 ? 'lg:order-2' : 'lg:order-1'}`}>
                        <div className="relative h-80 overflow-hidden rounded-2xl shadow-xl group">
                          <Image
                            src={
                              feature.title === 'TheoLingua'
                                ? 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80'
                                : 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80'
                            }
                            alt={`${feature.title} program`}
                            fill
                            className="object-cover aspect-video group-hover:scale-105 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-scio-blue/30 to-transparent"></div>
                        </div>
                        {/* Floating elements */}
                        <div className={`absolute -top-4 ${index % 2 === 1 ? '-left-4' : '-right-4'} w-16 h-16 bg-scio-blue rounded-xl opacity-80 animate-pulse`}></div>
                        <div className={`absolute -bottom-4 ${index % 2 === 1 ? '-right-4' : '-left-4'} w-20 h-20 bg-scio-orange rounded-2xl opacity-60 animate-pulse delay-1000`}></div>
                      </div>

                      {/* Content - Second on mobile, alternates on desktop */}
                      <div className={`order-2 ${index % 2 === 1 ? 'lg:order-1' : 'lg:order-2'}`}>
                        <div className="flex items-center space-x-4 mb-6">
                          <div 
                            className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{
                              background: 'linear-gradient(to right, var(--scio-blue), var(--scio-blue-light))'
                            }}
                          >
                            <i className={`${feature.icon} text-white text-2xl`}></i>
                          </div>
                          <div>
                            <h3 className="font-heading heading-secondary text-2xl lg:text-3xl text-gray-800">
                              {feature.title}
                            </h3>
                            <p className="font-body text-gray-600 text-lg">
                              {feature.description}
                            </p>
                          </div>
                        </div>

                        <div className="gap-6">
                          <div>
                            <h5 className="font-heading font-semibold text-gray-800 mb-4 text-lg">Key Features:</h5>
                            <ul className="space-y-3">
                              {(feature.title === 'TheoLingua' ? [
                                'Bible-based ESL curriculum design.',
                                'Theological vocabulary development.',
                                'Reading comprehension for religious texts.',
                                'Communication skills for ministry.',
                                'Cultural and spiritual integration.'
                              ] : [
                                'Age-appropriate foundational English.',
                                'Interactive learning activities.',
                                'Progressive skill development.',
                                'Creative expression opportunities.',
                                'Supportive learning environment.'
                              ]).map((benefit, idx) => (
                                <li key={idx} className="flex items-center space-x-3">
                                  <Award className="w-5 h-5 text-blue-500 flex-shrink-0" />
                                  <span className="text-gray-700 text-base">{benefit}</span>
                                </li>
                              ))}
                            </ul>
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
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className={`${stat.icon} text-2xl text-blue-600`}></i>
                </div>
                <div className="text-4xl font-bold mb-2 text-white">{stat.number}</div>
                <div className="text-lg font-medium text-white">{stat.label}</div>
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
              See ScioLingua in Action
            </h2>
            <p className="font-body text-lg text-gray-600 max-w-2xl mx-auto">
              Discover how our innovative language programs are transforming English education through faith-based learning approaches.
            </p>
          </div>
          
          <div className="relative max-w-4xl mx-auto">
            <div className="relative aspect-video bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/5.jpg"
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
              Trusted Educational Partners
            </h2>
            <p className="font-body text-gray-600">
              Faith-based institutions and schools trust ScioLingua for comprehensive English language education
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
                  <div className="text-gray-400 text-sm font-medium">Partner Logo</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section> */}

      {/* Testimonials */}
      <section className="py-24 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-heading heading-primary text-4xl text-gray-800 mb-6">
              What Our Partners Say
            </h2>
            <p className="font-body text-lg text-gray-600 max-w-2xl mx-auto">
              Hear from educational leaders who have experienced the transformative impact of ScioLingua programs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <i key={i} className="fas fa-star text-yellow-400"></i>
                    ))}
                  </div>
                  <blockquote className="text-gray-700 mb-6 italic">
                    &quot;{testimonial.quote}&quot;
                  </blockquote>
                  <div className="flex items-center">
                    {/* <div className="w-12 h-12 bg-gradient-to-r from-scio-blue to-scio-orange rounded-full flex items-center justify-center mr-4">
                      <Users className="w-6 h-6 text-white" />
                    </div> */}
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
    title: 'ScioLingua - Custom English Programs | ScioLabs',
    description: 'Custom English programs designed to build confidence and communication in diverse learning contexts. Faith-based language learning solutions.',
  }
}

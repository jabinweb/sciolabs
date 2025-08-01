import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Image from 'next/image';
import Link from 'next/link';

import { servicesData } from '@/lib/services-data';
import { CheckCircle, Users, Award, Play } from 'lucide-react';

export default function LinguaPage() {
  const service = servicesData.find((s) => s.id === 'lingua')!;

  // Sample stats data
  const stats = [
    { number: "500+", label: "Students Trained", icon: "fas fa-graduation-cap" },
    { number: "25+", label: "Educational Partners", icon: "fas fa-school" },
    { number: "98%", label: "Course Completion", icon: "fas fa-chart-line" },
    { number: "3", label: "Language Levels", icon: "fas fa-layer-group" }
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
      quote: "TheoLingua has revolutionized how we teach English in our seminary. Students are more engaged and confident.",
      author: "Rev. Michael Thompson",
      role: "Dean, Faith Seminary",
      rating: 5
    },
    {
      quote: "rootED provided an excellent foundation for our young learners. The curriculum is age-appropriate and effective.",
      author: "Sister Mary Catherine",
      role: "Elementary School Principal",
      rating: 5
    },
    {
      quote: "The integration of faith and language learning is seamless. Our students love the program.",
      author: "Pastor David Kim",
      role: "Youth Ministry Director",
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
                <Link href="https://theo.sciolabs.in" target="_blank">
                  <Button size="lg" className="bg-scio-blue hover:opacity-90 text-white px-8 py-4 rounded-xl font-heading font-semibold text-lg">
                    Explore TheoLingua
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
          <div className="text-center mb-16">
            <h2 className="font-heading heading-primary text-4xl text-gray-800 mb-6">
              About ScioLingua
            </h2>
            <p className="font-body text-body text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
              Innovative language programs that integrate faith-based learning with foundational English education, designed for diverse educational needs and spiritual growth.
            </p>
          </div>

          {/* Service Categories Accordion */}
          <div className="mb-20">
            <h3 className="font-heading heading-secondary text-3xl text-gray-800 mb-8 text-center">
              Our Programs
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
                          <h5 className="font-heading font-semibold text-gray-800 mb-3">Program Features:</h5>
                          <ul className="space-y-2">
                            {feature.title === 'TheoLingua' ? [
                              'Bible-based ESL curriculum',
                              'Theological vocabulary building',
                              'Reading comprehension skills'
                            ] : [
                              'Foundational literacy skills',
                              'Age-appropriate content',
                              'Interactive learning methods'
                            ].map((detail, idx) => (
                              <li key={idx} className="flex items-center space-x-2">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span className="text-gray-600">{detail}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-heading font-semibold text-gray-800 mb-3">Key Benefits:</h5>
                          <ul className="space-y-2">
                            {feature.title === 'TheoLingua' ? [
                              'Strengthened theological reading',
                              'Enhanced communication skills',
                              'Cultural and spiritual growth'
                            ] : [
                              'Strong English foundation',
                              'Confidence building',
                              'Improved literacy rates'
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
                          <Link href={feature.link} target={feature.title === 'TheoLingua' ? '_blank' : undefined}>
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
              See ScioLingua in Action
            </h2>
            <p className="font-body text-lg text-gray-600 max-w-2xl mx-auto">
              Discover how our faith-integrated language programs are transforming English education and building stronger communication skills.
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
      </section>

      {/* Clients Carousel */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-heading heading-primary text-3xl text-gray-800 mb-4">
              Trusted by Educational Partners
            </h2>
            <p className="font-body text-gray-600">
              Faith-based institutions worldwide trust ScioLingua for quality English education
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
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-heading heading-primary text-4xl text-gray-800 mb-6">
              What Our Partners Say
            </h2>
            <p className="font-body text-lg text-gray-600 max-w-2xl mx-auto">
              Hear from educational institutions and faith communities that have experienced transformation through ScioLingua.
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
                    &ldquo;{testimonial.quote}&rdquo;
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
    title: 'ScioLingua - Faith-Based English Language Programs | ScioLabs',
    description: 'Custom English programs designed to build confidence and communication in diverse learning contexts, integrating faith-based learning with foundational English education.',
  }
}

  
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { servicesData } from '@/lib/services-data';

export default function ServicesPage() {
  return (
    <main>
      {/* Hero Section - Updated for transparent header */}
      <section className="py-24 pt-32 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden flex items-center">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-64 h-64 bg-scio-blue rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-scio-orange rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center">
            <h1 className="font-heading heading-primary text-5xl md:text-7xl text-white mb-8">
              Our <span className="bg-gradient-to-r from-scio-orange to-yellow-400 bg-clip-text text-transparent">Services</span>
            </h1>
            <p className="font-body text-body text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Comprehensive educational solutions designed to transform lives through innovative programs, 
              personalized guidance, and cutting-edge technology.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid - Updated to use centralized data */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="space-y-24">
            {servicesData.map((service, index) => (
              <div key={service.id} className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
                {/* Content */}
                <div className={`space-y-8 ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                  <div className="space-y-6">
                    <div className={`inline-flex items-center space-x-4 px-6 py-3 bg-gradient-to-r from-${service.primaryColor} to-${service.primaryColor}-light rounded-full text-white`}>
                      <i className={`${service.features[0].icon} text-xl`}></i>
                      <span className="font-heading heading-secondary text-lg font-semibold">{service.title}</span>
                    </div>
                    
                    <h2 className={`font-heading heading-primary text-4xl md:text-5xl text-${service.primaryColor} text-balance`}>
                      {service.title}
                    </h2>
                    
                    <p className="font-body text-body text-lg text-gray-600 leading-relaxed">
                      {service.subtitle}
                    </p>
                  </div>

                  {/* Features List with Links */}
                  <div className="space-y-4">
                    <h3 className="font-heading heading-secondary text-xl font-semibold text-gray-800 mb-4">Key Features:</h3>
                    <div className="grid grid-cols-1 gap-3">
                      {service.detailedFeatures.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center space-x-3">
                          <div className={`w-2 h-2 rounded-full bg-${service.primaryColor}`}></div>
                          <span className="font-body text-body text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Subservice Links */}
                  <div className="space-y-4">
                    <h3 className="font-heading heading-secondary text-xl font-semibold text-gray-800 mb-4">Explore:</h3>
                    <div className="flex flex-wrap gap-2">
                      {service.subserviceLinks.map((subservice, subIndex) => (
                        <Link key={subIndex} href={subservice.link}>
                          <span className={`px-4 py-2 bg-${service.primaryColor}/10 text-${service.primaryColor} rounded-lg text-sm font-medium hover:bg-${service.primaryColor}/20 transition-colors cursor-pointer`}>
                            {subservice.name}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Target Audience */}
                  <div className="space-y-4">
                    <h3 className="font-heading heading-secondary text-xl font-semibold text-gray-800 mb-4">For:</h3>
                    <div className="flex flex-wrap gap-2">
                      {service.targetAudience.map((audience, audienceIndex) => (
                        <span key={audienceIndex} className={`px-3 py-1 bg-${service.primaryColor}/10 text-${service.primaryColor} rounded-full text-sm font-medium`}>
                          {audience}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link href={service.serviceLink}>
                      <Button 
                        size="lg" 
                        className={`bg-${service.primaryColor} hover:opacity-90 text-white px-8 py-4 rounded-xl font-heading font-semibold text-lg transition-all duration-300 transform hover:scale-105`}
                      >
                        Learn More
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      size="lg"
                      className={`border-2 border-${service.primaryColor} text-${service.primaryColor} hover:bg-${service.primaryColor} px-8 py-4 rounded-xl font-heading font-semibold text-lg transition-all duration-300`}
                    >
                      Get Started
                    </Button>
                  </div>
                </div>

                {/* Image */}
                <div className={`relative ${index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                  <div className="relative h-96 lg:h-[500px] overflow-hidden rounded-3xl shadow-2xl group">
                    <Image
                      src={service.imageUrl}
                      alt={service.imageAlt}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t from-${service.primaryColor}/20 to-transparent`}></div>
                  </div>
                  
                  {/* Floating Badge */}
                  <div className={`absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-r from-${service.primaryColor} to-${service.primaryColor}-light rounded-2xl flex items-center justify-center shadow-xl`}>
                    <i className={`${service.features[0].icon} text-white text-2xl`}></i>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section - Updated with consistent fonts */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-heading heading-primary text-4xl md:text-5xl text-scio-blue mb-6">
              Our Process
            </h2>
            <p className="font-body text-body text-xl text-gray-600 max-w-3xl mx-auto">
              A systematic approach to delivering exceptional educational solutions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Consultation", desc: "Understanding your specific needs and goals", icon: "fas fa-comments" },
              { step: "02", title: "Planning", desc: "Developing customized solutions and strategies", icon: "fas fa-clipboard-list" },
              { step: "03", title: "Implementation", desc: "Executing programs with expert guidance", icon: "fas fa-cogs" },
              { step: "04", title: "Support", desc: "Ongoing assistance and performance tracking", icon: "fas fa-headset" }
            ].map((item, index) => (
              <Card key={index} className="group bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                <CardContent className="p-8 text-center">
                  <div className="text-4xl font-bold text-scio-orange mb-4 font-heading">{item.step}</div>
                  <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-scio-blue to-scio-blue-light rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <i className={`${item.icon} text-white text-xl`}></i>
                  </div>
                  <h3 className="font-heading heading-secondary text-xl font-semibold text-gray-800 mb-3">{item.title}</h3>
                  <p className="font-body text-body text-gray-600 text-sm">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

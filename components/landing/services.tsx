'use client';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { servicesData, type ServiceFeature, type ServiceData } from '@/lib/services-data';
import { useState, useEffect } from 'react';

export default function ServicesSection() {
  const [partnersData, setPartnersData] = useState<Record<string, string[]>>({});

  useEffect(() => {
    const checkPartners = async () => {
      const partners: Record<string, string[]> = {};
      
      for (const service of servicesData) {
        try {
          const serviceDir = service.id === 'guidance' ? 'ScioGuidance' : 
                           service.id === 'sprints' ? 'ScioSprints' : 
                           service.id === 'thrive' ? 'ScioThrive' : null;
          
          if (serviceDir) {
            
            // Fetch directory listing from API
            const response = await fetch(`/api/directory/${serviceDir}`);
            
            if (response.ok) {
              const data = await response.json();
              
              if (data.images && data.images.length > 0) {
                const imagePaths = data.images.map((img: string) => `/${serviceDir}/${img}`);
                partners[service.id] = imagePaths;
              } else {
                console.log(`No images found for ${service.id}`);
              }
            } else {
              const errorData = await response.json();
              console.log(`Error response for ${serviceDir}:`, errorData);
            }
          }
        } catch (error) {
          console.error(`Error checking partners for ${service.id}:`, error);
        }
      }
      
      setPartnersData(partners);
    };

    checkPartners();
  }, []);

  const renderServiceCard = (service: ServiceFeature, primaryColor: string, borderColor: string) => {
    const cardClass = service.featured 
      ? `group mb-4 shadow-lg hover:shadow-2xl transition-all duration-300 text-white bg-${primaryColor} border-0`
      : `group mb-4 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-300 border border-${borderColor}/50 hover:border-${borderColor.split('-')[1]}-200`;

    const iconBgClass = service.featured ? "bg-white/20" : `bg-${primaryColor}`;
    const titleClass = service.featured 
      ? `font-heading heading-secondary text-xl mb-3 group-hover:text-${primaryColor === 'scio-blue' ? 'blue' : 'orange'}-100 transition-colors`
      : `font-heading heading-secondary text-xl mb-3 text-gray-800 group-hover:text-${primaryColor} transition-colors`;
    const descClass = service.featured 
      ? `font-body text-${primaryColor === 'scio-blue' ? 'blue' : 'orange'}-100`
      : "font-body text-body text-gray-600";

    return (
      <Link href={service.link || '#'} key={service.id}>
        <Card className={cardClass}>
          <CardContent className="px-4 py-0 sm:px-6" id='services'>
            <div className="flex items-start space-x-4">
              <div className={`flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ${iconBgClass}`}>
                <i className={`${service.icon} text-white text-lg sm:text-xl`}></i>
              </div>
              <div>
                <h3 className={titleClass}>{service.title}</h3>
                <p className={`${descClass} text-sm sm:text-base`}>{service.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  };

  const renderSection = (section: ServiceData, index: number) => {
    const cssVarColor = section.primaryColor === 'scio-blue' ? '--scio-blue' : 
                       section.primaryColor === 'scio-orange' ? '--scio-orange' : 
                       section.primaryColor === 'scio-green' ? '--scio-green' : '--scio-purple';
    const cssVarColorDark = section.primaryColor === 'scio-blue' ? '--scio-blue-dark' : 
                           section.primaryColor === 'scio-orange' ? '--scio-orange-dark' : 
                           section.primaryColor === 'scio-green' ? '--scio-green' : '--scio-purple';
    const floatingColor1 = section.primaryColor === 'scio-blue' ? 'bg-scio-blue' : 
                          section.primaryColor === 'scio-orange' ? 'bg-scio-orange' : 
                          section.primaryColor === 'scio-green' ? 'bg-scio-green' : 'bg-scio-purple';
    const floatingColor2 = section.primaryColor === 'scio-blue' ? 'bg-scio-orange' : 'bg-scio-blue';
    const paddingClass = index === 0 ? "pt-32 pb-20" : "py-20";
    const isImageRight = index % 2 === 0; // Even indices have image on right, odd on left

    const hasPartners = partnersData[section.id] && partnersData[section.id].length > 0;

    return (
      <section key={section.id} id={section.id} className={`${paddingClass} bg-gradient-to-br ${section.backgroundGradient} relative overflow-hidden`}>
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-100/20 to-slate-100/20"></div>
        <div 
          className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 rounded-full -translate-y-48 translate-x-32 sm:translate-x-48 blur-3xl" 
          style={{backgroundColor: `var(${cssVarColor})`, opacity: 0.1}}
        ></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="font-heading heading-primary text-3xl sm:text-4xl md:text-5xl mb-4 text-balance leading-tight" 
                style={{
                  background: `linear-gradient(to right, var(${cssVarColor}), var(${cssVarColorDark}))`, 
                  WebkitBackgroundClip: 'text', 
                  WebkitTextFillColor: 'transparent'
                }}>
              {section.title}
            </h2>
            <p className="font-body text-body text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              {section.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            {/* Content Column - Order changes based on image position */}
            <div className={`space-y-4 sm:space-y-8 ${isImageRight ? 'lg:order-1' : 'lg:order-2'}`}>
              {section.features.map(service => renderServiceCard(service, section.primaryColor, section.borderColor))}

              {/* Know More Button */}
              <div className="flex justify-start mt-6 sm:mt-8">
                <Link href={section.serviceLink}>
                  <Button 
                    size="lg"
                    className={`bg-${section.primaryColor} cursor-pointer hover:opacity-90 text-white px-4 py-3 sm:px-8 sm:py-4 rounded-xl font-heading text-sm sm:text-base transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl`}
                  >
                    <span className="flex items-center space-x-2 sm:space-x-3">
                      <span>Know More</span>
                      <i className="fas fa-arrow-right text-xs sm:text-sm group-hover:translate-x-1 transition-transform duration-300"></i>
                    </span>
                  </Button>
                </Link>
              </div>
            </div>

            {/* Image Column - Order changes based on alternating pattern */}
            <div className={`relative ${isImageRight ? 'lg:order-2' : 'lg:order-1'}`}>
              <div className="relative h-[250px] sm:h-[350px] lg:h-[500px] overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl group">
                <Image 
                  src={section.imageUrl}
                  alt={section.imageAlt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  priority={index < 2} // Load first two images with priority
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-orange-900/20 to-transparent"></div>
              </div>
              {/* Floating elements - Position changes based on image side */}
              <div className={`absolute -top-4 sm:-top-6 ${isImageRight ? '-right-4 sm:-right-6' : '-left-4 sm:-left-6'} w-16 sm:w-24 h-16 sm:h-24 ${floatingColor1} rounded-xl sm:rounded-2xl opacity-80 animate-pulse`}></div>
              <div className={`absolute -bottom-4 sm:-bottom-6 ${isImageRight ? '-left-4 sm:-left-6' : '-right-4 sm:right-6'} w-20 sm:w-32 h-20 sm:h-32 ${floatingColor2} rounded-2xl sm:rounded-3xl opacity-60 animate-pulse delay-1000`}></div>
            </div>
          </div>

          {/* Partners Section - Only show if partners exist */}
          {hasPartners && (
            <div className="mt-12 sm:mt-20">
              <div className="mx-auto">
                <h4 className={`font-heading heading-secondary text-xl sm:text-2xl text-gray-800 mb-6 sm:mb-8 text-left flex items-center`}>
                  <i className={`${section.partnersIcon} ${section.partnersIconColor} mr-2 sm:mr-3 text-lg sm:text-xl`}></i>
                  {section.partnersTitle}
                </h4>
                
                {/* Carousel for many images, static for few */}
                {partnersData[section.id].length > 5 ? (
                  <div className="relative overflow-hidden">
                    <div 
                      className="flex gap-6 sm:gap-10 animate-scroll opacity-70 hover:opacity-100 transition-opacity duration-300"
                      style={{
                        width: `${partnersData[section.id].length * 200}px`,
                        animation: `scroll ${partnersData[section.id].length * 3}s linear infinite`
                      }}
                    >
                      {[...partnersData[section.id], ...partnersData[section.id]].map((imagePath, i) => (
                        <div key={i} className="flex-shrink-0 h-16 sm:h-20 w-32 sm:w-40 bg-gray-200 rounded-lg flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300 hover:scale-110 overflow-hidden">
                          <Image
                            src={imagePath}
                            alt={`Partner ${(i % partnersData[section.id].length) + 1}`}
                            width={140}
                            height={100}
                            className="object-contain p-3 mix-blend-multiply"
                            style={{
                              mixBlendMode: 'multiply',
                              height: '80px',
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center justify-start gap-6 sm:gap-10 opacity-70 hover:opacity-100 transition-opacity duration-300">
                    {partnersData[section.id].map((imagePath, i) => (
                      <div key={i} className="h-16 sm:h-20 w-32 sm:w-40 bg-gray-200 rounded-lg flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300 hover:scale-110 overflow-hidden">
                        <Image
                          src={imagePath}
                          alt={`Partner ${i + 1}`}
                          width={140}
                          height={100}
                          className="object-contain p-3 mix-blend-multiply"
                          style={{
                            mixBlendMode: 'multiply',
                            height: '80px',
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    );
  };

  return (
    <>
      {servicesData.map((section, index) => renderSection(section, index))}
    </>
  );
}
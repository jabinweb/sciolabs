import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { Check } from 'lucide-react';

export default function AboutPage() {
  const coreValues = [
    {
      title: "Excellence",
      description: "We uphold high standards in content, delivery, and learner success.",
      icon: "fas fa-star",
      bgColor: "bg-scio-blue"
    },
    {
      title: "Empowerment", 
      description: "We equip individuals to take charge of their learning and growth.",
      icon: "fas fa-users",
      bgColor: "bg-scio-orange"
    },
    {
      title: "Integrity",
      description: "We act with transparency, trust, and ethical responsibility.", 
      icon: "fas fa-shield-alt",
      bgColor: "bg-scio-green"
    },
    {
      title: "Innovation",
      description: "We embrace creativity and technology to transform learning.",
      icon: "fas fa-lightbulb",
      bgColor: "bg-scio-purple"
    },
    {
      title: "Personalization",
      description: "We tailor learning to fit unique needs and goals.",
      icon: "fas fa-cog",
      bgColor: "bg-scio-blue"
    },
    {
      title: "Impact",
      description: "We focus on real outcomes that improve lives and communities.",
      icon: "fas fa-chart-line",
      bgColor: "bg-scio-orange"
    }
  ];

  const teamMembers = [
    { 
      name: "Davis Abraham", 
      role: "Founder & CEO", 
      image: "/Davis.webp",
      description: "Visionary leader driving educational innovation"
    },
    { 
      name: "Emmanuel Davied", 
      role: "Co-Founder & CFO", 
      image: "1472099645785-5658abf4ff4e",
      description: "Strategic financial planning and operations expert"
    },
    { 
      name: "Christa Richie", 
      role: "Operations Manager", 
      image: "1494790108755-2616b612b47c",
      description: "Excellence in program delivery and management"
    }
  ];

  const collaborators = [
    "Sheryl Sam Shiju",
    "Devansh Singh", 
    "Gungun Ahuja",
    "Joshi Sam"
  ];

  return (
    <main>
      {/* Enhanced Hero Section */}
      <section className="py-24 pt-32 bg-gradient-to-br from-scio-blue via-scio-blue-light to-scio-orange relative overflow-hidden flex items-center">
        <div className="absolute inset-0 bg-black/40"></div>
        {/* Add floating elements */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-white/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="text-white space-y-8">
              <h1 className="font-heading heading-primary text-2xl md:text-3xl lg:text-4xl mb-6">
                Upward Equipping.
                <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent mt-4">
                  One learner at a time.
                </span>
              </h1>
              <p className="font-body text-body text-lg md:text-lg leading-relaxed text-gray-100 max-w-2xl">
                At Scio Labs, we blend expert-led guidance, personalized learning, and modern technology to help 
                individuals succeed in school, work, and life. Join us in shaping a future driven by knowledge, 
                purpose, and excellence.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-0">
              <Link href="/services">
                <Button 
                  size="lg" 
                  className="bg-scio-blue hover:bg-scio-blue-dark text-white rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-blue-500/25 border-0"
                >
                  Discover More
                </Button>
              </Link>
              <Link href="/contact">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-2 border-white/30 text-white hover:bg-white hover:text-slate-900 rounded-2xl transition-all duration-300 bg-white/10 backdrop-blur-sm"
                >
                  Contact Us
                </Button>
              </Link>
              </div>
            </div>
            <div className="relative">
              <div className="w-80 h-80 mx-auto rounded-full overflow-hidden border-8 border-white/30 shadow-2xl group">
                <Image
                  src="https://images.unsplash.com/photo-1524069290683-0457abfe42c3?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Students collaborating"
                  width={320}
                  height={320}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              {/* Add decorative elements around image */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-yellow-300 rounded-full opacity-80 animate-bounce"></div>
              <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-orange-300 rounded-full opacity-70 animate-bounce delay-500"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Mission & Vision Section */}
      <section className="py-24 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-heading heading-primary text-4xl md:text-5xl text-scio-blue mb-6">
              Mission & Vision
            </h2>
            <p className="font-body text-xl text-gray-600 max-w-3xl mx-auto">
              Driven by purpose and guided by vision to create lasting impact in education
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Mission Card */}
            <Card className="group bg-white border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden">
              <CardContent className="p-10">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-scio-blue rounded-xl flex items-center justify-center mr-4">
                    <i className="fas fa-bullseye text-white text-xl"></i>
                  </div>
                  <h3 className="font-heading heading-primary text-3xl text-scio-blue">
                    Our Mission
                  </h3>
                </div>
                <p className="font-body text-lg text-gray-700 leading-relaxed">
                  To deliver expert-led, impactful programs that empower learners to succeed in their educational, 
                  professional, and personal growth journeys.
                </p>
              </CardContent>
            </Card>

            {/* Vision Card */}
            <Card className="group bg-gradient-to-br from-orange-50 to-yellow-100 border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden">
              <CardContent className="p-10">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-scio-orange rounded-xl flex items-center justify-center mr-4">
                    <i className="fas fa-eye text-white text-xl"></i>
                  </div>
                  <h3 className="font-heading heading-primary text-3xl text-scio-orange">
                    Our Vision
                  </h3>
                </div>
                <p className="font-body text-lg text-gray-700 leading-relaxed">
                  To be India&apos;s most trusted partner in education and career development by offering innovative, 
                  accessible, and future-ready learning solutions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Enhanced Core Values Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-64 h-64 bg-scio-blue rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-scio-orange rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <h2 className="font-heading heading-primary text-4xl md:text-5xl text-scio-blue mb-6">
              Our Core Values
            </h2>
            <p className="font-body text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that shape our vision, decisions, and every learning experience we create.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreValues.map((value, index) => (
              <Card key={index} className="group bg-gradient-to-br from-gray-50 to-blue-50 border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <CardContent className="p-8 text-center h-full">
                  <div className={`w-20 h-20 mx-auto mb-6 ${value.bgColor} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <i className={`${value.icon} text-white text-2xl`}></i>
                  </div>
                  <h3 className="font-heading text-xl font-semibold text-scio-blue mb-4">
                    {value.title}
                  </h3>
                  <p className="font-body text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Leadership Section */}
      <section className="py-24 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-heading heading-primary text-4xl md:text-5xl text-scio-blue mb-6">
              Meet Team ScioLabs
            </h2>
            <p className="font-body text-xl text-gray-600 max-w-3xl mx-auto">
              Meet the visionary leaders driving innovation and excellence in educational transformation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {teamMembers.map((member, index) => (
              <Card key={index} className="group bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
                <CardContent className="p-8 text-center">
                  <div className="relative mb-6">
                    <div className="w-32 h-32 mx-auto rounded-full overflow-hidden shadow-lg">
                      <Image
                        src={member.image.startsWith('/') ? member.image : `https://images.unsplash.com/photo-${member.image}?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80`}
                        alt={member.name}
                        width={128}
                        height={128}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-r from-scio-blue to-scio-orange rounded-full flex items-center justify-center">
                      <Check className="text-white w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="font-heading text-xl font-semibold text-scio-blue mb-2">
                    {member.name}
                  </h3>
                  <p className="font-body text-scio-orange mb-3 font-medium">
                    {member.role}
                  </p>
                  <p className="font-body text-gray-600 text-sm mb-4">
                    {member.description}
                  </p>
                  {/* <div className="flex justify-center space-x-3">
                    <Button variant="ghost" size="sm" className="w-10 h-10 rounded-full p-0 hover:bg-scio-blue hover:text-white">
                      <Linkedin className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="w-10 h-10 rounded-full p-0 hover:bg-scio-orange hover:text-white">
                      <Mail className="w-4 h-4" />
                    </Button>
                  </div> */}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Collaborators Section */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-8 text-center">
              <h3 className="font-heading text-2xl font-semibold text-scio-blue mb-4">
                Our Collaborators
              </h3>
              <p className="font-body text-gray-600 mb-6">
                We also collaborate with a talented group of project-based professionals who contribute to content, design, and delivery across our initiatives.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                {collaborators.map((name, index) => (
                  <div key={index} className="px-6 py-3 bg-gradient-to-r from-scio-blue to-scio-orange text-scio-blue rounded-full font-medium text-base shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    {name}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Enhanced Why Choose Us Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-heading heading-primary text-4xl md:text-5xl text-scio-blue mb-6">
              Why Choose Scio Labs?
            </h2>
            <p className="font-body text-xl text-gray-600 max-w-3xl mx-auto">
              Discover what sets us apart as trusted leaders in education, innovation, and learner success.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: "fas fa-cogs", 
                title: "Custom-Crafted Programs", 
                desc: "Thoughtfully designed through deep learner insights and tailored to meet real-world educational needs.",
                bgColor: "bg-scio-blue"
              },
              { 
                icon: "fas fa-align-left", 
                title: "Curriculum-Aligned Content", 
                desc: "Carefully built to align with CBSE, ICSE, and vocational education standards, ensuring seamless integration with academic goals.",
                bgColor: "bg-scio-orange"
              },
              { 
                icon: "fas fa-rocket", 
                title: "Future-Ready Learning", 
                desc: "Focused on developing the essential skills and mindsets students need to succeed in a rapidly evolving world.",
                bgColor: "bg-scio-green"
              },
              { 
                icon: "fas fa-chart-bar", 
                title: "Proven Impact", 
                desc: "Over 72,000 learning hours delivered across schools, colleges, and skill training centers within just one year.",
                bgColor: "bg-scio-purple"
              }
            ].map((feature, index) => (
              <Card key={index} className="group bg-gradient-to-br from-gray-50 to-slate-100 border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                <CardContent className="p-8 text-center h-full flex flex-col">
                  <div className={`w-16 h-16 mx-auto mb-6 ${feature.bgColor} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <i className={`${feature.icon} text-white text-xl`}></i>
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-scio-blue mb-4 flex-shrink-0">
                    {feature.title}
                  </h3>
                  <p className="font-body text-gray-600 text-sm leading-relaxed flex-grow">
                    {feature.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

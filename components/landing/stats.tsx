import { Card, CardContent } from '@/components/ui/card';

export default function StatsSection() {
  const stats = [
    { 
      number: "15000+", 
      label: "Educators Trained", 
      description: "",
      gradient: "from-blue-500/20 via-sky-400/10 to-cyan-300/20",
      size: "md"
    },
    { 
      number: "250+", 
      label: "One-on-One Counseling Sessions", 
      description: "",
      gradient: "from-indigo-500/20 via-purple-400/10 to-blue-300/20",
      size: "sm"
    },
    { 
      number: "70,000+", 
      label: "Learning Hours Delivered", 
      description: "",
      gradient: "from-orange-500/20 via-amber-400/10 to-yellow-300/20",
      size: "lg"
    },
    { 
      number: "20+", 
      label: "Institutional Partnership", 
      description: "",
      subLabel: "",
      gradient: "from-emerald-500/20 via-teal-400/10 to-green-300/20",
      size: "md"
    },
    { 
      number: "4000+", 
      label: "Revision Games Created", 
      description: "",
      gradient: "from-rose-500/20 via-pink-400/10 to-red-300/20",
      size: "sm"
    }
  ];

  const getSizeClasses = (size: string) => {
    switch (size) {
      case 'lg':
        return 'md:col-span-2 md:row-span-2 p-10';
      case 'md':
        return 'md:col-span-1 md:row-span-1 p-8';
      case 'sm':
        return 'md:col-span-1 md:row-span-1 p-6';
      default:
        return 'md:col-span-1 md:row-span-1 p-8';
    }
  };

  const getTextSizes = (size: string) => {
    switch (size) {
      case 'lg':
        return {
          number: 'text-6xl md:text-7xl',
          label: 'text-xl md:text-2xl',
          description: 'text-base'
        };
      case 'md':
        return {
          number: 'text-4xl md:text-5xl',
          label: 'text-lg',
          description: 'text-sm'
        };
      case 'sm':
        return {
          number: 'text-3xl md:text-4xl',
          label: 'text-base',
          description: 'text-xs'
        };
      default:
        return {
          number: 'text-4xl md:text-5xl',
          label: 'text-lg',
          description: 'text-sm'
        };
    }
  };

  return (
    <section className="py-24 bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50/30 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-blue-400/10 to-cyan-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-emerald-400/10 to-teal-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <h2 className="font-heading heading-primary text-4xl md:text-5xl text-white mb-6">
            <span className="text-gray-800">Our Reach. Our Results.</span>
          </h2>
          <p className="font-body text-body text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Driving meaningful change through learning, guidance, and growth—one learner at a time.
          </p>
        </div>

        {/* Masonry Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-max">
          {stats.map((stat, index) => {
            const textSizes = getTextSizes(stat.size);
            const sizeClasses = getSizeClasses(stat.size);
            
            return (
              <Card 
                key={index} 
                className={`group bg-gradient-to-br ${stat.gradient} backdrop-blur-sm border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] hover:-translate-y-1 ${sizeClasses}`}
              >
                <CardContent className="h-full flex flex-col justify-center items-center">
                  <div className="space-y-3 text-center">
                    <div className={`font-heading font-bold bg-gradient-to-br from-gray-800 to-gray-600 bg-clip-text text-transparent ${textSizes.number}`}>
                      {stat.number}
                    </div>
                    <div className="space-y-2">
                      {stat.description && (
                        <div className={`font-body text-gray-600 ${textSizes.description}`}>
                          {stat.description}
                        </div>
                      )}
                      <div className={`font-body font-semibold text-gray-700 leading-relaxed ${textSizes.label}`}>
                        {stat.label}
                      </div>
                      {stat.subLabel && (
                        <div className={`font-body font-semibold text-gray-700 ${textSizes.label}`}>
                          {stat.subLabel}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Decorative element */}
                  <div className="absolute mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-full h-1 bg-gradient-to-r from-transparent via-gray-400/50 to-transparent rounded-full"></div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Floating accent cards */}
        <div className="absolute top-32 -left-6 opacity-30">
          <Card className="w-24 h-24 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-0 rotate-12">
            <CardContent className="p-4 flex items-center justify-center">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full"></div>
            </CardContent>
          </Card>
        </div>
        
        <div className="absolute bottom-32 -right-6 opacity-30">
          <Card className="w-32 h-32 bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-0 -rotate-12">
            <CardContent className="p-6 flex items-center justify-center">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full"></div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function IntroVideoSection() {
  return (
    <section className="py-24 bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-heading heading-primary text-4xl md:text-5xl text-white mb-6">
            Discover ScioLabs
          </h2>
          <p className="font-body text-xl text-gray-300 max-w-3xl mx-auto">
            Take a quick look at our key areas of impact in education and training.
          </p>
        </div>
        
        <Card className="bg-white/10 backdrop-blur-md border border-white/20 overflow-hidden">
          <CardContent className="p-0">
            <div className="relative aspect-video bg-gray-800 flex items-center justify-center">
              <Button 
                size="lg"
                className="bg-scio-orange hover:bg-scio-orange-dark text-white rounded-full w-20 h-20"
              >
                <i className="fas fa-play text-2xl"></i>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

'use client';

import { Card, CardContent } from '@/components/ui/card';

export default function IntroVideoSection() {
  return (
    <section className="py-24 bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 relative overflow-hidden" id='explore'>
      <div className="max-w-4xl mx-auto px-6">
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
            <div className="relative aspect-video">
              <iframe 
                className="w-full h-full"
                src="https://videos.sproutvideo.com/embed/aa9bdab31811e9c620/4f8448e43829ea5f" 
                frameBorder="0" 
                allowFullScreen 
                referrerPolicy="no-referrer-when-downgrade" 
                title="ScioLabs Introduction Video"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
import HeroSection from '@/components/landing/hero';
import IntroVideoSection from '@/components/landing/intro-video';
import ServicesSection from '@/components/landing/services';
import StatsSection from '@/components/landing/stats';
import TestimonialsSection from '@/components/landing/testimonials';

export default function HomePage() {
  return (
    <>
      <main>
        <HeroSection />
        <StatsSection />
        <TestimonialsSection />
        <IntroVideoSection />
        <ServicesSection />
      </main>
    </>
  );
}
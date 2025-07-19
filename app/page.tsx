import HeroSection from '@/components/landing/hero';
import ServicesSection from '@/components/landing/services';
import StatsSection from '@/components/landing/stats';
import TestimonialsSection from '@/components/landing/testimonials';

export default function HomePage() {
  return (
    <>
      <main>
        <HeroSection />
        <ServicesSection />
        <StatsSection />
        <TestimonialsSection />
      </main>
    </>
  );
}
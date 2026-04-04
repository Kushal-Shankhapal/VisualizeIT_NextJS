import Hero from '@/components/home/Hero';
import FeaturedSimulations from '@/components/home/FeaturedSimulations';
import AboutSection from '@/components/home/AboutSection';
import HowItWorks from '@/components/home/HowItWorks';
import CampusPreview from '@/components/home/CampusPreview';
import FunLabPreview from '@/components/home/FunLabPreview';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <FeaturedSimulations />
      <AboutSection />
      <HowItWorks />
      
      {/* Previews Section */}
      <section className="relative z-10 bg-[var(--bg)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <CampusPreview />
            <FunLabPreview />
          </div>
        </div>
      </section>
    </div>
  );
}

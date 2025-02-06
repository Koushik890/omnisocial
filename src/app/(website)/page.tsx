'use client';

import { Navbar } from '@/components/layout/Navbar';
import { Hero } from '@/components/sections/Hero';
import { Features } from '@/components/sections/Features';
import { Statistics } from '@/components/sections/Statistics';
import { Testimonials } from '@/components/sections/Testimonials';
import { Pricing } from '@/components/sections/Pricing';
import { Footer } from '@/components/layout/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="relative overflow-hidden">
        {/* Hero Section */}
        <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="absolute inset-0 bg-gradient-to-br from-[#F4EBFF]/50 via-white to-[#FFF5F5]/30" />
          <div className="relative">
            <Hero />
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="relative py-24 bg-gradient-to-b from-white via-[#F4EBFF]/20 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Powerful Features for Your Instagram Growth
              </h2>
              <p className="text-lg text-gray-600">
                Everything you need to automate engagement and grow your Instagram presence
              </p>
            </div>
            <Features />
          </div>
        </section>

        {/* Statistics Section */}
        <Statistics />

        {/* Testimonials Section */}
        <section id="testimonials" className="relative py-24 bg-gradient-to-b from-white via-[#FFF9E6]/30 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Testimonials />
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="relative py-24 bg-gradient-to-b from-white to-[#F4EBFF]/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Pricing />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
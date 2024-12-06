'use client';

import { Inter } from 'next/font/google';
import { Navbar } from '@/components/layout/Navbar';
import { Hero } from '@/components/sections/Hero';
import { Features } from '@/components/sections/Features';
import { Statistics } from '@/components/sections/Statistics';
import { Testimonials } from '@/components/sections/Testimonials';
import { Pricing } from '@/components/sections/Pricing';
import { Footer } from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  return (
    <div className={`min-h-screen bg-white ${inter.className}`}>
      <Navbar />
      <main className="max-w-7xl mx-auto px-8 py-16 bg-gradient-to-br from-white to-gray-50 space-y-20">
        <Hero />
        <Features />
        <Statistics />
        <Testimonials />
        <Pricing />
      </main>
      <Footer />
    </div>
  );
}
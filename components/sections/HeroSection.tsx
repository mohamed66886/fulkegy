'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Lottie from 'lottie-react';
import heroAnimation from '@/public/hero-animation.json';

interface HeroSectionProps {
  locale: string;
  dict: any;
}

export default function HeroSection({ locale, dict }: HeroSectionProps) {
  const isRTL = locale === 'ar';
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <section
      ref={ref}
      className={cn(
        'relative min-h-[70vh] flex items-center overflow-hidden pt-[69px] py-16'
      )}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* White Background */}
      <div className="absolute inset-0 bg-white" />

      {/* Animated Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            'radial-gradient(circle, #1F4B8F 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-[#1F4B8F]/10"
          style={{
            top: `${15 + i * 15}%`,
            left: `${10 + i * 14}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            ease: 'easeInOut' as const,
            delay: i * 0.4,
          }}
        /> 
      ))}

      <div className="relative z-10 max-w-7xl pt-[49px] md:pt-0 mx-auto px-4 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div>
            <motion.h1
              className="text-4xl md:text-5xl  lg:text-6xl font-bold text-[#1F4B8F] leading-tight mb-6"
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: 'easeOut' as const }}
            >
              {dict.hero.title.split(' ').map((word: string, i: number) => (
                <motion.span
                  key={i}
                  className="inline-block mr-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{
                    duration: 0.5,
                    delay: 0.1 + i * 0.08,
                    ease: 'easeOut' as const,
                  }}
                >
                  {word}{' '}
                </motion.span>
              ))}
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl text-gray-600 mb-8 max-w-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' as const }}
            >
              {dict.hero.subtitle}
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6, ease: 'easeOut' as const }}
            >
              <Link href={`/${locale}/contact`}>
                <Button
                  size="lg"
                  className="bg-[#1F4B8F] text-white hover:bg-[#1F4B8F]/90 font-semibold gap-2"
                >
                  {dict.hero.cta}
                  <ArrowIcon className="w-4 h-4" />
                </Button>
              </Link>
              <Link href={`/${locale}/about`}>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-[#1F4B8F] text-[#1F4B8F] hover:bg-[#1F4B8F]/10 font-semibold"
                >
                  {dict.hero.secondary_cta}
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Lottie Animation */}
          <motion.div
            className="flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' as const }}
          >
            <div className="w-[300px] md:w-[420px] lg:w-[500px]">
              <Lottie
                animationData={heroAnimation}
                loop
                autoplay
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#F5F7FB] to-transparent" />
    </section>
  );
}

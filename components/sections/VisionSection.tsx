'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Brain, Cog, BarChart3, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VisionSectionProps {
  locale: string;
  dict: any;
}

const features = [
  { icon: Brain, key: 'ai_powered' },
  { icon: Cog, key: 'automation' },
  { icon: BarChart3, key: 'analytics' },
  { icon: TrendingUp, key: 'prediction' },
];

export default function VisionSection({ locale, dict }: VisionSectionProps) {
  const isRTL = locale === 'ar';
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' as const },
    },
  };

  return (
    <section
      ref={sectionRef}
      className={cn(
        'relative py-24 overflow-hidden',
        
      )}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Dark gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0D2B5E] via-[#1F4B8F] to-[#162F5A]" />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Glowing accent orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-[#2F6EDB]/10 blur-[100px]" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-[#2F6EDB]/8 blur-[120px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {/* Section Header */}
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {dict.vision.title}
            </h2>
            <p className="text-lg text-[#2F6EDB] font-medium mb-4">
              {dict.vision.subtitle}
            </p>
            <div className="w-20 h-1 bg-[#2F6EDB] mx-auto rounded-full mb-8" />
            <p className="text-white/70 text-lg leading-relaxed max-w-3xl mx-auto">
              {dict.vision.description}
            </p>
          </motion.div>

          {/* Feature Items */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
          >
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.key}
                  className="group relative bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-[#2F6EDB]/40 hover:bg-white/10 transition-all duration-300 text-center"
                  variants={itemVariants}
                  whileHover={{ y: -6 }}
                >
                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 rounded-2xl bg-[#2F6EDB]/0 group-hover:bg-[#2F6EDB]/5 transition-colors duration-300" />

                  <div className="relative z-10">
                    <div className="w-16 h-16 rounded-2xl bg-[#2F6EDB]/20 flex items-center justify-center mx-auto mb-6 group-hover:bg-[#2F6EDB]/30 transition-colors duration-300 ring-1 ring-[#2F6EDB]/20 group-hover:ring-[#2F6EDB]/40">
                      <Icon className="w-8 h-8 text-[#2F6EDB] group-hover:text-white transition-colors duration-300" />
                    </div>

                    <h3 className="text-lg font-bold text-white mb-2">
                      {dict.vision[feature.key]}
                    </h3>

                    {/* Glowing dot accent */}
                    <div className="w-2 h-2 rounded-full bg-[#2F6EDB] mx-auto mt-4 opacity-50 group-hover:opacity-100 group-hover:shadow-[0_0_12px_rgba(47,110,219,0.6)] transition-all duration-300" />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

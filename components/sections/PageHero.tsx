'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';

interface PageHeroProps {
  locale: string;
  title: string;
  subtitle: string;
  badge?: string;
}

export default function PageHero({ locale, title, subtitle, badge }: PageHeroProps) {
  const isRTL = locale === 'ar';
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section
      ref={ref}
      dir={isRTL ? 'rtl' : 'ltr'}
      className="relative overflow-hidden pt-[110px] pb-16 md:pb-20"
    >
      <div className="absolute inset-0 bg-white" />

      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: 'radial-gradient(circle, #1F4B8F 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-2 w-2 rounded-full bg-[#1F4B8F]/10"
          style={{
            top: `${15 + i * 12}%`,
            left: `${8 + i * 14}%`,
          }}
          animate={{
            y: [0, -24, 0],
            opacity: [0.25, 0.7, 0.25],
          }}
          transition={{
            duration: 3 + i * 0.4,
            repeat: Infinity,
            ease: 'easeInOut' as const,
            delay: i * 0.35,
          }}
        />
      ))}

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: 'easeOut' as const }}
          className="mx-auto max-w-4xl"
        >
          {badge ? (
            <span className="mb-5 inline-flex rounded-full border border-[#D8E3F5] bg-[#EEF3FB] px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-[#1F4B8F]">
              {badge}
            </span>
          ) : null}

          <h1 className="text-4xl font-bold leading-tight text-[#1F4B8F] md:text-5xl lg:text-6xl">
            {title}
          </h1>

          <p
            className={cn(
              'mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-gray-600 md:text-xl',
              isRTL ? 'font-[Cairo]' : 'font-[Inter]'
            )}
          >
            {subtitle}
          </p>

          <div className="mx-auto mt-8 h-1 w-24 rounded-full bg-gradient-to-r from-[#1F4B8F] to-[#2F6EDB]" />
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#F5F7FB] to-transparent" />
    </section>
  );
}

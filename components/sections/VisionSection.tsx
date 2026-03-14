'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Brain, Cog, BarChart3, TrendingUp } from 'lucide-react';

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
      className="relative py-24 overflow-hidden bg-[#0f4c97]"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="relative z-10 max-w-6xl mx-auto px-4">
        <motion.div
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          transition={{ staggerChildren: 0.12 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <motion.div
              className={isRTL ? 'text-center lg:text-right' : 'text-center lg:text-left'}
              variants={itemVariants}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {dict.vision.title}
              </h2>
              <p className="text-lg text-white/85 font-medium mb-4">
                {dict.vision.subtitle}
              </p>
              <p className={isRTL ? 'text-white/75 text-lg leading-relaxed mb-8' : 'text-white/75 text-lg leading-relaxed mb-8'}>
                {dict.vision.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {features.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={feature.key}
                      className="flex items-center gap-3 rounded-lg bg-white/10 px-4 py-3"
                    >
                      <Icon className="w-5 h-5 text-white" />
                      <span className="text-white font-medium">{dict.vision[feature.key]}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="mx-auto w-full max-w-xl">
              <svg
                viewBox="0 0 560 400"
                className="h-[220px] sm:h-[280px] md:h-[320px] lg:h-[360px] w-full"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-label="Vision illustration"
              >
                <rect x="40" y="40" width="480" height="320" rx="24" fill="rgba(255,255,255,0.08)" />
                <rect x="70" y="78" width="210" height="20" rx="10" fill="rgba(255,255,255,0.7)" />
                <rect x="70" y="112" width="150" height="14" rx="7" fill="rgba(255,255,255,0.4)" />

                <circle cx="400" cy="145" r="62" fill="rgba(255,255,255,0.12)" />
                <circle cx="400" cy="145" r="36" fill="rgba(255,255,255,0.22)" />
                <circle cx="400" cy="145" r="14" fill="rgba(255,255,255,0.75)" />

                <path d="M92 248C142 218 188 278 236 248C270 226 304 226 336 248" stroke="rgba(255,255,255,0.65)" strokeWidth="8" strokeLinecap="round" />
                <path d="M92 288C142 258 188 318 236 288C270 266 304 266 336 288" stroke="rgba(255,255,255,0.4)" strokeWidth="8" strokeLinecap="round" />

                <rect x="360" y="230" width="120" height="90" rx="16" fill="rgba(255,255,255,0.15)" />
                <path d="M385 294L414 260L438 278L458 252" stroke="rgba(255,255,255,0.75)" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

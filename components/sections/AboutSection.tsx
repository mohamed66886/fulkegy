'use client';

import { useRef, useEffect } from 'react';
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion';
import { CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import Lottie from 'lottie-react';
import heroAnimation from '@/public/hero-animation.json';

interface AboutSectionProps {
  locale: string;
  dict: any;
}

function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const count   = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));
  const ref      = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const ctrl = animate(count, value, { duration: 2, ease: 'easeOut' as const });
      return ctrl.stop;
    }
  }, [isInView, count, value]);

  return (
    <span ref={ref} className="tabular-nums">
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
}

const stats = [
  { value: 8,   suffix: '+', key: 'years_experience' },
  { value: 150, suffix: '+', key: 'completed_projects' },
  { value: 100, suffix: '+', key: 'happy_clients' },
];

const itemVariants = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' as const } },
};

export default function AboutSection({ locale, dict }: AboutSectionProps) {
  const isRTL      = locale === 'ar';
  const sectionRef = useRef(null);
  const isInView   = useInView(sectionRef, { once: true, margin: '-80px' });
  const ArrowIcon  = isRTL ? ArrowLeft : ArrowRight;

  return (
    <section
      ref={sectionRef}
      dir={isRTL ? 'rtl' : 'ltr'}
      className="relative py-24 bg-white dark:bg-[#0f172a] overflow-hidden"
    >
      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* ── Left Visual Column (Lottie) ── */}
          <motion.div
            className="relative order-2 lg:order-1 flex items-center justify-center"
            variants={itemVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
          >
            <div className="relative w-full max-w-md">
              <Lottie
                animationData={heroAnimation}
                loop
                autoplay
                className="w-full h-auto"
              />
            </div>
          </motion.div>

          {/* ── Right Content Column ── */}
          <motion.div
            className="order-1 lg:order-2 pt-6 lg:pt-0"
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
 

            {/* Title */}
            <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white leading-tight">
              {dict.about.title}{' '}
              <span className="text-[#2F6EDB]">{dict.about.subtitle}</span>
            </motion.h2>

            {/* Divider */}
            <motion.div variants={itemVariants} className="w-16 h-[3px] bg-gradient-to-r from-[#1F4B8F] to-[#2F6EDB] rounded-full mb-6" />

            {/* Description */}
            <motion.p variants={itemVariants} className="text-gray-500 dark:text-gray-300 text-base leading-relaxed mb-8">
              {dict.about.description}
            </motion.p>

            {/* Feature list */}
            <motion.ul variants={itemVariants} className="space-y-4 mb-10">
              {[
                { label: dict.about.mission_title, desc: dict.about.mission },
                { label: dict.about.vision_title,  desc: dict.about.vision  },
              ].map(({ label, desc }) => (
                <li key={label} className="flex items-start gap-3">
                  <span className="mt-0.5 w-5 h-5 rounded-full bg-gradient-to-br from-[#1F4B8F] to-[#2F6EDB] flex items-center justify-center shrink-0">
                    <CheckCircle className="w-3 h-3 text-white" />
                  </span>
                  <div>
                    <span className="font-semibold text-gray-800 dark:text-white text-sm">{label}: </span>
                    <span className="text-gray-500 dark:text-gray-400 text-sm">{desc}</span>
                  </div>
                </li>
              ))}
            </motion.ul>

            {/* Stats row */}
            <motion.div variants={itemVariants} className="grid grid-cols-3 gap-4 mb-10">
              {stats.map(({ key, value, suffix }) => (
                <div key={key} className="text-center p-4 rounded-2xl bg-[#F5F7FB] dark:bg-[#1e293b] border border-[#E8EEF9] dark:border-[#334155]">
                  <div className="text-2xl font-bold text-[#1F4B8F] dark:text-[#7AADFF]">
                    <AnimatedCounter value={value} suffix={suffix} />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-xs mt-1 font-medium">{dict.about[key]}</p>
                </div>
              ))}
            </motion.div>

            {/* CTA Button */}
            <motion.div variants={itemVariants}>
              <a
                href={`/${locale}/about`}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#1F4B8F] text-white font-semibold text-sm hover:-translate-y-0.5 transition-all duration-200"
              >
                {isRTL ? 'تعرف علينا أكثر' : 'Learn More About Us'}
                <ArrowIcon className="w-4 h-4" />
              </a>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

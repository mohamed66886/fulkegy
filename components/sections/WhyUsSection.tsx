'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Settings, Users, HeadphonesIcon, Award, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WhyUsSectionProps {
  locale: string;
  dict: any;
}

const advantages = [
  { icon: Settings, titleKey: 'custom_title', descKey: 'custom_desc' },
  { icon: Users, titleKey: 'team_title', descKey: 'team_desc' },
  { icon: HeadphonesIcon, titleKey: 'support_title', descKey: 'support_desc' },
  { icon: Award, titleKey: 'quality_title', descKey: 'quality_desc' },
  { icon: DollarSign, titleKey: 'pricing_title', descKey: 'pricing_desc' },
];

export default function WhyUsSection({ locale, dict }: WhyUsSectionProps) {
  const isRTL = locale === 'ar';
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
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
        'py-24 bg-white',
        
      )}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#1F4B8F] mb-4">
            {dict.whyus.title}
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            {dict.whyus.subtitle}
          </p>
          <div className="w-20 h-1 bg-[#2F6EDB] mx-auto rounded-full mt-4" />
        </motion.div>

        {/* Advantages Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {advantages.map((advantage, index) => {
            const Icon = advantage.icon;
            return (
              <motion.div
                key={advantage.titleKey}
                className={cn(
                  'group relative bg-[#F5F7FB] rounded-2xl p-8 border border-transparent hover:border-[#E8EEF9] hover:bg-white hover:shadow-xl transition-all duration-300',
                  index === 4 && 'sm:col-span-2 lg:col-span-1 lg:col-start-2'
                )}
                variants={cardVariants}
                whileHover={{ y: -6 }}
              >
                {/* Accent line */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 group-hover:w-16 h-1 bg-[#2F6EDB] rounded-full transition-all duration-300" />

                <div className="w-14 h-14 rounded-xl bg-[#E8EEF9] flex items-center justify-center mb-6 group-hover:bg-[#1F4B8F] transition-colors duration-300">
                  <Icon className="w-7 h-7 text-[#1F4B8F] group-hover:text-white transition-colors duration-300" />
                </div>

                <h3 className="text-xl font-bold text-[#1F4B8F] mb-3">
                  {dict.whyus[advantage.titleKey]}
                </h3>

                <p className="text-gray-500 leading-relaxed">
                  {dict.whyus[advantage.descKey]}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

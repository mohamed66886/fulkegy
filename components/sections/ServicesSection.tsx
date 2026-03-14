'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Server,
  Calculator,
  Globe,
  Smartphone,
  Palette,
  MessageSquare,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ServicesSectionProps {
  locale: string;
  dict: any;
}

const services = [
  { icon: Server, titleKey: 'erp_title', descKey: 'erp_desc' },
  { icon: Calculator, titleKey: 'accounting_title', descKey: 'accounting_desc' },
  { icon: Globe, titleKey: 'web_title', descKey: 'web_desc' },
  { icon: Smartphone, titleKey: 'mobile_title', descKey: 'mobile_desc' },
  { icon: Palette, titleKey: 'uiux_title', descKey: 'uiux_desc' },
  { icon: MessageSquare, titleKey: 'consulting_title', descKey: 'consulting_desc' },
];

export default function ServicesSection({ locale, dict }: ServicesSectionProps) {
  const isRTL = locale === 'ar';
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
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
            {dict.services.title}
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            {dict.services.subtitle}
          </p>
          <div className="w-20 h-1 bg-[#2F6EDB] mx-auto rounded-full mt-4" />
        </motion.div>

        {/* Services Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.titleKey}
                className="group bg-[#F5F7FB] rounded-2xl p-8 border border-transparent hover:border-[#E8EEF9] hover:bg-white hover:shadow-xl transition-all duration-300 cursor-pointer"
                variants={cardVariants}
                whileHover={{ y: -8 }}
              >
                <div className="w-14 h-14 rounded-xl bg-[#E8EEF9] flex items-center justify-center mb-6 group-hover:bg-[#1F4B8F] transition-colors duration-300">
                  <Icon className="w-7 h-7 text-[#1F4B8F] group-hover:text-white transition-colors duration-300" />
                </div>

                <h3 className="text-xl font-bold text-[#1F4B8F] mb-3">
                  {dict.services[service.titleKey]}
                </h3>

                <p className="text-gray-500 leading-relaxed mb-6">
                  {dict.services[service.descKey]}
                </p>

                <span className="inline-flex items-center gap-2 text-[#2F6EDB] font-medium text-sm group-hover:gap-3 transition-all duration-300">
                  {dict.services.learn_more}
                  <ArrowIcon className="w-4 h-4" />
                </span>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

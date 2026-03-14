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
  Search,
  ClipboardList,
  Code,
  Rocket,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import PageHero from '@/components/sections/PageHero';

interface ServicesPageProps {
  locale: string;
  dict: any;
}

const services = [
  {
    icon: Server,
    titleKey: 'erp_title',
    descKey: 'erp_desc',
    featuresEn: [
      'Custom module development',
      'Inventory & supply chain management',
      'HR & payroll integration',
      'Real-time reporting dashboards',
    ],
    featuresAr: [
      'تطوير وحدات مخصصة',
      'إدارة المخزون وسلسلة التوريد',
      'تكامل الموارد البشرية والرواتب',
      'لوحات تقارير فورية',
    ],
  },
  {
    icon: Calculator,
    titleKey: 'accounting_title',
    descKey: 'accounting_desc',
    featuresEn: [
      'Automated invoicing & billing',
      'Multi-currency support',
      'Tax compliance & reporting',
      'Financial analytics dashboard',
    ],
    featuresAr: [
      'فوترة وفواتير آلية',
      'دعم العملات المتعددة',
      'الامتثال الضريبي والتقارير',
      'لوحة تحليلات مالية',
    ],
  },
  {
    icon: Globe,
    titleKey: 'web_title',
    descKey: 'web_desc',
    featuresEn: [
      'Progressive web applications',
      'E-commerce platforms',
      'CMS development',
      'API integration & development',
    ],
    featuresAr: [
      'تطبيقات ويب تقدمية',
      'منصات تجارة إلكترونية',
      'تطوير أنظمة إدارة المحتوى',
      'تكامل وتطوير واجهات برمجية',
    ],
  },
  {
    icon: Smartphone,
    titleKey: 'mobile_title',
    descKey: 'mobile_desc',
    featuresEn: [
      'iOS & Android native apps',
      'Cross-platform development',
      'Push notifications & analytics',
      'App Store optimization',
    ],
    featuresAr: [
      'تطبيقات أصلية لـ iOS و Android',
      'تطوير متعدد المنصات',
      'إشعارات فورية وتحليلات',
      'تحسين متجر التطبيقات',
    ],
  },
  {
    icon: Palette,
    titleKey: 'uiux_title',
    descKey: 'uiux_desc',
    featuresEn: [
      'User research & personas',
      'Wireframing & prototyping',
      'Design system creation',
      'Usability testing',
    ],
    featuresAr: [
      'بحث المستخدم وشخصيات المستخدمين',
      'تصميم إطارات ونماذج أولية',
      'إنشاء نظام تصميم متكامل',
      'اختبار قابلية الاستخدام',
    ],
  },
  {
    icon: MessageSquare,
    titleKey: 'consulting_title',
    descKey: 'consulting_desc',
    featuresEn: [
      'Technology stack assessment',
      'Digital transformation roadmap',
      'Architecture planning',
      'Performance optimization',
    ],
    featuresAr: [
      'تقييم البنية التقنية',
      'خارطة طريق التحول الرقمي',
      'تخطيط البنية المعمارية',
      'تحسين الأداء',
    ],
  },
];

const processSteps = [
  {
    icon: Search,
    titleEn: 'Discovery',
    titleAr: 'الاكتشاف',
    descEn: 'We analyze your business needs, goals, and challenges to understand the full picture.',
    descAr: 'نحلل احتياجات عملك وأهدافك وتحدياتك لفهم الصورة الكاملة.',
    step: 1,
  },
  {
    icon: ClipboardList,
    titleEn: 'Planning',
    titleAr: 'التخطيط',
    descEn: 'We create a detailed project plan with timelines, milestones, and deliverables.',
    descAr: 'ننشئ خطة مشروع مفصلة مع جداول زمنية ومراحل ومخرجات.',
    step: 2,
  },
  {
    icon: Code,
    titleEn: 'Development',
    titleAr: 'التطوير',
    descEn: 'Our expert team builds your solution using the latest technologies and best practices.',
    descAr: 'يبني فريقنا المتخصص حلولك باستخدام أحدث التقنيات وأفضل الممارسات.',
    step: 3,
  },
  {
    icon: Rocket,
    titleEn: 'Delivery',
    titleAr: 'التسليم',
    descEn: 'We deploy, test thoroughly, and provide ongoing support to ensure success.',
    descAr: 'ننشر ونختبر بشكل شامل ونقدم دعمًا مستمرًا لضمان النجاح.',
    step: 4,
  },
];

export function ServicesPage({ locale, dict }: ServicesPageProps) {
  const isRTL = locale === 'ar';
  const servicesRef = useRef(null);
  const processRef = useRef(null);

  const servicesInView = useInView(servicesRef, { once: true, margin: '-100px' });
  const processInView = useInView(processRef, { once: true, margin: '-100px' });

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

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
      transition: { duration: 0.6, ease: 'easeOut' as const },
    },
  };

  return (
    <div className={cn()} dir={isRTL ? 'rtl' : 'ltr'}>
      <PageHero
        locale={locale}
        title={dict.services.title}
        subtitle={dict.services.subtitle}
        badge={isRTL ? 'الخدمات' : 'Our Services'}
      />

      {/* Services Detail Section */}
      <section ref={servicesRef} className="py-24 bg-[#F5F7FB]">
        <motion.div
          className="max-w-7xl mx-auto px-4"
          variants={containerVariants}
          initial="hidden"
          animate={servicesInView ? 'visible' : 'hidden'}
        >
          <div className="space-y-20">
            {services.map((service, index) => {
              const Icon = service.icon;
              const isReversed = index % 2 !== 0;
              const features = isRTL ? service.featuresAr : service.featuresEn;

              return (
                <motion.div
                  key={service.titleKey}
                  className={cn(
                    'flex flex-col gap-8 items-center',
                    isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'
                  )}
                  variants={itemVariants}
                >
                  {/* Icon / Visual Side */}
                  <div className="flex-1 w-full">
                    <div className="bg-gradient-to-br from-[#E8EEF9] to-white rounded-2xl p-12 flex items-center justify-center aspect-square max-w-md mx-auto border border-[#E8EEF9]">
                      <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-[#1F4B8F] to-[#2F6EDB] flex items-center justify-center shadow-xl">
                        <Icon className="w-16 h-16 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Content Side */}
                  <div className="flex-1 w-full">
                    <h3 className="text-2xl md:text-3xl font-bold text-[#1F4B8F] mb-4">
                      {dict.services[service.titleKey]}
                    </h3>
                    <p className="text-gray-600 text-lg leading-relaxed mb-6">
                      {dict.services[service.descKey]}
                    </p>
                    <ul className="space-y-3 mb-8">
                      {features.map((feature, fIndex) => (
                        <li key={fIndex} className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-[#2F6EDB] flex-shrink-0" />
                          <span className="text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button size="lg" className="gap-2">
                      {dict.services.learn_more}
                      <ArrowIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* Process Section - How We Work */}
      <section ref={processRef} className="py-24 bg-white">
        <motion.div
          className="max-w-7xl mx-auto px-4"
          variants={containerVariants}
          initial="hidden"
          animate={processInView ? 'visible' : 'hidden'}
        >
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1F4B8F] mb-4">
              {isRTL ? 'كيف نعمل' : 'How We Work'}
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              {isRTL
                ? 'منهجيتنا المتكاملة لضمان نجاح مشروعك'
                : 'Our integrated methodology to ensure your project succeeds'}
            </p>
            <div className="w-20 h-1 bg-[#2F6EDB] mx-auto rounded-full mt-4" />
          </motion.div>

          <div className="relative">
            {/* Connector Line */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-[#E8EEF9] -translate-y-1/2" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {processSteps.map((step) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={step.step}
                    className="relative bg-[#F5F7FB] rounded-2xl p-8 text-center border border-[#E8EEF9] hover:shadow-xl transition-all duration-300"
                    variants={itemVariants}
                    whileHover={{ y: -8 }}
                  >
                    <div className="relative z-10">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#1F4B8F] to-[#2F6EDB] flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="w-8 h-8 rounded-full bg-[#E8EEF9] flex items-center justify-center mx-auto mb-4">
                        <span className="text-sm font-bold text-[#1F4B8F]">{step.step}</span>
                      </div>
                      <h3 className="text-lg font-bold text-[#1F4B8F] mb-2">
                        {isRTL ? step.titleAr : step.titleEn}
                      </h3>
                      <p className="text-gray-500 text-sm leading-relaxed">
                        {isRTL ? step.descAr : step.descEn}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

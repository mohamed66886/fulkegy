'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Zap,
  BookOpen,
  Clock,
  Rocket,
  MapPin,
  Briefcase,
  Mail,
  Users,
  Heart,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import PageHero from '@/components/sections/PageHero';

interface CareersPageProps {
  locale: string;
  dict: any;
}

const benefits = [
  {
    icon: Zap,
    key: 'benefit_1',
    descEn: 'A dynamic and inspiring workplace that fosters creativity and collaboration among team members.',
    descAr: 'بيئة عمل ديناميكية ومحفزة تعزز الإبداع والتعاون بين أعضاء الفريق.',
  },
  {
    icon: BookOpen,
    key: 'benefit_2',
    descEn: 'Access to courses, workshops, and mentorship programs to keep growing your skills.',
    descAr: 'الوصول إلى الدورات وورش العمل وبرامج الإرشاد لتطوير مهاراتك باستمرار.',
  },
  {
    icon: Clock,
    key: 'benefit_3',
    descEn: 'Flexible working hours and remote work options to maintain a healthy work-life balance.',
    descAr: 'ساعات عمل مرنة وخيارات العمل عن بعد للحفاظ على توازن صحي بين العمل والحياة.',
  },
  {
    icon: Rocket,
    key: 'benefit_4',
    descEn: 'Work on cutting-edge projects across different industries and technologies.',
    descAr: 'العمل على مشاريع متطورة عبر مختلف الصناعات والتقنيات.',
  },
];

const openPositions = [
  {
    titleEn: 'Senior Frontend Developer',
    titleAr: 'مطور واجهات أمامية أول',
    typeEn: 'Full-time',
    typeAr: 'دوام كامل',
    locationEn: 'Riyadh',
    locationAr: 'الرياض',
    requirementsEn: [
      '5+ years of experience with React/Next.js',
      'Strong TypeScript and modern CSS skills',
      'Experience with state management and API integration',
      'Understanding of responsive design and accessibility',
    ],
    requirementsAr: [
      '5+ سنوات خبرة في React/Next.js',
      'مهارات قوية في TypeScript و CSS الحديث',
      'خبرة في إدارة الحالة وتكامل واجهات البرمجة',
      'فهم التصميم المتجاوب وإمكانية الوصول',
    ],
  },
  {
    titleEn: 'Backend Developer',
    titleAr: 'مطور خلفيات',
    typeEn: 'Full-time',
    typeAr: 'دوام كامل',
    locationEn: 'Riyadh',
    locationAr: 'الرياض',
    requirementsEn: [
      '3+ years of experience with Node.js or Python',
      'Experience with databases (PostgreSQL, MongoDB)',
      'Understanding of RESTful APIs and microservices',
      'Knowledge of cloud services (AWS, GCP, or Azure)',
    ],
    requirementsAr: [
      '3+ سنوات خبرة في Node.js أو Python',
      'خبرة في قواعد البيانات (PostgreSQL, MongoDB)',
      'فهم واجهات RESTful والخدمات المصغرة',
      'معرفة بالخدمات السحابية (AWS, GCP, أو Azure)',
    ],
  },
  {
    titleEn: 'UI/UX Designer',
    titleAr: 'مصمم UI/UX',
    typeEn: 'Full-time',
    typeAr: 'دوام كامل',
    locationEn: 'Riyadh',
    locationAr: 'الرياض',
    requirementsEn: [
      '3+ years of UI/UX design experience',
      'Proficiency in Figma and design systems',
      'Strong portfolio showcasing web and mobile designs',
      'Understanding of user research and usability testing',
    ],
    requirementsAr: [
      '3+ سنوات خبرة في تصميم UI/UX',
      'إتقان Figma وأنظمة التصميم',
      'معرض أعمال قوي يعرض تصاميم الويب والموبايل',
      'فهم بحث المستخدم واختبار قابلية الاستخدام',
    ],
  },
];

export function CareersPage({ locale, dict }: CareersPageProps) {
  const isRTL = locale === 'ar';
  const descRef = useRef(null);
  const benefitsRef = useRef(null);
  const positionsRef = useRef(null);
  const cultureRef = useRef(null);

  const descInView = useInView(descRef, { once: true, margin: '-100px' });
  const benefitsInView = useInView(benefitsRef, { once: true, margin: '-100px' });
  const positionsInView = useInView(positionsRef, { once: true, margin: '-100px' });
  const cultureInView = useInView(cultureRef, { once: true, margin: '-100px' });

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
        title={dict.careers.title}
        subtitle={dict.careers.subtitle}
        badge={isRTL ? 'الوظائف' : 'Careers'}
      />

      {/* Description Section */}
      <section ref={descRef} className="py-24 bg-[#F5F7FB]">
        <motion.div
          className="max-w-4xl mx-auto px-4 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={descInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
            {dict.careers.description}
          </p>
        </motion.div>
      </section>

      {/* Benefits Section */}
      <section ref={benefitsRef} className="py-24 bg-white">
        <motion.div
          className="max-w-7xl mx-auto px-4"
          variants={containerVariants}
          initial="hidden"
          animate={benefitsInView ? 'visible' : 'hidden'}
        >
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1F4B8F] mb-4">
              {dict.careers.benefits_title}
            </h2>
            <div className="w-20 h-1 bg-[#2F6EDB] mx-auto rounded-full mt-4" />
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={benefit.key}
                  className="bg-[#F5F7FB] rounded-2xl p-8 text-center border border-[#E8EEF9] hover:shadow-xl transition-all duration-300"
                  variants={itemVariants}
                  whileHover={{ y: -8 }}
                >
                  <div className="w-16 h-16 rounded-2xl bg-[#E8EEF9] flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-8 h-8 text-[#1F4B8F]" />
                  </div>
                  <h3 className="text-lg font-bold text-[#1F4B8F] mb-3">
                    {dict.careers[benefit.key]}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {isRTL ? benefit.descAr : benefit.descEn}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* Open Positions Section */}
      <section ref={positionsRef} className="py-24 bg-[#F5F7FB]">
        <motion.div
          className="max-w-7xl mx-auto px-4"
          variants={containerVariants}
          initial="hidden"
          animate={positionsInView ? 'visible' : 'hidden'}
        >
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1F4B8F] mb-4">
              {isRTL ? 'الوظائف المتاحة' : 'Open Positions'}
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              {isRTL
                ? 'اكتشف الفرص المتاحة وانضم لفريقنا المتنامي'
                : 'Discover available opportunities and join our growing team'}
            </p>
            <div className="w-20 h-1 bg-[#2F6EDB] mx-auto rounded-full mt-4" />
          </motion.div>

          <div className="space-y-6">
            {openPositions.map((position, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-sm border border-[#E8EEF9] hover:shadow-lg transition-all duration-300"
                variants={itemVariants}
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-[#1F4B8F] mb-3">
                      {isRTL ? position.titleAr : position.titleEn}
                    </h3>
                    <div className="flex flex-wrap gap-3 mb-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#E8EEF9] text-[#1F4B8F]">
                        <Briefcase className="w-3.5 h-3.5" />
                        {isRTL ? position.typeAr : position.typeEn}
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#E8EEF9] text-[#1F4B8F]">
                        <MapPin className="w-3.5 h-3.5" />
                        {isRTL ? position.locationAr : position.locationEn}
                      </span>
                    </div>
                    <ul className="space-y-2">
                      {(isRTL ? position.requirementsAr : position.requirementsEn).map(
                        (req, rIndex) => (
                          <li
                            key={rIndex}
                            className="flex items-start gap-2 text-gray-600 text-sm"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-[#2F6EDB] mt-2 flex-shrink-0" />
                            {req}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                  <div className="flex-shrink-0">
                    <a href="mailto:careers@fulk.sa">
                      <Button size="lg" className="gap-2">
                        <Mail className="w-4 h-4" />
                        {dict.careers.apply}
                      </Button>
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Culture Section */}
      <section ref={cultureRef} className="py-24 bg-white">
        <motion.div
          className="max-w-7xl mx-auto px-4"
          variants={containerVariants}
          initial="hidden"
          animate={cultureInView ? 'visible' : 'hidden'}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Placeholder Image */}
            <motion.div variants={itemVariants}>
              <div className="bg-gradient-to-br from-[#E8EEF9] to-[#F5F7FB] rounded-2xl aspect-[4/3] flex items-center justify-center border border-[#E8EEF9]">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-[#1F4B8F]/10 flex items-center justify-center mx-auto mb-4">
                    <Users className="w-10 h-10 text-[#1F4B8F]" />
                  </div>
                  <p className="text-gray-400 text-sm">
                    {isRTL ? 'ثقافة الفريق' : 'Team Culture'}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Content */}
            <motion.div variants={itemVariants}>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1F4B8F] mb-6">
                {isRTL ? 'ثقافتنا' : 'Our Culture'}
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                {isRTL
                  ? 'في فُلك، نؤمن أن الأشخاص هم أهم أصولنا. نعمل على بناء بيئة عمل تحتضن التنوع والإبداع والنمو المستمر. فريقنا يتشارك الشغف بالتكنولوجيا والالتزام بالتميز في كل ما نقوم به.'
                  : 'At Fulk, we believe people are our most valuable asset. We work to build a work environment that embraces diversity, creativity, and continuous growth. Our team shares a passion for technology and a commitment to excellence in everything we do.'}
              </p>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                {isRTL
                  ? 'نحتفل بالنجاحات معًا، ونتعلم من التحديات، ونسعى دائمًا لتقديم الأفضل لعملائنا ولبعضنا البعض.'
                  : 'We celebrate successes together, learn from challenges, and always strive to deliver the best for our clients and each other.'}
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-[#1F4B8F]">
                  <Heart className="w-5 h-5 text-[#2F6EDB]" />
                  <span className="font-medium">
                    {isRTL ? 'شغف بالتكنولوجيا' : 'Passion for Technology'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[#1F4B8F]">
                  <Users className="w-5 h-5 text-[#2F6EDB]" />
                  <span className="font-medium">
                    {isRTL ? 'عمل جماعي' : 'Team Collaboration'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[#1F4B8F]">
                  <Rocket className="w-5 h-5 text-[#2F6EDB]" />
                  <span className="font-medium">
                    {isRTL ? 'نمو مستمر' : 'Continuous Growth'}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

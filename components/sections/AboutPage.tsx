'use client';

import { useRef, useEffect } from 'react';
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion';
import { Target, Eye, Users, Award, Briefcase, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import PageHero from '@/components/sections/PageHero';

interface AboutPageProps {
  locale: string;
  dict: any;
}

function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, value, {
        duration: 2,
        ease: 'easeOut' as const,
      });
      return controls.stop;
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
  { value: 8, suffix: '+', key: 'years_experience', icon: Award },
  { value: 150, suffix: '+', key: 'completed_projects', icon: Briefcase },
  { value: 100, suffix: '+', key: 'happy_clients', icon: Users },
  { value: 25, suffix: '+', key: 'team_members', icon: TrendingUp },
];

const teamMembers = [
  {
    nameEn: 'Ahmed Al-Rashid',
    nameAr: 'أحمد الراشد',
    roleEn: 'CEO & Founder',
    roleAr: 'الرئيس التنفيذي والمؤسس',
    initials: 'AR',
    color: 'bg-[#1F4B8F]',
  },
  {
    nameEn: 'Sara Al-Mutairi',
    nameAr: 'سارة المطيري',
    roleEn: 'CTO',
    roleAr: 'المدير التقني',
    initials: 'SM',
    color: 'bg-[#2F6EDB]',
  },
  {
    nameEn: 'Khalid Hassan',
    nameAr: 'خالد حسن',
    roleEn: 'Lead Developer',
    roleAr: 'مطور رئيسي',
    initials: 'KH',
    color: 'bg-[#1F4B8F]',
  },
  {
    nameEn: 'Nora Al-Fahad',
    nameAr: 'نورة الفهد',
    roleEn: 'Design Director',
    roleAr: 'مدير التصميم',
    initials: 'NF',
    color: 'bg-[#2F6EDB]',
  },
];

const milestones = [
  {
    year: '2020',
    titleEn: 'Founded',
    titleAr: 'التأسيس',
    descEn: 'Fulk was established with a vision to empower businesses through technology.',
    descAr: 'تأسست فُلك برؤية لتمكين الشركات من خلال التكنولوجيا.',
  },
  {
    year: '2021',
    titleEn: 'First Major Project',
    titleAr: 'أول مشروع كبير',
    descEn: 'Delivered our first enterprise-level ERP system for a leading Saudi company.',
    descAr: 'قدمنا أول نظام ERP على مستوى المؤسسات لشركة سعودية رائدة.',
  },
  {
    year: '2022',
    titleEn: 'Team Growth',
    titleAr: 'نمو الفريق',
    descEn: 'Expanded our team to 25+ talented developers, designers, and consultants.',
    descAr: 'وسعنا فريقنا إلى أكثر من 25 مطورًا ومصممًا ومستشارًا موهوبًا.',
  },
  {
    year: '2023',
    titleEn: 'Regional Expansion',
    titleAr: 'التوسع الإقليمي',
    descEn: 'Extended our services across the GCC region with new partnerships.',
    descAr: 'وسعنا خدماتنا عبر منطقة الخليج مع شراكات جديدة.',
  },
  {
    year: '2024',
    titleEn: 'AI Integration',
    titleAr: 'دمج الذكاء الاصطناعي',
    descEn: 'Pioneered AI-powered solutions integrated into our products and services.',
    descAr: 'ريادة الحلول المدعومة بالذكاء الاصطناعي ودمجها في منتجاتنا وخدماتنا.',
  },
];

export function AboutPage({ locale, dict }: AboutPageProps) {
  const isRTL = locale === 'ar';
  const descRef = useRef(null);
  const statsRef = useRef(null);
  const missionRef = useRef(null);
  const teamRef = useRef(null);
  const timelineRef = useRef(null);

  const descInView = useInView(descRef, { once: true, margin: '-100px' });
  const statsInView = useInView(statsRef, { once: true, margin: '-100px' });
  const missionInView = useInView(missionRef, { once: true, margin: '-100px' });
  const teamInView = useInView(teamRef, { once: true, margin: '-100px' });
  const timelineInView = useInView(timelineRef, { once: true, margin: '-100px' });

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
        title={dict.about.title}
        subtitle={dict.about.subtitle}
        badge={isRTL ? 'من نحن' : 'About Fulk'}
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
            {dict.about.description}
          </p>
        </motion.div>
      </section>

      {/* Mission & Vision Cards */}
      <section ref={missionRef} className="py-24 bg-white">
        <motion.div
          className="max-w-7xl mx-auto px-4"
          variants={containerVariants}
          initial="hidden"
          animate={missionInView ? 'visible' : 'hidden'}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mission Card */}
            <motion.div
              className="bg-[#F5F7FB] rounded-2xl p-10 border border-[#E8EEF9] hover:shadow-xl transition-all duration-300"
              variants={itemVariants}
              whileHover={{ y: -6 }}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-[#E8EEF9] flex items-center justify-center">
                  <Target className="w-8 h-8 text-[#1F4B8F]" />
                </div>
                <h2 className="text-2xl font-bold text-[#1F4B8F]">
                  {dict.about.mission_title}
                </h2>
              </div>
              <p className="text-gray-600 leading-relaxed text-lg">
                {dict.about.mission}
              </p>
            </motion.div>

            {/* Vision Card */}
            <motion.div
              className="bg-[#F5F7FB] rounded-2xl p-10 border border-[#E8EEF9] hover:shadow-xl transition-all duration-300"
              variants={itemVariants}
              whileHover={{ y: -6 }}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-[#E8EEF9] flex items-center justify-center">
                  <Eye className="w-8 h-8 text-[#2F6EDB]" />
                </div>
                <h2 className="text-2xl font-bold text-[#1F4B8F]">
                  {dict.about.vision_title}
                </h2>
              </div>
              <p className="text-gray-600 leading-relaxed text-lg">
                {dict.about.vision}
              </p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-24 bg-gradient-to-br from-[#1F4B8F] to-[#2F6EDB]">
        <motion.div
          className="max-w-7xl mx-auto px-4"
          variants={containerVariants}
          initial="hidden"
          animate={statsInView ? 'visible' : 'hidden'}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.key}
                  className="text-center"
                  variants={itemVariants}
                >
                  <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </div>
                  <p className="text-white/70 text-sm md:text-base">
                    {dict.about[stat.key]}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* Team Section */}
      <section ref={teamRef} className="py-24 bg-[#F5F7FB]">
        <motion.div
          className="max-w-7xl mx-auto px-4"
          variants={containerVariants}
          initial="hidden"
          animate={teamInView ? 'visible' : 'hidden'}
        >
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1F4B8F] mb-4">
              {isRTL ? 'فريقنا' : 'Our Team'}
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              {isRTL
                ? 'فريق من المحترفين الشغوفين بالتكنولوجيا والابتكار'
                : 'A team of professionals passionate about technology and innovation'}
            </p>
            <div className="w-20 h-1 bg-[#2F6EDB] mx-auto rounded-full mt-4" />
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-2xl p-8 text-center shadow-sm border border-[#E8EEF9] hover:shadow-xl transition-all duration-300"
                variants={itemVariants}
                whileHover={{ y: -8 }}
              >
                <div
                  className={cn(
                    'w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center',
                    member.color
                  )}
                >
                  <span className="text-2xl font-bold text-white">
                    {member.initials}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#1F4B8F] mb-1">
                  {isRTL ? member.nameAr : member.nameEn}
                </h3>
                <p className="text-[#2F6EDB] text-sm font-medium">
                  {isRTL ? member.roleAr : member.roleEn}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Timeline Section */}
      <section ref={timelineRef} className="py-24 bg-white">
        <motion.div
          className="max-w-7xl mx-auto px-4"
          variants={containerVariants}
          initial="hidden"
          animate={timelineInView ? 'visible' : 'hidden'}
        >
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1F4B8F] mb-4">
              {isRTL ? 'مسيرتنا' : 'Our Journey'}
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              {isRTL
                ? 'محطات رئيسية في رحلة فُلك'
                : 'Key milestones in the Fulk journey'}
            </p>
            <div className="w-20 h-1 bg-[#2F6EDB] mx-auto rounded-full mt-4" />
          </motion.div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-0.5 bg-[#E8EEF9] -translate-x-1/2" />

            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={milestone.year}
                  className={cn(
                    'relative flex flex-col md:flex-row items-center gap-8',
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  )}
                  variants={itemVariants}
                >
                  {/* Content */}
                  <div
                    className={cn(
                      'flex-1',
                      index % 2 === 0 ? 'md:text-end' : 'md:text-start'
                    )}
                  >
                    <div
                      className={cn(
                        'bg-[#F5F7FB] rounded-2xl p-6 border border-[#E8EEF9] hover:shadow-lg transition-shadow inline-block max-w-md',
                        index % 2 === 0 ? 'md:ml-auto' : 'md:mr-auto'
                      )}
                    >
                      <h3 className="text-lg font-bold text-[#1F4B8F] mb-2">
                        {isRTL ? milestone.titleAr : milestone.titleEn}
                      </h3>
                      <p className="text-gray-500 text-sm leading-relaxed">
                        {isRTL ? milestone.descAr : milestone.descEn}
                      </p>
                    </div>
                  </div>

                  {/* Year Circle */}
                  <div className="relative z-10 flex-shrink-0">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#1F4B8F] to-[#2F6EDB] flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-sm">
                        {milestone.year}
                      </span>
                    </div>
                  </div>

                  {/* Spacer */}
                  <div className="flex-1 hidden md:block" />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

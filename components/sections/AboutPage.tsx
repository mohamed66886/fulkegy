'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView, useMotionValue, useTransform, animate, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Target, Eye, Users, Award, Briefcase, TrendingUp, 
  ChevronLeft, ChevronRight, Star,
  Calendar, Code, Shield, UserCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import PageHero from '@/components/sections/PageHero';

interface AboutPageProps {
  locale: string;
  dict: any;
}

// Counter Component
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

// Mobile Timeline Component
function MobileTimeline({ milestones, isRTL }: { milestones: any[]; isRTL: boolean }) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="md:hidden">
      {/* Mobile Slider */}
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isRTL ? -50 : 50 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-br from-[#F5F7FB] to-white rounded-3xl p-8 border border-[#E8EEF9] shadow-xl"
          >
            {/* Year Badge */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1F4B8F] to-[#2F6EDB] flex items-center justify-center shadow-lg">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <span className="text-3xl font-bold text-[#1F4B8F]">
                {milestones[activeIndex].year}
              </span>
            </div>

            {/* Content */}
            <h3 className="text-xl font-bold text-[#1F4B8F] mb-3">
              {isRTL ? milestones[activeIndex].titleAr : milestones[activeIndex].titleEn}
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {isRTL ? milestones[activeIndex].descAr : milestones[activeIndex].descEn}
            </p>

            {/* Progress Indicator */}
            <div className="mt-8 flex items-center justify-between">
              <div className="flex gap-2">
                {milestones.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveIndex(idx)}
                    className={cn(
                      'h-2 rounded-full transition-all duration-300',
                      idx === activeIndex 
                        ? 'w-8 bg-[#1F4B8F]' 
                        : 'w-2 bg-[#E8EEF9]'
                    )}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveIndex(prev => Math.max(0, prev - 1))}
                  disabled={activeIndex === 0}
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center transition-all',
                    activeIndex === 0
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-[#1F4B8F] text-white hover:bg-[#2F6EDB]'
                  )}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setActiveIndex(prev => Math.min(milestones.length - 1, prev + 1))}
                  disabled={activeIndex === milestones.length - 1}
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center transition-all',
                    activeIndex === milestones.length - 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-[#1F4B8F] text-white hover:bg-[#2F6EDB]'
                  )}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// Desktop Timeline Component
function DesktopTimeline({ milestones, isRTL }: { milestones: any[]; isRTL: boolean }) {
  return (
    <div className="hidden md:block relative">
      {/* Timeline Line */}
      <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-gradient-to-b from-[#1F4B8F] via-[#2F6EDB] to-[#1F4B8F] -translate-x-1/2" />

      <div className="space-y-12">
        {milestones.map((milestone, index) => (
          <motion.div
            key={milestone.year}
            className={cn(
              'relative flex items-center gap-8',
              index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
            )}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            {/* Content */}
            <div className="flex-1">
              <div
                className={cn(
                  'bg-white rounded-2xl p-8 border border-[#E8EEF9] hover:shadow-2xl transition-all duration-500 group',
                  index % 2 === 0 ? 'text-end ml-auto' : 'text-start mr-auto',
                  'max-w-lg hover:scale-105 hover:border-[#2F6EDB]'
                )}
              >
                <h3 className="text-xl font-bold text-[#1F4B8F] mb-3 group-hover:text-[#2F6EDB] transition-colors">
                  {isRTL ? milestone.titleAr : milestone.titleEn}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {isRTL ? milestone.descAr : milestone.descEn}
                </p>
              </div>
            </div>

            {/* Year Circle */}
            <div className="relative z-10 flex-shrink-0">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#1F4B8F] to-[#2F6EDB] flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                <span className="text-white font-bold text-lg">
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
  );
}

// Mobile Team Slider
function MobileTeamSlider({ teamMembers, isRTL, locale }: { teamMembers: any[]; isRTL: boolean; locale: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeMember = teamMembers[activeIndex];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % teamMembers.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [teamMembers.length]);

  const goPrev = () => {
    setActiveIndex((prev) => (prev === 0 ? teamMembers.length - 1 : prev - 1));
  };

  const goNext = () => {
    setActiveIndex((prev) => (prev + 1) % teamMembers.length);
  };

  return (
    <div className="md:hidden">
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="bg-[#ECECEC] rounded-[1.4rem] p-3.5 text-center"
          >
            <div className="relative w-full aspect-square rounded-[1.2rem] overflow-hidden mb-2.5 bg-[#D9D9D9]">
              {activeMember.image ? (
                <Image
                  src={activeMember.image}
                  alt={isRTL ? activeMember.nameAr : activeMember.nameEn}
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-5xl font-bold text-[#4B5563]">{activeMember.initials}</span>
                </div>
              )}
            </div>
            <h3 className="text-lg sm:text-xl leading-tight font-extrabold uppercase text-black mb-1.5 tracking-normal">
              {isRTL ? activeMember.nameAr : activeMember.nameEn}
            </h3>
            <p className="text-[#9CA3AF] text-sm sm:text-base font-medium mb-2.5 sm:mb-3">
              {isRTL ? activeMember.roleAr : activeMember.roleEn}
            </p>

            <Link
              href={`/${locale}/team/${activeMember.slug}`}
              className="inline-flex items-center gap-1.5 text-[#1456A1] text-base sm:text-lg font-medium"
            >
              <UserCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
              <span>{isRTL ? 'عرض السيرة الذاتية' : 'View Bio'}</span>
            </Link>
            
            <div className="mt-3.5 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={goPrev}
                className="w-8 h-8 rounded-full bg-white/80 text-[#1F4B8F] flex items-center justify-center"
                aria-label={isRTL ? 'السابق' : 'Previous'}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex justify-center gap-2">
                {teamMembers.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveIndex(idx)}
                    className={cn(
                      'h-2 rounded-full transition-all duration-300',
                      idx === activeIndex
                        ? 'w-7 bg-[#1F4B8F]'
                        : 'w-2 bg-[#CBD5E1]'
                    )}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={goNext}
                className="w-8 h-8 rounded-full bg-white/80 text-[#1F4B8F] flex items-center justify-center"
                aria-label={isRTL ? 'التالي' : 'Next'}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// Values Section
function ValuesSection({ isRTL }: { isRTL: boolean }) {
  const values = [
    {
      icon: Star,
      title: { en: 'Excellence', ar: 'التميز' },
      desc: { en: 'Striving for the highest quality in every project', ar: 'نسعى لأعلى جودة في كل مشروع' },
      cardClass: 'bg-[#EFF6FF]',
      iconClass: 'bg-gradient-to-br from-[#1D4ED8] to-[#3B82F6]',
      titleClass: 'text-[#1E40AF]',
    },
    {
      icon: Shield,
      title: { en: 'Integrity', ar: 'النزاهة' },
      desc: { en: 'Building trust through transparency and honesty', ar: 'بناء الثقة من خلال الشفافية والأمانة' },
      cardClass: 'bg-[#ECFDF5]',
      iconClass: 'bg-gradient-to-br from-[#047857] to-[#10B981]',
      titleClass: 'text-[#065F46]',
    },
    {
      icon: Code,
      title: { en: 'Innovation', ar: 'الابتكار' },
      desc: { en: 'Embracing cutting-edge technologies', ar: 'تبني أحدث التقنيات' },
      cardClass: 'bg-[#FFF7ED]',
      iconClass: 'bg-gradient-to-br from-[#C2410C] to-[#F97316]',
      titleClass: 'text-[#9A3412]',
    },
    {
      icon: Users,
      title: { en: 'Collaboration', ar: 'التعاون' },
      desc: { en: 'Working together to achieve success', ar: 'العمل معاً لتحقيق النجاح' },
      cardClass: 'bg-[#F5F3FF]',
      iconClass: 'bg-gradient-to-br from-[#6D28D9] to-[#8B5CF6]',
      titleClass: 'text-[#5B21B6]',
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-[#F5F7FB] to-white">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#1F4B8F] mb-4">
            {isRTL ? 'قيمنا' : 'Our Values'}
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            {isRTL ? 'المبادئ التي توجه مسيرتنا' : 'The principles that guide our journey'}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className={cn(
                  'rounded-2xl p-4 sm:p-6 md:p-8 text-center transition-all duration-300',
                  value.cardClass
                )}
              >
                <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2 md:mb-3">
                  <Icon className={cn('w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6', value.titleClass)} />
                  <h3 className={cn('text-sm sm:text-base md:text-lg font-bold', value.titleClass)}>
                    {isRTL ? value.title.ar : value.title.en}
                  </h3>
                </div>
                <p className="text-gray-500 text-xs sm:text-sm">
                  {isRTL ? value.desc.ar : value.desc.en}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function AboutPage({ locale, dict }: AboutPageProps) {
  const isRTL = locale === 'ar';
  const statsRef = useRef(null);
  const missionRef = useRef(null);

  const stats = [
    {
      value: 8,
      suffix: '+',
      key: 'years_experience',
      icon: Award,
      label: { en: 'Years of Experience', ar: 'سنوات الخبرة' },
      cardClass: 'bg-[#2563EB]/25 hover:bg-[#2563EB]/35',
      iconClass: 'bg-[#DBEAFE]/25',
    },
    {
      value: 150,
      suffix: '+',
      key: 'completed_projects',
      icon: Briefcase,
      label: { en: 'Completed Projects', ar: 'المشاريع المنجزة' },
      cardClass: 'bg-[#0891B2]/25 hover:bg-[#0891B2]/35',
      iconClass: 'bg-[#CFFAFE]/25',
    },
    {
      value: 100,
      suffix: '+',
      key: 'happy_clients',
      icon: Users,
      label: { en: 'Happy Clients', ar: 'العملاء السعداء' },
      cardClass: 'bg-[#16A34A]/25 hover:bg-[#16A34A]/35',
      iconClass: 'bg-[#DCFCE7]/25',
    },
    {
      value: 25,
      suffix: '+',
      key: 'team_members',
      icon: TrendingUp,
      label: { en: 'Team Members', ar: 'أعضاء الفريق' },
      cardClass: 'bg-[#D97706]/25 hover:bg-[#D97706]/35',
      iconClass: 'bg-[#FEF3C7]/25',
    },
  ];

  const teamMembers = [
    {
      slug: 'ahmed-naeim',
      nameEn: 'Ahmed Al-Rashid',
      nameAr: 'أحمد الراشد',
      roleEn: 'Vice Chairman',
      roleAr: 'نائب رئيس مجلس الإدارة',
      initials: 'AR',
      image: '/images/team/ahmed-naeim.svg',
    },
    {
      slug: 'sara-almutairi',
      nameEn: 'Sara Al-Mutairi',
      nameAr: 'سارة المطيري',
      roleEn: 'CTO',
      roleAr: 'المدير التقني',
      initials: 'SM',
      image: '/images/team/sara-almutairi.svg',
    },
    {
      slug: 'khalid-hassan',
      nameEn: 'Khalid Hassan',
      nameAr: 'خالد حسن',
      roleEn: 'Lead Developer',
      roleAr: 'مطور رئيسي',
      initials: 'KH',
      image: '/images/team/khalid-hassan.svg',
    },
    {
      slug: 'nora-alfahad',
      nameEn: 'Nora Al-Fahad',
      nameAr: 'نورة الفهد',
      roleEn: 'Design Director',
      roleAr: 'مدير التصميم',
      initials: 'NF',
      image: '/images/team/nora-alfahad.svg',
    },
  ];

  const milestones = [
    {
      year: '2020',
      titleEn: 'The Beginning',
      titleAr: 'البداية',
      descEn: 'Fulk was founded with a vision to transform businesses through technology.',
      descAr: 'تأسست فُلك برؤية لتحويل الشركات من خلال التكنولوجيا.',
    },
    {
      year: '2021',
      titleEn: 'First Milestone',
      titleAr: 'الإنجاز الأول',
      descEn: 'Successfully delivered our first enterprise ERP system.',
      descAr: 'نجحنا في تقديم أول نظام ERP على مستوى المؤسسات.',
    },
    {
      year: '2022',
      titleEn: 'Team Expansion',
      titleAr: 'توسع الفريق',
      descEn: 'Grew to 25+ talented professionals across multiple disciplines.',
      descAr: 'نما الفريق إلى أكثر من 25 محترف موهوب في مجالات متعددة.',
    },
    {
      year: '2023',
      titleEn: 'Regional Growth',
      titleAr: 'النمو الإقليمي',
      descEn: 'Expanded operations across the GCC region.',
      descAr: 'توسعت العمليات عبر منطقة الخليج.',
    },
    {
      year: '2024',
      titleEn: 'Innovation Hub',
      titleAr: 'مركز الابتكار',
      descEn: 'Launched AI-powered solutions and innovation lab.',
      descAr: 'أطلقنا حلول الذكاء الاصطناعي ومختبر الابتكار.',
    },
  ];

  return (
    <div className={cn('overflow-hidden', isRTL ? 'font-arabic' : 'font-sans')} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Hero Section */}
      <PageHero
        locale={locale}
        title={dict.about.title}
        subtitle={dict.about.subtitle}
        badge={isRTL ? 'من نحن' : 'About Fulk'}
      />

      {/* Stats Section - Different layout for mobile */}
      <section ref={statsRef} className="py-16 md:py-24 bg-gradient-to-br from-[#1F4B8F] to-[#2F6EDB] relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          {/* Mobile Layout - 2 cards per row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.key}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={cn(
                    'backdrop-blur-lg rounded-2xl p-4 sm:p-6 text-center transition-all duration-300',
                    stat.cardClass
                  )}
                >
                  <div className={cn('w-12 h-12 md:w-16 md:h-16 rounded-xl flex items-center justify-center mx-auto mb-4', stat.iconClass)}>
                    <Icon className="w-6 h-6 md:w-8 md:h-8 text-white" />
                  </div>
                  <div className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-2">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </div>
                  <p className="text-white/80 text-xs sm:text-sm md:text-base">
                    {isRTL ? stat.label.ar : stat.label.en}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission & Vision - Responsive Cards */}
      <section ref={missionRef} className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* Mission Card */}
            <motion.div
              initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#F5F7FB] to-white p-8 md:p-10 border border-[#E8EEF9] hover:shadow-2xl transition-all duration-500"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#1F4B8F] opacity-5 rounded-bl-full" />
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-[#1F4B8F] to-[#2F6EDB] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Target className="w-6 h-6 md:w-8 md:h-8 text-white" />
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-[#1F4B8F]">
                    {dict.about.mission_title}
                  </h2>
                </div>
                <p className="text-gray-600 leading-relaxed text-base md:text-lg">
                  {dict.about.mission}
                </p>
              </div>
            </motion.div>

            {/* Vision Card */}
            <motion.div
              initial={{ opacity: 0, x: isRTL ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#F5F7FB] to-white p-8 md:p-10 border border-[#E8EEF9] hover:shadow-2xl transition-all duration-500"
            >
              <div className="absolute top-0 left-0 w-32 h-32 bg-[#2F6EDB] opacity-5 rounded-br-full" />
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-[#2F6EDB] to-[#4A90E2] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Eye className="w-6 h-6 md:w-8 md:h-8 text-white" />
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-[#1F4B8F]">
                    {dict.about.vision_title}
                  </h2>
                </div>
                <p className="text-gray-600 leading-relaxed text-base md:text-lg">
                  {dict.about.vision}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <ValuesSection isRTL={isRTL} />

      {/* Team Section with Mobile Slider */}
      <section className="py-16 md:py-24 bg-[#F5F7FB]">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#1F4B8F] mb-4">
              {isRTL ? 'فريقنا القيادي' : 'Our Leadership Team'}
            </h2>
            <p className="text-base md:text-lg text-gray-500 max-w-2xl mx-auto">
              {isRTL
                ? 'نخبة من الخبراء والمتخصصين في مجال التكنولوجيا'
                : 'Elite experts and specialists in technology'}
            </p>
          </motion.div>

          {/* Mobile Slider */}
          <MobileTeamSlider teamMembers={teamMembers} isRTL={isRTL} locale={locale} />

          {/* Desktop Grid */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -6 }}
                className="bg-[#ECECEC] rounded-[1.4rem] p-3.5 lg:p-4 text-center transition-all duration-300"
              >
                <div className="relative w-full aspect-square rounded-[1.1rem] overflow-hidden mb-2.5 bg-[#D9D9D9]">
                  {member.image ? (
                    <Image
                      src={member.image}
                      alt={isRTL ? member.nameAr : member.nameEn}
                      fill
                      sizes="(max-width: 1024px) 50vw, 25vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-5xl font-bold text-[#4B5563]">{member.initials}</span>
                    </div>
                  )}
                </div>
                <h3 className="text-base lg:text-lg leading-tight font-extrabold uppercase text-black mb-1.5 tracking-normal">
                  {isRTL ? member.nameAr : member.nameEn}
                </h3>
                <p className="text-[#9CA3AF] text-xs lg:text-sm font-medium mb-2 lg:mb-2.5">
                  {isRTL ? member.roleAr : member.roleEn}
                </p>

                <Link
                  href={`/${locale}/team/${member.slug}`}
                  className="inline-flex items-center gap-1.5 text-[#1456A1] text-sm lg:text-base font-medium"
                >
                  <UserCircle2 className="w-4 h-4 lg:w-5 lg:h-5" />
                  <span>{isRTL ? 'عرض السيرة الذاتية' : 'View Bio'}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline with Mobile Slider */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#1F4B8F] mb-4">
              {isRTL ? 'رحلتنا نحو التميز' : 'Our Journey to Excellence'}
            </h2>
            <p className="text-base md:text-lg text-gray-500 max-w-2xl mx-auto">
              {isRTL
                ? 'محطات بارزة في مسيرة النجاح'
                : 'Key milestones in our success story'}
            </p>
          </motion.div>

          {/* Mobile Timeline Slider */}
          <MobileTimeline milestones={milestones} isRTL={isRTL} />

          {/* Desktop Timeline */}
          <DesktopTimeline milestones={milestones} isRTL={isRTL} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-[#1F4B8F] to-[#2F6EDB] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full" />
        </div>
        
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              {isRTL ? 'هل أنت مستعد للانطلاق مع فُلك؟' : 'Ready to Set Sail with Fulk?'}
            </h2>
            <p className="text-white/90 text-base md:text-lg mb-10 max-w-2xl mx-auto">
              {isRTL
                ? 'انضم إلى عملائنا الناجحين وابدأ رحلة التحول الرقمي اليوم'
                : 'Join our successful clients and start your digital transformation journey today'}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-[#1F4B8F] px-8 md:px-12 py-3 md:py-4 rounded-xl font-bold text-base md:text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              {isRTL ? 'تواصل معنا' : 'Contact Us'}
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
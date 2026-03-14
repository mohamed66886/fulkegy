'use client';

import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import PageHero from '@/components/sections/PageHero';

interface ProjectsPageProps {
  locale: string;
  dict: any;
}

type Category = 'all' | 'web' | 'mobile' | 'erp' | 'design';

const sampleProjects = [
  {
    id: 1,
    titleEn: 'Enterprise Resource Planning System',
    titleAr: 'نظام إدارة موارد المؤسسات',
    descEn: 'A comprehensive ERP system for managing business operations and resources.',
    descAr: 'نظام شامل لإدارة عمليات الأعمال والموارد المؤسسية.',
    category: 'erp' as Category,
    technologies: ['React', 'Node.js', 'PostgreSQL'],
    gradientFrom: '#1F4B8F',
    gradientTo: '#2F6EDB',
  },
  {
    id: 2,
    titleEn: 'E-Commerce Platform',
    titleAr: 'منصة تجارة إلكترونية',
    descEn: 'A modern e-commerce platform with advanced features and payment integration.',
    descAr: 'منصة تجارة إلكترونية حديثة مع ميزات متقدمة وربط أنظمة الدفع.',
    category: 'web' as Category,
    technologies: ['Next.js', 'Stripe', 'Tailwind CSS'],
    gradientFrom: '#2F6EDB',
    gradientTo: '#1F4B8F',
  },
  {
    id: 3,
    titleEn: 'Delivery Mobile App',
    titleAr: 'تطبيق توصيل متنقل',
    descEn: 'A mobile delivery application with real-time tracking and notifications.',
    descAr: 'تطبيق توصيل متنقل مع تتبع فوري وإشعارات.',
    category: 'mobile' as Category,
    technologies: ['React Native', 'Firebase', 'Maps API'],
    gradientFrom: '#1F4B8F',
    gradientTo: '#4A90D9',
  },
  {
    id: 4,
    titleEn: 'Brand Identity Design',
    titleAr: 'تصميم هوية بصرية',
    descEn: 'Complete brand identity design including logo, color palette, and guidelines.',
    descAr: 'تصميم هوية بصرية متكاملة تشمل الشعار والألوان والإرشادات.',
    category: 'design' as Category,
    technologies: ['Figma', 'Illustrator', 'Photoshop'],
    gradientFrom: '#2F6EDB',
    gradientTo: '#6B9FE8',
  },
  {
    id: 5,
    titleEn: 'Healthcare Management System',
    titleAr: 'نظام إدارة الرعاية الصحية',
    descEn: 'A web-based healthcare management system for clinics and hospitals.',
    descAr: 'نظام ويب لإدارة الرعاية الصحية للعيادات والمستشفيات.',
    category: 'web' as Category,
    technologies: ['Angular', 'Spring Boot', 'MySQL'],
    gradientFrom: '#1F4B8F',
    gradientTo: '#2F6EDB',
  },
  {
    id: 6,
    titleEn: 'Fitness Tracking App',
    titleAr: 'تطبيق تتبع اللياقة',
    descEn: 'A fitness tracking mobile app with workout plans and progress analytics.',
    descAr: 'تطبيق لتتبع اللياقة البدنية مع خطط تمارين وتحليلات التقدم.',
    category: 'mobile' as Category,
    technologies: ['Flutter', 'Dart', 'Firebase'],
    gradientFrom: '#2F6EDB',
    gradientTo: '#1F4B8F',
  },
  {
    id: 7,
    titleEn: 'Accounting & Finance ERP',
    titleAr: 'نظام محاسبة ومالية',
    descEn: 'An advanced accounting system with multi-currency support and financial reporting.',
    descAr: 'نظام محاسبة متقدم مع دعم العملات المتعددة والتقارير المالية.',
    category: 'erp' as Category,
    technologies: ['Vue.js', 'Python', 'MongoDB'],
    gradientFrom: '#1F4B8F',
    gradientTo: '#4A90D9',
  },
  {
    id: 8,
    titleEn: 'Corporate Website Redesign',
    titleAr: 'إعادة تصميم موقع الشركة',
    descEn: 'A complete redesign of a corporate website with modern UI/UX principles.',
    descAr: 'إعادة تصميم كاملة لموقع شركة بمبادئ UI/UX حديثة.',
    category: 'design' as Category,
    technologies: ['Figma', 'Next.js', 'Framer Motion'],
    gradientFrom: '#2F6EDB',
    gradientTo: '#6B9FE8',
  },
  {
    id: 9,
    titleEn: 'Real Estate Platform',
    titleAr: 'منصة عقارية',
    descEn: 'A comprehensive real estate platform with listings, virtual tours, and CRM.',
    descAr: 'منصة عقارية شاملة مع قوائم العقارات والجولات الافتراضية وإدارة العملاء.',
    category: 'web' as Category,
    technologies: ['React', 'Node.js', 'AWS'],
    gradientFrom: '#1F4B8F',
    gradientTo: '#2F6EDB',
  },
];

const filterTabs: { key: Category; dictKey: string }[] = [
  { key: 'all', dictKey: 'all' },
  { key: 'web', dictKey: 'web' },
  { key: 'mobile', dictKey: 'mobile' },
  { key: 'erp', dictKey: 'erp' },
  { key: 'design', dictKey: 'design' },
];

export function ProjectsPage({ locale, dict }: ProjectsPageProps) {
  const isRTL = locale === 'ar';
  const gridRef = useRef(null);
  const [activeFilter, setActiveFilter] = useState<Category>('all');
  const [visibleCount, setVisibleCount] = useState(6);

  const gridInView = useInView(gridRef, { once: true, margin: '-100px' });

  const filteredProjects =
    activeFilter === 'all'
      ? sampleProjects
      : sampleProjects.filter((p) => p.category === activeFilter);

  const visibleProjects = filteredProjects.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProjects.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 3);
  };

  return (
    <div className={cn()} dir={isRTL ? 'rtl' : 'ltr'}>
      <PageHero
        locale={locale}
        title={dict.projects.title}
        subtitle={dict.projects.subtitle}
        badge={isRTL ? 'المشاريع' : 'Our Projects'}
      />

      {/* Projects Grid Section */}
      <section ref={gridRef} className="py-24 bg-[#F5F7FB]">
        <div className="max-w-7xl mx-auto px-4">
          {/* Filter Tabs */}
          <motion.div
            className="flex flex-wrap justify-center gap-3 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={gridInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {filterTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveFilter(tab.key);
                  setVisibleCount(6);
                }}
                className={cn(
                  'px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300',
                  activeFilter === tab.key
                    ? 'bg-[#1F4B8F] text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-[#E8EEF9] hover:text-[#1F4B8F] border border-[#E8EEF9]'
                )}
              >
                {dict.projects[tab.dictKey]}
              </button>
            ))}
          </motion.div>

          {/* Projects Grid */}
          <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" layout>
            <AnimatePresence mode="popLayout">
              {visibleProjects.map((project) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-[#E8EEF9] hover:shadow-xl transition-shadow duration-300"
                >
                  {/* Gradient Image Placeholder */}
                  <div
                    className="relative h-52 overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, ${project.gradientFrom}, ${project.gradientTo})`,
                    }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
                        <div className="w-10 h-10 rounded-full bg-white/20" />
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                      <motion.div
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        whileHover={{ scale: 1.1 }}
                      >
                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                          <ExternalLink className="w-5 h-5 text-[#1F4B8F]" />
                        </div>
                      </motion.div>
                    </div>

                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-white/90 text-[#1F4B8F] backdrop-blur-sm">
                        {dict.projects[project.category]}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-[#1F4B8F] mb-2">
                      {isRTL ? project.titleAr : project.titleEn}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed mb-4">
                      {isRTL ? project.descAr : project.descEn}
                    </p>

                    {/* Technologies */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-2.5 py-1 rounded-md text-xs font-medium bg-[#E8EEF9] text-[#1F4B8F]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* View Project Button */}
                    <Button variant="outline" size="sm" className="w-full gap-2">
                      {dict.projects.view_project}
                      {isRTL ? (
                        <ArrowLeft className="w-4 h-4" />
                      ) : (
                        <ArrowRight className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Load More Button */}
          {hasMore && (
            <motion.div
              className="text-center mt-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Button size="lg" variant="outline" onClick={handleLoadMore} className="gap-2">
                {isRTL ? 'عرض المزيد' : 'Load More'}
                {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </Button>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}

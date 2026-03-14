'use client';

import { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowRight,
  ArrowLeft,
  ExternalLink,
  Facebook,
  Globe,
  Instagram,
  Linkedin,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { getProjects } from '@/services/firebase';
import type { Project as FirebaseProject } from '@/types';

interface ProjectsSectionProps {
  locale: string;
  dict: any;
}

type Category = 'all' | 'web' | 'mobile' | 'erp' | 'design';

type SocialLinks = {
  website?: string;
  facebook?: string;
  linkedin?: string;
  instagram?: string;
};

type DisplayProject = {
  id: string;
  titleEn: string;
  titleAr: string;
  descEn: string;
  descAr: string;
  category: Category;
  image: string;
  logo: string;
  projectUrl: string;
  social: SocialLinks;
};

const filterTabs: { key: Category; dictKey: string }[] = [
  { key: 'all', dictKey: 'all' },
  { key: 'web', dictKey: 'web' },
  { key: 'mobile', dictKey: 'mobile' },
  { key: 'erp', dictKey: 'erp' },
  { key: 'design', dictKey: 'design' },
];

function normalizeCategory(category: string): Category {
  const value = category.toLowerCase();
  if (value.includes('mobile')) return 'mobile';
  if (value.includes('erp')) return 'erp';
  if (value.includes('design')) return 'design';
  if (value.includes('web')) return 'web';
  return 'web';
}

function mapProject(project: FirebaseProject): DisplayProject {
  return {
    id: project.id,
    titleEn: project.title,
    titleAr: project.titleAr || project.title,
    descEn: project.description,
    descAr: project.descriptionAr || project.description,
    category: normalizeCategory(project.category),
    image: project.image || '',
    logo: project.logo || '',
    projectUrl: project.projectUrl || '',
    social: {
      website: project.socialLinks?.website || project.projectUrl || '',
      facebook: project.socialLinks?.facebook || '',
      linkedin: project.socialLinks?.linkedin || '',
      instagram: project.socialLinks?.instagram || '',
    },
  };
}

export default function ProjectsSection({ locale, dict }: ProjectsSectionProps) {
  const isRTL = locale === 'ar';
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const [activeFilter, setActiveFilter] = useState<Category>('all');
  const [selectedProject, setSelectedProject] = useState<DisplayProject | null>(null);
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;
  const DetailsArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  const { data: projectsData, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects,
  });

  const projects = useMemo(
    () => (projectsData ?? []).map(mapProject),
    [projectsData]
  );

  const filteredProjects =
    activeFilter === 'all'
      ? projects
      : projects.filter((p) => p.category === activeFilter);

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-24 bg-[#ECECEC]"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-10 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1F4B8F] mb-3">
            {dict.projects.title}
          </h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto px-4">
            {dict.projects.subtitle}
          </p>
          <div className="w-16 h-0.5 bg-[#1F4B8F] mx-auto mt-4" />
        </motion.div>

        {/* Filter Tabs - Responsive Grid */}
        <motion.div
          className="mb-8 md:mb-12"
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="mx-auto w-full md:w-fit max-w-full rounded-2xl bg-white p-1.5 sm:p-2">
            <div className="flex md:flex-wrap md:justify-center gap-1.5 sm:gap-2 overflow-x-auto md:overflow-visible [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {filterTabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveFilter(tab.key)}
                  className={cn(
                    'shrink-0 px-3.5 sm:px-6 py-2 sm:py-2.5 rounded-xl text-[11px] sm:text-sm font-semibold transition-all duration-200 whitespace-nowrap',
                    activeFilter === tab.key
                      ? 'bg-[#1F4B8F] text-white'
                      : 'text-[#1F4B8F] hover:bg-[#1F4B8F]/10'
                  )}
                >
                  {dict.projects[tab.dictKey]}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
          layout
        >
          {!isLoading && filteredProjects.length === 0 && (
            <div className="col-span-full text-center py-10 text-gray-500">
              {isRTL ? 'لا توجد مشاريع حالياً' : 'No projects available right now'}
            </div>
          )}

          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="group rounded-[22px] bg-white p-3 sm:p-4 transition-all duration-300"
              >
                {/* Project Image */}
                <div className="relative h-44 sm:h-48 md:h-52 bg-gray-100 rounded-[18px] overflow-visible">
                  <div className="absolute inset-0 overflow-hidden rounded-[18px]">
                    {project.image ? (
                      <Image
                        src={project.image}
                        alt={isRTL ? project.titleAr : project.titleEn}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-[#1F4B8F] to-[#3a86d6]" />
                    )}
                  </div>

                  {/* Logo Badge */}
                  <div
                    className={cn(
                      'absolute z-20 -bottom-8 w-16 h-16 rounded-full bg-white p-1.5',
                      isRTL ? 'right-4' : 'left-4'
                    )}
                  >
                    <div className="relative w-full h-full">
                      {project.logo ? (
                        <Image
                          src={project.logo}
                          alt="Logo"
                          fill
                          className="object-cover rounded-full"
                          sizes="64px"
                        />
                      ) : (
                        <div className="h-full w-full rounded-full bg-[#1F4B8F] text-white flex items-center justify-center text-xs font-bold">
                          {(isRTL ? project.titleAr : project.titleEn).slice(0, 2).toUpperCase()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="relative z-10 pt-10 sm:pt-11 px-2 pb-2 sm:pb-3 sm:px-3">
                  <h3 className="text-base sm:text-[19px] leading-tight font-extrabold uppercase tracking-tight text-[#11468f] line-clamp-2 mb-3">
                    {isRTL ? project.titleAr : project.titleEn}
                  </h3>

                  <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm">
                    <button
                      type="button"
                      onClick={() => setSelectedProject(project)}
                      className="inline-flex items-center gap-1.5 text-[#1F4B8F] font-semibold hover:text-[#163b73] transition-colors"
                    >
                      {isRTL ? 'عرض التفاصيل' : 'View details'}
                      <DetailsArrowIcon className="w-4 h-4" />
                    </button>

                    <Link
                      href={project.projectUrl || '#'}
                      target={project.projectUrl ? '_blank' : undefined}
                      rel={project.projectUrl ? 'noopener noreferrer' : undefined}
                      className="inline-flex items-center gap-1.5 text-[#1F4B8F] font-semibold hover:text-[#163b73] transition-colors"
                    >
                      {isRTL ? 'زيارة المشروع' : 'Visit project'}
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* View All Button */}
        <motion.div
          className="text-center mt-10 md:mt-16"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Link href={`/${locale}/projects`}>
            <Button 
              size="lg" 
              className="gap-2 !bg-transparent hover:!bg-transparent text-[#1F4B8F] hover:text-[#163b73] px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base shadow-none"
            >
              {dict.projects.view_all}
              <ArrowIcon className="w-4 h-4" />
            </Button>
          </Link>
        </motion.div>

        {/* Project Details Popup */}
        <AnimatePresence>
          {selectedProject && (
            <>
              <motion.div
                className="fixed inset-0 z-40 bg-black/50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedProject(null)}
              />

              <div className="fixed inset-0 z-50 p-3 sm:p-6 overflow-y-auto">
                <div className="min-h-full flex items-start sm:items-center justify-center">
                  <motion.div
                    initial={{ opacity: 0, y: 18, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 18, scale: 0.98 }}
                    transition={{ duration: 0.22, ease: 'easeOut' }}
                    className="relative w-full max-w-4xl rounded-[22px] bg-white p-3 sm:p-4"
                    onClick={(e) => e.stopPropagation()}
                    dir={isRTL ? 'rtl' : 'ltr'}
                  >
                    <button
                      type="button"
                      aria-label={isRTL ? 'إغلاق' : 'Close'}
                      onClick={() => setSelectedProject(null)}
                      className={cn(
                        'absolute z-20 top-6 text-white/90 hover:text-white transition-colors',
                        isRTL ? 'left-6' : 'right-6'
                      )}
                    >
                      <X className="w-6 h-6" />
                    </button>

                    <div className="relative h-44 sm:h-64 md:h-72 rounded-[18px] overflow-hidden">
                      {selectedProject.image ? (
                        <Image
                          src={selectedProject.image}
                          alt={isRTL ? selectedProject.titleAr : selectedProject.titleEn}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1024px"
                        />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-br from-[#1F4B8F] to-[#3a86d6]" />
                      )}
                    </div>

                    <div className="relative bg-white pt-12 sm:pt-14 px-2 sm:px-4 pb-2">
                      <div
                        className={cn(
                          'absolute -top-9 sm:-top-10 z-10 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white p-1.5',
                          isRTL ? 'right-3 sm:right-4' : 'left-3 sm:left-4'
                        )}
                      >
                        <div className="relative w-full h-full rounded-full overflow-hidden">
                          {selectedProject.logo ? (
                            <Image
                              src={selectedProject.logo}
                              alt={isRTL ? 'شعار المشروع' : 'Project logo'}
                              fill
                              className="object-cover"
                              sizes="80px"
                            />
                          ) : (
                            <div className="h-full w-full rounded-full bg-[#1F4B8F] text-white flex items-center justify-center text-sm font-bold">
                              {(isRTL ? selectedProject.titleAr : selectedProject.titleEn)
                                .slice(0, 2)
                                .toUpperCase()}
                            </div>
                          )}
                        </div>
                      </div>

                      <h3 className="text-lg sm:text-3xl font-extrabold tracking-tight text-[#11468f] mb-3 sm:mb-4">
                        {isRTL ? selectedProject.titleAr : selectedProject.titleEn}
                      </h3>

                      <div className="flex items-center gap-3 mb-4 sm:mb-5">
                        {selectedProject.social.website && (
                          <Link
                            href={selectedProject.social.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#1F4B8F] hover:text-[#163b73] transition-colors"
                          >
                            <Globe className="w-5 h-5" />
                          </Link>
                        )}
                        {selectedProject.social.linkedin && (
                          <Link
                            href={selectedProject.social.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#1F4B8F] hover:text-[#163b73] transition-colors"
                          >
                            <Linkedin className="w-5 h-5" />
                          </Link>
                        )}
                        {selectedProject.social.facebook && (
                          <Link
                            href={selectedProject.social.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#1F4B8F] hover:text-[#163b73] transition-colors"
                          >
                            <Facebook className="w-5 h-5" />
                          </Link>
                        )}
                        {selectedProject.social.instagram && (
                          <Link
                            href={selectedProject.social.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#1F4B8F] hover:text-[#163b73] transition-colors"
                          >
                            <Instagram className="w-5 h-5" />
                          </Link>
                        )}
                      </div>

                      <p className="text-sm sm:text-base leading-7 text-gray-700 whitespace-pre-line">
                        {isRTL ? selectedProject.descAr : selectedProject.descEn}
                      </p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
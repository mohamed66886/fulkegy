'use client';

import { useRef, useState, useMemo } from 'react';
import { motion, useInView } from 'framer-motion';
import { Search, ArrowRight, ArrowLeft, User, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import PageHero from '@/components/sections/PageHero';

interface BlogPageProps {
  locale: string;
  dict: any;
}

const blogPosts = [
  {
    id: 1,
    titleEn: 'The Future of ERP Systems in Saudi Arabia',
    titleAr: 'مستقبل أنظمة ERP في المملكة العربية السعودية',
    excerptEn: 'Explore how modern ERP systems are transforming business operations across Saudi Arabia and the GCC region, with a focus on cloud-based solutions.',
    excerptAr: 'اكتشف كيف تحول أنظمة ERP الحديثة عمليات الأعمال عبر المملكة العربية السعودية ومنطقة الخليج، مع التركيز على الحلول السحابية.',
    authorEn: 'Ahmed Al-Rashid',
    authorAr: 'أحمد الراشد',
    date: '2024-12-15',
    tags: ['ERP', 'Cloud', 'Saudi Arabia'],
    tagsAr: ['ERP', 'سحابة', 'السعودية'],
    gradientFrom: '#1F4B8F',
    gradientTo: '#2F6EDB',
    featured: true,
  },
  {
    id: 2,
    titleEn: 'Building Scalable Mobile Apps with React Native',
    titleAr: 'بناء تطبيقات موبايل قابلة للتوسع مع React Native',
    excerptEn: 'A deep dive into best practices for building performant, scalable mobile applications using React Native and modern state management.',
    excerptAr: 'نظرة معمقة في أفضل الممارسات لبناء تطبيقات موبايل عالية الأداء وقابلة للتوسع باستخدام React Native.',
    authorEn: 'Sara Al-Mutairi',
    authorAr: 'سارة المطيري',
    date: '2024-11-28',
    tags: ['Mobile', 'React Native', 'Development'],
    tagsAr: ['موبايل', 'React Native', 'تطوير'],
    gradientFrom: '#2F6EDB',
    gradientTo: '#4A90D9',
    featured: false,
  },
  {
    id: 3,
    titleEn: 'AI-Powered Solutions for Business Growth',
    titleAr: 'حلول مدعومة بالذكاء الاصطناعي لنمو الأعمال',
    excerptEn: 'How artificial intelligence is revolutionizing business processes and creating new opportunities for companies in the digital age.',
    excerptAr: 'كيف يغير الذكاء الاصطناعي عمليات الأعمال ويخلق فرصًا جديدة للشركات في العصر الرقمي.',
    authorEn: 'Khalid Hassan',
    authorAr: 'خالد حسن',
    date: '2024-11-10',
    tags: ['AI', 'Business', 'Innovation'],
    tagsAr: ['ذكاء اصطناعي', 'أعمال', 'ابتكار'],
    gradientFrom: '#1F4B8F',
    gradientTo: '#6B9FE8',
    featured: false,
  },
  {
    id: 4,
    titleEn: 'UI/UX Design Trends for 2025',
    titleAr: 'اتجاهات تصميم UI/UX لعام 2025',
    excerptEn: 'Discover the latest design trends shaping user interfaces and experiences in 2025, from micro-interactions to AI-driven personalization.',
    excerptAr: 'اكتشف أحدث اتجاهات التصميم التي تشكل واجهات وتجارب المستخدم في 2025، من التفاعلات الدقيقة إلى التخصيص المدعوم بالذكاء الاصطناعي.',
    authorEn: 'Nora Al-Fahad',
    authorAr: 'نورة الفهد',
    date: '2024-10-22',
    tags: ['Design', 'UI/UX', 'Trends'],
    tagsAr: ['تصميم', 'UI/UX', 'اتجاهات'],
    gradientFrom: '#2F6EDB',
    gradientTo: '#1F4B8F',
    featured: false,
  },
  {
    id: 5,
    titleEn: 'Next.js vs Traditional Web Frameworks',
    titleAr: 'Next.js مقابل أطر الويب التقليدية',
    excerptEn: 'A comprehensive comparison between Next.js and traditional web frameworks, helping you choose the right tool for your next project.',
    excerptAr: 'مقارنة شاملة بين Next.js وأطر الويب التقليدية، لمساعدتك في اختيار الأداة المناسبة لمشروعك القادم.',
    authorEn: 'Ahmed Al-Rashid',
    authorAr: 'أحمد الراشد',
    date: '2024-10-05',
    tags: ['Web', 'Next.js', 'Frameworks'],
    tagsAr: ['ويب', 'Next.js', 'أطر عمل'],
    gradientFrom: '#1F4B8F',
    gradientTo: '#4A90D9',
    featured: false,
  },
  {
    id: 6,
    titleEn: 'Cybersecurity Best Practices for SMEs',
    titleAr: 'أفضل ممارسات الأمن السيبراني للشركات الصغيرة والمتوسطة',
    excerptEn: 'Essential cybersecurity strategies and tools that every small and medium enterprise should implement to protect their digital assets.',
    excerptAr: 'استراتيجيات وأدوات الأمن السيبراني الأساسية التي يجب على كل شركة صغيرة ومتوسطة تنفيذها لحماية أصولها الرقمية.',
    authorEn: 'Khalid Hassan',
    authorAr: 'خالد حسن',
    date: '2024-09-18',
    tags: ['Security', 'Business', 'Best Practices'],
    tagsAr: ['أمان', 'أعمال', 'أفضل الممارسات'],
    gradientFrom: '#2F6EDB',
    gradientTo: '#6B9FE8',
    featured: false,
  },
];

const allTagsEn = Array.from(new Set(blogPosts.flatMap((p) => p.tags)));
const allTagsAr = Array.from(new Set(blogPosts.flatMap((p) => p.tagsAr)));

export function BlogPage({ locale, dict }: BlogPageProps) {
  const isRTL = locale === 'ar';
  const contentRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const contentInView = useInView(contentRef, { once: true, margin: '-100px' });

  const allTags = isRTL ? allTagsAr : allTagsEn;

  const filteredPosts = useMemo(() => {
    return blogPosts.filter((post) => {
      const title = isRTL ? post.titleAr : post.titleEn;
      const matchesSearch = searchQuery
        ? title.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      const tags = isRTL ? post.tagsAr : post.tags;
      const matchesTag = selectedTag ? tags.includes(selectedTag) : true;
      return matchesSearch && matchesTag;
    });
  }, [searchQuery, selectedTag, isRTL]);

  const featuredPost = filteredPosts.find((p) => p.featured);
  const regularPosts = filteredPosts.filter((p) => !p.featured);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' as const },
    },
  };

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <div className={cn()} dir={isRTL ? 'rtl' : 'ltr'}>
      <PageHero
        locale={locale}
        title={dict.blog.title}
        subtitle={dict.blog.subtitle}
        badge={isRTL ? 'المدونة' : 'Blog'}
      />

      {/* Content Section */}
      <section ref={contentRef} className="py-24 bg-[#F5F7FB]">
        <div className="max-w-7xl mx-auto px-4">
          {/* Search Bar */}
          <motion.div
            className="max-w-xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={contentInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <div className="relative">
              <Search className="absolute top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 start-4" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={dict.blog.search_placeholder}
                className="ps-12 h-12 rounded-xl bg-white border-[#E8EEF9] focus:border-[#2F6EDB]"
              />
            </div>
          </motion.div>

          {/* Tag Filter Chips */}
          <motion.div
            className="flex flex-wrap justify-center gap-2 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={contentInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <button
              onClick={() => setSelectedTag(null)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium transition-all duration-300',
                selectedTag === null
                  ? 'bg-[#1F4B8F] text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-[#E8EEF9] hover:text-[#1F4B8F] border border-[#E8EEF9]'
              )}
            >
              {isRTL ? 'الكل' : 'All'}
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium transition-all duration-300',
                  selectedTag === tag
                    ? 'bg-[#1F4B8F] text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-[#E8EEF9] hover:text-[#1F4B8F] border border-[#E8EEF9]'
                )}
              >
                {tag}
              </button>
            ))}
          </motion.div>

          {/* No Results */}
          {filteredPosts.length === 0 && (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-gray-500 text-lg">{dict.blog.no_results}</p>
            </motion.div>
          )}

          {/* Featured Post */}
          {featuredPost && (
            <motion.div
              className="mb-12"
              variants={itemVariants}
              initial="hidden"
              animate={contentInView ? 'visible' : 'hidden'}
            >
              <div className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-[#E8EEF9] hover:shadow-xl transition-all duration-300">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  {/* Image */}
                  <div
                    className="h-64 lg:h-auto min-h-[300px]"
                    style={{
                      background: `linear-gradient(135deg, ${featuredPost.gradientFrom}, ${featuredPost.gradientTo})`,
                    }}
                  >
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
                        <div className="w-12 h-12 rounded-full bg-white/20" />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8 lg:p-10 flex flex-col justify-center">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {(isRTL ? featuredPost.tagsAr : featuredPost.tags).map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 rounded-full text-xs font-medium bg-[#E8EEF9] text-[#1F4B8F]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-[#1F4B8F] mb-4">
                      {isRTL ? featuredPost.titleAr : featuredPost.titleEn}
                    </h2>
                    <p className="text-gray-500 leading-relaxed mb-6">
                      {isRTL ? featuredPost.excerptAr : featuredPost.excerptEn}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-400 mb-6">
                      <span className="flex items-center gap-1.5">
                        <User className="w-4 h-4" />
                        {isRTL ? featuredPost.authorAr : featuredPost.authorEn}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        {featuredPost.date}
                      </span>
                    </div>
                    <Button size="lg" className="gap-2 w-fit">
                      {dict.blog.read_more}
                      <ArrowIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Regular Posts Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate={contentInView ? 'visible' : 'hidden'}
          >
            {regularPosts.map((post) => (
              <motion.div
                key={post.id}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-[#E8EEF9] hover:shadow-xl transition-all duration-300"
                variants={itemVariants}
                whileHover={{ y: -4 }}
              >
                {/* Image Placeholder */}
                <div
                  className="h-48 relative"
                  style={{
                    background: `linear-gradient(135deg, ${post.gradientFrom}, ${post.gradientTo})`,
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
                      <div className="w-8 h-8 rounded-full bg-white/20" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {(isRTL ? post.tagsAr : post.tags).map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#E8EEF9] text-[#1F4B8F]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <h3 className="text-lg font-bold text-[#1F4B8F] mb-2 line-clamp-2">
                    {isRTL ? post.titleAr : post.titleEn}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-3">
                    {isRTL ? post.excerptAr : post.excerptEn}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                    <span className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" />
                      {isRTL ? post.authorAr : post.authorEn}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {post.date}
                    </span>
                  </div>

                  <Button variant="outline" size="sm" className="w-full gap-2">
                    {dict.blog.read_more}
                    <ArrowIcon className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}

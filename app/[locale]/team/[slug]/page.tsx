import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, Mail, Phone, MapPin, Briefcase, GraduationCap } from 'lucide-react';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import { getDictionary } from '@/lib/i18n';

const teamProfiles = [
  {
    slug: 'ahmed-naeim',
    nameEn: 'Ahmed Al-Rashid',
    nameAr: 'أحمد الراشد',
    roleEn: 'Vice Chairman',
    roleAr: 'نائب رئيس مجلس الإدارة',
    image: '/images/team/ahmed-naeim.svg',
    email: 'ahmed@fulk.sa',
    phone: '+966 50 000 0001',
    locationEn: 'Riyadh, Saudi Arabia',
    locationAr: 'الرياض، المملكة العربية السعودية',
    bioEn:
      'Ahmed is focused on strategic growth, governance excellence, and building long-term partnerships that help organizations accelerate their digital transformation journey.',
    bioAr:
      'يركز أحمد على النمو الاستراتيجي، والحوكمة المؤسسية، وبناء شراكات طويلة الأمد تساعد الجهات على تسريع رحلة التحول الرقمي.',
    experienceEn: '10+ years in business leadership and digital strategy',
    experienceAr: 'أكثر من 10 سنوات في القيادة وتطوير الاستراتيجيات الرقمية',
    specializationEn: 'Corporate Strategy, Digital Transformation, Partnerships',
    specializationAr: 'الاستراتيجية المؤسسية، التحول الرقمي، الشراكات',
  },
  {
    slug: 'sara-almutairi',
    nameEn: 'Sara Al-Mutairi',
    nameAr: 'سارة المطيري',
    roleEn: 'Chief Technology Officer',
    roleAr: 'المدير التقني',
    image: '/images/team/sara-almutairi.svg',
    email: 'sara@fulk.sa',
    phone: '+966 50 000 0002',
    locationEn: 'Riyadh, Saudi Arabia',
    locationAr: 'الرياض، المملكة العربية السعودية',
    bioEn:
      'Sara leads engineering teams and platform architecture with a strong focus on scalability, security, and product quality across enterprise systems.',
    bioAr:
      'تقود سارة فرق الهندسة وبنية المنصات مع تركيز قوي على القابلية للتوسع والأمان وجودة المنتجات في الأنظمة المؤسسية.',
    experienceEn: '9+ years in software architecture and engineering leadership',
    experienceAr: 'أكثر من 9 سنوات في هندسة البرمجيات وقيادة الفرق التقنية',
    specializationEn: 'System Architecture, Cloud Platforms, Engineering Management',
    specializationAr: 'هندسة الأنظمة، المنصات السحابية، إدارة الفرق الهندسية',
  },
  {
    slug: 'khalid-hassan',
    nameEn: 'Khalid Hassan',
    nameAr: 'خالد حسن',
    roleEn: 'Lead Developer',
    roleAr: 'مطور رئيسي',
    image: '/images/team/khalid-hassan.svg',
    email: 'khalid@fulk.sa',
    phone: '+966 50 000 0003',
    locationEn: 'Riyadh, Saudi Arabia',
    locationAr: 'الرياض، المملكة العربية السعودية',
    bioEn:
      'Khalid specializes in building robust web products, leading implementation standards, and mentoring developers to deliver maintainable solutions.',
    bioAr:
      'يتخصص خالد في بناء منتجات ويب قوية، وقيادة معايير التنفيذ، وتوجيه المطورين لتقديم حلول قابلة للصيانة.',
    experienceEn: '8+ years in full-stack development and technical leadership',
    experienceAr: 'أكثر من 8 سنوات في تطوير البرمجيات وقيادة التنفيذ التقني',
    specializationEn: 'Full-stack Development, Code Quality, Technical Mentorship',
    specializationAr: 'تطوير Full-stack، جودة الكود، الإرشاد التقني',
  },
  {
    slug: 'nora-alfahad',
    nameEn: 'Nora Al-Fahad',
    nameAr: 'نورة الفهد',
    roleEn: 'Design Director',
    roleAr: 'مدير التصميم',
    image: '/images/team/nora-alfahad.svg',
    email: 'nora@fulk.sa',
    phone: '+966 50 000 0004',
    locationEn: 'Riyadh, Saudi Arabia',
    locationAr: 'الرياض، المملكة العربية السعودية',
    bioEn:
      'Nora drives product and brand design with user-centered methodologies to create accessible, elegant, and high-converting digital experiences.',
    bioAr:
      'تقود نورة تصميم المنتجات والهوية بعقلية تركز على المستخدم لصناعة تجارب رقمية أنيقة وسهلة الاستخدام وعالية التأثير.',
    experienceEn: '8+ years in product design and UX strategy',
    experienceAr: 'أكثر من 8 سنوات في تصميم المنتجات واستراتيجيات تجربة المستخدم',
    specializationEn: 'UX Strategy, Product Design, Design Systems',
    specializationAr: 'استراتيجية UX، تصميم المنتجات، أنظمة التصميم',
  },
] as const;

function getTeamProfile(slug: string) {
  return teamProfiles.find((member) => member.slug === slug);
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const profile = getTeamProfile(params.slug);

  if (!profile) {
    return {
      title: params.locale === 'ar' ? 'الملف الشخصي غير موجود | فُلك' : 'Profile Not Found | Fulk',
    };
  }

  const isArabic = params.locale === 'ar';

  return {
    title: isArabic
      ? `${profile.nameAr} | الملف الشخصي | فُلك`
      : `${profile.nameEn} | Profile | Fulk`,
    description: isArabic ? profile.bioAr : profile.bioEn,
  };
}

export default async function TeamProfilePage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const dict = await getDictionary(params.locale);
  const isRTL = params.locale === 'ar';
  const profile = getTeamProfile(params.slug);

  if (!profile) notFound();

  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  return (
    <main dir={isRTL ? 'rtl' : 'ltr'}>
      <Navbar locale={params.locale} dict={dict} />

      <section className="py-14 md:py-20 bg-gradient-to-b from-[#F5F7FB] to-white">
        <div className="max-w-6xl mx-auto px-4">
          <Link
            href={`/${params.locale}/about`}
            className="inline-flex items-center gap-2 text-[#1F4B8F] font-medium mb-8"
          >
            <BackIcon className="w-4 h-4" />
            <span>{isRTL ? 'العودة إلى صفحة من نحن' : 'Back to About'}</span>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-8 lg:gap-12 items-start">
            <div className="bg-[#ECECEC] rounded-3xl p-4">
              <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-[#D9D9D9]">
                <Image
                  src={profile.image}
                  alt={isRTL ? profile.nameAr : profile.nameEn}
                  fill
                  sizes="(max-width: 1024px) 100vw, 340px"
                  className="object-cover"
                />
              </div>
            </div>

            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-[#111827] mb-3">
                {isRTL ? profile.nameAr : profile.nameEn}
              </h1>
              <p className="text-lg md:text-xl text-[#6B7280] font-medium mb-6">
                {isRTL ? profile.roleAr : profile.roleEn}
              </p>

              <p className="text-[#374151] leading-relaxed mb-8 text-base md:text-lg">
                {isRTL ? profile.bioAr : profile.bioEn}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-2xl bg-white border border-[#E5E7EB] p-4">
                  <p className="text-sm text-[#6B7280] mb-2 flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    <span>{isRTL ? 'الخبرة' : 'Experience'}</span>
                  </p>
                  <p className="font-semibold text-[#111827]">
                    {isRTL ? profile.experienceAr : profile.experienceEn}
                  </p>
                </div>

                <div className="rounded-2xl bg-white border border-[#E5E7EB] p-4">
                  <p className="text-sm text-[#6B7280] mb-2 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" />
                    <span>{isRTL ? 'التخصص' : 'Specialization'}</span>
                  </p>
                  <p className="font-semibold text-[#111827]">
                    {isRTL ? profile.specializationAr : profile.specializationEn}
                  </p>
                </div>

                <div className="rounded-2xl bg-white border border-[#E5E7EB] p-4">
                  <p className="text-sm text-[#6B7280] mb-2 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>{isRTL ? 'البريد الإلكتروني' : 'Email'}</span>
                  </p>
                  <p className="font-semibold text-[#111827]">{profile.email}</p>
                </div>

                <div className="rounded-2xl bg-white border border-[#E5E7EB] p-4">
                  <p className="text-sm text-[#6B7280] mb-2 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>{isRTL ? 'الهاتف' : 'Phone'}</span>
                  </p>
                  <p className="font-semibold text-[#111827]">{profile.phone}</p>
                </div>
              </div>

              <div className="rounded-2xl bg-white border border-[#E5E7EB] p-4 mt-4">
                <p className="text-sm text-[#6B7280] mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{isRTL ? 'الموقع' : 'Location'}</span>
                </p>
                <p className="font-semibold text-[#111827]">
                  {isRTL ? profile.locationAr : profile.locationEn}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer locale={params.locale} dict={dict} />
    </main>
  );
}

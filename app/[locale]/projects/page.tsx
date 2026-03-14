import { getDictionary } from '@/lib/i18n';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import { ProjectsPage } from '@/components/sections/ProjectsPage';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const isArabic = params.locale === 'ar';
  return {
    title: isArabic
      ? 'مشاريعنا | فُلك - Fulk'
      : 'Our Projects | Fulk',
    description: isArabic
      ? 'استعرض مشاريعنا المتميزة في تطوير الويب والموبايل وأنظمة ERP والتصميم'
      : 'Browse our distinguished projects in web, mobile, ERP development and design',
  };
}

export default async function Projects({
  params,
}: {
  params: { locale: string };
}) {
  const dict = await getDictionary(params.locale);

  return (
    <main>
      <Navbar locale={params.locale} dict={dict} />
      <ProjectsPage locale={params.locale} dict={dict} />
      <Footer locale={params.locale} dict={dict} />
    </main>
  );
}

import { getDictionary } from '@/lib/i18n';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import { CareersPage } from '@/components/sections/CareersPage';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const isArabic = params.locale === 'ar';
  return {
    title: isArabic
      ? 'الوظائف | فُلك - Fulk'
      : 'Careers | Fulk',
    description: isArabic
      ? 'انضم لفريق فُلك - نبحث عن مواهب متميزة في التطوير والتصميم والتقنية'
      : 'Join the Fulk team - We are looking for talented developers, designers, and tech professionals',
  };
}

export default async function Careers({
  params,
}: {
  params: { locale: string };
}) {
  const dict = await getDictionary(params.locale);

  return (
    <main>
      <Navbar locale={params.locale} dict={dict} />
      <CareersPage locale={params.locale} dict={dict} />
      <Footer locale={params.locale} dict={dict} />
    </main>
  );
}

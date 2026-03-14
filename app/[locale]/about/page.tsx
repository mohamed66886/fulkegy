import { getDictionary } from '@/lib/i18n';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import { AboutPage } from '@/components/sections/AboutPage';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const isArabic = params.locale === 'ar';
  return {
    title: isArabic
      ? 'من نحن | فُلك - Fulk'
      : 'About Us | Fulk',
    description: isArabic
      ? 'تعرف على شركة فُلك للحلول البرمجية - شريكك في رحلة التحول الرقمي'
      : 'Learn about Fulk Software Solutions - Your partner in digital transformation',
  };
}

export default async function About({
  params,
}: {
  params: { locale: string };
}) {
  const dict = await getDictionary(params.locale);

  return (
    <main>
      <Navbar locale={params.locale} dict={dict} />
      <AboutPage locale={params.locale} dict={dict} />
      <Footer locale={params.locale} dict={dict} />
    </main>
  );
}

import { getDictionary } from '@/lib/i18n';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import { ServicesPage } from '@/components/sections/ServicesPage';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const isArabic = params.locale === 'ar';
  return {
    title: isArabic
      ? 'خدماتنا | فُلك - Fulk'
      : 'Our Services | Fulk',
    description: isArabic
      ? 'اكتشف خدماتنا التقنية المتكاملة - تطوير الويب، تطبيقات الموبايل، أنظمة ERP والمزيد'
      : 'Discover our comprehensive tech services - Web development, mobile apps, ERP systems and more',
  };
}

export default async function Services({
  params,
}: {
  params: { locale: string };
}) {
  const dict = await getDictionary(params.locale);

  return (
    <main>
      <Navbar locale={params.locale} dict={dict} />
      <ServicesPage locale={params.locale} dict={dict} />
      <Footer locale={params.locale} dict={dict} />
    </main>
  );
}

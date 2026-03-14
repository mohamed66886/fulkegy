import { getDictionary } from '@/lib/i18n';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import { ContactPage } from '@/components/sections/ContactPage';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const isArabic = params.locale === 'ar';
  return {
    title: isArabic
      ? 'تواصل معنا | فُلك - Fulk'
      : 'Contact Us | Fulk',
    description: isArabic
      ? 'تواصل مع فريق فُلك - نسعد بالإجابة على استفساراتك ومساعدتك في مشروعك القادم'
      : 'Get in touch with the Fulk team - We are happy to answer your questions and help with your next project',
  };
}

export default async function Contact({
  params,
}: {
  params: { locale: string };
}) {
  const dict = await getDictionary(params.locale);

  return (
    <main>
      <Navbar locale={params.locale} dict={dict} />
      <ContactPage locale={params.locale} dict={dict} />
      <Footer locale={params.locale} dict={dict} />
    </main>
  );
}

import { getDictionary } from '@/lib/i18n';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import ServicesSection from '@/components/sections/ServicesSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import WhyUsSection from '@/components/sections/WhyUsSection';
import VisionSection from '@/components/sections/VisionSection';
import ContactSection from '@/components/sections/ContactSection';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const isArabic = params.locale === 'ar';
  return {
    title: isArabic
      ? 'فُلك | Fulk - نبحر بك نحو التحول الرقمي'
      : 'Fulk | فُلك - Sailing You Toward Digital Transformation',
    description: isArabic
      ? 'شركة فُلك للحلول البرمجية - شريكك في رحلة التحول الرقمي'
      : 'Fulk Software Solutions - Your partner in digital transformation',
  };
}

export default async function HomePage({
  params,
}: {
  params: { locale: string };
}) {
  const dict = await getDictionary(params.locale);

  return (
    <main>
      <Navbar locale={params.locale} dict={dict} />
      <HeroSection locale={params.locale} dict={dict} />
      <AboutSection locale={params.locale} dict={dict} />
      <ServicesSection locale={params.locale} dict={dict} />
      <ProjectsSection locale={params.locale} dict={dict} />
      <WhyUsSection locale={params.locale} dict={dict} />
      <VisionSection locale={params.locale} dict={dict} />
      <ContactSection locale={params.locale} dict={dict} />
      <Footer locale={params.locale} dict={dict} />
    </main>
  );
}

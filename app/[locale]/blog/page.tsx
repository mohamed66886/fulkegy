import { getDictionary } from '@/lib/i18n';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import { BlogPage } from '@/components/sections/BlogPage';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const isArabic = params.locale === 'ar';
  return {
    title: isArabic
      ? 'المدونة | فُلك - Fulk'
      : 'Blog | Fulk',
    description: isArabic
      ? 'مقالات ونصائح تقنية من فريق فُلك - تطوير الويب، الموبايل، الذكاء الاصطناعي والمزيد'
      : 'Tech articles and tips from the Fulk team - Web development, mobile, AI and more',
  };
}

export default async function Blog({
  params,
}: {
  params: { locale: string };
}) {
  const dict = await getDictionary(params.locale);

  return (
    <main>
      <Navbar locale={params.locale} dict={dict} />
      <BlogPage locale={params.locale} dict={dict} />
      <Footer locale={params.locale} dict={dict} />
    </main>
  );
}

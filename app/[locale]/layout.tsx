import { getDictionary } from '@/lib/i18n';
import { ThemeProvider } from '@/components/shared/ThemeProvider';
import { QueryProvider } from '@/components/shared/QueryProvider';
import { AuthProvider } from '@/hooks/useAuth';
import { SetLocaleAttrs } from '@/components/shared/SetLocaleAttrs';

export async function generateStaticParams() {
  return [{ locale: 'ar' }, { locale: 'en' }];
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const locale = params.locale;

  // Validate locale
  if (!['ar', 'en'].includes(locale)) {
    return null;
  }

  await getDictionary(locale);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <QueryProvider>
        <AuthProvider>
          <SetLocaleAttrs locale={locale} />
          {children}
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}

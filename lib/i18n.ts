import { notFound } from 'next/navigation';

const locales = ['ar', 'en'] as const;
type Locale = (typeof locales)[number];

const dictionaries: Record<Locale, () => Promise<Record<string, unknown>>> = {
  ar: () => import('@/translations/ar.json').then((m) => m.default),
  en: () => import('@/translations/en.json').then((m) => m.default),
};

export async function getDictionary(locale: string) {
  if (!locales.includes(locale as Locale)) notFound();
  return dictionaries[locale as Locale]();
}

export { locales };
export type { Locale };

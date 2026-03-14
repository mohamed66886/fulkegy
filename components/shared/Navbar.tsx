'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavbarProps {
  locale: string;
  dict: any;
}

const navKeys = [
  { key: 'home',     href: ''          },
  { key: 'about',    href: '/about'    },
  { key: 'services', href: '/services' },
  { key: 'projects', href: '/projects' },
  { key: 'blog',     href: '/blog'     },
  { key: 'careers',  href: '/careers'  },
  { key: 'contact',  href: '/contact'  },
];

export default function Navbar({ locale, dict }: NavbarProps) {
  const router   = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted,    setMounted]    = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled,   setScrolled]   = useState(false);

  const isRTL = locale === 'ar';

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const switchLocale = () => {
    const next = locale === 'ar' ? 'en' : 'ar';
    const segs  = pathname.split('/');
    segs[1]     = next;
    router.push(segs.join('/'));
  };

  const isActive = (href: string) => {
    if (href === '') return pathname === `/${locale}` || pathname === `/${locale}/`;
    return pathname.startsWith(`/${locale}${href}`);
  };

  return (
    <>
      {/* ══════════════ FLOATING NAVBAR ══════════════ */}
      <div
        dir={isRTL ? 'rtl' : 'ltr'}
        className="fixed top-0 inset-x-0 z-50 flex justify-center px-4 pt-4"
      >
        <motion.header
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0,   opacity: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' as const }}
          className={cn(
            'w-full max-w-6xl rounded-2xl transition-all duration-300',
            'flex items-center justify-between px-4 h-[60px]',
            scrolled
              ? 'bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-xl shadow-[0_8px_32px_rgba(31,75,143,0.12)] border border-[#E2E9F5] dark:border-white/10'
              : 'bg-white/90 dark:bg-[#0f172a]/90 backdrop-blur-md shadow-[0_4px_24px_rgba(31,75,143,0.08)] border border-[#E8EEF8] dark:border-white/8'
          )}
        >
          {/* ── Logo ── */}
          <Link href={`/${locale}`} className="flex items-center gap-2.5 shrink-0">
            <motion.div
              whileHover={{ rotate: 7, scale: 1.07 }}
              transition={{ type: 'spring', stiffness: 380, damping: 18 }}
              className="w-8 h-8 rounded-[10px] bg-gradient-to-br from-[#1F4B8F] to-[#2F6EDB] flex items-center justify-center shadow-md shadow-[#2F6EDB]/30 shrink-0"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M3 18L12 4L21 18H3Z"   stroke="white" strokeWidth="2"   strokeLinejoin="round" />
                <path d="M7.5 18L12 10L16.5 18" stroke="white" strokeWidth="1.5" strokeLinejoin="round" opacity="0.55" />
              </svg>
            </motion.div>
            <span className="text-[17px] font-bold leading-none">
              <span className="text-[#1F4B8F] dark:text-white">Fulk</span>
              <span className="text-[#2F6EDB] mx-1 font-normal opacity-70">|</span>
              <span className="text-[#1F4B8F] dark:text-white">فُلك</span>
            </span>
          </Link>

          {/* ── Desktop Nav Links ── */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {navKeys.map(({ key, href }) => {
              const active = isActive(href);
              return (
                <Link
                  key={key}
                  href={`/${locale}${href}`}
                  className={cn(
                    'relative px-3.5 py-1.5 text-[13px] font-medium rounded-xl transition-all duration-200 select-none whitespace-nowrap',
                    active
                      ? 'text-[#1F4B8F] dark:text-white'
                      : 'text-gray-500 dark:text-gray-400 hover:text-[#1F4B8F] dark:hover:text-white hover:bg-[#F0F4FB] dark:hover:bg-white/5'
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-bg"
                      className="absolute inset-0 rounded-xl bg-[#EEF3FB] dark:bg-[#1e3a5f]"
                      transition={{ type: 'spring', stiffness: 400, damping: 36 }}
                    />
                  )}
                  <span className="relative z-10">{dict.nav[key]}</span>
                </Link>
              );
            })}
          </nav>

          {/* ── Desktop Actions ── */}
          <div className="hidden lg:flex items-center gap-1">
            {/* Language */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={switchLocale}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[13px] font-medium text-gray-500 dark:text-gray-400 hover:text-[#1F4B8F] dark:hover:text-white hover:bg-[#F0F4FB] dark:hover:bg-white/5 transition-colors duration-200"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{dict.nav.language}</span>
            </motion.button>

            {/* Theme toggle */}
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:text-[#1F4B8F] dark:hover:text-white hover:bg-[#F0F4FB] dark:hover:bg-white/5 transition-colors duration-200"
            >
              {mounted && theme === 'dark'
                ? <Sun  className="w-[17px] h-[17px]" />
                : <Moon className="w-[17px] h-[17px]" />
              }
            </motion.button>

            {/* CTA */}
            <Link
              href={`/${locale}/contact`}
              className="ms-1 px-4 py-2 text-[13px] font-semibold rounded-xl text-white bg-gradient-to-r from-[#1F4B8F] to-[#2F6EDB] shadow-md shadow-[#2F6EDB]/25 hover:shadow-lg hover:shadow-[#2F6EDB]/35 hover:-translate-y-px active:translate-y-0 transition-all duration-200"
            >
              {dict.nav.getStarted ?? dict.nav.contact}
            </Link>
          </div>

          {/* ── Mobile Controls ── */}
          <div className="flex lg:hidden items-center gap-0.5">
            <button
              onClick={switchLocale}
              className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-[#F0F4FB] dark:hover:bg-white/5 transition-colors"
            >
              <Globe className="w-5 h-5" />
            </button>
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-[#F0F4FB] dark:hover:bg-white/5 transition-colors"
            >
              {mounted && theme === 'dark'
                ? <Sun  className="w-5 h-5" />
                : <Moon className="w-5 h-5" />
              }
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-xl text-[#1F4B8F] dark:text-white hover:bg-[#E8EEF9] dark:hover:bg-white/5 transition-colors"
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileOpen ? (
                  <motion.div key="x"
                    initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}     transition={{ duration: 0.15 }}
                  ><X className="w-5 h-5" /></motion.div>
                ) : (
                  <motion.div key="m"
                    initial={{ rotate: 90, opacity: 0 }}  animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}    transition={{ duration: 0.15 }}
                  ><Menu className="w-5 h-5" /></motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </motion.header>
      </div>

      {/* ══════════════ MOBILE MENU ══════════════ */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="bd"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/15 backdrop-blur-[2px]"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              key="menu"
              dir={isRTL ? 'rtl' : 'ltr'}
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0,  scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 400, damping: 32 }}
              className="fixed inset-x-4 top-[80px] z-50 rounded-2xl bg-white dark:bg-[#0f172a] border border-[#E2E9F5] dark:border-white/10 shadow-[0_16px_48px_rgba(31,75,143,0.14)] overflow-hidden"
            >
              <div className="px-3 py-3 flex flex-col gap-0.5">
                {navKeys.map(({ key, href }, i) => {
                  const active = isActive(href);
                  return (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, x: isRTL ? -12 : 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <Link
                        href={`/${locale}${href}`}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          'flex items-center justify-between px-4 py-3 rounded-xl text-[14px] font-medium transition-all duration-200',
                          active
                            ? 'text-[#1F4B8F] dark:text-white bg-[#EEF3FB] dark:bg-[#1e3a5f]'
                            : 'text-gray-500 dark:text-gray-400 hover:text-[#1F4B8F] dark:hover:text-white hover:bg-[#F5F7FB] dark:hover:bg-white/5'
                        )}
                      >
                        <span>{dict.nav[key]}</span>
                        {active && <span className="w-1.5 h-1.5 rounded-full bg-[#2F6EDB] shrink-0" />}
                      </Link>
                    </motion.div>
                  );
                })}

                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: navKeys.length * 0.04 }}
                  className="mt-1 pt-3 border-t border-[#EBF0FA] dark:border-gray-800"
                >
                  <Link
                    href={`/${locale}/contact`}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center w-full px-4 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#1F4B8F] to-[#2F6EDB] text-white shadow-md shadow-[#2F6EDB]/20"
                  >
                    {dict.nav.getStarted ?? dict.nav.contact}
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

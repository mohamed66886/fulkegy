'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, type Variants } from 'framer-motion';
import { MapPin, Phone, Mail, Send } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FooterProps {
  locale: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dict: any;
}

const quickLinks = [
  { key: 'home', href: '' },
  { key: 'about', href: '/about' },
  { key: 'services', href: '/services' },
  { key: 'projects', href: '/projects' },
  { key: 'contact', href: '/contact' },
];

const socialLinks = [
  { href: 'https://facebook.com', label: 'Facebook', path: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z' },
  { href: 'https://linkedin.com', label: 'LinkedIn', path: 'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z M2 9h4v12H2z M4 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z' },
  { href: 'https://twitter.com', label: 'X (Twitter)', path: 'M4 4l11.733 16H20L8.267 4z M4 20l6.768-6.768 M15.232 10.768L20 4' },
];

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

export default function Footer({ locale, dict }: FooterProps) {
  const [email, setEmail] = useState('');
  const isRTL = locale === 'ar';

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Newsletter subscription logic would go here
    setEmail('');
  };

  return (
    <footer dir={isRTL ? 'rtl' : 'ltr'} className="bg-[#1F4B8F] text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Column 1: Company Info */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            custom={0}
            className="lg:col-span-1"
          >
            <Link href={`/${locale}`} className="inline-block mb-4">
              <div
                className={cn(
                  'text-2xl font-bold tracking-tight',
                  isRTL ? 'font-[Cairo]' : 'font-[Inter]'
                )}
              >
                <span className="text-white">Fulk</span>
                <span className="text-[#E8EEF9] mx-1">|</span>
                <span className="text-white font-[Cairo]">فُلك</span>
              </div>
            </Link>
            <p
              className={cn(
                'text-white/80 text-sm leading-relaxed mb-6',
                isRTL ? 'font-[Cairo]' : 'font-[Inter]'
              )}
            >
              {dict.footer.description}
            </p>

            {/* Social Media Icons */}
            <div className={cn('flex items-center gap-3', isRTL && 'justify-start')}>
              {socialLinks.map(({ href, label, path }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  whileHover={{ scale: 1.15, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    'flex items-center justify-center w-10 h-10 rounded-full',
                    'bg-white/10 hover:bg-[#2F6EDB] transition-colors duration-300'
                  )}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d={path} />
                  </svg>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Column 2: Quick Links */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            custom={1}
          >
            <h3
              className={cn(
                'text-lg font-semibold mb-5',
                isRTL ? 'font-[Cairo]' : 'font-[Inter]'
              )}
            >
              {dict.footer.quick_links}
            </h3>
            <ul className="space-y-3">
              {quickLinks.map(({ key, href }) => (
                <li key={key}>
                  <Link
                    href={`/${locale}${href}`}
                    className={cn(
                      'text-white/80 hover:text-white text-sm transition-colors duration-200',
                      'hover:underline underline-offset-4',
                      isRTL ? 'font-[Cairo]' : 'font-[Inter]'
                    )}
                  >
                    {dict.nav[key]}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 3: Contact Info */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            custom={2}
          >
            <h3
              className={cn(
                'text-lg font-semibold mb-5',
                isRTL ? 'font-[Cairo]' : 'font-[Inter]'
              )}
            >
              {dict.footer.contact_info}
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#E8EEF9] shrink-0 mt-0.5" />
                <span
                  className={cn(
                    'text-white/80 text-sm',
                    isRTL ? 'font-[Cairo]' : 'font-[Inter]'
                  )}
                >
                  {dict.contact.address}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#E8EEF9] shrink-0" />
                <a
                  href={`tel:${dict.contact.phone_number?.replace(/\s/g, '')}`}
                  className={cn(
                    'text-white/80 hover:text-white text-sm transition-colors duration-200',
                    'font-[Inter]'
                  )}
                  dir="ltr"
                >
                  {dict.contact.phone_number}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#E8EEF9] shrink-0" />
                <a
                  href={`mailto:${dict.contact.email_address}`}
                  className={cn(
                    'text-white/80 hover:text-white text-sm transition-colors duration-200',
                    'font-[Inter]'
                  )}
                  dir="ltr"
                >
                  {dict.contact.email_address}
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Column 4: Newsletter */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            custom={3}
          >
            <h3
              className={cn(
                'text-lg font-semibold mb-5',
                isRTL ? 'font-[Cairo]' : 'font-[Inter]'
              )}
            >
              {dict.footer.newsletter_title}
            </h3>
            <p
              className={cn(
                'text-white/80 text-sm mb-4',
                isRTL ? 'font-[Cairo]' : 'font-[Inter]'
              )}
            >
              {dict.footer.newsletter_desc}
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={dict.footer.newsletter_placeholder}
                  required
                  dir={isRTL ? 'rtl' : 'ltr'}
                  className={cn(
                    'w-full px-4 py-2.5 rounded-lg text-sm',
                    'bg-white/10 border border-white/20 text-white placeholder-white/50',
                    'focus:outline-none focus:ring-2 focus:ring-[#2F6EDB] focus:border-transparent',
                    'transition-all duration-200',
                    isRTL ? 'font-[Cairo]' : 'font-[Inter]'
                  )}
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className={cn(
                  'flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium',
                  'bg-[#2F6EDB] hover:bg-[#2F6EDB]/90 text-white',
                  'transition-colors duration-200',
                  isRTL ? 'font-[Cairo]' : 'font-[Inter]'
                )}
              >
                <span>{dict.footer.subscribe}</span>
                <Send className={cn('w-4 h-4', isRTL && 'rotate-180')} />
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p
            className={cn(
              'text-center text-white/60 text-sm',
              isRTL ? 'font-[Cairo]' : 'font-[Inter]'
            )}
          >
            &copy; {new Date().getFullYear()}{' '}
            <span className="font-[Inter]">Fulk</span>
            <span className="mx-1">|</span>
            <span className="font-[Cairo]">فُلك</span>
            . {dict.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}

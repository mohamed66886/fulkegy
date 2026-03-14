'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useForm } from 'react-hook-form';
import {
  MapPin,
  Phone,
  Mail,
  Send,
  CheckCircle,
  AlertCircle,
  Twitter,
  Linkedin,
  Instagram,
  Facebook,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { sendMessage } from '@/services/firebase';

interface ContactPageProps {
  locale: string;
  dict: any;
}

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  company?: string;
  message: string;
}

const socialLinks = [
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Facebook, href: '#', label: 'Facebook' },
];

export function ContactPage({ locale, dict }: ContactPageProps) {
  const isRTL = locale === 'ar';
  const heroRef = useRef(null);
  const formRef = useRef(null);
  const mapRef = useRef(null);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const heroInView = useInView(heroRef, { once: true });
  const formInView = useInView(formRef, { once: true, margin: '-100px' });
  const mapInView = useInView(mapRef, { once: true, margin: '-100px' });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      company: '',
      message: '',
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');
    try {
      await sendMessage({
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.company || '',
        message: data.message,
      });
      setSubmitStatus('success');
      reset();
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' as const },
    },
  };

  return (
    <div className={cn()} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Hero Banner */}
      <section
        ref={heroRef}
        className="relative py-32 md:py-40 bg-gradient-to-br from-[#1F4B8F] via-[#2F6EDB] to-[#1F4B8F] overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        <motion.div
          className="max-w-7xl mx-auto px-4 text-center relative z-10"
          initial={{ opacity: 0, y: 40 }}
          animate={heroInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            {dict.contact.title}
          </h1>
          <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto">
            {dict.contact.subtitle}
          </p>
          <div className="w-24 h-1 bg-white/50 mx-auto rounded-full mt-8" />
        </motion.div>
      </section>

      {/* Contact Form & Info Section */}
      <section ref={formRef} className="py-24 bg-[#F5F7FB]">
        <motion.div
          className="max-w-7xl mx-auto px-4"
          variants={containerVariants}
          initial="hidden"
          animate={formInView ? 'visible' : 'hidden'}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              className="bg-white rounded-2xl p-8 md:p-10 shadow-sm border border-[#E8EEF9]"
              variants={itemVariants}
            >
              <h2 className="text-2xl font-bold text-[#1F4B8F] mb-6">
                {isRTL ? 'أرسل لنا رسالة' : 'Send Us a Message'}
              </h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      {dict.contact.name}
                    </label>
                    <Input
                      {...register('name', { required: true, minLength: 2 })}
                      placeholder={dict.contact.name}
                      className={cn(
                        errors.name && 'border-red-400 focus-visible:ring-red-400'
                      )}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      {dict.contact.email}
                    </label>
                    <Input
                      type="email"
                      {...register('email', {
                        required: true,
                        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      })}
                      placeholder={dict.contact.email}
                      className={cn(
                        errors.email && 'border-red-400 focus-visible:ring-red-400'
                      )}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      {dict.contact.phone}
                    </label>
                    <Input
                      type="tel"
                      {...register('phone', { required: true, minLength: 5 })}
                      placeholder={dict.contact.phone}
                      className={cn(
                        errors.phone && 'border-red-400 focus-visible:ring-red-400'
                      )}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      {dict.contact.company}
                    </label>
                    <Input
                      {...register('company')}
                      placeholder={dict.contact.company}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {dict.contact.message}
                  </label>
                  <Textarea
                    {...register('message', { required: true, minLength: 10 })}
                    placeholder={dict.contact.message}
                    rows={6}
                    className={cn(
                      errors.message && 'border-red-400 focus-visible:ring-red-400'
                    )}
                  />
                </div>

                {/* Submit Status */}
                {submitStatus === 'success' && (
                  <motion.div
                    className="flex items-center gap-2 p-4 rounded-xl bg-green-50 text-green-700 border border-green-200"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <CheckCircle className="w-5 h-5 flex-shrink-0" />
                    <p className="text-sm">{dict.contact.success}</p>
                  </motion.div>
                )}
                {submitStatus === 'error' && (
                  <motion.div
                    className="flex items-center gap-2 p-4 rounded-xl bg-red-50 text-red-700 border border-red-200"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p className="text-sm">{dict.contact.error}</p>
                  </motion.div>
                )}

                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {dict.contact.sending}
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      {dict.contact.send}
                    </>
                  )}
                </Button>
              </form>
            </motion.div>

            {/* Contact Info & Map */}
            <motion.div className="space-y-6" variants={itemVariants}>
              {/* Contact Info Cards */}
              <div className="space-y-4">
                <motion.div
                  className="flex items-center gap-4 bg-white rounded-xl p-5 shadow-sm border border-[#E8EEF9] hover:shadow-md transition-shadow"
                  whileHover={{ x: isRTL ? -4 : 4 }}
                >
                  <div className="w-14 h-14 rounded-xl bg-[#E8EEF9] flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-7 h-7 text-[#1F4B8F]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-0.5">
                      {isRTL ? 'العنوان' : 'Address'}
                    </p>
                    <p className="text-[#1F4B8F] font-medium text-lg">
                      {dict.contact.address}
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  className="flex items-center gap-4 bg-white rounded-xl p-5 shadow-sm border border-[#E8EEF9] hover:shadow-md transition-shadow"
                  whileHover={{ x: isRTL ? -4 : 4 }}
                >
                  <div className="w-14 h-14 rounded-xl bg-[#E8EEF9] flex items-center justify-center flex-shrink-0">
                    <Phone className="w-7 h-7 text-[#1F4B8F]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-0.5">
                      {dict.contact.phone}
                    </p>
                    <p className="text-[#1F4B8F] font-medium text-lg" dir="ltr">
                      {dict.contact.phone_number}
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  className="flex items-center gap-4 bg-white rounded-xl p-5 shadow-sm border border-[#E8EEF9] hover:shadow-md transition-shadow"
                  whileHover={{ x: isRTL ? -4 : 4 }}
                >
                  <div className="w-14 h-14 rounded-xl bg-[#E8EEF9] flex items-center justify-center flex-shrink-0">
                    <Mail className="w-7 h-7 text-[#1F4B8F]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-0.5">
                      {dict.contact.email}
                    </p>
                    <p className="text-[#1F4B8F] font-medium text-lg" dir="ltr">
                      {dict.contact.email_address}
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* Map Placeholder */}
              <motion.div
                ref={mapRef}
                className="bg-gray-200 rounded-2xl overflow-hidden border border-[#E8EEF9] h-64 flex items-center justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={mapInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5 }}
              >
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-[#2F6EDB] mx-auto mb-3" />
                  <p className="text-gray-500 text-sm font-medium">
                    {dict.contact.address}
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    {isRTL ? 'خريطة الموقع' : 'Location Map'}
                  </p>
                </div>
              </motion.div>

              {/* Social Media Links */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E8EEF9]">
                <h3 className="text-lg font-bold text-[#1F4B8F] mb-4">
                  {isRTL ? 'تابعنا على' : 'Follow Us'}
                </h3>
                <div className="flex gap-3">
                  {socialLinks.map((social) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={social.label}
                        href={social.href}
                        aria-label={social.label}
                        className="w-12 h-12 rounded-xl bg-[#E8EEF9] flex items-center justify-center hover:bg-[#1F4B8F] group transition-colors duration-300"
                      >
                        <Icon className="w-5 h-5 text-[#1F4B8F] group-hover:text-white transition-colors duration-300" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

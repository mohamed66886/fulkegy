'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { MapPin, Phone, Mail, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { sendMessage } from '@/services/firebase';

interface ContactSectionProps {
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

export default function ContactSection({ locale, dict }: ContactSectionProps) {
  const isRTL = locale === 'ar';
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    <section
      ref={sectionRef}
      className={cn(
        'py-24 bg-[#F5F7FB]',
        
      )}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#1F4B8F] mb-4">
            {dict.contact.title}
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            {dict.contact.subtitle}
          </p>
          <div className="w-20 h-1 bg-[#2F6EDB] mx-auto rounded-full mt-4" />
        </motion.div>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-12"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {/* Contact Form */}
          <motion.div
            className="bg-white rounded-2xl p-8 shadow-sm border border-[#E8EEF9]"
            variants={itemVariants}
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {dict.contact.name}
                  </label>
                  <Input
                    {...register('name', { required: true, minLength: 2 })}
                    placeholder={dict.contact.name}
                    className={cn(errors.name && 'border-red-400 focus-visible:ring-red-400')}
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
                    className={cn(errors.email && 'border-red-400 focus-visible:ring-red-400')}
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
                    className={cn(errors.phone && 'border-red-400 focus-visible:ring-red-400')}
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
                  rows={5}
                  className={cn(errors.message && 'border-red-400 focus-visible:ring-red-400')}
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

          {/* Contact Info */}
          <motion.div className="space-y-6" variants={itemVariants}>
            {/* Map Placeholder */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#E8EEF9] h-48 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-10 h-10 text-[#2F6EDB] mx-auto mb-2" />
                <p className="text-gray-400 text-sm">{dict.contact.address}</p>
              </div>
            </div>

            {/* Contact Cards */}
            <div className="space-y-4">
              <motion.div
                className="flex items-center gap-4 bg-white rounded-xl p-5 shadow-sm border border-[#E8EEF9] hover:shadow-md transition-shadow"
                whileHover={{ x: isRTL ? -4 : 4 }}
              >
                <div className="w-12 h-12 rounded-xl bg-[#E8EEF9] flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-[#1F4B8F]" />
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-0.5">
                    {isRTL ? 'العنوان' : 'Address'}
                  </p>
                  <p className="text-[#1F4B8F] font-medium">
                    {dict.contact.address}
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="flex items-center gap-4 bg-white rounded-xl p-5 shadow-sm border border-[#E8EEF9] hover:shadow-md transition-shadow"
                whileHover={{ x: isRTL ? -4 : 4 }}
              >
                <div className="w-12 h-12 rounded-xl bg-[#E8EEF9] flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-[#1F4B8F]" />
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-0.5">
                    {dict.contact.phone}
                  </p>
                  <p className="text-[#1F4B8F] font-medium" dir="ltr">
                    {dict.contact.phone_number}
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="flex items-center gap-4 bg-white rounded-xl p-5 shadow-sm border border-[#E8EEF9] hover:shadow-md transition-shadow"
                whileHover={{ x: isRTL ? -4 : 4 }}
              >
                <div className="w-12 h-12 rounded-xl bg-[#E8EEF9] flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-[#1F4B8F]" />
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-0.5">
                    {dict.contact.email}
                  </p>
                  <p className="text-[#1F4B8F] font-medium" dir="ltr">
                    {dict.contact.email_address}
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

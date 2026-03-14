'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Smartphone, Mail, MapPin, Send, CheckCircle, AlertCircle } from 'lucide-react';
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

  const contactsHeading = isRTL ? 'بيانات التواصل' : 'OUR CONTACTS';
  const contactsSub =
    isRTL ? 'يمكنك التواصل معنا من خلال' : 'You can reach us through';
  const facebookUrl =
    'https://www.facebook.com/share/1CRdfyjfTW/?mibextid=wwXIfr';
  const qrCodeSrc = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&color=15-76-151&bgcolor=255-255-255&data=${encodeURIComponent(
    facebookUrl
  )}`;

  return (
    <section
      ref={sectionRef}
      className={cn('py-6 md:py-12 bg-[#EAEAEA] overflow-hidden')}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <motion.div
          className="bg-[#FFFFFF] rounded-[22px] md:rounded-[36px] px-4 sm:px-6 md:px-10 lg:px-12 py-6 sm:py-8 md:py-10"
          initial={{ opacity: 0, y: 18 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: 'easeOut' as const }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-6 sm:gap-8 lg:gap-24 xl:gap-28 items-start">
            <motion.div
              initial={{ opacity: 0, x: isRTL ? 22 : -22 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, ease: 'easeOut' as const }}
            >
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5 md:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
                  <div>
                    <label className="block text-base sm:text-xl font-semibold text-[#005B90] mb-1.5 sm:mb-2">
                      {dict.contact.name}
                      <span className="text-[#ED6E6E]">*</span>
                    </label>
                    <Input
                      {...register('name', { required: true, minLength: 2 })}
                      placeholder="Ex. Muhammed Ahmed"
                      className={cn(
                        'h-12 sm:h-14 rounded-xl sm:rounded-2xl bg-[#E6E6E8] border-transparent text-sm sm:text-base text-[#666] placeholder:text-[#A0A0A0] focus-visible:ring-0 focus-visible:border-[#0F4C97]/40',
                        errors.name && 'border-red-400'
                      )}
                    />
                  </div>

                  <div>
                    <label className="block text-base sm:text-xl font-semibold text-[#005B90] mb-1.5 sm:mb-2">
                      {dict.contact.email}
                      <span className="text-[#ED6E6E]">*</span>
                    </label>
                    <Input
                      type="email"
                      {...register('email', {
                        required: true,
                        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      })}
                      placeholder="example@mail.com"
                      className={cn(
                        'h-12 sm:h-14 rounded-xl sm:rounded-2xl bg-[#E6E6E8] border-transparent text-sm sm:text-base text-[#666] placeholder:text-[#A0A0A0] focus-visible:ring-0 focus-visible:border-[#0F4C97]/40',
                        errors.email && 'border-red-400'
                      )}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
                  <div>
                    <label className="block text-base sm:text-xl font-semibold text-[#005B90] mb-1.5 sm:mb-2">
                      {dict.contact.phone}
                      <span className="text-[#ED6E6E]">*</span>
                    </label>
                    <Input
                      type="tel"
                      {...register('phone', { required: true, minLength: 5 })}
                      placeholder="+20101548796"
                      className={cn(
                        'h-12 sm:h-14 rounded-xl sm:rounded-2xl bg-[#E6E6E8] border-transparent text-sm sm:text-base text-[#666] placeholder:text-[#A0A0A0] focus-visible:ring-0 focus-visible:border-[#0F4C97]/40',
                        errors.phone && 'border-red-400'
                      )}
                    />
                  </div>

                  <div>
                    <label className="block text-base sm:text-xl font-semibold text-[#005B90] mb-1.5 sm:mb-2">
                      {dict.contact.company}
                    </label>
                    <Input
                      {...register('company')}
                      placeholder="Ex. IEEE"
                      className="h-12 sm:h-14 rounded-xl sm:rounded-2xl bg-[#E6E6E8] border-transparent text-sm sm:text-base text-[#666] placeholder:text-[#A0A0A0] focus-visible:ring-0 focus-visible:border-[#0F4C97]/40"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-base sm:text-xl font-semibold text-[#005B90] mb-1.5 sm:mb-2">
                    {dict.contact.message}
                    <span className="text-[#ED6E6E]">*</span>
                  </label>
                  <Textarea
                    {...register('message', { required: true, minLength: 10 })}
                    placeholder="Type here..."
                    rows={6}
                    className={cn(
                      'min-h-[140px] sm:min-h-[170px] md:min-h-[190px] rounded-xl sm:rounded-2xl bg-[#E6E6E8] border-transparent text-sm sm:text-base text-[#666] placeholder:text-[#A0A0A0] focus-visible:ring-0 focus-visible:border-[#0F4C97]/40',
                      errors.message && 'border-red-400'
                    )}
                  />
                </div>

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
                  className="w-full h-12 sm:h-14 md:h-16 rounded-xl sm:rounded-2xl bg-[#045C8A] hover:bg-[#04547E] text-white text-base sm:text-lg md:text-xl font-bold tracking-wide"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {dict.contact.sending}
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      {isRTL ? 'إرسال' : 'SEND'}
                    </>
                  )}
                </Button>
              </form>
            </motion.div>

            <motion.div
              className="pt-4 lg:pt-4 border-t border-[#E6E6E6] lg:border-t-0"
              initial={{ opacity: 0, x: isRTL ? -22 : 22 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' as const }}
            >
              <h3
                className={cn(
                  'text-2xl sm:text-4xl font-bold text-[#0F4C97] mb-1',
                  isRTL ? 'text-right' : 'text-center lg:text-left'
                )}
              >
                {contactsHeading}
              </h3>
              <p
                className={cn(
                  'text-[#7A9AC4] text-sm sm:text-lg mb-5 sm:mb-6',
                  isRTL ? 'text-right' : 'text-center lg:text-left'
                )}
              >
                {contactsSub}
              </p>

              <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-7">
                <div className="flex items-center gap-3 text-[#A3A3A3]">
                  <MapPin className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span className="text-sm sm:text-lg">
                    {dict.contact.address}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-[#A3A3A3]">
                  <Smartphone className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span className="text-sm sm:text-lg" dir="ltr">
                    {dict.contact.phone_number}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-[#A3A3A3]">
                  <Mail className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span className="text-sm sm:text-lg uppercase break-all" dir="ltr">
                    {dict.contact.email_address}
                  </span>
                </div>
              </div>

              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block mx-auto lg:mx-0 w-[165px] h-[165px] sm:w-[225px] sm:h-[225px] rounded-[20px] sm:rounded-[24px] bg-transparent p-0"
                aria-label="Facebook QR code"
              >
                <Image
                  src={qrCodeSrc}
                  alt="Facebook QR code"
                  width={280}
                  height={280}
                  unoptimized
                  className="w-full h-full rounded-[16px] sm:rounded-[20px]"
                />
              </a>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

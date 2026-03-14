'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { cn } from '@/lib/utils';

interface WhyUsSectionProps {
  locale: string;
  dict: any;
}

const WHY_US_LOTTIE_SRC =
  'https://lottie.host/16b69e12-0efb-4061-b33d-12dc2b93fd84/Ax2k12jKRd.lottie';

export default function WhyUsSection({ locale, dict }: WhyUsSectionProps) {
  const isRTL = locale === 'ar';
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const heading =
    dict?.whyus?.heading ??
    (isRTL ? 'لماذا تختار شركة فُلك؟' : 'Why Choose Fulk Company?');
  const description =
    dict?.whyus?.description ??
    (isRTL
      ? 'فُلك شريكك التقني في رحلة التحول الرقمي. نقدم حلولًا برمجية متكاملة ومخصصة تساعد شركتك على النمو، رفع الكفاءة، وتسريع إنجاز الأعمال عبر فريق احترافي وخبرة عملية في تنفيذ المشاريع.'
      : 'Fulk is your technology partner in digital transformation. We deliver integrated, tailored software solutions that help your business grow, improve efficiency, and accelerate execution through an expert team and hands-on project experience.');
  const seasonTitle =
    dict?.whyus?.season_title ?? (isRTL ? 'هدفنا معك' : 'Our Commitment');
  const seasonDescription =
    dict?.whyus?.season_description ??
    (isRTL
      ? 'نهدف إلى بناء حلول تقنية موثوقة تواكب احتياجاتك الحقيقية، مع دعم مستمر وجودة عالية تضمن نتائج ملموسة وتأثيرًا طويل المدى على أعمالك.'
      : 'We are committed to building reliable technology solutions aligned with your real business needs, backed by ongoing support and high quality to deliver measurable, long-term impact.');

  return (
    <section
      ref={sectionRef}
      className={cn(
        'py-10 md:py-16 bg-[#EAEAEA] overflow-hidden'
      )}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="bg-white rounded-[28px] md:rounded-[36px] px-6 md:px-12 lg:px-16 py-10 md:py-14 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            <motion.div
              className="flex justify-center lg:justify-start"
              initial={{ opacity: 0, x: isRTL ? 40 : -40 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.65, ease: 'easeOut' as const }}
            >
              <div className="w-[280px] sm:w-[350px] md:w-[410px] lg:w-[460px]">
                <DotLottieReact
                  src={WHY_US_LOTTIE_SRC}
                  loop
                  autoplay
                  className="w-full h-auto"
                />
              </div>
            </motion.div>

            <motion.div
              className="max-w-2xl"
              initial={{ opacity: 0, x: isRTL ? -40 : 40 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.65, delay: 0.1, ease: 'easeOut' as const }}
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#0F4C97] leading-[1.15] mb-5 md:mb-6">
                {heading}
              </h2>

              <p className="text-[#8A8A8A] text-base sm:text-lg md:text-[1.12rem] leading-[1.6] mb-8 md:mb-10">
                {description}
              </p>

              <h3 className="text-2xl sm:text-3xl md:text-[2.15rem] font-bold text-[#5B5B5B] mb-3 md:mb-4">
                {seasonTitle}
              </h3>

              <p className="text-[#8A8A8A] text-base sm:text-lg md:text-[1.12rem] leading-[1.6]">
                {seasonDescription}
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

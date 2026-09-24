import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Image as ImageIcon, Instagram, Users, Award, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { COHORT_INFO, HOME_CAROUSEL_SLIDES } from '../data/dummyData';
import { useDataStore } from '../context/DataContext';
import { VisitorInfo } from '../types';
import { AnimatedCounter } from './AnimatedCounter';

interface HomeSectionProps {
  visitor: VisitorInfo | null;
}

export const HomeSection: React.FC<HomeSectionProps> = ({ visitor }) => {
  const { moments } = useDataStore();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [hasStatsInView, setHasStatsInView] = useState(false);
  const [showCaption, setShowCaption] = useState(false);

  // Reactive admin-driven slides: moments from DB if available, fallback to static
  const carouselSlides = moments.length > 0
    ? moments.map((moment) => ({
        id: moment.id,
        image: moment.image,
        title: moment.title,
        quote: moment.story,
        date: moment.date,
      }))
    : HOME_CAROUSEL_SLIDES;

  const totalSlides = carouselSlides.length;

  // Safety: if admin deletes moments and index becomes out of range
  useEffect(() => {
    if (currentSlide >= totalSlides) {
      setCurrentSlide(0);
    }
  }, [totalSlides, currentSlide]);

  // Synchronized lifecycle: 0ms enter, 5300ms exit, 6000ms next
  useEffect(() => {
    if (totalSlides === 0) return;
    setShowCaption(true);
    const exitTimer = setTimeout(() => { setShowCaption(false); }, 5300);
    const slideTimer = setTimeout(() => { setCurrentSlide((prev) => (prev + 1) % totalSlides); }, 6000);
    return () => { clearTimeout(exitTimer); clearTimeout(slideTimer); };
  }, [currentSlide, totalSlides]);

  const handlePrev = () => { setShowCaption(false); setTimeout(() => setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides), 150); };
  const handleNext = () => { setShowCaption(false); setTimeout(() => setCurrentSlide((prev) => (prev + 1) % totalSlides), 150); };
  const handleDotClick = (idx: number) => { if (idx === currentSlide) return; setShowCaption(false); setTimeout(() => setCurrentSlide(idx), 150); };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const navOffset = 70;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  const activeSlide = carouselSlides[currentSlide];

  if (totalSlides === 0) return null;

  return (
    <section id="home" className="pt-0 pb-10 sm:pb-12 w-full">
      {/* Hero Carousel - Edge-to-Edge (admin database driven) */}
      <div className="w-full relative overflow-hidden border-b border-[#4B4038] bg-[#202940] mb-6 sm:mb-8">
        <div className="relative h-[320px] sm:h-[400px] md:h-[480px] lg:h-[540px] w-full overflow-hidden">
          {carouselSlides.map((slide, idx) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}
            >
              <motion.img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover object-center"
                initial={{ scale: 1 }}
                animate={idx === currentSlide ? { scale: 1.08 } : { scale: 1 }}
                transition={idx === currentSlide ? { duration: 6, ease: [0.16, 1, 0.3, 1] } : { duration: 0.7 }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#202940]/70 via-transparent to-[#202940]/90" />
            </div>
          ))}

          {/* Caption Overlay - reactive from admin database (moment.title / moment.story) */}
          <div className="absolute inset-0 z-20 flex flex-col justify-end pointer-events-none">
            <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-5 sm:pb-8 md:pb-10">
              <div className="max-w-3xl pointer-events-auto">
                <div className="border-l-2 border-[#CAAA98] pl-3 overflow-hidden">
                  <AnimatePresence mode="wait">
                    {showCaption && activeSlide && (
                      <motion.div
                        key={`carousel-caption-${activeSlide.id}-${currentSlide}`}
                        initial={{ x: '-105%' }}
                        animate={{ x: '0%' }}
                        exit={{ x: '-105%' }}
                        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight leading-snug mb-2 drop-shadow-md">
                          {activeSlide.title}
                        </h2>
                        <blockquote className="text-xs sm:text-sm md:text-base text-[#CAAA98] italic font-light leading-relaxed line-clamp-2 sm:line-clamp-none drop-shadow-sm">
                          &ldquo;{activeSlide.quote}&rdquo;
                        </blockquote>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>

          <button type="button" onClick={handlePrev} id="btn-carousel-prev" aria-label="Previous slide" className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-2.5 rounded-full bg-[#202940]/80 hover:bg-[#4B4038] text-[#CAAA98] border border-[#4B4038] backdrop-blur-sm transition-transform active:scale-95 cursor-pointer"><ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" /></button>
          <button type="button" onClick={handleNext} id="btn-carousel-next" aria-label="Next slide" className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-2.5 rounded-full bg-[#202940]/80 hover:bg-[#4B4038] text-[#CAAA98] border border-[#4B4038] backdrop-blur-sm transition-transform active:scale-95 cursor-pointer"><ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" /></button>
          <div className="absolute bottom-3 right-4 sm:right-8 z-30 flex items-center gap-1.5">
            {carouselSlides.map((_, idx) => (
              <button key={idx} type="button" onClick={() => handleDotClick(idx)} aria-label={`Go to slide ${idx + 1}`} className={`h-1.5 rounded-full transition-all cursor-pointer ${idx === currentSlide ? 'w-6 bg-[#CAAA98]' : 'w-1.5 bg-[#9A8678]/50 hover:bg-[#9A8678]'}`} />
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-2">
        <div className="bg-transparent border-0 shadow-none p-0 py-2 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 sm:gap-10 items-center">
            <motion.div className="lg:col-span-8 space-y-4" initial={{ opacity: 0, x: 100 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#9A8678]">
                <span>Profil Angkatan Resmi</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#CAAA98]"></span>
                <span className="text-[#CAAA98]">{COHORT_INFO.batch}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#CAAA98] tracking-tight">{COHORT_INFO.name}</h1>
              <p className="text-sm sm:text-base text-[#9A8678] leading-relaxed">
                Selamat datang di portal kenangan resmi Angkatan Khalid Bin Walid. Tiga tahun perjalanan sejak 2021 hingga kelulusan 2024 kami rangkum dalam satu ruang digital abadi. Temukan potret tawa, cerita suka duka, biodata lengkap rekan seperjuangan, serta dokumentasi kelulusan yang menjadi saksi kebersamaan kita.
              </p>
              <div className="py-2.5 pl-4 border-l-2 border-[#CAAA98] bg-transparent text-xs sm:text-sm text-[#CAAA98] italic font-light leading-relaxed">&ldquo;{COHORT_INFO.quote}&rdquo;</div>
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button type="button" id="btn-home-album" onClick={() => scrollToSection('moments')} className="px-5 py-2.5 bg-[#CAAA98] hover:bg-[#CAAA98]/90 text-[#202940] text-sm font-bold rounded-xl shadow-md transition-all flex items-center gap-2 active:scale-95 cursor-pointer">
                  <ImageIcon className="w-4 h-4" />
                  <span>Buka Album Momen</span>
                </button>
                <a href="https://www.instagram.com/sixkhalidbinwalid" target="_blank" rel="noopener noreferrer" id="btn-home-instagram" className="px-5 py-2.5 bg-[#4B4038]/60 hover:bg-[#4B4038] text-[#CAAA98] text-sm font-semibold border border-[#9A8678]/40 rounded-xl transition-all flex items-center gap-2 hover:border-[#CAAA98] cursor-pointer">
                  <Instagram className="w-4 h-4" />
                  <span>{COHORT_INFO.instagram}</span>
                </a>
              </div>
            </motion.div>

            <div className="lg:col-span-4 flex flex-col divide-y divide-[#4B4038]/50">
              <div className="py-3.5 px-0 flex items-center gap-3.5 bg-transparent">
                <div className="w-10 h-10 rounded-xl bg-[#4B4038]/30 border border-[#CAAA98]/25 flex items-center justify-center text-[#CAAA98] shrink-0"><Users className="w-5 h-5" /></div>
                <div>
                  <span className="block text-[11px] text-[#9A8678] font-semibold uppercase tracking-wider">Total Angkatan</span>
                  <motion.div className="text-base sm:text-lg font-bold text-[#CAAA98]" initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} onViewportEnter={() => setHasStatsInView(true)} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
                    <AnimatedCounter value={COHORT_INFO.totalStudents} isActive={hasStatsInView} suffix=" Siswa & Siswi" />
                  </motion.div>
                </div>
              </div>
              <div className="py-3.5 px-0 flex items-center gap-3.5 bg-transparent">
                <div className="w-10 h-10 rounded-xl bg-[#4B4038]/30 border border-[#CAAA98]/25 flex items-center justify-center text-[#CAAA98] shrink-0"><Calendar className="w-5 h-5" /></div>
                <div>
                  <span className="block text-[11px] text-[#9A8678] font-semibold uppercase tracking-wider">Tahun Pendidikan</span>
                  <motion.div className="text-base sm:text-lg font-bold text-[#CAAA98]" initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}>{COHORT_INFO.academicYear}</motion.div>
                </div>
              </div>
              <div className="py-3.5 px-0 flex items-center gap-3.5 bg-transparent">
                <div className="w-10 h-10 rounded-xl bg-[#4B4038]/30 border border-[#CAAA98]/25 flex items-center justify-center text-[#CAAA98] shrink-0"><Award className="w-5 h-5" /></div>
                <div>
                  <span className="block text-[11px] text-[#9A8678] font-semibold uppercase tracking-wider">Status Kelulusan</span>
                  <motion.div className="text-base sm:text-lg font-bold text-[#CAAA98]" initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} onViewportEnter={() => setHasStatsInView(true)} transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}>
                    <AnimatedCounter value={100} isActive={hasStatsInView} suffix="% Lulus Paripurna" />
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

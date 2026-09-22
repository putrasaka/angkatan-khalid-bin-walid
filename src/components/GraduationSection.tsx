import React, { useState, useRef, useEffect } from 'react';
import { useDataStore } from '../context/DataContext';
import { PhotoLightboxModal } from './PhotoLightboxModal';
import { motion } from 'motion/react';
import { MapPin, Calendar, Users, Award, Search, CheckCircle2, Maximize2 } from 'lucide-react';

export const GraduationSection: React.FC = () => {
  const { graduationData } = useDataStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [lightboxPhoto, setLightboxPhoto] = useState<{ image: string; title: string; caption?: string } | null>(null);
  const [isGalleryPaused, setIsGalleryPaused] = useState(false);
  const galleryScrollRef = useRef<HTMLDivElement>(null);
  const galleryPauseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const filteredGraduates = graduationData.graduates.filter((name) => name.toLowerCase().includes(searchTerm.toLowerCase()));

  useEffect(() => {
    const container = galleryScrollRef.current;
    if (!container) return;
    let animId: number;
    let lastTime: number | null = null;
    const speed = 0.7;
    const step = (time: number) => {
      if (!isGalleryPaused && container) {
        if (lastTime !== null) {
          const delta = Math.min((time - lastTime) / 16.67, 2);
          container.scrollLeft += speed * delta;
          const halfWidth = container.scrollWidth / 2;
          if (halfWidth > 0 && container.scrollLeft >= halfWidth) container.scrollLeft -= halfWidth;
        }
        lastTime = time;
      } else lastTime = null;
      animId = requestAnimationFrame(step);
    };
    animId = requestAnimationFrame(step);
    return () => { cancelAnimationFrame(animId); if (galleryPauseTimeoutRef.current) clearTimeout(galleryPauseTimeoutRef.current); };
  }, [isGalleryPaused]);

  const handleGalleryTouchStart = () => { setIsGalleryPaused(true); if (galleryPauseTimeoutRef.current) clearTimeout(galleryPauseTimeoutRef.current); };
  const handleGalleryTouchEnd = () => { if (galleryPauseTimeoutRef.current) clearTimeout(galleryPauseTimeoutRef.current); galleryPauseTimeoutRef.current = setTimeout(() => setIsGalleryPaused(false), 2000); };
  const displayGallery = graduationData.gallery.length > 0 ? [...graduationData.gallery, ...graduationData.gallery] : [];

  return (
    <section id="graduation" className="py-10 sm:py-12 w-full">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8 px-4 sm:px-6 lg:px-8">
        <motion.h2 className="text-2xl sm:text-3xl font-extrabold text-[#CAAA98] tracking-tight" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>Wisuda & Pelepasan Angkatan</motion.h2>
        <motion.p className="mt-1.5 text-xs sm:text-sm text-[#9A8678]" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}>Hari penuh haru, bangga, dan syukur saat kita resmi mengakhiri masa putih biru bersama seluruh dewan guru dan keluarga.</motion.p>
      </div>

      {/* 1. Banner */}
      <div className="w-full relative overflow-hidden border-y border-[#4B4038] shadow-xl bg-[#202940] mb-8 sm:mb-10 group">
        <div className="relative h-64 sm:h-80 md:h-96 lg:h-[440px] xl:h-[480px] w-full">
          <img src={graduationData.mainBanner} alt="Wisuda Angkatan Khalid Bin Walid" className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#202940] via-[#202940]/50 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-8 md:p-10 max-w-7xl mx-auto">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[#CAAA98] mb-1">{graduationData.cohortName}</span>
            <motion.h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-white tracking-tight mb-1.5" initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}>{graduationData.title}</motion.h3>
            <motion.p className="text-xs sm:text-sm md:text-base text-[#9A8678] max-w-3xl line-clamp-2" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.85, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}>{graduationData.description}</motion.p>
          </div>
          <button type="button" onClick={() => setLightboxPhoto({ image: graduationData.mainBanner, title: graduationData.title, caption: graduationData.description })} className="absolute top-4 right-4 p-2.5 rounded-xl bg-[#202940]/80 border border-[#4B4038] text-[#CAAA98] hover:text-white transition-colors cursor-pointer backdrop-blur-sm" aria-label="Perbesar foto utama wisuda"><Maximize2 className="w-4 h-4" /></button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 2. Info Cards - slide from left staggered */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mb-6 sm:mb-8">
          <motion.div className="p-4 rounded-xl bg-[#202940] border border-[#4B4038] flex items-start gap-3.5" initial={{ opacity: 0, x: -36 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}>
            <div className="p-2.5 rounded-lg bg-[#4B4038] text-[#CAAA98] shrink-0"><MapPin className="w-4 h-4" /></div>
            <div><span className="block text-[11px] uppercase tracking-wider font-semibold text-[#9A8678] mb-0.5">Lokasi Acara</span><h4 className="text-xs sm:text-sm font-bold text-[#CAAA98] leading-snug">{graduationData.location}</h4></div>
          </motion.div>
          <motion.div className="p-4 rounded-xl bg-[#202940] border border-[#4B4038] flex items-start gap-3.5" initial={{ opacity: 0, x: -36 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.95, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}>
            <div className="p-2.5 rounded-lg bg-[#4B4038] text-[#CAAA98] shrink-0"><Calendar className="w-4 h-4" /></div>
            <div><span className="block text-[11px] uppercase tracking-wider font-semibold text-[#9A8678] mb-0.5">Waktu & Tanggal</span><h4 className="text-xs sm:text-sm font-bold text-[#CAAA98] leading-snug">{graduationData.date}</h4></div>
          </motion.div>
          <motion.div className="p-4 rounded-xl bg-[#202940] border border-[#4B4038] flex items-start gap-3.5" initial={{ opacity: 0, x: -36 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.95, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}>
            <div className="p-2.5 rounded-lg bg-[#4B4038] text-[#CAAA98] shrink-0"><Users className="w-4 h-4" /></div>
            <div><span className="block text-[11px] uppercase tracking-wider font-semibold text-[#9A8678] mb-0.5">Jumlah Wisudawan</span><h4 className="text-xs sm:text-sm font-bold text-[#CAAA98] leading-snug">{graduationData.graduates.length} Siswa Terdaftar</h4></div>
          </motion.div>
        </div>

        {/* 3. Graduates Grid - staggered wave + hover lift */}
        <div className="bg-[#202940] border border-[#4B4038] rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-xl mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#4B4038]">
            <div><h3 className="text-lg sm:text-xl font-bold text-[#CAAA98]">Daftar Nama Peserta Wisuda</h3><p className="text-xs text-[#9A8678] mt-0.5">Seluruh siswa-siswi yang telah menyelesaikan pembelajaran di jenjang SMP</p></div>
            <div className="relative w-full sm:w-72"><Search className="w-4 h-4 text-[#9A8678] absolute left-3.5 top-1/2 -translate-y-1/2" /><input type="text" id="input-search-graduates" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Cari nama wisudawan..." className="w-full pl-10 pr-4 py-2 bg-[#202940] border border-[#4B4038] focus:border-[#CAAA98] rounded-xl text-xs text-[#CAAA98] placeholder-[#9A8678] outline-none" /></div>
          </div>
          <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredGraduates.length > 0 ? (
              filteredGraduates.map((name, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-[#4B4038]/30 border border-[#4B4038] hover:border-[#CAAA98]/70 hover:bg-[#4B4038]/50 transition-colors shadow-sm cursor-pointer group"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.45, delay: Math.min(index * 0.04, 1.2), ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ y: -5, transition: { duration: 0.2, ease: 'easeOut' } }}
                >
                  <div className="w-6 h-6 rounded-full bg-[#CAAA98] text-[#202940] text-xs font-bold flex items-center justify-center shrink-0">{index + 1}</div>
                  <span className="text-xs sm:text-sm font-semibold text-[#CAAA98] truncate">{name}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#CAAA98] ml-auto shrink-0 opacity-60" />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-8 text-center text-xs text-[#9A8678]">Tidak ada wisudawan dengan nama &ldquo;{searchTerm}&rdquo;</div>
            )}
          </div>
        </div>

        {/* 4. Gallery */}
        <div>
          <div className="mb-5"><h3 className="text-xl sm:text-2xl font-bold text-[#CAAA98]">Galeri Dokumentasi Wisuda</h3><p className="text-xs sm:text-sm text-[#9A8678]">Sorotan kamera menangkap senyum bangga dan kebahagiaan di hari kelulusan</p></div>
          <div ref={galleryScrollRef} onMouseEnter={() => setIsGalleryPaused(true)} onMouseLeave={() => setIsGalleryPaused(false)} onTouchStart={handleGalleryTouchStart} onTouchEnd={handleGalleryTouchEnd} className="flex items-stretch gap-4 sm:gap-5 overflow-x-auto pb-4 pt-1 select-none no-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {displayGallery.map((item, idx) => (
              <div key={`${item.id}-${idx}`} onClick={() => setLightboxPhoto({ image: item.image, title: 'Dokumentasi Wisuda', caption: item.caption })} className="group flex-none w-64 sm:w-72 md:w-80 bg-[#202940] border border-[#4B4038] hover:border-[#CAAA98] rounded-2xl overflow-hidden shadow-md cursor-pointer transition-all duration-300 hover:-translate-y-1 flex flex-col">
                <div className="relative h-44 sm:h-48 w-full overflow-hidden"><img src={item.image} alt={item.caption} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /><div className="absolute inset-0 bg-gradient-to-t from-[#202940] via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity" /><div className="absolute top-2.5 right-2.5 p-1 rounded-lg bg-[#202940]/80 text-[#CAAA98] opacity-0 group-hover:opacity-100 transition-opacity"><Maximize2 className="w-3.5 h-3.5" /></div></div>
                <div className="p-3.5 flex-1 flex items-center"><p className="text-xs font-semibold text-[#CAAA98] group-hover:text-white transition-colors line-clamp-2">{item.caption}</p></div>
              </div>
            ))}
          </div>
        </div>
        {lightboxPhoto && <PhotoLightboxModal image={lightboxPhoto.image} title={lightboxPhoto.title} caption={lightboxPhoto.caption} onClose={() => setLightboxPhoto(null)} />}
      </div>
    </section>
  );
};

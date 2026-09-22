import React, { useState } from 'react';
import { useDataStore } from '../context/DataContext';
import { PhotoLightboxModal } from './PhotoLightboxModal';
import { motion } from 'motion/react';
import { Calendar } from 'lucide-react';

export const MomentsSection: React.FC = () => {
  const { moments } = useDataStore();
  const [selectedPhoto, setSelectedPhoto] = useState<{ image: string; title: string; caption?: string } | null>(null);

  return (
    <section id="moments" className="py-10 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl 2xl:max-w-[1680px] mx-auto transition-all">
      <div className="text-center max-w-3xl mx-auto mb-8">
        <motion.h2 className="text-2xl sm:text-3xl font-extrabold text-[#CAAA98] tracking-tight" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>Rekam Jejak Tiga Tahun Bersama</motion.h2>
        <motion.p className="mt-1.5 text-xs sm:text-sm text-[#9A8678]" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}>Setiap sudut kelas, lapangan, dan perjalanan adalah saksi tawa dan persahabatan yang tak ternilai harganya.</motion.p>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg sm:text-xl font-bold text-[#CAAA98]">Cerita & Narasi Momen Spesial</h3>
          <span className="text-xs text-[#9A8678] font-medium">{moments.length} Dokumentasi Terpilih</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 sm:gap-7 lg:gap-8">
          {moments.map((moment) => (
            <article key={moment.id} id={`moment-card-${moment.id}`} className="bg-transparent border-0 shadow-none flex flex-col group transition-all duration-300">
              <div className="relative h-48 sm:h-52 md:h-56 lg:h-60 2xl:h-64 w-full rounded-2xl overflow-hidden cursor-pointer border border-[#4B4038]/60 group-hover:border-[#CAAA98]/60 transition-colors" onClick={() => setSelectedPhoto({ image: moment.image, title: moment.title, caption: moment.story })}>
                <img src={moment.image} alt={moment.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#202940]/70 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />
              </div>
              <div className="pt-4 pb-1 px-0 bg-transparent flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-2 text-[11px] font-medium text-[#9A8678]"><Calendar className="w-3 h-3" /><span>{moment.date}</span></div>
                <h4 className="text-base sm:text-lg font-bold text-[#CAAA98] group-hover:text-white transition-colors mb-2 leading-snug">{moment.title}</h4>
                <p className="text-xs sm:text-sm text-[#9A8678] leading-relaxed line-clamp-3">{moment.story}</p>
              </div>
            </article>
          ))}
        </div>
      </div>

      {selectedPhoto && <PhotoLightboxModal image={selectedPhoto.image} title={selectedPhoto.title} caption={selectedPhoto.caption} onClose={() => setSelectedPhoto(null)} />}
    </section>
  );
};

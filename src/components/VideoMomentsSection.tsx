import React, { useRef, useEffect, useState } from 'react';
import { useDataStore } from '../context/DataContext';
import { motion } from 'motion/react';
import { Clock, Calendar } from 'lucide-react';

export const VideoMomentsSection: React.FC = () => {
  const { videoMoments } = useDataStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || isHovered) return;
    let animationFrameId: number;
    const scrollSpeed = 0.8;
    const step = () => {
      if (container) {
        if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 1) container.scrollLeft = 0;
        else container.scrollLeft += scrollSpeed;
      }
      animationFrameId = requestAnimationFrame(step);
    };
    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isHovered, videoMoments.length]);

  return (
    <section id="video-moments" className="py-10 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8">
        <motion.h2 className="text-2xl sm:text-3xl font-extrabold text-[#CAAA98] tracking-tight" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>Video Momen & Vlog Angkatan</motion.h2>
        <motion.p className="mt-1 text-xs sm:text-sm text-[#9A8678]" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}>Saksikan kembali rekaman bergerak suara tawa, obrolan santai, dan kemeriahan panggung kelulusan kita.</motion.p>
      </div>

      <div ref={containerRef} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} className="flex items-stretch gap-4 sm:gap-5 overflow-x-auto pb-4 pt-1 select-none no-scrollbar cursor-grab active:cursor-grabbing" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {videoMoments.map((item, idx) => (
          <div key={item.id} id={`video-card-${item.id}`} className="group flex-none w-[280px] sm:w-[330px] md:w-[360px] bg-[#202940] border border-[#4B4038] hover:border-[#CAAA98] rounded-2xl overflow-hidden shadow-lg transition-all duration-300 flex flex-col snap-start">
            <div className="relative w-full aspect-video bg-black/60 overflow-hidden">
              <video controls preload="metadata" poster={item.posterUrl} className="w-full h-full object-cover"><source src={item.videoUrl} type="video/mp4" />Browser Anda tidak mendukung tag video HTML5.</video>
              <div className="absolute top-2.5 left-2.5 pointer-events-none flex items-center gap-1.5"><span className="px-2 py-0.5 rounded-md bg-[#202940]/90 border border-[#4B4038] text-[10px] font-bold text-[#CAAA98] backdrop-blur-sm">Video #{idx + 1}</span><span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#202940]/90 text-[10px] font-medium text-[#9A8678] backdrop-blur-sm"><Clock className="w-2.5 h-2.5 text-[#CAAA98]" /><span>{item.duration}</span></span></div>
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div className="space-y-1.5"><div className="flex items-center gap-1.5 text-xs text-[#9A8678]"><Calendar className="w-3 h-3 text-[#CAAA98]" /><span>{item.date}</span></div><h3 className="text-sm sm:text-base font-bold text-[#CAAA98] group-hover:text-white transition-colors leading-snug">{item.title}</h3><p className="text-xs text-[#9A8678] leading-relaxed line-clamp-2">{item.description}</p></div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

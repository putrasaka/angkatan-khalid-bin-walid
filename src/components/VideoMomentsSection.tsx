import React, { useRef, useEffect, useState } from 'react';
import { useDataStore } from '../context/DataContext';
import { AnimatePresence, motion } from 'motion/react';
import { Clock, Calendar, Play } from 'lucide-react';
import { VideoPlayerModal } from './VideoPlayerModal';
import type { VideoMoment } from '../types';

export const VideoMomentsSection: React.FC = () => {
  const { videoMoments, isInitialLoading } = useDataStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<VideoMoment | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || isHovered || selectedVideo) return;
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
  }, [isHovered, selectedVideo, videoMoments.length]);

  return (
    <section id="video-moments" className="py-10 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8">
        <motion.h2 className="text-2xl sm:text-3xl font-extrabold text-[#CAAA98] tracking-tight" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>Video Momen & Vlog Angkatan</motion.h2>
        <motion.p className="mt-1 text-xs sm:text-sm text-[#9A8678]" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}>Saksikan kembali rekaman bergerak suara tawa, obrolan santai, dan kemeriahan panggung kelulusan kita.</motion.p>
      </div>

      {isInitialLoading ? (
        <div className="flex items-stretch gap-4 sm:gap-5 overflow-x-auto pb-4 pt-1">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex-none w-[280px] sm:w-[330px] md:w-[360px] bg-[#202940] border border-[#4B4038] rounded-2xl overflow-hidden flex flex-col snap-start">
              <div className="w-full aspect-video bg-[#4B4038]/20 animate-pulse" />
              <div className="p-4 space-y-2">
                <div className="h-3 w-16 bg-[#4B4038]/20 rounded animate-pulse" />
                <div className="h-4 w-3/4 bg-[#4B4038]/20 rounded animate-pulse" />
                <div className="h-3 w-full bg-[#4B4038]/20 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div ref={containerRef} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} className="flex items-stretch gap-4 sm:gap-5 overflow-x-auto pb-4 pt-1 select-none no-scrollbar cursor-grab active:cursor-grabbing" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {videoMoments.map((item, idx) => (
            <button key={item.id} id={`video-card-${item.id}`} onClick={() => setSelectedVideo(item)} aria-label={`Putar video: ${item.title}`} className="group flex-none w-[280px] sm:w-[330px] md:w-[360px] text-left bg-[#202940] border border-[#4B4038] hover:border-[#CAAA98] rounded-2xl overflow-hidden shadow-lg transition-all duration-300 flex flex-col snap-start focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#CAAA98]">
              <div className="relative w-full aspect-video bg-black/60 overflow-hidden">
                {item.posterUrl ? <img src={item.posterUrl} alt={item.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" /> : null}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent transition-opacity duration-300 group-hover:from-black/60" />
                <div className="absolute inset-0 grid place-items-center">
                  <span className="grid place-items-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#202940]/70 border border-[#CAAA98]/60 backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-[#CAAA98]">
                    <Play className="w-6 h-6 sm:w-7 sm:h-7 translate-x-0.5 text-[#CAAA98] group-hover:text-[#202940] fill-current" />
                  </span>
                </div>
                <div className="absolute top-2.5 left-2.5 pointer-events-none flex items-center gap-1.5"><span className="px-2 py-0.5 rounded-md bg-[#202940]/90 border border-[#4B4038] text-[10px] font-bold text-[#CAAA98] backdrop-blur-sm">Video #{idx + 1}</span><span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#202940]/90 text-[10px] font-medium text-[#9A8678] backdrop-blur-sm"><Clock className="w-2.5 h-2.5 text-[#CAAA98]" /><span>{item.duration}</span></span></div>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div className="space-y-1.5"><div className="flex items-center gap-1.5 text-xs text-[#9A8678]"><Calendar className="w-3 h-3 text-[#CAAA98]" /><span>{item.date}</span></div><h3 className="text-sm sm:text-base font-bold text-[#CAAA98] group-hover:text-white transition-colors leading-snug">{item.title}</h3><p className="text-xs text-[#9A8678] leading-relaxed line-clamp-2">{item.description}</p></div>
              </div>
            </button>
          ))}
        </div>
      )}

      <AnimatePresence>
        {selectedVideo && <VideoPlayerModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />}
      </AnimatePresence>
    </section>
  );
};

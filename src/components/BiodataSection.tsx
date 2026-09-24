import React, { useState, useRef, useEffect } from 'react';
import { useDataStore } from '../context/DataContext';
import { Student } from '../types';
import { StudentDetailModal } from './StudentDetailModal';
import { motion } from 'motion/react';

export const BiodataSection: React.FC = () => {
  const { students } = useDataStore();
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const isPausedRef = useRef(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => { isPausedRef.current = isPaused; }, [isPaused]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    let animId: number;
    let lastTime: number | null = null;
    const speed = 1.5; // ponytail: tweak speed here if needed
    const step = (time: number) => {
      if (!isPausedRef.current && container) {
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
    return () => cancelAnimationFrame(animId);
  }, []);

  const setPaused = (v: boolean) => { if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current); isPausedRef.current = v; setIsPaused(v); };
  const handleTouchStart = () => setPaused(true);
  const handleTouchEnd = () => { if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current); pauseTimeoutRef.current = setTimeout(() => setPaused(false), 2000); };
  const displayStudents = students.length > 0 ? [...students, ...students] : [];

  return (
    <section id="biodata" className="py-10 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <motion.h2 className="text-2xl sm:text-3xl font-extrabold text-[#CAAA98] tracking-tight" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>Biodata Rekan Angkatan</motion.h2>
        <motion.p className="mt-1 text-xs sm:text-sm text-[#9A8678]" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}>Pilih dan klik salah satu kartu siswa untuk membuka modal biodata lengkap, pesan, kesan, dan akun sosial media.</motion.p>
      </div>

      <div ref={scrollContainerRef} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} className="flex items-stretch gap-4 sm:gap-5 overflow-x-auto pb-4 pt-1 select-none no-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {displayStudents.map((student, idx) => (
          <div key={`${student.id}-${idx}`} id={`mini-card-${student.id}-${idx}`} onClick={() => setSelectedStudent(student)} className="group flex-none w-[198px] flex flex-col items-center text-center cursor-pointer transition-transform duration-300 hover:-translate-y-1">
            <div className="relative w-[198px] h-[264px] rounded-xl overflow-hidden shadow-md mb-3 border border-[#4B4038]/60 group-hover:border-[#CAAA98] transition-colors">
              <img src={student.photo} alt={student.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-black/15 group-hover:bg-transparent transition-colors" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-[#CAAA98] group-hover:text-white transition-colors line-clamp-1 mb-1 w-full px-1">{student.name}</h3>
            <p className="text-xs text-[#9A8678] group-hover:text-[#CAAA98]/90 transition-colors line-clamp-2 italic px-1 w-full">{student.role} • {student.currentSchool}</p>
          </div>
        ))}
      </div>

      {selectedStudent && <StudentDetailModal student={selectedStudent} onClose={() => setSelectedStudent(null)} />}
    </section>
  );
};

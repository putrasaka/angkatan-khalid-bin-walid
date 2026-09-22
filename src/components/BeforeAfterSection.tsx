import React, { useState, useEffect } from 'react';
import { useDataStore } from '../context/DataContext';
import { Student } from '../types';
import { motion } from 'motion/react';
import { Search, AlertCircle, ArrowLeftRight, School, Check } from 'lucide-react';

export const BeforeAfterSection: React.FC = () => {
  const { students } = useDataStore();
  const [query, setQuery] = useState(students[0]?.name || '');
  const [matchedStudent, setMatchedStudent] = useState<Student | null>(students[0] || null);
  const [isNotFound, setIsNotFound] = useState(false);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [viewMode, setViewMode] = useState<'side-by-side' | 'slider'>('side-by-side');

  useEffect(() => {
    if (matchedStudent) {
      const refreshed = students.find((s) => s.id === matchedStudent.id);
      if (refreshed) setMatchedStudent(refreshed);
      else if (students.length > 0) { setMatchedStudent(students[0]); setQuery(students[0].name); }
    } else if (students.length > 0 && !query) { setMatchedStudent(students[0]); setQuery(students[0].name); }
  }, [students]);

  const handleSearch = (searchQuery: string) => {
    const trimmed = searchQuery.trim().toLowerCase();
    if (!trimmed) { setMatchedStudent(null); setIsNotFound(false); return; }
    const found = students.find((s) => s.name.toLowerCase().includes(trimmed) || s.nickname.toLowerCase().includes(trimmed) || trimmed.includes(s.name.toLowerCase()));
    if (found) { setMatchedStudent(found); setIsNotFound(false); } else { setMatchedStudent(null); setIsNotFound(true); }
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => { const val = e.target.value; setQuery(val); handleSearch(val); };
  const handleSelectChip = (studentName: string) => { setQuery(studentName); handleSearch(studentName); };

  return (
    <section id="before-after" className="py-10 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8">
        <motion.h2 className="text-2xl sm:text-3xl font-extrabold text-[#CAAA98] tracking-tight" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>Komparasi Foto Before & After</motion.h2>
        <motion.p className="mt-1.5 text-xs sm:text-sm text-[#9A8678]" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}>Ketik nama siswa untuk melihat transformasi wajah dan sekolah dari masa SD (Before) hingga SMP/sekarang (After).</motion.p>
      </div>

      <div className="max-w-xl mx-auto mb-6">
        <div className="relative">
          <Search className="w-4 h-4 text-[#9A8678] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input id="input-search-before-after" type="text" value={query} onChange={handleInputChange} placeholder="Ketik nama siswa (contoh: Ahmad Raihan, Nadhira, Faris)..." className="w-full pl-10 pr-24 py-2.5 sm:py-3 bg-[#202940] border border-[#4B4038] focus:border-[#CAAA98] rounded-xl text-xs sm:text-sm text-[#CAAA98] placeholder-[#9A8678] shadow-md outline-none transition-colors" />
          {query && <button type="button" onClick={() => { setQuery(''); setMatchedStudent(null); setIsNotFound(false); }} className="absolute right-2.5 top-1/2 -translate-y-1/2 px-2 py-1 text-[11px] text-[#9A8678] hover:text-[#CAAA98] rounded-lg bg-[#4B4038]/40 hover:bg-[#4B4038] cursor-pointer transition-colors">Reset</button>}
        </div>
        <div className="mt-2.5 flex flex-wrap items-center gap-1.5 justify-center">
          <span className="text-[11px] text-[#9A8678]">Pilih Cepat:</span>
          {students.map((s) => (
            <button key={s.id} type="button" id={`chip-${s.id}`} onClick={() => handleSelectChip(s.name)} className={`text-[11px] px-2.5 py-0.5 rounded-full border transition-all cursor-pointer ${matchedStudent?.id === s.id ? 'bg-[#CAAA98] text-[#202940] border-[#CAAA98] font-bold shadow-sm' : 'bg-[#4B4038]/40 hover:bg-[#4B4038] text-[#CAAA98] border-[#4B4038]'}`}>
              {s.name.split(' ')[0]} {s.name.split(' ')[1] || ''}
            </button>
          ))}
        </div>
      </div>

      {isNotFound && (
        <div id="alert-not-found" className="max-w-2xl mx-auto p-6 rounded-3xl bg-red-950/30 border-2 border-red-800/40 text-center space-y-2 shadow-xl animate-shake">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-900/40 text-red-300 mb-1"><AlertCircle className="w-6 h-6" /></div>
          <h4 className="text-base sm:text-lg font-bold text-red-300">nama tidak diketahui, silahkan input nama lain</h4>
          <p className="text-xs sm:text-sm text-[#9A8678]">Pastikan ejaan nama sesuai dengan nama teman seangkatan yang terdaftar pada menu Biodata.</p>
        </div>
      )}

      {matchedStudent && !isNotFound && (
        <div id="before-after-result-card" className="max-w-4xl mx-auto bg-transparent border-0 rounded-none p-0 shadow-none space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#4B4038]/50 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#CAAA98] text-[#202940] text-xs font-bold mb-2"><Check className="w-3.5 h-3.5" /><span>Siswa Ditemukan</span></div>
              <h3 className="text-2xl sm:text-3xl font-black text-[#CAAA98] tracking-tight">{matchedStudent.name}</h3>
              <p className="text-xs sm:text-sm text-[#9A8678] mt-1">Julukan akrab: <strong>&ldquo;{matchedStudent.nickname}&rdquo;</strong> • Jabatan: {matchedStudent.role}</p>
            </div>
            <div className="py-2 px-3 border-l-2 border-[#CAAA98] sm:text-right">
              <span className="block text-xs uppercase tracking-wider font-semibold text-[#9A8678] mb-0.5">Sekolah Sekarang (SMA/SMK)</span>
              <span className="text-sm sm:text-base font-bold text-[#CAAA98] flex items-center sm:justify-end gap-1.5"><School className="w-4 h-4 text-[#CAAA98]" /><span>{matchedStudent.currentSchool}</span></span>
            </div>
          </div>

          <div className="flex justify-center gap-2">
            <button type="button" onClick={() => setViewMode('side-by-side')} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${viewMode === 'side-by-side' ? 'bg-[#CAAA98] text-[#202940] shadow-sm' : 'bg-[#4B4038]/60 text-[#CAAA98] hover:bg-[#4B4038]'}`}>Tampilan Berdampingan (Side-by-Side)</button>
            <button type="button" onClick={() => setViewMode('slider')} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${viewMode === 'slider' ? 'bg-[#CAAA98] text-[#202940] shadow-sm' : 'bg-[#4B4038]/60 text-[#CAAA98] hover:bg-[#4B4038]'}`}>Slider Interaktif (Geser Perbandingan)</button>
          </div>

          {viewMode === 'side-by-side' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between"><span className="px-3 py-1 rounded-lg bg-[#4B4038] text-xs font-bold text-[#CAAA98] uppercase tracking-wider">Before</span><span className="text-xs text-[#9A8678]">Asal: {matchedStudent.previousSchool}</span></div>
                <div className="relative h-72 sm:h-80 rounded-2xl overflow-hidden border-2 border-[#4B4038] group"><img src={matchedStudent.photoSD} alt={`Foto SD ${matchedStudent.name}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /><div className="absolute inset-0 bg-gradient-to-t from-[#202940] via-transparent to-transparent opacity-50" /><div className="absolute bottom-3 left-3 right-3 text-xs font-medium text-[#CAAA98] bg-[#202940]/80 p-2 rounded-xl backdrop-blur-sm">Masa Kecil di {matchedStudent.previousSchool}</div></div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between"><span className="px-3 py-1 rounded-lg bg-[#CAAA98] text-xs font-bold text-[#202940] uppercase tracking-wider">After</span><span className="text-xs text-[#9A8678]">Kini di: {matchedStudent.currentSchool}</span></div>
                <div className="relative h-72 sm:h-80 rounded-2xl overflow-hidden border-2 border-[#CAAA98] group"><img src={matchedStudent.photoSMP} alt={`Foto SMP ${matchedStudent.name}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /><div className="absolute inset-0 bg-gradient-to-t from-[#202940] via-transparent to-transparent opacity-50" /><div className="absolute bottom-3 left-3 right-3 text-xs font-medium text-[#CAAA98] bg-[#202940]/80 p-2 rounded-xl backdrop-blur-sm">Kini Bersekolah di {matchedStudent.currentSchool}</div></div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative h-80 sm:h-96 rounded-2xl overflow-hidden border-2 border-[#CAAA98] select-none">
                <img src={matchedStudent.photoSMP} alt="Foto SMP / After" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full bg-[#CAAA98] text-[#202940] text-xs font-bold">After (SMP)</div>
                <div className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${sliderPosition}%` }}>
                  <img src={matchedStudent.photoSD} alt="Foto SD / Before" className="absolute inset-0 w-full h-full object-cover max-w-none" style={{ width: '100%', minWidth: '100%' }} />
                  <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-[#4B4038] text-[#CAAA98] text-xs font-bold">Before (SD)</div>
                </div>
                <div className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-20" style={{ left: `${sliderPosition}%` }}><div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#CAAA98] border-2 border-[#202940] text-[#202940] flex items-center justify-center shadow-lg"><ArrowLeftRight className="w-4 h-4" /></div></div>
              </div>
              <div className="flex items-center gap-4 max-w-md mx-auto"><span className="text-xs font-semibold text-[#9A8678]">Before (SD)</span><input type="range" min="0" max="100" value={sliderPosition} onChange={(e) => setSliderPosition(Number(e.target.value))} className="w-full accent-[#CAAA98] cursor-pointer" /><span className="text-xs font-semibold text-[#CAAA98]">After (SMP)</span></div>
            </div>
          )}

          <div className="pt-4 border-t border-[#4B4038]/40 flex flex-col sm:flex-row items-center justify-between text-xs text-[#9A8678] gap-2">
            <span>Perjalanan jenjang: {matchedStudent.previousSchool} &rarr; SMP Khalid Bin Walid &rarr; {matchedStudent.currentSchool}</span>
            <span className="font-semibold text-[#CAAA98]">Koleksi Arsip Angkatan 2024</span>
          </div>
        </div>
      )}
    </section>
  );
};

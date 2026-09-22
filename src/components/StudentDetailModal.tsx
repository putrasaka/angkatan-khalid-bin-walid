import React, { useEffect } from 'react';
import { Student } from '../types';
import { X, Instagram, MapPin, Calendar, Heart, Award, Quote, MessageSquare, Briefcase, Sparkles } from 'lucide-react';

interface StudentDetailModalProps {
  student: Student | null;
  onClose: () => void;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({ student, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (student) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [student, onClose]);

  if (!student) return null;

  return (
    <div
      id="student-detail-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#202940]/95 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="student-detail-modal-card"
        className="relative w-full max-w-2xl bg-[#202940] border-2 border-[#4B4038] rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar with Close Button */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#4B4038] bg-[#4B4038]/30">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#CAAA98]"></span>
            <span className="text-xs uppercase tracking-wider font-bold text-[#9A8678]">
              Profil Lengkap Siswa Angkatan
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            id="btn-close-student-modal"
            aria-label="Tutup detail siswa"
            className="p-1.5 rounded-xl bg-[#4B4038] text-[#CAAA98] hover:text-white hover:bg-[#4B4038]/80 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 space-y-6">
          {/* Top Profile Header: Foto Besar + Nama + Julukan + Jabatan */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6 border-b border-[#4B4038]">
            {/* Foto Besar */}
            <div className="relative w-36 h-44 sm:w-44 sm:h-52 rounded-2xl overflow-hidden border-2 border-[#CAAA98] shadow-xl shrink-0 group">
              <img
                src={student.photoLarge}
                alt={student.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-[#202940]/85 text-[10px] font-bold text-[#CAAA98] border border-[#4B4038]">
                Alumni IX
              </div>
            </div>

            {/* Nama & Basic Identity */}
            <div className="flex-1 text-center sm:text-left space-y-2.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#CAAA98] text-[#202940] text-xs font-extrabold shadow-sm">
                <Briefcase className="w-3.5 h-3.5" />
                <span>{student.role}</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#CAAA98] tracking-tight">
                {student.name}
              </h3>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs text-[#9A8678]">
                <span className="px-2.5 py-1 rounded-lg bg-[#4B4038]/50 border border-[#4B4038] text-[#CAAA98]">
                  Julukan: <strong>&ldquo;{student.nickname}&rdquo;</strong>
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-[#4B4038]/50 border border-[#4B4038] text-[#CAAA98]">
                  {student.previousSchool} &rarr; {student.currentSchool}
                </span>
              </div>

              {/* Instagram Handle */}
              <div className="pt-1">
                <a
                  href={`https://instagram.com/${student.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-[#CAAA98] hover:text-white px-3 py-1.5 rounded-xl bg-[#4B4038]/70 hover:bg-[#4B4038] border border-[#9A8678]/40 transition-colors"
                >
                  <Instagram className="w-4 h-4 text-[#CAAA98]" />
                  <span>{student.instagram}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Grid Informasi Detail (Tempat/Tgl Lahir, Alamat, Hobi, Cita-cita) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-[#4B4038]/30 border border-[#4B4038]">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#9A8678] mb-1">
                <Calendar className="w-3.5 h-3.5 text-[#CAAA98]" />
                <span>Tempat, Tanggal Lahir</span>
              </div>
              <p className="text-sm font-semibold text-[#CAAA98]">{student.birthPlaceDate}</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#4B4038]/30 border border-[#4B4038]">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#9A8678] mb-1">
                <MapPin className="w-3.5 h-3.5 text-[#CAAA98]" />
                <span>Alamat Domisili</span>
              </div>
              <p className="text-sm font-semibold text-[#CAAA98] leading-snug">{student.address}</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#4B4038]/30 border border-[#4B4038]">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#9A8678] mb-1">
                <Heart className="w-3.5 h-3.5 text-[#CAAA98]" />
                <span>Hobi & Kegemaran</span>
              </div>
              <p className="text-sm font-semibold text-[#CAAA98]">{student.hobby}</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#4B4038]/30 border border-[#4B4038]">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#9A8678] mb-1">
                <Award className="w-3.5 h-3.5 text-[#CAAA98]" />
                <span>Cita-Cita Masa Depan</span>
              </div>
              <p className="text-sm font-semibold text-[#CAAA98]">{student.dream}</p>
            </div>
          </div>

          {/* Pesan & Kesan */}
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-[#4B4038]/20 border border-[#4B4038]">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#CAAA98] mb-2">
                <Quote className="w-4 h-4 text-[#CAAA98]" />
                <span>Pesan untuk Sahabat Angkatan</span>
              </div>
              <p className="text-sm text-[#9A8678] italic leading-relaxed">
                &ldquo;{student.message}&rdquo;
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#4B4038]/20 border border-[#4B4038]">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#CAAA98] mb-2">
                <MessageSquare className="w-4 h-4 text-[#CAAA98]" />
                <span>Kesan Selama Bersekolah</span>
              </div>
              <p className="text-sm text-[#9A8678] leading-relaxed">
                {student.impression}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#4B4038] bg-[#4B4038]/20 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#CAAA98] text-[#202940] font-bold text-xs hover:bg-[#CAAA98]/90 transition-colors cursor-pointer"
          >
            Tutup Biodata
          </button>
        </div>
      </div>
    </div>
  );
};

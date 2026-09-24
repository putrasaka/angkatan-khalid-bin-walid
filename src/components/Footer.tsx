import React from 'react';
import { BookOpen, Instagram, Heart, ArrowUp } from 'lucide-react';
import { COHORT_INFO } from '../data/dummyData';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer className="mt-20 border-t-2 border-[#4B4038] bg-[#202940] text-[#9A8678] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3 text-left">
          <div className="w-10 h-10 rounded-xl bg-[#4B4038] border border-[#CAAA98]/40 flex items-center justify-center text-[#CAAA98]">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-base font-bold text-[#CAAA98]">
              {COHORT_INFO.name}
            </h4>
            <p className="text-xs text-[#9A8678]">
              Buku Kenangan Digital Angkatan IX • Lulusan 2024
            </p>
          </div>
        </div>

        
        <div className="flex items-center gap-4 text-xs">
          <a
            href="https://www.instagram.com/6khlidbinwalid"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#4B4038]/50 hover:bg-[#4B4038] text-[#CAAA98] border border-[#4B4038] transition-colors"
          >
            <Instagram className="w-4 h-4" />
            <span>@{COHORT_INFO.instagram}</span>
          </a>

          <a
            href="https://www.instagram.com/sixkhalidbinwalid"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#4B4038]/50 hover:bg-[#4B4038] text-[#CAAA98] border border-[#4B4038] transition-colors"
          >
            <Instagram className="w-4 h-4" />
            <span>@{COHORT_INFO.instagram}</span>
          </a>

          <button
            type="button"
            onClick={scrollToTop}
            id="btn-scroll-to-top"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#CAAA98] text-[#202940] font-bold hover:bg-[#CAAA98]/90 transition-colors cursor-pointer"
          >
            <ArrowUp className="w-3.5 h-3.5" />
            <span>Kembali ke Atas</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-[#4B4038]/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#9A8678]">
        <p className="flex items-center gap-1">
          Dibuat dengan rasa rindu & persaudaraan <Heart className="w-3.5 h-3.5 text-[#CAAA98] fill-[#CAAA98]" /> untuk segenap keluarga besar Khalid Bin Walid.
        </p>
        <p>&copy; 2024 - 2026 Angkatan Khalid Bin Walid. Semua Hak Dilindungi.</p>
      </div>
    </footer>
  );
};

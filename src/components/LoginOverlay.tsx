import React, { useState } from 'react';
import { VisitorInfo } from '../types';
import { GraduationCap, ArrowRight, Sparkles, UserCheck } from 'lucide-react';

interface LoginOverlayProps {
  isOpen: boolean;
  onLogin: (info: VisitorInfo) => void;
}

export const LoginOverlay: React.FC<LoginOverlayProps> = ({ isOpen, onLogin }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [previousSchool, setPreviousSchool] = useState('');
  const [currentSchool, setCurrentSchool] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Harap masukkan nama Anda');
      return;
    }

    onLogin({
      name: name.trim(),
      age: age.trim() || '15',
      previousSchool: previousSchool.trim() || 'SDIT Nurul Fikri',
      currentSchool: currentSchool.trim() || 'SMA Negeri 1 Teladan',
      loggedInAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    });
  };

  const handleDemoFill = () => {
    setName('Ahmad Raihan Pratama');
    setAge('16');
    setPreviousSchool('SDIT Nurul Fikri');
    setCurrentSchool('SMA Negeri 1 Teladan');
    setError('');
  };

  return (
    <div
      id="login-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#202940]/95 backdrop-blur-md transition-opacity duration-500 overflow-y-auto"
    >
      {/* Decorative ambient glow */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-[#CAAA98]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-[#4B4038]/30 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md bg-[#202940] border-2 border-[#4B4038] rounded-2xl shadow-2xl p-6 sm:p-8 text-[#CAAA98] my-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#4B4038] border border-[#CAAA98]/30 text-[#CAAA98] mb-3 shadow-inner">
            <GraduationCap className="w-7 h-7" />
          </div>
          <span className="inline-block text-xs uppercase tracking-widest text-[#9A8678] font-semibold mb-1">
            Buku Kenangan Digital
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#CAAA98] tracking-tight">
            Angkatan Khalid Bin Walid
          </h1>
          <p className="text-sm text-[#9A8678] mt-1.5 leading-relaxed">
            Silakan lengkapi biodata singkat Anda untuk membuka lembaran memori dan cerita masa sekolah.
          </p>
        </div>

        {/* Quick Demo Fill Button */}
        <div className="mb-5 flex justify-center">
          <button
            type="button"
            onClick={handleDemoFill}
            id="btn-demo-fill"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#CAAA98] bg-[#4B4038]/60 hover:bg-[#4B4038] border border-[#9A8678]/40 px-3 py-1.5 rounded-full transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#CAAA98]" />
            <span>Isi Otomatis Data Siswa Demo</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-950/40 border border-red-800/50 rounded-lg text-xs text-red-300">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#9A8678] mb-1 uppercase tracking-wider">
              Nama Lengkap <span className="text-[#CAAA98]">*</span>
            </label>
            <input
              id="input-login-name"
              type="text"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              placeholder="Contoh: Ahmad Raihan Pratama"
              className="w-full px-4 py-2.5 bg-[#202940] border border-[#4B4038] focus:border-[#CAAA98] rounded-xl text-sm text-[#CAAA98] placeholder-[#9A8678]/60 outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#9A8678] mb-1 uppercase tracking-wider">
              Umur
            </label>
            <input
              id="input-login-age"
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Contoh: 16"
              min="10"
              max="99"
              className="w-full px-4 py-2.5 bg-[#202940] border border-[#4B4038] focus:border-[#CAAA98] rounded-xl text-sm text-[#CAAA98] placeholder-[#9A8678]/60 outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#9A8678] mb-1 uppercase tracking-wider">
              Sekolah SD
            </label>
            <input
              id="input-login-prev-school"
              type="text"
              value={previousSchool}
              onChange={(e) => setPreviousSchool(e.target.value)}
              placeholder="Contoh: SDIT Nurul Fikri"
              className="w-full px-4 py-2.5 bg-[#202940] border border-[#4B4038] focus:border-[#CAAA98] rounded-xl text-sm text-[#CAAA98] placeholder-[#9A8678]/60 outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#9A8678] mb-1 uppercase tracking-wider">
              Sekolah Sekarang
            </label>
            <input
              id="input-login-curr-school"
              type="text"
              value={currentSchool}
              onChange={(e) => setCurrentSchool(e.target.value)}
              placeholder="Contoh: SMA Negeri 1 Teladan"
              className="w-full px-4 py-2.5 bg-[#202940] border border-[#4B4038] focus:border-[#CAAA98] rounded-xl text-sm text-[#CAAA98] placeholder-[#9A8678]/60 outline-none transition-colors"
            />
          </div>

          <div className="pt-2">
            <button
              id="btn-login-submit"
              type="submit"
              className="w-full py-3 px-6 bg-[#CAAA98] hover:bg-[#CAAA98]/90 text-[#202940] font-bold rounded-xl shadow-lg transition-transform active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Masuk ke Buku Kenangan</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        <div className="mt-5 text-center text-xs text-[#9A8678]">
          <p>Kenangan indah masa putih biru tak lekang oleh waktu.</p>
        </div>
      </div>
    </div>
  );
};

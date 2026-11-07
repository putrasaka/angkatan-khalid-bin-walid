import React, { useEffect, useState } from 'react';
import { MessageSquare, ArrowLeft, Send, Loader2 } from 'lucide-react';
import { VisitorInfo } from '../types';

interface FeedbackModalProps {
  isOpen: boolean;
  visitor: VisitorInfo;
  onClose: () => void;
  onSubmitted: () => void;
}

const PHONE_RE = /^[0-9+\-\s]{8,20}$/;

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, visitor, onClose, onSubmitted }) => {
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (isOpen) setError('');
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedPhone = phone.trim().replace(/\s+/g, ' ');
    const trimmedMessage = message.trim();

    if (!PHONE_RE.test(trimmedPhone)) {
      setError('Nomor TLP wajib diisi (8-20 digit, boleh + atau -).');
      return;
    }
    if (trimmedMessage.length < 3) {
      setError('Pesan minimal 3 karakter.');
      return;
    }
    if (trimmedMessage.length > 1000) {
      setError('Pesan maksimal 1000 karakter.');
      return;
    }

    setError('');
    setIsSending(true);
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: visitor.name, phone: trimmedPhone, message: trimmedMessage }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error ?? 'Gagal mengirim masukan.');
        return;
      }
      setPhone('');
      setMessage('');
      onSubmitted();
    } catch {
      setError('Gagal terhubung ke server.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#202940]/95 backdrop-blur-md overflow-y-auto overflow-x-hidden">
      <div className="relative w-full max-w-md bg-[#202940] border-2 border-[#4B4038] rounded-2xl shadow-2xl p-6 sm:p-8 text-[#CAAA98] my-auto">
        <div className="text-center mb-5">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#4B4038] border border-[#CAAA98]/30 text-[#CAAA98] mb-3 shadow-inner">
            <MessageSquare className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-[#CAAA98]">Kirim Masukan</h2>
          <p className="text-xs text-[#9A8678] mt-1">Pesanmu akan dibaca langsung oleh admin angkatan.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#9A8678] mb-1 uppercase tracking-wider">
              Nama Pengirim
            </label>
            <div className="flex items-center gap-2 px-4 py-2.5 bg-[#4B4038]/40 border border-[#4B4038] rounded-xl text-sm">
              <div className="w-6 h-6 rounded-full bg-[#CAAA98] text-[#202940] flex items-center justify-center text-[10px] font-bold shrink-0">
                {visitor.name.charAt(0).toUpperCase()}
              </div>
              <span className="truncate font-medium">{visitor.name}</span>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-950/40 border border-red-800/50 rounded-lg text-xs text-red-300">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="feedback-message" className="block text-xs font-semibold text-[#9A8678] mb-1 uppercase tracking-wider">
              Pesan <span className="text-[#CAAA98]">*</span>
            </label>
            <textarea
              id="feedback-message"
              required
              rows={4}
              maxLength={1000}
              value={message}
              onChange={(e) => { setMessage(e.target.value); if (error) setError(''); }}
              placeholder="Tulis masukan, saran, atau pesan untuk angkatan..."
              className="w-full px-4 py-2.5 bg-[#202940] border border-[#4B4038] focus:border-[#CAAA98] rounded-xl text-sm text-[#CAAA98] placeholder-[#9A8678]/60 outline-none transition-colors resize-none"
            />
            <p className="text-[10px] text-[#9A8678] mt-1 text-right">{message.length}/1000</p>
          </div>

          <div>
            <label htmlFor="feedback-phone" className="block text-xs font-semibold text-[#9A8678] mb-1 uppercase tracking-wider">
              No. TLP <span className="text-[#CAAA98]">*</span>
            </label>
            <input
              id="feedback-phone"
              type="tel"
              required
              inputMode="tel"
              value={phone}
              onChange={(e) => { setPhone(e.target.value); if (error) setError(''); }}
              placeholder="Contoh: 0812-3456-7890"
              className="w-full px-4 py-2.5 bg-[#202940] border border-[#4B4038] focus:border-[#CAAA98] rounded-xl text-sm text-[#CAAA98] placeholder-[#9A8678]/60 outline-none transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSending}
              className="flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-[#4B4038]/60 hover:bg-[#4B4038] border border-[#9A8678]/40 text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali</span>
            </button>
            <button
              type="submit"
              disabled={isSending}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#CAAA98] hover:bg-[#CAAA98]/90 text-[#202940] font-bold rounded-xl shadow-lg transition-transform active:scale-[0.99] cursor-pointer disabled:opacity-60"
            >
              {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span>{isSending ? 'Mengirim...' : 'Kirim'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

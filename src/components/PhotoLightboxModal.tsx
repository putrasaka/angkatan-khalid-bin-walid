import React, { useEffect } from 'react';
import { X, ZoomIn } from 'lucide-react';

interface PhotoLightboxModalProps {
  image: string | null;
  title: string;
  caption?: string;
  onClose: () => void;
}

export const PhotoLightboxModal: React.FC<PhotoLightboxModalProps> = ({
  image,
  title,
  caption,
  onClose,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (image) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [image, onClose]);

  if (!image) return null;

  return (
    <div
      id="photo-lightbox-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#202940]/95 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl w-full bg-[#202940] border-2 border-[#4B4038] rounded-2xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#4B4038] bg-[#4B4038]/30">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-[#9A8678]">
              Pratinjau Foto
            </span>
            <h3 className="text-base font-bold text-[#CAAA98]">{title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            id="btn-close-lightbox"
            className="p-1.5 rounded-xl bg-[#4B4038] text-[#CAAA98] hover:text-white hover:bg-[#4B4038]/80 transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Image Display */}
        <div className="relative max-h-[70vh] flex items-center justify-center bg-black/40 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-auto max-h-[70vh] object-contain"
          />
        </div>

        {/* Footer / Caption */}
        {caption && (
          <div className="p-4 border-t border-[#4B4038] bg-[#202940] text-xs sm:text-sm text-[#9A8678]">
            {caption}
          </div>
        )}
      </div>
    </div>
  );
};

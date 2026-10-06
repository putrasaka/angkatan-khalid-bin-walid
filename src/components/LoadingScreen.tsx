import React from 'react';

interface LoadingScreenProps {
  isInitialLoading: boolean;
  isRefreshing: boolean;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ isInitialLoading, isRefreshing }) => {
  if (isInitialLoading) {
    return (
      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#202940]">
        <div className="photo-reveal-container">
          <div className="photo-frame">
            <div className="photo photo-1" />
            <div className="photo photo-2" />
            <div className="photo photo-3" />
            <div className="photo photo-4" />
          </div>
          <div className="photo-shadow" />
        </div>

        <div className="mt-10 text-center">
          <p className="text-[#CAAA98] text-sm tracking-[0.3em] uppercase animate-pulse">
            Memuat Kenangan
          </p>
          <div className="mt-4 flex items-center justify-center gap-1.5">
            <span className="loading-dot" />
            <span className="loading-dot" />
            <span className="loading-dot" />
          </div>
        </div>

        <div className="mt-6 w-48 h-1 bg-[#4B4038]/30 rounded-full overflow-hidden">
          <div className="loading-progress" />
        </div>

        <style>{`
          .photo-reveal-container {
            position: relative;
            width: 140px;
            height: 180px;
            perspective: 1000px;
          }
          .photo-frame {
            position: relative;
            width: 100%;
            height: 100%;
            transform-style: preserve-3d;
          }
          .photo {
            position: absolute;
            width: 100%;
            height: 100%;
            border-radius: 8px;
            border: 2px solid #CAAA98/40;
            background: linear-gradient(135deg, #4B4038 0%, #2a3550 100%);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            opacity: 0;
            transform: translateX(120%) rotate(5deg);
            animation: photoReveal 4s ease-in-out infinite;
          }
          .photo-1 { animation-delay: 0s; background: linear-gradient(135deg, #4B4038 0%, #2a3550 100%); }
          .photo-2 { animation-delay: 1s; background: linear-gradient(135deg, #5a4a3a 0%, #3a4560 100%); }
          .photo-3 { animation-delay: 2s; background: linear-gradient(135deg, #3a4a5a 0%, #4a3540 100%); }
          .photo-4 { animation-delay: 3s; background: linear-gradient(135deg, #4a3a4a 0%, #2a4550 100%); }
          .photo-shadow {
            position: absolute;
            bottom: -15px;
            left: 10%;
            right: 10%;
            height: 20px;
            background: radial-gradient(ellipse at center, rgba(0,0,0,0.3) 0%, transparent 70%);
            border-radius: 50%;
            animation: shadowPulse 4s ease-in-out infinite;
          }
          .loading-dot {
            width: 6px;
            height: 6px;
            background: #CAAA98;
            border-radius: 50%;
            animation: dotBounce 1.4s ease-in-out infinite;
          }
          .loading-dot:nth-child(2) { animation-delay: 0.2s; }
          .loading-dot:nth-child(3) { animation-delay: 0.4s; }
          .loading-progress {
            height: 100%;
            background: linear-gradient(90deg, #CAAA98, #CAAA98);
            border-radius: 9999px;
            animation: progressSlide 2s ease-in-out infinite;
          }
          @keyframes photoReveal {
            0% { opacity: 0; transform: translateX(120%) rotate(5deg); }
            15% { opacity: 1; transform: translateX(0%) rotate(0deg); }
            85% { opacity: 1; transform: translateX(0%) rotate(0deg); }
            100% { opacity: 0; transform: translateX(-120%) rotate(-5deg); }
          }
          @keyframes shadowPulse {
            0%, 100% { opacity: 0.3; transform: scaleX(1); }
            50% { opacity: 0.5; transform: scaleX(1.1); }
          }
          @keyframes dotBounce {
            0%, 100% { transform: translateY(0); opacity: 0.4; }
            50% { transform: translateY(-8px); opacity: 1; }
          }
          @keyframes progressSlide {
            0% { width: 0%; margin-left: 0; }
            50% { width: 70%; margin-left: 0; }
            100% { width: 0%; margin-left: 100%; }
          }
        `}</style>
      </div>
    );
  }

  if (isRefreshing) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm pointer-events-none">
        <div className="bg-[#202940] border border-[#4B4038] rounded-2xl p-6 flex flex-col items-center shadow-2xl w-[min(280px,90vw)]">
          <div className="photo-reveal-container-small">
            <div className="photo-frame-small">
              <div className="photo-small photo-small-1" />
              <div className="photo-small photo-small-2" />
              <div className="photo-small photo-small-3" />
            </div>
          </div>
          <p className="mt-4 text-[#CAAA98] text-xs tracking-[0.2em] uppercase animate-pulse">
            Memuat Ulang
          </p>
          <div className="mt-3 w-32 h-1 bg-[#4B4038]/30 rounded-full overflow-hidden">
            <div className="loading-progress" />
          </div>
        </div>

        <style>{`
          .photo-reveal-container-small {
            position: relative;
            width: 60px;
            height: 80px;
            perspective: 600px;
          }
          .photo-frame-small {
            position: relative;
            width: 100%;
            height: 100%;
            transform-style: preserve-3d;
          }
          .photo-small {
            position: absolute;
            width: 100%;
            height: 100%;
            border-radius: 4px;
            border: 1px solid #CAAA98/40;
            background: linear-gradient(135deg, #4B4038 0%, #2a3550 100%);
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
            opacity: 0;
            transform: translateX(120%) rotate(5deg);
            animation: photoRevealSmall 3s ease-in-out infinite;
          }
          .photo-small-1 { animation-delay: 0s; background: linear-gradient(135deg, #4B4038 0%, #2a3550 100%); }
          .photo-small-2 { animation-delay: 1s; background: linear-gradient(135deg, #5a4a3a 0%, #3a4560 100%); }
          .photo-small-3 { animation-delay: 2s; background: linear-gradient(135deg, #3a4a5a 0%, #4a3540 100%); }
          .loading-progress {
            height: 100%;
            background: linear-gradient(90deg, #CAAA98, #CAAA98);
            border-radius: 9999px;
            animation: progressSlide 2s ease-in-out infinite;
          }
          @keyframes photoRevealSmall {
            0% { opacity: 0; transform: translateX(120%) rotate(5deg); }
            15% { opacity: 1; transform: translateX(0%) rotate(0deg); }
            85% { opacity: 1; transform: translateX(0%) rotate(0deg); }
            100% { opacity: 0; transform: translateX(-120%) rotate(-5deg); }
          }
          @keyframes progressSlide {
            0% { width: 0%; margin-left: 0; }
            50% { width: 70%; margin-left: 0; }
            100% { width: 0%; margin-left: 100%; }
          }
        `}</style>
      </div>
    );
  }

  return null;
};

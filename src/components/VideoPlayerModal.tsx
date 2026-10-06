import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { X, Calendar, Clock, Play, Pause, Volume2, VolumeX, Maximize, Minimize, Loader2, AlertCircle } from 'lucide-react';
import type { VideoMoment } from '../types';

interface Props {
  video: VideoMoment | null;
  onClose: () => void;
}

const fmt = (s: number) => {
  if (!Number.isFinite(s) || s < 0) s = 0;
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
};

export const VideoPlayerModal: React.FC<Props> = ({ video, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const togglePlay = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;
    if (el.paused) void el.play().catch(() => setError('Video tidak dapat diputar di browser ini.'));
    else el.pause();
  }, []);

  useEffect(() => {
    if (!video) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    // ponytail: global body lock, fine while the modal is the only overlay; per-scroll-lock lib if nesting modals later
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [video, onClose]);

  useEffect(() => {
    const onChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  // close fullscreen when the modal goes away
  useEffect(() => {
    if (!video && document.fullscreenElement) void document.exitFullscreen().catch(() => {});
  }, [video]);

  // manual autoplay attempt with timeout
  useEffect(() => {
    if (!video) return;
    const el = videoRef.current;
    if (!el) return;

    let timeoutId: ReturnType<typeof setTimeout>;
    let cancelled = false;

    el.play()
      .then(() => {
        if (!cancelled) setIsLoading(false);
      })
      .catch(() => {
        if (!cancelled) setError('Video tidak dapat diputar di browser ini.');
      });

    timeoutId = setTimeout(() => {
      if (!cancelled && el.paused) {
        setError('Video lambat dimuat. Periksa koneksi internet Anda.');
      }
    }, 10000);

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [video]);

  const toggleFullscreen = () => {
    if (document.fullscreenElement) void document.exitFullscreen().catch(() => {});
    else void playerRef.current?.requestFullscreen().catch(() => {});
  };

  if (!video) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div onClick={onClose} className="absolute inset-0 bg-[#0d1220]/85 backdrop-blur-md" aria-hidden="true" />

      <motion.div
        ref={playerRef}
        role="dialog"
        aria-modal="true"
        aria-label={video.title}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl bg-[#202940] border border-[#4B4038] rounded-2xl overflow-hidden shadow-[0_30px_80px_-20px_rgba(0,0,0,0.85)]"
        initial={{ opacity: 0, scale: 0.94, y: 18 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        <button
          onClick={onClose}
          aria-label="Tutup video"
          className="absolute top-3 right-3 z-10 grid place-items-center w-9 h-9 rounded-full bg-black/55 border border-[#4B4038] text-[#CAAA98] hover:bg-[#CAAA98] hover:text-[#202940] transition-colors"
        >
          <X className="w-[18px] h-[18px]" />
        </button>

        <div className="relative w-full aspect-video bg-black">
          {error ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center">
              <AlertCircle className="w-9 h-9 text-[#CAAA98]" />
              <p className="text-sm text-[#9A8678]">{error}</p>
            </div>
          ) : (
            <video
              key={video.id}
              ref={videoRef}
              src={video.videoUrl}
              poster={video.posterUrl || undefined}
              playsInline
              preload="none"
              onClick={togglePlay}
              onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
              onDurationChange={(e) => setDuration(e.currentTarget.duration)}
              onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onWaiting={() => setIsLoading(true)}
              onPlaying={() => setIsLoading(false)}
              onCanPlay={() => setIsLoading(false)}
              onVolumeChange={(e) => {
                setVolume(e.currentTarget.volume);
                setIsMuted(e.currentTarget.muted);
              }}
              onError={() => {
                setError('Video gagal dimuat. Periksa koneksi atau format berkas video.');
                setIsLoading(false);
              }}
              className="w-full h-full object-contain bg-black cursor-pointer"
            />
          )}

          {isLoading && !error && (
            <div className="pointer-events-none absolute inset-0 grid place-items-center">
              <Loader2 className="w-10 h-10 text-[#CAAA98] animate-spin" />
            </div>
          )}
        </div>

        <div className="border-t border-[#4B4038] bg-gradient-to-b from-[#1b2337] to-[#161d2e] px-4 py-3 space-y-2.5">
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={duration ? Math.min(currentTime, duration) : 0}
            onChange={(e) => {
              const t = Number(e.target.value);
              if (videoRef.current) videoRef.current.currentTime = t;
              setCurrentTime(t);
            }}
            aria-label="Posisi pemutaran"
            className="w-full h-1.5 cursor-pointer accent-[#CAAA98] appearance-none rounded-full bg-[#4B4038] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#CAAA98] [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-3.5 [&::-moz-range-thumb]:h-3.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-[#CAAA98]"
            style={{
              background: duration
                ? `linear-gradient(to right, #CAAA98 ${(currentTime / duration) * 100}%, #4B4038 ${(currentTime / duration) * 100}%)`
                : '#4B4038',
            }}
          />

          <div className="flex items-center gap-3">
            <button
              onClick={togglePlay}
              disabled={Boolean(error)}
              aria-label={isPlaying ? 'Jeda' : 'Putar'}
              className="grid place-items-center w-9 h-9 rounded-full bg-[#CAAA98] text-[#202940] hover:bg-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 translate-x-0.5 fill-current" />}
            </button>

            <span className="text-xs tabular-nums text-[#9A8678] w-[76px] shrink-0">
              {fmt(currentTime)} / {fmt(duration)}
            </span>

            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={() => {
                  if (videoRef.current) videoRef.current.muted = !videoRef.current.muted;
                }}
                aria-label={isMuted ? 'Unmute' : 'Mute'}
                className="text-[#CAAA98] hover:text-white transition-colors"
              >
                {isMuted || volume === 0 ? <VolumeX className="w-[18px] h-[18px]" /> : <Volume2 className="w-[18px] h-[18px]" />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  if (videoRef.current) {
                    videoRef.current.volume = v;
                    videoRef.current.muted = v === 0;
                  }
                  setVolume(v);
                }}
                aria-label="Volume"
                className="w-20 sm:w-24 h-1.5 cursor-pointer accent-[#CAAA98] appearance-none rounded-full bg-[#4B4038] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#CAAA98] [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-[#CAAA98]"
              />
              <button
                onClick={toggleFullscreen}
                aria-label={isFullscreen ? 'Keluar layar penuh' : 'Layar penuh'}
                className="text-[#CAAA98] hover:text-white transition-colors"
              >
                {isFullscreen ? <Minimize className="w-[18px] h-[18px]" /> : <Maximize className="w-[18px] h-[18px]" />}
              </button>
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-6 border-t border-[#4B4038] bg-[#202940]">
          <div className="flex flex-wrap items-center gap-3 text-xs text-[#9A8678]">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#CAAA98]" />
              {video.date}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#CAAA98]" />
              {video.duration}
            </span>
          </div>
          <h3 className="mt-2 text-lg sm:text-xl font-extrabold text-[#CAAA98] tracking-tight">{video.title}</h3>
          {video.description && <p className="mt-1.5 text-sm text-[#9A8678] leading-relaxed">{video.description}</p>}
        </div>
      </motion.div>
    </motion.div>
  );
};
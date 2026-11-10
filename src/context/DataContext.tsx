import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { Student, Moment, GraduationData, VideoMoment } from '../types';
import { STUDENTS, MOMENTS_FEED, GRADUATION_DATA, VIDEO_MOMENTS } from '../data/dummyData';
import { mapStudentRow, mapMomentRow, mapVideoRow, mapGalleryRow, mapGraduationInfo } from '../lib/mappers';

export interface ToastNotification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface DataContextType {
  students: Student[];
  moments: Moment[];
  graduationData: GraduationData;
  videoMoments: VideoMoment[];
  isInitialLoading: boolean;
  isRefreshing: boolean;
  // No-op in public mode (edit via Admin)
  addMoment: (moment: Omit<Moment, 'id'>) => void;
  updateMoment: (id: string, updated: Partial<Moment>) => void;
  deleteMoment: (id: string) => void;
  addVideoMoment: (video: Omit<VideoMoment, 'id'>) => void;
  updateVideoMoment: (id: string, updated: Partial<VideoMoment>) => void;
  deleteVideoMoment: (id: string) => void;
  addStudent: (student: Omit<Student, 'id'>) => void;
  updateStudent: (id: string, updated: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  updateGraduationInfo: (info: Partial<Omit<GraduationData, 'gallery' | 'graduates'>>) => void;
  updateGraduatesList: (names: string[]) => void;
  addGraduationGraduate: (name: string) => void;
  removeGraduationGraduate: (index: number) => void;
  addGraduationGallery: (photo: { image: string; caption: string }) => void;
  updateGraduationGallery: (id: string, photo: Partial<{ image: string; caption: string }>) => void;
  deleteGraduationGallery: (id: string) => void;
  resetToDefaultData: () => void;
  toasts: ToastNotification[];
  dismissToast: (id: string) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  refresh: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [moments, setMoments] = useState<Moment[]>([]);
  const [graduationData, setGraduationData] = useState<GraduationData | null>(null);
  const [videoMoments, setVideoMoments] = useState<VideoMoment[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).slice(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => dismissToast(id), 4000);
  };
  const dismissToast = (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id));

  const isFirstLoad = useRef(true);
  const didFallback = useRef(false);

  const fetchAll = useCallback(async (silent = false) => {
    if (isFirstLoad.current) {
      setIsInitialLoading(true);
    } else if (!silent) {
      setIsRefreshing(true);
    }

    try {
      const res = await fetch('/api/k7f2q9x4', { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      setStudents((data.students ?? []).map(mapStudentRow));
      setMoments((data.moments ?? []).map(mapMomentRow));
      setVideoMoments((data.videos ?? []).map(mapVideoRow));
      setGraduationData(
        data.graduationInfo
          ? mapGraduationInfo(
              data.graduationInfo,
              data.graduates ?? [],
              (data.gallery ?? []).map(mapGalleryRow)
            )
          : GRADUATION_DATA
      );

      didFallback.current = false;
      isFirstLoad.current = false;
    } catch (err) {
      console.error('Fetch error', err);
      // Halaman tidak boleh kosong: tampilkan data contoh, toast sekali saja.
      setStudents(STUDENTS);
      setMoments(MOMENTS_FEED);
      setGraduationData(GRADUATION_DATA);
      setVideoMoments(VIDEO_MOMENTS);
      if (!didFallback.current) {
        didFallback.current = true;
        showToast('Gagal memuat data dari database. Menampilkan data contoh.', 'error');
      }
    } finally {
      setIsInitialLoading(false);
      if (!silent) setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Polling fallback (pengganti realtime Supabase)
  useEffect(() => {
    const interval = setInterval(() => fetchAll(true), 15000);
    return () => clearInterval(interval);
  }, [fetchAll]);

  // No-op handlers for public mode
  const noop = () => showToast('Mode publik: silakan edit via Admin (domain terpisah)', 'info');

  return (
    <DataContext.Provider
      value={{
        students,
        moments,
        graduationData,
        videoMoments,
        isInitialLoading,
        isRefreshing,
        addMoment: noop,
        updateMoment: noop,
        deleteMoment: noop,
        addVideoMoment: noop,
        updateVideoMoment: noop,
        deleteVideoMoment: noop,
        addStudent: noop,
        updateStudent: noop,
        deleteStudent: noop,
        updateGraduationInfo: noop,
        updateGraduatesList: noop,
        addGraduationGraduate: noop,
        removeGraduationGraduate: noop,
        addGraduationGallery: noop,
        updateGraduationGallery: noop,
        deleteGraduationGallery: noop,
        resetToDefaultData: noop,
        toasts,
        dismissToast,
        showToast,
        refresh: fetchAll,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useDataStore = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useDataStore must be used within a DataProvider');
  return context;
};

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { Student, Moment, GraduationData, VideoMoment } from '../types';
import { STUDENTS, MOMENTS_FEED, GRADUATION_DATA, VIDEO_MOMENTS } from '../data/dummyData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
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
  isSupabaseConfigured: boolean;
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

  const fetchAll = useCallback(async (silent = false) => {
    if (!isSupabaseConfigured || !supabase) {
      setStudents(STUDENTS);
      setMoments(MOMENTS_FEED);
      setGraduationData(GRADUATION_DATA);
      setVideoMoments(VIDEO_MOMENTS);
      showToast('Database tidak terhubung. Menampilkan data contoh. Solusi: Supabase → Settings → API, lalu isi VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY di file .env', 'error');
      setIsInitialLoading(false);
      setIsRefreshing(false);
      return;
    }

    if (isFirstLoad.current) {
      setIsInitialLoading(true);
    } else if (!silent) {
      setIsRefreshing(true);
    }

    try {
      const [stuRes, momRes, gradInfoRes, graduatesRes, galleryRes, vidRes] = await Promise.all([
        supabase.from('students').select('*').order('created_at', { ascending: true }),
        supabase.from('moments').select('*').order('created_at', { ascending: true }),
        supabase.from('graduation_info').select('*').eq('id', 1).single(),
        supabase.from('graduates').select('*').order('position', { ascending: true }),
        supabase.from('graduation_gallery').select('*').order('created_at', { ascending: true }),
        supabase.from('video_moments').select('*').order('created_at', { ascending: true }),
      ]);

      if (stuRes.data) setStudents(stuRes.data.map(mapStudentRow));
      if (momRes.data) setMoments(momRes.data.map(mapMomentRow));
      if (vidRes.data) setVideoMoments(vidRes.data.map(mapVideoRow));

      const graduates = graduatesRes.data ? graduatesRes.data.map((r: any) => r.name) : [];
      const gallery = galleryRes.data ? galleryRes.data.map(mapGalleryRow) : [];

      if (gradInfoRes.data) {
        setGraduationData(mapGraduationInfo(gradInfoRes.data, graduates, gallery));
      }

      isFirstLoad.current = false;
    } catch (err) {
      console.error('Supabase fetch error', err);
      showToast('Gagal memuat data dari database. Solusi: cek koneksi internet dan konfigurasi Supabase', 'error');
    } finally {
      setIsInitialLoading(false);
      if (!silent) setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Realtime + polling fallback
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;
    const channel = supabase
      .channel('public-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'students' }, fetchAll)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'moments' }, fetchAll)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'video_moments' }, fetchAll)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'graduation_info' }, fetchAll)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'graduates' }, fetchAll)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'graduation_gallery' }, fetchAll)
      .subscribe();

    const interval = setInterval(() => fetchAll(true), 15000);
    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
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
        isSupabaseConfigured,
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

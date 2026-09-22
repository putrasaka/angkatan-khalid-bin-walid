import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
  isLoading: boolean;
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
  const [students, setStudents] = useState<Student[]>(STUDENTS);
  const [moments, setMoments] = useState<Moment[]>(MOMENTS_FEED);
  const [graduationData, setGraduationData] = useState<GraduationData>(GRADUATION_DATA);
  const [videoMoments, setVideoMoments] = useState<VideoMoment[]>(VIDEO_MOMENTS);
  const [isLoading, setIsLoading] = useState(false);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).slice(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => dismissToast(id), 4000);
  };
  const dismissToast = (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id));

  const fetchAll = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) {
      // Fallback dummy (mode demo tanpa Supabase)
      setStudents(STUDENTS);
      setMoments(MOMENTS_FEED);
      setGraduationData(GRADUATION_DATA);
      setVideoMoments(VIDEO_MOMENTS);
      return;
    }
    setIsLoading(true);
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

      const graduates = graduatesRes.data ? graduatesRes.data.map((r: any) => r.name) : GRADUATION_DATA.graduates;
      const gallery = galleryRes.data ? galleryRes.data.map(mapGalleryRow) : GRADUATION_DATA.gallery;

      if (gradInfoRes.data) {
        setGraduationData(mapGraduationInfo(gradInfoRes.data, graduates, gallery));
      } else {
        setGraduationData({ ...GRADUATION_DATA, graduates, gallery });
      }
    } catch (err) {
      console.error('Supabase fetch error', err);
      showToast('Gagal sinkronisasi Supabase, menampilkan data lokal', 'error');
    } finally {
      setIsLoading(false);
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

    const interval = setInterval(fetchAll, 15000);
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
        isLoading,
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

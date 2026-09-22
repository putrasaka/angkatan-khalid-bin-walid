export interface Student {
  id: string;
  name: string;
  nickname: string; // Julukan
  role: string; // Jabatan di angkatan (e.g., Ketua Angkatan)
  photo: string; // Foto profil mini
  photoLarge: string; // Foto besar untuk modal
  photoSD: string; // Foto Before (SD)
  photoSMP: string; // Foto After (SMP/Sekarang)
  previousSchool: string; // Sekolah Dulu
  currentSchool: string; // Sekolah Sekarang
  birthPlaceDate: string; // Tempat, Tanggal Lahir
  address: string; // Alamat
  hobby: string; // Hobi
  dream: string; // Cita-cita
  message: string; // Pesan
  impression: string; // Kesan
  instagram: string; // Username Instagram (@...)
}

export interface Moment {
  id: string;
  title: string;
  image: string;
  date: string;
  tag?: string;
  story: string;
}

export interface GraduationData {
  mainBanner: string;
  title: string;
  cohortName: string;
  date: string;
  location: string;
  description: string;
  graduates: string[];
  gallery: {
    id: string;
    image: string;
    caption: string;
  }[];
}

export interface VideoMoment {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  posterUrl: string;
  duration: string;
  date: string;
}

export interface VisitorInfo {
  name: string;
  age: string;
  previousSchool: string;
  currentSchool: string;
  loggedInAt: string;
}

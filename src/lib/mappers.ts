import { Student, Moment, GraduationData, VideoMoment } from '../types';

// DB row -> App type (snake_case -> camelCase)
export function mapStudentRow(row: any): Student {
  return {
    id: row.id,
    name: row.name,
    nickname: row.nickname,
    role: row.role,
    photo: row.photo,
    photoLarge: row.photo_large,
    photoSD: row.photo_sd,
    photoSMP: row.photo_smp,
    previousSchool: row.previous_school,
    currentSchool: row.current_school,
    birthPlaceDate: row.birth_place_date,
    address: row.address,
    hobby: row.hobby,
    dream: row.dream,
    message: row.message,
    impression: row.impression,
    instagram: row.instagram,
  };
}

export function mapMomentRow(row: any): Moment {
  return {
    id: row.id,
    title: row.title,
    image: row.image,
    date: row.date,
    tag: row.tag,
    story: row.story,
  };
}

export function mapVideoRow(row: any): VideoMoment {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    videoUrl: row.video_url,
    posterUrl: row.poster_url,
    duration: row.duration,
    date: row.date,
  };
}

export function mapGalleryRow(row: any): GraduationData['gallery'][number] {
  return { id: row.id, image: row.image, caption: row.caption };
}

export function mapGraduationInfo(row: any, graduates: string[], gallery: GraduationData['gallery']): GraduationData {
  return {
    mainBanner: row.main_banner,
    title: row.title,
    cohortName: row.cohort_name,
    date: row.date,
    location: row.location,
    description: row.description,
    graduates,
    gallery,
  };
}

import type { VisitorInfo } from '../types';

// Mendaftarkan pengunjung ke buku tamu dan mengambil token sesi.
// Gagal (offline / server error) bukan alasan memblokir pengunjung masuk.
export async function registerVisitor(info: VisitorInfo): Promise<string | null> {
  try {
    const res = await fetch('/api/visitor-log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: info.name,
        age: info.age,
        previousSchool: info.previousSchool,
        currentSchool: info.currentSchool,
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || typeof data?.token !== 'string') return null;
    return data.token as string;
  } catch {
    return null;
  }
}

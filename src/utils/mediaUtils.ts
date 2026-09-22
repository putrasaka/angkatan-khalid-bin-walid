/**
 * Utility functions for handling media upload (Images and Videos)
 * Converts files into optimized Data URLs (Base64) or Object URLs
 * to store safely in mock storage (LocalStorage) with live previews.
 */

export async function convertImageFileToBase64(
  file: File,
  maxDimension = 1200,
  quality = 0.75
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Scale down if image is very large to prevent LocalStorage quota overflow
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          // Fallback to original data URL if canvas 2d context fails
          resolve(readerEvent.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Compress as JPEG
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };

      img.onerror = () => {
        reject(new Error('Gagal memproses gambar. Pastikan format file valid.'));
      };

      img.src = readerEvent.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error('Gagal membaca file gambar.'));
    };

    reader.readAsDataURL(file);
  });
}

export async function convertVideoFileToUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    // If file is very small (< 4MB), we can store as Base64 DataURL
    if (file.size <= 4 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.onerror = () => {
        reject(new Error('Gagal membaca file video.'));
      };
      reader.readAsDataURL(file);
    } else {
      // For larger files, create an Object URL for current session preview
      const objectUrl = URL.createObjectURL(file);
      resolve(objectUrl);
    }
  });
}

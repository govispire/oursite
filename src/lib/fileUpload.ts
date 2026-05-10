// Lightweight file upload utilities.
// Files are stored as base64 data URLs in localStorage (size-capped).

export const MAX_VIDEO_BYTES = 10 * 1024 * 1024; // 10 MB
export const MAX_PDF_BYTES = 25 * 1024 * 1024; // 25 MB
export const MAX_IMAGE_BYTES = 2 * 1024 * 1024; // 2 MB

export const VIDEO_MIME = ['video/mp4', 'video/webm', 'video/ogg'];
export const PDF_MIME = ['application/pdf'];
export const IMAGE_MIME = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'];

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export interface ReadResult {
  dataUrl: string;
  size: number;
  type: string;
  name: string;
}

export function readFileAsDataUrl(
  file: File,
  opts: { maxBytes: number; allowedMimes?: string[] }
): Promise<ReadResult> {
  return new Promise((resolve, reject) => {
    if (opts.allowedMimes && opts.allowedMimes.length && !opts.allowedMimes.includes(file.type)) {
      reject(new Error(`Unsupported file type: ${file.type || 'unknown'}`));
      return;
    }
    if (file.size > opts.maxBytes) {
      reject(
        new Error(
          `File is ${formatBytes(file.size)} — exceeds the ${formatBytes(opts.maxBytes)} limit. Try uploading a smaller file or paste a URL instead.`
        )
      );
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read file.'));
    reader.onload = () =>
      resolve({
        dataUrl: String(reader.result),
        size: file.size,
        type: file.type,
        name: file.name,
      });
    reader.readAsDataURL(file);
  });
}

// ---------- URL helpers ----------

export function isValidUrl(value: string): boolean {
  try {
    const u = new URL(value);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

export interface VideoUrlMeta {
  source: 'youtube' | 'vimeo' | 'external';
  embedUrl: string;
  thumbnail?: string;
  videoId?: string;
}

export function detectVideoUrl(url: string): VideoUrlMeta | null {
  if (!isValidUrl(url)) return null;
  // YouTube
  const yt = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/
  );
  if (yt) {
    const id = yt[1];
    return {
      source: 'youtube',
      embedUrl: `https://www.youtube.com/embed/${id}`,
      thumbnail: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
      videoId: id,
    };
  }
  // Vimeo
  const vm = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vm) {
    return {
      source: 'vimeo',
      embedUrl: `https://player.vimeo.com/video/${vm[1]}`,
      videoId: vm[1],
    };
  }
  return { source: 'external', embedUrl: url };
}

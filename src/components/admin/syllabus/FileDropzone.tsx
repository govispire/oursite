import React, { useCallback, useRef, useState } from 'react';
import { Upload, Link as LinkIcon, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  readFileAsDataUrl,
  formatBytes,
  MAX_VIDEO_BYTES,
  MAX_PDF_BYTES,
  MAX_IMAGE_BYTES,
  VIDEO_MIME,
  PDF_MIME,
  IMAGE_MIME,
} from '@/lib/fileUpload';

type Kind = 'video' | 'pdf' | 'image';

const presets: Record<Kind, { mimes: string[]; max: number; accept: string; label: string }> = {
  video: { mimes: VIDEO_MIME, max: MAX_VIDEO_BYTES, accept: 'video/mp4,video/webm,video/ogg', label: 'video' },
  pdf: { mimes: PDF_MIME, max: MAX_PDF_BYTES, accept: 'application/pdf', label: 'PDF' },
  image: { mimes: IMAGE_MIME, max: MAX_IMAGE_BYTES, accept: 'image/*', label: 'image' },
};

interface Props {
  kind: Kind;
  value?: { dataUrl: string; size?: number; name?: string } | null;
  onChange: (value: { dataUrl: string; size: number; name: string } | null) => void;
}

export const FileDropzone: React.FC<Props> = ({ kind, value, onChange }) => {
  const cfg = presets[kind];
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);
      setBusy(true);
      try {
        const res = await readFileAsDataUrl(file, { maxBytes: cfg.max, allowedMimes: cfg.mimes });
        onChange({ dataUrl: res.dataUrl, size: res.size, name: res.name });
      } catch (e: any) {
        setError(e?.message || 'Failed to read file.');
      } finally {
        setBusy(false);
      }
    },
    [cfg, onChange]
  );

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const f = e.dataTransfer.files?.[0];
          if (f) handleFile(f);
        }}
        className={`relative flex flex-col items-center justify-center text-center px-4 py-6 rounded-lg border-2 border-dashed cursor-pointer transition-colors ${
          dragOver ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40'
        }`}
      >
        {busy ? (
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        ) : value ? (
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium truncate max-w-[200px]">{value.name || 'Uploaded file'}</span>
            {value.size ? <span className="text-muted-foreground">· {formatBytes(value.size)}</span> : null}
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={(e) => {
                e.stopPropagation();
                onChange(null);
                if (inputRef.current) inputRef.current.value = '';
              }}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        ) : (
          <>
            <Upload className="h-6 w-6 text-muted-foreground mb-1" />
            <p className="text-sm font-medium">Drop {cfg.label} here or click to upload</p>
            <p className="text-xs text-muted-foreground mt-0.5">Max {formatBytes(cfg.max)}</p>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={cfg.accept}
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
        />
      </div>
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
};

export default FileDropzone;

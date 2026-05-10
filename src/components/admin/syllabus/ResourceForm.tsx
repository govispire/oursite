import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, Link as LinkIcon, Upload as UploadIcon } from 'lucide-react';
import { detectVideoUrl, isValidUrl } from '@/lib/fileUpload';
import { FileDropzone } from './FileDropzone';
import type { VideoResource, PdfResource, TestResource } from '@/data/syllabusData';

type ResourceKind = 'videos' | 'pdfs' | 'tests';

interface Props {
  kind: ResourceKind;
  initial?: VideoResource | PdfResource | TestResource | null;
  onCancel: () => void;
  onSave: (resource: VideoResource | PdfResource | TestResource) => void;
}

export const ResourceForm: React.FC<Props> = ({ kind, initial, onCancel, onSave }) => {
  const [tab, setTab] = useState<'url' | 'upload'>(
    initial && (initial as any).url && !(initial as any).url.startsWith('data:') ? 'url' : 'upload'
  );

  // Common
  const [title, setTitle] = useState(initial?.title || '');
  const [description, setDescription] = useState((initial as any)?.description || '');
  const [url, setUrl] = useState((initial as any)?.url && !(initial as any).url.startsWith('data:') ? (initial as any).url : '');
  const [upload, setUpload] = useState<{ dataUrl: string; size: number; name: string } | null>(
    (initial as any)?.url?.startsWith?.('data:')
      ? { dataUrl: (initial as any).url, size: (initial as any).fileSize || 0, name: initial?.title || '' }
      : null
  );
  const [error, setError] = useState<string | null>(null);

  // Video-specific
  const v = initial as VideoResource | undefined;
  const [instructor, setInstructor] = useState(v?.instructor || 'Instructor');
  const [vDuration, setVDuration] = useState(v?.duration || '15 min');
  const [thumbnail, setThumbnail] = useState(v?.thumbnail || '');

  // PDF-specific
  const p = initial as PdfResource | undefined;
  const [pages, setPages] = useState(String(p?.pages || ''));
  const [pdfType, setPdfType] = useState<PdfResource['type']>(p?.type || 'notes');

  // Test-specific
  const t = initial as TestResource | undefined;
  const [questions, setQuestions] = useState(String(t?.questions || ''));
  const [tDuration, setTDuration] = useState(t?.duration || '30 min');
  const [difficulty, setDifficulty] = useState<TestResource['difficulty']>(t?.difficulty || 'medium');

  const submit = () => {
    setError(null);
    if (!title.trim()) {
      setError('Title is required.');
      return;
    }

    let resourceUrl = '';
    let detectedSource: VideoResource['source'] | undefined;
    let detectedThumb = thumbnail;

    if (tab === 'url') {
      if (kind !== 'tests' && !url) {
        setError('Please provide a URL or switch to Upload.');
        return;
      }
      if (url && !isValidUrl(url)) {
        setError('URL must start with http:// or https://');
        return;
      }
      resourceUrl = url;
      if (kind === 'videos' && url) {
        const meta = detectVideoUrl(url);
        if (meta) {
          detectedSource = meta.source;
          if (!detectedThumb && meta.thumbnail) detectedThumb = meta.thumbnail;
        }
      }
    } else {
      if (!upload) {
        setError(`Please upload a ${kind === 'videos' ? 'video' : 'PDF'} file.`);
        return;
      }
      resourceUrl = upload.dataUrl;
      detectedSource = 'upload';
    }

    const id = initial?.id || `${kind}-${Date.now()}`;
    if (kind === 'videos') {
      const res: VideoResource = {
        id,
        title: title.trim(),
        instructor,
        duration: vDuration,
        rating: v?.rating ?? 4.5,
        completed: v?.completed ?? false,
        url: resourceUrl,
        source: detectedSource || 'external',
        thumbnail: detectedThumb || undefined,
        description: description || undefined,
        uploadedAt: new Date().toISOString(),
      };
      onSave(res);
    } else if (kind === 'pdfs') {
      const res: PdfResource = {
        id,
        title: title.trim(),
        type: pdfType,
        pages: Number(pages) || p?.pages || 1,
        url: resourceUrl,
        fileSize: upload?.size || p?.fileSize,
        description: description || undefined,
        uploadedAt: new Date().toISOString(),
      };
      onSave(res);
    } else {
      const res: TestResource = {
        id,
        title: title.trim(),
        questions: Number(questions) || t?.questions || 10,
        duration: tDuration,
        difficulty,
        url: resourceUrl || undefined,
        description: description || undefined,
      };
      onSave(res);
    }
  };

  const showUploadTab = kind !== 'tests';

  return (
    <div className="space-y-3">
      <div>
        <Label>Title *</Label>
        <Input className="mt-1" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Resource title" />
      </div>

      {showUploadTab && (
        <Tabs value={tab} onValueChange={(v) => setTab(v as 'url' | 'upload')}>
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="upload" className="gap-1.5">
              <UploadIcon className="h-3.5 w-3.5" /> Upload File
            </TabsTrigger>
            <TabsTrigger value="url" className="gap-1.5">
              <LinkIcon className="h-3.5 w-3.5" /> Paste URL
            </TabsTrigger>
          </TabsList>
          <TabsContent value="upload" className="mt-3">
            <FileDropzone kind={kind === 'videos' ? 'video' : 'pdf'} value={upload} onChange={setUpload} />
          </TabsContent>
          <TabsContent value="url" className="mt-3 space-y-2">
            <Input
              placeholder={kind === 'videos' ? 'https://youtube.com/... or .mp4 link' : 'https://example.com/file.pdf'}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            {kind === 'videos' && url && detectVideoUrl(url) && (
              <p className="text-xs text-muted-foreground">
                Detected: {detectVideoUrl(url)?.source}
              </p>
            )}
          </TabsContent>
        </Tabs>
      )}

      {kind === 'tests' && (
        <div>
          <Label>Test URL (optional)</Label>
          <Input className="mt-1" placeholder="Link to test interface" value={url} onChange={(e) => setUrl(e.target.value)} />
        </div>
      )}

      {kind === 'videos' && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Instructor</Label>
            <Input className="mt-1" value={instructor} onChange={(e) => setInstructor(e.target.value)} />
          </div>
          <div>
            <Label>Duration</Label>
            <Input className="mt-1" value={vDuration} onChange={(e) => setVDuration(e.target.value)} placeholder="e.g. 15 min" />
          </div>
          <div className="col-span-2">
            <Label>Thumbnail URL (optional)</Label>
            <Input className="mt-1" value={thumbnail} onChange={(e) => setThumbnail(e.target.value)} placeholder="Auto-detected for YouTube" />
          </div>
        </div>
      )}

      {kind === 'pdfs' && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Pages</Label>
            <Input className="mt-1" type="number" value={pages} onChange={(e) => setPages(e.target.value)} />
          </div>
          <div>
            <Label>Type</Label>
            <Select value={pdfType} onValueChange={(v) => setPdfType(v as PdfResource['type'])}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="notes">Notes</SelectItem>
                <SelectItem value="pyq">PYQs</SelectItem>
                <SelectItem value="formulas">Formulas</SelectItem>
                <SelectItem value="summary">Summary</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {kind === 'tests' && (
        <div className="grid grid-cols-3 gap-3">
          <div>
            <Label>Questions</Label>
            <Input className="mt-1" type="number" value={questions} onChange={(e) => setQuestions(e.target.value)} />
          </div>
          <div>
            <Label>Duration</Label>
            <Input className="mt-1" value={tDuration} onChange={(e) => setTDuration(e.target.value)} />
          </div>
          <div>
            <Label>Difficulty</Label>
            <Select value={difficulty} onValueChange={(v) => setDifficulty(v as TestResource['difficulty'])}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      <div>
        <Label>Description (optional)</Label>
        <Textarea className="mt-1" rows={2} value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" size="sm" onClick={onCancel}>Cancel</Button>
        <Button size="sm" onClick={submit} className="gap-1.5"><Save className="h-3.5 w-3.5" /> Save</Button>
      </div>
    </div>
  );
};

export default ResourceForm;

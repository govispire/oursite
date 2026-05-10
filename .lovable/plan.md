# Manage Syllabus — Full Functionality Plan

You picked **localStorage** for persistence + **upload AND URL** for inputs. Since localStorage can't realistically hold large video/PDF files, the strategy is:

- **URLs (YouTube, Vimeo, Drive, any link)** → stored as plain strings, unlimited.
- **Direct file uploads** → stored as base64 data URLs in localStorage with a hard cap (default 10 MB per file; PDFs up to 25 MB). Files larger than the cap show a clear error and prompt the user to paste a URL instead.
- All syllabus mutations persist to `localStorage` immediately and reload on next visit. A "Reset to defaults" action restores the seed data.

> Heads-up: localStorage is per-browser and per-device. Other admins, students, or another browser will not see these edits. Switching to Lovable Cloud later would give true multi-user persistence and unlimited file storage — say the word and we'll migrate.

---

## 1. Persistence layer

Create `src/hooks/useSyllabusStore.ts`:
- Reads from `localStorage["prepsmart.syllabus.v1"]` on init (falls back to `allSyllabusData`).
- Writes on every change (debounced ~300 ms).
- Exposes typed mutators: `addExam`, `updateExam`, `deleteExam`, `addTier`, `updateTier`, `deleteTier`, `addSubject`, `updateSubject`, `deleteSubject`, `addTopic`, `updateTopic`, `deleteTopic`, `addResource`, `updateResource`, `deleteResource`, `reorderResource`.
- `resetToDefaults()` and `exportJSON()` / `importJSON()` for backup.
- A lightweight pub-sub (custom event `syllabus:changed`) so the **student-facing** Know Your Syllabus pages re-read the same store and reflect admin edits live.

## 2. Resource model — extended fields

Extend `src/data/syllabusData.ts` types (additive, optional, won't break existing UI):

- `VideoResource`: `url?: string`, `source?: 'youtube' | 'vimeo' | 'upload' | 'external'`, `thumbnail?: string`, `description?: string`, `uploadedAt?: string`
- `PdfResource`: `url?: string`, `fileSize?: number`, `description?: string`, `uploadedAt?: string`
- `TestResource`: `url?: string` (link to test interface), `description?: string`, `topics?: string[]`

## 3. File-upload utility

`src/lib/fileUpload.ts`:
- `readFileAsDataUrl(file, maxBytes)` → base64 string or rejection with friendly message.
- Validators: video MIME (`video/mp4`, `webm`, `ogg`), PDF MIME, max sizes.
- URL validator + helper to detect YouTube/Vimeo and auto-extract thumbnail + embed URL.

## 4. Resource editor dialog (rebuilt)

Replace the current `editResourceDialog` with `ResourceEditorDialog.tsx` (one component, three modes):

**Header:** title of topic + tab switcher (Videos / PDFs / Tests).

**Add/Edit form** with two input modes via toggle:
- **Upload file** — drag-and-drop zone + file picker, shows progress, preview thumbnail, size, validation errors.
- **Paste URL** — single input + auto-detect (YouTube/Vimeo embed preview, PDF link preview).

**Common fields per resource type:**
- Video: title, instructor, duration, rating, description, thumbnail (auto or upload).
- PDF: title, pages, type (notes / pyq / formulas / summary), description, file size.
- Test: title, questions, duration, difficulty, link to test, description.

**List of existing resources** with inline actions: Edit (opens form pre-filled), Delete (confirm), Drag handle to reorder, Preview (opens video/PDF in modal).

## 5. Inline edits everywhere

Currently only topic name and subject name/marks are editable. Add:
- **Exam**: edit dialog for full name, short name, category, stages, exam date, logo URL/upload.
- **Tier**: edit dialog for name, duration, total marks, negative marking, sectional cutoff.
- **Subject**: add icon picker + color picker (currently only name/marks).
- **Topic**: add description, weightage, expected questions count.
- **Reorder** subjects & topics via drag handles (use `@dnd-kit/sortable`, already installed in many Lovable projects — verify and add if missing).

## 6. Bulk upload

Wire the existing `bulkUploadDialog`:
- Upload a CSV (template downloadable) with columns: `subject, topic, resource_type, title, url_or_filename, duration, pages, questions, difficulty, instructor`.
- Parse with PapaParse (verify availability or add).
- Preview parsed rows in a table → confirm → batch insert.

## 7. Live student-side reflection

Update consumers that import `allSyllabusData` to read from `useSyllabusStore` instead, so edits show up immediately on:
- `src/pages/student/SyllabusPage.tsx`
- `src/components/student/exam/SyllabusTab.tsx`
- Any course/topic detail pages that hydrate from `syllabusData`.

(Admin local edits will only appear on the same browser — same persistence rule applies to students.)

## 8. Header utilities

Add to the page header:
- **Export JSON** (download current syllabus as backup).
- **Import JSON** (restore from backup).
- **Reset to defaults** (with confirm).
- A small "Saved locally" indicator with last-saved timestamp.

---

## Files to create
- `src/hooks/useSyllabusStore.ts`
- `src/lib/fileUpload.ts`
- `src/components/admin/syllabus/ResourceEditorDialog.tsx`
- `src/components/admin/syllabus/ResourceForm.tsx` (video/pdf/test variants)
- `src/components/admin/syllabus/EditExamDialog.tsx`
- `src/components/admin/syllabus/EditTierDialog.tsx`
- `src/components/admin/syllabus/BulkUploadDialog.tsx`
- `src/components/admin/syllabus/FileDropzone.tsx`

## Files to modify
- `src/data/syllabusData.ts` — extend types with optional `url`, `source`, `description`, etc.
- `src/pages/admin/ManageSyllabus.tsx` — swap local state for `useSyllabusStore`, wire new dialogs, add header utilities.
- `src/pages/student/SyllabusPage.tsx` and `src/components/student/exam/SyllabusTab.tsx` — read from the store.

## Out of scope
- Real cloud storage and multi-user sync (would require Lovable Cloud — happy to add later).
- Video transcoding or compression.

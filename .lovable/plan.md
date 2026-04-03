

# Dashboard + Admin Manage Syllabus Enhancement Plan

## Part 1: Dashboard — Target Exam Card White Theme

### Problem
The Target Examination card uses a dark navy gradient (`from-[hsl(215,50%,15%)]`) which the user wants changed to white/light.

### Solution
In `src/pages/student/StudentDashboard.tsx` (lines 204-280):
- Change card background from dark navy gradient to `bg-card` (white) with `border border-border/80`
- Change all text colors from `text-white`, `text-white/70`, `text-sky-300` to `text-foreground`, `text-muted-foreground`, `text-primary`
- Change info badges from `bg-white/10 border-white/10` to `bg-muted/50 border-border`
- Change progress bar backgrounds from `bg-white/10` to `bg-muted`
- Change Days Left box from `bg-white/10` to `bg-primary/5 border-primary/20`
- Change action buttons from `bg-white/15 text-white` to standard `variant="outline"` styling
- Remove the radial gradient overlay `div` (line 205)

## Part 2: Admin Manage Syllabus — Fully Functional CRUD

### Problem
Currently all dialogs (Add Exam, Add Tier, Add Subject, Add Topic, Edit/Delete resources) only open/close but don't actually modify state. Clicking Save does nothing. Edit/Delete buttons on resources are non-functional.

### Solution
In `src/pages/admin/ManageSyllabus.tsx`:

1. **Add local mutable state** — Deep clone `allSyllabusData` into a `useState` hook so all CRUD operations modify local state:
   ```tsx
   const [syllabusData, setSyllabusData] = useState(() => JSON.parse(JSON.stringify(allSyllabusData)));
   ```

2. **Add Exam Dialog** — Add form state (`newExamName`, `newExamCategory`, etc.), on Save: create new exam entry in `syllabusData`, select it, close dialog, show toast.

3. **Add Tier Dialog** — Add form state, on Save: push new tier into current exam's tiers array, select it.

4. **Add Subject Dialog** — Add form state, on Save: push new subject into current tier's subjects array.

5. **Add Topic Dialog** — Add form state, on Save: push new topic into the active subject's topics array (identified by `activeSubjectId`).

6. **Delete Topic** — Wire the Trash2 button in the topic table row to remove the topic from state with confirmation.

7. **Edit Topic** — Wire the Edit button to open a dialog pre-filled with topic name, allowing rename.

8. **Delete Subject** — Wire the Trash2 dropdown item to remove subject from state.

9. **Edit Subject** — Wire the Edit dropdown item to open a dialog for renaming.

10. **Resource Management (Videos/PDFs/Tests)**:
    - **Add Resource**: The "Add Video/PDF/Test" button in the resource dialog opens an inline form with title input (+ instructor/duration for videos, pages/type for PDFs, questions/duration/difficulty for tests). On save, push to the topic's resource array.
    - **Edit Resource**: Wire the Edit button on each resource card to toggle inline edit mode with pre-filled inputs.
    - **Delete Resource**: Wire the Trash2 button to remove the resource from the array with confirmation.

11. **Delete Exam** — Wire the "Delete Exam" dropdown menu item to remove exam from state.

12. **Toast notifications** — Import `useToast` and show success messages on each CRUD operation.

### Form State Structure
Add these states:
```tsx
const [newExamForm, setNewExamForm] = useState({ shortName: '', fullName: '', category: '', stages: '', examDate: '', logo: '' });
const [newTierForm, setNewTierForm] = useState({ name: '', duration: '', totalMarks: '', negativeMarking: '', sectionalCutoff: false });
const [newSubjectForm, setNewSubjectForm] = useState({ name: '', marks: '', iconBg: 'bg-blue-50' });
const [newTopicForm, setNewTopicForm] = useState({ name: '', description: '' });
const [addResourceForm, setAddResourceForm] = useState({ title: '', instructor: '', duration: '', pages: '', type: '', questions: '', difficulty: '' });
const [editingResourceId, setEditingResourceId] = useState<string | null>(null);
```

## Files Modified
1. `src/pages/student/StudentDashboard.tsx` — Target Exam card white theme
2. `src/pages/admin/ManageSyllabus.tsx` — Full CRUD functionality with local state management




# Dashboard Enhancement Plan

## Changes to `src/pages/student/StudentDashboard.tsx`

### 1. Replace Welcome Banner with Target Examination Card
Replace the current green gradient welcome banner with a dark blue gradient "Target Examination" card matching the reference:
- Dark gradient background (`from-[#1a237e] via-[#283593] to-[#1565c0]`) with subtle radial pulse pattern
- Exam name prominently displayed (e.g., "SBI CLERK" from user's selected exams)
- Subtitle: "Preliminary Examination · 13,735 Vacancies"
- Info badges row: Notification date, Location, Duration/Marks, Day of prep
- "Days Left" counter badge in top-right corner (large number + "Days Left" label)
- Overall Preparation Progress bar with percentage
- Section-wise Readiness: 4 horizontal bars (Quantitative, Reasoning, English, Gen. Awareness) with distinct colors and percentages
- Action buttons: "Start Full Mock Test", "View Syllabus", "Score Prediction"

### 2. Add Recent Mock Test Performance Section
New card after the charts section, styled like reference image-31:
- Left-accented header with blue dot: "Recent Mock Test Performance" + "View All" link
- Clean table with columns: TEST, SCORE (green), ACCURACY, DATE, RANK (indigo)
- 4 mock test rows with mock data
- Green improvement badge at bottom: "↑ +7 marks improvement over last 3 tests"

### 3. Add Strict Study Mode Widget
New card in the right sidebar (desktop) and mobile bottom section:
- Red dot indicator + "Strict Study Mode" header
- Two stat boxes: "LAST SESSION" (time) and "FOCUS SCORE" (percentage in green)
- "Next Planned Session" row with time
- Red "Start Strict Mode (25 min)" button with lock icon
- When activated: full-screen dark overlay with large countdown timer, current task label, progress bar (red→green gradient), Pause and End Session buttons
- State managed with `useState` for `isStrictModeActive`, `strictTimeLeft`, timer via `useEffect`+`setInterval`

### 4. Color Consistency Fix
- Primary color from CSS is `200 98% 39%` (blue). Ensure all cards use `hsl(var(--primary))` instead of hardcoded colors
- Target exam card uses a deeper navy gradient that complements the primary blue
- Remove any leftover teal/green references that don't match the actual theme

## Files Modified
1. `src/pages/student/StudentDashboard.tsx` - All changes in this single file

## Technical Notes
- Strict mode timer uses `ReturnType<typeof setInterval>` per project constraint
- Mock test data is hardcoded as a const array (no new files needed)
- Full-screen overlay uses `fixed inset-0 z-50` with dark background
- All recharts components remain unchanged


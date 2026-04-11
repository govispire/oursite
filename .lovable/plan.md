

# Student Dashboard Redesign — Tab-Based Focus Layout

## Concept
Replace the current long-scroll dashboard with a **tab-based single-focus layout**. The Target Exam card stays at the top, followed by 4 tabs: **Overview, Practice, Performance, Resources**. Each tab shows only its relevant content, reducing cognitive overload.

## Current vs New Structure

```text
CURRENT (scroll-heavy):             NEW (tab-focused):
┌─────────────────────────┐         ┌──────────────────────────┐
│ Target Exam Card        │         │ Target Exam Card         │
│ Search Bar              │         │  + circular progress     │
│ 4 Stat Cards            │         │  + donut charts per subj │
│ Current Exam Status     │         │  + Days Left (green box) │
│ Upcoming Exams          │         │  + Action buttons        │
│ Performance Graph       │         ├──────────────────────────┤
│ Study Status Donut      │         │ [Overview][Practice]     │
│ Mock Test Table         │         │ [Performance][Resources] │
│ My Courses              │         ├──────────────────────────┤
│ Notifications           │         │ Tab content only         │
│ Current Affairs         │         │ (one section at a time)  │
│ ... (sidebar widgets)   │         └──────────────────────────┘
└─────────────────────────┘
```

## Tab Content Breakdown

### Overview Tab
- 5 stat cards (Journey Days, Study Hours, Active Streak, Tests Done, Today's Tasks) in a row
- Today's Goals section (add goal, view history)
- Study Timer widget (duration picker: 30m, 1hr, 1.5hr, 2hr)
- Current Exam Status (existing)

### Practice Tab
- Daily Free Tests card (list of 5 tests with questions/duration/difficulty + "Start Test" buttons)
- Upcoming Live Tests section (with "Live" badge, register button)
- Speed Drills quick-access

### Performance Tab
- Performance Graph (weekly average scores line chart — full width)
- Exam Percentile gauge (semi-circle gauge showing percentile)
- Strong/Weak subjects breakdown
- Recent Mock Test table

### Resources Tab
- Featured Courses horizontal carousel with course cards (image, title, instructor, badge, rating, price)
- Upcoming Exams grid (existing)
- Recent Exam Notifications (existing)

## Target Exam Card Enhancements
- Add **circular donut charts** for each subject (Quantitative, Reasoning, English, Gen. Awareness) showing percentage, replacing the linear progress bars
- Add a large **overall circular progress** (64% style) on the right side
- Keep the green "Days Left" box but make it more prominent with larger font
- Add exam metadata: date, duration, marks inline

## Key Changes in `StudentDashboard.tsx`
1. Add `activeTab` state (`'overview' | 'practice' | 'performance' | 'resources'`)
2. Replace the two-column layout with a single full-width column under tabs
3. Move sidebar widgets (Top Performers, Weekly Activity, Word of the Day, Strict Mode) into relevant tabs or remove from default view
4. Replace section-readiness linear bars with circular donut mini-charts using Recharts `PieChart`
5. Add Today's Goals section with add/history buttons
6. Add Study Timer with duration picker buttons
7. Add Daily Free Tests list in Practice tab
8. Add Exam Percentile gauge in Performance tab
9. Add Featured Courses carousel in Resources tab
10. Remove the search bar (content is now organized by tabs)
11. Remove the right sidebar entirely — all content lives in tabs

## Files Modified
1. `src/pages/student/StudentDashboard.tsx` — Complete restructure with tab-based layout


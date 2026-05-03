# Test Analysis Page Redesign

Redesign the Test Analysis modal to exactly match the reference image (clean white-card layout, green primary accent matching the project's teal-green theme #20c996, professional sans-serif typography), enhanced with consistent color tokens and interactivity.

## Reference Layout (from uploaded image)

```text
[← Test Analysis]                  [Review Test] [View Solutions] [Weakness Map]

┌─ Test Header Card ────────────────────────────────────────────────┐
│ [icon]  IBPS PO Prelims 2024 (Mock Test 12)                       │
│         Full Syllabus Mock Test                                   │
│         [English] • [Quantitative] • [Reasoning]                  │
│         📅 12 May 2024  🕐 10AM-11AM  ⏱ 60 Minutes                 │
└───────────────────────────────────────────────────────────────────┘

[Overview] Section Wise | Subject Wise | Question Wise | Time | Compare
─────────

┌ Score ┐ ┌ Percentile ┐ ┌ Accuracy ┐ ┌ Rank ┐ ┌ Improvement ┐
│ 70/100│ │ 87.45      │ │ 76.32%   │ │12,612│ │ +18.6%      │
│ Good  │ │ top 12.55% │ │ 229/300  │ │/1.25L│ │ better      │
└───────┘ └────────────┘ └──────────┘ └──────┘ └─────────────┘

┌─ Section Wise Performance ────────────────────────────────────────┐
│ Section | Attempted | Correct/Wrong | Skipped | Score | Rank |...│
│ Reasoning   30   28/2   5   28/35   15   92%   93.3%  ⏱45m       │
│ ...                                                                │
│ [■ Correct] [■ Wrong] [■ Skipped]                                 │
└───────────────────────────────────────────────────────────────────┘

┌ Performance Overview (Line Chart) ┐ ┌ Question Summary (Donut) ┐
│ Your / Average / Topper × Mock1-12│ │  300 Total                │
│                                    │ │  ● Correct 229            │
│ "Improved 18.6% vs last test"     │ │  ● Incorrect 56           │
└────────────────────────────────────┘ │  ● Unattempted 15         │
                                       │  [View All Questions]     │
                                       └───────────────────────────┘

┌ Time Analysis (table) ────────────┐ ┌ Leaderboard Top 10 ────────┐
│ Section | Spent | Ideal | Δ | Acc │ │ Rank | Name | Score | %ile │
│ ...                                │ │ 🥇 1 Aarav 92/100 99.45%   │
│ [info]: spent more time...         │ │ ...                         │
└────────────────────────────────────┘ │ 12,612 You 70/100 87.45%   │
                                       └────────────────────────────┘
```

## Implementation

### 1. Convert modal → full-screen route page
- Create new route `/student/test-analysis/:testId` rendering `TestAnalysisPage.tsx`.
- Update `TestAnalysisModal` triggers in `EnhancedTestTypeGrid.tsx` and `TestTypeGrid.tsx` to navigate to the new page (keep modal as fallback).
- Add route in `src/routes/StudentRoutes.tsx`.

### 2. New file: `src/pages/student/TestAnalysisPage.tsx`
Layout sections:
1. **Top bar** — back arrow + "Test Analysis" title + 3 outline action buttons (Review Test [filled green], View Solutions, Weakness Map) using `lucide-react` icons (FileText, BookOpen, Target).
2. **Test header card** — green clipboard icon tile, test name (bold, 24px), subtitle, subject pills (small rounded badges in light gray), meta row with calendar/clock/timer icons.
3. **Section tabs** — underline-style tabs (Overview active = green underline + green text). Built with shadcn `Tabs` overridden for underline variant.
4. **5 KPI cards** — white cards with thin border, label + small icon top-right, large number (Score green, Percentile blue, Accuracy green, Rank black, Improvement green), small caption pill underneath.
5. **Section Wise Performance table** — clean table with section icons, color-coded correct/wrong (green/red), score, rank, percentile, accuracy, time with clock icon. Legend chips below.
6. **Performance Overview** (Recharts LineChart) — Your Score (green), Average Score (gray dashed), Topper Score (blue). Mock1–Mock12 X axis. Last point labeled "70" in green pill. Footer note in light-green banner.
7. **Question Summary** (Recharts donut) — 300 Total center label, color legend (green/red/amber), "View All Questions" outline button.
8. **Time Analysis table** — section, time spent, ideal, +/-difference (red), accuracy bar.
9. **Leaderboard Top 10** — ranked list with medal icons (gold/silver/bronze) for top 3, "You (Your Rank)" highlighted row at bottom in light green.

### 3. New components in `src/components/student/test-analysis/`
- `TestHeaderCard.tsx`
- `KpiCard.tsx` (variants: green, blue, neutral)
- `SectionPerformanceTable.tsx`
- `PerformanceOverviewChart.tsx`
- `QuestionSummaryDonut.tsx`
- `TimeAnalysisTable.tsx`
- `LeaderboardCard.tsx`
- `AnalysisTabs.tsx` (underline tabs)

All use existing shadcn primitives (Card, Table, Badge, Button, Tabs) + Recharts.

### 4. Color & typography consistency
- Primary green: `hsl(var(--primary))` — already #20c996 teal-green per memory. Map all "green" accents to primary token (no hardcoded hex).
- Red: `text-destructive` / `hsl(var(--destructive))`.
- Blue: define `--accent-blue` in `index.css` for "topper" / percentile accents.
- Text: keep system Inter font already in use; weights 400/500/600/700 only.
- Card style: `rounded-xl border border-border bg-card shadow-sm`.

### 5. Data
- Reuse `TestAnalysisData` from `src/data/testAnalysisData.ts`. Add fallback mock for `improvement`, `leaderboard`, `idealTimePerSection` if missing (extend interface with optional fields + provide defaults).
- Add a `getTestAnalysis(testId)` lookup that returns the mock IBPS PO data when no match.

### 6. Other tabs (Section / Subject / Question / Time / Compare)
- Implement Section Wise & Subject Wise as filtered views of the same table.
- Question Wise: grid of numbered question chips colored by status (existing pattern).
- Time Analysis: extends the time table with per-question stats.
- Compare: reuse existing `ComparativeInsightsTab`.

### 7. Responsive
- Desktop: 2-column grid for chart + donut, table + leaderboard.
- Mobile: stacks vertically per memory constraint (no desktop alteration).

## Files to create
- `src/pages/student/TestAnalysisPage.tsx`
- `src/components/student/test-analysis/` (8 components above)

## Files to edit
- `src/routes/StudentRoutes.tsx` (add route)
- `src/components/student/exam/EnhancedTestTypeGrid.tsx` and `TestTypeGrid.tsx` (navigate instead of/in addition to opening modal)
- `src/data/testAnalysisData.ts` (extend with optional `improvement`, `leaderboard`, `idealTime` fields + sample data)
- `src/index.css` (add `--accent-blue` token if needed)

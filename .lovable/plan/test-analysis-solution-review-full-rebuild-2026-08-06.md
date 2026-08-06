# Test Analysis + Solution Review — Full Rebuild

Two connected surfaces, one shared component library:

1. **Analysis** — 5-tab diagnostic dashboard, rendered both as a full-screen modal (after submitting a test) and as the full page at `/student/test-analysis/:testId`.
2. **Solutions** — a dedicated question-by-question review environment at `/student/test-solutions/:testId`.

All features from the spec are implemented. The visual design is my own senior-level system rather than a copy of the reference — see Design Direction.

## Design Direction

Keep the platform's teal-green primary and navy secondary, but treat this as a serious *report* surface, not a colorful dashboard.

- **Surface**: near-white canvas, pure-white elevated cards, one hairline border, generous 24–32px rhythm. No gradients-on-gradients, no colored card backgrounds except semantic state chips.
- **Data color is meaning only**: teal = correct/strong, coral-red = wrong/critical, amber = borderline/moderate, slate = skipped. A single hue never appears decoratively.
- **Typography**: one family, tabular numerals for every metric, tight uppercase micro-labels, big confident numbers. Score/rank read instantly from across the room.
- **Hero bar**: a single horizontal metric strip (Score, Rank, Percentile, Accuracy, Attempted) with thin progress rails under each — replaces the 4 gradient boxes.
- **Charts**: flat, gridline-light, one accent per series, custom tooltips. Gauges and donuts drawn with clean SVG arcs.
- **Motion**: 200ms count-ups on hero numbers, staggered card fade-in, chart draw-in. Nothing bouncy.
- **Mobile**: hero strip becomes a 2-col grid, tabs scroll horizontally with icons, tables become stacked rows, palette becomes a bottom drawer.

## Part 1 — Analysis (5 tabs)

Shared header: test name, exam-type badge (Full / Live / Speed / Sectional / Prelims / Mains / PYQ), Solutions button, Review button, close/back. Then the hero metric strip.

- **Overview** — quick stat pills (attempted, negative marks, net score, accuracy), section-wise performance table (attempted, correct/wrong, skipped, score, sectional rank & percentile, accuracy, time) with a bold totals row, question-summary donut, section time-vs-ideal comparison with ±minute flags, and a key-takeaway insight box.
- **Score Trend** — metric toggle (score / rank / accuracy), range filter (last 5 / 10 / 15), smooth area-line chart with milestone markers, and an improving / stable / declining verdict with average delta.
- **Exam Readiness** — 270° SVG gauge with three zones, readiness snapshot (score vs cutoff, gap ±marks), and an exam-aware sectional cutoff table marking each section Safe / Borderline / Below.
- **You vs Topper** — head-to-head hero cards (you vs rank #1), quick metrics (beat %, accuracy gap, time gap, score gap), subject-wise dual bars, actionable "score X more in Y" recommendations, and a top-5 podium.
- **Weakness Predictor** — four strength category cards (Strong 80%+, Moderate 60–79%, Weak 40–59%, Critical <40%/unattempted), full syllabus topic breakdown with accuracy, correct/total and avg time per question, plus subject / strength / keyword filters.

## Part 2 — Solution Page

- Header with test title, section name, review-mode badge, close.
- Section switcher, freely navigable.
- **Adaptive layout**: single panel for standalone questions; dual panel (passage/DI chart left, question right) for set-based questions.
- Language selector (English / Hindi), color-coded options — teal for correct, red for your wrong pick, neutral otherwise.
- **Stat chip bar**: status, difficulty, your time vs avg, marks earned, global accuracy %, speed tag (Superfast / On Time / Slow).
- **Explanation block**: step-by-step solution, key-points box, shortcut tip box.
- **Action tools**: bookmark, add to Mistake Notebook, report issue, discuss.
- **Right palette**: status shapes, All / Correct / Incorrect / Skipped filters, section grouping, collapsible.
- **Bottom nav**: Previous, "Jump to First Incorrect", Next.

Bookmarks, mistake-notebook entries, active tab, filter and last-viewed question all persist in local storage.

## Technical Notes

- Data layer: extend `src/data/testAnalysisData.ts` with a deterministic per-`testId` generator (seeded so a test always yields the same numbers) covering sections, topics, per-question detail, history, topper, leaderboard and cutoffs. A new `src/data/solutionsData.ts` supplies question bodies, passages/DI sets, options, explanations, shortcuts, difficulty, timings and global accuracy — mirroring your existing exam mock data shape.
- New components under `src/components/student/analysis/`: `AnalysisHeader`, `HeroMetricStrip`, `OverviewTab`, `ScoreTrendTab`, `ExamReadinessTab`, `YouVsTopperTab`, `WeaknessPredictorTab`, plus `ReadinessGauge`, `PodiumTop5`, `SectionTable`.
- `TestAnalysisModal.tsx` and `TestAnalysisPage.tsx` both become thin shells around a shared `TestAnalysisView` so the modal and the route can never drift.
- New `src/pages/student/TestSolutions.tsx` with components under `src/components/student/solutions/` (`SolutionQuestionPanel`, `SolutionStatBar`, `ExplanationBlock`, `SolutionPalette`, `SetPassagePanel`).
- Routes added to `StudentRoutes.tsx`, reusing the existing ownership/role guard already applied to the analysis route.
- No backend changes; all data stays local mock + local storage.

# Test Analysis Page — Visual Redesign

Content stays exactly as it is. Only the presentation layer changes: cleaner surfaces, better typography, calmer color use, more breathing room.

## Visual direction

- **Palette:** Cloud White — page `#fafbfc`, panels white, hairlines `#e8ecf1`, secondary text `#94a3b8`, single accent blue `#3b82f6`. Success / warning / danger reserved strictly for data states (correct, pace, wrong), never for decoration.
- **Typography:** Sora for headings and large numerals, Manrope for body and labels. All figures use tabular numerals so columns align.
- **Structure:** Full-width stacked bands with generous vertical rhythm — one idea per band, no boxed-card-inside-boxed-card nesting.

## What changes on the page

1. **Header band** — test name set large in Sora, meta line (type, exam family, date) as one quiet row, Solutions / Review actions right-aligned with the primary action in accent blue.
2. **Result band** — replaces the cramped 5-cell strip. The headline score reads as a statement (score, out of max) with rank, percentile, accuracy and attempted as supporting figures on a single hairline-divided row. One thin progress rail per figure instead of chunky bars.
3. **Tabs** — flat underline tabs on a hairline rule (sliding underline), replacing the filled pill row. Sticks to the top on scroll.
4. **Section-wise performance** — ruled table on white: no inner borders, hairline row dividers, right-aligned numerics, accuracy shown as a thin inline rail plus percentage, overall row separated by a heavier rule.
5. **Question summary + time analysis** — two side-by-side panels on desktop, stacked on mobile. Thinner donut stroke with centered total; legend as a clean list, not filled chips. Time bars become a you-vs-ideal track with a marker for the ideal split and the delta in the semantic color.
6. **Key takeaway** — a quiet accent-tinted band with a short heading and the sentence, plus a single action button.
7. **Other four tabs** (Score Trend, Exam Readiness, You vs Topper, Weakness Predictor) — receive the same token, panel, spacing and chart-color treatment so the whole report is consistent.

Mobile (375px): bands stack, the metric row becomes a two-column grid, tables scroll horizontally with the section name pinned, tab labels shorten.

## Technical notes

- Add Sora + Manrope via `index.html`, wire them as `font-heading` / `font-sans` in `tailwind.config.ts`.
- Retune existing semantic tokens in `src/index.css` (`--surface`, `--surface-muted`, `--border`, `--muted-foreground`, and the success/warning/danger/gold set) toward the Cloud White palette. No hardcoded color classes in components.
- Rework the shared primitives (`Panel`, `StatPill`, `Rail`, `MicroLabel`) in `src/components/student/analysis/primitives.tsx` — most of the visual lift lands here and propagates to every tab.
- Update `AnalysisHeader.tsx`, `HeroMetricStrip.tsx`, `TestAnalysisView.tsx` (tab bar), `OverviewTab.tsx`, plus spacing/color passes on `ScoreTrendTab`, `ExamReadinessTab`, `YouVsTopperTab`, `WeaknessPredictorTab`.
- No data, routing, or logic changes; `analysisEngine.ts` is untouched. The modal at `TestAnalysisModal.tsx` inherits the redesign automatically.
- Verify at 1280px and 375px with screenshots after the change.

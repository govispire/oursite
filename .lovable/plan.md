
# Student Courses Page Redesign — Marketplace-Grade UX

## Goal
Transform `/student/courses` from a long, flat list into a discovery → retention → conversion funnel that mirrors top edtech marketplaces.

## New Page Structure (top → bottom)

```text
1. DISCOVERY HEADER          → category + search + streak/notifications
2. EXAM FILTER BAR           → SBI Clerk · IBPS PO · SSC CGL · RRB NTPC ...
3. ADVANCED FILTERS          → Level · Language · Price · Duration · Sort
4. MY ENROLLED COURSES       → progress bar + Continue CTA  (retention)
5. FREE TEST CTA STRIP       → "Not sure? Take a free test → get a recommendation"
6. RECOMMENDED FOR YOU       → AI-style reasoning chips ("Because you're weak in Quant")
7. COURSE CARDS GRID         → conversion-optimized cards w/ urgency + smart tags
8. PREPARATION ROADMAP       → keep (compact)
9. TRUST + VALUE STRIP       → instructors · students · success rate · tests · support
```

The current "Smart Preparation Banner", "Daily Practice Zone", "Exam Stage Tabs", "Exam Countdown" are kept but reordered/condensed so the page feels lighter.

---

## Section-by-section changes

### 1. Discovery header (new compact bar)
Replace the giant gradient banner with a tighter header row:
- Left: greeting + streak badge (`🔥 12-day streak`) + notifications bell
- Right: global search (existing)
- Below: category selector (existing)

The big "Prepare for SBI PO" banner becomes a single-line strip with countdown chip on the right.

### 2. Exam filter bar (horizontal pills)
Current grid of exam cards → horizontal scrollable pill bar:
`[All] [SBI Clerk] [IBPS PO] [SSC CGL] [RRB NTPC] [UPSC CSE] ...`
Active pill = primary fill. Reduces vertical space drastically.

### 3. Advanced filter system (NEW)
Sticky filter row with 5 dropdowns/pills:
- **Level** — Beginner · Intermediate · Advanced
- **Language** — English · Hindi · Tamil · Malayalam · Telugu · Kannada
- **Price** — Free · <₹999 · ₹1k–3k · ₹3k+
- **Duration** — <1 month · 1–3 mo · 3–6 mo · 6 mo+
- **Sort** — Popular · Newest · Price ↑ · Price ↓ · Rating

Implemented client-side filtering against `globalFilteredCourses`.

### 4. My Enrolled Courses (promoted to top)
Currently buried as "Continue Learning". Promote it:
- Title: "📚 My Enrolled Courses · Continue where you left off"
- Horizontal scroll, larger cards with progress bar + bold "Continue" CTA
- Show only if user has progress > 0; otherwise hide section

### 5. Free Test CTA strip (NEW — critical)
A high-contrast banner card placed *just above* "Recommended For You":
- Headline: "Not sure where to start?"
- Sub: "Take a 10-min free diagnostic test and get a personalized course recommendation"
- CTA: "Take Free Test →" (links to `/student/diagnostic-tests`)
- Visual: gradient primary background, target icon

### 6. Recommended For You (with reasoning)
Each recommended card gets a "Why?" chip above the title:
- "Because you're weak in Quant"
- "Based on your last test"
- "Most picked by SBI PO aspirants"

For now, reasoning is mock/string-mapped per course id.

### 7. Course cards — conversion upgrades
Extend `MinimalistCourseCard` with:
- **Smart tags** (replace generic "Trending"): `Bestseller`, `Beginner Friendly`, `High Scoring`, `Most Selected`
- **Urgency triggers** (small text under price):
  - `🔥 120 enrolled this week`
  - `⏰ Offer ends in 2h 14m` (when discount > 0)
- Keep existing: thumbnail, type badge, rating, students, duration, price+discount, Preview + Enroll CTAs

### 8. Trust + Value strip (NEW — bottom)
5-column horizontal strip just before page end:
`👨‍🏫 500+ Expert Instructors  |  👥 50K+ Students  |  🏆 98% Success Rate  |  📝 10K+ Tests  |  💬 24/7 Support`
Cards with subtle border, primary-tinted icons. Builds trust → conversion.

---

## Files Modified / Created

**Modified**
- `src/pages/student/StudentCourses.tsx` — reorder sections, add filter state, free-test CTA, trust strip, recommendation reasoning, exam pill bar
- `src/components/student/courses/MinimalistCourseCard.tsx` — add `smartTag`, `urgencyText`, `reason` optional props; render badges/strip

**Created**
- `src/components/student/courses/CourseFiltersBar.tsx` — Level/Language/Price/Duration/Sort controls
- `src/components/student/courses/FreeTestCTA.tsx` — diagnostic CTA banner
- `src/components/student/courses/TrustValueStrip.tsx` — 5-stat trust strip
- `src/components/student/courses/EnrolledCoursesRail.tsx` — horizontal "Continue learning" rail

## Technical Notes
- All filtering done client-side via `useMemo` over `globalFilteredCourses`
- Smart tags + urgency derived deterministically from `course.id` hash so they stay stable per render (no real backend yet)
- Color palette stays on existing teal-green primary / navy secondary (per `mem://design/primary-color-theme`)
- Mobile: filter bar collapses into a single "Filters" button opening a Sheet; exam pills horizontally scroll; trust strip becomes 2-col grid
- No new dependencies needed (uses existing shadcn `Select`, `Sheet`, `ScrollArea`, `Badge`)

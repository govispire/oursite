

# Smart Mentorship Pipeline — Implementation Plan

## Scope
Build a complete mentorship onboarding + auto-matching + monitoring system across Student, Mentor, and Superadmin roles. All data stored client-side using localStorage (no backend yet) so the flow is fully demoable.

---

## Part 1: Extended Student Onboarding (`/student/exam-categories`)

Extend the existing `ExamCategorySelection` page into a multi-step wizard:

```text
Step 1: Exam Category    →  Banking / SSC / Railway / UPSC / TNPSC / NEET / Insurance
Step 2: Target Exam      →  SBI Clerk / IBPS PO / SSC CGL / RRB NTPC ...
Step 3: Stage            →  Prelims / Mains / Interview / Overall
Step 4: Subjects         →  English / Quant / Reasoning / GA  (+ Interview for Mains)
Step 5: Language         →  English / Hindi / Tamil / Malayalam / Kannada / Telugu
Step 6: Learning Style   →  Strict / Balanced / Flexible
Step 7: Confirm Profile  →  Summary card with edit buttons
Step 8: Matching Loader  →  Animated "finding mentor" screen
Step 9: Mentor Assigned  →  Success card with mentor details + CTAs
```

**New file**: `src/pages/student/MentorshipOnboarding.tsx` (multi-step wizard)
**New hook**: `src/hooks/useMentorshipOnboarding.ts` (saves to localStorage)
**New data**: `src/data/mentorPoolData.ts` (~15 mock mentors with language/stage/capacity)

---

## Part 2: Auto Mentor Matching Engine

**New file**: `src/lib/mentorMatching.ts`

Matching priority:
1. Same preferred language
2. Same stage expertise (Prelims/Mains/Interview/Overall)
3. Same exam category
4. Mentor capacity < 20 students
5. Highest rating

Fallback: language → stage → overall → manual queue.

Stores assignment in `localStorage` key `mentorAssignment` and increments mentor's student count.

---

## Part 3: 5-Test Diagnostic Flow

After mentor assignment, redirect to `/student/diagnostic-tests`.

**New file**: `src/pages/student/DiagnosticTests.tsx`

Shows 5 test cards generated dynamically based on stage + subjects:
- For Prelims: English / Quant / Reasoning / GA / Mini Mock
- For Mains: Deep English / Advanced Quant / Reasoning / GA / Full Mock

After completion → diagnostic result page with strong/weak/average breakdown using existing `Recharts`.

**New file**: `src/pages/student/DiagnosticResults.tsx`

---

## Part 4: Student Mentorship Dashboard Updates

Update `src/pages/student/MentorshipDashboard.tsx` to show:
- Assigned mentor card (name, photo, expertise, language, capacity)
- Today's tasks (predefined + mentor-added)
- Diagnostic profile (weak/strong areas)
- Chat shortcut
- Leaderboard rank
- Review mentor button

**New components**:
- `src/components/student/mentorship/AssignedMentorCard.tsx`
- `src/components/student/mentorship/DailyTaskList.tsx`
- `src/components/student/mentorship/MentorChat.tsx`
- `src/components/student/mentorship/MentorReviewDialog.tsx`

---

## Part 5: Mentor Dashboard

Update `src/pages/mentor/MentorDashboard.tsx` and related pages with:

**Tab-based layout**:
- **Overview**: Total students, today's completion %, pending messages, alerts
- **Students**: Filterable list (language/stage/score/activity) with student detail drill-down
- **Tasks**: Task assignment builder (templates + custom + batch)
- **Chat**: Inbox with 1:1 + batch messaging + pinned messages
- **Analytics**: Test performance trends, weak-area heatmap per student
- **Leaderboard**: Task completion, mock scores, streaks, discipline panel

**New components**:
- `src/components/mentor/StudentListPanel.tsx`
- `src/components/mentor/StudentDetailDrawer.tsx`
- `src/components/mentor/TaskBuilderDialog.tsx`
- `src/components/mentor/MentorChatPanel.tsx`
- `src/components/mentor/TestAnalyticsPanel.tsx`
- `src/components/mentor/MentorLeaderboard.tsx`

---

## Part 6: Superadmin Mentor Pipeline

Update `src/pages/superadmin/SuperAdminDashboard.tsx` and add new pages:

- `src/pages/superadmin/MentorManagement.tsx` — create/approve mentors, assign language/stage tags, capacity control
- `src/pages/superadmin/AllocationDashboard.tsx` — live allocation: available students, available mentors, overloaded mentors, manual reassignment
- `src/pages/superadmin/MentorPerformance.tsx` — mentor ratings, response time, student success %, engagement
- `src/pages/superadmin/MentorReviews.tsx` — student reviews + flags

Add routes to `src/routes/SuperAdminRoutes.tsx`.

---

## Part 7: Shared State + Data

**New context**: `src/contexts/MentorshipContext.tsx` — single source of truth for:
- Onboarding profile
- Assigned mentor
- Tasks (predefined + mentor-added)
- Messages thread
- Diagnostic results
- Reviews

All persisted to localStorage so refresh keeps state.

**New data files**:
- `src/data/mentorPoolData.ts` — 15 mentors
- `src/data/diagnosticTestBank.ts` — test sets per exam/stage
- `src/data/predefinedTasks.ts` — daily task templates per exam

---

## Part 8: Routes

Add to `StudentRoutes.tsx`:
- `/student/mentorship-onboarding`
- `/student/diagnostic-tests`
- `/student/diagnostic-results`
- `/student/mentor-chat`

Add to `MentorRoutes.tsx`:
- Refined dashboard tabs (already exist as separate pages — consolidate)

Add to `SuperAdminRoutes.tsx`:
- `/super-admin/mentor-management`
- `/super-admin/allocation`
- `/super-admin/mentor-performance`
- `/super-admin/mentor-reviews`

---

## Files Summary

**New (17)**:
- 1 context, 1 hook, 1 matching lib
- 4 student pages (onboarding wizard, diagnostic tests, results, chat)
- 4 student components (mentor card, tasks, chat, review)
- 6 mentor components (list, detail, task builder, chat, analytics, leaderboard)
- 4 superadmin pages (management, allocation, performance, reviews)
- 3 data files (mentors, diagnostic bank, predefined tasks)

**Modified (5)**:
- `StudentRoutes.tsx`, `MentorRoutes.tsx`, `SuperAdminRoutes.tsx`
- `MentorshipDashboard.tsx`, `MentorDashboard.tsx`

---

## Notes
- Backend not enabled — using localStorage. When ready to scale, this should migrate to Lovable Cloud (Supabase) with proper tables for mentors, assignments, tasks, messages, reviews, and an RLS-protected `user_roles` table.
- Chat is simulated (no realtime) until backend is enabled.
- Build proceeds in this order: Onboarding → Matching → Diagnostic → Student Dashboard → Mentor Dashboard → Superadmin.


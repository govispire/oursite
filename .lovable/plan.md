

# Team Study Verification + Dashboard Redesign Plan

## Part 1: Team Study Page Fixes
After reviewing all team study components, the code structure looks solid. Minor responsive tweaks needed:
- Ensure hero header stacks properly on mobile (flex-col on small screens)
- Verify chat toggle button doesn't overlap content on mobile

## Part 2: Dashboard Redesign (Reference Image Style)

Redesign `StudentDashboard.tsx` to match the reference images' card-based aesthetic while keeping our existing content.

### Design Changes

**Stat Cards (4 cards row)**
- Each card gets a distinct pastel background color (sky-blue, lavender, mint-green, peach) like the reference
- Circular gradient icon container on the left side
- Bold value + label layout matching reference spacing
- Subtle shadow, rounded-2xl corners

**Performance Graph Card**
- Styled like "Goal Completion" in reference: clean area/line chart with tooltip
- Add a subtle gradient fill under the line
- Card title with left accent bar (like `| Goal Completion` in reference)

**New "Study Status" Donut Card** (replaces or sits beside performance graph)
- Adapts "Order Status" from reference → shows test completion ratio (Passed/Pending/Failed) as a donut chart
- Uses recharts PieChart with center label showing ratio

**Daily Vocabulary Card**
- Redesigned to match "Customer Reviews" card style from reference
- Left accent bar title, star-rating replaced with word difficulty indicator
- Synonym bars styled like the rating breakdown bars (Excellent/Good/Average)

**Bottom Row (new section)**
- "Top Performers" table card (like "Top Seller") showing mock leaderboard with avatar, name, score
- "Weekly Activity" chart (like "Website Visitors") showing study hours per day
- "Recent Activity" feed (like "Task Last Month") showing recent test completions

### Files Modified
1. `src/pages/student/StudentDashboard.tsx` - Complete redesign with new layout, colored stat cards, donut chart, bottom row sections
2. Minor mobile responsiveness fixes in `src/pages/student/TeamStudy.tsx`

### Technical Notes
- Uses existing recharts for PieChart (donut) and AreaChart
- Pastel card colors via Tailwind bg classes (bg-sky-50, bg-violet-50, bg-emerald-50, bg-orange-50)
- Left accent bars using `border-l-4 border-primary` pattern from reference
- No new dependencies needed


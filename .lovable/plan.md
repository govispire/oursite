

# Dashboard Layout Changes

## Changes Overview

### 1. Target Exam Card — Full Width (no sidebar column)
Current layout: `flex-col lg:flex-row` with a 72px sidebar. Change the outer wrapper so the Target Exam card spans the entire width above the two-column layout. Move from the current single `flex-row` structure to:
- Full-width Target Exam card + search bar at top
- Then the `flex-row` layout for remaining content + sidebar

### 2. Add Search Bar
Add a search input below the Target Exam card (or integrated into it), with a `Search` icon, placeholder "Search tests, courses, topics...", spanning full width or partial width.

### 3. Category Selector — Add Dropdown Chevron
In `CategorySelector.tsx`, add `ChevronDown` icon after the display text in the `DialogTrigger` button to indicate it's a dropdown/selector.

### 4. Increase Outer Border of Main Sections
Add visible borders to the main content cards using `border border-border` or `border-2 border-border/60` to make section boundaries more prominent. Currently cards use `border-0` or default thin borders — increase to `border border-border/80` with slightly more shadow.

### 5. Strict Study Mode — Verify & Fix
The overlay code already exists and looks correct. Ensure the `startStrictMode` function properly resets state. No code changes needed unless there's a bug (the logic is already implemented).

## Files Modified
1. **`src/pages/student/StudentDashboard.tsx`** — Restructure layout: pull Target Exam card and search bar out of the flex-row, make them full-width. Add search bar. Increase card borders.
2. **`src/components/global/CategorySelector.tsx`** — Add `ChevronDown` icon to the trigger button.

## Technical Details
- Layout restructure: wrap Target Exam + search bar in a full-width container before the `flex lg:flex-row` wrapper
- Search bar: simple `<input>` with `Search` icon, state `searchQuery` (cosmetic for now)
- Card borders: change from `border-0`/`border-none` to `border border-border/60` on major section cards
- CategorySelector: import `ChevronDown` from lucide-react, add after `getDisplayText()` span


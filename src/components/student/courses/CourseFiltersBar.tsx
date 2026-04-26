import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { SlidersHorizontal, X } from 'lucide-react';

export type CourseFilters = {
  level: string;
  language: string;
  price: string;
  duration: string;
  sort: string;
};

export const DEFAULT_FILTERS: CourseFilters = {
  level: 'all',
  language: 'all',
  price: 'all',
  duration: 'all',
  sort: 'popular',
};

interface Props {
  filters: CourseFilters;
  onChange: (next: CourseFilters) => void;
  resultCount: number;
}

const OPTIONS = {
  level: [
    { v: 'all', l: 'All Levels' },
    { v: 'beginner', l: 'Beginner' },
    { v: 'intermediate', l: 'Intermediate' },
    { v: 'advanced', l: 'Advanced' },
  ],
  language: [
    { v: 'all', l: 'All Languages' },
    { v: 'english', l: 'English' },
    { v: 'hindi', l: 'Hindi' },
    { v: 'tamil', l: 'Tamil' },
    { v: 'malayalam', l: 'Malayalam' },
    { v: 'telugu', l: 'Telugu' },
    { v: 'kannada', l: 'Kannada' },
  ],
  price: [
    { v: 'all', l: 'Any Price' },
    { v: 'free', l: 'Free' },
    { v: 'under999', l: 'Under ₹999' },
    { v: '1k-3k', l: '₹1,000 – ₹3,000' },
    { v: '3kplus', l: '₹3,000+' },
  ],
  duration: [
    { v: 'all', l: 'Any Duration' },
    { v: 'short', l: 'Under 1 month' },
    { v: 'medium', l: '1 – 3 months' },
    { v: 'long', l: '3 – 6 months' },
    { v: 'xlong', l: '6+ months' },
  ],
  sort: [
    { v: 'popular', l: 'Most Popular' },
    { v: 'newest', l: 'Newest' },
    { v: 'price-asc', l: 'Price: Low to High' },
    { v: 'price-desc', l: 'Price: High to Low' },
    { v: 'rating', l: 'Top Rated' },
  ],
};

const FilterSelect: React.FC<{
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  options: { v: string; l: string }[];
}> = ({ value, onChange, placeholder, options }) => (
  <Select value={value} onValueChange={onChange}>
    <SelectTrigger className="h-9 text-xs bg-card border-border min-w-[130px]">
      <SelectValue placeholder={placeholder} />
    </SelectTrigger>
    <SelectContent>
      {options.map(o => (
        <SelectItem key={o.v} value={o.v} className="text-xs">{o.l}</SelectItem>
      ))}
    </SelectContent>
  </Select>
);

export const CourseFiltersBar: React.FC<Props> = ({ filters, onChange, resultCount }) => {
  const update = (key: keyof CourseFilters) => (v: string) => onChange({ ...filters, [key]: v });
  const activeCount = (Object.keys(filters) as (keyof CourseFilters)[]).filter(
    k => k !== 'sort' && filters[k] !== 'all'
  ).length;

  const controls = (
    <>
      <FilterSelect value={filters.level} onChange={update('level')} placeholder="Level" options={OPTIONS.level} />
      <FilterSelect value={filters.language} onChange={update('language')} placeholder="Language" options={OPTIONS.language} />
      <FilterSelect value={filters.price} onChange={update('price')} placeholder="Price" options={OPTIONS.price} />
      <FilterSelect value={filters.duration} onChange={update('duration')} placeholder="Duration" options={OPTIONS.duration} />
      <FilterSelect value={filters.sort} onChange={update('sort')} placeholder="Sort" options={OPTIONS.sort} />
    </>
  );

  return (
    <div className="flex items-center justify-between gap-3 flex-wrap">
      <div className="hidden md:flex items-center gap-2 flex-wrap">
        {controls}
        {activeCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="h-9 text-xs text-muted-foreground"
            onClick={() => onChange({ ...DEFAULT_FILTERS, sort: filters.sort })}
          >
            <X className="h-3 w-3 mr-1" /> Clear
          </Button>
        )}
      </div>

      {/* Mobile sheet */}
      <div className="md:hidden flex items-center gap-2 w-full">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="h-9 text-xs flex-1">
              <SlidersHorizontal className="h-3.5 w-3.5 mr-2" />
              Filters {activeCount > 0 && `(${activeCount})`}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[70vh]">
            <SheetHeader>
              <SheetTitle>Filter & Sort</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-3 mt-4">{controls}</div>
            {activeCount > 0 && (
              <Button
                variant="ghost"
                className="mt-4 w-full text-muted-foreground"
                onClick={() => onChange({ ...DEFAULT_FILTERS, sort: filters.sort })}
              >
                <X className="h-4 w-4 mr-1" /> Clear all filters
              </Button>
            )}
          </SheetContent>
        </Sheet>
      </div>

      <p className="text-xs text-muted-foreground whitespace-nowrap">
        {resultCount} {resultCount === 1 ? 'course' : 'courses'}
      </p>
    </div>
  );
};

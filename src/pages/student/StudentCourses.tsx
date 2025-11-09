
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { InstructorCard } from '@/components/student/courses/InstructorCard';
import { CourseCard } from '@/components/student/courses/CourseCard';
import { CourseNavigation } from '@/components/student/courses/CourseNavigation';
import { CategorySelector } from '@/components/global/CategorySelector';
import { courseCategories, instructors } from '@/data/courseData';
import { useCategoryFilteredCourses } from '@/hooks/useCategoryFilteredContent';
import { Filter, BookOpen } from 'lucide-react';

const StudentCourses = () => {
  const { category } = useParams();
  const [selectedCategory, setSelectedCategory] = useState(category || 'all');
  const { courses: globalFilteredCourses, hasFilters, selectedCategories } = useCategoryFilteredCourses();
  
  // Filter courses by selected category if not showing global filter
  const finalCourses = hasFilters 
    ? globalFilteredCourses 
    : selectedCategory === 'all' 
      ? [] // We'll show a message to select categories
      : globalFilteredCourses.filter(course => course.categoryId === selectedCategory);
  
  const getCategoryName = () => {
    if (hasFilters) {
      return `Filtered Courses (${selectedCategories.length} categories)`;
    }
    const cat = courseCategories.find(c => c.id === selectedCategory);
    return cat ? cat.name : 'All Courses';
  };
  
  return (
    <div className="space-y-6">
      <CourseNavigation 
        items={[
          { label: 'Courses', href: '/student/courses' },
          { label: getCategoryName(), isActive: true }
        ]}
      />

      {/* Global Category Filter */}
      <div className="flex flex-col sm:flex-row gap-4 items-start">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">Course Library</h1>
          <p className="text-gray-600 mt-1">
            {hasFilters 
              ? `Showing courses for your selected categories`
              : 'Select your exam categories to see relevant courses'
            }
          </p>
        </div>
        <CategorySelector />
      </div>

      {/* Category Filter Banner */}
      {hasFilters && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-foreground">Filtered Results</h3>
                <p className="text-sm text-muted-foreground">
                  Showing courses for: {selectedCategories.join(', ')}
                </p>
              </div>
              <Badge variant="secondary" className="bg-primary/10 text-primary border border-primary/20">
                {finalCourses.length} courses
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Category Navigation - Only show if no global filter is active */}
      {!hasFilters && (
        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex overflow-x-auto pb-2 gap-2">
            {courseCategories.map((cat) => (
              <Button 
                key={cat.id} 
                variant={selectedCategory === cat.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(cat.id)}
                className="whitespace-nowrap"
              >
                {cat.name}
              </Button>
            ))}
          </div>
        </div>
      )}
      
      {/* Expert Instructors Section */}
      <div className="space-y-3">
        <h2 className="text-xl font-bold text-gray-800 text-center py-3">
          Meet Our Expert Instructors
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {instructors.map((instructor) => (
            <InstructorCard key={instructor.id} instructor={instructor} />
          ))}
        </div>
      </div>
      
      {/* Course Listings */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">
            {getCategoryName()}
          </h2>
          <span className="text-sm text-gray-600">
            {finalCourses.length} courses available
          </span>
        </div>
        
        {/* Course Grid */}
        {finalCourses.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {hasFilters ? 'No courses found' : 'Select Your Categories'}
              </h3>
              <p className="text-gray-600 mb-4">
                {hasFilters 
                  ? 'No courses match your selected categories. Try selecting different categories.'
                  : 'Please select your exam categories using the Category Selector above to see relevant courses.'
                }
              </p>
              {!hasFilters && (
                <div className="flex justify-center">
                  <CategorySelector />
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {finalCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentCourses;

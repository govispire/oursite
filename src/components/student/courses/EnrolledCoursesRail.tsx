import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Play, BookMarked, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface EnrolledCourse {
  id: string;
  title: string;
  instructor: string;
  thumbnail: string;
  progress?: number;
  chaptersCount: number;
  videosCount: number;
}

interface Props {
  courses: EnrolledCourse[];
}

export const EnrolledCoursesRail: React.FC<Props> = ({ courses }) => {
  const navigate = useNavigate();
  if (!courses.length) return null;

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold flex items-center gap-2 text-foreground">
          <BookMarked className="h-5 w-5 text-primary" />
          My Enrolled Courses
        </h2>
        <Button variant="ghost" size="sm" className="text-xs text-primary">
          View All <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
      <p className="text-xs text-muted-foreground mb-3">Continue where you left off</p>

      <ScrollArea className="w-full">
        <div className="flex gap-4 pb-4">
          {courses.map(course => {
            const progress = course.progress ?? 0;
            const completedChapters = Math.round((progress / 100) * course.chaptersCount);

            return (
              <Card
                key={course.id}
                className="w-[300px] flex-shrink-0 overflow-hidden hover:shadow-md transition-all border border-border group cursor-pointer"
                onClick={() => navigate(`/student/courses/${course.id}`)}
              >
                <div className="flex gap-3 p-3">
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="w-9 h-9 rounded-full bg-primary-foreground/95 flex items-center justify-center">
                        <Play className="h-4 w-4 text-primary fill-primary ml-0.5" />
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col">
                    <h4 className="font-semibold text-sm line-clamp-2 text-foreground group-hover:text-primary transition-colors">
                      {course.title}
                    </h4>
                    <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
                      {course.instructor}
                    </p>
                    <div className="mt-auto">
                      <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
                        <span>{completedChapters}/{course.chaptersCount} chapters</span>
                        <span className="font-semibold text-primary">{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-1.5" />
                    </div>
                  </div>
                </div>
                <Button
                  className="w-full rounded-none h-9 text-xs bg-primary/10 text-primary hover:bg-primary/20 border-t border-border"
                  variant="ghost"
                >
                  <Play className="h-3 w-3 mr-1.5" />
                  Continue Learning
                </Button>
              </Card>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </section>
  );
};

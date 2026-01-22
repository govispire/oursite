import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';
import { Star, Users, Clock, Play, BookOpen, TrendingUp, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MinimalistCourseCardProps {
  course: {
    id: string;
    title: string;
    instructor: string;
    thumbnail: string;
    rating: number;
    studentsCount: number;
    price: number;
    originalPrice?: number;
    duration: string;
    chaptersCount: number;
    videosCount: number;
    type: string;
    isTrending?: boolean;
    progress?: number;
    subjects?: string[];
  };
  variant?: 'default' | 'compact' | 'featured';
}

export const MinimalistCourseCard: React.FC<MinimalistCourseCardProps> = ({ 
  course, 
  variant = 'default' 
}) => {
  const hasProgress = course.progress && course.progress > 0;
  const discount = course.originalPrice 
    ? Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100) 
    : 0;

  if (variant === 'compact') {
    return (
      <Link to={`/student/courses/${course.id}`}>
        <Card className="group p-3 hover:shadow-md transition-all duration-200 hover:border-primary/30">
          <div className="flex gap-3">
            <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
              <img 
                src={course.thumbnail} 
                alt={course.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {hasProgress && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="text-white text-xs font-bold">{course.progress}%</div>
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm line-clamp-2 text-foreground group-hover:text-primary transition-colors">
                {course.title}
              </h4>
              <p className="text-xs text-muted-foreground mt-1">{course.instructor}</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center text-yellow-500">
                  <Star className="h-3 w-3 fill-current" />
                  <span className="text-xs ml-0.5 text-foreground">{course.rating}</span>
                </div>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground">{course.duration}</span>
              </div>
            </div>
            
            <div className="text-right flex-shrink-0">
              <div className="font-bold text-primary">₹{course.price.toLocaleString()}</div>
              {course.originalPrice && (
                <div className="text-[10px] text-muted-foreground line-through">
                  ₹{course.originalPrice.toLocaleString()}
                </div>
              )}
            </div>
          </div>
        </Card>
      </Link>
    );
  }

  return (
    <Link to={`/student/courses/${course.id}`}>
      <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden bg-muted">
          <img 
            src={course.thumbnail} 
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          
          {/* Overlay badges */}
          <div className="absolute top-2 left-2 flex gap-1.5">
            <Badge className="bg-black/70 text-white text-[10px] backdrop-blur-sm">
              {course.type}
            </Badge>
            {course.isTrending && (
              <Badge className="bg-orange-500 text-white text-[10px]">
                <TrendingUp className="h-2.5 w-2.5 mr-0.5" />
                Trending
              </Badge>
            )}
          </div>
          
          {discount > 0 && (
            <Badge className="absolute top-2 right-2 bg-red-500 text-white text-[10px]">
              {discount}% OFF
            </Badge>
          )}
          
          {/* Progress overlay */}
          {hasProgress && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
              <div className="flex items-center justify-between text-white text-xs mb-1">
                <span>{course.progress}% Complete</span>
                <span>{course.chaptersCount} chapters</span>
              </div>
              <Progress value={course.progress} className="h-1.5 bg-white/30" />
            </div>
          )}
          
          {/* Play button overlay */}
          {!hasProgress && (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
              <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                <Play className="h-5 w-5 text-primary fill-primary ml-0.5" />
              </div>
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-semibold text-sm line-clamp-2 text-foreground group-hover:text-primary transition-colors">
            {course.title}
          </h3>
          
          <p className="text-xs text-muted-foreground mt-1.5">By {course.instructor}</p>
          
          {/* Stats row */}
          <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
              <span className="font-medium text-foreground">{course.rating}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              <span>{(course.studentsCount / 1000).toFixed(1)}k</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span>{course.duration}</span>
            </div>
          </div>
          
          {/* Content info */}
          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
            <BookOpen className="h-3 w-3" />
            <span>{course.chaptersCount} Chapters • {course.videosCount} Videos</span>
          </div>
          
          {/* Subjects */}
          {course.subjects && course.subjects.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {course.subjects.slice(0, 3).map((subject, idx) => (
                <span key={idx} className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                  {subject}
                </span>
              ))}
              {course.subjects.length > 3 && (
                <span className="text-[10px] text-muted-foreground">+{course.subjects.length - 3}</span>
              )}
            </div>
          )}
          
          {/* Pricing and CTA */}
          <div className="mt-auto pt-4 flex items-center justify-between border-t border-border/50">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-bold text-primary">₹{course.price.toLocaleString()}</span>
                {course.originalPrice && (
                  <span className="text-xs text-muted-foreground line-through">
                    ₹{course.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
            </div>
            
            <Button 
              size="sm" 
              className={cn(
                "text-xs",
                hasProgress ? "bg-primary/10 text-primary hover:bg-primary/20" : ""
              )}
              variant={hasProgress ? "outline" : "default"}
            >
              {hasProgress ? (
                <>
                  <Play className="h-3 w-3 mr-1" />
                  Continue
                </>
              ) : (
                'Start Now'
              )}
            </Button>
          </div>
        </div>
      </Card>
    </Link>
  );
};

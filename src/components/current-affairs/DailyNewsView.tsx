import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, BookOpen, ChevronRight } from 'lucide-react';
import { allArticles } from './articlesData';
import { useReadingProgress } from '@/hooks/useReadingProgress';

const DailyNewsView = () => {
  const navigate = useNavigate();
  const { getReadingProgress } = useReadingProgress();

  // Group articles by date
  const articlesByDate = allArticles.reduce((acc, article) => {
    const date = article.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(article);
    return acc;
  }, {} as Record<string, typeof allArticles>);

  // Sort dates in descending order (newest first)
  const dates = Object.keys(articlesByDate).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime();
  });

  const handleViewDay = (date: string) => {
    navigate(`/current-affairs/date/${encodeURIComponent(date)}`);
  };

  // Get unique topics for a date
  const getTopicsForDate = (date: string) => {
    const topics = new Set(articlesByDate[date].map(a => a.topic));
    return Array.from(topics);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dates.map(date => {
          const articles = articlesByDate[date];
          const topics = getTopicsForDate(date);
          const readCount = articles.filter(a => getReadingProgress(a.id) >= 100).length;
          const highPriorityCount = articles.filter(a => a.importance === 'high').length;
          
          // Get a preview image from the first article with an image
          const previewImage = articles.find(a => a.image)?.image;
          
          return (
            <Card 
              key={date} 
              className="overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
              onClick={() => handleViewDay(date)}
            >
              {/* Thumbnail Header */}
              <div className="relative h-32 bg-gradient-to-br from-primary/20 to-primary/5">
                {previewImage ? (
                  <img 
                    src={previewImage} 
                    alt={date}
                    className="w-full h-full object-cover opacity-60"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Calendar className="h-12 w-12 text-primary/40" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span className="font-semibold text-foreground">{date}</span>
                  </div>
                </div>
                {readCount === articles.length && (
                  <Badge className="absolute top-2 right-2 bg-green-500">
                    All Read
                  </Badge>
                )}
              </div>

              <CardContent className="p-4">
                {/* Stats */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <BookOpen className="h-4 w-4" />
                    <span>{articles.length} articles</span>
                  </div>
                  {readCount > 0 && (
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      {readCount}/{articles.length} read
                    </Badge>
                  )}
                </div>

                {/* Topics Preview */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {topics.slice(0, 3).map(topic => (
                    <Badge key={topic} variant="secondary" className="text-xs">
                      {topic}
                    </Badge>
                  ))}
                  {topics.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{topics.length - 3} more
                    </Badge>
                  )}
                </div>

                {/* Priority Indicator */}
                {highPriorityCount > 0 && (
                  <div className="flex items-center gap-1 mb-3">
                    <Badge variant="destructive" className="text-xs">
                      {highPriorityCount} High Priority
                    </Badge>
                  </div>
                )}

                {/* Articles Preview */}
                <div className="space-y-1 mb-3">
                  {articles.slice(0, 2).map(article => (
                    <p key={article.id} className="text-xs text-muted-foreground truncate">
                      • {article.title}
                    </p>
                  ))}
                  {articles.length > 2 && (
                    <p className="text-xs text-primary">
                      +{articles.length - 2} more articles
                    </p>
                  )}
                </div>

                {/* View Button */}
                <Button 
                  className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                  variant="outline"
                  size="sm"
                >
                  View All News
                  <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {dates.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Daily News</h3>
            <p className="text-muted-foreground">
              No daily news articles available at the moment.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DailyNewsView;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, BookOpen, ChevronRight, Download, Eye, Share2, Bookmark, CheckCircle2 } from 'lucide-react';
import { allArticles } from './articlesData';
import { useReadingProgress } from '@/hooks/useReadingProgress';
import { generateDailyNewsPDF } from '@/utils/pdfGenerator';

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

  const handleViewArticle = (articleId: string) => {
    navigate(`/current-affairs/${articleId}`);
  };

  const handleDownloadPDF = (date: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const dateArticles = articlesByDate[date];
    generateDailyNewsPDF(dateArticles, date);
  };

  return (
    <div className="space-y-8">
      {dates.map(date => {
        const articles = articlesByDate[date];
        
        return (
          <div key={date} className="space-y-4">
            {/* Date Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">{date}</h2>
                  <p className="text-sm text-muted-foreground">{articles.length} articles</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2"
                onClick={(e) => handleDownloadPDF(date, e)}
              >
                <Download className="h-4 w-4" />
                Download PDF
              </Button>
            </div>

            {/* Articles Grid - Thumbnails View */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => {
                const progress = getReadingProgress(article.id);
                const isRead = progress >= 100;
                
                return (
                  <Card 
                    key={article.id} 
                    className={`overflow-hidden hover:shadow-lg transition-all cursor-pointer group ${
                      isRead ? 'ring-2 ring-green-500/20' : ''
                    }`}
                    onClick={() => handleViewArticle(article.id)}
                  >
                    {/* Thumbnail Image */}
                    <div className="relative h-44 overflow-hidden">
                      <img 
                        src={article.image} 
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      
                      {/* Badges on Image */}
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <Badge 
                          variant={article.importance === 'high' ? 'destructive' : 'secondary'}
                          className="text-xs"
                        >
                          {article.importance === 'high' ? 'High Priority' : article.category}
                        </Badge>
                      </div>
                      
                      {isRead && (
                        <Badge className="absolute top-3 right-3 bg-green-500 gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Read
                        </Badge>
                      )}

                      {article.hasQuiz && (
                        <Badge 
                          variant="outline" 
                          className="absolute bottom-3 left-3 bg-background/80 backdrop-blur-sm text-xs"
                        >
                          Quiz: {article.quizQuestions} Qs
                        </Badge>
                      )}
                    </div>

                    <CardContent className="p-4">
                      {/* Title */}
                      <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {article.title}
                      </h3>

                      {/* Excerpt */}
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {article.excerpt}
                      </p>

                      {/* Meta Info */}
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {article.readTime}
                          </span>
                          <span className="flex items-center gap-1">
                            <BookOpen className="h-3 w-3" />
                            {article.topic}
                          </span>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {article.tags.slice(0, 3).map((tag, i) => (
                          <span key={i} className="text-xs text-primary font-medium">
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-3 border-t">
                        <Button variant="ghost" size="sm" className="gap-1 text-xs h-8 px-2">
                          <Eye className="h-3 w-3" />
                          Read
                        </Button>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Share2 className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Bookmark className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        );
      })}

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

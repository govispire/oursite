import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Download, Share2, Bookmark, Clock, CheckCircle2, BookOpen } from 'lucide-react';
import { allArticles, getAllTopics } from './articlesData';
import { useReadingProgress } from '@/hooks/useReadingProgress';
import { generateTopicPDF } from '@/utils/pdfGenerator';

const AllInOneView = () => {
  const navigate = useNavigate();
  const { getReadingProgress } = useReadingProgress();

  // Group articles by topic
  const articlesByTopic = allArticles.reduce((acc, article) => {
    if (!acc[article.topic]) {
      acc[article.topic] = [];
    }
    acc[article.topic].push(article);
    return acc;
  }, {} as Record<string, typeof allArticles>);

  const topics = getAllTopics();

  const handleReadAll = (topic: string) => {
    navigate(`/current-affairs/topic/${encodeURIComponent(topic)}`);
  };

  const handleDownloadPDF = (topic: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const topicArticles = articlesByTopic[topic];
    generateTopicPDF(topicArticles, topic);
  };

  const handleViewArticle = (articleId: string) => {
    navigate(`/current-affairs/${articleId}`);
  };

  return (
    <div className="space-y-8">
      {topics.map(topic => {
        const articles = articlesByTopic[topic];
        const readCount = articles.filter(a => getReadingProgress(a.id) >= 100).length;
        
        return (
          <Card key={topic} className="border-l-4 border-l-primary overflow-hidden">
            <CardHeader className="pb-4 bg-muted/30">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {topic}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">{articles.length} articles</Badge>
                      {readCount > 0 && (
                        <Badge variant="outline" className="text-xs text-green-600 border-green-600">
                          {readCount}/{articles.length} read
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    size="sm" 
                    onClick={() => handleReadAll(topic)}
                    className="gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    Read All
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-2"
                    onClick={(e) => handleDownloadPDF(topic, e)}
                  >
                    <Download className="h-4 w-4" />
                    PDF
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              {/* Thumbnails Grid View */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {articles.map((article) => {
                  const progress = getReadingProgress(article.id);
                  const isRead = progress >= 100;
                  
                  return (
                    <div 
                      key={article.id}
                      className={`group rounded-lg border overflow-hidden cursor-pointer hover:shadow-md transition-all ${
                        isRead ? 'ring-2 ring-green-500/20' : ''
                      }`}
                      onClick={() => handleViewArticle(article.id)}
                    >
                      {/* Thumbnail */}
                      <div className="relative h-32 overflow-hidden">
                        <img 
                          src={article.image} 
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        
                        {/* Priority Badge */}
                        <Badge 
                          variant={article.importance === 'high' ? 'destructive' : 'secondary'}
                          className="absolute top-2 left-2 text-xs"
                        >
                          {article.importance === 'high' ? 'High' : article.importance === 'medium' ? 'Medium' : 'Low'}
                        </Badge>

                        {isRead && (
                          <div className="absolute top-2 right-2">
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          </div>
                        )}

                        {article.hasQuiz && (
                          <Badge 
                            variant="outline" 
                            className="absolute bottom-2 left-2 bg-background/80 backdrop-blur-sm text-xs"
                          >
                            Quiz
                          </Badge>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-3">
                        <h4 className="font-medium text-sm text-foreground line-clamp-2 group-hover:text-primary transition-colors mb-2">
                          {article.title}
                        </h4>
                        
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {article.readTime}
                          </span>
                          <div className="flex items-center gap-1">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Share2 className="h-3 w-3" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Bookmark className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default AllInOneView;
